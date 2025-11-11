import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if accessing protected routes
  if (pathname.startsWith('/app') || pathname.startsWith('/admin')) {
    // Check for auth token in cookies
    const token = request.cookies.get('auth_token')?.value || request.cookies.get('token')?.value;

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/admin/:path*'],
};

