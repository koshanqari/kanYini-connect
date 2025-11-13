'use client';

import { ArrowLeft, Calendar, MapPin, Users, Heart, MessageCircle, Share2, Play, Image as ImageIcon, Headphones, FileText, QrCode, X, Clock } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface Post {
  id: number;
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
  isVirtual?: boolean;
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [contentFilter, setContentFilter] = useState<'all' | 'posts' | 'podcasts' | 'journals' | 'events'>('all');
  const [showQRCode, setShowQRCode] = useState(false);
  
  // Get the current URL for the QR code
  const projectUrl = typeof window !== 'undefined' ? `${window.location.origin}/app/post/${projectId}` : '';

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
    },
    '5': {
      name: 'Urban Reforestation Initiative',
      startedBy: 'Robert Otieno',
      type: 'Community',
      status: 'Active',
      startDate: 'September 2025',
      location: 'Nairobi, Kenya',
      followers: 678,
      activeMembers: 52,
      description: 'Planting 50,000 native trees in urban areas to combat air pollution and create green spaces. Partnering with schools and community groups for long-term maintenance.',
      impact: '50,000 trees planted across urban areas',
      duration: '24 months',
      moneyRequired: 200000,
      moneyRaised: 200000,
      membersRequired: 60,
      membersJoined: 52
    },
    '6': {
      name: 'Renewable Energy for Schools',
      startedBy: 'David Ochieng',
      type: 'Fundraiser',
      status: 'Active',
      startDate: 'December 2025',
      location: 'Multiple Locations',
      followers: 1240,
      activeMembers: 8,
      description: 'Installing solar panels in 20 rural schools to provide reliable electricity for classrooms and computer labs. Enabling digital learning and reducing carbon footprint.',
      impact: '20 schools powered by renewable energy',
      duration: '18 months',
      moneyRequired: 800000,
      moneyRaised: 620000,
      membersRequired: 10,
      membersJoined: 8
    },
    '7': {
      name: 'Sustainable Agriculture Training',
      startedBy: 'Lucy Wambui',
      type: 'Community',
      status: 'Active',
      startDate: 'January 2026',
      location: 'Nairobi, Kenya',
      followers: 234,
      activeMembers: 6,
      description: 'Teaching smallholder farmers organic farming techniques, soil conservation, and water management. Improving crop yields while protecting the environment.',
      impact: '500+ farmers trained in sustainable practices',
      duration: '12 months',
      moneyRequired: 75000,
      moneyRaised: 45000,
      membersRequired: 8,
      membersJoined: 6
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
        type: 'journal',
        content: 'Read our comprehensive journal on sustainable water management practices and their impact on rural communities.',
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
        content: 'Sneak peek of the auction items! Amazing art pieces donated by local artists. All proceeds go directly to our reforestation projects.',
        author: 'Peter Maina',
        authorRole: 'Auction Coordinator',
        timestamp: '2 days ago',
        likes: 92,
        comments: 31,
        mediaUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800'
      },
      {
        id: 13,
        type: 'podcast',
        content: 'In-depth conversation with water engineers about innovative filtration technologies being deployed in rural areas.',
        author: 'Sarah Mwangi',
        authorRole: 'Project Lead',
        timestamp: '1 week ago',
        likes: 124,
        comments: 38,
        podcastUrl: 'https://example.com/podcast1b',
        podcastDuration: '42 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80'
      },
      {
        id: 14,
        type: 'journal',
        content: 'Case study: How community-led water management committees are ensuring long-term sustainability of water projects.',
        author: 'Emma Akinyi',
        authorRole: 'Community Development Lead',
        timestamp: '2 weeks ago',
        likes: 201,
        comments: 56,
        journalUrl: 'https://example.com/article1b',
        journalTitle: 'Community-Led Water Management: Success Stories',
        journalExcerpt: 'Examining how local communities are taking ownership of water infrastructure and ensuring its maintenance...'
      },
      {
        id: 15,
        type: 'podcast',
        content: 'Community leaders share their experiences and the transformative impact of clean water access on their villages.',
        author: 'David Ochieng',
        authorRole: 'Field Coordinator',
        timestamp: '2 weeks ago',
        likes: 145,
        comments: 41,
        podcastUrl: 'https://example.com/podcast1c',
        podcastDuration: '48 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1594022645736-05c2b2d5b7f1?w=800&q=80'
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
        type: 'journal',
        content: 'Discover how traditional ecological knowledge is being preserved and integrated into modern conservation efforts.',
        author: 'John Kariuki',
        authorRole: 'Documentation Lead',
        timestamp: '2 weeks ago',
        likes: 203,
        comments: 58,
        journalUrl: 'https://example.com/article2',
        journalTitle: 'Preserving Indigenous Knowledge for Future Generations',
        journalExcerpt: 'A deep dive into the importance of documenting traditional practices and their role in environmental conservation...'
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
      },
      {
        id: 16,
        type: 'podcast',
        content: 'Video podcast series: Traditional healers and modern scientists discuss the medicinal properties of indigenous plants.',
        author: 'Emma Akinyi',
        authorRole: 'Cultural Researcher',
        timestamp: '1 week ago',
        likes: 167,
        comments: 44,
        podcastUrl: 'https://example.com/podcast2b',
        podcastDuration: '55 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80'
      },
      {
        id: 17,
        type: 'journal',
        content: 'Research findings on how traditional farming methods can reduce chemical dependency and improve soil health.',
        author: 'John Kariuki',
        authorRole: 'Agricultural Researcher',
        timestamp: '3 weeks ago',
        likes: 234,
        comments: 67,
        journalUrl: 'https://example.com/article2b',
        journalTitle: 'Traditional Farming Meets Modern Science',
        journalExcerpt: 'Bridging the gap between age-old agricultural wisdom and contemporary sustainable practices...'
      },
      {
        id: 18,
        type: 'podcast',
        content: 'Elders from different communities share stories about environmental stewardship passed down through generations.',
        author: 'Robert Otieno',
        authorRole: 'Documentation Specialist',
        timestamp: '2 weeks ago',
        likes: 156,
        comments: 39,
        podcastUrl: 'https://example.com/podcast2c',
        podcastDuration: '40 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80'
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
        type: 'journal',
        content: 'Comprehensive analysis of coastal ecosystem health and the long-term benefits of mangrove restoration projects.',
        author: 'Lucy Wambui',
        authorRole: 'Research Analyst',
        timestamp: '3 weeks ago',
        likes: 267,
        comments: 73,
        journalUrl: 'https://example.com/article3',
        journalTitle: 'Coastal Ecosystem Restoration: A Path Forward',
        journalExcerpt: 'Examining the science behind mangrove restoration and its critical role in protecting our coastlines...'
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
      },
      {
        id: 19,
        type: 'podcast',
        content: 'Video podcast: Oceanographers and local fishermen discuss sustainable fishing practices and marine conservation.',
        author: 'John Kariuki',
        authorRole: 'Marine Conservationist',
        timestamp: '2 weeks ago',
        likes: 198,
        comments: 52,
        podcastUrl: 'https://example.com/podcast3b',
        podcastDuration: '50 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&q=80'
      },
      {
        id: 20,
        type: 'journal',
        content: 'Scientific study on the effectiveness of mangrove restoration in protecting coastal communities from storm surges.',
        author: 'Lucy Wambui',
        authorRole: 'Research Analyst',
        timestamp: '1 month ago',
        likes: 289,
        comments: 84,
        journalUrl: 'https://example.com/article3b',
        journalTitle: 'Mangroves: Nature\'s Coastal Defense System',
        journalExcerpt: 'Understanding how mangrove forests act as natural barriers and their role in climate adaptation...'
      },
      {
        id: 21,
        type: 'podcast',
        content: 'Community members share their journey from witnessing beach degradation to becoming active conservation advocates.',
        author: 'Mary Njeri',
        authorRole: 'Community Outreach Lead',
        timestamp: '3 weeks ago',
        likes: 167,
        comments: 43,
        podcastUrl: 'https://example.com/podcast3c',
        podcastDuration: '44 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80'
      },
      {
        id: 22,
        type: 'journal',
        content: 'Economic analysis of coastal tourism and how conservation efforts are creating sustainable livelihoods for local communities.',
        author: 'Tom Njuguna',
        authorRole: 'Economic Development Officer',
        timestamp: '1 month ago',
        likes: 245,
        comments: 71,
        journalUrl: 'https://example.com/article3c',
        journalTitle: 'Conservation as Economic Opportunity',
        journalExcerpt: 'How protecting marine ecosystems is generating income and employment for coastal communities...'
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
      },
      {
        id: 23,
        type: 'podcast',
        content: 'Video podcast: Young climate leaders from across Africa share their innovative solutions and grassroots initiatives.',
        author: 'Grace Wanjiru',
        authorRole: 'Program Director',
        timestamp: '1 week ago',
        likes: 201,
        comments: 58,
        podcastUrl: 'https://example.com/podcast4b',
        podcastDuration: '46 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80'
      },
      {
        id: 24,
        type: 'journal',
        content: 'Analysis of youth-led climate movements and their impact on policy change and public awareness across East Africa.',
        author: 'David Ochieng',
        authorRole: 'Youth Engagement Lead',
        timestamp: '3 weeks ago',
        likes: 267,
        comments: 89,
        journalUrl: 'https://example.com/article4b',
        journalTitle: 'The Power of Youth in Climate Action',
        journalExcerpt: 'Examining how young activists are driving environmental policy and mobilizing communities for change...'
      },
      {
        id: 25,
        type: 'podcast',
        content: 'Mentorship stories: Experienced environmental leaders discuss how they guide the next generation of climate advocates.',
        author: 'James Kamau',
        authorRole: 'Youth Program Lead',
        timestamp: '2 weeks ago',
        likes: 178,
        comments: 47,
        podcastUrl: 'https://example.com/podcast4c',
        podcastDuration: '39 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80'
      },
      {
        id: 26,
        type: 'journal',
        content: 'Best practices guide for organizing effective climate action campaigns and building sustainable youth networks.',
        author: 'Grace Wanjiru',
        authorRole: 'Program Director',
        timestamp: '1 month ago',
        likes: 312,
        comments: 95,
        journalUrl: 'https://example.com/article4c',
        journalTitle: 'Building Effective Climate Action Networks',
        journalExcerpt: 'A practical guide to organizing, mobilizing, and sustaining youth-led environmental movements...'
      }
    ],
    '5': [
      {
        id: 1,
        type: 'photo',
        content: 'Tree planting day in Mathare! Over 200 volunteers came together to plant 1,500 saplings. Community spirit is amazing!',
        author: 'Robert Otieno',
        authorRole: 'Project Lead',
        timestamp: '2 hours ago',
        likes: 145,
        comments: 38,
        mediaUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80'
      },
      {
        id: 27,
        type: 'podcast',
        content: 'Video podcast: Urban planners and environmentalists discuss the role of green spaces in city development and public health.',
        author: 'Robert Otieno',
        authorRole: 'Urban Planning Coordinator',
        timestamp: '1 week ago',
        likes: 189,
        comments: 52,
        podcastUrl: 'https://example.com/podcast5b',
        podcastDuration: '43 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80'
      },
      {
        id: 28,
        type: 'journal',
        content: 'Research on the air quality improvements and health benefits of urban tree planting initiatives.',
        author: 'Alice Kamau',
        authorRole: 'Environmental Health Researcher',
        timestamp: '2 weeks ago',
        likes: 256,
        comments: 78,
        journalUrl: 'https://example.com/article5b',
        journalTitle: 'Urban Trees: Breathing Life into Cities',
        journalExcerpt: 'How strategic tree planting is reducing air pollution and improving quality of life in urban areas...'
      },
      {
        id: 29,
        type: 'podcast',
        content: 'Community members share their experiences participating in the reforestation project and its impact on their neighborhoods.',
        author: 'Peter Maina',
        authorRole: 'Community Engagement Lead',
        timestamp: '2 weeks ago',
        likes: 167,
        comments: 44,
        podcastUrl: 'https://example.com/podcast5c',
        podcastDuration: '37 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80'
      },
      {
        id: 30,
        type: 'journal',
        content: 'Case study: How school partnerships are ensuring long-term tree survival and student environmental education.',
        author: 'Robert Otieno',
        authorRole: 'Project Lead',
        timestamp: '3 weeks ago',
        likes: 223,
        comments: 65,
        journalUrl: 'https://example.com/article5c',
        journalTitle: 'Schools as Guardians of Urban Forests',
        journalExcerpt: 'Exploring how educational institutions are becoming key partners in urban reforestation efforts...'
      },
      {
        id: 2,
        type: 'text',
        content: 'Milestone reached! We\'ve planted 25,000 trees so far. Halfway to our goal! Thank you to all volunteers and donors.',
        author: 'Grace Wanjiru',
        authorRole: 'Program Coordinator',
        timestamp: '3 days ago',
        likes: 234,
        comments: 67
      }
    ],
    '6': [
      {
        id: 1,
        type: 'photo',
        content: 'Solar panel installation complete at Mwamba Primary School! Students now have reliable electricity for their computer lab.',
        author: 'David Ochieng',
        authorRole: 'Project Manager',
        timestamp: '5 hours ago',
        likes: 312,
        comments: 89,
        mediaUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80'
      },
      {
        id: 31,
        type: 'podcast',
        content: 'Video podcast: Energy experts discuss the future of renewable energy in African schools and its educational impact.',
        author: 'David Ochieng',
        authorRole: 'Energy Specialist',
        timestamp: '1 week ago',
        likes: 278,
        comments: 71,
        podcastUrl: 'https://example.com/podcast6b',
        podcastDuration: '49 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80'
      },
      {
        id: 32,
        type: 'journal',
        content: 'Analysis of how solar power is transforming rural education and bridging the digital divide.',
        author: 'Emma Akinyi',
        authorRole: 'Education Technology Lead',
        timestamp: '2 weeks ago',
        likes: 345,
        comments: 102,
        journalUrl: 'https://example.com/article6b',
        journalTitle: 'Solar Power: Illuminating Rural Education',
        journalExcerpt: 'Examining the transformative impact of renewable energy on educational outcomes in underserved communities...'
      },
      {
        id: 33,
        type: 'podcast',
        content: 'Teachers and students share how reliable electricity has changed their learning experience and opened new opportunities.',
        author: 'Lucy Wambui',
        authorRole: 'Education Coordinator',
        timestamp: '2 weeks ago',
        likes: 201,
        comments: 58,
        podcastUrl: 'https://example.com/podcast6c',
        podcastDuration: '41 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80'
      },
      {
        id: 34,
        type: 'journal',
        content: 'Economic and environmental benefits of transitioning schools to renewable energy sources.',
        author: 'David Ochieng',
        authorRole: 'Project Manager',
        timestamp: '1 month ago',
        likes: 298,
        comments: 87,
        journalUrl: 'https://example.com/article6c',
        journalTitle: 'The Economics of Solar Schools',
        journalExcerpt: 'Understanding the long-term cost savings and environmental impact of renewable energy in education...'
      },
      {
        id: 2,
        type: 'video',
        content: 'Watch the installation process! Our team worked tirelessly to bring clean energy to this school. The smiles on the students\' faces say it all!',
        author: 'John Kariuki',
        authorRole: 'Installation Lead',
        timestamp: '1 day ago',
        likes: 267,
        comments: 73,
        videoThumbnail: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80'
      }
    ],
    '7': [
      {
        id: 1,
        type: 'photo',
        content: 'Farmers learning organic composting techniques! Hands-on training sessions are making a real difference in their farming practices.',
        author: 'Lucy Wambui',
        authorRole: 'Training Coordinator',
        timestamp: '4 hours ago',
        likes: 134,
        comments: 42,
        mediaUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80'
      },
      {
        id: 35,
        type: 'podcast',
        content: 'Video podcast: Agricultural experts and farmers discuss sustainable farming methods and their impact on crop yields.',
        author: 'Lucy Wambui',
        authorRole: 'Agricultural Specialist',
        timestamp: '1 week ago',
        likes: 167,
        comments: 48,
        podcastUrl: 'https://example.com/podcast7b',
        podcastDuration: '45 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80'
      },
      {
        id: 36,
        type: 'journal',
        content: 'Study on the effectiveness of organic farming training programs in improving food security and farmer incomes.',
        author: 'Mary Njeri',
        authorRole: 'Research Analyst',
        timestamp: '2 weeks ago',
        likes: 234,
        comments: 69,
        journalUrl: 'https://example.com/article7b',
        journalTitle: 'Organic Farming: A Path to Food Security',
        journalExcerpt: 'How sustainable agricultural practices are helping smallholder farmers increase productivity and income...'
      },
      {
        id: 37,
        type: 'podcast',
        content: 'Success stories from farmers who have adopted sustainable practices and seen remarkable improvements in their harvests.',
        author: 'Tom Njuguna',
        authorRole: 'Field Extension Officer',
        timestamp: '2 weeks ago',
        likes: 189,
        comments: 51,
        podcastUrl: 'https://example.com/podcast7c',
        podcastDuration: '38 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80'
      },
      {
        id: 38,
        type: 'journal',
        content: 'Guide to implementing water-efficient irrigation systems and soil conservation techniques for small-scale farmers.',
        author: 'Lucy Wambui',
        authorRole: 'Training Coordinator',
        timestamp: '3 weeks ago',
        likes: 267,
        comments: 81,
        journalUrl: 'https://example.com/article7c',
        journalTitle: 'Water Management in Sustainable Agriculture',
        journalExcerpt: 'Practical strategies for conserving water and maintaining soil health in smallholder farming systems...'
      },
      {
        id: 2,
        type: 'text',
        content: 'Next training session scheduled for next Saturday! We\'ll cover crop rotation and natural pest control. All farmers welcome!',
        author: 'Alice Kamau',
        authorRole: 'Program Assistant',
        timestamp: '2 days ago',
        likes: 98,
        comments: 27
      }
    ]
  };

  // Events for each project
  const projectEvents: { [key: string]: Event[] } = {
    '1': [
      {
        id: 1,
        title: 'Water Well Installation Workshop',
        type: 'workshop',
        date: 'March 15, 2025',
        time: '10:00 AM - 2:00 PM',
        location: 'Community Center, Nairobi',
        attendees: 45,
        maxAttendees: 50,
        description: 'Learn about sustainable water well installation techniques and maintenance. Hands-on training included.',
        organizer: 'Sarah Mwangi',
        isVirtual: false
      },
      {
        id: 2,
        title: 'Clean Water Initiative Meetup',
        type: 'meetup',
        date: 'March 22, 2025',
        time: '6:00 PM - 8:00 PM',
        location: 'Virtual',
        attendees: 120,
        description: 'Monthly meetup to discuss progress, challenges, and next steps for the clean water project.',
        organizer: 'Project Team',
        isVirtual: true
      }
    ],
    '2': [
      {
        id: 3,
        title: 'Indigenous Knowledge Documentation Conference',
        type: 'conference',
        date: 'April 5, 2025',
        time: '9:00 AM - 5:00 PM',
        location: 'Cultural Center, Nairobi',
        attendees: 200,
        maxAttendees: 250,
        description: 'A full-day conference bringing together elders, researchers, and community members to document and preserve indigenous knowledge.',
        organizer: 'Cultural Preservation Team',
        isVirtual: false
      }
    ],
    '3': [
      {
        id: 4,
        title: 'Coastal Ecosystem Restoration Webinar',
        type: 'webinar',
        date: 'March 20, 2025',
        time: '3:00 PM - 4:30 PM',
        location: 'Virtual',
        attendees: 85,
        description: 'Learn about mangrove restoration techniques and their impact on coastal ecosystems.',
        organizer: 'Marine Biology Team',
        isVirtual: true
      }
    ],
    '4': [
      {
        id: 5,
        title: 'Youth Leadership Training Workshop',
        type: 'workshop',
        date: 'March 18, 2025',
        time: '9:00 AM - 4:00 PM',
        location: 'Youth Center, Nairobi',
        attendees: 60,
        maxAttendees: 60,
        description: 'Intensive training session for young environmental leaders. Topics include project management, community engagement, and advocacy.',
        organizer: 'Youth Program Coordinators',
        isVirtual: false
      }
    ],
    '5': [
      {
        id: 6,
        title: 'Tree Planting Social Event',
        type: 'social',
        date: 'March 25, 2025',
        time: '8:00 AM - 12:00 PM',
        location: 'Urban Park, Nairobi',
        attendees: 150,
        description: 'Join us for a community tree planting event. Bring your family and friends!',
        organizer: 'Urban Reforestation Team',
        isVirtual: false
      }
    ]
  };

  const allPosts = projectPosts[projectId] || projectPosts['1'];
  const allEvents = projectEvents[projectId] || projectEvents['1'] || [];

  // Filter posts and events based on contentFilter
  const filteredPosts = allPosts.filter(post => {
    if (contentFilter === 'all') return true;
    if (contentFilter === 'posts') return ['text', 'photo', 'video'].includes(post.type);
    if (contentFilter === 'podcasts') return post.type === 'podcast';
    if (contentFilter === 'journals') return post.type === 'journal';
    if (contentFilter === 'events') return false; // Posts are not events
    return true;
  });

  const filteredEvents = contentFilter === 'all' || contentFilter === 'events' ? allEvents : [];

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
            <div className="space-y-3 pt-2">
              {/* Row 1: Follow | Share QR Code */}
              <div className="grid grid-cols-2 gap-3">
                <button className="border-2 border-kanyini-primary text-kanyini-primary py-3 rounded-lg hover:bg-green-50 transition font-semibold text-sm">
                  Follow
                </button>
                <button 
                  onClick={() => setShowQRCode(true)}
                  className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
                >
                  <QrCode className="w-4 h-4" />
                  Share QR Code
                </button>
              </div>
              {/* Row 2: Join Team | Contribute */}
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-sm">
                  Join Team
                </button>
                <button className="bg-kanyini-primary text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-sm">
                  Contribute
                </button>
              </div>
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
                { id: 'journals', label: 'Journals' },
                { id: 'events', label: 'Events' }
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
          
          {/* Show empty state if no posts and events when filtered */}
          {contentFilter !== 'events' && filteredPosts.length === 0 && filteredEvents.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No {contentFilter === 'all' ? 'content' : contentFilter} found</p>
            </div>
          )}

          {/* Render Posts */}
          {contentFilter !== 'events' && filteredPosts.map((post) => (
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
          ))}

          {/* Render Events */}
          {filteredEvents.map((event) => (
            <div key={`event-${event.id}`} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Event Header */}
              <div className="flex items-start justify-between mb-3 p-4">
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
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-700 mb-3">{event.description}</p>
              </div>

              {/* Event Details Grid */}
              <div className="px-4 pb-3">
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
                    <Users className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
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
                      <span className="text-xs text-gray-600">
                        {event.attendees} / {event.maxAttendees} attendees
                      </span>
                      <span className="text-xs text-gray-600">
                        {Math.round((event.attendees / event.maxAttendees) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-kanyini-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((event.attendees / event.maxAttendees) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* RSVP Button */}
                <button
                  className="w-full bg-kanyini-primary text-white py-2.5 rounded-lg hover:bg-green-700 transition font-semibold text-sm"
                >
                  RSVP to Event
                </button>
              </div>
            </div>
          ))}

          {/* Show empty state for events only */}
          {contentFilter === 'events' && filteredEvents.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No events found</p>
            </div>
          )}
        </div>

      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Share Project</h3>
              <button
                onClick={() => setShowQRCode(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
                {projectUrl && (
                  <QRCodeSVG
                    value={projectUrl}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                )}
              </div>
              <p className="text-sm text-gray-600 text-center mb-2">
                Scan this QR code to view and contribute to this project
              </p>
              <p className="text-xs text-gray-500 text-center break-all px-4">
                {projectUrl}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: project.name,
                      text: `Check out this project: ${project.name}`,
                      url: projectUrl,
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(projectUrl);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="flex-1 bg-kanyini-primary text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-sm"
              >
                Share Link
              </button>
              <button
                onClick={() => setShowQRCode(false)}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

