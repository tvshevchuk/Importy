#!/bin/bash

# Release script for Importy
# Usage:
#   ./scripts/release.sh [patch|minor|major]           # Full automated release
#   ./scripts/release.sh --manual [patch|minor|major] # Manual release (no push)
#   ./scripts/release.sh --check                       # Check if ready for release

set -e

# Function to generate changelog entry from commits
generate_changelog() {
  local NEW_VERSION=$1
  local TODAY=$2
  local LAST_TAG

  # Get the last tag
  LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

  # Get commits since last tag (or all commits if no tag exists)
  local COMMITS
  if [ -n "$LAST_TAG" ]; then
    COMMITS=$(git log "$LAST_TAG"..HEAD --pretty=format:"%s" --no-merges 2>/dev/null || echo "")
  else
    COMMITS=$(git log --pretty=format:"%s" --no-merges 2>/dev/null || echo "")
  fi

  if [ -z "$COMMITS" ]; then
    echo "No commits found since last release"
    return
  fi

  # Categorize commits
  local ADDED=""
  local FIXED=""
  local CHANGED=""
  local DOCS=""
  local CHORE=""
  local OTHER=""

  while IFS= read -r commit; do
    # Skip empty lines
    [ -z "$commit" ] && continue

    # Categorize based on conventional commit prefixes or keywords
    case "$commit" in
      feat:*|feat\(*|add:*|Add*|add*)
        ADDED="${ADDED}\n- ${commit#*: }"
        ;;
      fix:*|fix\(*|Fix*|fix*|bugfix:*)
        FIXED="${FIXED}\n- ${commit#*: }"
        ;;
      docs:*|doc:*|Docs*|Doc*)
        DOCS="${DOCS}\n- ${commit#*: }"
        ;;
      chore:*|chore\(*|build:*|ci:*)
        CHORE="${CHORE}\n- ${commit#*: }"
        ;;
      refactor:*|perf:*|style:*|update:*|Update*|change:*|Change*)
        CHANGED="${CHANGED}\n- ${commit#*: }"
        ;;
      *)
        OTHER="${OTHER}\n- ${commit}"
        ;;
    esac
  done <<< "$COMMITS"

  # Build the changelog entry
  local ENTRY="## [$NEW_VERSION] - $TODAY"

  if [ -n "$ADDED" ]; then
    ENTRY="${ENTRY}\n\n### ✨ Added${ADDED}"
  fi

  if [ -n "$FIXED" ]; then
    ENTRY="${ENTRY}\n\n### 🔧 Fixed${FIXED}"
  fi

  if [ -n "$CHANGED" ]; then
    ENTRY="${ENTRY}\n\n### 🔄 Changed${CHANGED}"
  fi

  if [ -n "$DOCS" ]; then
    ENTRY="${ENTRY}\n\n### 📖 Documentation${DOCS}"
  fi

  if [ -n "$CHORE" ]; then
    ENTRY="${ENTRY}\n\n### 🛠️ Maintenance${CHORE}"
  fi

  if [ -n "$OTHER" ]; then
    ENTRY="${ENTRY}\n\n### 📝 Other${OTHER}"
  fi

  echo -e "$ENTRY"
}

# Function to update version references across documentation
update_version_references() {
  local OLD_VERSION=$1
  local NEW_VERSION=$2

  echo "📄 Updating version references from $OLD_VERSION to $NEW_VERSION..."

  # Update README.md
  if [ -f README.md ]; then
    sed -i.bak "s/Version $OLD_VERSION/Version $NEW_VERSION/g" README.md
    sed -i.bak "s/output: $OLD_VERSION/output: $NEW_VERSION/g" README.md
    rm -f README.md.bak
    echo "   ✓ README.md"
  fi

  # Update docs/.vitepress/config.ts (nav version badge)
  if [ -f docs/.vitepress/config.ts ]; then
    sed -i.bak "s/text: \"v$OLD_VERSION\"/text: \"v$NEW_VERSION\"/g" docs/.vitepress/config.ts
    sed -i.bak "s/softwareVersion: \"$OLD_VERSION\"/softwareVersion: \"$NEW_VERSION\"/g" docs/.vitepress/config.ts
    rm -f docs/.vitepress/config.ts.bak
    echo "   ✓ docs/.vitepress/config.ts"
  fi

  # Update docs/public/structured-data.json
  if [ -f docs/public/structured-data.json ]; then
    sed -i.bak "s/\"softwareVersion\": \"$OLD_VERSION\"/\"softwareVersion\": \"$NEW_VERSION\"/g" docs/public/structured-data.json
    rm -f docs/public/structured-data.json.bak
    echo "   ✓ docs/public/structured-data.json"
  fi

  # Update docs/index.md
  if [ -f docs/index.md ]; then
    sed -i.bak "s/v$OLD_VERSION/v$NEW_VERSION/g" docs/index.md
    rm -f docs/index.md.bak
    echo "   ✓ docs/index.md"
  fi

  # Update docs/guide/installation.md
  if [ -f docs/guide/installation.md ]; then
    sed -i.bak "s/output: $OLD_VERSION/output: $NEW_VERSION/g" docs/guide/installation.md
    rm -f docs/guide/installation.md.bak
    echo "   ✓ docs/guide/installation.md"
  fi

  # Update docs/api/cli.md
  if [ -f docs/api/cli.md ]; then
    sed -i.bak "s/Output: $OLD_VERSION/Output: $NEW_VERSION/g" docs/api/cli.md
    sed -i.bak "s/\"version\": \"$OLD_VERSION\"/\"version\": \"$NEW_VERSION\"/g" docs/api/cli.md
    rm -f docs/api/cli.md.bak
    echo "   ✓ docs/api/cli.md"
  fi

  # Update docs/api/output-format.md
  if [ -f docs/api/output-format.md ]; then
    sed -i.bak "s/\"version\": \"$OLD_VERSION\"/\"version\": \"$NEW_VERSION\"/g" docs/api/output-format.md
    rm -f docs/api/output-format.md.bak
    echo "   ✓ docs/api/output-format.md"
  fi

  # Update docs/contributing.md
  if [ -f docs/contributing.md ]; then
    sed -i.bak "s/Importy version: $OLD_VERSION/Importy version: $NEW_VERSION/g" docs/contributing.md
    rm -f docs/contributing.md.bak
    echo "   ✓ docs/contributing.md"
  fi

  # Update docs/changelog.md - copy from CHANGELOG.md if it exists
  if [ -f CHANGELOG.md ] && [ -f docs/changelog.md ]; then
    # Extract just the content part (skip any frontmatter in docs version)
    if head -1 docs/changelog.md | grep -q "^---"; then
      # Has frontmatter, preserve it
      FRONTMATTER=$(sed -n '1,/^---$/p' docs/changelog.md | head -n -1)
      echo "$FRONTMATTER" > docs/changelog.md.tmp
      echo "---" >> docs/changelog.md.tmp
      echo "" >> docs/changelog.md.tmp
      tail -n +8 CHANGELOG.md >> docs/changelog.md.tmp
      mv docs/changelog.md.tmp docs/changelog.md
    else
      # No frontmatter, just copy
      cp CHANGELOG.md docs/changelog.md
    fi
    echo "   ✓ docs/changelog.md (synced from CHANGELOG.md)"
  fi
}

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

# Update version references in README and docs
update_version_references "$CURRENT_VERSION" "$NEW_VERSION"

# Generate and update changelog
TODAY=$(date +%Y-%m-%d)
echo "📝 Generating changelog from commits..."

CHANGELOG_ENTRY=$(generate_changelog "$NEW_VERSION" "$TODAY")

if [ -f CHANGELOG.md ]; then
  # Create a temporary file with the new entry
  TEMP_FILE=$(mktemp)

  # Find the line after the header (after "Semantic Versioning" line) and insert new entry
  awk -v entry="$CHANGELOG_ENTRY" '
    /^## \[/ && !inserted {
      print entry
      print ""
      inserted=1
    }
    {print}
  ' CHANGELOG.md > "$TEMP_FILE"

  # If no version header was found, insert after the header section
  if ! grep -q "^## \[$NEW_VERSION\]" "$TEMP_FILE"; then
    awk -v entry="$CHANGELOG_ENTRY" '
      /adheres to \[Semantic Versioning\]/ {
        print
        print ""
        print entry
        next
      }
      {print}
    ' CHANGELOG.md > "$TEMP_FILE"
  fi

  mv "$TEMP_FILE" CHANGELOG.md
  echo "✅ Changelog updated with new entry"
else
  # Create new CHANGELOG.md if it doesn't exist
  cat > CHANGELOG.md << EOF
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

$CHANGELOG_ENTRY
EOF
  echo "✅ Created new CHANGELOG.md"
fi

# Stage all updated files
git add CHANGELOG.md
git add package.json
git add README.md
git add docs/ 2>/dev/null || true

# Commit version bump, changelog, and docs
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