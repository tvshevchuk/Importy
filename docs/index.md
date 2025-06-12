---
layout: home
title: Importy - JavaScript/TypeScript Import Analyzer
titleTemplate: false
description: A powerful CLI tool for analyzing JavaScript/TypeScript imports from libraries. Perfect for dependency auditing, bundle optimization, migration planning, and code analysis.

hero:
  name: "Importy"
  text: "JavaScript/TypeScript Import Analyzer"
  tagline: "A powerful CLI tool for analyzing imports from libraries in your codebase. Perfect for dependency auditing, bundle optimization, and migration planning."
  image:
    src: /importy.png
    alt: Importy - JavaScript/TypeScript Import Analyzer CLI Tool
  actions:
    - theme: brand
      text: Get Started →
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/tvshevchuk/Importy
    - theme: alt
      text: Install via npm
      link: https://www.npmjs.com/package/importy

features:
  - icon: 🔍
    title: Deep Import Analysis
    details: Comprehensively scan your JavaScript/TypeScript codebase to identify which components, functions, and modules from specific libraries are actually being imported and used in your project.
  - icon: ⚡
    title: Lightning Fast Performance
    details: Optimized parallel processing with configurable concurrency levels ensures rapid analysis even for enterprise-scale codebases with thousands of files.
  - icon: 📊
    title: Comprehensive JSON Reports
    details: Generate detailed JSON reports with usage statistics, import patterns, file locations, and dependency insights for informed decision-making.
  - icon: 🎯
    title: Smart File Targeting
    details: Leverage flexible glob patterns to include/exclude specific files and directories, focusing your analysis precisely where it matters most.
  - icon: 🔧
    title: CI/CD Integration Ready
    details: Seamlessly integrate into your continuous integration pipeline for automated dependency auditing, bundle analysis, and code quality monitoring.
  - icon: 🌟
    title: Developer Experience First
    details: Intuitive CLI interface with clear output formatting, verbose logging modes, and helpful error messages for efficient debugging and analysis.
---

## Quick Start Guide

Get up and running with Importy in seconds and start analyzing your JavaScript/TypeScript imports:

```bash
# Install Importy globally via npm
npm install -g importy

# Analyze React hook and component imports
importy --dir ./src --lib react

# Analyze Lodash utility function usage with detailed output
importy --dir ./src --lib lodash --verbose

# Generate JSON report for CI/CD integration
importy --dir ./src --lib @mui/material --output report.json
```

## Live Demo - See Importy in Action

<div style="text-align: center; margin: 2rem 0;">
  <img src="/improved-demo-small.gif" alt="Importy CLI Demo - Analyzing React imports in a TypeScript project" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" loading="lazy" />
</div>

*Watch Importy analyze a real React TypeScript project, identifying hook usage patterns and component imports across multiple libraries including React, Material-UI, and Lodash*

## Why Choose Importy for Your JavaScript/TypeScript Projects?

### 🎯 **Smart Dependency Auditing**
Gain deep insights into which specific functions, components, and modules from large libraries like React, Lodash, or Material-UI are actually being used in your codebase. Make informed decisions about bundle optimization and library migration strategies.

### 📈 **Strategic Migration Planning**
Get precise visibility into component and function usage patterns across your entire project. Essential for planning major library upgrades, refactoring initiatives, or transitioning between different UI frameworks.

### 🚀 **Intelligent Bundle Optimization**
Identify unused imports, redundant dependencies, and opportunities for tree-shaking improvements. Reduce bundle size by switching to targeted imports or eliminating dead code with confidence.

### 🔄 **Continuous Automated Analysis**
Seamlessly integrate Importy into your CI/CD pipeline to monitor dependency usage trends, enforce import policies, and automatically detect unwanted or deprecated imports before they reach production.

## Real-World Analysis Results

See exactly what Importy discovers in your codebase with detailed JSON output:

```json
{
  "summary": {
    "library": "react",
    "componentsFound": 9,
    "totalImports": 15,
    "filesScanned": 42,
    "analysisTime": "1.2s"
  },
  "components": {
    "useState": [
      "src/components/Counter.tsx",
      "src/hooks/useForm.ts",
      "src/pages/Dashboard.tsx"
    ],
    "useEffect": [
      "src/components/Dashboard.tsx",
      "src/hooks/useApi.ts"
    ],
    "useCallback": [
      "src/components/OptimizedList.tsx"
    ],
    "useMemo": [
      "src/utils/calculations.ts"
    ]
  },
  "insights": {
    "mostUsedHooks": ["useState", "useEffect"],
    "underutilizedImports": ["useReducer", "useContext"],
    "migrationReadiness": 85
  }
}
```

## Popular Use Cases & Success Stories

- **React & Next.js Projects**: Discover hook usage patterns, identify unused React features, and optimize component imports for better performance
- **Lodash & Utility Libraries**: Pinpoint exactly which utility functions are used to enable targeted imports and reduce bundle size by up to 70%
- **UI Framework Analysis**: Comprehensively analyze Material-UI, Ant Design, Chakra UI, or Bootstrap component usage for strategic library decisions
- **Legacy Code Migration**: Map out complex dependency relationships before major refactoring efforts or framework migrations
- **Enterprise Bundle Optimization**: Identify tree-shaking opportunities and eliminate dead code across large-scale applications
- **Library Evaluation**: Compare actual usage vs. installed dependencies to make informed decisions about adding or removing packages

## Latest Release - v0.1.1 Features

- ✨ **Enhanced Performance**: Multi-threaded parallel processing with configurable concurrency for 3x faster analysis
- 🔧 **Improved Error Handling**: Better error messages, graceful failure recovery, and comprehensive user feedback
- 📊 **Advanced JSON Output**: Enriched report format with usage statistics, performance metrics, and actionable insights
- 🎯 **Precision Import Detection**: More accurate parsing of ES6 imports, dynamic imports, and TypeScript-specific patterns
- 🚀 **Production Stability**: Comprehensive bug fixes and performance optimizations for enterprise-grade reliability
- 🔍 **Enhanced CLI Experience**: Better progress indicators, colored output, and improved verbose logging

[View Complete Changelog →](https://github.com/tvshevchuk/Importy/blob/main/CHANGELOG.md)

## Community & Support Resources

- 📖 [Complete Documentation](/guide/getting-started) - Comprehensive guides and API reference
- 🐛 [Report Issues](https://github.com/tvshevchuk/Importy/issues) - Bug reports and feature requests
- 💬 [GitHub Discussions](https://github.com/tvshevchuk/Importy/discussions) - Community support and ideas
- 🤝 [Contributing Guide](/contributing) - Help improve Importy for everyone
- 📦 [NPM Package](https://www.npmjs.com/package/importy) - Official package repository
- ⭐ [GitHub Repository](https://github.com/tvshevchuk/Importy) - Source code and releases

### Quick Links
- [Installation Guide](/guide/installation)
- [CLI Reference](/api/cli)
- [Example Use Cases](/examples/basic-usage)
- [Performance Tips](/guide/performance)
- [CI/CD Integration](/guide/ci-cd)

---

<div style="text-align: center; margin: 3rem 0; color: #666;">
  Made with ❤️ by <a href="https://github.com/tvshevchuk" rel="noopener" target="_blank">Taras Shevchuk</a> |
  <a href="https://github.com/tvshevchuk/Importy/blob/main/LICENSE" rel="noopener" target="_blank">MIT License</a> |
  <a href="https://www.npmjs.com/package/importy" rel="noopener" target="_blank">npm package</a>
</div>
