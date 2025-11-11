import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      token = request.cookies.get('token')?.value || request.cookies.get('auth_token')?.value;
    }
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { is_verified } = body;

    if (typeof is_verified !== 'boolean') {
      return NextResponse.json({ error: 'is_verified must be a boolean' }, { status: 400 });
    }

    // Update verification status
    const result = await query(
      `UPDATE users 
       SET is_verified = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, email, is_verified`,
      [is_verified, params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Toggle verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

