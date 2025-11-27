import * as fs from 'fs';
import * as path from 'path';

/**
 * Represents a normalized O*NET occupation entry.
 */
export interface NormalizedOccupation {
  /** O*NET-SOC code (e.g., "29-1141.00") */
  onetCode: string;
  /** Occupation title */
  title: string;
  /** Occupation description */
  description: string;
  /** List of key tasks */
  tasks: string[];
  /** Required skills with importance ratings */
  skills: Array<{ name: string; importance: number }>;
  /** Required knowledge areas with importance ratings */
  knowledge: Array<{ name: string; importance: number }>;
  /** Abilities required */
  abilities: Array<{ name: string; importance: number }>;
  /** Education level required */
  educationLevel: string;
  /** Median annual wage (if available) */
  medianWage?: number;
  /** Job outlook/growth projection */
  jobOutlook?: string;
}

/**
 * Represents the normalized O*NET database structure.
 */
export interface NormalizedOnetDatabase {
  /** Metadata about the database */
  metadata: {
    version: string;
    generatedAt: string;
    sourceFiles: string[];
  };
  /** Array of normalized occupations */
  occupations: NormalizedOccupation[];
}

/**
 * Parses a delimited line (CSV or TSV), handling quoted fields correctly.
 * @param line - The line to parse
 * @param delimiter - The field delimiter (comma or tab)
 */
function parseDelimitedLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Detects whether a file uses tabs or commas as delimiters.
 */
function detectDelimiter(firstLine: string): string {
  // If there are more tabs than commas, it's likely TSV
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  return tabCount > commaCount ? '\t' : ',';
}

/**
 * Parses a CSV/TSV file and returns an array of objects.
 */
function parseDelimitedFile(filePath: string): Record<string, string>[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');

  if (lines.length === 0) {
    return [];
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseDelimitedLine(lines[0], delimiter);
  const records: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseDelimitedLine(lines[i], delimiter);
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    records.push(record);
  }

  return records;
}

/**
 * Groups records by O*NET-SOC code.
 */
function groupByCode<T extends Record<string, string>>(
  records: T[],
  codeField: string
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  for (const record of records) {
    const code = record[codeField];
    if (!code) continue;
    const existing = grouped.get(code) || [];
    existing.push(record);
    grouped.set(code, existing);
  }
  return grouped;
}

/**
 * Parses the O*NET database files from the specified input directory
 * and returns a normalized data structure.
 *
 * Expected files in inputDir:
 * - Occupation Data.txt: Basic occupation information (O*NET-SOC Code, Title, Description)
 * - Task Statements.txt: Task descriptions for occupations
 * - Skills.txt: Skills with importance ratings
 * - Knowledge.txt: Knowledge areas with importance ratings
 * - Abilities.txt: Abilities with importance ratings
 * - Education, Training, and Experience.txt: Education requirements
 *
 * @param inputDir - Path to directory containing O*NET CSV/text files
 * @returns Promise resolving to normalized database structure
 */
export async function parseOnetDatabase(inputDir: string): Promise<NormalizedOnetDatabase> {
  const sourceFiles: string[] = [];

  // Define expected file names (O*NET typically uses .txt extension for tab-separated or CSV files)
  const occupationFile = path.join(inputDir, 'Occupation Data.txt');
  const taskFile = path.join(inputDir, 'Task Statements.txt');
  const skillsFile = path.join(inputDir, 'Skills.txt');
  const knowledgeFile = path.join(inputDir, 'Knowledge.txt');
  const abilitiesFile = path.join(inputDir, 'Abilities.txt');
  const educationFile = path.join(inputDir, 'Education, Training, and Experience.txt');

  // Initialize occupation map
  const occupationMap = new Map<string, NormalizedOccupation>();

  // Parse Occupation Data (required)
  if (fs.existsSync(occupationFile)) {
    sourceFiles.push('Occupation Data.txt');
    const records = parseDelimitedFile(occupationFile);
    for (const record of records) {
      const code = record['O*NET-SOC Code'];
      if (!code) continue;

      occupationMap.set(code, {
        onetCode: code,
        title: record['Title'] || '',
        description: record['Description'] || '',
        tasks: [],
        skills: [],
        knowledge: [],
        abilities: [],
        educationLevel: ''
      });
    }
  }

  // Parse Task Statements
  if (fs.existsSync(taskFile)) {
    sourceFiles.push('Task Statements.txt');
    const records = parseDelimitedFile(taskFile);
    const grouped = groupByCode(records, 'O*NET-SOC Code');
    for (const [code, tasks] of grouped) {
      const occupation = occupationMap.get(code);
      if (occupation) {
        occupation.tasks = tasks.map(t => t['Task'] || t['Task Statement'] || '').filter(Boolean);
      }
    }
  }

  // Parse Skills
  if (fs.existsSync(skillsFile)) {
    sourceFiles.push('Skills.txt');
    const records = parseDelimitedFile(skillsFile);
    const grouped = groupByCode(records, 'O*NET-SOC Code');
    for (const [code, skills] of grouped) {
      const occupation = occupationMap.get(code);
      if (occupation) {
        occupation.skills = skills
          .filter(s => s['Scale ID'] === 'IM') // Importance scale
          .map(s => ({
            name: s['Element Name'] || '',
            importance: parseFloat(s['Data Value'] || '0')
          }))
          .filter(s => s.name && s.importance > 0)
          .sort((a, b) => b.importance - a.importance);
      }
    }
  }

  // Parse Knowledge
  if (fs.existsSync(knowledgeFile)) {
    sourceFiles.push('Knowledge.txt');
    const records = parseDelimitedFile(knowledgeFile);
    const grouped = groupByCode(records, 'O*NET-SOC Code');
    for (const [code, knowledge] of grouped) {
      const occupation = occupationMap.get(code);
      if (occupation) {
        occupation.knowledge = knowledge
          .filter(k => k['Scale ID'] === 'IM')
          .map(k => ({
            name: k['Element Name'] || '',
            importance: parseFloat(k['Data Value'] || '0')
          }))
          .filter(k => k.name && k.importance > 0)
          .sort((a, b) => b.importance - a.importance);
      }
    }
  }

  // Parse Abilities
  if (fs.existsSync(abilitiesFile)) {
    sourceFiles.push('Abilities.txt');
    const records = parseDelimitedFile(abilitiesFile);
    const grouped = groupByCode(records, 'O*NET-SOC Code');
    for (const [code, abilities] of grouped) {
      const occupation = occupationMap.get(code);
      if (occupation) {
        occupation.abilities = abilities
          .filter(a => a['Scale ID'] === 'IM')
          .map(a => ({
            name: a['Element Name'] || '',
            importance: parseFloat(a['Data Value'] || '0')
          }))
          .filter(a => a.name && a.importance > 0)
          .sort((a, b) => b.importance - a.importance);
      }
    }
  }

  // Parse Education
  if (fs.existsSync(educationFile)) {
    sourceFiles.push('Education, Training, and Experience.txt');
    const records = parseDelimitedFile(educationFile);
    const grouped = groupByCode(records, 'O*NET-SOC Code');
    for (const [code, education] of grouped) {
      const occupation = occupationMap.get(code);
      if (occupation) {
        // Find the most common education level
        const educationRecords = education.filter(e => e['Category'] === 'Required Level of Education');
        if (educationRecords.length > 0) {
          // Sort by data value descending to get the most relevant
          educationRecords.sort((a, b) => parseFloat(b['Data Value'] || '0') - parseFloat(a['Data Value'] || '0'));
          occupation.educationLevel = educationRecords[0]['Element Name'] || '';
        }
      }
    }
  }

  return {
    metadata: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      sourceFiles
    },
    occupations: Array.from(occupationMap.values())
  };
}

/**
 * Writes the normalized O*NET database to a JSON file.
 *
 * @param data - The normalized database to write
 * @param outputPath - Path to the output JSON file
 * @returns Promise resolving when write is complete
 */
export async function writeNormalizedDatabase(
  data: NormalizedOnetDatabase,
  outputPath: string
): Promise<void> {
  const jsonContent = JSON.stringify(data, null, 2);
  fs.writeFileSync(outputPath, jsonContent, 'utf-8');
}
