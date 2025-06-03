// extract-imports.js
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
        matches.push({
          file: filePath,
          imports: node.specifiers.map((s) => s.local.name),
        });
      }
    },
  });

  return matches;
}

const files = getAllFiles(dir);
const results = [];

for (const file of files) {
  const imports = extractImportsFromFile(file, lib);
  if (imports.length) results.push(...imports);
}

console.log(JSON.stringify(results, null, 2));
