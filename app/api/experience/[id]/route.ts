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
      designation,
      industry,
      company_name,
      description,
      start_date,
      end_date,
      is_present,
      location_city,
      location_state,
      location_country,
    } = body;

    // Validate required fields
    if (!designation || !company_name || !start_date) {
      return NextResponse.json(
        { error: 'Designation, company name, and start date are required' },
        { status: 400 }
      );
    }

    // Convert YYYY-MM to DATE format (first day of the month)
    const startDate = start_date ? `${start_date}-01` : null;
    const endDate = end_date && !is_present ? `${end_date}-01` : null;

    const result = await query(
      `UPDATE experiences 
       SET 
         designation = $1,
         industry = $2,
         company_name = $3,
         description = $4,
         start_date = $5,
         end_date = $6,
         is_present = $7,
         location_city = $8,
         location_state = $9,
         location_country = $10,
         updated_at = NOW()
       WHERE id = $11 AND user_id = $12
       RETURNING *`,
      [
        designation,
        industry || null,
        company_name,
        description || null,
        startDate,
        endDate,
        is_present || false,
        location_city || null,
        location_state || null,
        location_country || null,
        params.id,
        payload.userId,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
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
      'DELETE FROM experiences WHERE id = $1 AND user_id = $2 RETURNING id',
      [params.id, payload.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

