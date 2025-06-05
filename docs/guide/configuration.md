# Configuration

Learn how to configure Importy for your specific use cases and optimize it for your codebase.

## Command Line Options

### Required Options

| Option | Short | Description | Example |
|--------|-------|-------------|---------|
| `--dir` | `-d` | Directory to scan | `--dir ./src` |
| `--lib` | `-l` | Library name to match | `--lib react` |

### Optional Flags

| Option | Short | Default | Description |
|--------|-------|---------|-------------|
| `--output` | `-o` | stdout | Output to JSON file | 
| `--verbose` | `-v` | false | Enable detailed logging |
| `--include` | `-i` | all files | Include files matching pattern |
| `--exclude` | `-e` | none | Exclude files matching pattern |
| `--concurrency` | `-c` | CPU cores - 1 | Number of worker threads |
| `--version` | | | Show version number |
| `--help` | `-h` | | Show help message |

## Output Configuration

### Standard Output (Default)

By default, Importy outputs JSON to stdout:

```bash
importy --dir ./src --lib react
```

This is perfect for:
- Quick analysis
- Piping to other tools
- Terminal-based workflows

### File Output

Save results to a file for later analysis:

```bash
importy --dir ./src --lib react --output analysis.json
```

Benefits:
- Persistent results
- Easy to share
- Can be processed by other tools
- Version control friendly

### Output Format

The output is always valid JSON with a consistent structure:

```json
{
  "summary": {
    "library": "string",
    "componentsFound": "number",
    "totalImports": "number", 
    "filesScanned": "number",
    "processingTime": "number (ms)",
    "timestamp": "ISO 8601 string"
  },
  "components": {
    "componentName": ["file1.js", "file2.js"]
  },
  "metadata": {
    "version": "string",
    "options": "object"
  }
}
```

## File Filtering

### Include Patterns

Use glob patterns to specify which files to analyze:

```bash
# Only TypeScript files
importy --dir ./src --lib react --include "**/*.ts"

# Only React components
importy --dir ./src --lib react --include "**/*.tsx"

# Multiple patterns (use multiple --include flags)
importy --dir ./src --lib react --include "**/*.ts" --include "**/*.tsx"

# Specific directories
importy --dir ./src --lib react --include "**/components/**"
```

### Exclude Patterns

Skip files you don't want to analyze:

```bash
# Skip test files
importy --dir ./src --lib react --exclude "**/*.test.{ts,tsx}"

# Skip multiple patterns
importy --dir ./src --lib react --exclude "**/*.test.*" --exclude "**/*.spec.*"

# Skip directories
importy --dir ./src --lib react --exclude "**/node_modules/**" --exclude "**/dist/**"
```

### Pattern Examples

| Pattern | Matches |
|---------|---------|
| `**/*.js` | All JavaScript files |
| `**/*.{ts,tsx}` | TypeScript and TSX files |
| `**/components/**` | Files in any components directory |
| `**/*.test.*` | All test files |
| `!**/dist/**` | Exclude dist directories |

## Performance Configuration

### Concurrency Control

Adjust the number of parallel workers:

```bash
# Use 4 threads (good for large projects)
importy --dir ./src --lib react --concurrency 4

# Single-threaded (good for debugging)
importy --dir ./src --lib react --concurrency 1

# Maximum performance (use all CPU cores)
importy --dir ./src --lib react --concurrency 8
```

### Recommendations

| Project Size | Recommended Concurrency |
|--------------|-------------------------|
| Small (< 100 files) | 1-2 |
| Medium (100-1000 files) | 2-4 |
| Large (1000+ files) | 4-8 |

### Memory Considerations

For very large codebases:

```bash
# Process in smaller chunks
importy --dir ./src/components --lib react
importy --dir ./src/utils --lib lodash
importy --dir ./src/pages --lib react
```

## Library Configuration

### Exact Library Names

```bash
# Exact match
importy --dir ./src --lib react

# Scoped packages
importy --dir ./src --lib @mui/material

# Sub-modules
importy --dir ./src --lib lodash/fp
```

### Common Library Names

| Library | Command |
|---------|---------|
| React | `--lib react` |
| Lodash | `--lib lodash` |
| Material-UI | `--lib @mui/material` |
| Ant Design | `--lib antd` |
| Axios | `--lib axios` |
| Date-fns | `--lib date-fns` |
| Ramda | `--lib ramda` |

## Verbose Mode

Enable detailed logging for debugging and monitoring:

```bash
importy --dir ./src --lib react --verbose
```

Verbose output includes:
- File processing progress
- Parsing errors and warnings
- Performance timing
- Memory usage information
- Configuration details

### Example Verbose Output

```
[INFO] Starting analysis...
[INFO] Configuration: {"dir":"./src","lib":"react","concurrency":3}
[INFO] Scanning directory: ./src
[INFO] Found 42 files to process
[INFO] Processing files with 3 workers...
[PROGRESS] Processed 10/42 files...
[PROGRESS] Processed 20/42 files...
[WARNING] Parse error in src/legacy.js (skipped)
[PROGRESS] Processed 30/42 files...
[PROGRESS] Processed 42/42 files
[INFO] Analysis complete in 1.2s
[INFO] Found 5 unique components with 12 total imports
```

## Environment Variables

Configure Importy using environment variables:

```bash
# Set default concurrency
export IMPORTY_CONCURRENCY=4

# Set default output directory
export IMPORTY_OUTPUT_DIR=./analysis

# Enable verbose mode by default
export IMPORTY_VERBOSE=true
```

### Available Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `IMPORTY_CONCURRENCY` | CPU cores - 1 | Default concurrency |
| `IMPORTY_VERBOSE` | false | Enable verbose logging |
| `IMPORTY_OUTPUT_DIR` | current directory | Default output directory |

## Configuration File

Create a `.importyrc.json` file in your project root:

```json
{
  "defaultLibrary": "react",
  "defaultDirectory": "./src",
  "exclude": [
    "**/*.test.*",
    "**/*.spec.*",
    "**/node_modules/**"
  ],
  "include": [
    "**/*.{ts,tsx,js,jsx}"
  ],
  "concurrency": 4,
  "verbose": false,
  "outputDirectory": "./analysis"
}
```

Then run Importy with minimal options:

```bash
# Uses configuration from .importyrc.json
importy --lib react
```

## Project-Specific Configuration

### Monorepo Setup

For monorepos, create package-specific configurations:

```json
{
  "workspaces": {
    "ui": {
      "directory": "./packages/ui/src",
      "libraries": ["react", "@mui/material"],
      "exclude": ["**/*.stories.*"]
    },
    "utils": {
      "directory": "./packages/utils/src", 
      "libraries": ["lodash", "date-fns"],
      "include": ["**/*.ts"]
    }
  }
}
```

### CI/CD Configuration

Configure for continuous integration:

```bash
# Fast analysis (reduce concurrency in CI)
importy --dir ./src --lib react --concurrency 2 --output ci-analysis.json

# Comprehensive analysis
importy --dir ./src --lib react --verbose --output detailed-analysis.json
```

## Troubleshooting Configuration

### Common Issues

1. **No files found**: Check your `--dir` path and `--include` patterns
2. **Slow performance**: Reduce `--concurrency` or add `--exclude` patterns
3. **Memory issues**: Process directories separately or reduce concurrency
4. **Parse errors**: Use `--verbose` to see which files are causing issues

### Debug Configuration

```bash
# Debug file discovery
importy --dir ./src --lib react --verbose --concurrency 1

# Test include/exclude patterns
importy --dir ./src --lib react --include "**/*.tsx" --verbose
```

## Best Practices

### 1. Start Simple
```bash
# Basic analysis first
importy --dir ./src --lib react
```

### 2. Add Filtering Gradually
```bash
# Then add specific file types
importy --dir ./src --lib react --include "**/*.tsx"

# Finally exclude unwanted files
importy --dir ./src --lib react --include "**/*.tsx" --exclude "**/*.test.*"
```

### 3. Save Important Results
```bash
# Save analyses you want to keep
importy --dir ./src --lib react --output react-$(date +%Y%m%d).json
```

### 4. Use Verbose Mode for Debugging
```bash
# When things don't work as expected
importy --dir ./src --lib react --verbose
```

## Next Steps

- 📊 Learn about [Performance Optimization](/guide/performance)
- 🚀 Set up [CI/CD Integration](/guide/ci-cd)
- 💡 Explore [Advanced Examples](/examples/advanced-usage)
- 🔍 Check the [API Reference](/api/cli) for all options