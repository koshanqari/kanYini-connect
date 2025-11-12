'use client';

import { Bell, Heart, MessageCircle, UserPlus, CheckCircle, DollarSign, Users, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'project_update' | 'contribution' | 'member_join' | 'milestone';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: any;
  iconColor: string;
  iconBg: string;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const router = useRouter();

  const notifications: Notification[] = [
    {
      id: 1,
      type: 'project_update',
      title: 'Clean Water for Rural Communities',
      message: 'New update posted: "3rd water well successfully installed in Makueni village"',
      timestamp: '2 hours ago',
      read: false,
      icon: Bell,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      actionUrl: '/app/post/1'
    },
    {
      id: 2,
      type: 'like',
      title: 'Your comment received 12 likes',
      message: 'People are appreciating your thoughts on the Coastal Ecosystem Restoration project.',
      timestamp: '3 hours ago',
      read: false,
      icon: Heart,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-50'
    },
    {
      id: 3,
      type: 'member_join',
      title: '5 new members joined',
      message: 'Urban Reforestation Initiative gained 5 new active members today.',
      timestamp: '5 hours ago',
      read: false,
      icon: Users,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50',
      actionUrl: '/app/post/5'
    },
    {
      id: 4,
      type: 'contribution',
      title: 'Thank you for your contribution!',
      message: 'Your $5,000 contribution to Clean Water project has been received.',
      timestamp: '1 day ago',
      read: true,
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50'
    },
    {
      id: 5,
      type: 'project_update',
      title: 'Coastal Ecosystem Restoration',
      message: 'New update: "2,000 mangrove seedlings planted along the Mombasa coast"',
      timestamp: '1 day ago',
      read: true,
      icon: Bell,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      actionUrl: '/app/post/3'
    },
    {
      id: 6,
      type: 'follow',
      title: 'Sarah Mwangi started following you',
      message: 'Project Lead at Clean Water for Rural Communities',
      timestamp: '2 days ago',
      read: true,
      icon: UserPlus,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50'
    },
    {
      id: 7,
      type: 'milestone',
      title: 'Project milestone achieved!',
      message: 'Youth Environmental Leadership Program reached 100% funding goal!',
      timestamp: '2 days ago',
      read: true,
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50',
      actionUrl: '/app/post/4'
    },
    {
      id: 8,
      type: 'comment',
      title: 'New comment on your post',
      message: 'John Kariuki commented: "Great work on the documentation!"',
      timestamp: '3 days ago',
      read: true,
      icon: MessageCircle,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50'
    },
    {
      id: 9,
      type: 'project_update',
      title: 'Renewable Energy for Schools',
      message: 'Only 2 more members needed to start the project. Join now!',
      timestamp: '4 days ago',
      read: true,
      icon: AlertCircle,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-50',
      actionUrl: '/app/post/6'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-kanyini-primary to-green-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <div className="bg-white text-kanyini-primary px-3 py-1 rounded-full text-sm font-bold">
              {unreadCount} new
            </div>
          )}
        </div>
        <p className="text-green-50">Stay updated with all your activities</p>
      </div>

      {/* Mark all as read button */}
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <button className="text-sm text-kanyini-primary hover:underline font-medium">
            Mark all as read
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-2 pb-4">
        {notifications.map((notification) => {
          const IconComponent = notification.icon;
          
          return (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`bg-white rounded-lg shadow p-4 transition ${
                notification.actionUrl ? 'cursor-pointer hover:shadow-md' : ''
              } ${!notification.read ? 'border-l-4 border-kanyini-primary' : ''}`}
            >
              <div className="flex gap-3">
                <div className={`w-10 h-10 ${notification.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className={`w-5 h-5 ${notification.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`text-sm font-semibold text-gray-900 ${!notification.read ? 'font-bold' : ''}`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-kanyini-primary rounded-full flex-shrink-0 mt-1.5"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400">{notification.timestamp}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state (if needed) */}
      {notifications.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications yet</h3>
          <p className="text-sm text-gray-500">
            When you get notifications, they'll show up here
          </p>
        </div>
      )}
    </div>
  );
}
