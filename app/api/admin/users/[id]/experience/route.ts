import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

// POST - Create experience for any user
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  
  try {
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.replace('Bearer ', '');
    if (!token) {
      token = request.cookies.get('token')?.value || request.cookies.get('auth_token')?.value;
    }
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

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

    if (!designation || !company_name || !start_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert YYYY-MM to DATE format (first day of the month)
    const startDate = start_date ? `${start_date}-01` : null;
    const endDate = end_date && !is_present ? `${end_date}-01` : null;

    const result = await query(
      `INSERT INTO experiences (user_id, designation, industry, company_name, description, start_date, end_date, is_present, location_city, location_state, location_country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        params.id,
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
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

