import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const bucketName = process.env.AWS_BUCKET_NAME || 'icmhs-digital-bucket';

/**
 * Upload file to S3 and return the S3 key (path)
 * The key is stored in the database, and pre-signed URLs are generated on-demand
 */
export async function uploadToS3(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  // Generate unique filename with timestamp
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueFileName = `profile-pictures/${timestamp}-${sanitizedFileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueFileName,
    Body: file,
    ContentType: contentType,
    // No ACL - bucket remains private
  });

  try {
    await s3Client.send(command);
    
    // Return the S3 key (path) instead of a public URL
    // This will be stored in the database
    return uniqueFileName;
  } catch (error: any) {
    console.error('S3 upload error:', error);
    if (error.Code === 'PermanentRedirect') {
      throw new Error(`S3 region mismatch. Bucket is in ${error.Endpoint?.split('.')[2] || 'different region'}. Please update AWS_REGION in .env`);
    }
    throw new Error(`Failed to upload file to S3: ${error.message || error.Code || 'Unknown error'}`);
  }
}

/**
 * Generate a pre-signed URL for accessing a private S3 object
 * @param s3Key - The S3 key (path) stored in the database
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Pre-signed URL that expires after the specified time
 */
export async function getPresignedUrl(
  s3Key: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  // If it's already a full URL (legacy data), return as-is
  if (s3Key.startsWith('http://') || s3Key.startsWith('https://')) {
    return s3Key;
  }

  // If it's not a valid S3 key, return empty string
  if (!s3Key || s3Key.trim() === '') {
    return '';
  }

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error: any) {
    console.error('Error generating pre-signed URL:', error);
    return '';
  }
}

