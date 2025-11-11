'use client';

import BottomNav from '@/components/BottomNav';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* LinkedIn-style Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="https://icmhs.co.ke/wp-content/uploads/2022/07/ICMHS_new_logo-without-any-background.png" 
              alt="ICMHS" 
              className="h-10 w-auto object-contain"
            />
            <span className="text-lg font-semibold text-gray-800">Alumni Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 max-w-lg mx-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

