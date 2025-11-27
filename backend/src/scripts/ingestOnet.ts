#!/usr/bin/env node
/**
 * O*NET Database Ingestion Script
 *
 * This script reads raw O*NET download files from backend/src/data/onet/
 * and writes a merged normalized JSON at backend/src/data/onet_normalized.json.
 *
 * Usage:
 *   npx ts-node src/scripts/ingestOnet.ts
 *   # or after building:
 *   node dist/scripts/ingestOnet.js
 *
 * Expected input files in backend/src/data/onet/:
 *   - Occupation Data.txt
 *   - Task Statements.txt
 *   - Skills.txt
 *   - Knowledge.txt
 *   - Abilities.txt
 *   - Education, Training, and Experience.txt
 */

import * as path from 'path';
import * as fs from 'fs';
import { parseOnetDatabase, writeNormalizedDatabase } from '../services/onetService';

const INPUT_DIR = path.resolve(__dirname, '../data/onet');
const OUTPUT_FILE = path.resolve(__dirname, '../data/onet_normalized.json');

async function main(): Promise<void> {
  console.log('O*NET Database Ingestion Script');
  console.log('================================\n');

  // Check if input directory exists
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`Error: Input directory not found: ${INPUT_DIR}`);
    console.log('\nPlease create the directory and add O*NET database files.');
    console.log('See docs/ONET_INGESTION.md for expected file names and formats.');
    process.exit(1);
  }

  // List available files
  const files = fs.readdirSync(INPUT_DIR).filter(f => !f.startsWith('.'));
  console.log('Input directory:', INPUT_DIR);
  console.log('Files found:', files.length > 0 ? files.join(', ') : '(none)');
  console.log('');

  if (files.length === 0) {
    console.error('Error: No O*NET files found in the input directory.');
    console.log('\nExpected files:');
    console.log('  - Occupation Data.txt');
    console.log('  - Task Statements.txt');
    console.log('  - Skills.txt');
    console.log('  - Knowledge.txt');
    console.log('  - Abilities.txt');
    console.log('  - Education, Training, and Experience.txt');
    console.log('\nDownload O*NET database from: https://www.onetcenter.org/database.html');
    process.exit(1);
  }

  try {
    console.log('Parsing O*NET database files...');
    const database = await parseOnetDatabase(INPUT_DIR);

    console.log(`Found ${database.occupations.length} occupations`);
    console.log(`Source files processed: ${database.metadata.sourceFiles.join(', ')}`);

    console.log(`\nWriting normalized database to: ${OUTPUT_FILE}`);
    await writeNormalizedDatabase(database, OUTPUT_FILE);

    console.log('\n✅ O*NET ingestion complete!');
    console.log(`Output: ${OUTPUT_FILE}`);

    // Print summary statistics
    const withTasks = database.occupations.filter(o => o.tasks.length > 0).length;
    const withSkills = database.occupations.filter(o => o.skills.length > 0).length;
    const withEducation = database.occupations.filter(o => o.educationLevel).length;

    console.log('\nSummary:');
    console.log(`  Total occupations: ${database.occupations.length}`);
    console.log(`  With tasks: ${withTasks}`);
    console.log(`  With skills: ${withSkills}`);
    console.log(`  With education level: ${withEducation}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Error during ingestion: ${errorMessage}`);
    process.exit(1);
  }
}

main();
