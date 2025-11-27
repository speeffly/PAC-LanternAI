# Navigation Flow Enhancement

This document describes the improved navigation flow for career detail pages in Lantern AI.

## Overview

The BackButton component provides smart navigation that returns users to their previous location rather than always routing to the home page.

## BackButton Component

Located at: `frontend/app/components/BackButton.tsx`

### Features

1. **Smart History Detection**: Uses `router.back()` when browser history is available
2. **Session Storage Persistence**: Stores the originating path in sessionStorage when navigating from listings pages
3. **Configurable Fallback**: Falls back to a configurable path (default: `/results`) when accessed directly via bookmark or URL

### Priority Order

When the back button is clicked, it checks in this order:

1. **Stored Referrer** (Priority 1): If `careerReferrer` exists in sessionStorage, navigate to that path
2. **Browser History** (Priority 2): If `window.history.length > 1`, use `router.back()`
3. **Fallback Path** (Priority 3): Navigate to the fallback path (default: `/results`)

### Usage

```tsx
import BackButton, { setCareerReferrer } from '@/app/components/BackButton';

// Basic usage with default fallback (/results)
<BackButton>← Back to Results</BackButton>

// Custom fallback path
<BackButton fallbackPath="/careers">← Back</BackButton>

// Custom styling
<BackButton className="text-blue-600 hover:underline">
  Back to All Results
</BackButton>

// Store referrer when navigating from a listings page
const navigateToCareer = (careerId: string) => {
  setCareerReferrer('/results'); // or usePathname()
  router.push(`/careers/${careerId}`);
};
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fallbackPath` | `string` | `/results` | Path to navigate to when no history or stored referrer |
| `className` | `string` | `text-blue-600 hover:underline text-sm` | Custom CSS classes |
| `children` | `ReactNode` | `← Back` | Button content |

### Utility Functions

```tsx
import { setCareerReferrer, clearCareerReferrer, SESSION_STORAGE_KEY } from '@/app/components/BackButton';

// Store a referrer path
setCareerReferrer('/results');

// Clear the stored referrer
clearCareerReferrer();

// Access the sessionStorage key directly if needed
const key = SESSION_STORAGE_KEY; // 'careerReferrer'
```

## Example Navigation Flows

### Flow 1: User navigates from Results page to Career Details

1. User is on `/results`
2. User clicks "View Details" on a career card
3. `setCareerReferrer('/results')` is called
4. User is navigated to `/careers/123`
5. User clicks "← Back to Results"
6. BackButton reads `careerReferrer` from sessionStorage
7. User is navigated back to `/results`

### Flow 2: User accesses Career Details directly via bookmark

1. User enters `/careers/123` directly in browser
2. `history.length` is 1, no stored referrer
3. User clicks "← Back to Results"
4. BackButton uses fallback path
5. User is navigated to `/results`

### Flow 3: User navigates from another careers page

1. User is on `/careers` (listings page)
2. User clicks on a career card
3. `setCareerReferrer('/careers')` is called
4. User is navigated to `/careers/123`
5. User clicks "← Back"
6. BackButton reads `careerReferrer` from sessionStorage
7. User is navigated back to `/careers`

## Testing

Run the BackButton tests with:

```bash
cd frontend
npm test
```

The test suite covers:
- Default and custom rendering
- Priority 1: Stored referrer navigation
- Priority 2: Browser history navigation
- Priority 3: Fallback path navigation
- Utility functions (setCareerReferrer, clearCareerReferrer)
