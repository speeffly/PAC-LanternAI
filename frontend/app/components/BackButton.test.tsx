/**
 * Unit tests for BackButton component
 * Tests the navigation logic for history fallback vs stored referrer
 */

import { render, screen, fireEvent } from '@testing-library/react';
import BackButton, {
  SESSION_STORAGE_KEY,
  setCareerReferrer,
  clearCareerReferrer,
} from './BackButton';

// Mock next/navigation
const mockBack = jest.fn();
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
  }),
}));

// Mock sessionStorage
const mockSessionStorage: Record<string, string> = {};
const mockGetItem = jest.fn((key: string) => mockSessionStorage[key] || null);
const mockSetItem = jest.fn((key: string, value: string) => {
  mockSessionStorage[key] = value;
});
const mockRemoveItem = jest.fn((key: string) => {
  delete mockSessionStorage[key];
});

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: mockGetItem,
    setItem: mockSetItem,
    removeItem: mockRemoveItem,
    clear: () => {
      for (const key in mockSessionStorage) {
        delete mockSessionStorage[key];
      }
    },
  },
  writable: true,
});

// Mock window.history
const originalHistory = window.history;

describe('BackButton', () => {
  beforeEach(() => {
    // Clear mocks
    mockBack.mockClear();
    mockPush.mockClear();
    mockGetItem.mockClear();
    mockSetItem.mockClear();
    mockRemoveItem.mockClear();
    
    // Clear mock sessionStorage
    for (const key in mockSessionStorage) {
      delete mockSessionStorage[key];
    }
    
    // Reset history.length mock to simulate direct navigation
    Object.defineProperty(window, 'history', {
      value: { ...originalHistory, length: 1 },
      writable: true,
    });
  });

  afterAll(() => {
    // Restore original history
    Object.defineProperty(window, 'history', {
      value: originalHistory,
      writable: true,
    });
  });

  describe('rendering', () => {
    it('should render with default text', () => {
      render(<BackButton />);
      expect(screen.getByRole('button')).toHaveTextContent('← Back');
    });

    it('should render with custom children', () => {
      render(<BackButton>Go Back</BackButton>);
      expect(screen.getByRole('button')).toHaveTextContent('Go Back');
    });

    it('should apply default className when not provided', () => {
      render(<BackButton />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-blue-600');
      expect(button).toHaveClass('hover:underline');
    });

    it('should apply custom className when provided', () => {
      render(<BackButton className="custom-class" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('navigation logic', () => {
    it('should use stored referrer when available (Priority 1)', () => {
      // Set up stored referrer using mocked setItem
      mockSetItem(SESSION_STORAGE_KEY, '/careers');
      mockGetItem.mockImplementation((key: string) => 
        key === SESSION_STORAGE_KEY ? '/careers' : null
      );
      
      // Set history length > 2 to ensure we're testing Priority 1 over Priority 2
      Object.defineProperty(window, 'history', {
        value: { length: 5 },
        writable: true,
      });
      
      render(<BackButton />);
      
      fireEvent.click(screen.getByRole('button'));
      
      // Should use stored referrer, not router.back()
      expect(mockPush).toHaveBeenCalledWith('/careers');
      expect(mockBack).not.toHaveBeenCalled();
    });

    it('should use router.back() when no stored referrer and history length > 2 (Priority 2)', () => {
      // No stored referrer
      mockGetItem.mockReturnValue(null);
      
      // Set history length > 2
      Object.defineProperty(window, 'history', {
        value: { length: 5 },
        writable: true,
      });
      
      render(<BackButton />);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(mockBack).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should use fallback path when no stored referrer and history length <= 2 (Priority 3)', () => {
      // No stored referrer
      mockGetItem.mockReturnValue(null);
      
      // History length of 1 (direct navigation)
      Object.defineProperty(window, 'history', {
        value: { length: 1 },
        writable: true,
      });
      
      render(<BackButton fallbackPath="/results" />);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(mockPush).toHaveBeenCalledWith('/results');
      expect(mockBack).not.toHaveBeenCalled();
    });

    it('should use default fallback path (/results) when not specified', () => {
      // No stored referrer
      mockGetItem.mockReturnValue(null);
      
      // History length of 1 (direct navigation)
      Object.defineProperty(window, 'history', {
        value: { length: 1 },
        writable: true,
      });
      
      render(<BackButton />);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(mockPush).toHaveBeenCalledWith('/results');
    });

    it('should use custom fallback path when specified', () => {
      // No stored referrer
      mockGetItem.mockReturnValue(null);
      
      // History length of 1 (direct navigation)
      Object.defineProperty(window, 'history', {
        value: { length: 1 },
        writable: true,
      });
      
      render(<BackButton fallbackPath="/home" />);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  describe('utility functions', () => {
    it('setCareerReferrer should store path in sessionStorage', () => {
      setCareerReferrer('/results');
      
      expect(mockSetItem).toHaveBeenCalledWith(SESSION_STORAGE_KEY, '/results');
    });

    it('clearCareerReferrer should remove path from sessionStorage', () => {
      clearCareerReferrer();
      
      expect(mockRemoveItem).toHaveBeenCalledWith(SESSION_STORAGE_KEY);
    });
  });

  describe('edge cases', () => {
    it('should handle stored referrer being /results', () => {
      mockGetItem.mockImplementation((key: string) => 
        key === SESSION_STORAGE_KEY ? '/results' : null
      );
      
      render(<BackButton />);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(mockPush).toHaveBeenCalledWith('/results');
    });

    it('should handle stored referrer being /careers', () => {
      mockGetItem.mockImplementation((key: string) => 
        key === SESSION_STORAGE_KEY ? '/careers' : null
      );
      
      render(<BackButton />);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(mockPush).toHaveBeenCalledWith('/careers');
    });
  });
});
