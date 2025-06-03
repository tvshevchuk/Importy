import fs from "fs";
import path from "path";
import { program } from "commander";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { analyzeImports } from "./cli.js";

// Get current file path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load package.json dynamically
let packageJson;
try {
  const packagePath = path.resolve(__dirname, "../package.json");
  const packageData = fs.readFileSync(packagePath, "utf8");
  packageJson = JSON.parse(packageData);
} catch (error) {
  packageJson = { version: "0.0.0", name: "importy" }; // Fallback version
  console.warn("Could not load package.json, using default version");
}

/**
 * Importy - A CLI tool for analyzing JavaScript/TypeScript imports
 *
 * This tool scans a directory recursively for JS/TS files and identifies
 * all imports from a specified library, providing a detailed report of
 * which components are imported and where they are used.
 */

// Define CLI options
program
  .version(packageJson.version)
  .description("Analyze JavaScript/TypeScript imports from a specific library")
  .requiredOption("-d, --dir <directory>", "Directory to scan")
  .requiredOption("-l, --lib <library>", "Library name to match")
  .option(
    "-o, --output <file>",
    "Output results to a JSON file instead of stdout",
  )
  .option("-v, --verbose", "Enable verbose logging")
  .option(
    "-i, --include <pattern>",
    "Only include files matching pattern (glob)",
  )
  .option("-e, --exclude <pattern>", "Exclude files matching pattern (glob)")
  .option(
    "-c, --concurrency <number>",
    "Number of worker threads (defaults to CPU count - 1)",
  )
  .parse(process.argv);

const options = program.opts<{
  dir: string;
  lib: string;
  output?: string;
  verbose: boolean;
  include?: string;
  exclude?: string;
  concurrency?: string;
}>();

// Main application execution
async function main() {
  try {
    // Convert CLI options to the expected format
    const result = await analyzeImports({
      dir: options.dir,
      lib: options.lib,
      include: options.include,
      exclude: options.exclude,
      verbose: options.verbose || false,
      concurrency: options.concurrency
        ? parseInt(options.concurrency, 10)
        : undefined,
    });

    // Output results
    if (options.output) {
      // Write to file if output option is specified
      try {
        fs.writeFileSync(options.output, JSON.stringify(result, null, 2));
        console.log(`Results written to ${options.output}`);
      } catch (error) {
        console.error(
          `Error writing to output file: ${error instanceof Error ? error.message : String(error)}`,
        );
        console.log(JSON.stringify(result, null, 2)); // Fallback to console
      }
    } else {
      // Output to console
      console.log(JSON.stringify(result, null, 2));
    }

    // Exit with warning if no imports were found
    if (Object.keys(result.components).length === 0) {
      console.warn(
        `No imports from '${options.lib}' were found in the specified directory.`,
      );
      process.exit(0);
    }

    return result;
  } catch (error) {
    console.error(
      `Error during processing: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(
    `Unhandled error: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});
