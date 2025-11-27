# O*NET Data Ingestion Guide

This document explains how to ingest O*NET database files into PAC-LanternAI.

## Overview

The O*NET (Occupational Information Network) database provides detailed occupational information. This project includes a service and CLI script to parse O*NET data files and produce a normalized JSON format for use by the backend.

## Prerequisites

1. Download the O*NET database from [O*NET Resource Center](https://www.onetcenter.org/database.html)
2. Extract the downloaded archive

## Expected Files

Place the following files in `backend/src/data/onet/`:

| Filename | Description | Required |
|----------|-------------|----------|
| `Occupation Data.txt` | Basic occupation information (code, title, description) | Yes |
| `Task Statements.txt` | Task descriptions for each occupation | No |
| `Skills.txt` | Skills with importance/level ratings | No |
| `Knowledge.txt` | Knowledge areas with importance/level ratings | No |
| `Abilities.txt` | Abilities with importance/level ratings | No |
| `Education, Training, and Experience.txt` | Education requirements | No |

**Note:** Files use tab-separated or comma-separated format with headers on the first line.

## Running the Ingestion Script

### Using ts-node (development)

```bash
cd backend
npx ts-node src/scripts/ingestOnet.ts
```

### Using compiled JavaScript (production)

```bash
cd backend
npm run build
node dist/scripts/ingestOnet.js
```

## Output

The script produces a normalized JSON file at:

```
backend/src/data/onet_normalized.json
```

### Output Schema

```json
{
  "metadata": {
    "version": "1.0.0",
    "generatedAt": "2024-01-15T12:00:00.000Z",
    "sourceFiles": ["Occupation Data.txt", "Skills.txt", ...]
  },
  "occupations": [
    {
      "onetCode": "29-1141.00",
      "title": "Registered Nurses",
      "description": "Assess patient health problems...",
      "tasks": ["Record patients' medical information..."],
      "skills": [
        { "name": "Active Listening", "importance": 4.5 }
      ],
      "knowledge": [
        { "name": "Medicine and Dentistry", "importance": 4.2 }
      ],
      "abilities": [
        { "name": "Oral Comprehension", "importance": 4.3 }
      ],
      "educationLevel": "Bachelor's degree"
    }
  ]
}
```

## Using the Normalized Data

### In careerService.ts

To use the normalized O*NET data in `careerService.ts`, you can import and map the data:

```typescript
import * as fs from 'fs';
import * as path from 'path';

// Load normalized O*NET data
const onetDataPath = path.join(__dirname, '../data/onet_normalized.json');
let onetData: NormalizedOnetDatabase | null = null;

if (fs.existsSync(onetDataPath)) {
  const content = fs.readFileSync(onetDataPath, 'utf-8');
  onetData = JSON.parse(content);
}

// Example: Look up occupation by O*NET code
function getOnetOccupation(onetCode: string) {
  return onetData?.occupations.find(o => o.onetCode === onetCode);
}
```

### API Types

The service exports the following TypeScript interfaces:

- `NormalizedOccupation` - Single occupation entry
- `NormalizedOnetDatabase` - Full database with metadata

```typescript
import {
  NormalizedOccupation,
  NormalizedOnetDatabase
} from '../services/onetService';
```

## Troubleshooting

### "Input directory not found"

Create the directory:
```bash
mkdir -p backend/src/data/onet
```

### "No O*NET files found"

Ensure files are placed in `backend/src/data/onet/` with the exact filenames listed above.

### Parsing errors

Verify that:
1. Files are text files (not the Excel versions)
2. Files have the correct column headers
3. Files use UTF-8 encoding

## File Format Details

O*NET database files typically use:
- Tab-separated values (TSV) format
- First row contains column headers
- Common columns:
  - `O*NET-SOC Code` - Occupation identifier
  - `Title` - Occupation title
  - `Element Name` - Name of skill/knowledge/ability
  - `Scale ID` - Rating scale (IM = Importance, LV = Level)
  - `Data Value` - Numeric rating value
