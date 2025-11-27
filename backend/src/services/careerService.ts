import { Career, CareerMatch, StudentProfile, DemandLevel, BLSEconomicData } from '../types';
import { getSeries, getMultipleSeries, BLS_SERIES, BLSSeries } from './blsClient';
import { getBLSConfig } from '../config/blsConfig';

// BLS economic data cache for careers
let economicDataCache: {
  data: BLSEconomicData[];
  timestamp: number;
} | null = null;

// Sample career data - in production, this would come from a database
const CAREERS: Career[] = [
  {
    id: 'rn-001',
    title: 'Registered Nurse',
    sector: 'healthcare',
    description: 'Provide and coordinate patient care, educate patients about health conditions.',
    responsibilities: ['Assess patient health', 'Administer medications', 'Operate medical equipment'],
    requiredEducation: 'associate',
    certifications: ['RN License', 'BLS Certification'],
    averageSalary: 75000,
    salaryRange: { min: 65000, max: 85000 },
    growthOutlook: 'Much faster than average (9% growth)',
    onetCode: '29-1141.00'
  },
  {
    id: 'ma-001',
    title: 'Medical Assistant',
    sector: 'healthcare',
    description: 'Perform administrative and clinical tasks to support doctors.',
    responsibilities: ['Take vital signs', 'Prepare patients', 'Schedule appointments'],
    requiredEducation: 'certificate',
    certifications: ['CMA or RMA Certification'],
    averageSalary: 37000,
    salaryRange: { min: 32000, max: 42000 },
    growthOutlook: 'Much faster than average (16% growth)',
    onetCode: '31-9092.00'
  },
  {
    id: 'lpn-001',
    title: 'Licensed Practical Nurse',
    sector: 'healthcare',
    description: 'Provide basic nursing care under direction of RNs and doctors.',
    responsibilities: ['Monitor patient health', 'Change bandages', 'Collect samples'],
    requiredEducation: 'certificate',
    certifications: ['LPN License'],
    averageSalary: 50000,
    salaryRange: { min: 45000, max: 55000 },
    growthOutlook: 'Faster than average (6% growth)',
    onetCode: '29-2061.00'
  },
  {
    id: 'chw-001',
    title: 'Community Health Worker',
    sector: 'healthcare',
    description: 'Assist communities to adopt healthy behaviors and access healthcare.',
    responsibilities: ['Conduct outreach', 'Provide counseling', 'Connect to resources'],
    requiredEducation: 'certificate',
    certifications: ['CHW Certification'],
    averageSalary: 43000,
    salaryRange: { min: 38000, max: 48000 },
    growthOutlook: 'Much faster than average (13% growth)',
    onetCode: '21-1094.00'
  },
  {
    id: 'emt-001',
    title: 'Emergency Medical Technician',
    sector: 'healthcare',
    description: 'Respond to emergency calls and provide medical care.',
    responsibilities: ['Assess patient condition', 'Provide emergency care', 'Transport patients'],
    requiredEducation: 'certificate',
    certifications: ['EMT Certification', 'CPR/AED'],
    averageSalary: 38000,
    salaryRange: { min: 33000, max: 43000 },
    growthOutlook: 'Faster than average (7% growth)',
    onetCode: '29-2041.00'
  },
  {
    id: 'elec-001',
    title: 'Electrician',
    sector: 'infrastructure',
    description: 'Install, maintain, and repair electrical systems.',
    responsibilities: ['Read blueprints', 'Install systems', 'Inspect components'],
    requiredEducation: 'certificate',
    certifications: ['Electrician License', 'OSHA Safety'],
    averageSalary: 60000,
    salaryRange: { min: 50000, max: 70000 },
    growthOutlook: 'Faster than average (8% growth)',
    onetCode: '47-2111.00'
  },
  {
    id: 'plumb-001',
    title: 'Plumber',
    sector: 'infrastructure',
    description: 'Install and repair pipes for water, gas, and waste systems.',
    responsibilities: ['Install pipe systems', 'Repair plumbing', 'Read blueprints'],
    requiredEducation: 'certificate',
    certifications: ['Plumbing License'],
    averageSalary: 58000,
    salaryRange: { min: 48000, max: 68000 },
    growthOutlook: 'Faster than average (5% growth)',
    onetCode: '47-2152.00'
  },
  {
    id: 'hvac-001',
    title: 'HVAC Technician',
    sector: 'infrastructure',
    description: 'Install and maintain heating, ventilation, and air conditioning systems.',
    responsibilities: ['Install HVAC systems', 'Perform maintenance', 'Test performance'],
    requiredEducation: 'certificate',
    certifications: ['EPA Certification', 'HVAC License'],
    averageSalary: 52000,
    salaryRange: { min: 45000, max: 59000 },
    growthOutlook: 'Faster than average (5% growth)',
    onetCode: '49-9021.00'
  },
  {
    id: 'const-001',
    title: 'Construction Worker',
    sector: 'infrastructure',
    description: 'Perform physical labor at construction sites.',
    responsibilities: ['Operate equipment', 'Load materials', 'Follow safety protocols'],
    requiredEducation: 'high-school',
    certifications: ['OSHA 10 or 30'],
    averageSalary: 40000,
    salaryRange: { min: 35000, max: 45000 },
    growthOutlook: 'Average (4% growth)',
    onetCode: '47-2061.00'
  },
  {
    id: 'weld-001',
    title: 'Welder',
    sector: 'infrastructure',
    description: 'Join metal parts using heat and pressure.',
    responsibilities: ['Read blueprints', 'Set up equipment', 'Weld components'],
    requiredEducation: 'certificate',
    certifications: ['AWS Welding Certification'],
    averageSalary: 47000,
    salaryRange: { min: 40000, max: 54000 },
    growthOutlook: 'Slower than average (2% growth)',
    onetCode: '51-4121.00'
  }
];

export class CareerService {
  /**
   * Get all careers
   */
  static getAllCareers(): Career[] {
    return CAREERS;
  }

  /**
   * Get career by ID
   */
  static getCareerById(id: string): Career | null {
    return CAREERS.find(c => c.id === id) || null;
  }

  /**
   * Get career matches for a student profile
   */
  static getCareerMatches(profile: Partial<StudentProfile>, zipCode: string): CareerMatch[] {
    const matches: CareerMatch[] = [];

    for (const career of CAREERS) {
      const matchScore = this.calculateMatchScore(profile, career);
      const reasoningFactors = this.generateReasoningFactors(profile, career, matchScore);
      const localDemand = this.estimateLocalDemand(career, zipCode);

      matches.push({
        careerId: career.id,
        career,
        matchScore,
        reasoningFactors,
        localDemand,
        localSalary: {
          min: career.salaryRange.min,
          max: career.salaryRange.max,
          location: zipCode
        },
        localEmployers: this.getLocalEmployers(career, zipCode)
      });
    }

    // Sort by match score descending
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Calculate match score between profile and career
   */
  private static calculateMatchScore(profile: Partial<StudentProfile>, career: Career): number {
    let score = 0;
    let maxScore = 0;

    // Interest alignment (40 points)
    maxScore += 40;
    if (profile.interests) {
      const interestMatches = profile.interests.filter(interest => {
        const interestLower = interest.toLowerCase();
        const careerText = `${career.title} ${career.description}`.toLowerCase();
        return careerText.includes(interestLower) || 
               (interest === 'Healthcare' && career.sector === 'healthcare') ||
               (interest === 'Infrastructure' && career.sector === 'infrastructure') ||
               (interest === 'Helping Others' && career.sector === 'healthcare') ||
               (interest === 'Hands-on Work' && career.sector === 'infrastructure');
      });
      score += (interestMatches.length / Math.max(1, profile.interests.length)) * 40;
    }

    // Skill alignment (30 points)
    maxScore += 30;
    if (profile.skills) {
      const skillMatches = profile.skills.filter(skill => {
        const skillLower = skill.toLowerCase();
        return career.responsibilities.some(resp => resp.toLowerCase().includes(skillLower));
      });
      score += (skillMatches.length / Math.max(1, profile.skills.length)) * 30;
    }

    // Education alignment (20 points)
    maxScore += 20;
    if (profile.educationGoal) {
      const educationMatch = this.matchEducationLevel(profile.educationGoal, career.requiredEducation);
      score += educationMatch * 20;
    }

    // Work environment alignment (10 points)
    maxScore += 10;
    if (profile.workEnvironment) {
      if (career.sector === 'healthcare' && profile.workEnvironment === 'indoor') score += 10;
      else if (career.sector === 'infrastructure' && profile.workEnvironment === 'outdoor') score += 10;
      else if (profile.workEnvironment === 'mixed') score += 7;
      else score += 5;
    }

    return Math.round((score / maxScore) * 100);
  }

  /**
   * Match education levels
   */
  private static matchEducationLevel(studentGoal: string, careerRequired: string): number {
    const levels = { 'high-school': 1, 'certificate': 2, 'associate': 3, 'bachelor': 4 };
    const studentLevel = levels[studentGoal as keyof typeof levels] || 2;
    const careerLevel = levels[careerRequired as keyof typeof levels] || 2;

    if (studentLevel >= careerLevel) return 1.0;
    if (studentLevel === careerLevel - 1) return 0.7;
    return 0.4;
  }

  /**
   * Generate reasoning factors for the match
   */
  private static generateReasoningFactors(profile: Partial<StudentProfile>, career: Career, score: number): string[] {
    const factors: string[] = [];

    if (profile.interests) {
      const matchingInterests = profile.interests.filter(i => 
        i === 'Healthcare' && career.sector === 'healthcare' ||
        i === 'Infrastructure' && career.sector === 'infrastructure' ||
        i === 'Helping Others' && career.sector === 'healthcare'
      );
      if (matchingInterests.length > 0) {
        factors.push(`Strong interest alignment: ${matchingInterests.join(', ')}`);
      }
    }

    if (profile.skills && profile.skills.length > 0) {
      factors.push(`Your skills match this career's requirements`);
    }

    if (score > 80) {
      factors.push('Excellent overall match for your profile');
    } else if (score > 60) {
      factors.push('Good match with room to develop additional skills');
    }

    factors.push(`${career.growthOutlook}`);

    return factors;
  }

  /**
   * Estimate local demand (simplified - would use real data in production)
   */
  private static estimateLocalDemand(career: Career, zipCode: string): DemandLevel {
    // Healthcare generally has high demand in rural areas
    if (career.sector === 'healthcare') return 'high';
    // Infrastructure varies
    if (career.sector === 'infrastructure') return 'medium';
    return 'medium';
  }

  /**
   * Get local employers (simplified - would use real data in production)
   */
  private static getLocalEmployers(career: Career, zipCode: string): string[] {
    if (career.sector === 'healthcare') {
      return ['Local Hospital', 'Community Health Center', 'Private Practices'];
    }
    return ['Local Construction Companies', 'Utility Companies', 'Contractors'];
  }

  /**
   * Fetch economic data from BLS API
   * Returns CPI, unemployment, and wage data for use in career recommendations
   */
  static async getEconomicData(): Promise<BLSEconomicData[]> {
    const config = getBLSConfig();
    
    if (!config.enabled) {
      return [];
    }

    // Check cache first
    if (economicDataCache && 
        Date.now() - economicDataCache.timestamp < config.cache.ttlMs) {
      return economicDataCache.data;
    }

    try {
      const currentYear = new Date().getFullYear();
      const seriesIds = [
        config.seriesIds.cpi,
        config.seriesIds.unemployment,
        config.seriesIds.wages,
      ];

      const series = await getMultipleSeries(seriesIds, currentYear - 5, currentYear);
      
      const result: BLSEconomicData[] = series.map((s: BLSSeries) => ({
        seriesId: s.seriesID,
        name: this.getSeriesName(s.seriesID, config),
        data: s.data.map(d => ({
          year: d.year,
          period: d.period,
          periodName: d.periodName,
          value: d.value,
          footnotes: d.footnotes,
        })),
        lastUpdated: new Date(),
      }));

      // Cache the result
      economicDataCache = {
        data: result,
        timestamp: Date.now(),
      };

      return result;
    } catch (error) {
      console.error('Failed to fetch BLS economic data:', (error as Error).message);
      return economicDataCache?.data || [];
    }
  }

  /**
   * Get human-readable name for a BLS series ID
   */
  private static getSeriesName(seriesId: string, config: ReturnType<typeof getBLSConfig>): string {
    if (seriesId === config.seriesIds.cpi || seriesId === BLS_SERIES.CPI_ALL_URBAN) {
      return 'Consumer Price Index (CPI)';
    }
    if (seriesId === config.seriesIds.unemployment || seriesId === BLS_SERIES.UNEMPLOYMENT_RATE) {
      return 'Unemployment Rate';
    }
    if (seriesId === config.seriesIds.wages || seriesId === BLS_SERIES.AVERAGE_HOURLY_EARNINGS) {
      return 'Average Hourly Earnings';
    }
    return seriesId;
  }

  /**
   * Get the latest unemployment rate from BLS data
   */
  static async getUnemploymentRate(): Promise<number | null> {
    const config = getBLSConfig();
    
    if (!config.enabled) {
      return null;
    }

    try {
      const currentYear = new Date().getFullYear();
      const series = await getSeries(config.seriesIds.unemployment, currentYear - 1, currentYear);
      
      if (series && series.data.length > 0) {
        // Return the most recent value
        return parseFloat(series.data[0].value);
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch unemployment rate:', (error as Error).message);
      return null;
    }
  }

  /**
   * Get career matches with BLS economic context
   */
  static async getCareerMatchesWithEconomicData(
    profile: Partial<StudentProfile>,
    zipCode: string
  ): Promise<{
    matches: CareerMatch[];
    economicData: BLSEconomicData[];
  }> {
    const [matches, economicData] = await Promise.all([
      Promise.resolve(this.getCareerMatches(profile, zipCode)),
      this.getEconomicData(),
    ]);

    return { matches, economicData };
  }
}
