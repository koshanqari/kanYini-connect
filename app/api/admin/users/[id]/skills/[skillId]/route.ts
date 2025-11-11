import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

// DELETE - Remove skill from any user
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; skillId: string }> }
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
      'DELETE FROM user_skills WHERE skill_id = $1 AND user_id = $2 RETURNING skill_id',
      [params.skillId, params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Skill not found for user' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Skill removed successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

