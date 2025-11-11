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

    // Check if user is admin
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Fetch all users with their profiles and current experience
    const sql = `
      SELECT 
        u.id,
        u.email,
        u.role,
        u.is_active,
        u.is_verified,
        u.created_at,
        p.name,
        p.profile_picture_url,
        p.phone,
        -- Get current experience
        (SELECT json_build_object(
          'designation', e.designation,
          'company_name', e.company_name
        )
        FROM experiences e
        WHERE e.user_id = u.id AND e.is_present = true
        ORDER BY e.start_date DESC
        LIMIT 1) as current_experience
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      ORDER BY u.created_at DESC
    `;

    const result = await query(sql);

    // Format the data and convert S3 keys to pre-signed URLs
    const users = await Promise.all(result.rows.map(async (row: any) => {
      const currentExp = row.current_experience;
      
      // Convert S3 key to pre-signed URL if needed
      let profilePictureUrl = row.profile_picture_url;
      if (profilePictureUrl && !profilePictureUrl.startsWith('http://') && !profilePictureUrl.startsWith('https://')) {
        profilePictureUrl = await getPresignedUrl(profilePictureUrl, 7 * 24 * 3600) || profilePictureUrl;
      }
      
      return {
        id: row.id,
        email: row.email,
        name: row.name,
        role: row.role,
        is_active: row.is_active,
        is_verified: row.is_verified,
        profile_picture_url: profilePictureUrl,
        phone: row.phone,
        created_at: row.created_at,
        current_designation: currentExp?.designation,
        current_company: currentExp?.company_name,
      };
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Database error in /api/admin/users:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

