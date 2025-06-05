---
layout: home

hero:
  name: "Importy"
  text: "JavaScript/TypeScript Import Analyzer"
  tagline: "A powerful CLI tool for analyzing imports from libraries in your codebase"
  image:
    src: /importy.png
    alt: Importy
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/tvshevchuk/Importy
    - theme: alt
      text: npm
      link: https://www.npmjs.com/package/importy

features:
  - icon: 🔍
    title: Deep Analysis
    details: Scan your entire codebase to identify which components from specific libraries are actually being used.
  - icon: ⚡
    title: Lightning Fast
    details: Parallel processing with configurable concurrency makes analysis fast even for large codebases.
  - icon: 📊
    title: Detailed Reports
    details: Generate comprehensive JSON reports showing usage patterns, file locations, and statistics.
  - icon: 🎯
    title: Targeted Scanning
    details: Use glob patterns to include/exclude specific files and focus your analysis where it matters.
  - icon: 🔧
    title: CI/CD Ready
    details: Perfect for automation, dependency auditing, and integration into your development workflow.
  - icon: 🌟
    title: Developer Friendly
    details: Clean CLI interface with helpful output and verbose logging options for debugging.
---

## Quick Start

Get up and running with Importy in seconds:

```bash
# Install globally
npm install -g importy

# Analyze React imports in your project
importy --dir ./src --lib react

# Get detailed output with file locations
importy --dir ./src --lib lodash --verbose
```

## Live Demo

<div style="text-align: center; margin: 2rem 0;">
  <img src="/improved-demo-small.gif" alt="Importy Demo" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
</div>

*See Importy analyzing a React project with multiple libraries*

## Why Importy?

### 🎯 **Dependency Auditing**
Quickly identify which parts of large libraries you're actually using. Perfect for bundle optimization and migration planning.

### 📈 **Migration Planning** 
See exactly which components are used where. Essential for planning library upgrades or refactoring efforts.

### 🚀 **Bundle Optimization**
Find unused imports and optimize your bundle size by switching to targeted imports or removing dead code.

### 🔄 **Automated Analysis**
Integrate into your CI/CD pipeline to track dependency usage over time and catch unwanted imports.

## Real-World Results

```json
{
  "summary": {
    "library": "react",
    "componentsFound": 9,
    "totalImports": 15,
    "filesScanned": 42
  },
  "components": {
    "useState": ["src/components/Counter.tsx", "src/hooks/useForm.ts"],
    "useEffect": ["src/components/Dashboard.tsx"],
    "useCallback": ["src/components/OptimizedList.tsx"]
  }
}
```

## Popular Use Cases

- **React Projects**: Find hook usage patterns and component imports
- **Lodash Analysis**: Identify which utility functions are actually used
- **UI Libraries**: Analyze Material-UI, Ant Design, or Chakra UI component usage
- **Migration Planning**: Map out dependencies before major refactors
- **Bundle Optimization**: Find opportunities for tree-shaking improvements

## What's New in v0.1.1

- ✨ Improved performance with parallel processing
- 🔧 Better error handling and user feedback
- 📊 Enhanced JSON output format
- 🎯 More accurate import detection
- 🚀 Stability improvements

[View Changelog →](https://github.com/tvshevchuk/Importy/blob/main/CHANGELOG.md)

## Community & Support

- 📖 [Documentation](/guide/getting-started)
- 🐛 [Report Issues](https://github.com/tvshevchuk/Importy/issues)
- 💬 [Discussions](https://github.com/tvshevchuk/Importy/discussions)
- 🤝 [Contributing](/contributing)

---

<div style="text-align: center; margin: 3rem 0; color: #666;">
  Made with ❤️ by <a href="https://github.com/tvshevchuk">Taras Shevchuk</a>
</div>