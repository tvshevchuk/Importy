# Output Format

Detailed specification of Importy's JSON output format and data structures.

## Overview

Importy outputs structured JSON data that provides comprehensive information about import analysis results. The format is consistent across all analyses and designed to be both human-readable and machine-parseable.

## Root Structure

```json
{
  "summary": { /* Summary information */ },
  "components": { /* Detailed component usage */ },
  "metadata": { /* Analysis metadata */ }
}
```

## Summary Object

The `summary` object provides high-level statistics about the analysis.

### Schema

```typescript
interface Summary {
  library: string;           // Library name that was analyzed
  componentsFound: number;   // Number of unique components/imports found
  totalImports: number;      // Total number of import statements
  filesScanned: number;      // Number of files processed
  processingTime?: number;   // Processing time in milliseconds
  timestamp?: string;        // ISO 8601 timestamp of analysis
}
```

### Example

```json
{
  "summary": {
    "library": "react",
    "componentsFound": 8,
    "totalImports": 23,
    "filesScanned": 42,
    "processingTime": 1247,
    "timestamp": "2025-06-05T15:48:26.000Z"
  }
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `library` | string | Exact library name as specified in `--lib` option |
| `componentsFound` | number | Count of unique imported components/functions |
| `totalImports` | number | Total import statements across all files |
| `filesScanned` | number | Number of files successfully processed |
| `processingTime` | number | Total analysis time in milliseconds (optional) |
| `timestamp` | string | ISO 8601 timestamp when analysis was performed (optional) |

## Components Object

The `components` object maps each discovered import to the files where it's used.

### Schema

```typescript
interface Components {
  [componentName: string]: string[];  // Array of file paths
}
```

### Example

```json
{
  "components": {
    "useState": [
      "src/components/Counter.tsx",
      "src/components/Form.tsx",
      "src/hooks/useForm.ts"
    ],
    "useEffect": [
      "src/components/Dashboard.tsx",
      "src/components/UserProfile.tsx"
    ],
    "Component": [
      "src/components/BaseComponent.tsx"
    ]
  }
}
```

### Key Characteristics

- **Keys**: Exact import names as they appear in source code
- **Values**: Arrays of relative file paths from the scanned directory
- **Sorting**: Components are sorted alphabetically by name
- **Paths**: File paths use forward slashes regardless of OS
- **Duplicates**: Each file path appears only once per component

## Metadata Object

The `metadata` object contains information about the analysis configuration and tool version.

### Schema

```typescript
interface Metadata {
  version: string;
  options: {
    dir: string;
    lib: string;
    include?: string[];
    exclude?: string[];
    concurrency?: number;
    verbose?: boolean;
  };
}
```

### Example

```json
{
  "metadata": {
    "version": "0.1.1",
    "options": {
      "dir": "./src",
      "lib": "react",
      "include": ["**/*.{ts,tsx}"],
      "exclude": ["**/*.test.*"],
      "concurrency": 4,
      "verbose": false
    }
  }
}
```

## Import Detection Examples

### Named Imports

```javascript
import { useState, useEffect } from 'react';
```

**Output:**
```json
{
  "components": {
    "useState": ["src/component.tsx"],
    "useEffect": ["src/component.tsx"]
  }
}
```

### Default Imports

```javascript
import React from 'react';
```

**Output:**
```json
{
  "components": {
    "default": ["src/component.tsx"]
  }
}
```

### Namespace Imports

```javascript
import * as React from 'react';
```

**Output:**
```json
{
  "components": {
    "*": ["src/component.tsx"]
  }
}
```

### Mixed Imports

```javascript
import React, { useState, useEffect } from 'react';
```

**Output:**
```json
{
  "components": {
    "default": ["src/component.tsx"],
    "useState": ["src/component.tsx"],
    "useEffect": ["src/component.tsx"]
  }
}
```

### Aliased Imports

```javascript
import { useState as useStateHook } from 'react';
```

**Output:**
```json
{
  "components": {
    "useState": ["src/component.tsx"]
  }
}
```

*Note: Importy tracks the original export name, not the alias.*

### Re-exports

```javascript
export { useState } from 'react';
```

**Output:**
```json
{
  "components": {
    "useState": ["src/component.tsx"]
  }
}
```

## Scoped Packages

For scoped packages like `@mui/material`:

```javascript
import { Button, TextField } from '@mui/material';
```

**Command:**
```bash
importy --dir ./src --lib @mui/material
```

**Output:**
```json
{
  "summary": {
    "library": "@mui/material",
    "componentsFound": 2,
    "totalImports": 2,
    "filesScanned": 1
  },
  "components": {
    "Button": ["src/component.tsx"],
    "TextField": ["src/component.tsx"]
  }
}
```

## Sub-modules

For libraries with sub-modules like `lodash/fp`:

```javascript
import { map, filter } from 'lodash/fp';
```

**Command:**
```bash
importy --dir ./src --lib lodash/fp
```

**Output:**
```json
{
  "summary": {
    "library": "lodash/fp",
    "componentsFound": 2,
    "totalImports": 2,
    "filesScanned": 1
  },
  "components": {
    "map": ["src/component.ts"],
    "filter": ["src/component.ts"]
  }
}
```

## Dynamic Imports

Dynamic imports are also detected:

```javascript
const { debounce } = await import('lodash');
```

**Output:**
```json
{
  "components": {
    "debounce": ["src/component.ts"]
  }
}
```

## Empty Results

When no imports are found:

```json
{
  "summary": {
    "library": "nonexistent-lib",
    "componentsFound": 0,
    "totalImports": 0,
    "filesScanned": 42
  },
  "components": {},
  "metadata": {
    "version": "0.1.1",
    "options": {
      "dir": "./src",
      "lib": "nonexistent-lib"
    }
  }
}
```

## Error Handling

### Parse Errors

Files with syntax errors are skipped but don't affect the output format:

**With verbose mode:**
```
[WARNING] Parse error in src/broken.js: Unexpected token (skipped)
```

**Output remains valid:**
```json
{
  "summary": {
    "library": "react",
    "componentsFound": 3,
    "totalImports": 5,
    "filesScanned": 41
  }
}
```

### No Files Found

When no files match the include/exclude patterns:

```json
{
  "summary": {
    "library": "react",
    "componentsFound": 0,
    "totalImports": 0,
    "filesScanned": 0
  },
  "components": {},
  "metadata": {
    "version": "0.1.1",
    "options": {
      "dir": "./src",
      "lib": "react",
      "include": ["**/*.nonexistent"]
    }
  }
}
```

## Processing with jq

Common jq patterns for processing Importy output:

### Extract Component Names
```bash
importy --dir ./src --lib react | jq -r '.components | keys[]'
```

### Get Files Using Specific Component
```bash
importy --dir ./src --lib react | jq -r '.components.useState[]'
```

### Count Components by Usage
```bash
importy --dir ./src --lib react | jq '.components | to_entries | map({key: .key, count: (.value | length)}) | sort_by(.count) | reverse'
```

### Find Most Used Components
```bash
importy --dir ./src --lib react | jq -r '.components | to_entries | map({key: .key, count: (.value | length)}) | sort_by(.count) | reverse | .[0:5] | .[] | "\(.key): \(.count)"'
```

### Filter by File Pattern
```bash
importy --dir ./src --lib react | jq '.components | to_entries | map(select(.value[] | test("components/"))) | from_entries'
```

## Data Validation

The output always conforms to this JSON Schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["summary", "components"],
  "properties": {
    "summary": {
      "type": "object",
      "required": ["library", "componentsFound", "totalImports", "filesScanned"],
      "properties": {
        "library": { "type": "string" },
        "componentsFound": { "type": "integer", "minimum": 0 },
        "totalImports": { "type": "integer", "minimum": 0 },
        "filesScanned": { "type": "integer", "minimum": 0 },
        "processingTime": { "type": "integer", "minimum": 0 },
        "timestamp": { "type": "string", "format": "date-time" }
      }
    },
    "components": {
      "type": "object",
      "patternProperties": {
        ".*": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "version": { "type": "string" },
        "options": { "type": "object" }
      }
    }
  }
}
```

## File Path Handling

### Path Normalization

- All paths use forward slashes (`/`) regardless of operating system
- Paths are relative to the scanned directory
- No leading `./` prefix is included
- Paths are normalized to remove redundant segments

### Examples

| Input Directory | File Location | Output Path |
|----------------|---------------|-------------|
| `./src` | `./src/components/Button.tsx` | `components/Button.tsx` |
| `/abs/path/src` | `/abs/path/src/utils/helpers.ts` | `utils/helpers.ts` |
| `.` | `./components/Header.tsx` | `components/Header.tsx` |

## Performance Characteristics

### Memory Usage

- Output size scales linearly with the number of unique imports
- Typical memory overhead: ~1KB per 100 components
- File paths are stored as strings, not normalized objects

### Processing Time

- JSON serialization time is negligible compared to parsing
- Output generation adds <1ms to total processing time
- Sorting components alphabetically adds minimal overhead

## Compatibility

### Version Compatibility

- Output format is stable across patch versions
- Minor version changes may add optional fields
- Major version changes may modify the schema

### Tool Compatibility

The JSON output is compatible with:

- **jq**: JSON processing and querying
- **Node.js**: Direct JSON.parse() usage
- **Python**: json.loads() and pandas
- **Excel**: Import JSON data for analysis
- **Databases**: Direct import into document stores

## See Also

- [CLI Reference](/api/cli) - Command-line options
- [Exit Codes](/api/exit-codes) - Return codes and error handling
- [Examples](/examples/basic-usage) - Practical usage examples