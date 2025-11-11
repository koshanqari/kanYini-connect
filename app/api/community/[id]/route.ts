import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { getPresignedUrl } from '@/lib/s3';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  
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
    const isOwnProfile = payload.userId === params.id;

    // Fetch user profile
    const profileResult = await query(
      `SELECT 
        u.id, u.email, u.role, u.is_verified,
        p.name, p.about, p.profile_picture_url, p.phone,
        p.preferred_time_to_connect, p.preferred_way_to_connect,
        p.social_media_links, p.my_expertise
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = $1 AND u.is_active = true`,
      [params.id]
    );

    if (profileResult.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profile = profileResult.rows[0];
    
    // Convert S3 key to pre-signed URL if needed
    if (profile.profile_picture_url && !profile.profile_picture_url.startsWith('http://') && !profile.profile_picture_url.startsWith('https://')) {
      profile.profile_picture_url = await getPresignedUrl(profile.profile_picture_url, 7 * 24 * 3600) || profile.profile_picture_url;
    }
    
    // Hide contact details if viewing someone else's profile and current user is not verified
    if (!isOwnProfile && !currentUserIsVerified) {
      profile.email = null;
      profile.phone = null;
      profile.preferred_time_to_connect = null;
      profile.preferred_way_to_connect = null;
      profile.social_media_links = null;
    }

    // Fetch experiences
    const experiencesResult = await query(
      `SELECT * FROM experiences WHERE user_id = $1 ORDER BY start_date DESC`,
      [params.id]
    );

    // Fetch education
    const educationResult = await query(
      `SELECT * FROM education_certificates WHERE user_id = $1 ORDER BY start_date DESC`,
      [params.id]
    );

    // Fetch skills
    const skillsResult = await query(
      `SELECT s.id, s.name 
       FROM user_skills us
       JOIN skills s ON s.id = us.skill_id
       WHERE us.user_id = $1
       ORDER BY s.name ASC`,
      [params.id]
    );

    return NextResponse.json({
      profile,
      experiences: experiencesResult.rows,
      education: educationResult.rows,
      skills: skillsResult.rows,
      currentUserIsVerified,
      isOwnProfile,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

