# Changelog

All notable changes to Importy will be documented in this file.

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

### 🎉 First Stable Release!

This is the first stable release of Importy with all core features implemented and tested.

### ✨ Added
- **Core Analysis Engine**: Fast and accurate import detection using Babel AST parsing
- **Parallel Processing**: Multi-threaded file processing with configurable concurrency
- **Comprehensive CLI**: Complete command-line interface with all essential options
- **File Filtering**: Include/exclude patterns using glob syntax
- **JSON Output**: Structured output format for automation and integration
- **Verbose Logging**: Detailed progress and debugging information
- **Error Handling**: Graceful handling of parse errors and invalid files
- **Performance Optimization**: Efficient memory usage and processing speed
- **Cross-platform Support**: Works on Windows, macOS, and Linux

### 🔧 CLI Options
- `--dir, -d`: Directory to scan (required)
- `--lib, -l`: Library name to analyze (required)
- `--output, -o`: Save results to JSON file
- `--verbose, -v`: Enable detailed logging
- `--include, -i`: Include files matching pattern
- `--exclude, -e`: Exclude files matching pattern
- `--concurrency, -c`: Number of worker threads
- `--version`: Show version number
- `--help, -h`: Display help information

### 📊 Output Features
- **Summary Statistics**: Component count, total imports, files scanned
- **Detailed Mapping**: Each component mapped to file locations
- **Metadata**: Analysis configuration and tool version
- **Performance Metrics**: Processing time and timestamps

### 🎯 Library Support
- **React**: Hooks, components, and utilities
- **Lodash**: All utility functions and modules
- **Material-UI**: Components and icons (`@mui/material`, `@mui/icons-material`)
- **Date Libraries**: date-fns, moment, day.js
- **HTTP Libraries**: axios, fetch utilities
- **Utility Libraries**: ramda, underscore
- **Any ES Module**: Universal support for import/export syntax

### 🚀 Performance
- **Multi-threading**: Parallel file processing using worker threads
- **Memory Efficient**: Optimized memory usage for large codebases
- **Fast Parsing**: Babel-powered AST parsing for accuracy
- **Configurable Concurrency**: Adjust workers based on system capabilities

### 📖 Documentation
- **Comprehensive README**: Complete usage guide and examples
- **Interactive Demo**: Live terminal recording showing real usage
- **API Documentation**: Detailed CLI reference
- **Examples**: Common use cases and integration patterns

### 🧪 Testing
- **Programmatic Tests**: Core functionality testing via JavaScript API
- **CLI Tests**: Command-line interface testing
- **Error Handling Tests**: Validation of error scenarios
- **Performance Tests**: Benchmarking and optimization validation

### 🔄 CI/CD
- **Automated Testing**: GitHub Actions for continuous integration
- **Automated Releases**: Streamlined release process
- **Quality Checks**: Code formatting, linting, and type checking
- **Cross-platform Testing**: Validation on multiple operating systems

## [0.1.0] - 2025-06-05

### 🚧 Initial Development Release

This was the initial development release with basic functionality.

### ✨ Added
- Basic import analysis functionality
- Simple CLI interface
- JSON output format
- File system traversal
- Basic error handling

### 🐛 Known Issues
- Limited concurrency support
- Basic error messages
- No file filtering options
- No verbose logging

## [Unreleased]

### 🔮 Planned Features

#### 🎯 Enhanced Analysis
- **Import Usage Tracking**: Track how imported components are actually used in code
- **Dependency Graphs**: Visualize import relationships between files
- **Unused Import Detection**: Identify imports that are declared but never used
- **Tree-shaking Analysis**: Calculate potential bundle size savings

#### 🚀 Performance Improvements
- **Incremental Analysis**: Only re-analyze changed files
- **Caching**: Cache parse results for faster subsequent runs
- **Streaming Processing**: Process very large codebases with minimal memory
- **Watch Mode**: Real-time analysis as files change

#### 🔧 CLI Enhancements
- **Configuration Files**: Support for `.importyrc` configuration files
- **Multiple Libraries**: Analyze multiple libraries in a single command
- **Output Formats**: Support for CSV, XML, and other output formats
- **Interactive Mode**: Guided analysis with prompts and suggestions

#### 📊 Reporting
- **HTML Reports**: Rich, interactive HTML reports with charts
- **Trend Analysis**: Track import usage changes over time
- **Comparison Reports**: Compare import usage between branches or versions
- **Metrics Dashboard**: Web-based dashboard for project insights

#### 🔌 Integrations
- **VS Code Extension**: Native editor integration
- **Webpack Plugin**: Integration with build tools
- **ESLint Rules**: Custom linting rules based on analysis
- **GitHub Actions**: Pre-built actions for CI/CD pipelines

#### 🎨 User Experience
- **Progress Bars**: Visual progress indicators for long-running analyses
- **Colors and Icons**: Enhanced terminal output with colors and symbols
- **Suggestion Engine**: Automated recommendations for optimization
- **Quick Start Wizard**: Guided setup for new projects

### 🔄 Breaking Changes (Future Versions)

These changes are planned for future major versions:

#### v2.0.0 (Planned)
- **Configuration Format**: New YAML-based configuration format
- **Output Schema**: Enhanced JSON schema with additional metadata
- **API Changes**: Simplified programmatic API
- **Node.js Requirements**: Minimum Node.js version bump to 20.0.0

#### v3.0.0 (Planned)
- **Plugin System**: Extensible plugin architecture
- **Language Support**: TypeScript, JSX, Vue, Svelte analysis
- **Advanced Patterns**: Support for dynamic imports and complex patterns

## Version Support

### Current Support
- **v0.1.x**: Full support with bug fixes and security updates
- **Node.js**: 18.0.0+ required
- **Platforms**: Windows, macOS, Linux

### End of Life
- **v0.0.x**: No longer supported (development versions)

## Migration Guides

### Upgrading to v0.1.1

No breaking changes from v0.1.0. Simply update your package:

```bash
npm update -g importy
```

### Future Migrations

Migration guides will be provided for all major version updates with:
- Step-by-step upgrade instructions
- Breaking change explanations
- Automated migration tools where possible
- Compatibility shims for smooth transitions

## Contributing

We welcome contributions! See our [Contributing Guide](./contributing.md) for:
- How to report bugs
- How to suggest features
- Development setup instructions
- Code contribution guidelines

## Security

For security vulnerabilities, please see our [Security Policy](https://github.com/tvshevchuk/Importy/blob/main/SECURITY.md).

## Links

- 📖 [Documentation](https://tvshevchuk.github.io/Importy/)
- 🐛 [Issue Tracker](https://github.com/tvshevchuk/Importy/issues)
- 💬 [Discussions](https://github.com/tvshevchuk/Importy/discussions)
- 📦 [npm Package](https://www.npmjs.com/package/importy)
- 🔗 [GitHub Repository](https://github.com/tvshevchuk/Importy)

---

*For the complete commit history and detailed changes, see the [GitHub Releases](https://github.com/tvshevchuk/Importy/releases) page.*