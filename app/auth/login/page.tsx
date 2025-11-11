'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestingOTP, setRequestingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleRequestOTP = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setRequestingOTP(true);
    setError('');
    setSuccess('');
    setOtpSent(false);

    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send OTP');
        return;
      }

      setOtpSent(true);
      setSuccess('OTP has been sent to your email address. Please check your inbox.');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setRequestingOTP(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show specific message if user not found
        if (data.needsSignup) {
          setError(data.message || 'No user found with this email. Please contact admin to get access.');
        } else {
          setError(data.error || 'Login failed');
        }
        return;
      }

      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      // Redirect based on user role
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/app');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center bg-gray-50 pt-8 pb-4 px-4 sm:py-4">
      <div className="max-w-md w-full bg-white p-4 sm:p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <div className="mb-2 sm:mb-4">
            <img 
              src="https://icmhs.co.ke/wp-content/uploads/2022/07/ICMHS_new_logo-without-any-background.png" 
              alt="ICMHS" 
              className="h-12 sm:h-16 w-auto object-contain"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-center">Alumni Portal</h1>
        </div>
        <p className="text-gray-600 text-center mb-4 sm:mb-8 text-sm sm:text-base">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setOtpSent(false);
                setSuccess('');
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              OTP
            </label>
            <div className="flex gap-2">
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setOtp(value.slice(0, 6));
                }}
                required
                className="flex-1 min-w-0 px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter OTP"
                maxLength={6}
              />
              <button
                type="button"
                onClick={handleRequestOTP}
                disabled={requestingOTP || !email}
                className="flex-1 min-w-0 px-2 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm whitespace-nowrap"
              >
                {requestingOTP ? 'Sending...' : 'Request OTP'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {otpSent 
                ? '✓ OTP sent! Check your email. (Valid for 10 minutes)'
                : 'Enter the OTP sent to your email'}
            </p>
          </div>

          {success && (
            <div className="bg-green-50 text-green-600 px-4 py-2 rounded-md text-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center pt-2 sm:pt-4">
            <p className="text-xs sm:text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

