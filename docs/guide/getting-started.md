# Getting Started

Welcome to Importy! This guide will walk you through your first analysis and help you understand the core concepts.

## Your First Analysis

Let's start with a simple example. Suppose you have a React project and want to see which React features you're using:

```bash
importy --dir ./src --lib react
```

This command will:
- Scan all files in the `./src` directory
- Look for imports from the `react` library
- Show you which React features are used and where

## Understanding the Output

When you run Importy, you'll see output like this:

```json
{
  "summary": {
    "library": "react",
    "componentsFound": 5,
    "totalImports": 12,
    "filesScanned": 42
  },
  "components": {
    "useState": [
      "src/components/Counter.tsx",
      "src/components/Form.tsx"
    ],
    "useEffect": [
      "src/components/Dashboard.tsx"
    ],
    "Component": [
      "src/components/BaseComponent.tsx"
    ]
  }
}
```

### Summary Section
- **library**: The library you analyzed
- **componentsFound**: Number of unique imports found
- **totalImports**: Total number of import statements
- **filesScanned**: Number of files processed

### Components Section
Shows each imported feature and the files where it's used.

## Basic Commands

### Analyze a Specific Library

```bash
# React analysis
importy --dir ./src --lib react

# Lodash analysis
importy --dir ./src --lib lodash

# Material-UI analysis
importy --dir ./src --lib @mui/material
```

### Get Verbose Output

Add `--verbose` to see detailed processing information:

```bash
importy --dir ./src --lib react --verbose
```

This shows:
- Files being processed
- Processing time
- Any parsing errors or warnings

### Save Results to File

Export your analysis to a JSON file for further processing:

```bash
importy --dir ./src --lib react --output analysis.json
```

## Common Use Cases

### 1. Dependency Audit

Before removing or upgrading a library, see what you're actually using:

```bash
# Check what lodash functions you use
importy --dir ./src --lib lodash

# Analyze Material-UI components
importy --dir ./src --lib @mui/material
```

### 2. Migration Planning

Planning to migrate from one library to another? See your current usage:

```bash
# Before migrating from moment to date-fns
importy --dir ./src --lib moment

# Check current date-fns usage
importy --dir ./src --lib date-fns
```

### 3. Bundle Optimization

Find opportunities to use more specific imports:

```bash
# See all lodash imports
importy --dir ./src --lib lodash

# Check if you can switch to lodash/es
importy --dir ./src --lib lodash/es
```

### 4. Code Review

Quickly understand what external dependencies a project uses:

```bash
# Check React patterns
importy --dir ./src --lib react --verbose

# Analyze utility usage
importy --dir ./src --lib lodash
```

## File Filtering

### Include Specific Files

Only analyze TypeScript files:

```bash
importy --dir ./src --lib react --include "**/*.ts"
```

Only analyze React components:

```bash
importy --dir ./src --lib react --include "**/*.tsx"
```

### Exclude Files

Skip test files:

```bash
importy --dir ./src --lib react --exclude "**/*.test.{ts,tsx}"
```

Skip multiple patterns:

```bash
importy --dir ./src --lib react --exclude "**/*.{test,spec,stories}.{ts,tsx}"
```

## Performance Tuning

### Adjust Concurrency

For large codebases, you can control how many files are processed simultaneously:

```bash
# Use 4 worker threads
importy --dir ./src --lib react --concurrency 4

# Use 1 thread for debugging
importy --dir ./src --lib react --concurrency 1
```

By default, Importy uses `CPU cores - 1` threads.

## Working with Monorepos

For monorepos or large projects:

```bash
# Analyze specific packages
importy --dir ./packages/ui --lib react
importy --dir ./packages/utils --lib lodash

# Exclude node_modules and build directories
importy --dir ./src --lib react --exclude "**/node_modules/**" --exclude "**/dist/**"
```

## Integration with package.json

Add Importy commands to your package.json for easy access:

```json
{
  "scripts": {
    "analyze:react": "importy --dir ./src --lib react",
    "analyze:lodash": "importy --dir ./src --lib lodash --verbose",
    "audit:deps": "importy --dir ./src --lib react --output react-analysis.json",
    "check:mui": "importy --dir ./src --lib @mui/material --include '**/*.tsx'"
  }
}
```

Then run:

```bash
npm run analyze:react
npm run audit:deps
```

## Understanding Different Import Styles

Importy detects various import patterns:

### Named Imports
```javascript
import { useState, useEffect } from 'react';
```

### Default Imports
```javascript
import React from 'react';
```

### Namespace Imports
```javascript
import * as React from 'react';
```

### Mixed Imports
```javascript
import React, { useState } from 'react';
```

### Dynamic Imports
```javascript
const { debounce } = await import('lodash');
```

## Next Steps

Now that you understand the basics:

1. 🔧 Learn about [Configuration](/guide/configuration) options
2. ⚡ Optimize [Performance](/guide/performance) for large codebases
3. 🚀 Set up [CI/CD Integration](/guide/ci-cd)
4. 💡 Explore [Advanced Examples](/examples/advanced-usage)

## Getting Help

- 📖 Check the [API Reference](/api/cli) for all available options
- 🔍 Browse [Examples](/examples/basic-usage) for common scenarios
- 🐛 Report issues on [GitHub](https://github.com/tvshevchuk/Importy/issues)
- 💬 Ask questions in [Discussions](https://github.com/tvshevchuk/Importy/discussions)