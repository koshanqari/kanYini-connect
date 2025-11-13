'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, Video, FileText, X, Loader2 } from 'lucide-react';

export default function CreatePostPage() {
  const router = useRouter();
  const [postType, setPostType] = useState<'text' | 'photo' | 'video'>('text');
  const [content, setContent] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  // Sample projects for dropdown
  const projects = [
    { id: '1', name: 'Clean Water for Rural Communities' },
    { id: '2', name: 'Indigenous Knowledge Documentation' },
    { id: '3', name: 'Coastal Ecosystem Restoration' },
    { id: '4', name: 'Youth Environmental Leadership Program' },
    { id: '5', name: 'Urban Reforestation Initiative' },
    { id: '6', name: 'Renewable Energy for Schools' },
    { id: '7', name: 'Sustainable Agriculture Training' },
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!content.trim() || !selectedProject) {
      alert('Please fill in all required fields');
      return;
    }

    setPosting(true);
    // Simulate posting
    setTimeout(() => {
      setPosting(false);
      router.push('/app/jobs'); // Redirect to Feed after posting
    }, 1500);
  };

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
          <h1 className="text-xl font-bold text-gray-900">Create Post</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Post Type Selection */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Post Type</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => {
                setPostType('text');
                setImagePreview(null);
                setVideoPreview(null);
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                postType === 'text'
                  ? 'border-kanyini-primary bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText className={`w-6 h-6 ${postType === 'text' ? 'text-kanyini-primary' : 'text-gray-600'}`} />
              <span className={`text-xs font-medium ${postType === 'text' ? 'text-kanyini-primary' : 'text-gray-600'}`}>
                Text
              </span>
            </button>
            <button
              onClick={() => {
                setPostType('photo');
                setVideoPreview(null);
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                postType === 'photo'
                  ? 'border-kanyini-primary bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <ImageIcon className={`w-6 h-6 ${postType === 'photo' ? 'text-kanyini-primary' : 'text-gray-600'}`} />
              <span className={`text-xs font-medium ${postType === 'photo' ? 'text-kanyini-primary' : 'text-gray-600'}`}>
                Photo
              </span>
            </button>
            <button
              onClick={() => {
                setPostType('video');
                setImagePreview(null);
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                postType === 'video'
                  ? 'border-kanyini-primary bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Video className={`w-6 h-6 ${postType === 'video' ? 'text-kanyini-primary' : 'text-gray-600'}`} />
              <span className={`text-xs font-medium ${postType === 'video' ? 'text-kanyini-primary' : 'text-gray-600'}`}>
                Video
              </span>
            </button>
          </div>
        </div>

        {/* Project Selection */}
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Project <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
          >
            <option value="">Choose a project...</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content Input */}
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            What's on your mind? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an update, story, or progress about the project..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kanyini-primary resize-none"
            rows={6}
          />
          <p className="text-xs text-gray-500 mt-2">{content.length} characters</p>
        </div>

        {/* Media Upload */}
        {postType === 'photo' && (
          <div className="bg-white rounded-lg shadow p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add Photo
            </label>
            <div className="space-y-3">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-kanyini-primary transition">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {postType === 'video' && (
          <div className="bg-white rounded-lg shadow p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add Video
            </label>
            <div className="space-y-3">
              {videoPreview ? (
                <div className="relative">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setVideoPreview(null)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-kanyini-primary transition">
                  <Video className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload video</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {/* Post Button */}
        <div className="sticky bottom-20 bg-white rounded-lg shadow-lg p-4">
          <button
            onClick={handlePost}
            disabled={posting || !content.trim() || !selectedProject}
            className="w-full bg-kanyini-primary text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-sm disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {posting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Posting...
              </>
            ) : (
              'Post'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

