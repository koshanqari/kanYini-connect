'use client';

import { Calendar, MapPin, Users, Clock, Video, DollarSign, Mic, Heart, Search, Filter } from 'lucide-react';
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

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('upcoming');
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

  const filters = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'virtual', label: 'Virtual' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'community', label: 'Community' },
    { id: 'fundraiser', label: 'Fundraisers' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (activeFilter === 'virtual') {
      matchesFilter = event.isVirtual === true;
    } else if (activeFilter !== 'upcoming') {
      matchesFilter = event.type === activeFilter;
    }
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-kanyini-primary to-green-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Projects</h1>
        <p className="text-green-50">Join community events and initiatives</p>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">15+</div>
            <div className="text-xs text-green-100">Events/Month</div>
          </div>
          <div>
            <div className="text-2xl font-bold">2.5K+</div>
            <div className="text-xs text-green-100">Participants</div>
          </div>
          <div>
            <div className="text-2xl font-bold">50+</div>
            <div className="text-xs text-green-100">Partners</div>
          </div>
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
          <span className="text-sm font-medium text-gray-700">Filter Projects</span>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {filters.map(filter => (
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

      {/* Projects Count */}
      <div className="px-1">
        <p className="text-sm text-gray-600">
          {filteredEvents.length} {filteredEvents.length === 1 ? 'project' : 'projects'} found
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-4 pb-4">
        {filteredEvents.length === 0 ? (
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
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-kanyini-primary to-green-700 rounded-lg p-6 text-white text-center">
        <h3 className="text-lg font-bold mb-2">Want to start a project?</h3>
        <p className="text-sm text-green-50 mb-4">
          Partner with us to launch community projects and initiatives
        </p>
        <button className="bg-white text-kanyini-primary px-6 py-2 rounded-lg font-medium hover:bg-green-50 transition">
          Contact Us
        </button>
      </div>
    </div>
  );
}

