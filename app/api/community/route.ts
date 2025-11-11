import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { getPresignedUrl } from '@/lib/s3';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      token = request.cookies.get('token')?.value || request.cookies.get('auth_token')?.value;
    }
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get current user's verification status
    const currentUserResult = await query(
      'SELECT is_verified FROM users WHERE id = $1',
      [payload.userId]
    );
    const currentUserIsVerified = currentUserResult.rows[0]?.is_verified || false;

    // Get search and filter params
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || '';
    const skillFilter = searchParams.get('skills') || '';
    const locationFilter = searchParams.get('location') || '';
    const educationFilter = searchParams.get('education') || '';
    const workFilter = searchParams.get('work') || '';
    
    // Pagination params
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    // Base query to fetch all alumni with their current experience and skills
    let sql = `
      SELECT 
        u.id,
        u.email,
        u.is_verified,
        p.name,
        p.profile_picture_url,
        p.phone,
        p.about,
        -- Get current experience (where is_present = true)
        (SELECT json_build_object(
          'designation', e.designation,
          'company_name', e.company_name,
          'industry', e.industry,
          'location_city', e.location_city,
          'location_state', e.location_state,
          'location_country', e.location_country
        )
        FROM experiences e
        WHERE e.user_id = u.id AND e.is_present = true
        ORDER BY e.start_date DESC
        LIMIT 1) as current_experience,
        -- Get all skills as array
        (SELECT json_agg(s.name)
        FROM user_skills us
        JOIN skills s ON s.id = us.skill_id
        WHERE us.user_id = u.id) as skills,
        -- Get education courses as array
        (SELECT array_agg(DISTINCT ec.course)
        FROM education_certificates ec
        WHERE ec.user_id = u.id AND ec.course IS NOT NULL) as courses
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.is_active = true AND u.role != 'admin'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Add search filter
    if (searchQuery) {
      sql += ` AND (
        LOWER(p.name) LIKE LOWER($${paramIndex})
        OR LOWER(u.email) LIKE LOWER($${paramIndex})
        OR LOWER(p.phone) LIKE LOWER($${paramIndex})
        OR EXISTS (
          SELECT 1 FROM experiences e
          WHERE e.user_id = u.id
          AND LOWER(e.designation) LIKE LOWER($${paramIndex})
        )
      )`;
      params.push(`%${searchQuery}%`);
      paramIndex++;
    }

    // Add skill filter
    if (skillFilter) {
      sql += ` AND EXISTS (
        SELECT 1 FROM user_skills us
        JOIN skills s ON s.id = us.skill_id
        WHERE us.user_id = u.id
        AND LOWER(s.name) LIKE LOWER($${paramIndex})
      )`;
      params.push(`%${skillFilter}%`);
      paramIndex++;
    }

    // Add location filter
    if (locationFilter) {
      sql += ` AND EXISTS (
        SELECT 1 FROM experiences e
        WHERE e.user_id = u.id
        AND (
          LOWER(e.location_city) LIKE LOWER($${paramIndex})
          OR LOWER(e.location_state) LIKE LOWER($${paramIndex})
          OR LOWER(e.location_country) LIKE LOWER($${paramIndex})
        )
      )`;
      params.push(`%${locationFilter}%`);
      paramIndex++;
    }

    // Add education filter (searches course, school, degree)
    if (educationFilter) {
      sql += ` AND EXISTS (
        SELECT 1 FROM education_certificates ec
        WHERE ec.user_id = u.id
        AND (
          LOWER(ec.course) LIKE LOWER($${paramIndex})
          OR LOWER(ec.school) LIKE LOWER($${paramIndex})
          OR LOWER(ec.degree_or_certificate_name) LIKE LOWER($${paramIndex})
        )
      )`;
      params.push(`%${educationFilter}%`);
      paramIndex++;
    }

    // Add work filter (searches designation, company, industry, description)
    if (workFilter) {
      sql += ` AND EXISTS (
        SELECT 1 FROM experiences e
        WHERE e.user_id = u.id
        AND (
          LOWER(e.designation) LIKE LOWER($${paramIndex})
          OR LOWER(e.company_name) LIKE LOWER($${paramIndex})
          OR LOWER(e.industry) LIKE LOWER($${paramIndex})
          OR LOWER(e.description) LIKE LOWER($${paramIndex})
        )
      )`;
      params.push(`%${workFilter}%`);
      paramIndex++;
    }

    // Build count query with same WHERE conditions
    let countSql = `
      SELECT COUNT(DISTINCT u.id) as total
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.is_active = true AND u.role != 'admin'
    `;
    
    // Apply same filters to count query (without pagination params)
    const countParams: any[] = [];
    let countParamIndex = 1;
    
    if (searchQuery) {
      countSql += ` AND (
        LOWER(p.name) LIKE LOWER($${countParamIndex})
        OR LOWER(u.email) LIKE LOWER($${countParamIndex})
        OR LOWER(p.phone) LIKE LOWER($${countParamIndex})
        OR EXISTS (
          SELECT 1 FROM experiences e
          WHERE e.user_id = u.id
          AND LOWER(e.designation) LIKE LOWER($${countParamIndex})
        )
      )`;
      countParams.push(`%${searchQuery}%`);
      countParamIndex++;
    }
    
    if (skillFilter) {
      countSql += ` AND EXISTS (
        SELECT 1 FROM user_skills us
        JOIN skills s ON s.id = us.skill_id
        WHERE us.user_id = u.id
        AND LOWER(s.name) LIKE LOWER($${countParamIndex})
      )`;
      countParams.push(`%${skillFilter}%`);
      countParamIndex++;
    }
    
    if (locationFilter) {
      countSql += ` AND EXISTS (
        SELECT 1 FROM experiences e
        WHERE e.user_id = u.id
        AND (
          LOWER(e.location_city) LIKE LOWER($${countParamIndex})
          OR LOWER(e.location_state) LIKE LOWER($${countParamIndex})
          OR LOWER(e.location_country) LIKE LOWER($${countParamIndex})
        )
      )`;
      countParams.push(`%${locationFilter}%`);
      countParamIndex++;
    }
    
    if (educationFilter) {
      countSql += ` AND EXISTS (
        SELECT 1 FROM education_certificates ec
        WHERE ec.user_id = u.id
        AND (
          LOWER(ec.course) LIKE LOWER($${countParamIndex})
          OR LOWER(ec.school) LIKE LOWER($${countParamIndex})
          OR LOWER(ec.degree_or_certificate_name) LIKE LOWER($${countParamIndex})
        )
      )`;
      countParams.push(`%${educationFilter}%`);
      countParamIndex++;
    }
    
    if (workFilter) {
      countSql += ` AND EXISTS (
        SELECT 1 FROM experiences e
        WHERE e.user_id = u.id
        AND (
          LOWER(e.designation) LIKE LOWER($${countParamIndex})
          OR LOWER(e.company_name) LIKE LOWER($${countParamIndex})
          OR LOWER(e.industry) LIKE LOWER($${countParamIndex})
          OR LOWER(e.description) LIKE LOWER($${countParamIndex})
        )
      )`;
      countParams.push(`%${workFilter}%`);
      countParamIndex++;
    }
    
    // Get total count
    const countResult = await query(countSql, countParams);
    const totalCount = parseInt(countResult.rows[0]?.total || '0', 10);

    // Apply pagination to main query
    sql += ` ORDER BY p.name ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Format the data for frontend and convert S3 keys to pre-signed URLs
    const alumni = await Promise.all(result.rows.map(async (row: any) => {
      const currentExp = row.current_experience;
      let location = '';
      let designation = '';
      let company = '';
      
      if (currentExp) {
        designation = currentExp.designation || '';
        company = currentExp.company_name || '';
        const locationParts = [
          currentExp.location_city,
          currentExp.location_state,
          currentExp.location_country
        ].filter(Boolean);
        location = locationParts.join(', ');
      }

      // Convert S3 key to pre-signed URL if needed
      let profilePictureUrl = row.profile_picture_url;
      if (profilePictureUrl && !profilePictureUrl.startsWith('http://') && !profilePictureUrl.startsWith('https://')) {
        profilePictureUrl = await getPresignedUrl(profilePictureUrl, 7 * 24 * 3600) || profilePictureUrl;
      }

      return {
        id: row.id,
        name: row.name || 'No name',
        email: currentUserIsVerified ? row.email : null, // Hide email for unverified users
        is_verified: row.is_verified || false,
        designation,
        company,
        location,
        profile_picture_url: profilePictureUrl,
        about: row.about,
        phone: currentUserIsVerified ? row.phone : null, // Hide phone for unverified users
        skills: row.skills || [],
        courses: row.courses || []
      };
    }));

    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({ 
      alumni,
      currentUserIsVerified, // Include verification status for frontend
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Database error in /api/community:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

