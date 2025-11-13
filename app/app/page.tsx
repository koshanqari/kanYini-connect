'use client';

import { useEffect, useState } from 'react';
import { User, Plus, Mail, Phone, Clock, MessageCircle, Link as LinkIcon, MapPin, Briefcase, GraduationCap, Edit2, Trash2, CheckCircle2, Loader2, LogOut, Share2, Trophy, Heart, TreePine, Droplet, Award, TrendingUp, Clock as ClockIcon, Users, MessageSquare, ThumbsUp, FileText, Activity, ChevronDown, ChevronUp, Play, Headphones } from 'lucide-react';
import EditModal from '@/components/EditModal';
import SearchableSelect from '@/components/SearchableSelect';
import { Country, State, City } from 'country-state-city';
import { useRouter } from 'next/navigation';

export default function MyProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [allSkills, setAllSkills] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'contribution'>('contribution');
  const [contributionSubTab, setContributionSubTab] = useState<'posts' | 'activity'>('posts');
  const [showContributionDetails, setShowContributionDetails] = useState(false);
  const [postFilter, setPostFilter] = useState<'all' | 'podcasts' | 'articles'>('all');
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
    fetchAllSkills();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched profile data:', data);
        console.log('Profile picture URL:', data.profile?.profile_picture_url);
        setProfileData(data);
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

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/auth/login');
    }
  };

  const handleShareContribution = async () => {
    const contributionData = {
      moneyRaised: '$12,500',
      peopleInvited: 18,
      postsShared: 24,
      volunteerHours: 48,
      personalContributions: '$5,250',
      skillsShared: 8,
      projectsSupported: 3,
      treesPlanted: 125,
      livesImpacted: 45,
      achievements: ['First Contribution', '$1K Milestone', 'Multi-Project Supporter', 'Volunteer Champion', 'Community Builder'],
      userName: profile?.name || 'A Kanyini supporter'
    };

    const shareText = `🌱 I'm making a difference with Kanyini Earth Project! 

💰 Money Raised: ${contributionData.moneyRaised}
👥 People Invited: ${contributionData.peopleInvited}
📝 Posts Shared: ${contributionData.postsShared}
⏰ Volunteer Hours: ${contributionData.volunteerHours} hours
💵 Personal Contributions: ${contributionData.personalContributions}
🌳 Trees Planted: ${contributionData.treesPlanted}
💧 Lives Impacted: ${contributionData.livesImpacted}
🎯 Supporting ${contributionData.projectsSupported} active projects

Join me in creating positive change! 🌍

#KanyiniConnect #EarthProject #MakingADifference`;

    const shareUrl = `${window.location.origin}/app`;

    try {
      if (navigator.share && navigator.canShare && navigator.canShare({ text: shareText })) {
        await navigator.share({
          title: `${contributionData.userName}'s Contribution to Kanyini`,
          text: shareText,
          url: shareUrl,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        alert('Contribution details copied to clipboard! Share it wherever you like.');
      }
    } catch (error: any) {
      // User cancelled or error occurred
      if (error.name !== 'AbortError') {
        // Fallback: Copy to clipboard
        try {
          await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
          alert('Contribution details copied to clipboard! Share it wherever you like.');
        } catch (clipboardError) {
          console.error('Failed to copy to clipboard:', clipboardError);
          alert('Unable to share. Please try again.');
        }
      }
    }
  };

  const openEditModal = (section: string, currentValue: any) => {
    setEditModal(section);
    if (section === 'contact') {
      // Parse links from "Text | URL" format to array of objects
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
      // Convert date format from YYYY-MM-DD to YYYY-MM for input type="month"
      // Also find country and state codes for the location dropdowns
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
      // Convert date format from YYYY-MM-DD to YYYY for education (year only)
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
      console.log('Saving profile with data:', data);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Profile saved successfully:', result);
        await fetchProfile();
        closeEditModal();
      } else {
        const errorData = await response.json();
        console.error('Failed to save profile:', errorData);
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

  // Get current experience for header
  const currentExp = experiences?.find((exp: any) => exp.is_present);

  return (
    <div className="p-4 space-y-4">
      {/* Profile Header Card - LinkedIn Style */}
      <div className="bg-white rounded-lg shadow">
        <div className="h-20 bg-gradient-to-r from-kanyini-primary to-green-700 rounded-t-lg"></div>
        <div className="px-4 pb-4">
          <div className="flex items-end -mt-12 mb-4 justify-between">
            <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center overflow-hidden">
              {profile?.profile_picture_url ? (
                <img 
                  key={profile.profile_picture_url}
                  src={profile.profile_picture_url} 
                  alt={profile.name} 
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load profile picture:', profile.profile_picture_url);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Profile picture loaded successfully:', profile.profile_picture_url);
                  }}
                />
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
            <h2 className="text-xl font-bold text-gray-900">{profile?.name || 'Add your name'}</h2>
            {profile?.is_verified && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-kanyini-primary rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-medium">Verified</span>
              </div>
            )}
            {!profile?.is_verified && (
              <button
                onClick={() => {
                  alert('Please contact Admin to get verified and view contact details of other users.');
                }}
                className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded-full hover:bg-yellow-100 transition cursor-pointer"
                title="Click for more information"
              >
                <span className="text-xs font-medium">Unverified</span>
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600">{profile?.email}</p>
          {currentExp && (
            <p className="text-sm text-gray-500 mt-1">
              {currentExp.designation} • {currentExp.company_name}
            </p>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('contribution')}
            className={`flex-1 py-3 text-sm font-semibold transition ${
              activeTab === 'contribution'
                ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                : 'text-gray-600 border-b-2 border-transparent hover:text-gray-900'
            }`}
          >
            Journey
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-sm font-semibold transition ${
              activeTab === 'profile'
                ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                : 'text-gray-600 border-b-2 border-transparent hover:text-gray-900'
            }`}
          >
            Info
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'contribution' && (
        <div className="space-y-4">
          {/* Contribution Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header with Share Button */}
            <div className="bg-gradient-to-r from-kanyini-primary to-green-700 p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-white" />
                        <h3 className="text-lg font-semibold text-white">Contribution</h3>
                </div>
                <button
                  onClick={handleShareContribution}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition text-sm font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Pledge Section */}
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">Pledge</h4>
                  <button
                    onClick={() => {
                      // Handle add/edit pledge
                      alert('Add/Edit Pledge functionality coming soon');
                    }}
                    className="flex items-center gap-1 text-xs text-kanyini-primary hover:text-green-700 transition"
                  >
                    <Plus className="w-3 h-3" />
                    Add Pledge
                  </button>
                </div>
                <div className="bg-gradient-to-r from-kanyini-primary to-green-700 rounded-lg p-4 text-white">
                  <p className="text-sm font-medium mb-3">My Commitment to Kanyini</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Heart className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-xs text-green-50 leading-relaxed">Contribute $500 monthly to support environmental projects</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Users className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-xs text-green-50 leading-relaxed">Recruit 5 new members this year to expand our community</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ClockIcon className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-xs text-green-50 leading-relaxed">Dedicate 20 volunteer hours per month to environmental projects</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TreePine className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-xs text-green-50 leading-relaxed">Plant and maintain 50 trees annually in my local community</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements Section */}
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">Achievements</h4>
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs font-medium text-yellow-700">First Contribution</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                    <Award className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">$1K Milestone</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
                    <Heart className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Multi-Project Supporter</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700">Volunteer Champion</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full">
                    <Users className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-medium text-orange-700">Community Builder</span>
                  </div>
                </div>
              </div>

              {/* Impact Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">Impact</h4>
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                </div>
                
                {/* Overall Stats */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Money Raised</p>
                    <p className="text-xl font-bold text-kanyini-primary">$12,500</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Members Recruited</p>
                    <p className="text-xl font-bold text-blue-600">18</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Posts Shared</p>
                    <p className="text-xl font-bold text-purple-600">24</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Volunteer Hours</p>
                    <p className="text-xl font-bold text-orange-600">48</p>
                  </div>
                </div>

                {/* Secondary Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <TreePine className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-base font-bold text-gray-900">125</p>
                    <p className="text-xs text-gray-600">Trees Planted</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <Droplet className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-base font-bold text-gray-900">45</p>
                    <p className="text-xs text-gray-600">Lives Impacted</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-base font-bold text-gray-900">3</p>
                    <p className="text-xs text-gray-600">Projects</p>
                  </div>
                </div>
              </div>

              {/* Dropdown for Detailed Contribution Info */}
              <div className="border-t border-gray-100 pt-4">
                <button
                  onClick={() => setShowContributionDetails(!showContributionDetails)}
                  className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900 hover:text-kanyini-primary transition"
                >
                  <span>View Details</span>
                  {showContributionDetails ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showContributionDetails && (
                  <div className="mt-4 space-y-4">
                    {/* Contribution Types */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Contribution Breakdown</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Heart className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Money Raised</p>
                              <p className="text-xs text-gray-500">Fundraising campaigns & contributions</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-kanyini-primary">$12,500</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">People Invited</p>
                              <p className="text-xs text-gray-500">Community members you've brought in</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-blue-600">18</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Posts Shared</p>
                              <p className="text-xs text-gray-500">Updates, stories & content created</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-purple-600">24</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <ClockIcon className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Volunteer Hours</p>
                              <p className="text-xs text-gray-500">Time dedicated to projects</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-orange-600">48 hrs</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <Award className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Skills Shared</p>
                              <p className="text-xs text-gray-500">Mentoring & workshops conducted</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-indigo-600">8 sessions</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                              <Heart className="w-5 h-5 text-teal-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Personal Contributions</p>
                              <p className="text-xs text-gray-500">Direct donations made</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-teal-600">$5,250</p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Contributions */}
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Contributions</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Invited 3 new people</p>
                            <p className="text-xs text-gray-500">Community • 3 days ago</p>
                          </div>
                          <p className="text-sm font-semibold text-blue-600">+3</p>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Raised $2,500 for Clean Water</p>
                            <p className="text-xs text-gray-500">Fundraising • 1 week ago</p>
                          </div>
                          <p className="text-sm font-semibold text-kanyini-primary">$2,500</p>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Shared project update post</p>
                            <p className="text-xs text-gray-500">Post • 1 week ago</p>
                          </div>
                          <p className="text-sm font-semibold text-purple-600">+1</p>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Beach Cleanup Event</p>
                            <p className="text-xs text-gray-500">Volunteer • 2 weeks ago</p>
                          </div>
                          <p className="text-sm font-semibold text-orange-600">8 hrs</p>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Personal donation</p>
                            <p className="text-xs text-gray-500">Financial • 2 weeks ago</p>
                          </div>
                          <p className="text-sm font-semibold text-teal-600">$500</p>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Youth Mentorship Program</p>
                            <p className="text-xs text-gray-500">Skills • 2 months ago</p>
                          </div>
                          <p className="text-sm font-semibold text-indigo-600">4 sessions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sub-tabs for Posts and Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setContributionSubTab('posts')}
                className={`flex-1 py-3 text-sm font-semibold transition ${
                  contributionSubTab === 'posts'
                    ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                    : 'text-gray-600 border-b-2 border-transparent hover:text-gray-900'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setContributionSubTab('activity')}
                className={`flex-1 py-3 text-sm font-semibold transition ${
                  contributionSubTab === 'activity'
                    ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                    : 'text-gray-600 border-b-2 border-transparent hover:text-gray-900'
                }`}
              >
                Activity
              </button>
            </div>
          </div>

          {/* Posts Tab Content */}
          {contributionSubTab === 'posts' && (() => {
            // Define all posts with their types
            const allPosts = [
              {
                id: 1,
                type: 'photo',
                projectName: 'Clean Water for Rural Communities',
                projectId: '1',
                content: 'Amazing progress today! We installed our 3rd water well and the community is thrilled. The smiles on the children\'s faces made it all worth it. Clean water is a basic right, and we\'re making it happen!',
                imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
                likes: 24,
                comments: 8,
                shares: 5,
                timestamp: '3 days ago'
              },
              {
                id: 2,
                type: 'photo',
                projectName: 'Reforestation Initiative',
                projectId: '3',
                content: 'Just completed our monthly tree planting session! 50 new saplings in the ground. Every tree counts in our fight against climate change. Grateful to all the volunteers who came out today.',
                imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
                likes: 42,
                comments: 12,
                shares: 9,
                timestamp: '1 week ago'
              },
              {
                id: 3,
                type: 'text',
                projectName: 'Youth Environmental Leadership Program',
                projectId: '4',
                content: 'Excited to announce our new scholarship program! We\'re providing educational opportunities to 20 bright students this year. Education is the key to a better future.',
                likes: 67,
                comments: 15,
                shares: 12,
                timestamp: '2 weeks ago'
              },
              {
                id: 4,
                type: 'video',
                projectName: 'Clean Water for Rural Communities',
                projectId: '1',
                content: 'Update on our water well project: Site preparation is complete and drilling begins next week! The community has been incredibly supportive. Can\'t wait to see clean water flowing soon.',
                videoThumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
                likes: 38,
                comments: 11,
                shares: 7,
                timestamp: '3 weeks ago'
              },
              {
                id: 5,
                type: 'podcast',
                projectName: 'Clean Water for Rural Communities',
                projectId: '1',
                content: 'Watch our latest video podcast episode featuring community leaders discussing water access challenges and solutions in rural Kenya.',
                podcastUrl: 'https://example.com/podcast1',
                podcastDuration: '45 min',
                videoThumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
                likes: 89,
                comments: 24,
                shares: 15,
                timestamp: '3 days ago'
              },
              {
                id: 6,
                type: 'article',
                projectName: 'Indigenous Knowledge Documentation',
                projectId: '2',
                content: 'Read our comprehensive article on sustainable water management practices and their impact on rural communities.',
                articleUrl: 'https://example.com/article1',
                articleTitle: 'Sustainable Water Management in Rural Kenya',
                articleExcerpt: 'Exploring innovative approaches to providing clean water access to underserved communities...',
                likes: 156,
                comments: 42,
                shares: 28,
                timestamp: '1 week ago'
              }
            ];

            // Filter posts based on selected filter
            const filteredPosts = allPosts.filter(post => {
              if (postFilter === 'all') return true;
              if (postFilter === 'podcasts') return post.type === 'podcast';
              if (postFilter === 'articles') return post.type === 'article';
              return true;
            });

            return (
              <div className="space-y-4">
                {/* Filter Buttons */}
                <div className="bg-white rounded-lg shadow p-3">
                  <div className="flex gap-2 overflow-x-auto">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'podcasts', label: 'Podcasts' },
                      { id: 'articles', label: 'Articles' }
                    ].map(filter => (
                      <button
                        key={filter.id}
                        onClick={() => setPostFilter(filter.id as 'all' | 'podcasts' | 'articles')}
                        className={`px-4 py-1.5 text-sm border rounded-full whitespace-nowrap transition ${
                          postFilter === filter.id
                            ? 'bg-kanyini-primary text-white border-kanyini-primary'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Render filtered posts */}
                {filteredPosts.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">No {postFilter === 'all' ? 'posts' : postFilter} found</p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                      {/* Project Header */}
                      <div 
                        onClick={() => router.push(`/app/post/${post.projectId}`)}
                        className="bg-kanyini-primary px-4 py-2 cursor-pointer hover:bg-green-700 transition"
                      >
                        <p className="text-white font-semibold text-sm">{post.projectName}</p>
                      </div>

                      {/* Post Content */}
                      <div className="p-4">
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">{post.content}</p>
                        
                        {/* Photo */}
                        {post.type === 'photo' && post.imageUrl && (
                          <div className="relative mb-3">
                            <img
                              src={post.imageUrl}
                              alt="Post image"
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          </div>
                        )}

                        {/* Video */}
                        {post.type === 'video' && post.videoThumbnail && (
                          <div className="relative mb-3">
                            <img
                              src={post.videoThumbnail}
                              alt="Video thumbnail"
                              className="w-full h-64 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                              <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                <Play className="w-8 h-8 text-kanyini-primary ml-1" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Podcast */}
                        {post.type === 'podcast' && (
                          <div className="relative mb-3">
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
                          </div>
                        )}

                        {/* Article */}
                        {post.type === 'article' && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-3">
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
                        )}

                        {/* Engagement Stats */}
                        <div className={`flex items-center gap-4 pt-3 border-t border-gray-100 ${post.type === 'text' ? 'mt-3' : ''}`}>
                          <div className="flex items-center gap-1 text-gray-600">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-sm">{post.comments}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm">{post.shares}</span>
                          </div>
                          <div className="ml-auto text-xs text-gray-500">{post.timestamp}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })()}

          {/* Activity Tab Content */}
          {contributionSubTab === 'activity' && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="space-y-4">
              {/* Activity Item - Comment */}
              <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">
                      <span className="font-semibold">You commented</span> on a post in <span className="font-semibold text-kanyini-primary">Reforestation Initiative</span>
                    </p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-700">"This is incredible work! Happy to support this initiative."</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Item - Like */}
              <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ThumbsUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">
                      <span className="font-semibold">You liked</span> a post in <span className="font-semibold text-kanyini-primary">Education Program</span>
                    </p>
                    <p className="text-xs text-gray-500">2 weeks ago</p>
                  </div>
                </div>
              </div>

              {/* Activity Item - Contribution */}
              <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">
                      <span className="font-semibold">You contributed</span> $500 to <span className="font-semibold text-kanyini-primary">Clean Water Project</span>
                    </p>
                    <p className="text-xs text-gray-500">2 weeks ago</p>
                  </div>
                </div>
              </div>

              {/* Activity Item - Volunteer */}
              <div className="pb-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">
                      <span className="font-semibold">You volunteered</span> 8 hours at <span className="font-semibold text-kanyini-primary">Beach Cleanup Event</span>
                    </p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-4">

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
              className="mt-2 text-sm text-kanyini-primary hover:underline flex items-center gap-1"
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
                          className="text-sm text-kanyini-primary hover:underline block"
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
          
          {/* Show "Add Details" button if any field is missing */}
          {(!profile?.phone || !profile?.preferred_time_to_connect || !profile?.preferred_way_to_connect || !profile?.social_media_links) && (
            <button
              onClick={() => openEditModal('contact', {
                phone: profile?.phone || '',
                preferred_time_to_connect: profile?.preferred_time_to_connect || '',
                preferred_way_to_connect: profile?.preferred_way_to_connect || '',
                social_media_links: profile?.social_media_links || ''
              })}
              className="text-sm text-kanyini-primary hover:underline flex items-center gap-1 mt-2"
            >
              <Plus className="w-4 h-4" />
              Add Details
            </button>
          )}
        </div>
      </div>

      {/* My Expertise Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">My Expertise</h3>
          {profile?.my_expertise && (
            <button 
              onClick={() => openEditModal('expertise', { my_expertise: profile.my_expertise })}
              className="text-gray-600 hover:text-gray-900"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
        {profile?.my_expertise ? (
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{profile.my_expertise}</p>
        ) : (
          <button 
            onClick={() => openEditModal('expertise', { my_expertise: '' })}
            className="text-sm text-kanyini-primary hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Details
          </button>
        )}
      </div>

      {/* Experience Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Experience</h3>
          {experiences && experiences.length > 0 && (
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
          )}
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
            className="text-sm text-kanyini-primary hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Details
          </button>
        )}
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Education</h3>
          {education && education.length > 0 && (
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
          )}
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
                        <span className="inline-block mt-2 px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
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
            className="text-sm text-kanyini-primary hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Details
          </button>
        )}
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Skills</h3>
          {skills && skills.length > 0 && (
            <button 
              onClick={() => openEditModal('skills', { selectedSkill: '', newSkillName: '' })}
              className="text-gray-600 hover:text-gray-900"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
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
                    if (confirm(`Remove "${skill.name}" from your skills?`)) {
                      const token = localStorage.getItem('token');
                      try {
                        const response = await fetch(`/api/skills/${skill.id}`, {
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
          <button
            onClick={() => openEditModal('skills', { selectedSkill: '', newSkillName: '' })}
            className="text-sm text-kanyini-primary hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Details
          </button>
        )}
      </div>
        </div>
      )}

      {/* Intellsys Section */}
      <a 
        href="https://www.intellsys.ai/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block bg-white rounded-lg shadow p-10 mb-4 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <h3 className="text-lg font-semibold text-center mb-3">Secured by</h3>
        <div className="flex justify-center items-center py-4 px-4">
          <img 
            src="https://iba-consulting-prod.b-cdn.net/footer/gj-logos/Intellsys2.png" 
            alt="Intellsys" 
            className="max-w-full h-auto"
          />
        </div>
      </a>

      {/* Logout Button */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Edit Modals */}
      
      {/* Edit Profile Header (Name + Photo) */}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={editValues.name || ''}
              onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
              placeholder="Your full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
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
                      <Loader2 className="w-8 h-8 text-kanyini-primary animate-spin mb-2" />
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary min-h-[150px]"
          rows={6}
        />
      </EditModal>

      {/* Edit Contact Details */}
      <EditModal
        isOpen={editModal === 'contact'}
        onClose={closeEditModal}
        title="Edit Contact Details"
        onSave={() => {
          // Convert linksArray back to "Text | URL" format
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={editValues.phone || ''}
                onChange={(e) => setEditValues({ ...editValues, phone: e.target.value })}
                placeholder="+254-712345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Time to Connect
              </label>
              <textarea
                value={editValues.preferred_time_to_connect || ''}
                onChange={(e) => setEditValues({ ...editValues, preferred_time_to_connect: e.target.value })}
                placeholder="e.g., Weekday evenings after 6 PM"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Way to Connect
              </label>
              <textarea
                value={editValues.preferred_way_to_connect || ''}
                onChange={(e) => setEditValues({ ...editValues, preferred_way_to_connect: e.target.value })}
                placeholder="e.g., Email or WhatsApp preferred"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
                rows={2}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Links
                </label>
                <button
                  type="button"
                  onClick={addLink}
                  className="flex items-center gap-1 text-sm text-kanyini-primary hover:text-green-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Link
        </button>
      </div>
              <p className="text-xs text-gray-500 mb-3">
                Add any links (LinkedIn, Twitter, Portfolio, etc.)
              </p>
              <div className="space-y-3">
                {(editValues.linksArray && editValues.linksArray.length > 0 ? editValues.linksArray : [{ text: '', url: '' }]).map((link: any, index: number) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={link.text || ''}
                        onChange={(e) => updateLink(index, 'text', e.target.value)}
                        placeholder="Text (e.g., LinkedIn)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
                      />
                      <input
                        type="text"
                        value={link.url || ''}
                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                        placeholder="URL (e.g., linkedin.com/in/username)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
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
          placeholder="e.g., I am working in Saudi in petroleum industry. Can help with oil & gas sector career guidance..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary min-h-[150px]"
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
            ? `/api/experience/${editValues.id}` 
            : '/api/experience';
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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-base"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <input
              type="text"
              value={editValues.industry || ''}
              onChange={(e) => setEditValues({ ...editValues, industry: e.target.value })}
              placeholder="e.g., Technology, Healthcare, Finance"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-base"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-base appearance-none bg-white"
              style={{ 
                minHeight: '48px',
                lineHeight: '1.5'
              }}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="month"
              value={editValues.end_date || ''}
              onChange={(e) => setEditValues({ ...editValues, end_date: e.target.value })}
              disabled={editValues.is_present}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary disabled:bg-gray-100 disabled:text-gray-500 text-base appearance-none bg-white"
              style={{ 
                minHeight: '48px',
                lineHeight: '1.5'
              }}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_present"
              checked={editValues.is_present || false}
              onChange={(e) => setEditValues({ ...editValues, is_present: e.target.checked, end_date: e.target.checked ? '' : editValues.end_date })}
              className="w-4 h-4 text-kanyini-primary border-gray-300 rounded focus:ring-kanyini-primary"
            />
            <label htmlFor="is_present" className="ml-2 text-sm text-gray-700">
              I currently work here
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State/Region/County
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editValues.description || ''}
              onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
              placeholder="Describe your role and responsibilities..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-base"
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
                    const response = await fetch(`/api/experience/${editValues.id}`, {
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
            ? `/api/education/${editValues.id}` 
            : '/api/education';
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
          {/* Type Toggle */}
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
                  className="w-4 h-4 text-kanyini-primary"
                />
                <span className="ml-2 text-sm text-gray-700">Education</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="certificate"
                  checked={editValues.type === 'certificate'}
                  onChange={(e) => setEditValues({ ...editValues, type: e.target.value, school: '' })}
                  className="w-4 h-4 text-kanyini-primary"
                />
                <span className="ml-2 text-sm text-gray-700">Certificate</span>
              </label>
            </div>
          </div>

          {/* School - only for education */}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-base"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-base"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Year
            </label>
            <input
              type="text"
              value={editValues.start_date || ''}
              onChange={(e) => setEditValues({ ...editValues, start_date: e.target.value })}
              placeholder="YYYY (e.g., 2015)"
              maxLength={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Year
            </label>
            <input
              type="text"
              value={editValues.end_date || ''}
              onChange={(e) => setEditValues({ ...editValues, end_date: e.target.value })}
              disabled={editValues.is_present}
              placeholder="YYYY (e.g., 2019)"
              maxLength={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary disabled:bg-gray-100 disabled:text-gray-500 text-base"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="edu_is_present"
              checked={editValues.is_present || false}
              onChange={(e) => setEditValues({ ...editValues, is_present: e.target.checked, end_date: e.target.checked ? '' : editValues.end_date })}
              className="w-4 h-4 text-kanyini-primary border-gray-300 rounded focus:ring-kanyini-primary"
            />
            <label htmlFor="edu_is_present" className="ml-2 text-sm text-gray-700">
              Currently studying
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editValues.description || ''}
              onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
              placeholder="Describe what you learned, achievements, etc..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-base"
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
                    const response = await fetch(`/api/education/${editValues.id}`, {
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
            const response = await fetch('/api/skills', {
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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-base"
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

