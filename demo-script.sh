#!/bin/bash

# Importy Demo Script - Enhanced Version
# This script demonstrates the capabilities of Importy CLI tool with smooth animations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "\n${BLUE}================================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================================${NC}\n"
}

print_step() {
    echo -e "${GREEN}➤ $1${NC}\n"
}

print_command() {
    echo -e "${YELLOW}$ $1${NC}"
}

print_info() {
    echo -e "${CYAN}💡 $1${NC}"
}

print_warning() {
    echo -e "${RED}⚠️  $1${NC}"
}

# Function to simulate typing with delays
type_command() {
    local cmd="$1"
    local delay="${2:-0.05}"
    echo -ne "${YELLOW}$ ${NC}"
    for (( i=0; i<${#cmd}; i++ )); do
        echo -n "${cmd:$i:1}"
        sleep $delay
    done
    echo
}

# Function to add pauses for better readability
pause() {
    local duration="${1:-2}"
    sleep $duration
}

# Check if Importy is built
if [ ! -f "dist/index.js" ]; then
    echo -e "${RED}❌ Importy not built. Please run 'npm run build' first.${NC}"
    exit 1
fi

# Set terminal size for better display
export COLUMNS=120
export LINES=40

# Clear screen for clean demo
clear

print_header "🚀 Welcome to Importy - JavaScript/TypeScript Import Analyzer"
print_info "Importy helps you understand your codebase by analyzing import usage patterns"
print_info "Let's explore how it works with a comprehensive demo..."
pause 3

print_step "Step 1: Exploring our demo project structure"
print_info "First, let's see what files we'll be analyzing:"
pause 1

type_command "find demo-project -type f -name '*.ts' -o -name '*.tsx' | sort"
find demo-project -type f -name '*.ts' -o -name '*.tsx' | sort
echo

print_info "Our demo project contains React components with various imports from popular libraries"
pause 3

print_step "Step 2: Basic React analysis - Finding all React imports"
print_info "Let's start by analyzing React imports across our entire demo project:"
pause 1

type_command "node dist/index.js --dir demo-project/src --lib react"
pause 1
node dist/index.js --dir demo-project/src --lib react
echo

print_info "📊 Found 9 different React imports used 15 times across 5 files!"
print_info "Notice how it identifies hooks like useState, useEffect, and components"
pause 4

print_step "Step 3: Verbose analysis with lodash utilities"
print_info "Now let's see the verbose output while analyzing lodash imports:"
pause 1

type_command "node dist/index.js --dir demo-project/src --lib lodash --verbose"
pause 1
node dist/index.js --dir demo-project/src --lib lodash --verbose
echo

print_info "🔍 Verbose mode shows processing progress and detailed statistics"
print_info "Great for debugging and understanding performance with large codebases"
pause 4

print_step "Step 4: Exporting results to JSON file"
print_info "Importy can save analysis results for further processing or reporting:"
pause 1

type_command "node dist/index.js --dir demo-project/src --lib react --output react-analysis.json"
pause 1
node dist/index.js --dir demo-project/src --lib react --output react-analysis.json
echo

if [ -f "react-analysis.json" ]; then
    print_info "✅ Results saved! Let's preview the structured output:"
    pause 1
    type_command "cat react-analysis.json | head -25"
    pause 0.5
    cat react-analysis.json | head -25
    echo -e "\n${CYAN}... (showing first 25 lines)${NC}\n"
else
    print_warning "Failed to create output file"
fi
pause 4

print_step "Step 5: Checking for specific library usage"
print_info "Let's check if we're using axios for HTTP requests:"
pause 1

type_command "node dist/index.js --dir demo-project/src --lib axios"
pause 1
node dist/index.js --dir demo-project/src --lib axios
echo

print_info "🎯 Found axios imports! Perfect for dependency auditing"
pause 3

print_step "Step 6: File filtering with include patterns"
print_info "Analyze only TypeScript files using glob patterns:"
pause 1

type_command "node dist/index.js --dir demo-project/src --lib date-fns --include '**/*.ts'"
pause 1
node dist/index.js --dir demo-project/src --lib date-fns --include '**/*.ts'
echo

print_info "📁 Include patterns help focus analysis on specific file types"
pause 3

print_step "Step 7: Excluding files with patterns"
print_info "Exclude node_modules and other directories you don't want to analyze:"
pause 1

type_command "node dist/index.js --dir demo-project/src --lib lodash --exclude '**/node_modules/**' --exclude '**/dist/**'"
pause 1
node dist/index.js --dir demo-project/src --lib lodash --exclude '**/node_modules/**' --exclude '**/dist/**'
echo

print_info "🚫 Exclusion patterns prevent analysis of unwanted directories"
pause 3

print_step "Step 8: Performance optimization with concurrency"
print_info "Control processing speed with concurrency settings:"
pause 1

type_command "node dist/index.js --dir demo-project/src --lib react --concurrency 2 --verbose"
pause 1
node dist/index.js --dir demo-project/src --lib react --concurrency 2 --verbose
echo

print_info "⚡ Concurrency control helps optimize performance for your system"
pause 3

print_step "Step 9: Examining source code structure"
print_info "Let's look at the actual imports in one of our demo files:"
pause 1

type_command "head -10 demo-project/src/App.tsx"
pause 1
head -10 demo-project/src/App.tsx
echo

print_info "👀 See how Importy detected these exact import statements"
pause 3

print_step "Step 10: Advanced - Analyzing React DOM separately"
print_info "Importy can distinguish between related but separate libraries:"
pause 1

type_command "node dist/index.js --dir demo-project/src --lib react-dom"
pause 1
node dist/index.js --dir demo-project/src --lib react-dom
echo

print_info "🔬 Precise library matching helps with migration planning"
pause 3

print_step "Step 11: Multiple library analysis comparison"
print_info "Let's quickly compare usage across different utility libraries:"
pause 1

echo -e "${CYAN}Comparing classnames vs lodash usage:${NC}"
pause 1

type_command "node dist/index.js --dir demo-project/src --lib classnames"
pause 1
node dist/index.js --dir demo-project/src --lib classnames
echo

pause 2

print_step "Step 12: Real-world scenario - Dependency audit"
print_info "Simulate a dependency audit by checking multiple libraries:"
pause 1

for lib in "react" "lodash" "axios" "date-fns"; do
    echo -e "${YELLOW}Checking $lib usage...${NC}"
    result=$(node dist/index.js --dir demo-project/src --lib $lib | grep -o '"totalImports": [0-9]*' | grep -o '[0-9]*')
    echo -e "${GREEN}✓ $lib: $result imports found${NC}"
    pause 0.5
done
echo

print_info "📋 Perfect for dependency cleanup and license auditing!"
pause 3

print_header "🎯 Demo Complete - Key Takeaways"

echo -e "${GREEN}✅ Importy successfully demonstrated:${NC}\n"

echo -e "   🔍 ${CYAN}Static Analysis${NC} - Parses JavaScript/TypeScript without execution"
echo -e "   📊 ${CYAN}Detailed Reporting${NC} - Shows exactly where each import is used"
echo -e "   🎯 ${CYAN}Library-Specific Detection${NC} - Precise matching for any npm package"
echo -e "   📁 ${CYAN}Flexible File Filtering${NC} - Include/exclude patterns for targeted analysis"
echo -e "   ⚡ ${CYAN}Performance Control${NC} - Adjustable concurrency for optimal speed"
echo -e "   💾 ${CYAN}Export Capabilities${NC} - JSON output for integration with other tools"
echo -e "   🔧 ${CYAN}Verbose Logging${NC} - Detailed progress tracking for large projects"
echo -e "   🚫 ${CYAN}Smart Exclusions${NC} - Skip node_modules and other irrelevant directories"

echo -e "\n${PURPLE}🏆 Use Cases:${NC}"
echo -e "   • Dependency auditing and cleanup"
echo -e "   • Migration planning (React class → hooks)"
echo -e "   • Bundle optimization (find unused imports)"
echo -e "   • Code review automation"
echo -e "   • License compliance checking"
echo -e "   • Architecture analysis"

pause 2

print_header "🚀 Get Started with Importy Today!"

echo -e "${YELLOW}📦 Installation:${NC}"
echo -e "   npm install -g importy"
echo -e "   # or"
echo -e "   yarn global add importy"
echo -e "   # or"
echo -e "   pnpm add -g importy"
echo

echo -e "${YELLOW}🔧 Basic Usage:${NC}"
echo -e "   importy --dir ./src --lib react"
echo -e "   importy --dir ./src --lib lodash --output report.json"
echo -e "   importy --dir ./src --lib @mui/material --verbose"
echo

echo -e "${YELLOW}📚 More Options:${NC}"
echo -e "   importy --help"
echo

echo -e "${YELLOW}🌐 Resources:${NC}"
echo -e "   GitHub: https://github.com/tvshevchuk/Importy"
echo -e "   NPM: https://www.npmjs.com/package/importy"

# Cleanup
if [ -f "react-analysis.json" ]; then
    rm react-analysis.json
    print_info "🧹 Cleaned up demo output files"
fi

echo -e "\n${GREEN}🎉 Thank you for exploring Importy!${NC}"
echo -e "${CYAN}Happy analyzing! 🔍✨${NC}\n"