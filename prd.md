Alumni Portal - PRD (MVP)

---

# Tech Stack

## Framework
- **Next.js 14** - Full-stack React framework (App Router)
- **React 18** - UI library
- **TypeScript** - Type safety

## Styling & UI
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Shadcn/ui** - Design system & UI components (Radix UI + Tailwind)
- **Lucide Icons** - Icon library
- **Custom Design Tokens** - Consistent colors, spacing, typography

### Design System
- LinkedIn-inspired professional design
- Consistent component library across the app
- Mobile-first responsive breakpoints
- Dark mode support (optional for v2)

## Backend (Next.js API Routes)
- **Next.js API Routes** - Backend API (no separate Express needed)
- **PostgreSQL** - Database
- **pg** or **Prisma** - Database client/ORM
- **JWT** - Authentication/Session management
- **Brevo (Sendinblue)** - Email service for OTP

## File Storage
- **AWS S3** - Profile picture storage

## Hosting
- **Vercel** - Free hosting for Next.js (frontend + backend together)
- **Database:** PostgreSQL on hosted server (current setup)
- **Alternative:** Railway (hosts everything in one place)

---

# Authentication

## Sign In / Sign Up (MVP - Simplified)
- User enters email
- User enters OTP: **7274** (hardcoded for MVP)
- If new user → create account and redirect to profile setup
- If existing user → log in and redirect to My Profile
- Session management using JWT tokens

**Note:** Full OTP via Brevo email will be implemented in v2

---

# Main App
Responsive web app like LinkedIn (mobile-first design)
- Mobile: Bottom navigation tabs
- Desktop: Sidebar navigation
- Optimized for mobile view first

## Navigation (tabs as in linkedin)
- My Profile (defualt)
- My Community
- Post (coming soon)
- Notification (coming soon)
- Jobs (coming soon)

## My Profile
This again can be like the profile of linkedin

### Basic Detials
- Upload/change profile picture
- Name (editable)
- About (text area)

### Contact Details
- Email
- Phone (country code + number)
- Preferred Time to Connect (text area)
- Preferred Way to Connect (text area)
- Other social Media Links etc

### My Expertise
- Text area (e.g., "I am working in Saudi in petroleum industry etc etc")

### Experience
- Add/Edit/Delete work experiences
- Fields: Designation, Industry, Company or Organization Name, Desc, Start Date, End Date (or Present), Location - City, State, Country

### Education
- Add/Edit/Delete records
- Toggle: Education or Certificate
- Fields: School(null if certificate), Course, Degree or Certificate name, Start Date, EndDate (or present), Desc

### Skills
- Add/Remove skills
- this will first show all the previously added skills in dropdown, if my skill is something different then I can click on new skill 
---

## My Community

### Display all members in community
Just like my network in linkedin
- search - using name, phone, email, designation
- Filter using - Skills, Experience Location (city, state, country), Course

### View any member's profile (after clicking the profile)

### Post, Notification, Jobs 
- there should be a short page telling these this will be comming soon
- Share this app with your friends (copy link)

---

# Admin Panel
- View all user profiles
- Edit any profile
- Verify profiles

