// .vitepress/theme/index.ts
import { h, onMounted } from "vue";
import DefaultTheme from "vitepress/theme";
import "./custom.css";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    // Add performance optimizations
    if (typeof window !== "undefined") {
      // Preload critical resources
      const preloadResource = (href: string, as: string) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.href = href;
        link.as = as;
        document.head.appendChild(link);
      };

      // Preload important assets
      onMounted(() => {
        preloadResource("/Importy/importy.png", "image");
        preloadResource("/Importy/improved-demo-small.gif", "image");
      });

      // Add structured data for search engines
      const addStructuredData = () => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Importy Documentation",
          url: "https://tvshevchuk.github.io/Importy/",
          description:
            "Documentation for Importy - A powerful CLI tool for analyzing JavaScript/TypeScript imports from libraries",
          inLanguage: "en-US",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://tvshevchuk.github.io/Importy/?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        });
        document.head.appendChild(script);
      };

      // Add breadcrumb structured data
      router.onAfterRouteChanged = (to) => {
        // Remove existing breadcrumb script
        const existingScript = document.querySelector(
          "script[data-breadcrumb]",
        );
        if (existingScript) {
          existingScript.remove();
        }

        // Generate breadcrumb data based on route
        const pathSegments = to.split("/").filter(Boolean);
        if (pathSegments.length > 0) {
          const breadcrumbItems = [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://tvshevchuk.github.io/Importy/",
            },
          ];

          pathSegments.forEach((segment, index) => {
            const position = index + 2;
            const name =
              segment.charAt(0).toUpperCase() +
              segment.slice(1).replace(/-/g, " ");
            const item = `https://tvshevchuk.github.io/Importy/${pathSegments.slice(0, index + 1).join("/")}`;

            breadcrumbItems.push({
              "@type": "ListItem",
              position: position,
              name: name,
              item: item,
            });
          });

          const breadcrumbScript = document.createElement("script");
          breadcrumbScript.type = "application/ld+json";
          breadcrumbScript.setAttribute("data-breadcrumb", "true");
          breadcrumbScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbItems,
          });
          document.head.appendChild(breadcrumbScript);
        }
      };

      // Add website structured data on initial load
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addStructuredData);
      } else {
        addStructuredData();
      }
    }
  },
};
