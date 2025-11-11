# Alumni Portal MVP

A LinkedIn-style alumni networking platform built with Next.js 14, React 18, TypeScript, and Tailwind CSS 3.4.

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS 3.4
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL
- **Authentication:** JWT with HTTP-only cookies
- **File Storage:** AWS S3 (to be configured)
- **Email:** Brevo (for future OTP emails)

## Setup Complete ✅

### 1. Database
- ✅ PostgreSQL connected
- ✅ All 7 tables created:
  - users
  - user_profiles
  - experiences
  - education_certificates
  - skills
  - user_skills
  - otp_tokens
- ✅ Indexes created for performance
- ✅ Default admin user: admin@alumni.com

### 2. Next.js Project
- ✅ Next.js 14 with App Router
- ✅ TypeScript configured
- ✅ Tailwind CSS 3.4 set up
- ✅ Authentication API routes (login/logout)
- ✅ JWT session management
- ✅ Login page with hardcoded OTP (7274)

## Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (already configured)

### Installation

Already done! Just run:

```bash
npm run dev
```

Visit http://localhost:3000

### Login
- Email: Any email address
- OTP: **7274** (hardcoded for MVP)

## Project Structure

```
alumni-portal-vh/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts
│   │       └── logout/route.ts
│   ├── auth/
│   │   └── login/page.tsx
│   ├── profile/
│   ├── community/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
├── lib/
│   ├── db.ts          # PostgreSQL connection
│   └── jwt.ts         # JWT utilities
├── .env               # Environment variables (DO NOT COMMIT)
├── prd.md             # Product requirements
├── database-schema.md # Database structure
└── setup-database.sql # Database setup script
```

## Environment Variables

Already configured in `.env`:
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - JWT signing key
- `JWT_EXPIRY` - Token expiry (7d)

## Features Implemented

### MVP Phase 1 ✅
- [x] Database setup
- [x] Authentication (hardcoded OTP)
- [x] Login page
- [x] JWT session management

### To Be Built
- [ ] Profile setup page (new users)
- [ ] My Profile page (view/edit)
- [ ] My Community page (list all members)
- [ ] Profile components
- [ ] Experience CRUD
- [ ] Education CRUD
- [ ] Skills management
- [ ] Search & filter functionality
- [ ] Admin panel

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email + OTP (7274)
- `POST /api/auth/logout` - Logout and clear session

## Database Connection

Test database connection:
```bash
node -e "require('dotenv').config(); const {Client}=require('pg'); const c=new Client({connectionString:process.env.DATABASE_URL}); c.connect().then(()=>console.log('✅ Connected')).catch(e=>console.log('❌',e.message));"
```

## Notes

- **OTP:** Currently hardcoded to `7274` for MVP. Full Brevo email integration will be added in v2.
- **File Upload:** AWS S3 credentials needed for profile pictures (can use local storage for now).
- **Design System:** Shadcn/ui to be added for consistent components.

## Next Steps

1. Build profile setup flow for new users
2. Create profile view/edit pages
3. Build community listing page
4. Add search and filter functionality
5. Implement admin panel

## Support

Refer to:
- `prd.md` - Complete product requirements
- `database-schema.md` - Database structure
- `.env` - Configuration (do not commit!)

