# Exit Codes

Reference for all exit codes returned by Importy and their meanings.

## Overview

Importy uses standard exit codes to indicate the success or failure of operations. These codes are essential for automation, scripting, and CI/CD integration.

## Exit Code Summary

| Code | Name | Description | Action Required |
|------|------|-------------|-----------------|
| `0` | Success | Analysis completed successfully | None |
| `1` | General Error | Unhandled error occurred | Check logs and report if persistent |
| `2` | Invalid Arguments | Missing or invalid command line arguments | Fix command syntax |
| `3` | File System Error | Directory not found or permission issues | Check paths and permissions |
| `4` | No Files Found | No files matched the include/exclude patterns | Adjust file patterns |
| `5` | Parse Error | Critical parsing errors in multiple files | Check file syntax |

## Detailed Descriptions

### Exit Code 0: Success

**Meaning**: The analysis completed successfully without errors.

**When it occurs**:
- All files were processed successfully
- At least one file was found and analyzed
- Output was generated correctly

**Example**:
```bash
importy --dir ./src --lib react
echo $?  # Outputs: 0
```

**Automation usage**:
```bash
if importy --dir ./src --lib react --output analysis.json; then
  echo "Analysis successful"
  process_results analysis.json
else
  echo "Analysis failed"
  exit 1
fi
```

### Exit Code 1: General Error

**Meaning**: An unexpected error occurred during execution.

**Common causes**:
- Out of memory conditions
- Unhandled exceptions in code
- System-level errors
- Network issues (if applicable)

**Example scenarios**:
```bash
# System runs out of memory
importy --dir ./very-large-project --lib react --concurrency 16
echo $?  # Outputs: 1

# Corrupted installation
importy --dir ./src --lib react
echo $?  # Outputs: 1
```

**Troubleshooting**:
1. Run with `--verbose` to get more details
2. Reduce `--concurrency` if memory issues suspected
3. Check system resources
4. Reinstall Importy if persistent

### Exit Code 2: Invalid Arguments

**Meaning**: The command line arguments provided are missing or invalid.

**Common causes**:
- Missing required `--dir` or `--lib` arguments
- Invalid option values
- Conflicting options
- Malformed glob patterns

**Example scenarios**:
```bash
# Missing required arguments
importy --dir ./src
echo $?  # Outputs: 2

# Invalid concurrency value
importy --dir ./src --lib react --concurrency -1
echo $?  # Outputs: 2

# Invalid glob pattern
importy --dir ./src --lib react --include "***invalid***"
echo $?  # Outputs: 2
```

**Error messages**:
```
Error: Missing required argument: --lib
Error: Invalid concurrency value: must be between 1 and 16
Error: Invalid glob pattern: ***invalid***
```

**Resolution**:
- Check command syntax with `importy --help`
- Ensure all required arguments are provided
- Validate option values are within acceptable ranges

### Exit Code 3: File System Error

**Meaning**: Issues accessing the file system or specified directories.

**Common causes**:
- Directory doesn't exist
- Permission denied
- Path is not a directory
- Network drive issues

**Example scenarios**:
```bash
# Directory doesn't exist
importy --dir ./nonexistent --lib react
echo $?  # Outputs: 3

# Permission denied
importy --dir /root/private --lib react
echo $?  # Outputs: 3

# Path is a file, not directory
importy --dir ./package.json --lib react
echo $?  # Outputs: 3
```

**Error messages**:
```
Error: Directory not found: ./nonexistent
Error: Permission denied accessing: /root/private
Error: Path is not a directory: ./package.json
```

**Resolution**:
- Verify the directory path exists
- Check read permissions on the directory
- Use absolute paths if relative paths cause issues
- Ensure network drives are accessible

### Exit Code 4: No Files Found

**Meaning**: No files matched the include/exclude patterns specified.

**Common causes**:
- Overly restrictive include patterns
- Directory contains no matching files
- All matching files excluded by exclude patterns
- Wrong file extensions specified

**Example scenarios**:
```bash
# No TypeScript files in directory
importy --dir ./js-only-project --lib react --include "**/*.ts"
echo $?  # Outputs: 4

# All files excluded
importy --dir ./src --lib react --exclude "**/*"
echo $?  # Outputs: 4

# Wrong extension pattern
importy --dir ./src --lib react --include "**/*.xyz"
echo $?  # Outputs: 4
```

**Error messages**:
```
Warning: No files found matching the specified patterns
Found 0 files to process after applying include/exclude filters
```

**Resolution**:
- Check include/exclude patterns are correct
- Verify files exist in the specified directory
- Use `--verbose` to see which files are being considered
- Remove overly restrictive patterns

### Exit Code 5: Parse Error

**Meaning**: Critical parsing errors occurred in multiple files, preventing analysis.

**Common causes**:
- Syntax errors in source files
- Unsupported language features
- Corrupted files
- Binary files mistakenly included

**Example scenarios**:
```bash
# Many files with syntax errors
importy --dir ./broken-project --lib react
echo $?  # Outputs: 5

# Including binary files by mistake
importy --dir ./dist --lib react
echo $?  # Outputs: 5
```

**Error messages**:
```
Warning: Parse error in src/broken.js: Unexpected token '<'
Warning: Parse error in src/invalid.ts: Unexpected end of file
Error: Too many parse errors encountered (>50% of files)
```

**Resolution**:
- Fix syntax errors in source files
- Use appropriate include patterns to avoid binary files
- Check if files are using unsupported syntax
- Use `--verbose` to see specific parsing errors

## Usage in Scripts

### Bash Scripts

```bash
#!/bin/bash

# Simple error handling
importy --dir ./src --lib react --output analysis.json

case $? in
  0)
    echo "✅ Analysis completed successfully"
    ;;
  2)
    echo "❌ Invalid command arguments"
    echo "Usage: importy --dir <directory> --lib <library>"
    exit 1
    ;;
  3)
    echo "❌ Directory access error"
    echo "Check if directory exists and is readable"
    exit 1
    ;;
  4)
    echo "⚠️  No files found"
    echo "Adjust include/exclude patterns or check directory contents"
    ;;
  *)
    echo "❌ Unexpected error occurred"
    exit 1
    ;;
esac
```

### Advanced Error Handling

```bash
#!/bin/bash

analyze_library() {
  local lib=$1
  local output_file="analysis-${lib//\//-}.json"
  
  echo "Analyzing $lib..."
  importy --dir ./src --lib "$lib" --output "$output_file"
  
  local exit_code=$?
  
  case $exit_code in
    0)
      echo "✅ $lib analysis complete: $output_file"
      return 0
      ;;
    4)
      echo "⚠️  No $lib imports found"
      return 0  # Not an error for this use case
      ;;
    *)
      echo "❌ Failed to analyze $lib (exit code: $exit_code)"
      return $exit_code
      ;;
  esac
}

# Analyze multiple libraries
libraries=("react" "lodash" "@mui/material" "axios")
failed_analyses=()

for lib in "${libraries[@]}"; do
  if ! analyze_library "$lib"; then
    failed_analyses+=("$lib")
  fi
done

if [ ${#failed_analyses[@]} -gt 0 ]; then
  echo "❌ Failed analyses: ${failed_analyses[*]}"
  exit 1
else
  echo "✅ All analyses completed successfully"
fi
```

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Analyze imports
  run: |
    importy --dir ./src --lib react --output react-analysis.json
    
- name: Check analysis result
  run: |
    if [ $? -eq 4 ]; then
      echo "::warning::No React imports found"
    elif [ $? -ne 0 ]; then
      echo "::error::Import analysis failed"
      exit 1
    fi
```

### Node.js Scripts

```javascript
import { spawn } from 'child_process';

function analyzeImports(dir, lib) {
  return new Promise((resolve, reject) => {
    const process = spawn('importy', ['--dir', dir, '--lib', lib]);
    
    process.on('close', (code) => {
      switch (code) {
        case 0:
          resolve({ success: true, message: 'Analysis completed' });
          break;
        case 2:
          reject(new Error('Invalid arguments provided'));
          break;
        case 3:
          reject(new Error('Directory access error'));
          break;
        case 4:
          resolve({ success: false, message: 'No files found' });
          break;
        default:
          reject(new Error(`Analysis failed with exit code ${code}`));
      }
    });
  });
}

// Usage
try {
  const result = await analyzeImports('./src', 'react');
  console.log(result.message);
} catch (error) {
  console.error('Analysis failed:', error.message);
  process.exit(1);
}
```

## Best Practices

### 1. Always Check Exit Codes

```bash
# Bad: Ignoring exit codes
importy --dir ./src --lib react
process_results.sh

# Good: Checking exit codes
if importy --dir ./src --lib react; then
  process_results.sh
else
  echo "Analysis failed"
  exit 1
fi
```

### 2. Handle Expected Failures

```bash
# Handle "no files found" as warning, not error
importy --dir ./src --lib react
exit_code=$?

if [ $exit_code -eq 0 ]; then
  echo "Analysis successful"
elif [ $exit_code -eq 4 ]; then
  echo "Warning: No React imports found"
  # Continue with other tasks
else
  echo "Error: Analysis failed (code: $exit_code)"
  exit 1
fi
```

### 3. Provide Helpful Error Messages

```bash
analyze_with_feedback() {
  local dir=$1
  local lib=$2
  
  importy --dir "$dir" --lib "$lib" --verbose
  local code=$?
  
  case $code in
    0) echo "✅ Found $(jq '.summary.componentsFound' analysis.json) components" ;;
    2) echo "❌ Command error. Run 'importy --help' for usage" ;;
    3) echo "❌ Cannot access '$dir'. Check path and permissions" ;;
    4) echo "⚠️  No '$lib' imports in '$dir'" ;;
    5) echo "❌ Parse errors. Check file syntax with --verbose" ;;
    *) echo "❌ Unexpected error (code: $code)" ;;
  esac
  
  return $code
}
```

## Debugging Exit Codes

### Verbose Output

Always use `--verbose` when debugging:

```bash
importy --dir ./src --lib react --verbose
```

This provides additional context about why a particular exit code was returned.

### Common Debugging Commands

```bash
# Check if directory exists and is readable
ls -la ./src

# Verify file patterns match expected files  
find ./src -name "*.ts" -o -name "*.tsx" | head -10

# Test with minimal options
importy --dir ./src --lib react --concurrency 1 --verbose

# Check for parse errors in specific files
node -c src/problematic-file.js
```

## See Also

- [CLI Reference](/api/cli) - Command-line options and usage
- [Output Format](/api/output-format) - JSON output structure
- [Troubleshooting](/guide/troubleshooting) - Common issues and solutions
- [Examples](/examples/basic-usage) - Practical usage examples