#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import process from "process";

// ANSI colors
const colors = {
  reset: "\x1b[0m",
  blue: "\x1b[34m", // directories
  white: "\x1b[37m", // files
  cyan: "\x1b[36m", // symlinks
};

// --------------------
// HELP MESSAGE
// --------------------
function showHelp() {
  console.log(`
Usage: better-tree [directory] [options]

Options:
  --ignore <patterns...>     Ignore matching files/folders (supports *, **)
  --depth <n>                Limit recursion depth
  --files-only               Show only files
  --dirs-only                Show only directories
  --help                     Show this help message

Examples:
  better-tree .
  better-tree src --ignore node_modules dist
  better-tree --depth 2 --files-only
  better-tree --dirs-only
`);
  process.exit(0);
}

// --------------------
// CLI ARGUMENTS PARSING
// --------------------
const args = process.argv.slice(2);
if (args.includes("--help")) showHelp();

function extractOption(optionName, defaultValue = null, valueIndexOffset = 1) {
  const index = args.indexOf(optionName);
  if (index !== -1) {
    const value = args[index + valueIndexOffset];
    args.splice(index, valueIndexOffset + 1);
    return value ?? defaultValue;
  }
  return defaultValue;
}

function hasFlag(flag) {
  return args.includes(flag);
}

const ignoreIndex = args.indexOf("--ignore");
const ignorePatterns = ignoreIndex !== -1 ? args.slice(ignoreIndex + 1) : [];
if (ignoreIndex !== -1) args.splice(ignoreIndex);

const maxDepth = parseInt(extractOption("--depth", Infinity), 10) || Infinity;
const filesOnly = hasFlag("--files-only");
const dirsOnly = hasFlag("--dirs-only");
const targetDir = path.resolve(args[0] || ".");

// --------------------
// IGNORE PATTERNS
// --------------------
const compiledPatterns = ignorePatterns.map((pattern) => ({
  regex: new RegExp(
    "^" +
      pattern
        .replace(/\./g, "\\.")
        .replace(/\*\*/g, ".*")
        .replace(/\*/g, "[^/]*") +
      "$",
  ),
}));

function shouldIgnore(relativePath) {
  return compiledPatterns.some(
    ({ regex }) =>
      regex.test(relativePath) || regex.test(path.basename(relativePath)),
  );
}

// --------------------
// CONCURRENCY LIMITER
// --------------------
let activeCount = 0;
const queue = [];
const maxConcurrency = 20;

function limitConcurrency(task) {
  return new Promise((resolve, reject) => {
    const run = async () => {
      activeCount++;
      try {
        const result = await task();
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        activeCount--;
        if (queue.length) queue.shift()();
      }
    };
    if (activeCount < maxConcurrency) {
      run();
    } else {
      queue.push(run);
    }
  });
}

// --------------------
// TREE PRINTING
// --------------------
async function printTree(dir, prefix = "", depth = 0, relativeBase = "") {
  if (depth > maxDepth) return;

  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  const filteredEntries = entries
    .map((entry) => ({
      entry,
      relativePath: path.join(relativeBase, entry.name).replace(/\\/g, "/"),
    }))
    .filter((item) => !shouldIgnore(item.relativePath))
    .filter((item) => {
      if (filesOnly && item.entry.isDirectory()) return false;
      if (dirsOnly && !item.entry.isDirectory()) return false;
      return true;
    })
    .sort((a, b) => a.entry.name.localeCompare(b.entry.name));

  const lastIndex = filteredEntries.length - 1;

  for (let i = 0; i < filteredEntries.length; i++) {
    const { entry } = filteredEntries[i];
    const connector = i === lastIndex ? "└── " : "├── ";

    let nameColored = entry.name;
    if (entry.isDirectory()) {
      nameColored = colors.blue + entry.name + colors.reset;
    } else if (entry.isSymbolicLink()) {
      nameColored = colors.cyan + entry.name + colors.reset;
    } else {
      nameColored = colors.white + entry.name + colors.reset;
    }

    console.log(prefix + connector + nameColored);

    if (entry.isDirectory() && !filesOnly) {
      const nextPrefix = prefix + (i === lastIndex ? "    " : "│   ");
      await limitConcurrency(() =>
        printTree(
          path.join(dir, entry.name),
          nextPrefix,
          depth + 1,
          filteredEntries[i].relativePath,
        ),
      );
    }
  }
}

// --------------------
// START
// --------------------
await printTree(targetDir);
