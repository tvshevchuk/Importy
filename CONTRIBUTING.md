# Contributing to Importy

Thank you for your interest in contributing to Importy! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Style](#code-style)
- [Release Process](#release-process)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- pnpm (recommended) or npm
- Git

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/Importy.git
   cd Importy
   ```

3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/tvshevchuk/Importy.git
   ```

4. **Install dependencies**:
   ```bash
   pnpm install
   ```

5. **Build the project**:
   ```bash
   pnpm run build
   ```

6. **Run tests** to ensure everything is working:
   ```bash
   pnpm test
   ```

## Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

- **Bug fixes**: Fix issues with the CLI tool
- **Feature enhancements**: Add new functionality
- **Documentation improvements**: Enhance README, docs, or code comments
- **Performance optimizations**: Improve speed or memory usage
- **Test coverage**: Add or improve tests
- **Code quality**: Refactoring and improvements

### Before You Start

1. **Check existing issues** to see if your contribution is already being worked on
2. **Create an issue** to discuss major changes before implementing them
3. **Keep changes focused** - one feature or bug fix per PR
4. **Follow the coding standards** outlined in this document

## Pull Request Process

### 1. Create a Branch

Create a descriptive branch name:

```bash
git checkout -b feature/add-glob-pattern-support
git checkout -b fix/memory-leak-large-files
git checkout -b docs/improve-api-documentation
```

### 2. Make Your Changes

- Write clear, readable code
- Add tests for new functionality
- Update documentation as needed
- Follow the existing code style

### 3. Test Your Changes

```bash
# Run all tests
pnpm test

# Run code quality checks
pnpm run check

# Build the project
pnpm run build

# Test the CLI manually
node dist/index.js --help
```

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add support for glob patterns in file filtering

- Add glob pattern matching for include/exclude options
- Update CLI help text with glob examples
- Add tests for glob functionality"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `test:` for adding tests
- `refactor:` for code refactoring
- `perf:` for performance improvements

### 5. Push and Submit

```bash
git push origin your-branch-name
```

Then create a pull request on GitHub with:
- Clear title describing the change
- Detailed description of what was changed and why
- Reference to any related issues
- Screenshots for UI changes (if applicable)

## Development Workflow

### Available Scripts

```bash
# Development
pnpm run dev          # Run in development mode with ts-node
pnpm run build        # Build the TypeScript project
pnpm start           # Run the built version

# Testing
pnpm test            # Run all tests
pnpm run test:watch  # Run tests in watch mode

# Code Quality
pnpm run lint        # Check code with Biome linter
pnpm run lint:fix    # Fix linting issues automatically
pnpm run format      # Check code formatting
pnpm run format:fix  # Fix formatting issues
pnpm run check       # Run all checks (lint + format)
pnpm run check:fix   # Fix all issues automatically

# Release (maintainers only)
pnpm run release:check    # Check if ready for release
pnpm run release:patch    # Create patch release
pnpm run release:minor    # Create minor release
pnpm run release:major    # Create major release
```

### Project Structure

```
Importy/
├── src/
│   ├── index.ts     # Main entry point and core logic
│   └── cli.ts       # Command-line interface
├── tests/           # Test files
├── dist/            # Built output (generated)
├── scripts/         # Build and release scripts
└── public/          # Static assets
```

## Testing

Importy uses [Vitest](https://vitest.dev/) for testing. We have two types of tests:

### 1. Programmatic Tests
Test the core functionality through the JavaScript API.

### 2. CLI Tests
Test the command-line interface behavior.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run specific test file
npx vitest run tests/programmatic.test.ts
```

### Writing Tests

When adding new features:

1. **Add unit tests** for core functionality
2. **Add integration tests** for CLI behavior
3. **Test edge cases** and error conditions
4. **Ensure good test coverage**

Example test structure:

```typescript
import { describe, it, expect } from 'vitest'
import { analyzeImports } from '../src/index.js'

describe('Import Analysis', () => {
  it('should find React imports correctly', async () => {
    const result = await analyzeImports('./test-fixtures', 'react')
    expect(result.components).toHaveProperty('useState')
  })
})
```

## Code Style

### TypeScript Guidelines

- Use TypeScript for all new code
- Provide proper type annotations
- Avoid `any` types when possible
- Use interfaces for object shapes
- Use proper error handling with try/catch

### Code Formatting

We use [Biome](https://biomejs.dev/) for code formatting and linting:

```bash
# Check formatting and linting
pnpm run check

# Auto-fix issues
pnpm run check:fix
```

### Best Practices

- **Write readable code** with clear variable and function names
- **Add comments** for complex logic
- **Keep functions small** and focused on single responsibilities
- **Use async/await** instead of Promises.then() where possible
- **Handle errors gracefully** with meaningful error messages

## Release Process

Importy uses automated releases via GitHub Actions. The process is:

1. **Version bump**: Update version in `package.json`
2. **Automated checks**: CI runs tests and quality checks
3. **Release creation**: GitHub release is created automatically
4. **NPM publish**: Package is published to npm registry

For more details, see [Release Process](.github/RELEASE_PROCESS.md).

### For Maintainers

```bash
# Check if ready for release
pnpm run release:check

# Create releases
pnpm run release:patch    # 1.0.0 → 1.0.1
pnpm run release:minor    # 1.0.0 → 1.1.0
pnpm run release:major    # 1.0.0 → 2.0.0
```

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Environment information**:
   - Node.js version
   - Operating system
   - Importy version
5. **Sample code or files** if applicable

### Security Issues

For security vulnerabilities, please email the maintainers directly instead of creating a public issue.

## Feature Requests

We welcome feature requests! When suggesting new features:

1. **Check existing issues** to avoid duplicates
2. **Describe the use case** and problem you're trying to solve
3. **Provide examples** of how the feature would work
4. **Consider backwards compatibility**

### Feature Request Template

```markdown
**Feature Description**
A clear and concise description of the feature.

**Problem/Use Case**
Describe the problem this feature would solve.

**Proposed Solution**
How you envision this feature working.

**Alternatives Considered**
Other approaches you've considered.

**Additional Context**
Screenshots, examples, or other relevant information.
```

## Getting Help

- **Documentation**: Check the [README](README.md) for usage information
- **Issues**: Browse [existing issues](https://github.com/tvshevchuk/Importy/issues) for solutions
- **Discussions**: Start a [GitHub Discussion](https://github.com/tvshevchuk/Importy/discussions) for questions

## Recognition

Contributors will be recognized in:
- Release notes for significant contributions
- README contributors section (coming soon)
- GitHub contributors graph

Thank you for contributing to Importy! 🎉