'use client';

import { useEffect, useState } from 'react';
import { MapPin, User, Search, Loader2, CheckCircle2, ChevronLeft, ChevronRight, Calendar, Clock, Users as UsersIcon, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Alumni {
  id: string;
  name: string;
  email: string;
  is_verified?: boolean;
  designation: string;
  company: string;
  location: string;
  profile_picture_url?: string;
  about?: string;
  phone?: string;
  skills: string[];
  courses: string[];
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

export default function MyCommunityPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'community'>('events');
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'skills' | 'location' | 'education' | 'work'>('all');
  const [eventFilter, setEventFilter] = useState<'all' | 'workshop' | 'meetup' | 'webinar' | 'conference' | 'social' | 'virtual'>('all');
  const [filterValue, setFilterValue] = useState('');
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const router = useRouter();

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterValue, activeFilter]);

  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        let url = '/api/community?';
        
        if (searchQuery) {
          url += `search=${encodeURIComponent(searchQuery)}&`;
        }
        
        if (activeFilter !== 'all' && filterValue) {
          url += `${activeFilter}=${encodeURIComponent(filterValue)}&`;
        }
        
        // Add pagination
        url += `page=${currentPage}&limit=20`;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAlumni(data.alumni);
          setIsVerified(data.currentUserIsVerified || false);
          setPagination(data.pagination);
        } else {
          console.error('Failed to fetch alumni');
        }
      } catch (error) {
        console.error('Error fetching alumni:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [searchQuery, filterValue, activeFilter, currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewProfile = async (alumniId: string) => {
    // Check if this is the current user's profile
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // If the clicked profile is the current user's profile, redirect to their own profile page
        if (user.id === parseInt(alumniId, 10)) {
          router.push('/app');
          return;
        }
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
    }
    // Otherwise, navigate to the community profile page
    router.push(`/app/community/${alumniId}`);
  };

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
      description: 'Join fellow community members for an evening of networking, food, and conversations about environmental action. A great opportunity to make new connections and share ideas.',
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
      description: 'Interactive workshop on practical climate action strategies. Learn how to reduce your carbon footprint and engage your community in sustainability efforts.',
      organizer: 'John Kariuki',
      isVirtual: true,
      projectId: 3,
      projectName: 'Coastal Ecosystem Restoration'
    },
    {
      id: 3,
      title: 'Monthly Community Meetup',
      type: 'meetup',
      date: 'January 5, 2026',
      time: '3:00 PM - 5:00 PM',
      location: 'Java House, Westlands',
      attendees: 23,
      maxAttendees: 40,
      description: 'Casual monthly gathering to catch up with community members, share updates on projects, and discuss upcoming initiatives over coffee.',
      organizer: 'Grace Wanjiru',
      isVirtual: false,
      projectId: 4,
      projectName: 'Youth Environmental Leadership Program'
    },
    {
      id: 4,
      title: 'Environmental Leadership Webinar',
      type: 'webinar',
      date: 'January 12, 2026',
      time: '2:00 PM - 4:00 PM',
      location: 'Virtual (Teams)',
      attendees: 89,
      maxAttendees: 150,
      description: 'Learn from experienced environmental leaders about building effective grassroots movements and scaling impact. Q&A session included.',
      organizer: 'Emma Akinyi',
      isVirtual: true,
      projectId: 2,
      projectName: 'Indigenous Knowledge Documentation'
    },
    {
      id: 5,
      title: 'East Africa Climate Conference 2026',
      type: 'conference',
      date: 'February 15-17, 2026',
      time: 'All Day',
      location: 'KICC, Nairobi',
      attendees: 234,
      maxAttendees: 500,
      description: '3-day conference bringing together climate activists, researchers, and policymakers from across East Africa. Includes keynotes, panels, and networking sessions.',
      organizer: 'Kanyini Earth Project',
      isVirtual: false,
      projectId: 5,
      projectName: 'Urban Reforestation Initiative'
    },
    {
      id: 6,
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

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (eventFilter === 'all') {
      matchesFilter = true;
    } else if (eventFilter === 'virtual') {
      matchesFilter = event.isVirtual === true;
    } else {
      matchesFilter = event.type === eventFilter;
    }
    
    return matchesSearch && matchesFilter;
  });

  if (loading && activeTab === 'community') {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-kanyini-primary animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading alumni...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-kanyini-primary to-green-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Connect</h1>
        <p className="text-green-50">{activeTab === 'events' ? 'Discover and join community events' : 'Connect with community members'}</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-3 text-sm font-semibold transition ${
              activeTab === 'events'
                ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                : 'text-gray-600 border-b-2 border-transparent'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-3 text-sm font-semibold transition ${
              activeTab === 'community'
                ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                : 'text-gray-600 border-b-2 border-transparent'
            }`}
          >
            Community
          </button>
        </div>
      </div>

      {activeTab === 'community' && isVerified === false && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Account Not Verified:</strong> Contact details of other users are hidden. Please contact Admin to get verified and view contact details.
          </p>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={activeTab === 'events' ? 'Search events...' : 'Search by name, email, designation...'}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
        />
        </div>
      </div>

      {/* Event Filters */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter Events</span>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'workshop', label: 'Workshops' },
              { id: 'meetup', label: 'Meetups' },
              { id: 'webinar', label: 'Webinars' },
              { id: 'conference', label: 'Conferences' },
              { id: 'social', label: 'Social' },
              { id: 'virtual', label: 'Virtual' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setEventFilter(filter.id as any)}
                className={`px-4 py-1.5 text-sm border rounded-full whitespace-nowrap transition ${
                  eventFilter === filter.id
                    ? 'bg-kanyini-primary text-white border-kanyini-primary'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'community' && (
      <>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setActiveFilter('all');
              setFilterValue('');
            }}
            className={`px-4 py-1.5 text-sm border rounded-full whitespace-nowrap transition ${
              activeFilter === 'all'
                ? 'bg-kanyini-primary text-white border-kanyini-primary'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Alumni
          </button>
          <button
            onClick={() => setActiveFilter('skills')}
            className={`px-4 py-1.5 text-sm border rounded-full whitespace-nowrap transition ${
              activeFilter === 'skills'
                ? 'bg-kanyini-primary text-white border-kanyini-primary'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveFilter('location')}
            className={`px-4 py-1.5 text-sm border rounded-full whitespace-nowrap transition ${
              activeFilter === 'location'
                ? 'bg-kanyini-primary text-white border-kanyini-primary'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Location
          </button>
          <button
            onClick={() => setActiveFilter('education')}
            className={`px-4 py-1.5 text-sm border rounded-full whitespace-nowrap transition ${
              activeFilter === 'education'
                ? 'bg-kanyini-primary text-white border-kanyini-primary'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Education
          </button>
          <button
            onClick={() => setActiveFilter('work')}
            className={`px-4 py-1.5 text-sm border rounded-full whitespace-nowrap transition ${
              activeFilter === 'work'
                ? 'bg-kanyini-primary text-white border-kanyini-primary'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Work
          </button>
        </div>
        
        {/* Filter Input */}
        {activeFilter !== 'all' && (
          <div className="mt-3">
            <input
              type="text"
              placeholder={
                activeFilter === 'skills' ? 'Search by skill name...' :
                activeFilter === 'location' ? 'Search by city, state, or country...' :
                activeFilter === 'education' ? 'Search by course, school, or degree...' :
                activeFilter === 'work' ? 'Search by designation, company, or industry...' :
                `Filter by ${activeFilter}...`
              }
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
            />
          </div>
        )}
      </div>

      {/* Alumni Count */}
      <div className="px-1">
        <p className="text-sm text-gray-600">
          {pagination ? (
            <>
              Showing {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, pagination.total)} of {pagination.total} alumni
            </>
          ) : (
            `${alumni.length} alumni in your network`
          )}
        </p>
      </div>

      {/* Alumni List */}
      <div className="space-y-3 pb-4">
        {alumni.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No alumni found matching your criteria</p>
          </div>
        ) : (
          alumni.map((person) => (
          <div
              key={person.id}
              onClick={() => handleViewProfile(person.id)}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
                <div className="w-14 h-14 bg-gradient-to-br from-kanyini-primary to-green-700 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden">
                  {person.profile_picture_url ? (
                    <img
                      src={person.profile_picture_url}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    person.name.charAt(0).toUpperCase()
                  )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {person.name}
                  </h3>
                  {person.is_verified && (
                    <span title="Verified">
                      <CheckCircle2 className="w-4 h-4 text-kanyini-primary flex-shrink-0" />
                    </span>
                  )}
                </div>
                  {person.designation && (
                <p className="text-sm text-gray-700 truncate">
                  {person.designation}
                </p>
                  )}
                  {person.company && (
                <p className="text-sm text-gray-600 truncate">
                  {person.company}
                </p>
                  )}
                  {person.location && (
                    <p className="text-xs text-gray-500 mt-1 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {person.location}
                </p>
                  )}
                  {/* Skills preview */}
                  {person.skills && person.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {person.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {person.skills.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-0.5">
                          +{person.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
              </div>

              {/* Connect Button */}
              <button className="px-4 py-1.5 text-sm border border-kanyini-primary text-kanyini-primary rounded-full hover:bg-green-50 transition whitespace-nowrap">
                View
              </button>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={!pagination.hasPrevPage || loading}
            className={`px-3 py-2 rounded-md border transition ${
              pagination.hasPrevPage && !loading
                ? 'border-gray-300 hover:bg-gray-50 text-gray-700'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  disabled={loading}
                  className={`px-3 py-2 rounded-md border transition ${
                    currentPage === pageNum
                      ? 'bg-kanyini-primary text-white border-kanyini-primary'
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={!pagination.hasNextPage || loading}
            className={`px-3 py-2 rounded-md border transition ${
              pagination.hasNextPage && !loading
                ? 'border-gray-300 hover:bg-gray-50 text-gray-700'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
      </>
      )}

      {/* Events List */}
      {activeTab === 'events' && (
        <div className="space-y-4 pb-4">
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No events found</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div 
                key={event.id} 
                className="bg-white rounded-lg shadow overflow-hidden"
              >
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
                        <UsersIcon className="w-4 h-4 text-gray-500" />
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
            ))
          )}
        </div>
      )}
    </div>
  );
}

