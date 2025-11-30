'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CareerChatbot from '@/components/CareerChatbot';

interface Career {
  id: string;
  title: string;
  sector: string;
  description: string;
  averageSalary: number;
}

interface CareerMatch {
  careerId: string;
  career: Career;
  matchScore: number;
  reasoningFactors: string[];
  conversationalExplanation?: {
    explanation: string;
    highlights: string[];
  };
  stepByStepPlan?: {
    steps: {
      stepNumber: number;
      title: string;
      description: string;
      timeframe: string;
      priority: 'high' | 'medium' | 'low';
    }[];
    estimatedTimeToCareer: string;
  };
  localDemand: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const sessionId = localStorage.getItem('sessionId');
    const zipCode = localStorage.getItem('zipCode');

    if (!sessionId || !zipCode) {
      router.push('/');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/careers/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, zipCode })
      });

      const data = await response.json();
      if (data.success) {
        setMatches(data.data.matches);
        setProfile(data.data.profile);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      alert('Failed to load results');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your matches...</div>
      </div>
    );
  }

  const filteredMatches = filter === 'all' 
    ? matches 
    : matches.filter(m => m.career.sector === filter);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Your Career Matches</h1>
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="font-semibold mb-2">Your Profile</h2>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Interests:</span>
              {profile?.interests?.map((interest: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-sm text-gray-600">Skills:</span>
              {profile?.skills?.map((skill: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            All Careers
          </button>
          <button
            onClick={() => setFilter('healthcare')}
            className={`px-4 py-2 rounded-lg ${filter === 'healthcare' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            Healthcare
          </button>
          <button
            onClick={() => setFilter('infrastructure')}
            className={`px-4 py-2 rounded-lg ${filter === 'infrastructure' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            Infrastructure
          </button>
        </div>

        <div className="grid gap-6">
          {filteredMatches.map((match) => (
            <div key={match.careerId} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{match.career.title}</h3>
                  <span className="text-sm text-gray-500 capitalize">{match.career.sector}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{match.matchScore}%</div>
                  <div className="text-sm text-gray-500">Match</div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{match.career.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-gray-500">Average Salary:</span>
                  <span className="ml-2 font-semibold">${match.career.averageSalary.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Local Demand:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    match.localDemand === 'high' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {match.localDemand}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                {match.conversationalExplanation ? (
                  <>
                    <p className="text-sm font-semibold mb-2">Why this matches you:</p>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {match.conversationalExplanation.explanation}
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                      {match.conversationalExplanation.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold mb-2">Why this matches you:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {match.reasoningFactors.map((factor, i) => (
                        <li key={i}>• {factor}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {match.stepByStepPlan && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold mb-3 text-blue-900">Your Step-by-Step Plan:</p>
                  <div className="space-y-3">
                    {match.stepByStepPlan.steps.map((step) => (
                      <div key={step.stepNumber} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                          {step.stepNumber}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900">{step.title}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              step.priority === 'high' ? 'bg-red-100 text-red-800' :
                              step.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {step.priority}
                            </span>
                            <span className="text-xs text-gray-500">{step.timeframe}</span>
                          </div>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-blue-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Estimated time to career:</span>{' '}
                      {match.stepByStepPlan.estimatedTimeToCareer}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => router.push(`/careers/${match.careerId}`)}
                  className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  View Details
                </button>
                <button
                  onClick={() => router.push(`/action-plan/${match.careerId}`)}
                  className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Get Action Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Chatbot - General career questions */}
      <CareerChatbot />
    </div>
  );
}
