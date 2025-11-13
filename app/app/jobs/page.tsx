'use client';

import { MapPin, Users, Heart, MessageCircle, Share2, Play, Headphones, FileText, Calendar, Clock, User } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  projectId: number;
  projectName: string;
  type: 'text' | 'photo' | 'video' | 'podcast' | 'journal';
  content: string;
  author: string;
  authorRole: string;
  timestamp: string;
  likes: number;
  comments: number;
  mediaUrl?: string;
  videoThumbnail?: string;
  podcastUrl?: string;
  podcastDuration?: string;
  journalUrl?: string;
  journalTitle?: string;
  journalExcerpt?: string;
}

interface NewProject {
  id: number;
  title: string;
  startedBy: string;
  location: string;
  followers: number;
  activeMembers: number;
  description: string;
  moneyRequired: number;
  moneyRaised: number;
  membersRequired: number;
  membersJoined: number;
}

interface Event {
  id: number;
  title: string;
  type: 'workshop' | 'meetup' | 'webinar' | 'conference' | 'social';
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees?: number;
  description: string;
  organizer: string;
  isVirtual: boolean;
  projectId: number;
  projectName: string;
}

export default function FeedPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const router = useRouter();

  // Posts from followed projects
  const feedPosts: Post[] = [
    {
      id: 1,
      projectId: 1,
      projectName: 'Clean Water for Rural Communities',
      type: 'photo',
      content: 'Amazing progress today! We successfully installed our 3rd water well in Makueni village. The community gathered to celebrate this milestone. Clean water is now accessible to 500+ families!',
      author: 'Sarah Mwangi',
      authorRole: 'Project Lead',
      timestamp: '2 hours ago',
      likes: 142,
      comments: 28,
      mediaUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80'
    },
    {
      id: 2,
      projectId: 3,
      projectName: 'Coastal Ecosystem Restoration',
      type: 'text',
      content: 'Incredible teamwork by our volunteers! This week, we planted 2,000 mangrove seedlings along the Mombasa coast. These trees will help protect our shoreline and provide habitat for marine life. Thank you to everyone who participated!',
      author: 'John Kariuki',
      authorRole: 'Coordinator',
      timestamp: '5 hours ago',
      likes: 89,
      comments: 15
    },
    {
      id: 3,
      projectId: 5,
      projectName: 'Urban Reforestation Initiative',
      type: 'video',
      content: 'Check out this time-lapse of our tree planting day in Karura Forest! Over 150 volunteers came together to plant 1,200 indigenous trees. Together, we\'re making Nairobi greener!',
      author: 'Robert Otieno',
      authorRole: 'Environmental Officer',
      timestamp: '1 day ago',
      likes: 234,
      comments: 42,
      videoThumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80'
    },
    {
      id: 4,
      projectId: 2,
      projectName: 'Indigenous Knowledge Documentation',
      type: 'photo',
      content: 'Honored to spend the day with Elder Chebet from the Maasai community, recording traditional ecological knowledge about medicinal plants. This wisdom must be preserved for future generations.',
      author: 'Emma Akinyi',
      authorRole: 'Cultural Researcher',
      timestamp: '1 day ago',
      likes: 167,
      comments: 31,
      mediaUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80'
    },
    {
      id: 5,
      projectId: 4,
      projectName: 'Youth Environmental Leadership Program',
      type: 'text',
      content: 'Day 3 of our youth leadership workshop! 25 young activists from across East Africa are learning about climate advocacy, project management, and community organizing. The energy and passion in the room is incredible!',
      author: 'Grace Wanjiru',
      authorRole: 'Program Director',
      timestamp: '2 days ago',
      likes: 198,
      comments: 37
    },
    {
      id: 6,
      projectId: 1,
      projectName: 'Clean Water for Rural Communities',
      type: 'podcast',
      content: 'Watch our latest video podcast episode featuring community leaders discussing water access challenges and solutions in rural Kenya.',
      author: 'Sarah Mwangi',
      authorRole: 'Project Lead',
      timestamp: '3 days ago',
      likes: 89,
      comments: 24,
      podcastUrl: 'https://example.com/podcast1',
      podcastDuration: '45 min',
      videoThumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80'
    },
    {
      id: 7,
      projectId: 2,
      projectName: 'Indigenous Knowledge Documentation',
      type: 'journal',
      content: 'Read our comprehensive article on sustainable water management practices and their impact on rural communities.',
      author: 'Emma Akinyi',
      authorRole: 'Research Coordinator',
      timestamp: '1 week ago',
      likes: 156,
      comments: 42,
      journalUrl: 'https://example.com/article1',
      journalTitle: 'Sustainable Water Management in Rural Kenya',
      journalExcerpt: 'Exploring innovative approaches to providing clean water access to underserved communities...'
    },
    {
      id: 8,
      projectId: 3,
      projectName: 'Coastal Ecosystem Restoration',
      type: 'podcast',
      content: 'Video podcast: Marine biologists discuss the impact of plastic pollution on coastal ecosystems and restoration strategies.',
      author: 'John Kariuki',
      authorRole: 'Marine Conservationist',
      timestamp: '1 week ago',
      likes: 178,
      comments: 45,
      podcastUrl: 'https://example.com/podcast3',
      podcastDuration: '52 min',
      videoThumbnail: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80'
    },
    {
      id: 9,
      projectId: 4,
      projectName: 'Youth Environmental Leadership Program',
      type: 'journal',
      content: 'Exploring the role of youth leadership in driving climate action and building sustainable communities.',
      author: 'David Ochieng',
      authorRole: 'Youth Engagement Lead',
      timestamp: '2 weeks ago',
      likes: 189,
      comments: 52,
      journalUrl: 'https://example.com/article4',
      journalTitle: 'Empowering the Next Generation of Climate Leaders',
      journalExcerpt: 'How youth-led initiatives are transforming environmental advocacy and creating lasting change...'
    }
  ];

  // New projects to join
  const newProjects: NewProject[] = [
    {
      id: 6,
      title: 'Renewable Energy for Schools',
      startedBy: 'David Ochieng',
      location: 'Multiple Locations',
      followers: 1240,
      activeMembers: 8,
      description: 'Installing solar panels in 20 rural schools to provide reliable electricity for classrooms and computer labs. Enabling digital learning and reducing carbon footprint.',
      moneyRequired: 800000,
      moneyRaised: 620000,
      membersRequired: 10,
      membersJoined: 8
    },
    {
      id: 7,
      title: 'Sustainable Agriculture Training',
      startedBy: 'Lucy Wambui',
      location: 'Nairobi, Kenya',
      followers: 234,
      activeMembers: 6,
      description: 'Teaching smallholder farmers organic farming techniques, soil conservation, and water management. Improving crop yields while protecting the environment.',
      moneyRequired: 80000,
      moneyRaised: 55000,
      membersRequired: 10,
      membersJoined: 6
    }
  ];

  // Events data
  const events: Event[] = [
    {
      id: 1,
      title: 'Community Networking Night',
      type: 'social',
      date: 'December 18, 2025',
      time: '6:00 PM - 9:00 PM',
      location: 'Nairobi City Hall',
      attendees: 45,
      maxAttendees: 80,
      description: 'Join fellow community members for an evening of networking, food, and conversations about environmental action.',
      organizer: 'Sarah Mwangi',
      isVirtual: false,
      projectId: 1,
      projectName: 'Clean Water for Rural Communities'
    },
    {
      id: 2,
      title: 'Climate Action Workshop',
      type: 'workshop',
      date: 'December 22, 2025',
      time: '10:00 AM - 2:00 PM',
      location: 'Virtual (Zoom)',
      attendees: 67,
      maxAttendees: 100,
      description: 'Interactive workshop on practical climate action strategies. Learn how to reduce your carbon footprint.',
      organizer: 'John Kariuki',
      isVirtual: true,
      projectId: 3,
      projectName: 'Coastal Ecosystem Restoration'
    },
    {
      id: 3,
      title: 'Youth Climate Forum',
      type: 'meetup',
      date: 'January 20, 2026',
      time: '4:00 PM - 7:00 PM',
      location: 'University of Nairobi',
      attendees: 56,
      maxAttendees: 100,
      description: 'Forum for young environmental activists to share experiences, collaborate on projects, and build a stronger youth climate movement.',
      organizer: 'Robert Otieno',
      isVirtual: false,
      projectId: 4,
      projectName: 'Youth Environmental Leadership Program'
    }
  ];

  const filters = ['all', 'posts', 'podcasts', 'journals', 'events', 'new projects'];

  // Combine and filter feed items
  const getFeedItems = () => {
    if (activeFilter === 'posts') {
      return feedPosts.filter(p => ['text', 'photo', 'video'].includes(p.type)).map(p => ({ type: 'post' as const, data: p }));
    }
    if (activeFilter === 'podcasts') {
      return feedPosts.filter(p => p.type === 'podcast').map(p => ({ type: 'post' as const, data: p }));
    }
    if (activeFilter === 'journals') {
      return feedPosts.filter(p => p.type === 'journal').map(p => ({ type: 'post' as const, data: p }));
    }
    if (activeFilter === 'events') {
      return events.map(e => ({ type: 'event' as const, data: e }));
    }
    if (activeFilter === 'new projects') {
      return newProjects.map(p => ({ type: 'project' as const, data: p }));
    }
    
    // Mix all content for 'all' filter
    const items: Array<{ type: 'post' | 'project' | 'event', data: Post | NewProject | Event }> = [];
    feedPosts.forEach(post => items.push({ type: 'post', data: post }));
    events.forEach(event => items.push({ type: 'event', data: event }));
    newProjects.forEach(project => items.push({ type: 'project', data: project }));
    return items;
  };

  const feedItems = getFeedItems();

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-kanyini-primary to-green-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Community Feed</h1>
        <p className="text-green-50">Stay updated with latest activities from projects you follow</p>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-green-100">Following</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{feedPosts.length}</div>
            <div className="text-xs text-green-100">Total Updates</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{newProjects.length}</div>
            <div className="text-xs text-green-100">New Projects</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3">
        <div className="flex gap-2 overflow-x-auto">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 text-sm border rounded-full whitespace-nowrap transition ${
                activeFilter === filter
                  ? 'bg-kanyini-primary text-white border-kanyini-primary'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4 pb-4">
        {feedItems.map((item, index) => {
          if (item.type === 'post') {
            const post = item.data as Post;
            return (
              <div key={`post-${post.id}`} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Project Header */}
                <div 
                  onClick={() => router.push(`/app/post/${post.projectId}`)}
                  className="bg-kanyini-primary px-4 py-2 cursor-pointer hover:bg-green-700 transition"
                >
                  <p className="text-white font-semibold text-sm">{post.projectName}</p>
                </div>

                {/* Post Header */}
                <div className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-kanyini-primary to-green-700 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {post.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{post.author}</h4>
                    <p className="text-xs text-gray-500">{post.authorRole} • {post.timestamp}</p>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-gray-700 text-sm leading-relaxed">{post.content}</p>
                </div>

                {/* Post Media */}
                {post.type === 'photo' && post.mediaUrl && (
                  <div className="relative">
                    <img
                      src={post.mediaUrl}
                      alt="Post image"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                {post.type === 'video' && post.videoThumbnail && (
                  <div className="relative">
                    <img
                      src={post.videoThumbnail}
                      alt="Video thumbnail"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-kanyini-primary ml-1" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Podcast */}
                {post.type === 'podcast' && (
                  <div className="px-4 pb-4">
                    {post.videoThumbnail ? (
                      <div 
                        className="relative cursor-pointer"
                        onClick={() => window.open(post.podcastUrl, '_blank')}
                      >
                        <img
                          src={post.videoThumbnail}
                          alt="Podcast thumbnail"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-kanyini-primary ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-white bg-opacity-90 rounded-lg p-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Headphones className="w-4 h-4 text-gray-600" />
                              <span className="text-xs font-medium text-gray-900">Video Podcast</span>
                            </div>
                            {post.podcastDuration && (
                              <span className="text-xs text-gray-600">{post.podcastDuration}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Headphones className="w-6 h-6 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Podcast Episode</p>
                            {post.podcastDuration && (
                              <p className="text-xs text-gray-500">{post.podcastDuration}</p>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => window.open(post.podcastUrl, '_blank')}
                          className="w-full bg-kanyini-primary text-white py-2.5 rounded-lg hover:bg-green-700 transition font-semibold text-sm flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Listen Now
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Journal */}
                {post.type === 'journal' && (
                  <div className="px-4 pb-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          {post.journalTitle && (
                            <h5 className="text-sm font-bold text-gray-900 mb-1">{post.journalTitle}</h5>
                          )}
                          {post.journalExcerpt && (
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{post.journalExcerpt}</p>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => window.open(post.journalUrl, '_blank')}
                        className="w-full bg-kanyini-primary text-white py-2.5 rounded-lg hover:bg-green-700 transition font-semibold text-sm flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Read Journal
                      </button>
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-6">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-kanyini-primary transition">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-kanyini-primary transition ml-auto">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          } else if (item.type === 'event') {
            const event = item.data as Event;
            return (
              <div key={`event-${event.id}`} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Project Header */}
                <div 
                  onClick={() => router.push(`/app/post/${event.projectId}`)}
                  className="bg-kanyini-primary px-4 py-2 cursor-pointer hover:bg-green-700 transition"
                >
                  <p className="text-white font-semibold text-sm">{event.projectName}</p>
                </div>

                {/* Event Content */}
                <div className="p-4">
                  {/* Event Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          event.type === 'workshop' ? 'bg-purple-100 text-purple-700' :
                          event.type === 'meetup' ? 'bg-blue-100 text-blue-700' :
                          event.type === 'webinar' ? 'bg-green-100 text-green-700' :
                          event.type === 'conference' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                        {event.isVirtual && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                            Virtual
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-3">{event.description}</p>

                {/* Event Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm font-medium text-gray-900">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="text-sm font-medium text-gray-900">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Organizer</p>
                      <p className="text-sm font-medium text-gray-900">{event.organizer}</p>
                    </div>
                  </div>
                </div>

                {/* Attendees Progress */}
                {event.maxAttendees && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {event.attendees} / {event.maxAttendees} attending
                        </span>
                      </div>
                      <span className="text-xs font-medium text-kanyini-primary">
                        {Math.round((event.attendees / event.maxAttendees) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-kanyini-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((event.attendees / event.maxAttendees) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                  {/* RSVP Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle RSVP
                    }}
                    className="w-full bg-kanyini-primary text-white py-2.5 rounded-lg hover:bg-green-700 transition font-semibold text-sm"
                  >
                    RSVP to Event
                  </button>
                </div>
              </div>
            );
          } else {
            const project = item.data as NewProject;
            const moneyPercentage = Math.round((project.moneyRaised / project.moneyRequired) * 100);
            const membersPercentage = Math.round((project.membersJoined / project.membersRequired) * 100);

            return (
              <div key={`project-${project.id}`} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                {/* New Project Badge */}
                <div className="bg-green-100 px-4 py-2">
                  <p className="text-green-800 font-semibold text-xs">New Project to Join</p>
                </div>

                <div 
                  onClick={() => router.push(`/app/post/${project.id}`)}
                  className="p-4 cursor-pointer"
                >
                  {/* Project Header */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-600">Started by <span className="font-medium text-kanyini-primary">{project.startedBy}</span></p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{project.description}</p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600 truncate">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-center">
                      <Users className="w-4 h-4 text-kanyini-primary" />
                      <span className="text-xs text-gray-900 font-medium">{project.followers} followers</span>
                    </div>
                    <div className="flex items-center gap-1 justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-900 font-medium">{project.activeMembers} active</span>
                    </div>
                  </div>

                  {/* Money Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">Funds Raised</span>
                      <span className="text-xs font-bold text-kanyini-primary">{moneyPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className="bg-kanyini-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(moneyPercentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600">
                      ${project.moneyRaised.toLocaleString()} of ${project.moneyRequired.toLocaleString()}
                    </p>
                  </div>

                  {/* Members Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">Members Joined</span>
                      <span className="text-xs font-bold text-green-600">{membersPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(membersPercentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600">
                      {project.membersJoined} of {project.membersRequired} members
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 px-4 pb-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex-1 border-2 border-kanyini-primary text-kanyini-primary py-2 rounded-lg hover:bg-green-50 transition font-medium text-sm"
                  >
                    Follow Project
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex-1 bg-kanyini-primary text-white py-2 rounded-lg hover:bg-green-700 transition font-medium text-sm"
                  >
                    Contribute
                  </button>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

