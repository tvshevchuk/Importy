# Basic Usage Examples

This page contains common examples to get you started with Importy quickly.

## React Analysis

### Find All React Imports

```bash
importy --dir ./src --lib react
```

**Output:**
```json
{
  "summary": {
    "library": "react",
    "componentsFound": 8,
    "totalImports": 15,
    "filesScanned": 23
  },
  "components": {
    "useState": [
      "src/components/Counter.tsx",
      "src/components/TodoList.tsx",
      "src/hooks/useForm.ts"
    ],
    "useEffect": [
      "src/components/Dashboard.tsx",
      "src/components/UserProfile.tsx"
    ],
    "useCallback": [
      "src/components/OptimizedList.tsx"
    ],
    "useMemo": [
      "src/components/ExpensiveComponent.tsx"
    ],
    "Component": [
      "src/components/BaseComponent.tsx"
    ],
    "PureComponent": [
      "src/components/LegacyComponent.tsx"
    ],
    "createContext": [
      "src/contexts/ThemeContext.tsx"
    ],
    "useContext": [
      "src/components/ThemedButton.tsx"
    ]
  }
}
```

### React Components Only

```bash
importy --dir ./src --lib react --include "**/*.tsx"
```

This will only scan React component files (`.tsx` extensions).

### Exclude Test Files

```bash
importy --dir ./src --lib react --exclude "**/*.test.tsx"
```

## Lodash Analysis

### Find All Lodash Utilities

```bash
importy --dir ./src --lib lodash
```

**Output:**
```json
{
  "summary": {
    "library": "lodash",
    "componentsFound": 6,
    "totalImports": 12,
    "filesScanned": 18
  },
  "components": {
    "debounce": [
      "src/utils/search.ts",
      "src/components/SearchInput.tsx"
    ],
    "throttle": [
      "src/utils/scroll.ts"
    ],
    "isEmpty": [
      "src/utils/validation.ts",
      "src/components/Form.tsx"
    ],
    "pick": [
      "src/utils/object.ts"
    ],
    "omit": [
      "src/utils/object.ts"
    ],
    "cloneDeep": [
      "src/utils/immutable.ts"
    ]
  }
}
```

### Lodash with Verbose Output

```bash
importy --dir ./src --lib lodash --verbose
```

Shows processing details:
```
[INFO] Starting analysis...
[INFO] Configuration: {"dir":"./src","lib":"lodash","concurrency":3}
[INFO] Scanning directory: ./src
[INFO] Found 18 files to process
[INFO] Processing files with 3 workers...
[PROGRESS] Processed 6/18 files (33.3%)
[PROGRESS] Processed 12/18 files (66.7%)
[PROGRESS] Processed 18/18 files (100.0%)
[INFO] Analysis complete in 0.847s
[INFO] Found 6 unique components with 12 total imports
```

## Material-UI Analysis

### Analyze MUI Components

```bash
importy --dir ./src --lib @mui/material
```

**Output:**
```json
{
  "summary": {
    "library": "@mui/material",
    "componentsFound": 12,
    "totalImports": 28,
    "filesScanned": 15
  },
  "components": {
    "Button": [
      "src/components/ActionButton.tsx",
      "src/components/Form.tsx",
      "src/pages/Homepage.tsx"
    ],
    "TextField": [
      "src/components/Form.tsx",
      "src/components/SearchInput.tsx"
    ],
    "Card": [
      "src/components/UserCard.tsx",
      "src/components/ProductCard.tsx"
    ],
    "CardContent": [
      "src/components/UserCard.tsx",
      "src/components/ProductCard.tsx"
    ],
    "Typography": [
      "src/components/Header.tsx",
      "src/components/UserCard.tsx"
    ],
    "Box": [
      "src/components/Layout.tsx",
      "src/components/Container.tsx"
    ]
  }
}
```

### MUI Icons Analysis

```bash
importy --dir ./src --lib @mui/icons-material
```

## Date Utilities

### Date-fns Analysis

```bash
importy --dir ./src --lib date-fns
```

**Output:**
```json
{
  "summary": {
    "library": "date-fns",
    "componentsFound": 4,
    "totalImports": 7,
    "filesScanned": 12
  },
  "components": {
    "format": [
      "src/utils/date.ts",
      "src/components/DateDisplay.tsx"
    ],
    "parseISO": [
      "src/utils/date.ts"
    ],
    "isValid": [
      "src/utils/validation.ts"
    ],
    "differenceInDays": [
      "src/utils/date.ts"
    ]
  }
}
```

## Saving Results

### Save to File

```bash
importy --dir ./src --lib react --output analysis.json
```

Creates `analysis.json` with the results.

### Timestamped Results

```bash
importy --dir ./src --lib react --output "analysis-$(date +%Y%m%d).json"
```

Creates files like `analysis-20240115.json`.

### Multiple Libraries

```bash
# Analyze multiple libraries and save separately
importy --dir ./src --lib react --output react-analysis.json
importy --dir ./src --lib lodash --output lodash-analysis.json
importy --dir ./src --lib @mui/material --output mui-analysis.json
```

## File Filtering Examples

### TypeScript Only

```bash
importy --dir ./src --lib react --include "**/*.ts" --include "**/*.tsx"
```

### Skip Test and Story Files

```bash
importy --dir ./src --lib react --exclude "**/*.test.*" --exclude "**/*.stories.*"
```

### Specific Directory

```bash
importy --dir ./src --lib react --include "**/components/**"
```

### Multiple Exclusions

```bash
importy --dir ./src --lib react \
  --exclude "**/*.test.*" \
  --exclude "**/*.spec.*" \
  --exclude "**/stories/**" \
  --exclude "**/node_modules/**"
```

## Performance Examples

### Large Codebase

```bash
# Use more workers for large projects
importy --dir ./src --lib react --concurrency 6 --verbose
```

### Debug Mode

```bash
# Single-threaded for debugging
importy --dir ./src --lib react --concurrency 1 --verbose
```

### Memory Optimization

```bash
# Process directories separately for very large codebases
importy --dir ./src/components --lib react --output components-analysis.json
importy --dir ./src/pages --lib react --output pages-analysis.json
importy --dir ./src/utils --lib react --output utils-analysis.json
```

## Shell Integration

### Bash Script Example

```bash
#!/bin/bash

# Analyze multiple libraries
for lib in react lodash axios @mui/material; do
  echo "Analyzing $lib..."
  importy --dir ./src --lib "$lib" --output "analysis-${lib//\//-}.json"
done

echo "Analysis complete!"
```

### Package.json Scripts

```json
{
  "scripts": {
    "analyze": "importy --dir ./src --lib react",
    "analyze:verbose": "importy --dir ./src --lib react --verbose",
    "analyze:all": "npm run analyze:react && npm run analyze:lodash",
    "analyze:react": "importy --dir ./src --lib react --output react.json",
    "analyze:lodash": "importy --dir ./src --lib lodash --output lodash.json"
  }
}
```

Then run:
```bash
npm run analyze
npm run analyze:all
```

## Integration with Other Tools

### With jq (JSON Processing)

```bash
# Get just the component names
importy --dir ./src --lib react | jq -r '.components | keys[]'

# Count total imports
importy --dir ./src --lib react | jq '.summary.totalImports'

# Get files using useState
importy --dir ./src --lib react | jq '.components.useState[]'

# Pretty print results
importy --dir ./src --lib react | jq '.'
```

### With grep

```bash
# Find components used in specific files
importy --dir ./src --lib react | jq -r '.components | to_entries[] | select(.value[] | contains("components/")) | .key'
```

### With wc (Word Count)

```bash
# Count unique components
importy --dir ./src --lib react | jq '.summary.componentsFound'

# Count total files scanned
importy --dir ./src --lib react | jq '.summary.filesScanned'
```

## Quick Tips

### 1. Start Simple
```bash
# Begin with basic analysis
importy --dir ./src --lib react
```

### 2. Add Filtering Gradually
```bash
# Then add specific file types
importy --dir ./src --lib react --include "**/*.tsx"
```

### 3. Use Verbose for Debugging
```bash
# When something doesn't work as expected
importy --dir ./src --lib react --verbose
```

### 4. Save Important Results
```bash
# Keep analyses you might need later
importy --dir ./src --lib react --output important-analysis.json
```

## Common Patterns

### Before Library Migration
```bash
# Check current usage before migrating
importy --dir ./src --lib moment --output before-migration.json
```

### Bundle Analysis
```bash
# Find all third-party dependencies
for lib in react lodash axios @mui/material date-fns; do
  importy --dir ./src --lib "$lib" --output "bundle-${lib//\//-}.json"
done
```

### Code Review
```bash
# Quick overview of what's being used
importy --dir ./src --lib react --verbose
```

## Next Steps

- 🚀 Explore [Advanced Usage](/examples/advanced-usage) for complex scenarios
- 🔧 Learn about [Configuration](/guide/configuration) options
- 📖 Check the [API Reference](/api/cli) for all available options