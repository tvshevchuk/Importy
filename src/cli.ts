import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as parser from "@babel/parser";
import _traverse from "@babel/traverse";
import type { ImportDeclaration } from "@babel/types";
import os from 'os';

const traverse = _traverse.default;

// Types
export interface ImportMatch {
  importedName: string;
  localName: string;
  file: string;
  line?: number;
}

export interface ImportyOptions {
  dir: string;
  lib: string;
  include?: string;
  exclude?: string;
  verbose?: boolean;
  concurrency?: number;
}

export interface ImportyResult {
  summary: {
    library: string;
    componentsFound: number;
    totalImports: number;
    filesScanned: number;
  };
  components: Record<string, string[]>;
}

// Helper functions 
function isJavaScriptFile(file: string): boolean {
  return /\.(js|ts|jsx|tsx)$/.test(file);
}

function getAllFiles(
  dirPath: string, 
  arrayOfFiles: string[] = [],
  includePattern?: string,
  excludePattern?: string,
  verbose = false
): string[] {
  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      
      try {
        const stat = fs.statSync(fullPath);
        
        // Skip directories that match exclude pattern
        if (excludePattern && stat.isDirectory() && minimatch(fullPath, excludePattern)) {
          if (verbose) console.log(`Skipping excluded directory: ${fullPath}`);
          continue;
        }
        
        if (stat.isDirectory()) {
          getAllFiles(fullPath, arrayOfFiles, includePattern, excludePattern, verbose);
        } else if (isJavaScriptFile(fullPath)) {
          // Check include/exclude patterns for files
          const shouldInclude = !includePattern || minimatch(fullPath, includePattern);
          const shouldExclude = excludePattern && minimatch(fullPath, excludePattern);
          
          if (shouldInclude && !shouldExclude) {
            arrayOfFiles.push(fullPath);
          } else if (verbose) {
            console.log(`Skipping file due to patterns: ${fullPath}`);
          }
        }
      } catch (error) {
        if (verbose) console.warn(`Error accessing file ${fullPath}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  } catch (error) {
    if (verbose) console.error(`Error reading directory ${dirPath}: ${error instanceof Error ? error.message : String(error)}`);
  }
  return arrayOfFiles;
}

function minimatch(filePath: string, pattern: string): boolean {
  try {
    // Simple glob pattern matching implementation
    const regExpPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*\*/g, '{{GLOBSTAR}}')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '[^/]')
      .replace(/{{GLOBSTAR}}/g, '.*');
    
    const regex = new RegExp(`^${regExpPattern}$`, 'i');
    const result = regex.test(filePath);
    return result;
  } catch (error) {
    console.warn(`Invalid pattern: ${pattern}`);
    return false;
  }
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

async function processFilesInBatches<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R> | R,
  onProgress?: (completed: number, total: number) => void
): Promise<R[]> {
  const results: R[] = [];
  const batches = chunkArray(items, batchSize);
  let completed = 0;
  const total = items.length;

  for (const batch of batches) {
    // Process each batch in parallel
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        try {
          const result = await processor(item);
          completed++;
          if (onProgress) {
            onProgress(completed, total);
          }
          return result;
        } catch (error) {
          console.warn(`Error processing item: ${error instanceof Error ? error.message : String(error)}`);
          completed++;
          if (onProgress) {
            onProgress(completed, total);
          }
          return [] as unknown as R;
        }
      })
    );
    
    // Collect results
    results.push(...batchResults);
  }

  return results;
}

function extractImportsFromFile(
  filePath: string,
  targetLib: string,
): ImportMatch[] {
  try {
    const code = fs.readFileSync(filePath, "utf-8");
    let ast;
    
    try {
      // Attempt to parse the file as JS/TS
      ast = parser.parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
        errorRecovery: true,
      });
    } catch (err) {
      // Try again with more plugins if initial parsing fails
      try {
        ast = parser.parse(code, {
          sourceType: "module",
          plugins: ["typescript", "jsx", "decorators-legacy", "classProperties"],
          errorRecovery: true,
        });
      } catch (secondErr) {
        console.warn(`Skipping ${filePath}: Failed to parse: ${secondErr}`);
        return [];
      }
    }

    const matches: ImportMatch[] = [];
    const lines = code.split('\n');
    
    traverse(ast, {
      ImportDeclaration(path) {
        const node = path.node as ImportDeclaration;
        
        // Check if this import is from our target library
        if (node.source.value === targetLib || 
            // Handle subpath imports like 'library/subpath'
            node.source.value.startsWith(`${targetLib}/`)) {
          
          // Get the line number of this import
          const lineNumber = node.loc?.start.line;
          
          for (const specifier of node.specifiers) {
            // Handle different import types (named, default, namespace)
            let importedName: string;
            
            if (specifier.type === 'ImportDefaultSpecifier') {
              importedName = 'default';
            } else if (specifier.type === 'ImportNamespaceSpecifier') {
              importedName = '*';
            } else if ('imported' in specifier && specifier.imported) {
              importedName = specifier.imported.type === 'Identifier' ? specifier.imported.name : String(specifier.imported.value);
            } else {
              importedName = 'unknown';
            }
            
            const localName = specifier.local.name;

            matches.push({
              importedName,
              localName,
              file: filePath,
              line: lineNumber
            });
          }
        }
      },
    });

    return matches;
  } catch (error) {
    console.warn(`Error reading file ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

// Main function to analyze imports
export async function analyzeImports(options: ImportyOptions): Promise<ImportyResult> {
  const { dir, lib, include, exclude, verbose = false } = options;
  const concurrency = options.concurrency || Math.max(1, Math.min(4, os.cpus().length - 1));
  
  // Validate directory exists
  if (!fs.existsSync(dir)) {
    throw new Error(`Directory '${dir}' does not exist`);
  }

  if (!fs.statSync(dir).isDirectory()) {
    throw new Error(`'${dir}' is not a directory`);
  }
  
  // Process all files and build result
  const allFiles = getAllFiles(dir, [], include, exclude, verbose);
  if (verbose) console.log(`Found ${allFiles.length} files to process`);
  
  if (allFiles.length === 0) {
    return {
      summary: {
        library: lib,
        componentsFound: 0,
        totalImports: 0,
        filesScanned: 0
      },
      components: {}
    };
  }

  // Determine batch size based on concurrency
  const batchSize = Math.max(1, Math.ceil(allFiles.length / concurrency));
  if (verbose) console.log(`Processing ${allFiles.length} files with ${concurrency} concurrent processes`);
  
  // Process each file and collect results
  let processedCount = 0;
  const results = await processFilesInBatches(
    allFiles,
    batchSize,
    (file) => extractImportsFromFile(file, lib),
    (completed, total) => {
      // Only log progress at 10% intervals to avoid console spam
      if (verbose) {
        const percentComplete = Math.floor((completed / total) * 100);
        if (percentComplete % 10 === 0 && processedCount !== percentComplete) {
          processedCount = percentComplete;
          console.log(`Progress: ${percentComplete}% (${completed}/${total} files)`);
        }
      }
    }
  );
  
  // Flatten results and build component map
  const componentMap: Record<string, Set<string>> = {};
    
  // Process all results
  for (const imports of results) {
    if (!imports) {
      continue; // Skip null/undefined results
    }
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
  
  // Generate statistics
  const totalImports = Object.values(output).reduce((sum, files) => sum + files.length, 0);
  const totalComponents = Object.keys(output).length;
  
  if (verbose) {
    console.log(`Analysis complete - Found ${totalComponents} components with ${totalImports} total imports across ${allFiles.length} files`);
  }
  
  return {
    summary: {
      library: lib,
      componentsFound: totalComponents,
      totalImports: totalImports,
      filesScanned: allFiles.length
    },
    components: output
  };
}