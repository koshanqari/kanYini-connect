import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

// Improved CSV parser that handles quoted fields
function parseCSV(csvText: string): any[] {
  const lines = csvText.split('\n').filter(line => line.trim() && !line.startsWith('Instructions:'));
  if (lines.length < 2) return []; // Need at least header + 1 data row
  
  // Parse header
  const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
  const rows = [];
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;
    
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] || '').trim();
    });
    rows.push(row);
  }
  
  return rows;
}

// Parse a single CSV line, handling quoted fields
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  values.push(current);
  
  return values;
}

export async function POST(request: NextRequest) {
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
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No valid data rows found in CSV' }, { status: 400 });
    }

    const results = {
      success: [] as any[],
      errors: [] as any[],
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const email = row.email?.trim();
      const name = row.name?.trim();
      
      if (!email || !name) {
        results.errors.push({
          row: i + 2, // +2 because row 1 is header, and we're 0-indexed
          email: email || 'N/A',
          error: 'Missing email or name'
        });
        continue;
      }

      try {
        // Check if user already exists
        const existingUser = await query(
          'SELECT id FROM users WHERE email = $1',
          [email]
        );

        if (existingUser.rows.length > 0) {
          results.errors.push({
            row: i + 2,
            email,
            error: 'User already exists'
          });
          continue;
        }

        // Parse role, is_active, and is_verified
        const role = (row.role?.toLowerCase() === 'admin' ? 'admin' : 'user') || 'user';
        const isActive = row.is_active?.toLowerCase() === 'true' || true; // Default to true
        const isVerified = row.is_verified?.toLowerCase() === 'true' || false; // Default to false

        // Create user
        const userResult = await query(
          `INSERT INTO users (email, role, is_verified, is_active, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW())
           RETURNING id, email, role`,
          [email, role, isVerified, isActive]
        );

        const user = userResult.rows[0];

        // Create profile
        await query(
          `INSERT INTO user_profiles (user_id, name, phone, created_at, updated_at)
           VALUES ($1, $2, $3, NOW(), NOW())`,
          [user.id, name, row.phone || null]
        );

        // Create education record if education fields are provided
        const school = row.school?.trim();
        const course = row.course?.trim();
        const degree = row.degree?.trim();
        const startYear = row.start_year?.trim();
        const endYear = row.end_year?.trim();
        const educationDesc = row.education_description?.trim();

        if (school || course || degree) {
          // At least one education field is provided, create education record
          // Convert YYYY to YYYY-01-01 for database DATE type
          const formattedStartDate = startYear ? `${startYear}-01-01` : null;
          const formattedEndDate = endYear ? `${endYear}-01-01` : null;
          const isPresent = !endYear && startYear ? true : false;

          await query(
            `INSERT INTO education_certificates (user_id, type, school, course, degree_or_certificate_name, start_date, end_date, is_present, description, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
            [
              user.id,
              'education', // Default to education type
              school || null,
              course || null,
              degree || null,
              formattedStartDate,
              formattedEndDate,
              isPresent,
              educationDesc || null
            ]
          );
        }

        results.success.push({
          row: i + 2,
          email,
          name,
          role,
          is_active: isActive,
          is_verified: isVerified,
          education_added: !!(school || course || degree)
        });
      } catch (error: any) {
        results.errors.push({
          row: i + 2,
          email,
          error: error.message || 'Database error'
        });
      }
    }

    return NextResponse.json({
      message: `Import completed: ${results.success.length} successful, ${results.errors.length} errors`,
      success: results.success,
      errors: results.errors,
      summary: {
        total: rows.length,
        successful: results.success.length,
        failed: results.errors.length
      }
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

