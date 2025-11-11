'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Edit, CheckCircle, XCircle, User, Loader2, Download, Upload, X, CheckCircle2 } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  is_verified?: boolean;
  profile_picture_url?: string;
  phone?: string;
  created_at: string;
  current_designation?: string;
  current_company?: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (showBulkImport) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showBulkImport]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (response.ok) {
        await fetchUsers();
      } else {
        alert('Failed to update user status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update user status');
    }
  };

  const toggleVerification = async (userId: string, currentStatus: boolean) => {
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
        await fetchUsers();
      } else {
        alert('Failed to update verification status');
      }
    } catch (error) {
      console.error('Error toggling verification:', error);
      alert('Failed to update verification status');
    }
  };

  const downloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/bulk/template?token=${token}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users-import-template.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download template');
      }
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResults(null);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/users/bulk/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setImportResults(data);
        await fetchUsers(); // Refresh the user list
      } else {
        alert(data.error || 'Failed to import users');
      }
    } catch (error) {
      console.error('Error importing users:', error);
      alert('Failed to import users');
    } finally {
      setImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">View and manage all users in the system</p>
        </div>
        <button
          onClick={() => setShowBulkImport(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          <Upload className="w-4 h-4" />
          Bulk Import
        </button>
      </div>

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Bulk Import Users</h2>
              <button
                onClick={() => {
                  setShowBulkImport(false);
                  setImportResults(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Download the CSV template below</li>
                  <li>Fill in the user data (email and name are required)</li>
                  <li>Optionally add education details (school, course, degree, years, description)</li>
                  <li>Upload the completed CSV file</li>
                  <li>Review the import results</li>
                </ol>
                <p className="text-xs text-blue-700 mt-2">
                  <strong>Note:</strong> The CSV includes fields for user information and education. Education fields are optional.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {importing ? 'Importing...' : 'Upload CSV'}
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={importing}
                    className="hidden"
                  />
                </label>
              </div>

              {importing && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              )}

              {importResults && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-md ${
                    importResults.summary.failed === 0 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <h3 className="font-semibold mb-2">
                      {importResults.summary.failed === 0 ? '✅ Import Successful!' : '⚠️ Import Completed with Errors'}
                    </h3>
                    <p className="text-sm">
                      Total: {importResults.summary.total} | 
                      Successful: <span className="text-green-600 font-semibold">{importResults.summary.successful}</span> | 
                      Failed: <span className="text-red-600 font-semibold">{importResults.summary.failed}</span>
                    </p>
                  </div>

                  {importResults.errors.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-600 mb-2">Errors:</h4>
                      <div className="max-h-40 overflow-y-auto border border-red-200 rounded-md">
                        <table className="w-full text-sm">
                          <thead className="bg-red-50">
                            <tr>
                              <th className="px-3 py-2 text-left">Row</th>
                              <th className="px-3 py-2 text-left">Email</th>
                              <th className="px-3 py-2 text-left">Error</th>
                            </tr>
                          </thead>
                          <tbody>
                            {importResults.errors.map((error: any, idx: number) => (
                              <tr key={idx} className="border-t border-red-100">
                                <td className="px-3 py-2">{error.row}</td>
                                <td className="px-3 py-2">{error.email}</td>
                                <td className="px-3 py-2 text-red-600">{error.error}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {importResults.success.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2">Successfully Imported:</h4>
                      <div className="max-h-40 overflow-y-auto border border-green-200 rounded-md">
                        <table className="w-full text-sm">
                          <thead className="bg-green-50">
                            <tr>
                              <th className="px-3 py-2 text-left">Row</th>
                              <th className="px-3 py-2 text-left">Email</th>
                              <th className="px-3 py-2 text-left">Name</th>
                              <th className="px-3 py-2 text-left">Role</th>
                              <th className="px-3 py-2 text-left">Status</th>
                              <th className="px-3 py-2 text-left">Verified</th>
                              <th className="px-3 py-2 text-left">Education</th>
                            </tr>
                          </thead>
                          <tbody>
                            {importResults.success.map((item: any, idx: number) => (
                              <tr key={idx} className="border-t border-green-100">
                                <td className="px-3 py-2">{item.row}</td>
                                <td className="px-3 py-2">{item.email}</td>
                                <td className="px-3 py-2">{item.name}</td>
                                <td className="px-3 py-2">
                                  <span className={`px-2 py-0.5 rounded text-xs ${
                                    item.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {item.role}
                                  </span>
                                </td>
                                <td className="px-3 py-2">
                                  <span className={`px-2 py-0.5 rounded text-xs ${
                                    item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {item.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="px-3 py-2">
                                  {item.is_verified ? (
                                    <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                      ✓ Verified
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                      Unverified
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-2">
                                  {item.education_added ? (
                                    <span className="px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-800">
                                      ✓ Added
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-xs">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Active Users</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter(u => u.is_active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Verified Users</p>
          <p className="text-2xl font-bold text-blue-600">
            {users.filter(u => u.is_verified).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Pending Approval</p>
          <p className="text-2xl font-bold text-orange-600">
            {users.filter(u => !u.is_active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Admins</p>
          <p className="text-2xl font-bold text-indigo-600">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden flex-shrink-0">
                        {user.profile_picture_url ? (
                          <img src={user.profile_picture_url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || 'No name'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    {user.phone && <div className="text-xs text-gray-500">{user.phone}</div>}
                  </td>
                  <td className="px-6 py-4">
                    {user.current_designation ? (
                      <div>
                        <div className="text-sm text-gray-900">{user.current_designation}</div>
                        {user.current_company && (
                          <div className="text-xs text-gray-500">{user.current_company}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not set</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                      className={`flex items-center gap-1 px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                        user.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {user.is_active ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleVerification(user.id, user.is_verified || false)}
                      className={`flex items-center gap-1 px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                        user.is_verified
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {user.is_verified ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Unverified
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}

