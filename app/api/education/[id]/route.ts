import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
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
      `UPDATE education_certificates 
       SET 
         type = $1,
         school = $2,
         course = $3,
         degree_or_certificate_name = $4,
         start_date = $5,
         end_date = $6,
         is_present = $7,
         description = $8,
         updated_at = NOW()
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [
        type,
        school || null,
        course,
        degree_or_certificate_name,
        startDate,
        endDate,
        is_present || false,
        description || null,
        params.id,
        payload.userId,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Education record not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
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
    const result = await query(
      'DELETE FROM education_certificates WHERE id = $1 AND user_id = $2 RETURNING id',
      [params.id, payload.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Education record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

