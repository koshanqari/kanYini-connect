import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

// PUT - Update education for any user
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; eduId: string }> }
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

    const formattedStartDate = start_date ? `${start_date}-01-01` : null;
    const formattedEndDate = end_date ? `${end_date}-01-01` : null;

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
        formattedStartDate,
        formattedEndDate,
        is_present || false,
        description || null,
        params.eduId,
        params.id,
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

// DELETE - Delete education for any user
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; eduId: string }> }
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

    const result = await query(
      'DELETE FROM education_certificates WHERE id = $1 AND user_id = $2 RETURNING id',
      [params.eduId, params.id]
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

