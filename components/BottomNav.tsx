'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Users, PlusCircle, Bell, Briefcase } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Profile', href: '/app', Icon: User, active: true },
    { name: 'Community', href: '/app/community', Icon: Users, active: true },
    { name: 'Post', href: '/app/post', Icon: PlusCircle, active: false },
    { name: 'Notification', href: '/app/notifications', Icon: Bell, active: false },
    { name: 'Jobs', href: '/app/jobs', Icon: Briefcase, active: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.Icon;
          return (
            <Link
              key={item.name}
              href={item.active ? item.href : '#'}
              className={`flex flex-col items-center justify-center flex-1 h-full relative ${
                isActive
                  ? 'text-blue-600'
                  : item.active
                  ? 'text-gray-600 hover:text-gray-900'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              {!item.active && (
                <span className="absolute top-1 right-1 text-[8px] bg-gray-200 text-gray-600 px-1 py-0.5 rounded">
                  Soon
                </span>
              )}
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

