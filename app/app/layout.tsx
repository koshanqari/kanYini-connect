'use client';

import BottomNav from '@/components/BottomNav';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Bell } from 'lucide-react';

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
              src="https://keaprojects.com.au/wp-content/uploads/2025/06/KEaP-Logo-v5-1024x846.webp" 
              alt="Kanyini Earth Project" 
              className="h-10 w-auto object-contain"
            />
            <span className="text-lg font-semibold text-kanyini-primary">Kanyini Connect</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/app/notifications"
              className="p-2 text-gray-600 hover:text-kanyini-primary hover:bg-gray-100 rounded-full transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </Link>
            <Link
              href="/app/messages"
              className="flex items-center gap-2 px-4 py-2 bg-kanyini-primary text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
              title="Messages"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Messages</span>
            </Link>
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

