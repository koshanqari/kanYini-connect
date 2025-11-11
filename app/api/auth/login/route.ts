import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Secret admin OTP (always valid)
    const isSecretOTP = otp === '7274';
    
    // If not secret OTP, verify from database
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

    // Check if user exists (use case-insensitive comparison)
    const userResult = await query(
      'SELECT id, email, role, is_active, is_verified FROM users WHERE LOWER(email) = LOWER($1)',
      [normalizedEmail]
    );

    if (userResult.rows.length === 0) {
      // User not found
      return NextResponse.json(
        { 
          error: 'No user found with this email',
          message: 'Please contact admin or sign up first',
          needsSignup: true 
        },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Note: We allow login even if is_active is false (pending admin approval)
    // Unverified users can see profiles but contact details will be hidden
    // Admin can activate accounts to give full access

    const isNewUser = false;

    // Generate JWT token
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
      isNewUser,
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

