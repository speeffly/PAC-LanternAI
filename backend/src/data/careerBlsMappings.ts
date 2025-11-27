/**
 * Map your internal career IDs to BLS series IDs that best represent that occupation.
 * These are examples — replace with valid series IDs for your target metrics.
 * Common choices:
 * - Unemployment rate: LNS14000000 (national)
 * - CPI (all urban consumers): CUSR0000SA0
 * - Average hourly earnings (total private): CES0500000003
 *
 * For occupation-specific wages, use OEWS or occupation-specific series if available.
 */
export type CareerBlsMapping = {
  careerId: string;
  seriesIds: {
    cpi?: string;
    unemployment?: string;
    wages?: string;
    // add more series (e.g., employment level) if needed
  };
};

export const CAREER_BLS_MAPPINGS: CareerBlsMapping[] = [
  {
    careerId: 'rn-001', // Registered Nurse
    seriesIds: {
      cpi: 'CUSR0000SA0',
      unemployment: 'LNS14000000',
      wages: 'CES0500000003',
    },
  },
  {
    careerId: 'ma-001', // Medical Assistant
    seriesIds: {
      cpi: 'CUSR0000SA0',
      unemployment: 'LNS14000000',
      wages: 'CES0500000003',
    },
  },
  {
    careerId: 'elec-001', // Electrician
    seriesIds: {
      cpi: 'CUSR0000SA0',
      unemployment: 'LNS14000000',
      wages: 'CES0500000003',
    },
  },
  // Add mappings for other careers…
];

export function getBlsMappingForCareer(careerId: string): CareerBlsMapping | null {
  return CAREER_BLS_MAPPINGS.find(m => m.careerId === careerId) || null;
}