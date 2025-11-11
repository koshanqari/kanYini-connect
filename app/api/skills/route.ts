import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

// Get all skills
export async function GET() {
  try {
    const result = await query(
      'SELECT id, name FROM skills ORDER BY name ASC'
    );

    return NextResponse.json({ skills: result.rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add a skill to user
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
    const { skillName } = body;

    if (!skillName || skillName.trim() === '') {
      return NextResponse.json({ error: 'Skill name is required' }, { status: 400 });
    }

    const trimmedSkillName = skillName.trim();

    // Check if skill exists in skills table, if not create it
    let skillResult = await query(
      'SELECT id FROM skills WHERE LOWER(name) = LOWER($1)',
      [trimmedSkillName]
    );

    let skillId;
    if (skillResult.rows.length === 0) {
      // Create new skill
      const newSkillResult = await query(
        'INSERT INTO skills (name) VALUES ($1) RETURNING id',
        [trimmedSkillName]
      );
      skillId = newSkillResult.rows[0].id;
    } else {
      skillId = skillResult.rows[0].id;
    }

    // Check if user already has this skill
    const existingUserSkill = await query(
      'SELECT id FROM user_skills WHERE user_id = $1 AND skill_id = $2',
      [payload.userId, skillId]
    );

    if (existingUserSkill.rows.length > 0) {
      return NextResponse.json({ error: 'You already have this skill' }, { status: 400 });
    }

    // Add skill to user
    await query(
      'INSERT INTO user_skills (user_id, skill_id) VALUES ($1, $2)',
      [payload.userId, skillId]
    );

    return NextResponse.json({ success: true, skillId });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

