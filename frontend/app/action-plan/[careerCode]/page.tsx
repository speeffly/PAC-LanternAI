'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface ActionStep {
  id: string;
  title: string;
  description: string;
  category: 'education' | 'skills' | 'experience' | 'networking' | 'research';
  timeframe: 'immediate' | 'short-term' | 'long-term';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  resources?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'course' | 'website';
  }[];
}

interface ActionPlan {
  careerTitle: string;
  careerCode: string;
  steps: ActionStep[];
  milestones: {
    title: string;
    description: string;
    targetDate?: string;
  }[];
  estimatedTimeToCareer: string;
}

export default function ActionPlanPage() {
  const router = useRouter();
  const params = useParams();
  const careerCode = params.careerCode as string;
  
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'immediate' | 'short-term' | 'long-term'>('all');

  useEffect(() => {
    loadActionPlan();
  }, [careerCode]);

  const loadActionPlan = async () => {
    try {
      const user = localStorage.getItem('user');
      const userData = user ? JSON.parse(user) : null;
      const zipCode = localStorage.getItem('zipCode') || userData?.zipCode;
      const grade = userData?.grade;

      const queryParams = new URLSearchParams();
      if (grade) queryParams.append('grade', grade.toString());
      if (zipCode) queryParams.append('zipCode', zipCode);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/action-plans/${careerCode}?${queryParams}`
      );
      const data = await response.json();

      if (data.success) {
        setActionPlan(data.data);
      } else {
        setError(data.error || 'Failed to load action plan');
      }
    } catch (error) {
      console.error('Error loading action plan:', error);
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStepCompletion = (stepId: string) => {
    if (!actionPlan) return;

    const updatedSteps = actionPlan.steps.map(step =>
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );

    setActionPlan({
      ...actionPlan,
      steps: updatedSteps
    });

    // Save to localStorage
    const savedPlans = JSON.parse(localStorage.getItem('actionPlans') || '{}');
    savedPlans[careerCode] = updatedSteps.map(s => ({ id: s.id, completed: s.completed }));
    localStorage.setItem('actionPlans', JSON.stringify(savedPlans));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'education':
        return '🎓';
      case 'skills':
        return '💪';
      case 'experience':
        return '💼';
      case 'networking':
        return '🤝';
      case 'research':
        return '🔍';
      default:
        return '📋';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'education':
        return 'bg-blue-100 text-blue-800';
      case 'skills':
        return 'bg-green-100 text-green-800';
      case 'experience':
        return 'bg-purple-100 text-purple-800';
      case 'networking':
        return 'bg-orange-100 text-orange-800';
      case 'research':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeframeBadge = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Now</span>;
      case 'short-term':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">1-6 months</span>;
      case 'long-term':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">6+ months</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading action plan...</div>
      </div>
    );
  }

  if (error || !actionPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Action plan not found'}</p>
          <Link href="/results" className="text-blue-600 hover:underline">
            Back to Results
          </Link>
        </div>
      </div>
    );
  }

  const filteredSteps = filter === 'all' 
    ? actionPlan.steps 
    : actionPlan.steps.filter(s => s.timeframe === filter);

  const completedCount = actionPlan.steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / actionPlan.steps.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/results" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Results
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Action Plan: {actionPlan.careerTitle}
          </h1>
          <p className="text-gray-600">
            Estimated time to career: {actionPlan.estimatedTimeToCareer}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Progress</h2>
            <span className="text-2xl font-bold text-blue-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {completedCount} of {actionPlan.steps.length} steps completed
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg ${
                    filter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Steps
                </button>
                <button
                  onClick={() => setFilter('immediate')}
                  className={`px-4 py-2 rounded-lg ${
                    filter === 'immediate' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Immediate
                </button>
                <button
                  onClick={() => setFilter('short-term')}
                  className={`px-4 py-2 rounded-lg ${
                    filter === 'short-term' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Short-term
                </button>
                <button
                  onClick={() => setFilter('long-term')}
                  className={`px-4 py-2 rounded-lg ${
                    filter === 'long-term' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Long-term
                </button>
              </div>
            </div>

            {/* Action Steps */}
            <div className="space-y-4">
              {filteredSteps.map((step) => (
                <div
                  key={step.id}
                  className={`bg-white rounded-lg shadow-lg p-6 transition-all ${
                    step.completed ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={step.completed}
                      onChange={() => toggleStepCompletion(step.id)}
                      className="mt-1 h-5 w-5 text-blue-600 rounded cursor-pointer"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-lg font-semibold ${
                          step.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {getCategoryIcon(step.category)} {step.title}
                        </h3>
                        {getTimeframeBadge(step.timeframe)}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{step.description}</p>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`px-3 py-1 text-sm rounded-full ${getCategoryColor(step.category)}`}>
                          {step.category.charAt(0).toUpperCase() + step.category.slice(1)}
                        </span>
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          step.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : step.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {step.priority.charAt(0).toUpperCase() + step.priority.slice(1)} Priority
                        </span>
                      </div>

                      {step.resources && step.resources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">Resources:</p>
                          <div className="space-y-1">
                            {step.resources.map((resource, idx) => (
                              <a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-sm text-blue-600 hover:underline"
                              >
                                📎 {resource.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Milestones */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Key Milestones</h3>
              <div className="space-y-4">
                {actionPlan.milestones.map((milestone, idx) => (
                  <div key={idx} className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {idx + 1}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/careers/${careerCode}`}
                  className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-center"
                >
                  View Career Details
                </Link>
                <button
                  onClick={() => window.print()}
                  className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 text-center"
                >
                  Print Action Plan
                </button>
                <Link
                  href="/results"
                  className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 text-center"
                >
                  Explore Other Careers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
