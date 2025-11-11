# S3 Bucket Public Access Setup Instructions

## Problem
Profile pictures are uploaded to S3 but fail to load because the bucket doesn't allow public read access.

## Solution: Configure Bucket Policy

### Step 1: Open AWS S3 Console
1. Go to https://s3.console.aws.amazon.com/
2. Find and click on your bucket: `icmhs-digital-bucket`

### Step 2: Configure Block Public Access Settings
1. Click on the **Permissions** tab
2. Scroll down to **Block public access (bucket settings)**
3. Click **Edit**
4. **Uncheck** "Block all public access" (or keep it checked and use bucket policy only)
5. Click **Save changes**
6. Type `confirm` when prompted

### Step 3: Add Bucket Policy
1. Still in the **Permissions** tab
2. Scroll to **Bucket policy**
3. Click **Edit**
4. Paste this JSON policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::icmhs-digital-bucket/profile-pictures/*"
    }
  ]
}
```

5. Click **Save changes**

### Step 4: Make Existing Files Public (Optional)
If you already uploaded files before setting the policy:

1. Go to the bucket → Click on `profile-pictures/` folder
2. Select the file(s) you want to make public
3. Click **Actions** → **Make public using ACL**
4. Click **Make public**

### Step 5: Test the URL
Open this URL in your browser (replace with your actual file name):
```
https://icmhs-digital-bucket.s3.ap-south-1.amazonaws.com/profile-pictures/1762849668423-IMG%204213.PNG
```

If you see the image, it's working! If you see "Access Denied", the policy isn't set correctly.

## Alternative: Use CloudFront (More Secure)
For production, consider using CloudFront CDN instead of direct S3 URLs for better security and performance.

## Troubleshooting

### Error: "Access Denied"
- Check that the bucket policy is saved correctly
- Verify the Resource ARN matches your bucket name
- Ensure Block Public Access is disabled (or policy is set)

### Error: "NoSuchKey"
- The file doesn't exist at that path
- Check the file name and path in S3 console

### Images still not loading after setup
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for CORS errors
- Verify the URL format matches: `https://bucket-name.s3.region.amazonaws.com/path/to/file`

