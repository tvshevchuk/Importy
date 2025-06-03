import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import type { ImportDeclaration } from '@babel/types';

// Define CLI options
program
  .requiredOption('-d, --dir <directory>', 'Directory to scan')
  .requiredOption('-l, --lib <library>', 'Library name to match')
  .parse(process.argv);

const { dir, lib } = program.opts<{
  dir: string;
  lib: string;
}>();

// Helpers
function isJavaScriptFile(file: string): boolean {
  return /\.(js|ts|jsx|tsx)$/.test(file);
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (isJavaScriptFile(fullPath)) {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

type ImportMatch = {
  importedName: string;
  localName: string;
  file: string;
};

function extractImportsFromFile(filePath: string, targetLib: string): ImportMatch[] {
  const code = fs.readFileSync(filePath, 'utf-8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });
  } catch (err) {
    console.warn(`Skipping ${filePath}: Failed to parse`);
    return [];
  }

  const matches: ImportMatch[] = [];

  traverse(ast, {
    ImportDeclaration(path: any) {
      const node = path.node as ImportDeclaration;
      if (node.source.value === targetLib) {
        for (const specifier of node.specifiers) {
          const importedName =
            'imported' in specifier && specifier.imported
              ? specifier.imported.name as any
              : 'default';
          const localName = specifier.local.name;

          matches.push({
            importedName,
            localName,
            file: filePath,
          });
        }
      }
    },
  });

  return matches;
}

// Process all files and build result
const allFiles = getAllFiles(dir);
const componentMap: Record<string, Set<string>> = {};

for (const file of allFiles) {
  const imports = extractImportsFromFile(file, lib);
  for (const { importedName, file: filePath } of imports) {
    if (!componentMap[importedName]) {
      componentMap[importedName] = new Set();
    }
    componentMap[importedName].add(filePath);
  }
}

// Final output
const output: Record<string, string[]> = {};
for (const [component, files] of Object.entries(componentMap)) {
  output[component] = [...files];
}

console.log(JSON.stringify(output, null, 2));
