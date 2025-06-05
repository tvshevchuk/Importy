# CLI Reference

Complete reference for all Importy command-line interface options and usage patterns.

## Syntax

```bash
importy --dir <directory> --lib <library> [options]
```

## Required Arguments

### `--dir`, `-d`

**Type:** `string`  
**Required:** Yes

Specifies the directory to scan for import analysis.

```bash
importy --dir ./src --lib react
importy -d ./packages/ui --lib react
```

**Examples:**
- `--dir ./src` - Scan the src directory
- `--dir ./packages/components` - Scan a specific package
- `--dir .` - Scan current directory
- `--dir /absolute/path/to/project` - Use absolute path

### `--lib`, `-l`

**Type:** `string`  
**Required:** Yes

The library name to analyze. Must match the import source exactly.

```bash
importy --dir ./src --lib react
importy --dir ./src --lib @mui/material
importy --dir ./src --lib lodash/fp
```

**Examples:**
- `--lib react` - Analyze React imports
- `--lib @mui/material` - Analyze Material-UI imports
- `--lib lodash` - Analyze Lodash imports
- `--lib date-fns` - Analyze date-fns imports

## Optional Arguments

### `--output`, `-o`

**Type:** `string`  
**Default:** `stdout`

Save analysis results to a JSON file instead of printing to console.

```bash
importy --dir ./src --lib react --output analysis.json
importy --dir ./src --lib react -o results/react-analysis.json
```

**Path Handling:**
- Relative paths are resolved from current working directory
- Parent directories are created automatically if they don't exist
- Existing files are overwritten without warning

### `--verbose`, `-v`

**Type:** `boolean`  
**Default:** `false`

Enable detailed logging and progress information.

```bash
importy --dir ./src --lib react --verbose
importy --dir ./src --lib react -v
```

**Verbose Output Includes:**
- File processing progress
- Configuration details
- Performance timing
- Memory usage
- Parse errors and warnings
- Worker thread information

### `--include`, `-i`

**Type:** `string` (glob pattern)  
**Default:** All files  
**Multiple:** Yes

Include only files matching the specified glob pattern(s).

```bash
# Single pattern
importy --dir ./src --lib react --include "**/*.tsx"

# Multiple patterns
importy --dir ./src --lib react --include "**/*.ts" --include "**/*.tsx"

# Complex patterns
importy --dir ./src --lib react --include "**/components/**/*.{ts,tsx}"
```

**Supported Patterns:**
- `*` - Match any characters except `/`
- `**` - Match any characters including `/`
- `?` - Match single character
- `[abc]` - Match any character in brackets
- `{a,b,c}` - Match any alternative
- `!pattern` - Negate pattern

### `--exclude`, `-e`

**Type:** `string` (glob pattern)  
**Default:** None  
**Multiple:** Yes

Exclude files matching the specified glob pattern(s).

```bash
# Exclude test files
importy --dir ./src --lib react --exclude "**/*.test.*"

# Multiple exclusions
importy --dir ./src --lib react --exclude "**/*.test.*" --exclude "**/*.spec.*"

# Exclude directories
importy --dir ./src --lib react --exclude "**/node_modules/**" --exclude "**/dist/**"
```

**Common Exclusion Patterns:**
- `**/*.test.*` - Test files
- `**/*.spec.*` - Spec files  
- `**/*.stories.*` - Storybook files
- `**/node_modules/**` - Dependencies
- `**/dist/**` - Build output
- `**/.git/**` - Git files

### `--concurrency`, `-c`

**Type:** `number`  
**Default:** `CPU cores - 1`  
**Range:** `1` to `16`

Number of worker threads to use for parallel file processing.

```bash
# Use 4 threads
importy --dir ./src --lib react --concurrency 4

# Single threaded (debugging)
importy --dir ./src --lib react --concurrency 1

# Maximum performance
importy --dir ./src --lib react --concurrency 8
```

**Guidelines:**
- **1**: Single-threaded, best for debugging
- **2-4**: Good for most projects
- **4-8**: Large codebases with many files
- **8+**: Very large monorepos (diminishing returns)

### `--version`

**Type:** `boolean`

Display the current version and exit.

```bash
importy --version
# Output: 0.1.1
```

### `--help`, `-h`

**Type:** `boolean`

Display help information and exit.

```bash
importy --help
importy -h
```

## Exit Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `0` | Success | Analysis completed successfully |
| `1` | General Error | Unhandled error occurred |
| `2` | Invalid Arguments | Missing or invalid command line arguments |
| `3` | File System Error | Directory not found or permission issues |
| `4` | No Files Found | No files matched the include/exclude patterns |
| `5` | Parse Error | Critical parsing errors in multiple files |

## Output Format

### Standard Output (JSON)

When no `--output` is specified, results are printed to stdout as JSON:

```json
{
  "summary": {
    "library": "react",
    "componentsFound": 5,
    "totalImports": 12,
    "filesScanned": 42,
    "processingTime": 1247,
    "timestamp": "2025-06-05T15:48:26.000Z"
  },
  "components": {
    "useState": [
      "src/components/Counter.tsx",
      "src/hooks/useForm.ts"
    ],
    "useEffect": [
      "src/components/Dashboard.tsx"
    ],
    "Component": [
      "src/components/BaseComponent.tsx"
    ]
  },
  "metadata": {
    "version": "0.1.1",
    "options": {
      "dir": "./src",
      "lib": "react",
      "include": ["**/*"],
      "exclude": [],
      "concurrency": 3
    }
  }
}
```

### Verbose Output

With `--verbose`, additional logging is sent to stderr:

```
[INFO] Starting analysis...
[INFO] Configuration: {"dir":"./src","lib":"react","concurrency":3}
[INFO] Scanning directory: ./src
[INFO] Found 42 files to process
[INFO] Processing files with 3 workers...
[PROGRESS] Processed 10/42 files (23.8%)
[PROGRESS] Processed 20/42 files (47.6%)
[WARNING] Parse error in src/legacy.js: Unexpected token (skipped)
[PROGRESS] Processed 30/42 files (71.4%)
[PROGRESS] Processed 42/42 files (100.0%)
[INFO] Analysis complete in 1.247s
[INFO] Memory usage: 45.2 MB peak
[INFO] Found 5 unique components with 12 total imports
```

## Advanced Usage Patterns

### Piping Output

Combine Importy with other command-line tools:

```bash
# Pretty print JSON
importy --dir ./src --lib react | jq '.'

# Extract just component names
importy --dir ./src --lib react | jq -r '.components | keys[]'

# Count total imports
importy --dir ./src --lib react | jq '.summary.totalImports'

# Filter specific components
importy --dir ./src --lib react | jq '.components.useState'
```

### Conditional Analysis

Use shell scripting for conditional analysis:

```bash
# Only analyze if directory exists
if [ -d "./src" ]; then
  importy --dir ./src --lib react --output analysis.json
fi

# Analyze multiple libraries
for lib in react lodash axios; do
  importy --dir ./src --lib $lib --output "analysis-${lib}.json"
done
```

### Error Handling

Handle different exit codes in scripts:

```bash
#!/bin/bash
importy --dir ./src --lib react --output analysis.json

case $? in
  0)
    echo "Analysis completed successfully"
    ;;
  2)
    echo "Invalid arguments provided"
    exit 1
    ;;
  3)
    echo "Directory not found or permission denied"
    exit 1
    ;;
  4)
    echo "No files found matching criteria"
    exit 1
    ;;
  *)
    echo "Unexpected error occurred"
    exit 1
    ;;
esac
```

## Environment Variables

Override default behavior with environment variables:

```bash
# Set default concurrency
export IMPORTY_CONCURRENCY=4
importy --dir ./src --lib react

# Enable verbose by default
export IMPORTY_VERBOSE=true
importy --dir ./src --lib react

# Set output directory
export IMPORTY_OUTPUT_DIR=./analysis
importy --dir ./src --lib react --output results.json
# Saves to ./analysis/results.json
```

### Available Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `IMPORTY_CONCURRENCY` | number | CPU cores - 1 | Default concurrency level |
| `IMPORTY_VERBOSE` | boolean | false | Enable verbose logging |
| `IMPORTY_OUTPUT_DIR` | string | `.` | Default output directory |

## Performance Considerations

### File Processing

- Files are processed in parallel using worker threads
- Parsing uses Babel's AST parser for accuracy
- Memory usage scales with concurrency and file size
- Large files (>1MB) may slow down processing

### Optimization Tips

1. **Use specific include patterns** to reduce file count
2. **Exclude unnecessary directories** like `node_modules`, `dist`
3. **Adjust concurrency** based on system resources
4. **Process large codebases in chunks** by directory

### Benchmarks

Typical performance on modern hardware:

| Files | Size | Time | Memory |
|-------|------|------|--------|
| 100 | 5MB | 0.5s | 25MB |
| 1,000 | 50MB | 2.1s | 45MB |
| 10,000 | 500MB | 15.3s | 120MB |

## Troubleshooting

### Common Issues

**"No files found"**
```bash
# Check your patterns
importy --dir ./src --lib react --verbose
```

**"Permission denied"**
```bash
# Check directory permissions
ls -la ./src
```

**"Parse errors"**
```bash
# Use verbose mode to see problematic files
importy --dir ./src --lib react --verbose
```

**"Out of memory"**
```bash
# Reduce concurrency
importy --dir ./src --lib react --concurrency 1
```

### Debug Mode

For detailed debugging:

```bash
# Maximum verbosity with single thread
importy --dir ./src --lib react --verbose --concurrency 1
```

## See Also

- [Output Format Reference](/api/output-format)
- [Exit Codes Reference](/api/exit-codes)
- [Configuration Guide](/guide/configuration)
- [Examples](/examples/basic-usage)