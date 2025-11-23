'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Career {
  id: string;
  title: string;
  onetCode: string;
  sector: string;
  description: string;
  averageSalary: number;
  educationLevel: string;
  skills?: string[];
  tasks?: string[];
  workEnvironment?: string;
}

export default function CareerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const careerId = params.id as string;
  
  const [career, setCareer] = useState<Career | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCareerDetails();
  }, [careerId]);

  const loadCareerDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/careers/${careerId}`
      );
      const data = await response.json();

      if (data.success) {
        setCareer(data.data);
      } else {
        setError(data.error || 'Career not found');
      }
    } catch (error) {
      console.error('Error loading career:', error);
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading career details...</div>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Career not found'}</p>
          <Link href="/results" className="text-blue-600 hover:underline">
            Back to Results
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/results" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Results
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{career.title}</h1>
              <p className="text-gray-600 capitalize">{career.sector} Sector</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                ${(career.averageSalary / 1000).toFixed(0)}k
              </div>
              <div className="text-sm text-gray-500">Average Salary</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Career Overview</h2>
              <p className="text-gray-700 leading-relaxed">{career.description}</p>
            </div>

            {/* Tasks */}
            {career.tasks && career.tasks.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">What You'll Do</h2>
                <ul className="space-y-2">
                  {career.tasks.map((task, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span className="text-gray-700">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {career.skills && career.skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Key Skills Needed</h2>
                <div className="flex flex-wrap gap-2">
                  {career.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Work Environment */}
            {career.workEnvironment && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Work Environment</h2>
                <p className="text-gray-700">{career.workEnvironment}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Facts */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Facts</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Education Required</p>
                  <p className="font-medium text-gray-900">{career.educationLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">O*NET Code</p>
                  <p className="font-medium text-gray-900">{career.onetCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sector</p>
                  <p className="font-medium text-gray-900 capitalize">{career.sector}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Take Action</h3>
              <div className="space-y-3">
                <Link
                  href={`/action-plan/${career.id}`}
                  className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 text-center font-medium"
                >
                  📋 Get Your Action Plan
                </Link>
                <a
                  href={`https://www.onetonline.org/link/summary/${career.onetCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 text-center font-medium"
                >
                  🔍 View on O*NET
                </a>
                <a
                  href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs.aspx`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 text-center font-medium"
                >
                  💼 Find Jobs
                </a>
                <Link
                  href="/results"
                  className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 text-center font-medium"
                >
                  ← Back to All Results
                </Link>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Helpful Resources</h3>
              <div className="space-y-3">
                <a
                  href="https://www.careeronestop.org/Toolkit/Training/find-local-training.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline text-sm"
                >
                  📚 Find Training Programs
                </a>
                <a
                  href="https://www.careeronestop.org/Toolkit/Wages/find-salary.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline text-sm"
                >
                  💰 Salary Information
                </a>
                <a
                  href="https://www.careeronestop.org/Videos/CareerVideos/career-videos.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline text-sm"
                >
                  🎥 Career Videos
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
