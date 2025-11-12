'use client';

import { TreePine, Droplet, GraduationCap, Users, Heart, TrendingUp, Award, Calendar, CheckCircle, Target, ArrowUp, Sparkles } from 'lucide-react';

export default function ImpactDashboardPage() {
  const impactStats = [
    {
      id: 1,
      title: 'Trees Planted',
      current: 8534,
      goal: 10000,
      icon: TreePine,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      unit: 'trees'
    },
    {
      id: 2,
      title: 'Clean Water Access',
      current: 12,
      goal: 20,
      icon: Droplet,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      unit: 'communities'
    },
    {
      id: 3,
      title: 'Students Reached',
      current: 3450,
      goal: 5000,
      icon: GraduationCap,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      unit: 'students'
    },
    {
      id: 4,
      title: 'Active Volunteers',
      current: 248,
      goal: 300,
      icon: Users,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      unit: 'volunteers'
    }
  ];

  const recentAchievements = [
    {
      id: 1,
      title: 'Milestone: 5,000 Trees Planted!',
      description: 'Our community reached a major milestone in the reforestation campaign.',
      date: '3 days ago',
      icon: Award,
      color: 'text-yellow-600'
    },
    {
      id: 2,
      title: 'New Water System Installed',
      description: 'Clean water now accessible to 1,200 people in Turkana County.',
      date: '1 week ago',
      icon: Droplet,
      color: 'text-blue-600'
    },
    {
      id: 3,
      title: 'Beach Cleanup Success',
      description: '2.5 tons of plastic waste removed from Mombasa beaches.',
      date: '2 weeks ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 4,
      title: 'Youth Summit Completed',
      description: '150 young leaders trained in climate advocacy and action.',
      date: '3 weeks ago',
      icon: GraduationCap,
      color: 'text-purple-600'
    }
  ];

  const upcomingGoals = [
    {
      id: 1,
      title: 'Plant 10,000 Trees by March 2026',
      progress: 85,
      daysLeft: 45,
      icon: Target
    },
    {
      id: 2,
      title: 'Reach 5,000 Students in Environmental Education',
      progress: 69,
      daysLeft: 90,
      icon: Target
    },
    {
      id: 3,
      title: 'Establish 20 Clean Water Points',
      progress: 60,
      daysLeft: 120,
      icon: Target
    }
  ];

  const communityStats = [
    { label: 'Total Impact Hours', value: '15,240', icon: TrendingUp, change: '+12%' },
    { label: 'Projects Completed', value: '34', icon: CheckCircle, change: '+8' },
    { label: 'Lives Impacted', value: '18,500+', icon: Heart, change: '+2.3K' },
    { label: 'Partner Organizations', value: '42', icon: Users, change: '+5' }
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-kanyini-primary to-green-700 rounded-lg p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Community Impact</h1>
        </div>
        <p className="text-green-50">Together, we're making a real difference</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {communityStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <ArrowUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Projects Progress */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Current Projects</h2>
        <div className="space-y-4">
          {impactStats.map((stat) => {
            const IconComponent = stat.icon;
            const percentage = Math.round((stat.current / stat.goal) * 100);
            
            return (
              <div key={stat.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 ${stat.textColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{stat.title}</h3>
                      <p className="text-xs text-gray-500">
                        {stat.current.toLocaleString()} / {stat.goal.toLocaleString()} {stat.unit}
                      </p>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${stat.textColor}`}>
                    {percentage}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`bg-gradient-to-r ${stat.color} h-2.5 rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Goals */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Goals</h2>
        <div className="space-y-3">
          {upcomingGoals.map((goal) => (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 bg-kanyini-primary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-kanyini-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{goal.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{goal.daysLeft} days left</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-kanyini-primary h-2 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">{goal.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Achievements</h2>
        <div className="space-y-3">
          {recentAchievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <div key={achievement.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <IconComponent className={`w-5 h-5 ${achievement.color}`} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {achievement.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-1">{achievement.description}</p>
                  <p className="text-xs text-gray-400">{achievement.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Impact Map Placeholder */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Our Reach</h2>
        <p className="text-sm text-gray-600 mb-4">
          Kanyini Earth Project operates across Kenya, impacting communities in 15+ counties.
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-kanyini-primary">15+</div>
            <div className="text-xs text-gray-600">Counties</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-kanyini-primary">47</div>
            <div className="text-xs text-gray-600">Active Sites</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-kanyini-primary">125+</div>
            <div className="text-xs text-gray-600">Communities</div>
          </div>
        </div>
      </div>

      {/* Monthly Impact Report */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">This Month's Impact</h2>
          <span className="text-xs text-gray-500">November 2025</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Trees Planted</span>
            <span className="font-semibold text-green-600">+1,234</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Volunteer Hours</span>
            <span className="font-semibold text-blue-600">2,456 hrs</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Waste Collected</span>
            <span className="font-semibold text-purple-600">3.2 tons</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-700">New Members</span>
            <span className="font-semibold text-orange-600">+34</span>
          </div>
        </div>
      </div>
    </div>
  );
}

