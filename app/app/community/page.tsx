'use client';

import { useEffect, useState } from 'react';
import { MapPin, User, Search, Loader2, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
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

export default function MyCommunityPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'skills' | 'location' | 'education' | 'work'>('all');
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

  const handleViewProfile = (alumniId: string) => {
    router.push(`/app/community/${alumniId}`);
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading alumni...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Verification Notice */}
      {isVerified === false && (
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
          placeholder="Search by name, email, designation..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>
      </div>

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
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Alumni
          </button>
          <button
            onClick={() => setActiveFilter('skills')}
            className={`px-4 py-1.5 text-sm border rounded-full whitespace-nowrap transition ${
              activeFilter === 'skills'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveFilter('location')}
            className={`px-4 py-1.5 text-sm border rounded-full whitespace-nowrap transition ${
              activeFilter === 'location'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Location
          </button>
          <button
            onClick={() => setActiveFilter('education')}
            className={`px-4 py-1.5 text-sm border rounded-full whitespace-nowrap transition ${
              activeFilter === 'education'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Education
          </button>
          <button
            onClick={() => setActiveFilter('work')}
            className={`px-4 py-1.5 text-sm border rounded-full whitespace-nowrap transition ${
              activeFilter === 'work'
                ? 'bg-blue-600 text-white border-blue-600'
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
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden">
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
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
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
              <button className="px-4 py-1.5 text-sm border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition whitespace-nowrap">
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
                      ? 'bg-blue-600 text-white border-blue-600'
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
    </div>
  );
}

