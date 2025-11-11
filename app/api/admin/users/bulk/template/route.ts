import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      const url = new URL(request.url);
      token = url.searchParams.get('token') || '';
    }
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // CSV template with headers and example rows
    const csvTemplate = `email,name,phone,role,is_active,is_verified,school,course,degree,start_year,end_year,education_description
john.doe@example.com,John Doe,+1-555-123-4567,user,true,true,Harvard University,Computer Science,Bachelor of Science,2015,2019,Graduated with honors
jane.smith@example.com,Jane Smith,+1-555-987-6543,user,true,false,Stanford University,Electrical Engineering,Master of Science,2016,2018,Specialized in AI and Machine Learning
admin@example.com,Admin User,+1-555-000-0000,admin,true,true,MIT,Business Administration,MBA,2010,2012,Executive MBA program

Instructions:
- email: Required. Unique email address for each user
- name: Required. Full name of the user  
- phone: Optional. Phone number with country code (e.g., +1-555-123-4567)
- role: Optional. Either "user" or "admin" (default: "user")
- is_active: Optional. Either "true" or "false" (default: "true")
- is_verified: Optional. Either "true" or "false" (default: "false" - unverified users cannot see contact details)
- school: Optional. School/University name
- course: Optional. Course/Field of study
- degree: Optional. Degree name (e.g., Bachelor of Science, Master of Arts)
- start_year: Optional. Start year (YYYY format, e.g., 2015)
- end_year: Optional. End year (YYYY format, e.g., 2019). Leave empty if currently studying
- education_description: Optional. Description of education/achievements
- Remove the example rows and this instruction block before uploading
- Keep the header row (first line)`;

    return new NextResponse(csvTemplate, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="users-import-template.csv"',
      },
    });
  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

