import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

// POST - Create education for any user
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
      type,
      school,
      course,
      degree_or_certificate_name,
      start_date,
      end_date,
      is_present,
      description,
    } = body;

    if (!type || !course || !degree_or_certificate_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (type === 'education' && !school) {
      return NextResponse.json({ error: 'School is required for education type' }, { status: 400 });
    }

    // Convert YYYY to YYYY-01-01 for database DATE type
    const formattedStartDate = start_date ? `${start_date}-01-01` : null;
    const formattedEndDate = end_date ? `${end_date}-01-01` : null;

    const result = await query(
      `INSERT INTO education_certificates (user_id, type, school, course, degree_or_certificate_name, start_date, end_date, is_present, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        params.id,
        type,
        school || null,
        course,
        degree_or_certificate_name,
        formattedStartDate,
        formattedEndDate,
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

