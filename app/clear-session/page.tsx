'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClearSessionPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all auth data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Clear cookies
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Redirect to login after a brief delay
    setTimeout(() => {
      router.push('/auth/login');
    }, 1000);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Clearing your session...</h1>
        <p className="text-gray-600 mt-2">You will be redirected to login shortly.</p>
      </div>
    </div>
  );
}

