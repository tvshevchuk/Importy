#!/bin/bash

# Importy Demo Recording Script
# This script helps you recreate the demo recording for Importy

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}================================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================================${NC}\n"
}

print_step() {
    echo -e "${GREEN}➤ $1${NC}\n"
}

print_info() {
    echo -e "${CYAN}💡 $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "tsconfig.json" ]; then
    print_error "This script must be run from the Importy project root directory"
    exit 1
fi

print_header "🎬 Importy Demo Recording Setup"

# Check prerequisites
print_step "Step 1: Checking prerequisites"

# Check if Importy is built
if [ ! -f "dist/index.js" ]; then
    print_warning "Importy not built. Building now..."
    npm run build
fi

# Check for asciinema
if ! command -v asciinema &> /dev/null; then
    print_warning "asciinema not found. Installing..."
    if command -v brew &> /dev/null; then
        brew install asciinema
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y asciinema
    elif command -v yum &> /dev/null; then
        sudo yum install -y asciinema
    else
        print_error "Please install asciinema manually: https://asciinema.org/docs/installation"
        exit 1
    fi
fi

# Check for agg (GIF converter)
if ! command -v agg &> /dev/null; then
    print_warning "agg not found. Installing..."
    if ! command -v cargo &> /dev/null; then
        print_info "Installing Rust and Cargo..."
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source "$HOME/.cargo/env"
    fi
    cargo install --git https://github.com/asciinema/agg
fi

print_info "✅ All prerequisites installed!"

# Check if demo project exists
print_step "Step 2: Setting up demo project"

if [ ! -d "demo-project" ]; then
    print_warning "Demo project not found. Creating demo project structure..."
    
    # Create demo project structure
    mkdir -p demo-project/src/{components,utils}
    
    # Create sample files (simplified versions for quick setup)
    cat > demo-project/src/App.tsx << 'EOF'
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return <div onClick={handleClick}>Count: {count}</div>;
};

export default App;
EOF

    cat > demo-project/src/components/Dashboard.tsx << 'EOF'
import React, { useState, useEffect, useMemo, useContext, createContext } from 'react';

const DashboardContext = createContext(null);

const Dashboard = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Fetch data
  }, []);
  
  const processedData = useMemo(() => {
    return data.filter(item => item.active);
  }, [data]);
  
  return <div>Dashboard with {processedData.length} items</div>;
};

export default Dashboard;
EOF

    cat > demo-project/src/components/UserCard.tsx << 'EOF'
import React, { memo, useState, Component } from 'react';

const UserCard = memo(({ user }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {user.name}
    </div>
  );
});

export default UserCard;
EOF

    cat > demo-project/src/utils/helpers.ts << 'EOF'
import { debounce, throttle, isEmpty, isEqual, cloneDeep, merge, pick, omit } from 'lodash';
import _ from 'lodash';

export const debouncedSearch = debounce((query: string, callback: Function) => {
  callback(query);
}, 300);

export const throttledHandler = throttle(() => {
  console.log('throttled');
}, 100);

export const deepClone = (obj: any) => cloneDeep(obj);
export const mergeObjects = (a: any, b: any) => merge(a, b);
export const isEmptyObject = (obj: any) => isEmpty(obj);
export const areEqual = (a: any, b: any) => isEqual(a, b);
export const pickProps = (obj: any, keys: string[]) => pick(obj, keys);
export const omitProps = (obj: any, keys: string[]) => omit(obj, keys);
export const generateId = () => _.uniqueId('id_');
EOF

    cat > demo-project/src/index.ts << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { format, parseISO, isValid } from 'date-fns';
import { debounce, throttle, omit, pick } from 'lodash';
import classNames from 'classnames';

import App from './App';
import Dashboard from './components/Dashboard';
import UserCard from './components/UserCard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export { App, Dashboard, UserCard };
EOF

    print_info "✅ Demo project created!"
else
    print_info "✅ Demo project already exists!"
fi

# Make demo script executable
print_step "Step 3: Preparing demo script"
chmod +x demo-script.sh
print_info "✅ Demo script is ready!"

# Recording options
print_step "Step 4: Recording options"
echo -e "${CYAN}Choose recording format:${NC}"
echo "1. Record new demo (interactive)"
echo "2. Use existing demo script (automated)"
echo "3. Generate GIF from existing recording"

read -p "Enter choice (1-3): " choice

case $choice in
    1)
        print_info "Starting interactive recording..."
        print_info "Commands to try:"
        echo "  node dist/index.js --dir demo-project/src --lib react"
        echo "  node dist/index.js --dir demo-project/src --lib lodash --verbose"
        echo "  node dist/index.js --dir demo-project/src --lib react --output results.json"
        echo ""
        read -p "Press Enter to start recording (Ctrl+D to stop)..."
        asciinema rec demo-interactive.cast --cols 120 --rows 35
        ;;
    2)
        print_info "Running automated demo script..."
        asciinema rec demo-automated.cast --cols 120 --rows 35 -c "./demo-script.sh"
        ;;
    3)
        if [ ! -f "*.cast" ]; then
            print_error "No .cast files found. Please record a demo first."
            exit 1
        fi
        ;;
esac

# Generate GIF
print_step "Step 5: Generating GIF"

# Find the most recent .cast file
CAST_FILE=$(ls -t *.cast 2>/dev/null | head -n1)

if [ -z "$CAST_FILE" ]; then
    print_error "No .cast file found. Please record a demo first."
    exit 1
fi

print_info "Converting $CAST_FILE to GIF..."

# Source cargo environment if needed
if command -v cargo &> /dev/null; then
    source "$HOME/.cargo/env" 2>/dev/null || true
fi

# Generate high-quality GIF
agg --theme dracula --font-size 14 --speed 1.5 "$CAST_FILE" "improved-demo.gif"

# Generate optimized GIF
agg --theme dracula --font-size 12 --speed 2.0 --fps-cap 15 "$CAST_FILE" "improved-demo-small.gif"

# Move to public directory
mkdir -p public
mv improved-demo*.gif public/

print_step "Step 6: Results"
print_info "✅ Demo recording complete!"
echo -e "${GREEN}Generated files:${NC}"
echo "  📁 public/improved-demo.gif (high quality)"
echo "  📁 public/improved-demo-small.gif (optimized)"
echo "  🎬 $CAST_FILE (source recording)"

print_info "🎯 Next steps:"
echo "  1. Review the generated GIFs"
echo "  2. Update README.md with the new demo"
echo "  3. Commit and push changes"
echo "  4. Share your awesome demo!"

print_header "🎉 Demo recording setup complete!"
print_info "Happy demoing! 🚀"