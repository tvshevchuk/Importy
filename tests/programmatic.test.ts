import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeImports } from "../src/cli.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testDirPath = path.resolve(__dirname, "test-project");

// Mock console methods to reduce noise during tests
console.warn = vi.fn();
console.log = vi.fn();

describe("Importy Programmatic API", () => {
  // Create test directory and sample files before tests
  beforeEach(() => {
    // Create test directory structure
    if (!fs.existsSync(testDirPath)) {
      fs.mkdirSync(testDirPath, { recursive: true });
    }

    fs.mkdirSync(path.join(testDirPath, "src"), { recursive: true });
    fs.mkdirSync(path.join(testDirPath, "components"), { recursive: true });

    // Create sample files with various imports
    fs.writeFileSync(
      path.join(testDirPath, "src", "app.tsx"),
      `
      import React from 'react';
      import { Button, Card } from 'ui-library';
      import { useEffect } from 'react';

      function App() {
        return (
          <div>
            <Button>Click me</Button>
            <Card>Content</Card>
          </div>
        );
      }

      export default App;
      `,
    );

    fs.writeFileSync(
      path.join(testDirPath, "components", "header.tsx"),
      `
      import React from 'react';
      import { Navbar, Container } from 'ui-library';
      import { useState } from 'react';

      function Header() {
        return (
          <Navbar>
            <Container>Header content</Container>
          </Navbar>
        );
      }

      export default Header;
      `,
    );

    fs.writeFileSync(
      path.join(testDirPath, "components", "footer.tsx"),
      `
      import React from 'react';
      import { Container } from 'ui-library';

      function Footer() {
        return (
          <Container>Footer content</Container>
        );
      }

      export default Footer;
      `,
    );
  });

  // Clean up test directory after tests
  afterEach(() => {
    if (fs.existsSync(testDirPath)) {
      fs.rmSync(testDirPath, { recursive: true, force: true });
    }
  });

  it("should find all imports from ui-library", async () => {
    // Run analysis programmatically
    const result = await analyzeImports({
      dir: testDirPath,
      lib: "ui-library",
      verbose: false,
    });

    // Verify the results
    expect(result.summary).toBeDefined();
    expect(result.summary.library).toBe("ui-library");
    expect(result.summary.filesScanned).toBeGreaterThan(0);
    expect(result.components).toBeDefined();

    // Check that all components were found
    const components = result.components;
    expect(components.Button).toBeDefined();
    expect(components.Card).toBeDefined();
    expect(components.Navbar).toBeDefined();
    expect(components.Container).toBeDefined();

    // Check file counts
    expect(components.Button.length).toBe(1);
    expect(components.Card.length).toBe(1);
    expect(components.Navbar.length).toBe(1);
    expect(components.Container.length).toBe(2); // Used in two files

    // Verify the correct files are listed
    expect(components.Button[0]).toContain("app.tsx");
    expect(components.Card[0]).toContain("app.tsx");
    expect(components.Navbar[0]).toContain("header.tsx");
    expect(components.Container).toEqual(
      expect.arrayContaining([
        expect.stringContaining("header.tsx"),
        expect.stringContaining("footer.tsx"),
      ]),
    );
  });

  it("should handle files with syntax errors gracefully", async () => {
    // Create a file with syntax errors
    fs.writeFileSync(
      path.join(testDirPath, "src", "broken.tsx"),
      `
      import React from 'react';
      import { Modal } from 'ui-library'

      function Broken() {
        return (
          <Modal>
            This file has syntax errors
          </Modal
        );
      }
      `,
    );

    // Run analysis programmatically
    const result = await analyzeImports({
      dir: testDirPath,
      lib: "ui-library",
    });

    // Verify analysis didn't crash and still found other imports
    expect(result.components).toBeDefined();
    expect(result.summary).toBeDefined();
    expect(result.summary.filesScanned).toBeGreaterThan(0);

    // Check for components that should still be found
    expect(result.components.Button).toBeDefined();
    expect(result.components.Card).toBeDefined();
  });

  it("should handle filtering with include/exclude patterns", async () => {
    // Run analysis with include pattern (only src directory)
    const resultWithInclude = await analyzeImports({
      dir: testDirPath,
      lib: "ui-library",
      include: "**/src/**",
    });

    expect(resultWithInclude.components).toBeDefined();
    expect(resultWithInclude.summary).toBeDefined();

    // Should only find components from src directory (Button, Card from app.tsx)
    expect(resultWithInclude.components.Button).toBeDefined();
    expect(resultWithInclude.components.Card).toBeDefined();
    // Navbar and Container are only in components directory, so should not be found
    expect(resultWithInclude.components.Navbar).toBeUndefined();
    expect(resultWithInclude.components.Container).toBeUndefined();

    // Run analysis with exclude pattern (exclude components directory)
    const resultWithExclude = await analyzeImports({
      dir: testDirPath,
      lib: "ui-library",
      exclude: "**/components/**",
    });

    expect(resultWithExclude.components).toBeDefined();
    expect(resultWithExclude.summary).toBeDefined();

    // Should find Button and Card from src/app.tsx
    expect(resultWithExclude.components.Button).toBeDefined();
    expect(resultWithExclude.components.Card).toBeDefined();
    // Should not find Navbar and Container (only in components directory)
    expect(resultWithExclude.components.Navbar).toBeUndefined();
    expect(resultWithExclude.components.Container).toBeUndefined();
  });
});
