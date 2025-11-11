import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

// Remove a skill from user
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
    // Delete the skill from user_skills
    const result = await query(
      'DELETE FROM user_skills WHERE user_id = $1 AND skill_id = $2 RETURNING id',
      [payload.userId, params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

