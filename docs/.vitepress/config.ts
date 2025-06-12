import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Importy",
  description:
    "A powerful CLI tool for analyzing JavaScript/TypeScript imports from libraries. Perfect for dependency auditing, bundle optimization, and migration planning.",

  // SEO configuration
  lang: "en-US",
  cleanUrls: true,
  metaChunk: true,

  // GitHub Pages deployment
  base: "/Importy/",

  // Ignore dead links temporarily
  ignoreDeadLinks: true,

  // Sitemap generation
  sitemap: {
    hostname: "https://tvshevchuk.github.io/Importy/",
  },

  // Theme configuration
  themeConfig: {
    // Site logo
    logo: "/importy.png",

    // Navigation
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "API Reference", link: "/api/cli" },
      { text: "Examples", link: "/examples/basic-usage" },
      {
        text: "v0.1.1",
        items: [
          { text: "Changelog", link: "/changelog" },
          { text: "Contributing", link: "/contributing" },
        ],
      },
    ],

    // Sidebar configuration
    sidebar: {
      "/guide/": [
        {
          text: "Getting Started",
          collapsed: false,
          items: [
            { text: "Installation", link: "/guide/installation" },
            { text: "Quick Start", link: "/guide/getting-started" },
            { text: "Configuration", link: "/guide/configuration" },
          ],
        },
        {
          text: "Advanced",
          collapsed: false,
          items: [
            { text: "Performance", link: "/guide/performance" },
            { text: "CI/CD Integration", link: "/guide/ci-cd" },
            { text: "Troubleshooting", link: "/guide/troubleshooting" },
          ],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          collapsed: false,
          items: [
            { text: "CLI Commands", link: "/api/cli" },
            { text: "Output Format", link: "/api/output-format" },
            { text: "Exit Codes", link: "/api/exit-codes" },
          ],
        },
      ],
      "/examples/": [
        {
          text: "Examples",
          collapsed: false,
          items: [
            { text: "Basic Usage", link: "/examples/basic-usage" },
            { text: "Advanced Usage", link: "/examples/advanced-usage" },
            { text: "Real-world Scenarios", link: "/examples/real-world" },
          ],
        },
      ],
    },

    // Social links
    socialLinks: [
      { icon: "github", link: "https://github.com/tvshevchuk/Importy" },
      { icon: "npm", link: "https://www.npmjs.com/package/importy" },
    ],

    // Footer
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025 Taras Shevchuk",
    },

    // Edit link
    editLink: {
      pattern: "https://github.com/tvshevchuk/Importy/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    // Last updated
    lastUpdated: {
      text: "Last updated",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium",
      },
    },

    // Search
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "Search Importy docs",
                buttonAriaLabel: "Search Importy documentation",
              },
              modal: {
                displayDetails: "Display detailed list",
                resetButtonTitle: "Reset search",
                backButtonTitle: "Close search",
                noResultsText: "No results for",
                footer: {
                  selectText: "to select",
                  selectKeyAriaLabel: "enter",
                  navigateText: "to navigate",
                  navigateUpKeyAriaLabel: "up arrow",
                  navigateDownKeyAriaLabel: "down arrow",
                  closeText: "to close",
                  closeKeyAriaLabel: "escape",
                },
              },
            },
          },
        },
      },
    },

    // Outline
    outline: {
      level: [2, 3],
    },
  },

  // Markdown configuration
  markdown: {
    theme: "github-dark",
    lineNumbers: true,
  },

  // Head configuration for SEO
  head: [
    // Favicon and icons
    ["link", { rel: "icon", href: "/Importy/favicon.ico" }],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/Importy/importy.png",
      },
    ],

    // Theme and viewport
    ["meta", { name: "theme-color", content: "#3c82f6" }],
    [
      "meta",
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    ],

    // SEO meta tags
    [
      "meta",
      {
        name: "keywords",
        content:
          "javascript, typescript, import analyzer, cli tool, dependency analysis, bundle optimization, react imports, lodash analysis, code analysis, developer tools",
      },
    ],
    ["meta", { name: "author", content: "Taras Shevchuk" }],
    ["meta", { name: "robots", content: "index, follow" }],
    [
      "meta",
      {
        name: "googlebot",
        content:
          "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },
    ],

    // Open Graph meta tags
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "en_US" }],
    [
      "meta",
      {
        property: "og:title",
        content: "Importy | JavaScript/TypeScript Import Analyzer",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "A powerful CLI tool for analyzing JavaScript/TypeScript imports from libraries. Perfect for dependency auditing, bundle optimization, and migration planning.",
      },
    ],
    ["meta", { property: "og:site_name", content: "Importy" }],
    [
      "meta",
      {
        property: "og:image",
        content: "https://tvshevchuk.github.io/Importy/og-image.png",
      },
    ],
    ["meta", { property: "og:image:width", content: "1200" }],
    ["meta", { property: "og:image:height", content: "630" }],
    [
      "meta",
      {
        property: "og:image:alt",
        content: "Importy - JavaScript/TypeScript Import Analyzer",
      },
    ],
    [
      "meta",
      { property: "og:url", content: "https://tvshevchuk.github.io/Importy/" },
    ],

    // Twitter Card meta tags
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    [
      "meta",
      {
        name: "twitter:title",
        content: "Importy | JavaScript/TypeScript Import Analyzer",
      },
    ],
    [
      "meta",
      {
        name: "twitter:description",
        content:
          "A powerful CLI tool for analyzing JavaScript/TypeScript imports from libraries. Perfect for dependency auditing, bundle optimization, and migration planning.",
      },
    ],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://tvshevchuk.github.io/Importy/og-image.png",
      },
    ],
    [
      "meta",
      {
        name: "twitter:image:alt",
        content: "Importy - JavaScript/TypeScript Import Analyzer",
      },
    ],

    // Canonical URL
    [
      "link",
      { rel: "canonical", href: "https://tvshevchuk.github.io/Importy/" },
    ],

    // Structured data for software application
    [
      "script",
      { type: "application/ld+json" },
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Importy",
        description:
          "A powerful CLI tool for analyzing JavaScript/TypeScript imports from libraries",
        url: "https://tvshevchuk.github.io/Importy/",
        downloadUrl: "https://www.npmjs.com/package/importy",
        operatingSystem: ["Windows", "macOS", "Linux"],
        applicationCategory: "DeveloperApplication",
        author: {
          "@type": "Person",
          name: "Taras Shevchuk",
          url: "https://github.com/tvshevchuk",
        },
        programmingLanguage: ["JavaScript", "TypeScript"],
        softwareVersion: "0.1.1",
        datePublished: "2025-01-27",
        license: "https://github.com/tvshevchuk/Importy/blob/main/LICENSE",
        codeRepository: "https://github.com/tvshevchuk/Importy",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      }),
    ],

    // Performance hints
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "dns-prefetch", href: "https://api.github.com" }],
    ["link", { rel: "dns-prefetch", href: "https://registry.npmjs.org" }],
  ],
});
