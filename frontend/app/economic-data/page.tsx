'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BLSDataPoint {
  year: string;
  period: string;
  periodName: string;
  value: string;
}

interface EconomicIndicator {
  seriesId: string;
  name: string;
  data: BLSDataPoint[];
  lastUpdated: string;
}

interface EconomicDataResponse {
  success: boolean;
  data?: {
    economicIndicators: EconomicIndicator[];
    currentUnemploymentRate: number | null;
    lastUpdated: string;
  };
  message?: string;
  error?: string;
}

export default function EconomicDataPage() {
  const [economicData, setEconomicData] = useState<EconomicIndicator[]>([]);
  const [unemploymentRate, setUnemploymentRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetchEconomicData();
  }, []);

  const fetchEconomicData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/careers/economic-data`
      );
      const data: EconomicDataResponse = await response.json();

      if (data.success && data.data) {
        setEconomicData(data.data.economicIndicators);
        setUnemploymentRate(data.data.currentUnemploymentRate);
        setMessage(data.message || '');
      } else {
        setError(data.error || data.message || 'Failed to load economic data');
      }
    } catch (err) {
      console.error('Error fetching economic data:', err);
      setError('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // BLS API returns data in reverse chronological order (most recent first)
  const getLatestValue = (indicator: EconomicIndicator): string => {
    if (indicator.data && indicator.data.length > 0) {
      return indicator.data[0].value;
    }
    return 'N/A';
  };

  // Get the period label for the most recent data point
  const getLatestPeriod = (indicator: EconomicIndicator): string => {
    if (indicator.data && indicator.data.length > 0) {
      const d = indicator.data[0];
      return `${d.periodName} ${d.year}`;
    }
    return '';
  };

  const formatValue = (name: string, value: string): string => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;

    if (name.includes('CPI') || name.includes('Price Index')) {
      return numValue.toFixed(1);
    }
    if (name.includes('Unemployment') || name.includes('Rate')) {
      return `${numValue.toFixed(1)}%`;
    }
    if (name.includes('Earnings') || name.includes('Wage')) {
      return `$${numValue.toFixed(2)}/hr`;
    }
    return value;
  };

  const getIndicatorIcon = (name: string): string => {
    if (name.includes('CPI') || name.includes('Price')) return '📊';
    if (name.includes('Unemployment')) return '👥';
    if (name.includes('Earnings') || name.includes('Wage')) return '💰';
    return '📈';
  };

  // Returns Tailwind-compatible color class suffix for different indicators
  const getIndicatorBorderStyle = (name: string): React.CSSProperties => {
    if (name.includes('CPI') || name.includes('Price')) {
      return { borderTopColor: '#3B82F6' }; // blue-500
    }
    if (name.includes('Unemployment')) {
      return { borderTopColor: '#F97316' }; // orange-500
    }
    if (name.includes('Earnings') || name.includes('Wage')) {
      return { borderTopColor: '#22C55E' }; // green-500
    }
    return { borderTopColor: '#A855F7' }; // purple-500
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading economic data from BLS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
                ← Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Economic Insights</h1>
              <p className="text-gray-600 mt-1">
                Real-time economic data from the U.S. Bureau of Labor Statistics
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Live Data
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-800">BLS Data Not Available</h3>
                <p className="text-yellow-700 mt-1">{error}</p>
                <p className="text-yellow-600 mt-2 text-sm">
                  Check that the backend is running and BLS integration is enabled. See the README for setup instructions.
                </p>
              </div>
            </div>
          </div>
        ) : economicData.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <span className="text-2xl mr-3">ℹ️</span>
              <div>
                <h3 className="font-semibold text-blue-800">No Economic Data Available</h3>
                <p className="text-blue-700 mt-1">{message}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {economicData.map((indicator) => {
                return (
                  <div
                    key={indicator.seriesId}
                    className="bg-white rounded-xl shadow-lg p-6 border-t-4"
                    style={getIndicatorBorderStyle(indicator.name)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{getIndicatorIcon(indicator.name)}</span>
                      <span className="text-sm text-gray-500">{getLatestPeriod(indicator)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {indicator.name}
                    </h3>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatValue(indicator.name, getLatestValue(indicator))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Series: {indicator.seriesId}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Current Unemployment Highlight */}
            {unemploymentRate !== null && (
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 mb-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium opacity-90">Current Unemployment Rate</h3>
                    <p className="text-4xl font-bold mt-2">{unemploymentRate.toFixed(1)}%</p>
                  </div>
                  <div className="text-6xl opacity-50">👥</div>
                </div>
              </div>
            )}

            {/* Historical Data Tables */}
            <div className="space-y-8">
              {economicData.map((indicator) => (
                <div key={indicator.seriesId} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getIndicatorIcon(indicator.name)} {indicator.name} - Historical Data
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Period
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Year
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {indicator.data.slice(0, 12).map((dataPoint, idx) => (
                          <tr key={idx} className={idx === 0 ? 'bg-blue-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {dataPoint.periodName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {dataPoint.year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatValue(indicator.name, dataPoint.value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Source */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>
                Data provided by the{' '}
                <a
                  href="https://www.bls.gov/developers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  U.S. Bureau of Labor Statistics API
                </a>
              </p>
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
          >
            Back to Home
          </Link>
          <Link
            href="/results"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            View Career Matches
          </Link>
        </div>
      </div>
    </div>
  );
}
