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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Alumni Portal</h1>
        <p className="text-gray-600 text-center mb-8">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex gap-2">
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
              <button
                type="button"
                onClick={handleRequestOTP}
                disabled={requestingOTP || !email}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {requestingOTP ? 'Sending...' : 'Request OTP'}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                // Allow up to 6 digits (for email OTP) or 4 digits (for secret OTP)
                setOtp(value.slice(0, 6));
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter OTP"
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              {otpSent 
                ? '✓ OTP sent! Check your email. (Valid for 10 minutes)'
                : 'Enter the OTP sent to your email, or use secret OTP 7274'}
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

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
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

