'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, LogOut, Shield } from 'lucide-react';

export default function AdminLayout({
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
    
    const parsedUser = JSON.parse(userData);
    
    // Check if user is admin
    if (parsedUser.role !== 'admin') {
      router.push('/app');
      return;
    }
    
    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:inline">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-4 border-b-2 border-indigo-600 text-indigo-600 font-medium text-sm"
            >
              <Users className="w-4 h-4" />
              All Users
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}

