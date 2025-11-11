'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Plus, Mail, Phone, Clock, MessageCircle, Link as LinkIcon, MapPin, Briefcase, GraduationCap, Edit2, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import EditModal from '@/components/EditModal';
import SearchableSelect from '@/components/SearchableSelect';
import { Country, State, City } from 'country-state-city';

export default function AdminUserEditPage({ params }: { params: Promise<{ id: string }> }) {
  const [userId, setUserId] = useState<string>('');
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [allSkills, setAllSkills] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!userId) return;
    fetchProfile();
    fetchAllSkills();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Transform data to match profile page structure
        setProfileData({
          user: data.user, // Include full user data
          profile: {
            ...data.profile,
            email: data.user?.email, // Include email in profile
            is_verified: data.user?.is_verified // Include verification status
          },
          experiences: data.experiences || [],
          education: data.education || [],
          skills: data.skills || []
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSkills = async () => {
    try {
      const response = await fetch('/api/skills');
      if (response.ok) {
        const data = await response.json();
        setAllSkills(data.skills);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    }
  };

  const toggleVerification = async () => {
    const currentStatus = profileData?.user?.is_verified || false;
    if (!confirm(`Are you sure you want to ${currentStatus ? 'unverify' : 'verify'} this user?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/toggle-verification`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_verified: !currentStatus })
      });

      if (response.ok) {
        await fetchProfile();
      } else {
        alert('Failed to update verification status');
      }
    } catch (error) {
      console.error('Error toggling verification:', error);
      alert('Failed to update verification status');
    }
  };

  const openEditModal = (section: string, currentValue: any) => {
    setEditModal(section);
    if (section === 'contact') {
      const linksArray = currentValue.social_media_links
        ? currentValue.social_media_links
            .split('\n')
            .filter((line: string) => line.trim())
            .map((line: string) => {
              const [text, url] = line.split('|').map((s: string) => s.trim());
              return { text: text || '', url: url || '' };
            })
        : [{ text: '', url: '' }];
      setEditValues({ ...currentValue, linksArray: linksArray.length > 0 ? linksArray : [{ text: '', url: '' }] });
    } else if (section === 'experience') {
      const allCountries = Country.getAllCountries();
      const selectedCountry = allCountries.find(c => c.name === currentValue.location_country);
      const selectedCountryCode = selectedCountry?.isoCode || '';
      
      const allStates = selectedCountryCode ? State.getStatesOfCountry(selectedCountryCode) : [];
      const selectedState = allStates.find(s => s.name === currentValue.location_state);
      const selectedStateCode = selectedState?.isoCode || '';
      
      const formattedValue = {
        ...currentValue,
        start_date: currentValue.start_date ? currentValue.start_date.substring(0, 7) : '',
        end_date: currentValue.end_date ? currentValue.end_date.substring(0, 7) : '',
        selectedCountryCode,
        selectedStateCode,
      };
      setEditValues(formattedValue);
    } else if (section === 'education') {
      const formattedValue = {
        ...currentValue,
        start_date: currentValue.start_date ? currentValue.start_date.substring(0, 4) : '',
        end_date: currentValue.end_date ? currentValue.end_date.substring(0, 4) : '',
      };
      setEditValues(formattedValue);
    } else {
      setEditValues(currentValue);
    }
  };

  const addLink = () => {
    const currentLinks = editValues.linksArray || [];
    setEditValues({ ...editValues, linksArray: [...currentLinks, { text: '', url: '' }] });
  };

  const updateLink = (index: number, field: 'text' | 'url', value: string) => {
    const newLinks = [...(editValues.linksArray || [])];
    newLinks[index][field] = value;
    setEditValues({ ...editValues, linksArray: newLinks });
  };

  const removeLink = (index: number) => {
    const newLinks = [...(editValues.linksArray || [])];
    newLinks.splice(index, 1);
    setEditValues({ ...editValues, linksArray: newLinks.length > 0 ? newLinks : [{ text: '', url: '' }] });
  };

  const closeEditModal = () => {
    setEditModal(null);
    setEditValues({});
    setPreviewUrl(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to S3
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile/upload-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Store the S3 key in the database (not the pre-signed URL)
        // The pre-signed URL (data.url) is used for preview only
        const valueToStore = data.s3Key || data.url; // Use s3Key if available, fallback to url for legacy
        setEditValues({ ...editValues, profile_picture_url: valueToStore });
        // Keep the pre-signed URL for preview
        if (data.url && !previewUrl) {
          setPreviewUrl(data.url);
        }
      } else {
        alert(data.error || 'Failed to upload image');
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async (data: any) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          profile: {
            ...profileData?.profile,
            ...data
          }
        }),
      });

      if (response.ok) {
        await fetchProfile();
        closeEditModal();
      } else {
        alert('Failed to save changes');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const { profile, experiences, education, skills } = profileData || {};
  const currentExp = experiences?.find((exp: any) => exp.is_present);

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={() => router.push('/admin')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      {/* Profile Header Card - LinkedIn Style */}
      <div className="bg-white rounded-lg shadow">
        <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg"></div>
        <div className="px-4 pb-4">
          <div className="flex items-end -mt-12 mb-4 justify-between">
            <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center">
              {profile?.profile_picture_url ? (
                <img src={profile.profile_picture_url} alt={profile.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-600" />
              )}
            </div>
            <button 
              onClick={() => openEditModal('profile-header', { 
                name: profile?.name || '', 
                profile_picture_url: profile?.profile_picture_url || '' 
              })}
              className="text-gray-600 hover:text-gray-900 mb-1"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">{profile?.name || 'Add name'}</h2>
            {profile?.is_verified ? (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-medium">Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded-full">
                <XCircle className="w-4 h-4" />
                <span className="text-xs font-medium">Unverified</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-gray-600">{profile?.email}</p>
            <button
              onClick={toggleVerification}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                profile?.is_verified
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {profile?.is_verified ? 'Unverify' : 'Verify Account'}
            </button>
          </div>
          {currentExp && (
            <p className="text-sm text-gray-500 mt-1">
              {currentExp.designation} • {currentExp.company_name}
            </p>
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">About</h3>
          <button 
            onClick={() => openEditModal('about', { about: profile?.about || '' })}
            className="text-gray-600 hover:text-gray-900"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
        {profile?.about ? (
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{profile.about}</p>
        ) : (
          <div>
            <p className="text-sm text-gray-500">Add a bio to tell the community about yourself</p>
            <button 
              onClick={() => openEditModal('about', { about: '' })}
              className="mt-2 text-sm text-indigo-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add about
            </button>
          </div>
        )}
      </div>

      {/* Contact Details Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">Contact Details</h3>
          <button 
            onClick={() => openEditModal('contact', {
              phone: profile?.phone || '',
              preferred_time_to_connect: profile?.preferred_time_to_connect || '',
              preferred_way_to_connect: profile?.preferred_way_to_connect || '',
              social_media_links: profile?.social_media_links || ''
            })}
            className="text-gray-600 hover:text-gray-900"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{profile?.email}</p>
            </div>
          </div>
          {profile?.phone ? (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm text-gray-900">{profile.phone}</p>
              </div>
            </div>
          ) : (
            <button className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Add phone
            </button>
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
                          className="text-sm text-indigo-600 hover:underline block"
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
      </div>

      {/* My Expertise Section */}
      {profile?.my_expertise ? (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">My Expertise</h3>
            <button 
              onClick={() => openEditModal('expertise', { my_expertise: profile.my_expertise })}
              className="text-gray-600 hover:text-gray-900"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{profile.my_expertise}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">My Expertise</h3>
          <p className="text-sm text-gray-500">Let others know how you can help</p>
          <button 
            onClick={() => openEditModal('expertise', { my_expertise: '' })}
            className="mt-2 text-sm text-indigo-600 hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add expertise
          </button>
        </div>
      )}

      {/* Experience Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Experience</h3>
          <button 
            onClick={() => openEditModal('experience', {
              id: null,
              designation: '',
              industry: '',
              company_name: '',
              description: '',
              start_date: '',
              end_date: '',
              is_present: false,
              location_city: '',
              location_state: '',
              location_country: '',
              selectedCountryCode: '',
              selectedStateCode: ''
            })}
            className="text-gray-600 hover:text-gray-900"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {experiences && experiences.length > 0 ? (
          <div className="space-y-4">
            {experiences.map((exp: any) => (
              <div key={exp.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
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
                      <button
                        onClick={() => openEditModal('experience', exp)}
                        className="text-gray-600 hover:text-gray-900 ml-2"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Add work experience to showcase career journey
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Education</h3>
          <button 
            onClick={() => openEditModal('education', {
              id: null,
              type: 'education',
              school: '',
              course: '',
              degree_or_certificate_name: '',
              start_date: '',
              end_date: '',
              is_present: false,
              description: ''
            })}
            className="text-gray-600 hover:text-gray-900"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {education && education.length > 0 ? (
          <div className="space-y-4">
            {education.map((edu: any) => (
              <div key={edu.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
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
                        <span className="inline-block mt-2 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded">
                          {edu.type === 'education' ? 'Education' : 'Certificate'}
                        </span>
                      </div>
                      <button
                        onClick={() => openEditModal('education', edu)}
                        className="text-gray-600 hover:text-gray-900 ml-2"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Add educational background and certifications
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Skills</h3>
          <button 
            onClick={() => openEditModal('skills', { selectedSkill: '', newSkillName: '' })}
            className="text-gray-600 hover:text-gray-900"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {skills && skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: any) => (
              <span
                key={skill.id}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full font-medium flex items-center gap-2 group hover:bg-gray-200 transition"
              >
                {skill.name}
                <button
                  onClick={async () => {
                    if (confirm(`Remove "${skill.name}" from skills?`)) {
                      const token = localStorage.getItem('token');
                      try {
                        const response = await fetch(`/api/admin/users/${userId}/skills/${skill.id}`, {
                          method: 'DELETE',
                          headers: {
                            'Authorization': `Bearer ${token}`
                          }
                        });
                        if (response.ok) {
                          await fetchProfile();
                        } else {
                          alert('Failed to remove skill');
                        }
                      } catch (error) {
                        console.error('Failed to remove skill:', error);
                        alert('Failed to remove skill');
                      }
                    }
                  }}
                  className="text-gray-500 hover:text-red-600 transition"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Show top skills to stand out
          </div>
        )}
      </div>

      {/* Edit Modals - Same as profile page but using admin endpoints */}
      
      {/* Edit Profile Header */}
      <EditModal
        isOpen={editModal === 'profile-header'}
        onClose={closeEditModal}
        title="Edit Profile"
        onSave={() => saveProfile({ 
          name: editValues.name,
          profile_picture_url: editValues.profile_picture_url 
        })}
        saving={saving}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={editValues.name || ''}
              onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
              placeholder="Full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            
            {/* File Upload */}
            <div className="mb-4">
              <label className="block w-full">
                <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  {uploading ? (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                      <p className="text-sm text-gray-600">Uploading...</p>
                    </div>
                  ) : previewUrl || editValues.profile_picture_url ? (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <img
                        src={previewUrl || editValues.profile_picture_url}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover mb-2"
                      />
                      <p className="text-sm text-gray-600">Click to change</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <User className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </div>
              </label>
            </div>

            {/* Or use URL */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture URL
              </label>
              <input
                type="text"
                value={editValues.profile_picture_url || ''}
                onChange={(e) => {
                  setEditValues({ ...editValues, profile_picture_url: e.target.value });
                  setPreviewUrl(null);
                }}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              />
              <p className="text-xs text-gray-500 mt-1">Enter a URL if you prefer to use an external image</p>
            </div>
          </div>
        </div>
      </EditModal>

      {/* Edit About */}
      <EditModal
        isOpen={editModal === 'about'}
        onClose={closeEditModal}
        title="Edit About"
        onSave={() => saveProfile({ about: editValues.about })}
        saving={saving}
      >
        <textarea
          value={editValues.about || ''}
          onChange={(e) => setEditValues({ ...editValues, about: e.target.value })}
          placeholder="Write about yourself..."
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px] text-base"
          rows={6}
        />
      </EditModal>

      {/* Edit Contact Details */}
      <EditModal
        isOpen={editModal === 'contact'}
        onClose={closeEditModal}
        title="Edit Contact Details"
        onSave={() => {
          const linksString = (editValues.linksArray || [])
            .filter((link: any) => link.text && link.url)
            .map((link: any) => `${link.text} | ${link.url}`)
            .join('\n');
          
          saveProfile({
            phone: editValues.phone,
            preferred_time_to_connect: editValues.preferred_time_to_connect,
            preferred_way_to_connect: editValues.preferred_way_to_connect,
            social_media_links: linksString
          });
        }}
        saving={saving}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={editValues.phone || ''}
              onChange={(e) => setEditValues({ ...editValues, phone: e.target.value })}
              placeholder="+92-300-1234567"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time to Connect</label>
            <textarea
              value={editValues.preferred_time_to_connect || ''}
              onChange={(e) => setEditValues({ ...editValues, preferred_time_to_connect: e.target.value })}
              placeholder="e.g., Weekday evenings after 6 PM"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Way to Connect</label>
            <textarea
              value={editValues.preferred_way_to_connect || ''}
              onChange={(e) => setEditValues({ ...editValues, preferred_way_to_connect: e.target.value })}
              placeholder="e.g., Email or WhatsApp preferred"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              rows={2}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Links</label>
              <button
                type="button"
                onClick={addLink}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>
            <div className="space-y-3">
              {(editValues.linksArray && editValues.linksArray.length > 0 ? editValues.linksArray : [{ text: '', url: '' }]).map((link: any, index: number) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={link.text || ''}
                      onChange={(e) => updateLink(index, 'text', e.target.value)}
                      placeholder="Text (e.g., LinkedIn)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                    />
                    <input
                      type="text"
                      value={link.url || ''}
                      onChange={(e) => updateLink(index, 'url', e.target.value)}
                      placeholder="URL (e.g., linkedin.com/in/username)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                    />
                  </div>
                  {(editValues.linksArray && editValues.linksArray.length > 1) && (
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="mt-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </EditModal>

      {/* Edit My Expertise */}
      <EditModal
        isOpen={editModal === 'expertise'}
        onClose={closeEditModal}
        title="Edit My Expertise"
        onSave={() => saveProfile({ my_expertise: editValues.my_expertise })}
        saving={saving}
      >
        <textarea
          value={editValues.my_expertise || ''}
          onChange={(e) => setEditValues({ ...editValues, my_expertise: e.target.value })}
          placeholder="e.g., I am working in Saudi in petroleum industry..."
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px] text-base"
          rows={6}
        />
      </EditModal>

      {/* Edit Experience */}
      <EditModal
        isOpen={editModal === 'experience'}
        onClose={closeEditModal}
        title={editValues.id ? 'Edit Experience' : 'Add Experience'}
        onSave={async () => {
          const endpoint = editValues.id 
            ? `/api/admin/users/${userId}/experience/${editValues.id}` 
            : `/api/admin/users/${userId}/experience`;
          const method = editValues.id ? 'PUT' : 'POST';
          
          const token = localStorage.getItem('token');
          
          setSaving(true);
          try {
            const response = await fetch(endpoint, {
              method,
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                designation: editValues.designation,
                industry: editValues.industry,
                company_name: editValues.company_name,
                description: editValues.description,
                start_date: editValues.start_date,
                end_date: editValues.is_present ? null : editValues.end_date,
                is_present: editValues.is_present,
                location_city: editValues.location_city,
                location_state: editValues.location_state,
                location_country: editValues.location_country,
              }),
            });

            if (response.ok) {
              await fetchProfile();
              closeEditModal();
            } else {
              alert('Failed to save experience');
            }
          } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save experience');
          } finally {
            setSaving(false);
          }
        }}
        saving={saving}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editValues.designation || ''}
              onChange={(e) => setEditValues({ ...editValues, designation: e.target.value })}
              placeholder="e.g., Software Engineer"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company or Organization Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editValues.company_name || ''}
              onChange={(e) => setEditValues({ ...editValues, company_name: e.target.value })}
              placeholder="e.g., Google"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input
              type="text"
              value={editValues.industry || ''}
              onChange={(e) => setEditValues({ ...editValues, industry: e.target.value })}
              placeholder="e.g., Technology, Healthcare, Finance"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="month"
              value={editValues.start_date || ''}
              onChange={(e) => setEditValues({ ...editValues, start_date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base appearance-none bg-white"
              style={{ minHeight: '48px', lineHeight: '1.5' }}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="month"
              value={editValues.end_date || ''}
              onChange={(e) => setEditValues({ ...editValues, end_date: e.target.value })}
              disabled={editValues.is_present}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 text-base appearance-none bg-white"
              style={{ minHeight: '48px', lineHeight: '1.5' }}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_present"
              checked={editValues.is_present || false}
              onChange={(e) => setEditValues({ ...editValues, is_present: e.target.checked, end_date: e.target.checked ? '' : editValues.end_date })}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="is_present" className="ml-2 text-sm text-gray-700">
              I currently work here
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <SearchableSelect
              options={Country.getAllCountries().map(country => ({
                value: country.isoCode,
                label: country.name
              }))}
              value={editValues.selectedCountryCode || ''}
              onChange={(countryCode) => {
                const country = Country.getAllCountries().find(c => c.isoCode === countryCode);
                setEditValues({ 
                  ...editValues, 
                  selectedCountryCode: countryCode,
                  location_country: country?.name || '',
                  selectedStateCode: '',
                  location_state: '',
                  location_city: ''
                });
              }}
              placeholder="Search country..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State/Region</label>
            <SearchableSelect
              options={editValues.selectedCountryCode 
                ? State.getStatesOfCountry(editValues.selectedCountryCode).map(state => ({
                    value: state.isoCode,
                    label: state.name
                  }))
                : []
              }
              value={editValues.selectedStateCode || ''}
              onChange={(stateCode) => {
                const state = State.getStatesOfCountry(editValues.selectedCountryCode).find(s => s.isoCode === stateCode);
                setEditValues({ 
                  ...editValues, 
                  selectedStateCode: stateCode,
                  location_state: state?.name || '',
                  location_city: ''
                });
              }}
              disabled={!editValues.selectedCountryCode}
              placeholder="Search state/region..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <SearchableSelect
              options={editValues.selectedCountryCode && editValues.selectedStateCode
                ? City.getCitiesOfState(editValues.selectedCountryCode, editValues.selectedStateCode).map(city => ({
                    value: city.name,
                    label: city.name
                  }))
                : []
              }
              value={editValues.location_city || ''}
              onChange={(cityName) => {
                setEditValues({ ...editValues, location_city: cityName });
              }}
              disabled={!editValues.selectedStateCode}
              placeholder="Search city..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={editValues.description || ''}
              onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
              placeholder="Describe your role and responsibilities..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              rows={4}
            />
          </div>

          {editValues.id && (
            <button
              type="button"
              onClick={async () => {
                if (confirm('Are you sure you want to delete this experience?')) {
                  const token = localStorage.getItem('token');
                  setSaving(true);
                  try {
                    const response = await fetch(`/api/admin/users/${userId}/experience/${editValues.id}`, {
                      method: 'DELETE',
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });

                    if (response.ok) {
                      await fetchProfile();
                      closeEditModal();
                    } else {
                      alert('Failed to delete experience');
                    }
                  } catch (error) {
                    console.error('Failed to delete:', error);
                    alert('Failed to delete experience');
                  } finally {
                    setSaving(false);
                  }
                }
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Experience
            </button>
          )}
        </div>
      </EditModal>

      {/* Edit Education */}
      <EditModal
        isOpen={editModal === 'education'}
        onClose={closeEditModal}
        title={editValues.id ? 'Edit Education' : 'Add Education'}
        onSave={async () => {
          const endpoint = editValues.id 
            ? `/api/admin/users/${userId}/education/${editValues.id}` 
            : `/api/admin/users/${userId}/education`;
          const method = editValues.id ? 'PUT' : 'POST';
          
          const token = localStorage.getItem('token');
          
          setSaving(true);
          try {
            const response = await fetch(endpoint, {
              method,
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                type: editValues.type,
                school: editValues.type === 'education' ? editValues.school : null,
                course: editValues.course,
                degree_or_certificate_name: editValues.degree_or_certificate_name,
                start_date: editValues.start_date,
                end_date: editValues.is_present ? null : editValues.end_date,
                is_present: editValues.is_present,
                description: editValues.description,
              }),
            });

            if (response.ok) {
              await fetchProfile();
              closeEditModal();
            } else {
              alert('Failed to save education');
            }
          } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save education');
          } finally {
            setSaving(false);
          }
        }}
        saving={saving}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="education"
                  checked={editValues.type === 'education'}
                  onChange={(e) => setEditValues({ ...editValues, type: e.target.value, school: editValues.type === 'certificate' ? '' : editValues.school })}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-2 text-sm text-gray-700">Education</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="certificate"
                  checked={editValues.type === 'certificate'}
                  onChange={(e) => setEditValues({ ...editValues, type: e.target.value, school: '' })}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-2 text-sm text-gray-700">Certificate</span>
              </label>
            </div>
          </div>

          {editValues.type === 'education' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School/University <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editValues.school || ''}
                onChange={(e) => setEditValues({ ...editValues, school: e.target.value })}
                placeholder="e.g., Harvard University"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                required={editValues.type === 'education'}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editValues.course || ''}
              onChange={(e) => setEditValues({ ...editValues, course: e.target.value })}
              placeholder="e.g., Computer Science"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {editValues.type === 'education' ? 'Degree' : 'Certificate'} Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editValues.degree_or_certificate_name || ''}
              onChange={(e) => setEditValues({ ...editValues, degree_or_certificate_name: e.target.value })}
              placeholder={editValues.type === 'education' ? 'e.g., Bachelor of Science' : 'e.g., AWS Certified Solutions Architect'}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
            <input
              type="text"
              value={editValues.start_date || ''}
              onChange={(e) => setEditValues({ ...editValues, start_date: e.target.value })}
              placeholder="YYYY (e.g., 2015)"
              maxLength={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
            <input
              type="text"
              value={editValues.end_date || ''}
              onChange={(e) => setEditValues({ ...editValues, end_date: e.target.value })}
              disabled={editValues.is_present}
              placeholder="YYYY (e.g., 2019)"
              maxLength={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 text-base"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="edu_is_present"
              checked={editValues.is_present || false}
              onChange={(e) => setEditValues({ ...editValues, is_present: e.target.checked, end_date: e.target.checked ? '' : editValues.end_date })}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="edu_is_present" className="ml-2 text-sm text-gray-700">
              Currently studying
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={editValues.description || ''}
              onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
              placeholder="Describe what you learned, achievements, etc..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              rows={4}
            />
          </div>

          {editValues.id && (
            <button
              type="button"
              onClick={async () => {
                if (confirm('Are you sure you want to delete this education record?')) {
                  const token = localStorage.getItem('token');
                  setSaving(true);
                  try {
                    const response = await fetch(`/api/admin/users/${userId}/education/${editValues.id}`, {
                      method: 'DELETE',
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });

                    if (response.ok) {
                      await fetchProfile();
                      closeEditModal();
                    } else {
                      alert('Failed to delete education');
                    }
                  } catch (error) {
                    console.error('Failed to delete:', error);
                    alert('Failed to delete education');
                  } finally {
                    setSaving(false);
                  }
                }
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete {editValues.type === 'education' ? 'Education' : 'Certificate'}
            </button>
          )}
        </div>
      </EditModal>

      {/* Add Skill Modal */}
      <EditModal
        isOpen={editModal === 'skills'}
        onClose={closeEditModal}
        title="Add Skill"
        onSave={async () => {
          const skillToAdd = editValues.selectedSkill || editValues.newSkillName;
          
          if (!skillToAdd || skillToAdd.trim() === '') {
            alert('Please select or enter a skill');
            return;
          }

          const token = localStorage.getItem('token');
          setSaving(true);
          
          try {
            const response = await fetch(`/api/admin/users/${userId}/skills`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                skillName: skillToAdd.trim()
              }),
            });

            if (response.ok) {
              await fetchProfile();
              await fetchAllSkills();
              closeEditModal();
            } else {
              const data = await response.json();
              alert(data.error || 'Failed to add skill');
            }
          } catch (error) {
            console.error('Failed to add skill:', error);
            alert('Failed to add skill');
          } finally {
            setSaving(false);
          }
        }}
        saving={saving}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select from existing skills
            </label>
            <SearchableSelect
              options={allSkills
                .filter(skill => !skills?.find((s: any) => s.name === skill.name))
                .map(skill => ({
                  value: skill.name,
                  label: skill.name
                }))
              }
              value={editValues.selectedSkill || ''}
              onChange={(skillName) => setEditValues({ ...editValues, selectedSkill: skillName, newSkillName: '' })}
              placeholder="Search skills..."
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add a new skill
            </label>
            <input
              type="text"
              value={editValues.newSkillName || ''}
              onChange={(e) => setEditValues({ ...editValues, newSkillName: e.target.value, selectedSkill: '' })}
              placeholder="e.g., React, Python, Leadership"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a skill that's not in the list above
            </p>
          </div>
        </div>
      </EditModal>
    </div>
  );
}
