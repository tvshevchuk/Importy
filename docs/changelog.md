# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2025-06-05

### 🔧 Fixed
- **Documentation UI**: Fixed TypeScript word-break issue in hero text and titles
- **Date Consistency**: Updated all 2024 dates to current 2025 dates across documentation
- **GitHub Actions**: Fixed pnpm compatibility issues with dependency caching
- **CI/CD Pipeline**: Resolved "Dependencies lock file is not found" errors

### 📖 Documentation
- **Custom Theme**: Added VitePress custom theme with improved typography
- **CSS Improvements**: Enhanced text rendering and mobile responsiveness
- **Changelog Updates**: Synchronized all timestamps and examples with current date

### 🚀 CI/CD
- **pnpm Integration**: Migrated from manual pnpm installation to `pnpm/action-setup@v2`
- **Cache Optimization**: Proper pnpm lock file detection and caching
- **Build Stability**: All workflows now run successfully with consistent pnpm version

## [0.1.1] - 2025-06-05

### 🎉 First Stable Release

This is the first stable release of Importy, a powerful CLI tool for analyzing JavaScript/TypeScript imports from libraries.

### ✨ Added

- **Core functionality**: Analyze imports from specific libraries in JavaScript/TypeScript codebases
- **CLI interface**: Command-line tool with comprehensive options
  - `-d, --dir <directory>`: Directory to scan (required)
  - `-l, --lib <library>`: Library name to match (required)
  - `-o, --output <file>`: Output results to JSON file
  - `-v, --verbose`: Enable verbose logging
  - `-i, --include <pattern>`: Include files matching glob pattern
  - `-e, --exclude <pattern>`: Exclude files matching glob pattern
  - `-c, --concurrency <number>`: Control parallel processing
- **Multi-format support**: Works with `.js`, `.ts`, `.jsx`, `.tsx` files
- **Advanced parsing**: Handles complex TypeScript and JSX syntax using Babel
- **Performance optimizations**:
  - Parallel file processing with configurable concurrency
  - Batch processing for large codebases
  - Progress reporting for long-running operations
- **Import type detection**: Supports named, default, and namespace imports
- **Subpath imports**: Handles library subpath imports (e.g., `library/subpath`)
- **Comprehensive output**: JSON format with detailed statistics and file locations
- **Error handling**: Graceful handling of parsing errors and invalid files
- **Pattern matching**: Custom glob pattern implementation for file filtering

### 🛠️ Technical Features

- **Modern Node.js**: Uses ES modules and `node:` protocol for built-in imports
- **TypeScript support**: Full TypeScript compatibility with proper type definitions
- **Code quality**: Integrated with Biome for formatting and linting
- **Testing**: Comprehensive test suite with Vitest
- **Build system**: Optimized build process with tsup

### 📦 Dependencies

- `@babel/parser`: JavaScript/TypeScript parsing
- `@babel/traverse`: AST traversal
- `commander`: CLI argument parsing

### 🧪 Development Dependencies

- `@biomejs/biome`: Code formatting and linting
- `typescript`: TypeScript support
- `vitest`: Testing framework
- `tsup`: Build tool

### 📖 Documentation

- Comprehensive README with usage examples
- API documentation for programmatic usage
- Contributing guidelines
- Troubleshooting guide

### 🎯 Use Cases

- **Dependency analysis**: Identify which components from a library are being used
- **Migration planning**: Understand usage patterns before library upgrades
- **Code auditing**: Find all occurrences of specific imported components
- **Bundle optimization**: Identify unused imports for tree-shaking
- **Refactoring**: Locate all usages of specific library components

### 🔧 Example Usage

```bash
# Basic usage
importy --dir ./src --lib react

# Advanced filtering
importy --dir ./src --lib @mui/material --include "**/*.tsx" --exclude "**/*.test.*"

# Export to file
importy --dir ./src --lib lodash --output imports.json --verbose
```

### 📊 Output Format

```json
{
  "summary": {
    "library": "react",
    "componentsFound": 5,
    "totalImports": 12,
    "filesScanned": 42
  },
  "components": {
    "useState": ["src/components/Counter.tsx"],
    "useEffect": ["src/components/Dashboard.tsx"]
  }
}
```

### 🚀 Release Notes

This release marks the first stable version of Importy, providing a solid foundation for analyzing JavaScript/TypeScript imports. The tool has been thoroughly tested and is ready for production use.

### 📋 Migration Guide

Since this is the first stable release, there are no breaking changes to migrate from. Users upgrading from pre-release versions (0.0.x) should note:

- All CLI options remain the same
- Output format is now standardized and stable
- Node.js 18+ is now required (previously worked with Node.js 14+)

### 🤝 Contributing

We welcome contributions! Please see our contributing guidelines in the repository.

### 🐛 Known Issues

- Complex TypeScript decorators may occasionally cause parsing warnings (files are skipped gracefully)
- Very large codebases (>10,000 files) may benefit from increased concurrency settings

### 📈 Performance

- Typical performance: ~100-500 files per second depending on file size and complexity
- Memory usage: ~50-100MB for most projects
- Recommended concurrency: 2-8 threads (automatically detected based on CPU)

---

**Full Changelog**: https://github.com/tvshevchuk/Importy/commits/v0.1.0
