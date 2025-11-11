import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendOTPEmail } from '@/lib/brevo';

// Generate random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user exists (for login) or allow new signups
    // Join with user_profiles to get name if user exists
    const userResult = await query(
      `SELECT u.id, u.email, p.name 
       FROM users u
       LEFT JOIN user_profiles p ON u.id = p.user_id
       WHERE LOWER(u.email) = LOWER($1)`,
      [normalizedEmail]
    );

    const user = userResult.rows[0];
    const userName = user?.name || null;

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP valid for 10 minutes

    // Mark old unused OTPs as used (to prevent multiple active OTPs)
    await query(
      `UPDATE otp_tokens 
       SET is_used = true 
       WHERE LOWER(email) = LOWER($1) AND is_used = false AND expires_at > NOW()`,
      [normalizedEmail]
    );

    // Store new OTP in database (store normalized email)
    await query(
      `INSERT INTO otp_tokens (email, token, expires_at, is_used, created_at)
       VALUES ($1, $2, $3, false, NOW())`,
      [normalizedEmail, otp, expiresAt]
    );

    // Send OTP via email (use original email for display, but normalized for storage)
    const emailSent = await sendOTPEmail(normalizedEmail, otp, userName || undefined);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP has been sent to your email address',
    });
  } catch (error) {
    console.error('Request OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

