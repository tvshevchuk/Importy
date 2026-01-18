import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(__dirname, '../src/index.ts');
let testDirPath: string;

// Mock console methods to reduce noise during tests
console.warn = vi.fn();
console.log = vi.fn();

describe('Importy CLI', () => {
  // Create test directory and sample files before tests
  beforeEach(() => {
    // Create unique test directory for each test
    testDirPath = path.resolve(__dirname, `test-project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    
    // Create test directory structure
    fs.mkdirSync(testDirPath, { recursive: true });
    fs.mkdirSync(path.join(testDirPath, 'src'), { recursive: true });
    fs.mkdirSync(path.join(testDirPath, 'components'), { recursive: true });
    
    // Create sample files with various imports
    fs.writeFileSync(
      path.join(testDirPath, 'src', 'app.tsx'),
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
      `
    );
    
    fs.writeFileSync(
      path.join(testDirPath, 'components', 'header.tsx'),
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
      `
    );
    
    fs.writeFileSync(
      path.join(testDirPath, 'components', 'footer.tsx'),
      `
      import React from 'react';
      import { Container } from 'ui-library';
      
      function Footer() {
        return (
          <Container>Footer content</Container>
        );
      }
      
      export default Footer;
      `
    );
  });
  
  // Clean up test directory after tests
  afterEach(() => {
    if (fs.existsSync(testDirPath)) {
      fs.rmSync(testDirPath, { recursive: true, force: true });
    }
  });
  
  it('should find all imports from ui-library', { timeout: 15000 }, () => {
    // Ensure test directory exists before running CLI
    expect(fs.existsSync(testDirPath)).toBe(true);
    expect(fs.existsSync(path.join(testDirPath, 'src'))).toBe(true);
    expect(fs.existsSync(path.join(testDirPath, 'components'))).toBe(true);
    
    // Wait a bit to ensure filesystem operations are complete
    const start = Date.now();
    while (!fs.existsSync(path.join(testDirPath, 'src', 'app.tsx')) && Date.now() - start < 1000) {
      // Wait for file system to be ready
    }
    
    // Run the CLI command
    const result = execFileSync(
          'node',
          ['--no-warnings', '--loader', 'ts-node/esm', cliPath, '--dir', testDirPath, '--lib', 'ui-library'],
          { encoding: 'utf8', cwd: __dirname }
        );
    
    // Parse the JSON output
    const output = JSON.parse(result);
    
    // Verify the results
    expect(output.summary).toBeDefined();
    expect(output.summary.library).toBe('ui-library');
    expect(output.summary.filesScanned).toBeGreaterThan(0);
    expect(output.components).toBeDefined();
    
    // Check that all components were found
    const components = output.components;
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
    expect(components.Button[0]).toContain('app.tsx');
    expect(components.Card[0]).toContain('app.tsx');
    expect(components.Navbar[0]).toContain('header.tsx');
    expect(components.Container).toEqual(
      expect.arrayContaining([
        expect.stringContaining('header.tsx'),
        expect.stringContaining('footer.tsx')
      ])
    );
  });
  
  it('should handle files with syntax errors gracefully', { timeout: 15000 }, () => {
    // Ensure test directory exists
    expect(fs.existsSync(testDirPath)).toBe(true);
    
    // Create a file with syntax errors
    fs.writeFileSync(
      path.join(testDirPath, 'src', 'broken.tsx'),
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
      `
    );
    
    // Verify the broken file was created
    expect(fs.existsSync(path.join(testDirPath, 'src', 'broken.tsx'))).toBe(true);
    
    // Wait a bit to ensure filesystem operations are complete
    const start = Date.now();
    while (!fs.existsSync(path.join(testDirPath, 'src', 'broken.tsx')) && Date.now() - start < 1000) {
      // Wait for file system to be ready
    }
    
    // Run the CLI command
    const result = execFileSync(
          'node',
          ['--no-warnings', '--loader', 'ts-node/esm', cliPath, '--dir', testDirPath, '--lib', 'ui-library'],
          { encoding: 'utf8', cwd: __dirname }
        );
    
    // Parse the JSON output
    const output = JSON.parse(result);
    
    // Verify the CLI didn't crash and still found other imports
    expect(output.components).toBeDefined();
    expect(output.summary).toBeDefined();
    expect(output.summary.filesScanned).toBeGreaterThan(0);
    
    // Check for components that should still be found
    expect(output.components.Button).toBeDefined();
    expect(output.components.Card).toBeDefined();
    
    // May or may not find Modal depending on parser recovery
  });
});