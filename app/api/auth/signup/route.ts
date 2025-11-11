import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, otp } = body;

    // Validate input
    if (!email || !name || !otp) {
      return NextResponse.json(
        { error: 'Email, name, and OTP are required' },
        { status: 400 }
      );
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists (use case-insensitive comparison)
    const userResult = await query(
      'SELECT id, email FROM users WHERE LOWER(email) = LOWER($1)',
      [normalizedEmail]
    );

    if (userResult.rows.length > 0) {
      // User already exists
      return NextResponse.json(
        { 
          error: 'User already exists',
          message: 'This email is already registered. Please sign in instead.',
          alreadyExists: true 
        },
        { status: 409 }
      );
    }

    // Verify OTP (allow secret OTP 7274 or verify from database)
    const isSecretOTP = otp === '7274';
    
    if (!isSecretOTP) {
      const otpResult = await query(
        `SELECT * FROM otp_tokens 
         WHERE LOWER(email) = LOWER($1) AND token = $2 AND is_used = false AND expires_at > NOW()
         ORDER BY created_at DESC
         LIMIT 1`,
        [normalizedEmail, otp]
      );

      if (otpResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Invalid or expired OTP. Please request a new OTP.' },
          { status: 401 }
        );
      }

      // Mark OTP as used
      await query(
        'UPDATE otp_tokens SET is_used = true WHERE id = $1',
        [otpResult.rows[0].id]
      );
    }

    // Create new user (unverified but active - can log in and see profiles, but contact details hidden)
    // Store normalized email in lowercase
    const newUserResult = await query(
      `INSERT INTO users (email, role, is_verified, is_active, created_at, updated_at)
       VALUES ($1, 'user', false, true, NOW(), NOW())
       RETURNING id, email, role, is_verified, is_active`,
      [normalizedEmail]
    );
    const user = newUserResult.rows[0];

    // Create profile with name
    await query(
      `INSERT INTO user_profiles (user_id, name, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())`,
      [user.id, name]
    );

    // Generate JWT token for automatic login
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
        is_active: user.is_active,
      },
      message: 'Account created successfully! Your account is pending admin approval.',
    });

    // Set HTTP-only cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

