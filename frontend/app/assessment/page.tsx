'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  order: number;
  text: string;
  type: string;
  options?: string[];
  category: string;
}

export default function AssessmentPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [zipCode, setZipCode] = useState('');
  const [showZipCode, setShowZipCode] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessment/questions`);
      const data = await response.json();
      if (data.success) {
        setQuestions(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Failed to load questions');
    }
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      alert('Please select an answer');
      return;
    }

    const newAnswers = [...answers, {
      questionId: questions[currentIndex].id,
      answer: selectedAnswer,
      timestamp: new Date().toISOString()
    }];
    setAnswers(newAnswers);
    setSelectedAnswer('');

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowZipCode(true);
    }
  };

  const handleSubmit = async () => {
    if (!zipCode || zipCode.length !== 5) {
      alert('Please enter a valid 5-digit ZIP code');
      return;
    }

    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      alert('Session expired. Please start over.');
      router.push('/');
      return;
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessment/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, answers })
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessment/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, zipCode })
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('zipCode', zipCode);
        router.push('/results');
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Failed to submit assessment');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading questions...</div>
      </div>
    );
  }

  if (showZipCode) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Almost Done!</h2>
            <p className="text-gray-600 mb-6">
              Enter your ZIP code to find local career opportunities and training programs.
            </p>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="12345"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 text-lg"
              maxLength={5}
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              See My Career Matches
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Career Quiz</h1>
        </div>
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">{currentQuestion.text}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === option
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-6 py-2 text-gray-600 disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
