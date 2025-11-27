'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Career {
  id: string;
  title: string;
  description: string;
  sector: string;
  requiredEducation: string;
  certifications: string[];
  averageSalary: number;
  salaryRange: { min: number; max: number };
  growthOutlook: string;
  onetCode?: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

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
  currentUnemploymentRate?: number | null;
  lastUpdated: string;
}

export default function CareerDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [career, setCareer] = useState<Career | null>(null);
  const [econ, setEcon] = useState<EconomicDataPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [careerRes, econRes] = await Promise.all([
          fetch(`/api/careers/${encodeURIComponent(id)}`, { cache: 'no-store' }),
          // ✅ Updated line — job-specific economic data
          fetch(`/api/careers/${encodeURIComponent(id)}/economic-data`, { cache: 'no-store' }),
        ]);

        if (!careerRes.ok) {
          const body = await safeJson(careerRes);
          throw new Error(body?.error || body?.message || `Career request failed (${careerRes.status})`);
        }

        if (!econRes.ok) {
          const body = await safeJson(econRes);
          console.warn('Economic data fetch warning:', body?.error || body?.message || econRes.status);
        }

        const careerJson = (await careerRes.json()) as ApiResponse<Career>;
        const econJson = econRes.ok
          ? ((await econRes.json()) as ApiResponse<EconomicDataPayload>)
          : null;

        if (mounted) {
          setCareer(careerJson.data || null);
          setEcon(econJson?.data || null);
        }
      } catch (e: any) {
        console.error(e);
        if (mounted) setErr(e.message || 'Failed to load career details');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading career details...</p>
        </div>
      </div>
    );
  }

  if (err || !career) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-red-800">Unable to load career</h3>
            <p className="text-red-700 mt-1">{err || 'Career not found'}</p>
          </div>
          <Nav />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Career Summary */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{career.title}</h1>
          <p className="text-gray-700 mt-3">{career.description}</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <Info label="Sector" value={capitalize(career.sector)} />
            <Info label="Required Education" value={prettyEdu(career.requiredEducation)} />
            <Info
              label="Salary (National Range)"
              value={`$${career.salaryRange.min.toLocaleString()} - $${career.salaryRange.max.toLocaleString()}`}
            />
            <Info label="Growth Outlook" value={career.growthOutlook} />
          </div>

          {career.certifications?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900">Common Certifications</h3>
              <ul className="list-disc list-inside text-gray-700 mt-2">
                {career.certifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Economic Context */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Economic Context</h2>
            {econ?.lastUpdated && (
              <span className="text-sm text-gray-500">Updated: {new Date(econ.lastUpdated).toLocaleString()}</span>
            )}
          </div>
          {!econ ? (
            <p className="text-gray-600 mt-2">
              Economic data not available. Ensure BLS is enabled on the backend.
            </p>
          ) : (
            <>
              {/* Summary tiles */}
              <div className="grid md:grid-cols-3 gap-6 mt-4">
                {econ.economicIndicators.map((ind) => (
                  <div key={ind.seriesId} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{ind.seriesId}</span>
                      <span>
                        {ind.data?.[0]?.periodName} {ind.data?.[0]?.year}
                      </span>
                    </div>
                    <div className="text-lg font-semibold mt-2">{ind.name}</div>
                    <div className="text-2xl font-bold mt-1">
                      {formatValue(ind.name, ind.data?.[0]?.value ?? 'N/A')}
                    </div>
                  </div>
                ))}
              </div>

              {typeof econ.currentUnemploymentRate === 'number' && (
                <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-800">Current Unemployment Rate</div>
                  <div className="text-3xl font-bold text-orange-700 mt-1">
                    {econ.currentUnemploymentRate.toFixed(1)}%
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <Nav />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white shadow">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="mt-8 flex justify-center gap-4">
      <Link href="/results" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
        View Career Matches
      </Link>
      <Link href="/economic-data" className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
        Economic Insights (Full)
      </Link>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="text-gray-900 font-medium">{value}</div>
    </div>
  );
}

function prettyEdu(e: string) {
  if (e === 'high-school') return 'High School';
  return e.charAt(0).toUpperCase() + e.slice(1);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatValue(name: string, value: string) {
  const num = parseFloat(value);
  if (isNaN(num)) return value || 'N/A';
  if (/\b(CPI|Price Index)\b/i.test(name)) return num.toFixed(1);
  if (/\b(Unemployment|Rate)\b/i.test(name)) return `${num.toFixed(1)}%`;
  if (/\b(Earnings|Wage)\b/i.test(name)) return `$${num.toFixed(2)}/hr`;
  return value;
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
