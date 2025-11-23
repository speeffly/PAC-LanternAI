'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade?: number;
  zipCode?: string;
  profileCompleted: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.data);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('zipCode');
    router.push('/');
  };

  const startAssessment = async () => {
    try {
      // Create a new session
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/start`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success && data.data.sessionId) {
        localStorage.setItem('sessionId', data.data.sessionId);
        router.push('/assessment');
      } else {
        alert('Failed to start assessment. Please try again.');
      }
    } catch (error) {
      console.error('Error starting assessment:', error);
      alert('Failed to connect to server.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Lantern AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.firstName}!</span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Career Journey
          </h2>
          <p className="text-lg text-gray-600">
            Explore career paths in healthcare and infrastructure that match your interests and goals.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Assessment Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900">
                Career Assessment
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Take our 12-question assessment to discover careers that match your interests and skills.
            </p>
            <button
              onClick={startAssessment}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {user.profileCompleted ? 'Retake Assessment' : 'Start Assessment'}
            </button>
          </div>

          {/* Results Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900">
                My Results
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              View your personalized career matches and explore detailed information about each career.
            </p>
            <Link
              href="/results"
              className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              View Results
            </Link>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900">
                My Profile
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Update your personal information, interests, and career preferences.
            </p>
            <Link
              href="/profile"
              className="block w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Profile Status */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Status</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${
                user.profileCompleted ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <span className="text-gray-700">
                Assessment {user.profileCompleted ? 'Completed' : 'Not Started'}
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${
                user.zipCode ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <span className="text-gray-700">
                Location {user.zipCode ? `(${user.zipCode})` : 'Not Set'}
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${
                user.grade ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <span className="text-gray-700">
                Grade Level {user.grade ? `(${user.grade}th Grade)` : 'Not Set'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
