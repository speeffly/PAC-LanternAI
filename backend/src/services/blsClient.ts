/**
 * BLS (Bureau of Labor Statistics) API Client
 * 
 * Fetches economic time-series data (CPI, unemployment, wages, etc.)
 * from the U.S. Bureau of Labor Statistics public API.
 * 
 * API Documentation: https://www.bls.gov/developers/
 */

// BLS API response types
export interface BLSSeriesData {
  year: string;
  period: string;
  periodName: string;
  value: string;
  footnotes: Array<{ code: string; text: string }>;
}

export interface BLSSeries {
  seriesID: string;
  data: BLSSeriesData[];
}

export interface BLSApiResponse {
  status: string;
  responseTime: number;
  message: string[];
  Results?: {
    series: BLSSeries[];
  };
}

export interface BLSClientConfig {
  apiKey?: string;
  baseUrl?: string;
  enableCache?: boolean;
  cacheTTL?: number; // in milliseconds
  maxRetries?: number;
  retryDelay?: number; // base delay in milliseconds
}

// Cache entry type
interface CacheEntry {
  data: BLSSeries[];
  timestamp: number;
}

// Default configuration
const DEFAULT_CONFIG: Required<BLSClientConfig> = {
  apiKey: '',
  baseUrl: 'https://api.bls.gov/publicAPI/v2',
  enableCache: true,
  cacheTTL: 3600000, // 1 hour
  maxRetries: 3,
  retryDelay: 1000, // 1 second
};

// In-memory cache
const cache = new Map<string, CacheEntry>();

/**
 * Generate a cache key for a request
 */
function getCacheKey(seriesIds: string[], startYear?: number, endYear?: number): string {
  return `${seriesIds.sort().join(',')}_${startYear || 'null'}_${endYear || 'null'}`;
}

/**
 * Check if a cache entry is still valid
 */
function isCacheValid(entry: CacheEntry, ttl: number): boolean {
  return Date.now() - entry.timestamp < ttl;
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get the BLS client configuration from environment variables
 */
function getConfig(overrides?: Partial<BLSClientConfig>): Required<BLSClientConfig> {
  return {
    ...DEFAULT_CONFIG,
    apiKey: process.env.BLS_API_KEY || '',
    enableCache: process.env.BLS_CACHE_ENABLED !== 'false',
    ...overrides,
  };
}

/**
 * Make an HTTP request with retry logic and exponential backoff
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  config: Required<BLSClientConfig>
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < config.maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Handle rate limiting (429) with exponential backoff
      if (response.status === 429) {
        const delay = config.retryDelay * Math.pow(2, attempt);
        console.warn(`BLS API rate limited. Retrying in ${delay}ms (attempt ${attempt + 1}/${config.maxRetries})`);
        await sleep(delay);
        continue;
      }

      // Return response for any other status (let caller handle errors)
      return response;
    } catch (error) {
      lastError = error as Error;
      const delay = config.retryDelay * Math.pow(2, attempt);
      console.warn(`BLS API request failed. Retrying in ${delay}ms (attempt ${attempt + 1}/${config.maxRetries}): ${(error as Error).message}`);
      await sleep(delay);
    }
  }

  throw new Error(`BLS API request failed after ${config.maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Fetch series data from the BLS API
 */
async function fetchSeriesData(
  seriesIds: string[],
  startYear?: number,
  endYear?: number,
  config?: Partial<BLSClientConfig>
): Promise<BLSSeries[]> {
  const fullConfig = getConfig(config);
  const cacheKey = getCacheKey(seriesIds, startYear, endYear);

  // Check cache first
  if (fullConfig.enableCache) {
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached, fullConfig.cacheTTL)) {
      return cached.data;
    }
  }

  // Build request body
  const requestBody: Record<string, unknown> = {
    seriesid: seriesIds,
  };

  if (startYear !== undefined) {
    requestBody.startyear = startYear.toString();
  }

  if (endYear !== undefined) {
    requestBody.endyear = endYear.toString();
  }

  // Add API key if available (enables higher rate limits)
  if (fullConfig.apiKey) {
    requestBody.registrationkey = fullConfig.apiKey;
  }

  const url = `${fullConfig.baseUrl}/timeseries/data/`;
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  const response = await fetchWithRetry(url, options, fullConfig);

  if (!response.ok) {
    throw new Error(`BLS API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as BLSApiResponse;

  if (data.status !== 'REQUEST_SUCCEEDED') {
    const errorMessages = data.message?.join('; ') || 'Unknown BLS API error';
    throw new Error(`BLS API error: ${errorMessages}`);
  }

  const series = data.Results?.series || [];

  // Cache the result
  if (fullConfig.enableCache) {
    cache.set(cacheKey, {
      data: series,
      timestamp: Date.now(),
    });
  }

  return series;
}

/**
 * Get a single time series from the BLS API
 * 
 * @param seriesId - The BLS series ID (e.g., 'CUSR0000SA0' for CPI)
 * @param startYear - Optional start year for the data range
 * @param endYear - Optional end year for the data range
 * @param config - Optional configuration overrides
 * @returns The series data or null if not found
 * 
 * @example
 * // Fetch CPI data for 2020-2023
 * const cpi = await getSeries('CUSR0000SA0', 2020, 2023);
 */
export async function getSeries(
  seriesId: string,
  startYear?: number,
  endYear?: number,
  config?: Partial<BLSClientConfig>
): Promise<BLSSeries | null> {
  const series = await fetchSeriesData([seriesId], startYear, endYear, config);
  return series.find(s => s.seriesID === seriesId) || null;
}

/**
 * Get multiple time series from the BLS API
 * 
 * @param seriesIds - Array of BLS series IDs
 * @param startYear - Optional start year for the data range
 * @param endYear - Optional end year for the data range
 * @param config - Optional configuration overrides
 * @returns Array of series data
 * 
 * @example
 * // Fetch CPI and unemployment data
 * const data = await getMultipleSeries(['CUSR0000SA0', 'LNS14000000'], 2020, 2023);
 */
export async function getMultipleSeries(
  seriesIds: string[],
  startYear?: number,
  endYear?: number,
  config?: Partial<BLSClientConfig>
): Promise<BLSSeries[]> {
  // BLS API has a limit of 50 series per request (25 for unauthenticated)
  const fullConfig = getConfig(config);
  const maxSeriesPerRequest = fullConfig.apiKey ? 50 : 25;

  if (seriesIds.length <= maxSeriesPerRequest) {
    return fetchSeriesData(seriesIds, startYear, endYear, config);
  }

  // Split into multiple requests if needed
  const results: BLSSeries[] = [];
  for (let i = 0; i < seriesIds.length; i += maxSeriesPerRequest) {
    const batch = seriesIds.slice(i, i + maxSeriesPerRequest);
    const batchResults = await fetchSeriesData(batch, startYear, endYear, config);
    results.push(...batchResults);
  }

  return results;
}

/**
 * Clear the BLS data cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get current cache size
 */
export function getCacheSize(): number {
  return cache.size;
}

/**
 * Check if BLS API key is configured
 */
export function isApiKeyConfigured(): boolean {
  return !!process.env.BLS_API_KEY;
}

// Common BLS series IDs for reference
export const BLS_SERIES = {
  // Consumer Price Index
  CPI_ALL_URBAN: 'CUSR0000SA0', // CPI for All Urban Consumers
  CPI_FOOD: 'CUSR0000SAF1', // CPI Food
  CPI_ENERGY: 'CUSR0000SA0E', // CPI Energy
  CPI_MEDICAL: 'CUSR0000SAM', // CPI Medical Care

  // Employment
  UNEMPLOYMENT_RATE: 'LNS14000000', // Civilian Unemployment Rate
  EMPLOYMENT_POPULATION_RATIO: 'LNS12300000', // Employment-Population Ratio
  LABOR_FORCE_PARTICIPATION: 'LNS11300000', // Labor Force Participation Rate

  // Wages
  AVERAGE_HOURLY_EARNINGS: 'CES0500000003', // Average Hourly Earnings
  
  // Producer Price Index
  PPI_FINAL_DEMAND: 'WPUFD49104', // PPI Final Demand
} as const;

export type BLSSeriesId = typeof BLS_SERIES[keyof typeof BLS_SERIES];

// Export default client object for convenience
export default {
  getSeries,
  getMultipleSeries,
  clearCache,
  getCacheSize,
  isApiKeyConfigured,
  BLS_SERIES,
};
