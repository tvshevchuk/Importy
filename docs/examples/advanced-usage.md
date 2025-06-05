# Advanced Usage Examples

This page covers advanced scenarios and complex use cases for Importy.

## Monorepo Analysis

### Analyzing Multiple Packages

For large monorepos, analyze each package separately:

```bash
#!/bin/bash

# Define packages to analyze
packages=(
  "packages/ui"
  "packages/utils" 
  "packages/components"
  "apps/web"
  "apps/mobile"
)

libraries=("react" "lodash" "@mui/material" "axios")

# Create analysis directory
mkdir -p analysis/$(date +%Y%m%d)

for package in "${packages[@]}"; do
  package_name=$(basename "$package")
  
  echo "🔍 Analyzing $package_name..."
  
  for lib in "${libraries[@]}"; do
    # Clean library name for filename
    lib_clean=${lib//\//-}
    output_file="analysis/$(date +%Y%m%d)/${package_name}-${lib_clean}.json"
    
    echo "  📊 Checking $lib usage..."
    importy --dir "$package/src" --lib "$lib" --output "$output_file"
    
    # Check if any imports were found
    if [ $? -eq 0 ]; then
      count=$(jq '.summary.componentsFound' "$output_file")
      echo "    ✅ Found $count components"
    elif [ $? -eq 4 ]; then
      echo "    ⚠️  No imports found"
      rm "$output_file"  # Clean up empty results
    else
      echo "    ❌ Analysis failed"
    fi
  done
done

echo "📈 Generating summary report..."
node generate-summary.js
```

### Cross-Package Dependency Analysis

```bash
# Check if packages are using each other
for package in "${packages[@]}"; do
  for other_package in "${packages[@]}"; do
    if [ "$package" != "$other_package" ]; then
      package_name=$(basename "$other_package")
      echo "🔗 Checking if $package imports from $package_name..."
      
      # Look for relative imports to other packages
      importy --dir "$package/src" --lib "../$package_name" \
        --output "cross-deps-$(basename $package)-to-$package_name.json"
    fi
  done
done
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Dependency Analysis

on:
  pull_request:
    paths:
      - 'src/**'
      - 'packages/**'
  push:
    branches: [main]

jobs:
  analyze-dependencies:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Importy
        run: npm install -g importy
        
      - name: Analyze React usage
        run: |
          importy --dir ./src --lib react \
            --output analysis-react.json \
            --exclude "**/*.test.*" \
            --exclude "**/*.stories.*"
            
      - name: Analyze bundle dependencies
        run: |
          # Check heavy dependencies
          for lib in lodash moment @mui/material; do
            echo "Analyzing $lib..."
            importy --dir ./src --lib "$lib" \
              --output "analysis-${lib//\//-}.json"
          done
          
      - name: Generate dependency report
        run: |
          node scripts/generate-dep-report.js
          
      - name: Check for unused dependencies
        run: |
          # Compare package.json deps with actual usage
          node scripts/check-unused-deps.js
          
      - name: Upload analysis results
        uses: actions/upload-artifact@v3
        with:
          name: dependency-analysis
          path: analysis-*.json
          
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const analysis = JSON.parse(fs.readFileSync('analysis-react.json', 'utf8'));
            
            const comment = `## 📊 Dependency Analysis
            
            **React Usage:**
            - Components found: ${analysis.summary.componentsFound}
            - Total imports: ${analysis.summary.totalImports}
            - Files scanned: ${analysis.summary.filesScanned}
            
            **Most used hooks:**
            ${Object.entries(analysis.components)
              .sort((a, b) => b[1].length - a[1].length)
              .slice(0, 5)
              .map(([name, files]) => `- \`${name}\`: ${files.length} files`)
              .join('\n')}
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### Bundle Size Optimization

```bash
#!/bin/bash

# Analyze current bundle dependencies
echo "📦 Analyzing current dependencies..."

# Heavy libraries to check
heavy_libs=(
  "lodash"
  "moment" 
  "date-fns"
  "@mui/material"
  "@mui/icons-material"
  "rxjs"
  "ramda"
)

for lib in "${heavy_libs[@]}"; do
  echo "🔍 Analyzing $lib usage..."
  
  importy --dir ./src --lib "$lib" \
    --output "bundle-analysis-${lib//\//-}.json" \
    --exclude "**/*.test.*"
    
  if [ $? -eq 0 ]; then
    # Get usage statistics
    components=$(jq '.summary.componentsFound' "bundle-analysis-${lib//\//-}.json")
    files=$(jq '.summary.filesScanned' "bundle-analysis-${lib//\//-}.json")
    
    echo "  📊 $components components used across $files files"
    
    # Show top used components
    echo "  🔥 Most used:"
    jq -r '.components | to_entries | map({key: .key, count: (.value | length)}) | sort_by(.count) | reverse | .[0:3] | .[] | "    \(.key): \(.count) files"' \
      "bundle-analysis-${lib//\//-}.json"
      
    # Check for single-use imports (potential for tree-shaking)
    echo "  🌲 Single-use imports (tree-shaking candidates):"
    jq -r '.components | to_entries | map(select(.value | length == 1)) | .[0:5] | .[] | "    \(.key)"' \
      "bundle-analysis-${lib//\//-}.json"
  else
    echo "  ✅ Not used in codebase"
  fi
  
  echo ""
done

# Generate optimization suggestions
echo "💡 Optimization suggestions:"
echo "1. Consider replacing moment with date-fns for smaller bundle"
echo "2. Use specific lodash imports instead of full library"
echo "3. Import only needed MUI components"
echo "4. Check if single-use imports can be replaced with native alternatives"
```

## Migration Planning

### Library Migration Analysis

```bash
#!/bin/bash

# Example: Migrating from moment to date-fns
echo "📅 Analyzing date library migration..."

# Current moment usage
echo "🔍 Current moment.js usage:"
importy --dir ./src --lib moment --output moment-current.json

if [ $? -eq 0 ]; then
  echo "📊 Moment.js statistics:"
  jq '.summary' moment-current.json
  
  echo "🔥 Most used moment functions:"
  jq -r '.components | to_entries | map({key: .key, count: (.value | length)}) | sort_by(.count) | reverse | .[0:10] | .[] | "  \(.key): \(.count) files"' \
    moment-current.json
fi

# Check current date-fns usage
echo "🔍 Current date-fns usage:"
importy --dir ./src --lib date-fns --output date-fns-current.json

# Migration complexity analysis
echo "📋 Migration complexity analysis:"

# Create migration mapping
cat > migration-plan.md << 'EOF'
# Moment to Date-fns Migration Plan

## Current Usage Analysis

### Moment.js Functions Found:
EOF

# Append moment usage to plan
if [ -f moment-current.json ]; then
  echo "| Function | Files | Migration Notes |" >> migration-plan.md
  echo "|----------|-------|-----------------|" >> migration-plan.md
  
  jq -r '.components | to_entries | .[] | "| `\(.key)` | \(.value | length) | TODO: Check date-fns equivalent |"' \
    moment-current.json >> migration-plan.md
fi

echo "📝 Migration plan generated: migration-plan.md"
```

### Version Upgrade Impact Analysis

```bash
#!/bin/bash

# Before upgrade: analyze current usage
echo "📊 Pre-upgrade analysis..."

libraries_to_check=("react" "@mui/material" "lodash")

for lib in "${libraries_to_check[@]}"; do
  importy --dir ./src --lib "$lib" \
    --output "pre-upgrade-${lib//\//-}.json"
done

# After upgrade (run this after updating packages)
echo "📈 Post-upgrade analysis..."

for lib in "${libraries_to_check[@]}"; do
  importy --dir ./src --lib "$lib" \
    --output "post-upgrade-${lib//\//-}.json"
    
  # Compare with pre-upgrade
  if [ -f "pre-upgrade-${lib//\//-}.json" ]; then
    echo "🔍 Comparing $lib usage before/after upgrade..."
    
    pre_count=$(jq '.summary.componentsFound' "pre-upgrade-${lib//\//-}.json")
    post_count=$(jq '.summary.componentsFound' "post-upgrade-${lib//\//-}.json")
    
    echo "  Components: $pre_count → $post_count"
    
    # Check for new/removed components
    jq -r '.components | keys[]' "pre-upgrade-${lib//\//-}.json" > "pre-components-${lib//\//-}.txt"
    jq -r '.components | keys[]' "post-upgrade-${lib//\//-}.json" > "post-components-${lib//\//-}.txt"
    
    echo "  New components:"
    comm -13 "pre-components-${lib//\//-}.txt" "post-components-${lib//\//-}.txt" | head -5
    
    echo "  Removed components:"
    comm -23 "pre-components-${lib//\//-}.txt" "post-components-${lib//\//-}.txt" | head -5
  fi
done
```

## Performance Analysis

### Large Codebase Optimization

```bash
#!/bin/bash

# For very large codebases (10,000+ files)
echo "🚀 Optimized analysis for large codebase..."

# Process in chunks to manage memory
directories=(
  "src/components"
  "src/pages" 
  "src/utils"
  "src/hooks"
  "src/services"
)

libraries=("react" "lodash" "@mui/material")

# Create results directory
mkdir -p analysis-chunks

for dir in "${directories[@]}"; do
  if [ -d "$dir" ]; then
    dir_name=$(basename "$dir")
    echo "📁 Processing $dir..."
    
    for lib in "${libraries[@]}"; do
      echo "  🔍 Analyzing $lib in $dir_name..."
      
      # Use optimal settings for large directories
      importy --dir "$dir" --lib "$lib" \
        --concurrency 2 \
        --exclude "**/*.test.*" \
        --exclude "**/*.stories.*" \
        --exclude "**/*.spec.*" \
        --output "analysis-chunks/${dir_name}-${lib//\//-}.json"
    done
  fi
done

echo "🔗 Merging chunk results..."
node scripts/merge-analysis-chunks.js
```

### Benchmark Different Concurrency Levels

```bash
#!/bin/bash

echo "⚡ Benchmarking concurrency levels..."

concurrency_levels=(1 2 4 8)
test_dir="./src"
test_lib="react"

for concurrency in "${concurrency_levels[@]}"; do
  echo "🧪 Testing concurrency: $concurrency"
  
  # Run multiple times and average
  total_time=0
  runs=3
  
  for run in $(seq 1 $runs); do
    start_time=$(date +%s%N)
    
    importy --dir "$test_dir" --lib "$test_lib" \
      --concurrency "$concurrency" \
      --output "/tmp/benchmark-$concurrency-$run.json" \
      > /dev/null 2>&1
      
    end_time=$(date +%s%N)
    run_time=$(( (end_time - start_time) / 1000000 ))  # Convert to milliseconds
    total_time=$(( total_time + run_time ))
    
    echo "  Run $run: ${run_time}ms"
  done
  
  avg_time=$(( total_time / runs ))
  echo "  📊 Average: ${avg_time}ms"
  echo ""
done
```

## Custom Reporting

### HTML Report Generation

```javascript
// generate-html-report.js
const fs = require('fs');
const path = require('path');

async function generateHTMLReport() {
  const analysisFiles = fs.readdirSync('./analysis')
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const content = JSON.parse(fs.readFileSync(path.join('./analysis', file), 'utf8'));
      return { filename: file, ...content };
    });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Dependency Analysis Report</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .library-section { margin-bottom: 40px; border: 1px solid #ddd; padding: 20px; }
    .component-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .component-card { background: #f5f5f5; padding: 15px; border-radius: 5px; }
    .usage-chart { width: 100%; height: 400px; }
  </style>
</head>
<body>
  <h1>📊 Dependency Analysis Report</h1>
  <p>Generated on: ${new Date().toISOString()}</p>
  
  ${analysisFiles.map(analysis => `
    <div class="library-section">
      <h2>📦 ${analysis.summary.library}</h2>
      <div class="stats">
        <p><strong>Components Found:</strong> ${analysis.summary.componentsFound}</p>
        <p><strong>Total Imports:</strong> ${analysis.summary.totalImports}</p>
        <p><strong>Files Scanned:</strong> ${analysis.summary.filesScanned}</p>
      </div>
      
      <h3>🔥 Most Used Components</h3>
      <div class="component-grid">
        ${Object.entries(analysis.components)
          .sort((a, b) => b[1].length - a[1].length)
          .slice(0, 6)
          .map(([name, files]) => `
            <div class="component-card">
              <h4>${name}</h4>
              <p><strong>${files.length} files</strong></p>
              <details>
                <summary>Show files</summary>
                <ul>
                  ${files.map(file => `<li>${file}</li>`).join('')}
                </ul>
              </details>
            </div>
          `).join('')}
      </div>
    </div>
  `).join('')}
  
  <script>
    // Add interactive charts here
    const chartData = ${JSON.stringify(analysisFiles.map(a => ({
      library: a.summary.library,
      components: a.summary.componentsFound,
      imports: a.summary.totalImports
    })))};
    
    // Component usage chart
    const ctx = document.createElement('canvas');
    ctx.className = 'usage-chart';
    document.body.appendChild(ctx);
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.map(d => d.library),
        datasets: [{
          label: 'Components Found',
          data: chartData.map(d => d.components),
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }, {
          label: 'Total Imports', 
          data: chartData.map(d => d.imports),
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Library Usage Comparison'
          }
        }
      }
    });
  </script>
</body>
</html>
  `;

  fs.writeFileSync('./analysis/report.html', html);
  console.log('📄 HTML report generated: ./analysis/report.html');
}

generateHTMLReport();
```

### CSV Export for Spreadsheet Analysis

```bash
#!/bin/bash

echo "📊 Generating CSV reports..."

# Create CSV header
echo "Library,Component,FileCount,Files" > import-analysis.csv

# Process each analysis file
for analysis_file in analysis/*.json; do
  if [ -f "$analysis_file" ]; then
    library=$(jq -r '.summary.library' "$analysis_file")
    
    # Extract component data to CSV
    jq -r --arg lib "$library" '.components | to_entries[] | [$lib, .key, (.value | length), (.value | join(";")), ] | @csv' \
      "$analysis_file" >> import-analysis.csv
  fi
done

echo "📈 CSV report generated: import-analysis.csv"

# Generate summary CSV
echo "Library,ComponentsFound,TotalImports,FilesScanned" > summary.csv

for analysis_file in analysis/*.json; do
  if [ -f "$analysis_file" ]; then
    jq -r '.summary | [.library, .componentsFound, .totalImports, .filesScanned] | @csv' \
      "$analysis_file" >> summary.csv
  fi
done

echo "📋 Summary CSV generated: summary.csv"
```

## Integration with Other Tools

### ESLint Integration

```javascript
// eslint-plugin-importy.js
// Custom ESLint rule based on Importy analysis

const fs = require('fs');
const path = require('path');

module.exports = {
  rules: {
    'no-heavy-imports': {
      type: 'suggestion',
      docs: {
        description: 'Warn about importing heavy libraries',
        category: 'Best Practices'
      },
      schema: [{
        type: 'object',
        properties: {
          heavyLibraries: {
            type: 'array',
            items: { type: 'string' }
          },
          analysisPath: { type: 'string' }
        }
      }]
    }
  },
  
  create(context) {
    const options = context.options[0] || {};
    const heavyLibraries = options.heavyLibraries || ['lodash', 'moment'];
    const analysisPath = options.analysisPath || './analysis';
    
    // Load Importy analysis results
    const analysisData = {};
    try {
      const files = fs.readdirSync(analysisPath);
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const data = JSON.parse(fs.readFileSync(path.join(analysisPath, file)));
          analysisData[data.summary.library] = data;
        }
      });
    } catch (error) {
      // Analysis not available
    }
    
    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        
        if (heavyLibraries.includes(source)) {
          const analysis = analysisData[source];
          if (analysis) {
            const usage = analysis.summary.componentsFound;
            context.report({
              node,
              message: `Heavy library '${source}' imported (${usage} components used project-wide). Consider importing specific modules.`
            });
          }
        }
      }
    };
  }
};
```

### Webpack Bundle Analyzer Integration

```javascript
// webpack-importy-plugin.js
const { spawn } = require('child_process');

class ImportyAnalyzerPlugin {
  constructor(options = {}) {
    this.options = {
      libraries: ['react', 'lodash', '@mui/material'],
      outputPath: './webpack-analysis',
      ...options
    };
  }
  
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('ImportyAnalyzerPlugin', (compilation, callback) => {
      console.log('🔍 Running Importy analysis...');
      
      const promises = this.options.libraries.map(lib => {
        return new Promise((resolve, reject) => {
          const outputFile = `${this.options.outputPath}/${lib.replace('/', '-')}.json`;
          
          const importy = spawn('importy', [
            '--dir', './src',
            '--lib', lib,
            '--output', outputFile
          ]);
          
          importy.on('close', (code) => {
            if (code === 0 || code === 4) { // Success or no files found
              resolve({ lib, outputFile });
            } else {
              reject(new Error(`Importy failed for ${lib} with code ${code}`));
            }
          });
        });
      });
      
      Promise.all(promises)
        .then(results => {
          console.log('✅ Importy analysis complete');
          results.forEach(({ lib, outputFile }) => {
            console.log(`📊 ${lib}: ${outputFile}`);
          });
          callback();
        })
        .catch(error => {
          console.error('❌ Importy analysis failed:', error);
          callback();
        });
    });
  }
}

module.exports = ImportyAnalyzerPlugin;
```

## Next Steps

- 🔧 Learn about [Performance Optimization](/guide/performance)
- 🚀 Set up [CI/CD Integration](/guide/ci-cd) 
- 📖 Check the [API Reference](/api/cli) for all available options
- 🐛 Report issues on [GitHub](https://github.com/tvshevchuk/Importy/issues)