'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export const SESSION_STORAGE_KEY = 'careerReferrer';

interface BackButtonProps {
  fallbackPath?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * BackButton component that provides smart navigation back to the previous page.
 * 
 * Priority order:
 * 1. If sessionStorage contains careerReferrer, use that path
 * 2. If browser history length > 2, use router.back() (browser starts with length 1 or 2 depending on configuration)
 * 3. Otherwise, use the fallbackPath (default: /results)
 * 
 * Note: history.length is a best-effort heuristic and may not be perfectly reliable
 * across all browsers. The sessionStorage approach (Priority 1) is the most reliable.
 */
export default function BackButton({
  fallbackPath = '/results',
  className,
  children,
}: BackButtonProps) {
  const router = useRouter();
  const [storedReferrer, setStoredReferrer] = useState<string | null>(null);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    // Check sessionStorage for stored referrer and history on mount
    // This is done in useEffect to handle SSR correctly
    if (typeof window !== 'undefined') {
      const referrer = sessionStorage.getItem(SESSION_STORAGE_KEY);
      setStoredReferrer(referrer);
      // history.length > 2 is more reliable than > 1 as browsers may start with 1 or 2
      setHasHistory(window.history.length > 2);
    }
  }, []);

  const handleBack = useCallback(() => {
    // Priority 1: Use stored referrer if available (most reliable)
    if (storedReferrer) {
      router.push(storedReferrer);
      return;
    }

    // Priority 2: Use browser history if available
    // Note: This is a best-effort heuristic; sessionStorage is more reliable
    if (hasHistory) {
      router.back();
      return;
    }

    // Priority 3: Fall back to the configured path
    router.push(fallbackPath);
  }, [router, storedReferrer, hasHistory, fallbackPath]);

  const defaultClassName = 'text-blue-600 hover:underline text-sm';

  return (
    <button
      onClick={handleBack}
      className={className || defaultClassName}
      type="button"
    >
      {children || '← Back'}
    </button>
  );
}

/**
 * Utility function to store the referrer path in sessionStorage.
 * Call this when navigating from a listings page to a detail page.
 */
export function setCareerReferrer(path: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(SESSION_STORAGE_KEY, path);
  }
}

/**
 * Utility function to clear the referrer path from sessionStorage.
 */
export function clearCareerReferrer(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }
}
