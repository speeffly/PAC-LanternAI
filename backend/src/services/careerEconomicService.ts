import { getMultipleSeries, BLSSeries } from './blsClient';
import { getBLSConfig } from '../config/blsConfig';
import { getBlsMappingForCareer } from '../data/careerBlsMappings';

export type JobEconomicIndicator = {
  seriesId: string;
  name: string;
  data: {
    year: string;
    period: string;
    periodName: string;
    value: string;
    footnotes?: any[];
  }[];
  lastUpdated: string;
};

export async function getJobSpecificEconomicData(careerId: string): Promise<JobEconomicIndicator[]> {
  const config = getBLSConfig();
  if (!config.enabled) return [];

  const mapping = getBlsMappingForCareer(careerId);
  if (!mapping) return [];

  const currentYear = new Date().getFullYear();
  const wantedSeries = [
    mapping.seriesIds.cpi,
    mapping.seriesIds.unemployment,
    mapping.seriesIds.wages,
  ].filter(Boolean) as string[];

  if (wantedSeries.length === 0) return [];

  const seriesList = await getMultipleSeries(wantedSeries, currentYear - 5, currentYear);

  return seriesList.map((s: BLSSeries) => ({
    seriesId: s.seriesID,
    name: getSeriesFriendlyName(s.seriesID, mapping),
    data: s.data.map(d => ({
      year: d.year,
      period: d.period,
      periodName: d.periodName,
      value: d.value,
      footnotes: d.footnotes,
    })),
    lastUpdated: new Date().toISOString(),
  }));
}

function getSeriesFriendlyName(seriesId: string, mapping: { seriesIds: Record<string, string | undefined> }) {
  switch (seriesId) {
    case mapping.seriesIds.cpi: return 'Consumer Price Index (CPI)';
    case mapping.seriesIds.unemployment: return 'Unemployment Rate';
    case mapping.seriesIds.wages: return 'Average Hourly Earnings';
    default: return seriesId;
  }
}