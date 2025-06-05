# Contributing to Importy

Thank you for your interest in contributing to Importy! This guide will help you get started with contributing to the project.

## 🤝 Ways to Contribute

There are many ways you can contribute to Importy:

- 🐛 **Report bugs** and issues
- 💡 **Suggest new features** or improvements
- 📖 **Improve documentation**
- 🧪 **Write tests** and improve test coverage
- 🔧 **Fix bugs** and implement features
- 🎨 **Improve user experience** and CLI design
- 📊 **Add examples** and use cases

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **pnpm**: Package manager (recommended)
- **Git**: For version control

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Importy.git
   cd Importy
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Build the project**:
   ```bash
   pnpm run build
   ```

5. **Run tests** to ensure everything works:
   ```bash
   pnpm test
   ```

6. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Project Structure

```
Importy/
├── src/                    # Source code
│   ├── index.ts           # Main entry point
│   ├── cli.ts             # CLI interface
│   ├── analyzer.ts        # Core analysis logic
│   └── utils/             # Utility functions
├── tests/                 # Test files
│   ├── programmatic.test.ts
│   └── cli.test.ts
├── docs/                  # Documentation site
├── demo-project/          # Demo project for testing
├── scripts/               # Build and release scripts
└── dist/                  # Built output
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
npx vitest run tests/programmatic.test.ts
```

### Test Types

1. **Programmatic Tests**: Test the core JavaScript API
2. **CLI Tests**: Test command-line interface functionality
3. **Integration Tests**: Test end-to-end workflows

### Writing Tests

When adding new features, please include tests:

```typescript
import { describe, it, expect } from 'vitest';
import { analyzeImports } from '../src/analyzer';

describe('analyzeImports', () => {
  it('should detect React hooks', () => {
    const result = analyzeImports('./test-project', 'react');
    expect(result.components.useState).toBeDefined();
  });
});
```

## 🔧 Development Workflow

### Code Quality

We use several tools to maintain code quality:

```bash
# Lint code
pnpm run lint

# Format code
pnpm run format

# Type check
pnpm run check

# Fix all issues
pnpm run check:fix
```

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add support for Vue.js imports
fix: handle parsing errors gracefully
docs: update installation guide
test: add tests for CLI options
refactor: simplify file filtering logic
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `chore`: Maintenance tasks

### Pull Request Process

1. **Ensure tests pass**:
   ```bash
   pnpm test
   pnpm run check
   ```

2. **Update documentation** if needed

3. **Create a pull request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Test coverage information

4. **Respond to feedback** and make requested changes

5. **Ensure CI passes** before requesting final review

## 🐛 Bug Reports

When reporting bugs, please include:

### Required Information

- **Version**: Importy version (`importy --version`)
- **Node.js Version**: (`node --version`)
- **Operating System**: (Windows, macOS, Linux)
- **Command Used**: Exact command that caused the issue
- **Expected Behavior**: What should have happened
- **Actual Behavior**: What actually happened

### Bug Report Template

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Run `importy --dir ./src --lib react`
2. See error

**Expected Result**
Should analyze React imports successfully.

**Actual Result**
Error: Cannot read property 'components' of undefined

**Environment**
- Importy version: 0.1.1
- Node.js version: 18.17.0
- OS: macOS 13.5

**Additional Context**
Any additional information or screenshots.
```

## 💡 Feature Requests

We welcome feature suggestions! Please include:

### Feature Request Template

```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Use Case**
Why would this feature be useful? What problem does it solve?

**Proposed Solution**
How do you think this should work?

**Alternatives Considered**
Any alternative solutions you've considered.

**Additional Context**
Any additional information, mockups, or examples.
```

## 📖 Documentation

### Documentation Site

The documentation site uses VitePress:

```bash
# Start development server
pnpm run docs:dev

# Build documentation
pnpm run docs:build

# Preview built docs
pnpm run docs:preview
```

### Writing Documentation

When contributing to docs:

1. **Use clear, concise language**
2. **Include practical examples**
3. **Test all code examples**
4. **Follow the existing structure**
5. **Add relevant links and cross-references**

### Documentation Structure

- **Guide**: Getting started and tutorials
- **API**: Technical reference
- **Examples**: Practical use cases
- **Contributing**: This guide

## 🏗️ Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all source code
- **ESM**: Use ES modules (import/export)
- **Async/Await**: Prefer async/await over promises
- **Error Handling**: Always handle errors gracefully
- **Types**: Use strict TypeScript types

### Performance

- **Async Processing**: Use worker threads for CPU-intensive tasks
- **Memory Efficiency**: Be mindful of memory usage for large codebases
- **Benchmarking**: Include performance tests for critical paths

### Compatibility

- **Node.js**: Support Node.js 18+
- **Cross-platform**: Ensure Windows, macOS, and Linux compatibility
- **Backward Compatibility**: Avoid breaking changes in minor versions

## 🚢 Release Process

Releases are automated through GitHub Actions:

1. **Version Bump**: Use conventional commits to trigger releases
2. **Testing**: All tests must pass
3. **Documentation**: Ensure docs are up to date
4. **Changelog**: Update automatically generated
5. **npm Publish**: Automatic publication to npm

### Manual Release (Maintainers Only)

```bash
# Patch release
pnpm run release:patch

# Minor release
pnpm run release:minor

# Major release
pnpm run release:major
```

## 🤔 Getting Help

### Community Support

- 💬 [GitHub Discussions](https://github.com/tvshevchuk/Importy/discussions) - Ask questions and share ideas
- 🐛 [Issue Tracker](https://github.com/tvshevchuk/Importy/issues) - Report bugs and request features

### Development Questions

For development-related questions:

1. Check existing [issues](https://github.com/tvshevchuk/Importy/issues) and [discussions](https://github.com/tvshevchuk/Importy/discussions)
2. Search the [documentation](https://tvshevchuk.github.io/Importy/)
3. Ask in [GitHub Discussions](https://github.com/tvshevchuk/Importy/discussions)

## 📋 Checklist for Contributors

Before submitting your contribution:

- [ ] Tests pass locally (`pnpm test`)
- [ ] Code quality checks pass (`pnpm run check`)
- [ ] Documentation updated if needed
- [ ] Commit messages follow conventional format
- [ ] PR description explains the changes
- [ ] Breaking changes are documented

## 🎯 Good First Issues

Looking for a way to contribute? Check out issues labeled:

- `good first issue`: Perfect for newcomers
- `help wanted`: Community help needed
- `documentation`: Documentation improvements
- `enhancement`: New features and improvements

## 📜 Code of Conduct

Please note that this project is released with a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

## 🙏 Recognition

Contributors are recognized in:

- **GitHub Contributors**: Automatic recognition
- **Release Notes**: Major contributors mentioned
- **Documentation**: Contributors page (coming soon)

## 📞 Contact

- **Project Maintainer**: [Taras Shevchuk](https://github.com/tvshevchuk)
- **Email**: Available in GitHub profile
- **Social**: Links available in GitHub profile

---

Thank you for contributing to Importy! Your contributions help make the JavaScript/TypeScript ecosystem better for everyone. 🚀