import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { uploadToS3, getPresignedUrl } from '@/lib/s3';

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
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get the file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type (only images)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images (JPEG, PNG, GIF, WebP) are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3 - returns S3 key (path)
    const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
    const s3Key = await uploadToS3(buffer, fileName, file.type);

    // Generate pre-signed URL (valid for 7 days for profile pictures)
    const presignedUrl = await getPresignedUrl(s3Key, 7 * 24 * 3600); // 7 days

    return NextResponse.json({
      success: true,
      url: presignedUrl, // Return pre-signed URL for immediate display
      s3Key: s3Key, // Also return the S3 key to store in database
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}


