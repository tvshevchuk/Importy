#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Automated sitemap generation script for Importy documentation
 * This script scans the docs directory and generates an updated sitemap.xml
 */

const BASE_URL = 'https://tvshevchuk.github.io/Importy/';
const DOCS_DIR = path.join(__dirname, '../docs');
const OUTPUT_PATH = path.join(DOCS_DIR, 'public/sitemap.xml');

// Priority mapping for different page types
const PRIORITY_MAP = {
  '/': 1.0,
  '/guide/getting-started': 0.9,
  '/guide/installation': 0.9,
  '/api/cli': 0.8,
  '/examples/basic-usage': 0.8,
  '/guide/': 0.7,
  '/api/': 0.7,
  '/examples/': 0.7,
  '/changelog': 0.6,
  '/contributing': 0.5
};

// Change frequency mapping
const CHANGEFREQ_MAP = {
  '/': 'weekly',
  '/changelog': 'weekly',
  '/guide/': 'monthly',
  '/api/': 'monthly',
  '/examples/': 'monthly',
  '/contributing': 'monthly'
};

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function getPriority(url) {
  // Check for exact matches first
  if (PRIORITY_MAP[url]) {
    return PRIORITY_MAP[url];
  }

  // Check for partial matches
  for (const pattern in PRIORITY_MAP) {
    if (url.startsWith(pattern) && pattern !== '/') {
      return PRIORITY_MAP[pattern];
    }
  }

  return 0.5; // default priority
}

function getChangeFreq(url) {
  // Check for exact matches first
  if (CHANGEFREQ_MAP[url]) {
    return CHANGEFREQ_MAP[url];
  }

  // Check for partial matches
  for (const pattern in CHANGEFREQ_MAP) {
    if (url.startsWith(pattern) && pattern !== '/') {
      return CHANGEFREQ_MAP[pattern];
    }
  }

  return 'monthly'; // default change frequency
}

function findMarkdownFiles() {
  const patterns = [
    path.join(DOCS_DIR, '*.md'),
    path.join(DOCS_DIR, 'guide/**/*.md'),
    path.join(DOCS_DIR, 'api/**/*.md'),
    path.join(DOCS_DIR, 'examples/**/*.md')
  ];

  let files = [];
  patterns.forEach(pattern => {
    const matches = glob.sync(pattern);
    files = files.concat(matches);
  });

  return files;
}

function markdownPathToUrl(filePath) {
  const relativePath = path.relative(DOCS_DIR, filePath);
  let url = relativePath.replace(/\.md$/, '');

  // Handle index files
  if (url === 'index' || url.endsWith('/index')) {
    url = url.replace(/\/index$/, '') || '/';
  }

  // Ensure URL starts with /
  if (!url.startsWith('/')) {
    url = '/' + url;
  }

  // Remove trailing slash except for root
  if (url !== '/' && url.endsWith('/')) {
    url = url.slice(0, -1);
  }

  return url;
}

function generateSitemap() {
  console.log('🔍 Scanning for markdown files...');
  const markdownFiles = findMarkdownFiles();

  const urls = markdownFiles
    .map(filePath => {
      const url = markdownPathToUrl(filePath);
      const priority = getPriority(url);
      const changefreq = getChangeFreq(url);
      const lastmod = getCurrentDate();

      return {
        url,
        priority,
        changefreq,
        lastmod,
        fullUrl: BASE_URL.replace(/\/$/, '') + url
      };
    })
    .filter(entry => entry.url) // Remove any invalid URLs
    .sort((a, b) => b.priority - a.priority); // Sort by priority descending

  console.log(`📄 Found ${urls.length} pages to include in sitemap`);

  // Generate XML
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

  const xmlFooter = `
</urlset>`;

  const urlEntries = urls.map(entry => `
    <url>
        <loc>${entry.fullUrl}</loc>
        <lastmod>${entry.lastmod}</lastmod>
        <changefreq>${entry.changefreq}</changefreq>
        <priority>${entry.priority.toFixed(1)}</priority>
    </url>`).join('');

  const xmlContent = xmlHeader + urlEntries + xmlFooter;

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write sitemap
  fs.writeFileSync(OUTPUT_PATH, xmlContent, 'utf8');

  console.log('✅ Sitemap generated successfully!');
  console.log(`📍 Location: ${OUTPUT_PATH}`);
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log('\n📊 Summary:');

  // Show summary by section
  const sections = {
    'Homepage': urls.filter(u => u.url === '/'),
    'Guide': urls.filter(u => u.url.startsWith('/guide')),
    'API Reference': urls.filter(u => u.url.startsWith('/api')),
    'Examples': urls.filter(u => u.url.startsWith('/examples')),
    'Other': urls.filter(u => !u.url.startsWith('/guide') && !u.url.startsWith('/api') && !u.url.startsWith('/examples') && u.url !== '/')
  };

  Object.entries(sections).forEach(([section, sectionUrls]) => {
    if (sectionUrls.length > 0) {
      console.log(`   ${section}: ${sectionUrls.length} pages`);
    }
  });

  return urls;
}

function validateSitemap() {
  console.log('\n🔍 Validating generated sitemap...');

  try {
    const content = fs.readFileSync(OUTPUT_PATH, 'utf8');

    // Basic XML validation
    if (!content.includes('<?xml') || !content.includes('<urlset')) {
      throw new Error('Invalid XML structure');
    }

    // Count URLs
    const urlCount = (content.match(/<loc>/g) || []).length;
    console.log(`✅ Sitemap validation passed - ${urlCount} URLs found`);

    return true;
  } catch (error) {
    console.error('❌ Sitemap validation failed:', error.message);
    return false;
  }
}

// Main execution
if (require.main === module) {
  console.log('🚀 Starting sitemap generation for Importy documentation\n');

  try {
    const urls = generateSitemap();
    const isValid = validateSitemap();

    if (isValid) {
      console.log('\n🎉 Sitemap generation completed successfully!');
      console.log('💡 Tip: Add this script to your build process to keep the sitemap updated');
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = {
  generateSitemap,
  validateSitemap
};
