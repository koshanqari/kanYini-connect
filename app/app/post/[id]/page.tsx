'use client';

import { ArrowLeft, Calendar, MapPin, Users, Heart, MessageCircle, Share2, Play, Image as ImageIcon, Headphones, FileText } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

interface Post {
  id: number;
  type: 'text' | 'photo' | 'video' | 'podcast' | 'article';
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
  articleUrl?: string;
  articleTitle?: string;
  articleExcerpt?: string;
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [contentFilter, setContentFilter] = useState<'all' | 'posts' | 'podcasts' | 'articles'>('all');

  // Project details
  const projects: { [key: string]: any } = {
    '1': {
      name: 'Clean Water for Rural Communities',
      startedBy: 'Sarah Mwangi',
      type: 'Infrastructure',
      status: 'Active',
      startDate: 'December 2025',
      location: 'Nairobi, Kenya',
      followers: 456,
      activeMembers: 23,
      description: 'Building sustainable water wells and filtration systems in 15 rural villages. Providing clean drinking water to over 5,000 families and reducing waterborne diseases.',
      impact: 'Over 5,000 families will have access to clean water',
      duration: '12 months',
      moneyRequired: 500000,
      moneyRaised: 380000,
      membersRequired: 30,
      membersJoined: 23
    },
    '2': {
      name: 'Indigenous Knowledge Documentation',
      startedBy: 'Emma Akinyi',
      type: 'Cultural Preservation',
      status: 'Active',
      startDate: 'January 2026',
      location: 'Multiple Locations',
      followers: 289,
      activeMembers: 12,
      description: 'Documenting and preserving traditional ecological knowledge from indigenous communities. Creating digital archives and educational resources for future generations.',
      impact: 'Preserving knowledge from 50+ indigenous communities',
      duration: '18 months',
      moneyRequired: 50000,
      moneyRaised: 50000,
      membersRequired: 15,
      membersJoined: 12
    },
    '3': {
      name: 'Coastal Ecosystem Restoration',
      startedBy: 'John Kariuki',
      type: 'Environmental Conservation',
      status: 'Active',
      startDate: 'November 2025',
      location: 'Mombasa, Kenya',
      followers: 523,
      activeMembers: 45,
      description: 'Restoring mangrove forests and coral reefs along the Kenyan coast. Working with local communities to protect marine biodiversity and improve coastal resilience.',
      impact: '100 hectares of mangrove forest restored',
      duration: '24 months',
      moneyRequired: 150000,
      moneyRaised: 142000,
      membersRequired: 50,
      membersJoined: 45
    },
    '4': {
      name: 'Youth Environmental Leadership Program',
      startedBy: 'Grace Wanjiru',
      type: 'Education & Training',
      status: 'Active',
      startDate: 'October 2025',
      location: 'Nairobi, Kenya',
      followers: 367,
      activeMembers: 18,
      description: 'Training young environmental leaders through mentorship, workshops, and hands-on projects. Building a network of youth activists driving climate action across East Africa.',
      impact: '200+ youth leaders trained annually',
      duration: '36 months',
      moneyRequired: 300000,
      moneyRaised: 185000,
      membersRequired: 25,
      membersJoined: 18
    }
  };

  const project = projects[projectId] || projects['1'];

  // Posts/Updates for each project
  const projectPosts: { [key: string]: Post[] } = {
    '1': [
      {
        id: 1,
        type: 'photo',
        content: 'Venue preparations are underway! The Nairobi Serena Hotel ballroom is being transformed for our gala event. Excited to host 300+ changemakers under one roof!',
        author: 'Sarah Mwangi',
        authorRole: 'Event Coordinator',
        timestamp: '2 hours ago',
        likes: 45,
        comments: 12,
        mediaUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
      },
      {
        id: 5,
        type: 'podcast',
        content: 'Watch our latest video podcast episode featuring community leaders discussing water access challenges and solutions in rural Kenya.',
        author: 'Sarah Mwangi',
        authorRole: 'Project Lead',
        timestamp: '3 days ago',
        likes: 89,
        comments: 24,
        podcastUrl: 'https://example.com/podcast1',
        podcastDuration: '45 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800'
      },
      {
        id: 6,
        type: 'article',
        content: 'Read our comprehensive article on sustainable water management practices and their impact on rural communities.',
        author: 'Emma Akinyi',
        authorRole: 'Research Coordinator',
        timestamp: '1 week ago',
        likes: 156,
        comments: 42,
        articleUrl: 'https://example.com/article1',
        articleTitle: 'Sustainable Water Management in Rural Kenya',
        articleExcerpt: 'Exploring innovative approaches to providing clean water access to underserved communities...'
      },
      {
        id: 2,
        type: 'video',
        content: 'Meet our keynote speaker! Dr. James Kariuki will be sharing insights on climate action and community impact. Don\'t miss this inspiring talk!',
        author: 'David Ochieng',
        authorRole: 'Program Manager',
        timestamp: '5 hours ago',
        likes: 78,
        comments: 23,
        videoThumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800'
      },
      {
        id: 3,
        type: 'text',
        content: 'Tickets are selling fast! Only 50 spots remaining. Early bird pricing ends this Friday. Secure your seat and be part of this impactful evening supporting environmental conservation across Kenya.',
        author: 'Grace Wanjiru',
        authorRole: 'Fundraising Lead',
        timestamp: '1 day ago',
        likes: 34,
        comments: 8
      },
      {
        id: 4,
        type: 'photo',
        content: 'Sneak peek of the auction items! Amazing art pieces donated by local artists. All proceeds go directly to our reforestation projects. 🎨',
        author: 'Peter Maina',
        authorRole: 'Auction Coordinator',
        timestamp: '2 days ago',
        likes: 92,
        comments: 31,
        mediaUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800'
      }
    ],
    '2': [
      {
        id: 1,
        type: 'video',
        content: 'Workshop preview! Learn how to build a compost system at home. Simple, effective, and great for your garden! Join us next week for the full workshop.',
        author: 'Emma Akinyi',
        authorRole: 'Sustainability Coach',
        timestamp: '3 hours ago',
        likes: 56,
        comments: 18,
        videoThumbnail: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800'
      },
      {
        id: 7,
        type: 'podcast',
        content: 'Watch our video podcast with indigenous knowledge keepers sharing traditional farming techniques and their relevance in modern sustainability.',
        author: 'Emma Akinyi',
        authorRole: 'Cultural Researcher',
        timestamp: '5 days ago',
        likes: 112,
        comments: 31,
        podcastUrl: 'https://example.com/podcast2',
        podcastDuration: '38 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800'
      },
      {
        id: 8,
        type: 'article',
        content: 'Discover how traditional ecological knowledge is being preserved and integrated into modern conservation efforts.',
        author: 'John Kariuki',
        authorRole: 'Documentation Lead',
        timestamp: '2 weeks ago',
        likes: 203,
        comments: 58,
        articleUrl: 'https://example.com/article2',
        articleTitle: 'Preserving Indigenous Knowledge for Future Generations',
        articleExcerpt: 'A deep dive into the importance of documenting traditional practices and their role in environmental conservation...'
      },
      {
        id: 2,
        type: 'photo',
        content: 'Our expert speakers are ready! Meet the team who will guide you through sustainable living practices. From organic farming to solar energy solutions. ☀️',
        author: 'Robert Otieno',
        authorRole: 'Workshop Organizer',
        timestamp: '1 day ago',
        likes: 67,
        comments: 15,
        mediaUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800'
      },
      {
        id: 3,
        type: 'text',
        content: '150+ registrations already! This workshop is becoming one of our most popular events. Remember, it\'s completely virtual so you can join from anywhere in Kenya. Interactive Q&A session included!',
        author: 'Lucy Wambui',
        authorRole: 'Community Manager',
        timestamp: '2 days ago',
        likes: 43,
        comments: 9
      }
    ],
    '3': [
      {
        id: 1,
        type: 'photo',
        content: 'Last beach cleanup results: 2.5 TONS of plastic removed! Together we\'re making a real difference. Next cleanup is even bigger - join us!',
        author: 'John Kariuki',
        authorRole: 'Environmental Officer',
        timestamp: '4 hours ago',
        likes: 134,
        comments: 42,
        mediaUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800'
      },
      {
        id: 9,
        type: 'podcast',
        content: 'Video podcast: Marine biologists discuss the impact of plastic pollution on coastal ecosystems and restoration strategies.',
        author: 'John Kariuki',
        authorRole: 'Marine Conservationist',
        timestamp: '1 week ago',
        likes: 178,
        comments: 45,
        podcastUrl: 'https://example.com/podcast3',
        podcastDuration: '52 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800'
      },
      {
        id: 10,
        type: 'article',
        content: 'Comprehensive analysis of coastal ecosystem health and the long-term benefits of mangrove restoration projects.',
        author: 'Lucy Wambui',
        authorRole: 'Research Analyst',
        timestamp: '3 weeks ago',
        likes: 267,
        comments: 73,
        articleUrl: 'https://example.com/article3',
        articleTitle: 'Coastal Ecosystem Restoration: A Path Forward',
        articleExcerpt: 'Examining the science behind mangrove restoration and its critical role in protecting our coastlines...'
      },
      {
        id: 2,
        type: 'video',
        content: 'Watch how we sort and recycle the collected waste. Everything is processed responsibly. Your participation creates lasting impact! ♻️',
        author: 'Mary Njeri',
        authorRole: 'Recycling Coordinator',
        timestamp: '1 day ago',
        likes: 89,
        comments: 27,
        videoThumbnail: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800'
      },
      {
        id: 3,
        type: 'photo',
        content: 'Beautiful Diani Beach deserves our protection! This is why we do what we do. Join 200+ volunteers next weekend and help keep our coastline pristine. 🏖️',
        author: 'Tom Njuguna',
        authorRole: 'Beach Coordinator',
        timestamp: '3 days ago',
        likes: 156,
        comments: 38,
        mediaUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'
      },
      {
        id: 4,
        type: 'text',
        content: 'Important: Please bring reusable water bottles and wear comfortable shoes. We provide gloves, bags, and all cleanup equipment. Families with kids are welcome! Light refreshments will be served.',
        author: 'Alice Kamau',
        authorRole: 'Volunteer Coordinator',
        timestamp: '4 days ago',
        likes: 67,
        comments: 21
      }
    ],
    '4': [
      {
        id: 1,
        type: 'photo',
        content: 'Youth voices matter! These young leaders are preparing powerful presentations on climate action. The future is in great hands!',
        author: 'James Kamau',
        authorRole: 'Youth Program Lead',
        timestamp: '6 hours ago',
        likes: 98,
        comments: 34,
        mediaUrl: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800'
      },
      {
        id: 11,
        type: 'podcast',
        content: 'Video podcast: Young climate activists share their journey and vision for a sustainable future in this inspiring series.',
        author: 'Grace Wanjiru',
        authorRole: 'Program Director',
        timestamp: '4 days ago',
        likes: 145,
        comments: 39,
        podcastUrl: 'https://example.com/podcast4',
        podcastDuration: '41 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800'
      },
      {
        id: 12,
        type: 'article',
        content: 'Exploring the role of youth leadership in driving climate action and building sustainable communities.',
        author: 'David Ochieng',
        authorRole: 'Youth Engagement Lead',
        timestamp: '2 weeks ago',
        likes: 189,
        comments: 52,
        articleUrl: 'https://example.com/article4',
        articleTitle: 'Empowering the Next Generation of Climate Leaders',
        articleExcerpt: 'How youth-led initiatives are transforming environmental advocacy and creating lasting change...'
      },
      {
        id: 2,
        type: 'video',
        content: 'Hear from last year\'s participants! See how the summit transformed their approach to environmental advocacy. This year will be even more impactful! 🎯',
        author: 'Grace Wanjiru',
        authorRole: 'Program Coordinator',
        timestamp: '1 day ago',
        likes: 71,
        comments: 19,
        videoThumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800'
      },
      {
        id: 3,
        type: 'text',
        content: 'Registration closing soon! We have limited seats to ensure quality interactions. If you\'re aged 18-30 and passionate about climate action, this summit is for you. Apply now!',
        author: 'David Ochieng',
        authorRole: 'Registration Manager',
        timestamp: '2 days ago',
        likes: 54,
        comments: 16
      }
    ]
  };

  const allPosts = projectPosts[projectId] || projectPosts['1'];

  // Filter posts based on contentFilter
  const filteredPosts = allPosts.filter(post => {
    if (contentFilter === 'all') return true;
    if (contentFilter === 'posts') return ['text', 'photo', 'video'].includes(post.type);
    if (contentFilter === 'podcasts') return post.type === 'podcast';
    if (contentFilter === 'articles') return post.type === 'article';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-bold text-gray-900">{project.name}</h1>
            <p className="text-xs text-gray-500">{project.type}</p>
          </div>
        </div>
      </div>

      {/* Project Info Card */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
          {/* Header Banner */}
          <div className="bg-kanyini-primary px-6 py-4">
            <h2 className="text-2xl font-bold text-white mb-1">{project.name}</h2>
            <p className="text-sm text-green-100">
              By <span className="font-semibold">{project.startedBy}</span> • {project.type}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {project.status}
              </span>
              <span className="text-sm text-gray-600">Started {project.startDate}</span>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>

            {/* Project Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{project.location}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{project.duration}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Followers</p>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-kanyini-primary" />
                  <span className="text-sm font-medium text-gray-900">{project.followers}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Active Members</p>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">{project.activeMembers}</span>
                </div>
              </div>
            </div>

            {/* Expected Impact */}
            <div className="p-4 bg-green-50 rounded-lg mb-4">
              <p className="text-xs text-green-700 font-semibold mb-1">Expected Impact</p>
              <p className="text-sm text-green-900">{project.impact}</p>
            </div>

            {/* Money Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">Funding Progress</span>
                <span className="text-sm font-bold text-kanyini-primary">
                  {Math.round((project.moneyRaised / project.moneyRequired) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-kanyini-primary h-3 rounded-full transition-all"
                  style={{ width: `${Math.min((project.moneyRaised / project.moneyRequired) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                ${project.moneyRaised.toLocaleString()} raised of ${project.moneyRequired.toLocaleString()} goal
              </p>
            </div>

            {/* Members Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">Team Progress</span>
                <span className="text-sm font-bold text-green-600">
                  {Math.round((project.membersJoined / project.membersRequired) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min((project.membersJoined / project.membersRequired) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {project.membersJoined} members joined • {project.membersRequired - project.membersJoined} more needed
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <button className="border-2 border-kanyini-primary text-kanyini-primary py-3 rounded-lg hover:bg-green-50 transition font-semibold text-sm">
                Follow
              </button>
              <button className="bg-kanyini-primary text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-sm">
                Contribute
              </button>
              <button className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-sm">
                Join Team
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="text-lg font-bold text-gray-900">Updates & Content</h3>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-3">
            <div className="flex gap-2 overflow-x-auto">
              {[
                { id: 'all', label: 'All' },
                { id: 'posts', label: 'Posts' },
                { id: 'podcasts', label: 'Podcasts' },
                { id: 'articles', label: 'Articles' }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setContentFilter(filter.id as any)}
                  className={`px-4 py-1.5 text-sm border rounded-full whitespace-nowrap transition ${
                    contentFilter === filter.id
                      ? 'bg-kanyini-primary text-white border-kanyini-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
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

              {/* Article */}
              {post.type === 'article' && (
                <div className="px-4 pb-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        {post.articleTitle && (
                          <h5 className="text-sm font-bold text-gray-900 mb-1">{post.articleTitle}</h5>
                        )}
                        {post.articleExcerpt && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{post.articleExcerpt}</p>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => window.open(post.articleUrl, '_blank')}
                      className="w-full bg-kanyini-primary text-white py-2.5 rounded-lg hover:bg-green-700 transition font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Read Article
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
          ))}
        </div>

      </div>
    </div>
  );
}

