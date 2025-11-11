# S3 Upload and Fetch Flow Explanation

## Overview
This system uses **AWS S3** with **pre-signed URLs** to securely store and serve profile pictures. The bucket remains **private** (not publicly accessible), and images are accessed through temporary signed URLs.

---

## 🔄 Complete Flow Diagram

```
┌─────────────┐
│   Frontend  │
│  (Browser)  │
└──────┬──────┘
       │ 1. User selects image file
       │ 2. File sent to /api/profile/upload-picture
       ▼
┌─────────────────────────────┐
│   Upload API Endpoint       │
│ /api/profile/upload-picture │
└──────┬──────────────────────┘
       │ 3. Validates file (type, size)
       │ 4. Converts to Buffer
       │ 5. Calls uploadToS3()
       ▼
┌─────────────────────────────┐
│      S3 Upload Function      │
│    lib/s3.ts:uploadToS3()   │
└──────┬──────────────────────┘
       │ 6. Creates unique filename:
       │    "profile-pictures/1762849668423-photo.jpg"
       │ 7. Uploads to S3 bucket (PRIVATE)
       │ 8. Returns S3 key (path)
       ▼
┌─────────────────────────────┐
│   AWS S3 Bucket (Private)   │
│  icmhs-digital-bucket        │
│  └── profile-pictures/      │
│      └── 1762849668423-...  │
└──────┬──────────────────────┘
       │
       │ 9. S3 key returned: "profile-pictures/1762849668423-photo.jpg"
       │ 10. Generate pre-signed URL (valid 7 days)
       │
       ▼
┌─────────────────────────────┐
│   Upload API Response        │
│  {                            │
│    url: "https://...?X-Amz...", │
│    s3Key: "profile-pictures/..." │
│  }                            │
└──────┬──────────────────────┘
       │
       │ 11. Frontend receives both:
       │     - url: For immediate preview
       │     - s3Key: To store in database
       │
       ▼
┌─────────────────────────────┐
│   Frontend (React)           │
│  - Shows preview using url   │
│  - Saves s3Key to database   │
└──────┬──────────────────────┘
       │
       │ 12. User clicks "Save"
       │ 13. PUT /api/profile/update
       │     { profile_picture_url: "profile-pictures/..." }
       │
       ▼
┌─────────────────────────────┐
│   PostgreSQL Database        │
│  user_profiles table         │
│  profile_picture_url:        │
│  "profile-pictures/1762..."  │
└─────────────────────────────┘
```

---

## 📤 UPLOAD FLOW (Step by Step)

### Step 1: User Selects Image
```javascript
// Frontend: app/app/page.tsx
const handleFileUpload = async (event) => {
  const file = event.target.files?.[0];
  // file = File object (e.g., "photo.jpg", 2MB)
}
```

### Step 2: Frontend Sends to Upload API
```javascript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/profile/upload-picture', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData,
});
```

### Step 3: Upload API Validates & Processes
```typescript
// app/api/profile/upload-picture/route.ts

// ✅ Validates:
// - File type (JPEG, PNG, GIF, WebP only)
// - File size (max 5MB)
// - User authentication

// Converts file to Buffer
const arrayBuffer = await file.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);
```

### Step 4: Upload to S3
```typescript
// lib/s3.ts:uploadToS3()

// Creates unique filename:
const timestamp = Date.now(); // 1762849668423
const uniqueFileName = `profile-pictures/${timestamp}-${sanitizedFileName}`;
// Result: "profile-pictures/1762849668423-photo.jpg"

// Uploads to S3 (bucket is PRIVATE)
await s3Client.send(new PutObjectCommand({
  Bucket: 'icmhs-digital-bucket',
  Key: uniqueFileName,  // The path in S3
  Body: buffer,
  ContentType: 'image/jpeg',
  // No ACL - bucket stays private!
}));

// Returns S3 key (path)
return "profile-pictures/1762849668423-photo.jpg";
```

### Step 5: Generate Pre-signed URL
```typescript
// lib/s3.ts:getPresignedUrl()

const command = new GetObjectCommand({
  Bucket: 'icmhs-digital-bucket',
  Key: s3Key,  // "profile-pictures/1762849668423-photo.jpg"
});

// AWS generates a temporary signed URL
const url = await getSignedUrl(s3Client, command, { 
  expiresIn: 7 * 24 * 3600  // 7 days
});

// Returns something like:
// "https://icmhs-digital-bucket.s3.ap-south-1.amazonaws.com/profile-pictures/1762849668423-photo.jpg?X-Amz-Algorithm=...&X-Amz-Credential=...&X-Amz-Date=...&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=..."
```

### Step 6: API Returns Both Values
```typescript
return NextResponse.json({
  success: true,
  url: presignedUrl,        // For immediate preview
  s3Key: s3Key,            // To store in database
});
```

### Step 7: Frontend Stores S3 Key
```javascript
// app/app/page.tsx

const data = await response.json();

// Store S3 key (not the pre-signed URL) in database
const valueToStore = data.s3Key;  // "profile-pictures/1762849668423-photo.jpg"
setEditValues({ 
  ...editValues, 
  profile_picture_url: valueToStore 
});

// Use pre-signed URL for preview
setPreviewUrl(data.url);  // Shows image immediately
```

### Step 8: Save to Database
```javascript
// When user clicks "Save"
await saveProfile({ 
  profile_picture_url: "profile-pictures/1762849668423-photo.jpg" 
});

// Database stores:
// user_profiles.profile_picture_url = "profile-pictures/1762849668423-photo.jpg"
```

---

## 📥 FETCH FLOW (Step by Step)

### Step 1: Frontend Requests Profile
```javascript
// app/app/page.tsx
const response = await fetch('/api/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Step 2: API Fetches from Database
```typescript
// app/api/profile/route.ts

const profileResult = await query(
  `SELECT profile_picture_url FROM user_profiles WHERE user_id = $1`,
  [userId]
);

// Database returns:
// profile_picture_url = "profile-pictures/1762849668423-photo.jpg"
```

### Step 3: Convert S3 Key to Pre-signed URL
```typescript
// app/api/profile/route.ts

const profile = profileResult.rows[0];

// Check if it's an S3 key (not a full URL)
if (profile.profile_picture_url && 
    !profile.profile_picture_url.startsWith('http')) {
  
  // Generate new pre-signed URL (valid for 7 days)
  profile.profile_picture_url = await getPresignedUrl(
    profile.profile_picture_url,  // "profile-pictures/1762849668423-photo.jpg"
    7 * 24 * 3600                 // 7 days expiration
  );
  
  // Now: "https://icmhs-digital-bucket.s3.ap-south-1.amazonaws.com/...?X-Amz-..."
}
```

### Step 4: API Returns Pre-signed URL
```typescript
return NextResponse.json({
  profile: {
    profile_picture_url: "https://icmhs-digital-bucket.s3.ap-south-1.amazonaws.com/...?X-Amz-..."
  }
});
```

### Step 5: Frontend Displays Image
```javascript
// app/app/page.tsx

<img 
  src={profile.profile_picture_url}  // Pre-signed URL
  alt={profile.name}
/>

// Browser requests image from S3 using pre-signed URL
// S3 validates the signature and serves the image
```

---

## 🔐 Security Features

### 1. **Private Bucket**
- S3 bucket has **no public access**
- Direct URLs like `https://bucket.s3.amazonaws.com/file.jpg` return **403 Forbidden**
- Only pre-signed URLs work

### 2. **Pre-signed URLs**
- **Temporary**: Expire after 7 days
- **Signed**: Contains cryptographic signature
- **Validated by AWS**: S3 checks signature before serving

### 3. **Authentication Required**
- Upload requires valid JWT token
- Fetch requires valid JWT token
- Only authenticated users can generate pre-signed URLs

### 4. **What's Stored in Database**
```
✅ S3 Key: "profile-pictures/1762849668423-photo.jpg"
❌ NOT: Full URL (would expire)
❌ NOT: Pre-signed URL (would expire)
```

### 5. **URL Generation on Demand**
- Pre-signed URLs generated **fresh** each time profile is fetched
- If URL expires, next fetch generates a new one
- No stale URLs in database

---

## 🔄 Why This Approach?

### ❌ **Old Way (Public Bucket)**
```
1. Upload to S3
2. Make file public
3. Store full URL in database
4. Anyone with URL can access (forever)
```

**Problems:**
- Security risk (anyone can access)
- No expiration
- Hard to revoke access

### ✅ **New Way (Pre-signed URLs)**
```
1. Upload to S3 (private)
2. Store S3 key in database
3. Generate pre-signed URL on-demand
4. URL expires after 7 days
```

**Benefits:**
- ✅ Secure (bucket is private)
- ✅ Temporary access (URLs expire)
- ✅ Can revoke by changing bucket policy
- ✅ No public access needed

---

## 📝 Key Concepts

### **S3 Key (Path)**
```
"profile-pictures/1762849668423-photo.jpg"
```
- The **path** to the file in S3
- Stored in database
- Never expires
- Used to generate pre-signed URLs

### **Pre-signed URL**
```
"https://icmhs-digital-bucket.s3.ap-south-1.amazonaws.com/profile-pictures/1762849668423-photo.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...&X-Amz-Date=20240101T120000Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=abc123..."
```
- Temporary URL that grants access to private S3 object
- Contains cryptographic signature
- Expires after specified time (7 days)
- Generated fresh on each fetch

### **Backward Compatibility**
```typescript
// Handles old data (full URLs stored in database)
if (s3Key.startsWith('http://') || s3Key.startsWith('https://')) {
  return s3Key;  // Return as-is (legacy data)
}
```

---

## 🎯 Example Timeline

### Day 1: Upload
1. User uploads `photo.jpg`
2. Stored in S3: `profile-pictures/1762849668423-photo.jpg`
3. Database: `profile_picture_url = "profile-pictures/1762849668423-photo.jpg"`
4. Pre-signed URL generated (expires Day 8)

### Day 2-7: Viewing Profile
1. User views profile
2. API fetches S3 key from database
3. Generates **new** pre-signed URL (expires Day 9)
4. Image displays using pre-signed URL

### Day 8: URL Expires
1. Old pre-signed URL no longer works
2. User views profile again
3. API generates **fresh** pre-signed URL (expires Day 15)
4. Image displays with new URL

---

## 🛠️ Code Locations

| Function | File | Purpose |
|----------|------|---------|
| `uploadToS3()` | `lib/s3.ts` | Upload file to S3, return key |
| `getPresignedUrl()` | `lib/s3.ts` | Generate temporary signed URL |
| Upload API | `app/api/profile/upload-picture/route.ts` | Handle file upload |
| Profile API | `app/api/profile/route.ts` | Fetch profile, convert key to URL |
| Community API | `app/api/community/route.ts` | Fetch alumni list, convert keys |
| Frontend Upload | `app/app/page.tsx` | Handle file selection, save key |
| Frontend Display | `app/app/page.tsx` | Display image from pre-signed URL |

---

## ❓ Common Questions

### Q: Why store S3 key instead of pre-signed URL?
**A:** Pre-signed URLs expire. If we stored the URL, it would stop working after 7 days. The S3 key never expires, so we can always generate a new pre-signed URL.

### Q: What happens if the URL expires?
**A:** The next time the profile is fetched, a new pre-signed URL is automatically generated. Users won't notice.

### Q: Can someone share a pre-signed URL?
**A:** Yes, but it expires after 7 days. After that, it won't work anymore.

### Q: Why 7 days expiration?
**A:** Balance between security (shorter) and user experience (longer). Can be adjusted in code.

### Q: What if I want to delete an image?
**A:** Delete from S3 using the S3 key, then update database to remove the key.

---

## 🚀 Summary

1. **Upload**: File → S3 (private) → Store key in database
2. **Fetch**: Get key from database → Generate pre-signed URL → Return to frontend
3. **Display**: Browser uses pre-signed URL to load image from S3
4. **Security**: Bucket stays private, URLs expire, authentication required

This approach provides **security** (private bucket) with **convenience** (automatic URL generation).

