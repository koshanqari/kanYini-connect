import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  // Try to get token from Authorization header first, then cookies
  const authHeader = request.headers.get('authorization');
  let token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value;
  }

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      type,
      school,
      course,
      degree_or_certificate_name,
      start_date,
      end_date,
      is_present,
      description,
    } = body;

    // Validate required fields
    if (!type || !course || !degree_or_certificate_name) {
      return NextResponse.json(
        { error: 'Type, course, and degree/certificate name are required' },
        { status: 400 }
      );
    }

    // Validate that education type has a school
    if (type === 'education' && !school) {
      return NextResponse.json(
        { error: 'School is required for education type' },
        { status: 400 }
      );
    }

    // Convert YYYY to DATE format (first day of the year)
    const startDate = start_date ? `${start_date}-01-01` : null;
    const endDate = end_date && !is_present ? `${end_date}-01-01` : null;

    const result = await query(
      `INSERT INTO education_certificates (
        user_id, type, school, course, degree_or_certificate_name,
        start_date, end_date, is_present, description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        payload.userId,
        type,
        school || null,
        course,
        degree_or_certificate_name,
        startDate,
        endDate,
        is_present || false,
        description || null,
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

