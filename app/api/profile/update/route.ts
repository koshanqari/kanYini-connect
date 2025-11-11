import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { 
      name, 
      about, 
      phone, 
      preferred_time_to_connect, 
      preferred_way_to_connect,
      social_media_links,
      my_expertise,
      profile_picture_url
    } = body;

    // Update user profile
    const result = await query(
      `UPDATE user_profiles 
       SET 
         name = COALESCE($1, name),
         about = COALESCE($2, about),
         phone = COALESCE($3, phone),
         preferred_time_to_connect = COALESCE($4, preferred_time_to_connect),
         preferred_way_to_connect = COALESCE($5, preferred_way_to_connect),
         social_media_links = COALESCE($6, social_media_links),
         my_expertise = COALESCE($7, my_expertise),
         profile_picture_url = COALESCE($8, profile_picture_url),
         updated_at = NOW()
       WHERE user_id = $9
       RETURNING *`,
      [
        name || null,
        about || null,
        phone || null,
        preferred_time_to_connect || null,
        preferred_way_to_connect || null,
        social_media_links || null,
        my_expertise || null,
        profile_picture_url || null,
        payload.userId
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: result.rows[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

