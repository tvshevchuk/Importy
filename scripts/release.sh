#!/bin/bash

# Release script for Importy
# Usage: 
#   ./scripts/release.sh [patch|minor|major]           # Full automated release
#   ./scripts/release.sh --manual [patch|minor|major] # Manual release (no push)
#   ./scripts/release.sh --check                       # Check if ready for release

set -e

# Parse arguments
MANUAL_MODE=false
CHECK_MODE=false
VERSION_TYPE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --manual)
      MANUAL_MODE=true
      shift
      ;;
    --check)
      CHECK_MODE=true
      shift
      ;;
    patch|minor|major)
      VERSION_TYPE=$1
      shift
      ;;
    *)
      echo "Unknown option $1"
      echo "Usage: $0 [--manual|--check] [patch|minor|major]"
      exit 1
      ;;
  esac
done

# Default to patch if no version type provided and not in check mode
if [ -z "$VERSION_TYPE" ] && [ "$CHECK_MODE" = false ]; then
  VERSION_TYPE="patch"
fi

if [ "$CHECK_MODE" = true ]; then
  echo "🔍 Checking release readiness for Importy..."
else
  echo "🚀 Starting release process for Importy..."
  if [ "$MANUAL_MODE" = true ]; then
    echo "📋 Manual mode: Will not push to remote automatically"
  fi
fi

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Error: Please switch to main branch before releasing"
    exit 1
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Working directory is not clean. Please commit or stash your changes."
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📋 Current version: $CURRENT_VERSION"

# Pull latest changes (skip in check mode)
if [ "$CHECK_MODE" = false ]; then
  echo "📥 Pulling latest changes..."
  git pull origin main
fi

# Run tests
echo "🧪 Running tests..."
npm test

# Run linting and formatting
echo "🔧 Running code quality checks..."
npm run check

# Build the project
echo "🔨 Building project..."
npm run build

if [ "$CHECK_MODE" = true ]; then
  echo "✅ All checks passed! Ready for release."
  echo "💡 Run './scripts/release.sh $VERSION_TYPE' to create a release"
  exit 0
fi

# Bump version
echo "📈 Bumping version ($VERSION_TYPE)..."
npm version $VERSION_TYPE --no-git-tag-version

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "✅ New version: $NEW_VERSION"

# Check if tag already exists
if git tag | grep -q "^v$NEW_VERSION$"; then
  echo "❌ Error: Tag v$NEW_VERSION already exists"
  exit 1
fi

# Update changelog date (assuming today's date)
TODAY=$(date +%Y-%m-%d)
if [ -f CHANGELOG.md ] && grep -q "## \[Unreleased\]" CHANGELOG.md; then
  echo "📝 Updating changelog..."
  sed -i.bak "s/## \[Unreleased\]/## [$NEW_VERSION] - $TODAY/" CHANGELOG.md && rm CHANGELOG.md.bak
  git add CHANGELOG.md
fi

# Commit version bump and changelog
git add package.json
git commit -m "Release v$NEW_VERSION"

# Create git tag
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"

echo "🎉 Release v$NEW_VERSION is ready!"

if [ "$MANUAL_MODE" = true ]; then
  echo "📋 Manual mode - Next steps:"
  echo "   1. Review the changes: git log --oneline -5"
  echo "   2. Push to remote: git push origin main --tags"
  echo "   3. GitHub Actions will automatically publish to npm"
  echo "   4. Monitor the release workflow: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[\/:]\([^\/]*\/[^\/]*\)\.git/\1/')/actions"
else
  echo "🚀 Pushing to remote (GitHub Actions will handle publishing)..."
  git push origin main --tags
  echo "✅ Release pushed! Monitor GitHub Actions for automatic publishing:"
  echo "   🔗 https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[\/:]\([^\/]*\/[^\/]*\)\.git/\1/')/actions"
fi