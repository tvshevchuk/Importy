#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { program } from "commander";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";

program
  .requiredOption("-d, --dir <directory>", "Directory to scan")
  .requiredOption("-l, --lib <library>", "Library name to match")
  .parse(process.argv);

const { dir, lib } = program.opts();

function isJavaScriptFile(file) {
  return /\.(js|ts|jsx|tsx)$/.test(file);
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (isJavaScriptFile(fullPath)) {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

function extractImportsFromFile(filePath, targetLib) {
  const code = fs.readFileSync(filePath, "utf8");
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });
  } catch (err) {
    console.warn(`Skipping ${filePath}: Parse error`);
    return [];
  }

  const matches = [];

  traverse(ast, {
    ImportDeclaration({ node }) {
      if (node.source.value === targetLib) {
        for (const specifier of node.specifiers) {
          let importedName = specifier.imported?.name || "default";
          let localName = specifier.local.name;

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

const files = getAllFiles(dir);
const componentMap = {};

for (const file of files) {
  const imports = extractImportsFromFile(file, lib);
  for (const { importedName, file: filePath } of imports) {
    if (!componentMap[importedName]) {
      componentMap[importedName] = new Set();
    }
    componentMap[importedName].add(filePath);
  }
}

// Convert Set to array for output
const output = Object.fromEntries(
  Object.entries(componentMap).map(([name, paths]) => [name, [...paths]]),
);

console.log(JSON.stringify(output, null, 2));
