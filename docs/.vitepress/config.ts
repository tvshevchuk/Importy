import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Importy',
  description: 'A powerful CLI tool for analyzing JavaScript/TypeScript imports from libraries',
  
  // GitHub Pages deployment
  base: '/Importy/',
  
  // Ignore dead links temporarily
  ignoreDeadLinks: true,
  
  // Theme configuration
  themeConfig: {
    // Site logo
    logo: '/importy.png',
    
    // Navigation
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API Reference', link: '/api/cli' },
      { text: 'Examples', link: '/examples/basic-usage' },
      { 
        text: 'v0.1.1',
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'Contributing', link: '/contributing' }
        ]
      }
    ],

    // Sidebar configuration
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/getting-started' },
            { text: 'Configuration', link: '/guide/configuration' }
          ]
        },
        {
          text: 'Advanced',
          collapsed: false,
          items: [
            { text: 'Performance', link: '/guide/performance' },
            { text: 'CI/CD Integration', link: '/guide/ci-cd' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          collapsed: false,
          items: [
            { text: 'CLI Commands', link: '/api/cli' },
            { text: 'Output Format', link: '/api/output-format' },
            { text: 'Exit Codes', link: '/api/exit-codes' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          collapsed: false,
          items: [
            { text: 'Basic Usage', link: '/examples/basic-usage' },
            { text: 'Advanced Usage', link: '/examples/advanced-usage' },
            { text: 'Real-world Scenarios', link: '/examples/real-world' }
          ]
        }
      ]
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/tvshevchuk/Importy' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/importy' }
    ],

    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Taras Shevchuk'
    },

    // Edit link
    editLink: {
      pattern: 'https://github.com/tvshevchuk/Importy/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    // Last updated
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // Search
    search: {
      provider: 'local'
    },

    // Outline
    outline: {
      level: [2, 3]
    }
  },

  // Markdown configuration
  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  },

  // Head configuration
  head: [
    ['link', { rel: 'icon', href: '/Importy/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c82f6' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Importy | JavaScript/TypeScript Import Analyzer' }],
    ['meta', { property: 'og:site_name', content: 'Importy' }],
    ['meta', { property: 'og:image', content: 'https://tvshevchuk.github.io/Importy/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://tvshevchuk.github.io/Importy/' }]
  ]
})