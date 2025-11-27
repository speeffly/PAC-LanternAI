/**
 * Unit tests for BLS (Bureau of Labor Statistics) API Client
 */

import { 
  getSeries, 
  getMultipleSeries, 
  clearCache, 
  getCacheSize,
  isApiKeyConfigured,
  BLS_SERIES,
  BLSSeries
} from '../src/services/blsClient';

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Sample BLS API response for testing
const mockBLSResponse = {
  status: 'REQUEST_SUCCEEDED',
  responseTime: 50,
  message: [],
  Results: {
    series: [
      {
        seriesID: 'CUSR0000SA0',
        data: [
          {
            year: '2023',
            period: 'M12',
            periodName: 'December',
            value: '306.746',
            footnotes: []
          },
          {
            year: '2023',
            period: 'M11',
            periodName: 'November',
            value: '307.051',
            footnotes: []
          }
        ]
      }
    ]
  }
};

const mockMultipleSeriesResponse = {
  status: 'REQUEST_SUCCEEDED',
  responseTime: 75,
  message: [],
  Results: {
    series: [
      {
        seriesID: 'CUSR0000SA0',
        data: [
          {
            year: '2023',
            period: 'M12',
            periodName: 'December',
            value: '306.746',
            footnotes: []
          }
        ]
      },
      {
        seriesID: 'LNS14000000',
        data: [
          {
            year: '2023',
            period: 'M12',
            periodName: 'December',
            value: '3.7',
            footnotes: []
          }
        ]
      }
    ]
  }
};

const mockErrorResponse = {
  status: 'REQUEST_FAILED',
  responseTime: 10,
  message: ['Invalid series ID'],
  Results: null
};

describe('BLS Client', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearCache();
    mockFetch.mockReset();
    // Clear environment variables
    delete process.env.BLS_API_KEY;
    delete process.env.BLS_CACHE_ENABLED;
  });

  describe('getSeries', () => {
    it('should fetch a single series successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBLSResponse
      });

      const result = await getSeries('CUSR0000SA0', 2023, 2023);

      expect(result).not.toBeNull();
      expect(result?.seriesID).toBe('CUSR0000SA0');
      expect(result?.data).toHaveLength(2);
      expect(result?.data[0].value).toBe('306.746');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should return null for non-existent series', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBLSResponse
      });

      const result = await getSeries('NONEXISTENT', 2023, 2023);

      expect(result).toBeNull();
    });

    it('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockErrorResponse
      });

      await expect(getSeries('INVALID', 2023, 2023)).rejects.toThrow('BLS API error: Invalid series ID');
    });

    it('should throw error on HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(getSeries('CUSR0000SA0', 2023, 2023)).rejects.toThrow('BLS API error: 500 Internal Server Error');
    });
  });

  describe('getMultipleSeries', () => {
    it('should fetch multiple series successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMultipleSeriesResponse
      });

      const result = await getMultipleSeries(['CUSR0000SA0', 'LNS14000000'], 2023, 2023);

      expect(result).toHaveLength(2);
      expect(result[0].seriesID).toBe('CUSR0000SA0');
      expect(result[1].seriesID).toBe('LNS14000000');
    });

    it('should work without date range parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBLSResponse
      });

      const result = await getMultipleSeries(['CUSR0000SA0']);

      expect(result).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"seriesid":["CUSR0000SA0"]')
        })
      );
    });
  });

  describe('caching', () => {
    it('should cache responses by default', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBLSResponse
      });

      // First call - should fetch
      await getSeries('CUSR0000SA0', 2023, 2023);
      expect(getCacheSize()).toBe(1);

      // Second call - should use cache
      await getSeries('CUSR0000SA0', 2023, 2023);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should clear cache when clearCache is called', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockBLSResponse
      });

      await getSeries('CUSR0000SA0', 2023, 2023);
      expect(getCacheSize()).toBe(1);

      clearCache();
      expect(getCacheSize()).toBe(0);

      // Should fetch again after cache clear
      await getSeries('CUSR0000SA0', 2023, 2023);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should respect enableCache config option', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockBLSResponse
      });

      // Disable cache
      await getSeries('CUSR0000SA0', 2023, 2023, { enableCache: false });
      await getSeries('CUSR0000SA0', 2023, 2023, { enableCache: false });

      // Should fetch twice since caching is disabled
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('retries', () => {
    it('should retry on rate limiting (429)', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          statusText: 'Too Many Requests'
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockBLSResponse
        });

      const result = await getSeries('CUSR0000SA0', 2023, 2023, { retryDelay: 10 });

      expect(result).not.toBeNull();
      expect(mockFetch).toHaveBeenCalledTimes(2);
    }, 10000);

    it('should retry on network errors', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockBLSResponse
        });

      const result = await getSeries('CUSR0000SA0', 2023, 2023, { retryDelay: 10 });

      expect(result).not.toBeNull();
      expect(mockFetch).toHaveBeenCalledTimes(2);
    }, 10000);

    it('should fail after max retries', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(
        getSeries('CUSR0000SA0', 2023, 2023, { maxRetries: 2, retryDelay: 10 })
      ).rejects.toThrow('BLS API request failed after 2 attempts');

      expect(mockFetch).toHaveBeenCalledTimes(2);
    }, 10000);
  });

  describe('API key configuration', () => {
    it('should report API key as not configured when env var is missing', () => {
      delete process.env.BLS_API_KEY;
      expect(isApiKeyConfigured()).toBe(false);
    });

    it('should report API key as configured when env var is set', () => {
      process.env.BLS_API_KEY = 'test-api-key';
      expect(isApiKeyConfigured()).toBe(true);
    });

    it('should include API key in request when configured', async () => {
      process.env.BLS_API_KEY = 'test-api-key';
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBLSResponse
      });

      await getSeries('CUSR0000SA0', 2023, 2023);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"registrationkey":"test-api-key"')
        })
      );
    });
  });

  describe('BLS_SERIES constants', () => {
    it('should export common series IDs', () => {
      expect(BLS_SERIES.CPI_ALL_URBAN).toBe('CUSR0000SA0');
      expect(BLS_SERIES.UNEMPLOYMENT_RATE).toBe('LNS14000000');
      expect(BLS_SERIES.AVERAGE_HOURLY_EARNINGS).toBe('CES0500000003');
    });
  });
});
