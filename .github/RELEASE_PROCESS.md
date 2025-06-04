# Release Process

This document outlines the automated and manual release processes for Importy.

## Automated Release (Recommended)

The project uses GitHub Actions to automatically create releases when the version in `package.json` changes on the main branch.

### Process Overview

1. **Version Bump**: Update the version in `package.json`
2. **Push to Main**: Commit and push changes to the main branch
3. **Automatic Release**: GitHub Actions detects version change and:
   - Runs tests and quality checks
   - Updates changelog with release date
   - Creates Git tag
   - Creates GitHub release
   - Publishes to npm

### Using the Release Script

The easiest way to create a release is using the provided script:

```bash
# Patch release (0.1.0 → 0.1.1)
npm run release:patch
# or
./scripts/release.sh patch

# Minor release (0.1.0 → 0.2.0)
npm run release:minor
# or
./scripts/release.sh minor

# Major release (0.1.0 → 1.0.0)
npm run release:major
# or
./scripts/release.sh major
```

### Manual Version Bump

Alternatively, you can manually update the version:

```bash
# Check if ready for release
npm run release:check

# Update version manually
npm version patch  # or minor/major

# Push changes
git push origin main --tags
```

## Manual Release Process

For cases where you need more control or the automated process fails:

### 1. Pre-release Checks

```bash
# Check release readiness
npm run release:check

# Run all quality checks
npm run prerelease
```

### 2. Manual Release Script

```bash
# Manual release (doesn't auto-push)
npm run release:manual patch
# or
./scripts/release.sh --manual patch
```

### 3. Manual Steps

If you need to do everything manually:

```bash
# 1. Ensure you're on main branch
git checkout main
git pull origin main

# 2. Run tests and checks
npm test
npm run check
npm run build

# 3. Bump version
npm version patch  # or minor/major

# 4. Update changelog (if needed)
# Edit CHANGELOG.md to replace [Unreleased] with version and date

# 5. Commit and tag
git add CHANGELOG.md
git commit -m "Update changelog for v$(node -p "require('./package.json').version")"
git tag -a "v$(node -p "require('./package.json').version")" -m "Release v$(node -p "require('./package.json').version")"

# 6. Push to trigger workflows
git push origin main --tags
```

## Workflow Files

### `.github/workflows/release.yml`
- **Trigger**: Push to main branch with version change
- **Actions**: Auto-release, changelog update, npm publish
- **Conditions**: Only runs if version changed and tag doesn't exist

### `.github/workflows/publish.yml`
- **Trigger**: Manual workflow dispatch
- **Actions**: Manual npm publish with options
- **Use Case**: Emergency publishes or specific version publishes

### `.github/workflows/ci.yml`
- **Trigger**: PRs and pushes to main
- **Actions**: Tests, linting, build verification
- **Matrix**: Tests on Node.js 16, 18, 20

## Release Types

### Patch Release (x.y.Z)
- Bug fixes
- Documentation updates
- Performance improvements
- No breaking changes

### Minor Release (x.Y.z)
- New features
- Deprecations (with backwards compatibility)
- Large internal changes
- No breaking changes

### Major Release (X.y.z)
- Breaking changes
- Removed deprecated features
- Major API changes
- Significant architecture changes

## Environment Setup

### Required Secrets

In GitHub repository settings, configure:

- `NPM_TOKEN`: npm authentication token for publishing
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Required Environments

Create a "releases" environment in GitHub with:
- Protection rules (optional)
- Required reviewers (optional)
- Environment secrets

## Troubleshooting

### Release Workflow Not Triggering

1. Check if version in `package.json` actually changed
2. Ensure the commit was pushed to main branch
3. Verify the workflow file syntax
4. Check GitHub Actions logs

### Failed npm Publish

1. Check npm token validity
2. Verify package name availability
3. Ensure version doesn't already exist on npm
4. Check npm registry status

### Tag Already Exists

If you need to re-release the same version:

```bash
# Delete local and remote tag
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0

# Re-run release process
```

### Manual Emergency Publish

Use the manual publish workflow:

1. Go to GitHub Actions
2. Run "Manual Publish" workflow
3. Specify version or use current
4. Enable dry-run to test first

## Best Practices

1. **Always test locally** before releasing
2. **Use conventional commits** for better changelog generation
3. **Update documentation** before major releases
4. **Review CHANGELOG.md** after automated updates
5. **Monitor GitHub Actions** during release process
6. **Test the published package** after release

## Scripts Reference

```bash
# Quality checks
npm test                 # Run test suite
npm run check           # Linting and formatting
npm run build           # Build project

# Release scripts
npm run release:check   # Check release readiness
npm run release:patch   # Automated patch release
npm run release:minor   # Automated minor release
npm run release:major   # Automated major release
npm run release:manual  # Manual release (no auto-push)

# Development
npm run dev             # Development mode
npm run format:fix      # Fix formatting issues
npm run lint:fix        # Fix linting issues
```