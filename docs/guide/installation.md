# Installation

Get Importy installed and running on your system in just a few steps.

## System Requirements

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (or equivalent pnpm/yarn)
- **Operating System**: Windows, macOS, or Linux

## Global Installation (Recommended)

Install Importy globally to use it from anywhere in your terminal:

```bash
# Using npm
npm install -g importy

# Using yarn
yarn global add importy

# Using pnpm
pnpm add -g importy
```

### Verify Installation

After installation, verify that Importy is working correctly:

```bash
# Check version
importy --version
# Should output: 0.1.1

# Display help
importy --help
```

## Local Installation

If you prefer to install Importy locally in your project:

```bash
# Using npm
npm install --save-dev importy

# Using yarn
yarn add --dev importy

# Using pnpm
pnpm add --save-dev importy
```

Then run it using npx:

```bash
npx importy --dir ./src --lib react
```

Or add it to your package.json scripts:

```json
{
  "scripts": {
    "analyze": "importy --dir ./src --lib react",
    "analyze-lodash": "importy --dir ./src --lib lodash --verbose"
  }
}
```

## Alternative Installation Methods

### Using npx (No Installation)

Run Importy without installing it permanently:

```bash
npx importy --dir ./src --lib react
```

This downloads and runs the latest version of Importy without installing it globally.

### Docker Installation

If you prefer using Docker:

```bash
# Pull the image (when available)
docker pull importy/cli

# Run analysis
docker run --rm -v $(pwd):/workspace importy/cli --dir /workspace/src --lib react
```

## Troubleshooting Installation

### Permission Issues (macOS/Linux)

If you encounter permission errors during global installation:

```bash
# Option 1: Use sudo (not recommended)
sudo npm install -g importy

# Option 2: Configure npm to use a different directory (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g importy
```

### Windows Installation Issues

If you encounter issues on Windows:

1. Run your terminal as Administrator
2. Or use a package manager like Chocolatey:

```powershell
# Install Node.js via Chocolatey
choco install nodejs

# Then install Importy
npm install -g importy
```

### Node.js Version Issues

If you're using an older version of Node.js:

```bash
# Check your Node.js version
node --version

# If less than 18.0.0, update Node.js
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from https://nodejs.org
```

### Package Manager Issues

If npm is slow or having issues, try using pnpm:

```bash
# Install pnpm
npm install -g pnpm

# Install Importy with pnpm
pnpm add -g importy
```

## Updating Importy

Keep Importy up to date to get the latest features and bug fixes:

```bash
# Check current version
importy --version

# Update to latest version
npm update -g importy

# Or reinstall
npm uninstall -g importy
npm install -g importy
```

## Uninstalling

If you need to remove Importy:

```bash
# Global uninstall
npm uninstall -g importy

# Local uninstall
npm uninstall importy
```

## Next Steps

Once Importy is installed:

1. 📖 Follow the [Getting Started](/guide/getting-started) guide
2. 🔧 Learn about [Configuration](/guide/configuration) options
3. 💡 Check out [Examples](/examples/basic-usage) for common use cases

## Getting Help

If you encounter any installation issues:

- 📖 Check our [Troubleshooting Guide](/guide/troubleshooting)
- 🐛 [Report an Issue](https://github.com/tvshevchuk/Importy/issues)
- 💬 [Ask for Help](https://github.com/tvshevchuk/Importy/discussions)