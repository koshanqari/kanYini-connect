import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { getPresignedUrl } from '@/lib/s3';

export async function GET(request: NextRequest) {
  try {
    // Try to get token from Authorization header first, then cookies
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      token = request.cookies.get('token')?.value || request.cookies.get('auth_token')?.value;
    }
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch user profile
    const profileResult = await query(
      `SELECT 
        u.id, u.email, u.role, u.is_verified,
        p.name, p.about, p.profile_picture_url, p.phone,
        p.preferred_time_to_connect, p.preferred_way_to_connect,
        p.social_media_links, p.my_expertise
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = $1`,
      [payload.userId]
    );

    if (profileResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = profileResult.rows[0];

    // Convert S3 key to pre-signed URL if it exists
    if (profile.profile_picture_url) {
      // Check if it's already a full URL (legacy data) or an S3 key
      if (!profile.profile_picture_url.startsWith('http://') && !profile.profile_picture_url.startsWith('https://')) {
        // It's an S3 key, generate pre-signed URL (valid for 7 days)
        const presignedUrl = await getPresignedUrl(profile.profile_picture_url, 7 * 24 * 3600);
        profile.profile_picture_url = presignedUrl || profile.profile_picture_url;
      }
    }

    // Fetch experiences
    const experiencesResult = await query(
      `SELECT * FROM experiences WHERE user_id = $1 ORDER BY start_date DESC`,
      [payload.userId]
    );

    // Fetch education
    const educationResult = await query(
      `SELECT * FROM education_certificates WHERE user_id = $1 ORDER BY start_date DESC`,
      [payload.userId]
    );

    // Fetch skills
    const skillsResult = await query(
      `SELECT s.id, s.name 
      FROM skills s
      JOIN user_skills us ON s.id = us.skill_id
      WHERE us.user_id = $1
      ORDER BY s.name`,
      [payload.userId]
    );

    return NextResponse.json({
      profile,
      experiences: experiencesResult.rows,
      education: educationResult.rows,
      skills: skillsResult.rows,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

