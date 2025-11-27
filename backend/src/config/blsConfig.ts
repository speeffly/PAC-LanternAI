/**
 * BLS Integration Configuration
 * 
 * Configuration options for the BLS (Bureau of Labor Statistics) API integration.
 */

export interface BLSConfig {
  // Enable or disable BLS data enrichment
  enabled: boolean;
  
  // Series IDs to fetch for career economic data
  seriesIds: {
    cpi: string;
    unemployment: string;
    wages: string;
  };
  
  // Cache settings
  cache: {
    enabled: boolean;
    ttlMs: number; // Time to live in milliseconds
  };
  
  // Retry settings
  retry: {
    maxAttempts: number;
    baseDelayMs: number;
  };
}

/**
 * Get BLS configuration from environment variables
 */
export function getBLSConfig(): BLSConfig {
  return {
    enabled: process.env.BLS_ENABLED !== 'false',
    seriesIds: {
      cpi: process.env.BLS_SERIES_CPI || 'CUSR0000SA0',
      unemployment: process.env.BLS_SERIES_UNEMPLOYMENT || 'LNS14000000',
      wages: process.env.BLS_SERIES_WAGES || 'CES0500000003',
    },
    cache: {
      enabled: process.env.BLS_CACHE_ENABLED !== 'false',
      ttlMs: parseInt(process.env.BLS_CACHE_TTL_MS || '3600000', 10), // 1 hour default
    },
    retry: {
      maxAttempts: parseInt(process.env.BLS_RETRY_MAX_ATTEMPTS || '3', 10),
      baseDelayMs: parseInt(process.env.BLS_RETRY_BASE_DELAY_MS || '1000', 10),
    },
  };
}

export default getBLSConfig;
