'use client';

import { Calendar, MapPin, Users, Clock, GraduationCap, Briefcase, Award, Search, Filter, Heart, Video, Mic } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Event {
  id: number;
  title: string;
  type: 'fundraiser' | 'workshop' | 'community' | 'virtual' | 'campaign';
  startedBy: string;
  date: string;
  time: string;
  location: string;
  followers: number;
  activeMembers: number;
  description: string;
  moneyRequired: number;
  moneyRaised: number;
  membersRequired: number;
  membersJoined: number;
  image?: string;
  featured?: boolean;
  icon: any;
  color: string;
  isVirtual?: boolean;
}

interface Fellowship {
  id: number;
  title: string;
  organization: string;
  duration: string;
  stipend: string;
  location: string;
  positions: number;
  positionsFilled: number;
  applicationDeadline: string;
  startDate: string;
  description: string;
  requirements: string[];
  type: 'leadership' | 'research' | 'community' | 'technical';
  icon: any;
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'projects' | 'programs'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const router = useRouter();

  const events: Event[] = [
    {
      id: 1,
      title: 'Clean Water for Rural Communities',
      type: 'fundraiser',
      startedBy: 'Sarah Mwangi',
      date: 'Started Dec 2025',
      time: 'Ongoing',
      location: 'Nairobi, Kenya',
      followers: 456,
      activeMembers: 23,
      description: 'Building sustainable water wells and filtration systems in 15 rural villages. Providing clean drinking water to over 5,000 families and reducing waterborne diseases.',
      moneyRequired: 500000,
      moneyRaised: 380000,
      membersRequired: 30,
      membersJoined: 23,
      featured: true,
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
      isVirtual: false
    },
    {
      id: 2,
      title: 'Indigenous Knowledge Documentation',
      type: 'community',
      startedBy: 'Emma Akinyi',
      date: 'Started Jan 2026',
      time: 'Ongoing',
      location: 'Multiple Locations',
      followers: 289,
      activeMembers: 12,
      description: 'Documenting and preserving traditional ecological knowledge from indigenous communities. Creating digital archives and educational resources for future generations.',
      moneyRequired: 50000,
      moneyRaised: 50000,
      membersRequired: 15,
      membersJoined: 12,
      icon: Video,
      color: 'from-blue-500 to-indigo-600',
      isVirtual: true
    },
    {
      id: 3,
      title: 'Coastal Ecosystem Restoration',
      type: 'community',
      startedBy: 'John Kariuki',
      date: 'Started Nov 2025',
      time: 'Ongoing',
      location: 'Mombasa, Kenya',
      followers: 523,
      activeMembers: 45,
      description: 'Restoring mangrove forests and coral reefs along the Kenyan coast. Working with local communities to protect marine biodiversity and improve coastal resilience.',
      moneyRequired: 150000,
      moneyRaised: 142000,
      membersRequired: 50,
      membersJoined: 45,
      icon: Users,
      color: 'from-cyan-500 to-blue-600',
      isVirtual: false
    },
    {
      id: 4,
      title: 'Youth Environmental Leadership Program',
      type: 'workshop',
      startedBy: 'Grace Wanjiru',
      date: 'Started Oct 2025',
      time: 'Ongoing',
      location: 'Nairobi, Kenya',
      followers: 367,
      activeMembers: 18,
      description: 'Training young environmental leaders through mentorship, workshops, and hands-on projects. Building a network of youth activists driving climate action across East Africa.',
      moneyRequired: 300000,
      moneyRaised: 185000,
      membersRequired: 25,
      membersJoined: 18,
      icon: Mic,
      color: 'from-purple-500 to-indigo-600',
      isVirtual: false
    },
    {
      id: 5,
      title: 'Urban Reforestation Initiative',
      type: 'community',
      startedBy: 'Robert Otieno',
      date: 'Started Sep 2025',
      time: 'Ongoing',
      location: 'Nairobi, Kenya',
      followers: 678,
      activeMembers: 52,
      description: 'Planting 50,000 native trees in urban areas to combat air pollution and create green spaces. Partnering with schools and community groups for long-term maintenance.',
      moneyRequired: 200000,
      moneyRaised: 200000,
      membersRequired: 60,
      membersJoined: 52,
      icon: Users,
      color: 'from-green-500 to-emerald-600',
      isVirtual: false
    },
    {
      id: 6,
      title: 'Renewable Energy for Schools',
      type: 'fundraiser',
      startedBy: 'David Ochieng',
      date: 'Started Dec 2025',
      time: 'Ongoing',
      location: 'Multiple Locations',
      followers: 1240,
      activeMembers: 8,
      description: 'Installing solar panels in 20 rural schools to provide reliable electricity for classrooms and computer labs. Enabling digital learning and reducing carbon footprint.',
      moneyRequired: 800000,
      moneyRaised: 620000,
      membersRequired: 10,
      membersJoined: 8,
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      isVirtual: true,
      featured: true
    },
    {
      id: 7,
      title: 'Sustainable Agriculture Training',
      type: 'community',
      startedBy: 'Lucy Wambui',
      date: 'Started Jan 2026',
      time: 'Ongoing',
      location: 'Nairobi, Kenya',
      followers: 234,
      activeMembers: 6,
      description: 'Teaching smallholder farmers organic farming techniques, soil conservation, and water management. Improving crop yields while protecting the environment.',
      moneyRequired: 80000,
      moneyRaised: 55000,
      membersRequired: 10,
      membersJoined: 6,
      icon: Video,
      color: 'from-amber-500 to-orange-600',
      isVirtual: false
    }
  ];

  const fellowships: Fellowship[] = [
    {
      id: 1,
      title: 'Environmental Leadership Fellowship',
      organization: 'Kanyini Earth Project',
      duration: '12 months',
      stipend: '$1,500/month',
      location: 'Nairobi, Kenya',
      positions: 10,
      positionsFilled: 7,
      applicationDeadline: 'January 31, 2026',
      startDate: 'March 1, 2026',
      description: 'Join our flagship leadership program designed to train the next generation of environmental leaders. Work on real conservation projects while developing skills in project management, community organizing, and climate advocacy.',
      requirements: ['Bachelor\'s degree or equivalent', '2+ years experience in environmental work', 'Strong communication skills', 'Passion for climate action'],
      type: 'leadership',
      icon: Award
    },
    {
      id: 2,
      title: 'Community Organizing Fellowship',
      organization: 'Kanyini Earth Project',
      duration: '6 months',
      stipend: '$1,200/month',
      location: 'Multiple Locations',
      positions: 15,
      positionsFilled: 12,
      applicationDeadline: 'December 20, 2025',
      startDate: 'January 15, 2026',
      description: 'Work directly with rural communities to implement sustainable practices. Learn grassroots organizing, conduct workshops, and build local capacity for environmental stewardship.',
      requirements: ['Experience working with communities', 'Fluent in Swahili and English', 'Willingness to travel', 'Cultural sensitivity'],
      type: 'community',
      icon: Users
    },
    {
      id: 3,
      title: 'Research & Documentation Fellowship',
      organization: 'Kanyini Earth Project',
      duration: '9 months',
      stipend: '$1,300/month',
      location: 'Nairobi, Kenya (with field work)',
      positions: 5,
      positionsFilled: 3,
      applicationDeadline: 'February 15, 2026',
      startDate: 'April 1, 2026',
      description: 'Conduct environmental research, document indigenous knowledge, and contribute to policy papers. Ideal for those interested in bridging traditional wisdom with modern conservation science.',
      requirements: ['Master\'s degree or pursuing', 'Research experience', 'Strong writing skills', 'Data analysis capabilities'],
      type: 'research',
      icon: GraduationCap
    },
    {
      id: 4,
      title: 'Youth Climate Action Fellowship',
      organization: 'Kanyini Earth Project',
      duration: '6 months',
      stipend: '$1,000/month',
      location: 'Virtual + On-site',
      positions: 20,
      positionsFilled: 15,
      applicationDeadline: 'January 10, 2026',
      startDate: 'February 1, 2026',
      description: 'Designed for young activists (18-25 years). Learn climate advocacy, social media campaigns, and organize youth-led initiatives. Includes mentorship from experienced environmental leaders.',
      requirements: ['Age 18-25', 'Active in climate advocacy', 'Social media savvy', 'Team player'],
      type: 'leadership',
      icon: Award
    },
    {
      id: 5,
      title: 'Technical Conservation Fellowship',
      organization: 'Kanyini Earth Project',
      duration: '12 months',
      stipend: '$1,600/month',
      location: 'Coastal Region, Kenya',
      positions: 8,
      positionsFilled: 5,
      applicationDeadline: 'March 1, 2026',
      startDate: 'May 1, 2026',
      description: 'Hands-on work in mangrove restoration, coral reef protection, and coastal ecosystem monitoring. Technical training in marine conservation and GIS mapping included.',
      requirements: ['Background in marine biology/environmental science', 'Diving certification (preferred)', 'Physical fitness', 'Technical aptitude'],
      type: 'technical',
      icon: Briefcase
    }
  ];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'fundraiser', label: 'Fundraisers' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'community', label: 'Community' },
    { id: 'virtual', label: 'Virtual' }
  ];

  const fellowshipFilters = [
    { id: 'all', label: 'All Programs' },
    { id: 'leadership', label: 'Leadership' },
    { id: 'research', label: 'Research' },
    { id: 'community', label: 'Community' },
    { id: 'technical', label: 'Technical' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (activeFilter === 'all') {
      matchesFilter = true;
    } else if (activeFilter === 'virtual') {
      matchesFilter = event.isVirtual === true;
    } else {
      matchesFilter = event.type === activeFilter;
    }
    
    return matchesSearch && matchesFilter;
  });

  const filteredFellowships = fellowships.filter(fellowship => {
    const matchesSearch = fellowship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fellowship.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fellowship.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || fellowship.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-kanyini-primary to-green-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">{activeTab === 'projects' ? 'Projects' : 'Programs & Fellowships'}</h1>
        <p className="text-green-50">{activeTab === 'projects' ? 'Join community projects and initiatives' : 'Apply for fellowship programs'}</p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{activeTab === 'projects' ? '7' : '5'}</div>
            <div className="text-xs text-green-100">{activeTab === 'projects' ? 'Active Projects' : 'Programs'}</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{activeTab === 'projects' ? '2.5K+' : '58'}</div>
            <div className="text-xs text-green-100">{activeTab === 'projects' ? 'Participants' : 'Positions'}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex">
          <button
            onClick={() => {
              setActiveTab('projects');
              setActiveFilter('all');
            }}
            className={`flex-1 py-3 text-sm font-semibold transition ${
              activeTab === 'projects'
                ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                : 'text-gray-600 border-b-2 border-transparent'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => {
              setActiveTab('programs');
              setActiveFilter('all');
            }}
            className={`flex-1 py-3 text-sm font-semibold transition ${
              activeTab === 'programs'
                ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                : 'text-gray-600 border-b-2 border-transparent'
            }`}
          >
            Programs
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by name, location, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {activeTab === 'projects' ? 'Filter Projects' : 'Filter Programs'}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {(activeTab === 'projects' ? filters : fellowshipFilters).map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-1.5 text-sm border rounded-full whitespace-nowrap transition ${
                activeFilter === filter.id
                  ? 'bg-kanyini-primary text-white border-kanyini-primary'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="px-1">
        <p className="text-sm text-gray-600">
          {activeTab === 'projects' 
            ? `${filteredEvents.length} ${filteredEvents.length === 1 ? 'project' : 'projects'} found`
            : `${filteredFellowships.length} ${filteredFellowships.length === 1 ? 'program' : 'programs'} found`
          }
        </p>
      </div>

      {/* List */}
      <div className="space-y-4 pb-4">
        {activeTab === 'projects' ? (
          filteredEvents.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No projects found matching your criteria</p>
            </div>
          ) : (
            filteredEvents.map((event) => {
            const moneyPercentage = Math.round((event.moneyRaised / event.moneyRequired) * 100);
            const membersPercentage = Math.round((event.membersJoined / event.membersRequired) * 100);
            
            return (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <div 
                  onClick={() => router.push(`/app/post/${event.id}`)}
                  className="p-4 cursor-pointer"
                >
                  {/* Project Header */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600">Started by <span className="font-medium text-kanyini-primary">{event.startedBy}</span></p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{event.description}</p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600 truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-center">
                      <Users className="w-4 h-4 text-kanyini-primary" />
                      <span className="text-xs text-gray-900 font-medium">{event.followers} followers</span>
                    </div>
                    <div className="flex items-center gap-1 justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-900 font-medium">{event.activeMembers} active</span>
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
                      ${event.moneyRaised.toLocaleString()} of ${event.moneyRequired.toLocaleString()}
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
                      {event.membersJoined} of {event.membersRequired} members
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 px-4 pb-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle follow action
                    }}
                    className="flex-1 border-2 border-kanyini-primary text-kanyini-primary py-2 rounded-lg hover:bg-green-50 transition font-medium text-sm"
                  >
                    Follow Project
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle contribute action
                    }}
                    className="flex-1 bg-kanyini-primary text-white py-2 rounded-lg hover:bg-green-700 transition font-medium text-sm"
                  >
                    Contribute
                  </button>
                </div>
              </div>
            );
          })
        )
        ) : (
          filteredFellowships.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No programs found matching your criteria</p>
            </div>
          ) : (
            filteredFellowships.map((fellowship) => {
              const IconComponent = fellowship.icon;
              const positionsPercentage = Math.round((fellowship.positionsFilled / fellowship.positions) * 100);
              
              return (
                <div key={fellowship.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
                  {/* Fellowship Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-kanyini-primary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-kanyini-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{fellowship.title}</h3>
                      <p className="text-xs text-gray-500">{fellowship.organization}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-3">{fellowship.description}</p>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm font-medium text-gray-900">{fellowship.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{fellowship.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Positions</p>
                        <p className="text-sm font-medium text-gray-900">{fellowship.positionsFilled}/{fellowship.positions}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Deadline</p>
                        <p className="text-sm font-medium text-red-600">{fellowship.applicationDeadline}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stipend Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full mb-3">
                    <span className="text-sm font-semibold text-green-700">{fellowship.stipend}</span>
                  </div>

                  {/* Positions Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">Positions Filled</span>
                      <span className="text-xs font-bold text-kanyini-primary">{positionsPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-kanyini-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(positionsPercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Requirements:</p>
                    <div className="flex flex-wrap gap-2">
                      {fellowship.requirements.map((req, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-kanyini-primary text-white py-2.5 rounded-lg hover:bg-green-700 transition font-semibold text-sm">
                    Apply Now
                  </button>
                </div>
              );
            })
          )
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-kanyini-primary to-green-700 rounded-lg p-6 text-white text-center">
        <h3 className="text-lg font-bold mb-2">
          {activeTab === 'projects' ? 'Want to start a project?' : 'Have questions about fellowships?'}
        </h3>
        <p className="text-sm text-green-50 mb-4">
          {activeTab === 'projects' 
            ? 'Partner with us to launch community projects and initiatives'
            : 'Learn more about our fellowship programs and application process'
          }
        </p>
        <button className="bg-white text-kanyini-primary px-6 py-2 rounded-lg font-medium hover:bg-green-50 transition">
          Contact Us
        </button>
      </div>
    </div>
  );
}

