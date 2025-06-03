# Importy

A powerful CLI tool for analyzing JavaScript/TypeScript imports from libraries.

[![npm version](https://img.shields.io/npm/v/importy.svg)](https://www.npmjs.com/package/importy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](https://github.com/yourusername/importy)

## Overview

Importy scans your codebase to identify and analyze imports from specific libraries. It helps you:

- Identify which components from a library are being used in your codebase
- Find all occurrences of specific imported components
- Analyze library usage patterns across your project
- Generate detailed reports for dependency management

## Installation

```bash
# Using npm
npm install -g importy

# Using yarn
yarn global add importy

# Using pnpm
pnpm add -g importy
```

## Usage

```bash
importy --dir <directory> --lib <library-name> [options]
```

### Required Options

- `-d, --dir <directory>`: Directory to scan (required)
- `-l, --lib <library>`: Library name to match (required)

### Additional Options

- `-o, --output <file>`: Output results to a JSON file instead of stdout
- `-v, --verbose`: Enable verbose logging
- `-i, --include <pattern>`: Only include files matching pattern (glob)
- `-e, --exclude <pattern>`: Exclude files matching pattern (glob)
- `-c, --concurrency <number>`: Number of worker threads (defaults to CPU count - 1)
- `--version`: Show version number
- `--help`: Show help

## Examples

### Basic Usage

```bash
# Find all React imports in src directory
importy --dir ./src --lib react

# Find all MUI components used in your project
importy --dir ./src --lib @mui/material
```

### Advanced Usage

```bash
# Export results to a JSON file
importy --dir ./src --lib lodash --output imports.json

# Only scan TypeScript files
importy --dir ./src --lib axios --include "**/*.ts"

# Exclude test files
importy --dir ./src --lib react --exclude "**/*.test.{ts,tsx}"

# Limit concurrency
importy --dir ./src --lib react --concurrency 4
```

## Output Format

The tool outputs JSON in the following format:

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

## Performance

Importy uses parallel processing with promises, making it efficient even for large codebases. You can adjust the concurrency level to match your system's capabilities using the `--concurrency` option.

## Development

### Prerequisites

- Node.js 16+
- npm, yarn, or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/importy.git
cd importy

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Testing

Importy uses Vitest for testing. There are two types of tests:

1. **Programmatic tests**: Test the core functionality through the JavaScript API
2. **CLI tests**: Test the command-line interface

Run tests with:

```bash
# Run all tests
npm test

# Run specific tests
npx vitest run tests/programmatic.test.ts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

- **ES Module Compatibility**: If you encounter issues with ES modules, ensure your Node.js version is compatible (16+) and you're using the correct import syntax.
- **Parsing Errors**: Complex TypeScript/JSX syntax may occasionally cause parsing errors. These files are skipped with a warning.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
