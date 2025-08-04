import { execSync } from "child_process";
import { mkdirSync } from "fs";

mkdirSync("bin", { recursive: true });

execSync(
  `esbuild better-tree.js --bundle --platform=node --format=esm --minify --outfile=bin/better-tree.min.js`,
  { stdio: "inherit" },
);
