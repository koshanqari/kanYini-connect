import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

// POST - Add skill to any user
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
    const { skillName } = body;

    if (!skillName || skillName.trim() === '') {
      return NextResponse.json({ error: 'Skill name is required' }, { status: 400 });
    }

    const normalizedSkillName = skillName.trim().toLowerCase();

    // Check if skill already exists in global skills table
    let skillResult = await query('SELECT id FROM skills WHERE LOWER(name) = $1', [normalizedSkillName]);
    let skillId;

    if (skillResult.rows.length === 0) {
      // Create new skill
      const newSkillResult = await query('INSERT INTO skills (name) VALUES ($1) RETURNING id', [skillName.trim()]);
      skillId = newSkillResult.rows[0].id;
    } else {
      skillId = skillResult.rows[0].id;
    }

    // Check if user already has this skill
    const userSkillCheck = await query(
      'SELECT * FROM user_skills WHERE user_id = $1 AND skill_id = $2',
      [params.id, skillId]
    );

    if (userSkillCheck.rows.length > 0) {
      return NextResponse.json({ error: 'User already has this skill' }, { status: 409 });
    }

    // Add skill to user
    await query(
      'INSERT INTO user_skills (user_id, skill_id) VALUES ($1, $2)',
      [params.id, skillId]
    );

    return NextResponse.json({ message: 'Skill added successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

