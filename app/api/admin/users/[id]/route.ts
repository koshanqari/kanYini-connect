import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { getPresignedUrl } from '@/lib/s3';

// GET single user data
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

    // Check if user is admin
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Fetch user data
    const userResult = await query(
      `SELECT id, email, role, is_active, is_verified, created_at FROM users WHERE id = $1`,
      [params.id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch profile
    const profileResult = await query(
      `SELECT * FROM user_profiles WHERE user_id = $1`,
      [params.id]
    );

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
       FROM skills s
       JOIN user_skills us ON s.id = us.skill_id
       WHERE us.user_id = $1
       ORDER BY s.name`,
      [params.id]
    );

    // Convert S3 key to pre-signed URL if needed
    const profile = profileResult.rows[0] || null;
    if (profile && profile.profile_picture_url && !profile.profile_picture_url.startsWith('http://') && !profile.profile_picture_url.startsWith('https://')) {
      profile.profile_picture_url = await getPresignedUrl(profile.profile_picture_url, 7 * 24 * 3600) || profile.profile_picture_url;
    }

    return NextResponse.json({
      user: userResult.rows[0],
      profile: profile,
      experiences: experiencesResult.rows,
      education: educationResult.rows,
      skills: skillsResult.rows,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// UPDATE user data
export async function PUT(
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

    // Check if user is admin
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { user, profile } = body;

    // Update user table
    if (user) {
      await query(
        `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2`,
        [user.role, params.id]
      );
    }

    // Update profile table
    if (profile) {
      const { 
        name, 
        about, 
        profile_picture_url, 
        phone, 
        my_expertise,
        preferred_time_to_connect,
        preferred_way_to_connect,
        social_media_links
      } = profile;
      
      // Check if profile exists
      const profileCheck = await query('SELECT id FROM user_profiles WHERE user_id = $1', [params.id]);
      
      if (profileCheck.rows.length === 0) {
        // Create profile if it doesn't exist
        await query(
          `INSERT INTO user_profiles (user_id, name, about, profile_picture_url, phone, my_expertise, preferred_time_to_connect, preferred_way_to_connect, social_media_links, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
          [params.id, name, about, profile_picture_url, phone, my_expertise, preferred_time_to_connect, preferred_way_to_connect, social_media_links]
        );
      } else {
        // Update existing profile
        await query(
          `UPDATE user_profiles 
           SET name = $1, about = $2, profile_picture_url = $3, phone = $4, my_expertise = $5, 
               preferred_time_to_connect = $6, preferred_way_to_connect = $7, social_media_links = $8, updated_at = NOW()
           WHERE user_id = $9`,
          [name, about, profile_picture_url, phone, my_expertise, preferred_time_to_connect, preferred_way_to_connect, social_media_links, params.id]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

