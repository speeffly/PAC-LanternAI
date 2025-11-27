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

interface EconomicDataPayload {
  economicIndicators: EconomicIndicator[];
  currentUnemploymentRate: number | null;
  lastUpdated: string;
}

interface EconomicDataResponse {
  success: boolean;
  data?: EconomicDataPayload;
  message?: string;
  error?: string;
}

type FetchState =
  | { status: 'loading' }
  | { status: 'error'; message: string; httpStatus?: number }
  | { status: 'empty'; message?: string }
  | { status: 'ready'; indicators: EconomicIndicator[]; unemployment: number | null; infoMessage?: string };

export default function EconomicDataPage() {
  const [state, setState] = useState<FetchState>({ status: 'loading' });

  useEffect(() => {
    fetchEconomicData();
  }, []);

  async function fetchEconomicData() {
    try {
      // Relative path leverages Next.js rewrites
      const response = await fetch('/api/careers/economic-data', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        cache: 'no-store'
      });

      // Handle non-200 responses first
      if (!response.ok) {
        let body: any = null;
        try {
          body = await response.json();
        } catch {
          // ignore parse errors
        }

        const message =
          body?.error ||
          body?.message ||
          `Request failed (HTTP ${response.status})`;

        setState({ status: 'error', message, httpStatus: response.status });
        return;
      }

      // Parse JSON
      const data: EconomicDataResponse = await response.json();

      if (data.success && data.data) {
        const indicators = data.data.economicIndicators || [];
        if (indicators.length === 0) {
          setState({
            status: 'empty',
            message: data.message || 'No economic indicators available.'
          });
          return;
        }
        setState({
          status: 'ready',
          indicators,
            unemployment: data.data.currentUnemploymentRate,
          infoMessage: data.message
        });
        return;
      }

      // success=false or missing data
      const msg = data.error || data.message || 'Economic data unavailable';
      setState({ status: 'empty', message: msg });
    } catch (err: any) {
      console.error('Economic data fetch error:', err);
      setState({
        status: 'error',
        message: 'Failed to connect to server. Verify backend is running on port 3001.'
      });
    }
  }

  // Helpers
  function latestValue(indicator: EconomicIndicator): string {
    const first = indicator.data?.[0];
    if (!first) return 'N/A';
    return first.value;
  }

  function latestPeriod(indicator: EconomicIndicator): string {
    const first = indicator.data?.[0];
    if (!first) return '';
    return `${first.periodName} ${first.year}`;
  }

  function formatValue(name: string, val: string): string {
    const num = parseFloat(val);
    if (isNaN(num)) return val;

    if (/\b(CPI|Price Index)\b/i.test(name)) return num.toFixed(1);
    if (/\b(Unemployment|Rate)\b/i.test(name)) return `${num.toFixed(1)}%`;
    if (/\b(Earnings|Wage)\b/i.test(name)) return `$${num.toFixed(2)}/hr`;
    return val;
  }

  function indicatorIcon(name: string): string {
    if (/\b(CPI|Price)\b/i.test(name)) return '📊';
    if (/\b(Unemployment)\b/i.test(name)) return '👥';
    if (/\b(Earnings|Wage)\b/i.test(name)) return '💰';
    return '📈';
  }

  function indicatorBorderStyle(name: string): React.CSSProperties {
    if (/\b(CPI|Price)\b/i.test(name)) return { borderTopColor: '#3B82F6' };
    if (/\b(Unemployment)\b/i.test(name)) return { borderTopColor: '#F97316' };
    if (/\b(Earnings|Wage)\b/i.test(name)) return { borderTopColor: '#22C55E' };
    return { borderTopColor: '#A855F7' };
  }

  // Render states
  if (state.status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading economic data from BLS...</p>
        </div>
      </div>
    );
  }

  const header = (
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
  );

  if (state.status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50">
        {header}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-800">BLS Data Not Available</h3>
                <p className="text-yellow-700 mt-1">{state.message}</p>
                {state.httpStatus && (
                  <p className="text-yellow-600 mt-2 text-sm">
                    HTTP Status: {state.httpStatus}
                  </p>
                )}
                <p className="text-yellow-600 mt-2 text-sm">
                  Ensure backend is running & rewrites are configured. See README for setup.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  setState({ status: 'loading' });
                  fetchEconomicData();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
          <Navigation />
        </div>
      </div>
    );
  }

  if (state.status === 'empty') {
    return (
      <div className="min-h-screen bg-gray-50">
        {header}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
            <div className="flex items-start">
              <span className="text-3xl mr-4">📊</span>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-blue-900 mb-3">Enable BLS Economic Data</h3>
                <p className="text-blue-700 mb-4">
                  {state.message || 'BLS integration needs to be configured in your backend.'}
                </p>
                <div className="bg-white rounded-lg p-6 border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Quick Setup Guide:</h4>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700">
                    <li>
                      <strong>Open backend .env</strong>
                      <code className="block mt-1 ml-5 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                        backend/.env
                      </code>
                    </li>
                    <li>
                      <strong>Enable BLS:</strong>
                      <code className="block mt-1 ml-5 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                        BLS_ENABLED=true
                      </code>
                    </li>
                    <li>
                      <strong>Optional (API key):</strong>
                      <code className="block mt-1 ml-5 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                        BLS_API_KEY=your_key_here
                      </code>
                    </li>
                    <li>
                      <strong>Restart backend</strong>
                      <code className="block mt-1 ml-5 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                        cd backend && npm run dev
                      </code>
                    </li>
                    <li>
                      <strong>Refresh this page</strong>
                    </li>
                  </ol>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => {
                      setState({ status: 'loading' });
                      fetchEconomicData();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    🔄 Retry Fetch
                  </button>
                  <a
                    href="https://www.bls.gov/developers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 font-medium"
                  >
                    📖 BLS API Docs
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Navigation />
        </div>
      </div>
    );
  }

  // Ready state
  return (
    <div className="min-h-screen bg-gray-50">
      {header}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {state.indicators.map(ind => (
            <div
              key={ind.seriesId}
              className="bg-white rounded-xl shadow-lg p-6 border-t-4"
              style={indicatorBorderStyle(ind.name)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{indicatorIcon(ind.name)}</span>
                <span className="text-sm text-gray-500">{latestPeriod(ind)}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{ind.name}</h3>
              <div className="text-3xl font-bold text-gray-900">
                {formatValue(ind.name, latestValue(ind))}
              </div>
              <p className="text-sm text-gray-500 mt-2">Series: {ind.seriesId}</p>
            </div>
          ))}
        </div>

        {/* Current Unemployment Highlight */}
        {state.unemployment !== null && (
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium opacity-90">Current Unemployment Rate</h3>
                <p className="text-4xl font-bold mt-2">{state.unemployment.toFixed(1)}%</p>
              </div>
              <div className="text-6xl opacity-50">👥</div>
            </div>
          </div>
        )}

        {/* Historical Data Tables */}
        <div className="space-y-8">
          {state.indicators.map(ind => (
            <div key={ind.seriesId} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {indicatorIcon(ind.name)} {ind.name} - Historical Data
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {ind.data.slice(0, 12).map((dp, idx) => (
                      <tr key={idx} className={idx === 0 ? 'bg-blue-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dp.periodName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{dp.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatValue(ind.name, dp.value)}
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

        <Navigation />
      </div>
    </div>
  );
}

function Navigation() {
  return (
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
  );
}