'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, Clock, MessageCircle, Link as LinkIcon, MapPin, Briefcase, GraduationCap, Loader2, CheckCircle2 } from 'lucide-react';

export default function AlumniProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alumniId, setAlumniId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setAlumniId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!alumniId) return;
    
    const fetchAlumniProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/community/${alumniId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniProfile();
  }, [alumniId]);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
          <button
            onClick={() => router.push('/app/community')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  const { profile, experiences, education, skills, currentUserIsVerified, isOwnProfile } = profileData;
  const currentExp = experiences?.find((exp: any) => exp.is_present);
  const showContactDetails = isOwnProfile || currentUserIsVerified;

  return (
    <div className="p-4 space-y-4">
      {/* Back Button */}
      <button
        onClick={() => router.push('/app/community')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Community</span>
      </button>

      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow">
        <div className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg"></div>
        <div className="px-4 pb-4">
          <div className="flex items-end -mt-12 mb-4">
            <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center overflow-hidden">
              {profile?.profile_picture_url ? (
                <img src={profile.profile_picture_url} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-600" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">{profile?.name || 'No name'}</h2>
            {profile?.is_verified && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-medium">Verified</span>
              </div>
            )}
          </div>
          {profile?.email && (
            <p className="text-sm text-gray-600">{profile.email}</p>
          )}
          {currentExp && (
            <p className="text-sm text-gray-500 mt-1">
              {currentExp.designation} • {currentExp.company_name}
            </p>
          )}
        </div>
      </div>

      {/* About Section */}
      {profile?.about && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{profile.about}</p>
        </div>
      )}

      {/* Contact Details Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Contact Details</h3>
        {!showContactDetails ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-800">
              <strong>Contact details are hidden.</strong> Please contact Admin to get verified and view contact details.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {profile?.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{profile.email}</p>
                </div>
              </div>
            )}
            {profile?.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{profile.phone}</p>
                </div>
              </div>
            )}
            {profile?.preferred_time_to_connect && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Preferred Time to Connect</p>
                  <p className="text-sm text-gray-900">{profile.preferred_time_to_connect}</p>
                </div>
              </div>
            )}
            {profile?.preferred_way_to_connect && (
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Preferred Way to Connect</p>
                  <p className="text-sm text-gray-900">{profile.preferred_way_to_connect}</p>
                </div>
              </div>
            )}
            {profile?.social_media_links && (
              <div className="flex items-start gap-3">
                <LinkIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Links</p>
                  <div className="space-y-1">
                    {profile.social_media_links.split('\n').filter((line: string) => line.trim()).map((line: string, idx: number) => {
                      const [text, url] = line.split('|').map((s: string) => s.trim());
                      if (url) {
                        return (
                          <a
                            key={idx}
                            href={url.startsWith('http') ? url : `https://${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline block"
                          >
                            {text}
                          </a>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* My Expertise Section */}
      {profile?.my_expertise && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">My Expertise</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{profile.my_expertise}</p>
        </div>
      )}

      {/* Experience Section */}
      {experiences && experiences.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Experience</h3>
          <div className="space-y-4">
            {experiences.map((exp: any) => (
              <div key={exp.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{exp.designation}</h4>
                    <p className="text-sm text-gray-700">{exp.company_name}{exp.industry && ` • ${exp.industry}`}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                      {exp.is_present ? ' Present' : ` ${new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                    </p>
                    {(exp.location_country || exp.location_state || exp.location_city) && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {[exp.location_city, exp.location_state, exp.location_country].filter(Boolean).join(', ')}
                      </p>
                    )}
                    {exp.description && (
                      <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Education</h3>
          <div className="space-y-4">
            {education.map((edu: any) => (
              <div key={edu.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    {edu.school && <h4 className="font-semibold text-gray-900">{edu.school}</h4>}
                    <p className="text-sm text-gray-700">{edu.degree_or_certificate_name}</p>
                    <p className="text-xs text-gray-500">{edu.course}</p>
                    {(edu.start_date || edu.end_date) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {edu.start_date && new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric' })}
                        {edu.start_date && edu.end_date && ' - '}
                        {edu.is_present ? 'Present' : edu.end_date && new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric' })}
                      </p>
                    )}
                    {edu.description && (
                      <p className="text-sm text-gray-600 mt-2">{edu.description}</p>
                    )}
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                      {edu.type === 'education' ? 'Education' : 'Certificate'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: any) => (
              <span
                key={skill.id}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full font-medium"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

