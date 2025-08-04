import { execSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

let testDir;
let cliPath = path.resolve("./better-tree.js");

beforeAll(() => {
  testDir = fs.mkdtempSync(path.join(os.tmpdir(), "better-tree-"));

  fs.writeFileSync(path.join(testDir, "file1.txt"), "hello");
  fs.writeFileSync(path.join(testDir, "file2.log"), "log");

  fs.mkdirSync(path.join(testDir, "sub"));
  fs.writeFileSync(path.join(testDir, "sub", "nested.txt"), "nested");

  fs.mkdirSync(path.join(testDir, "node_modules"));
  fs.writeFileSync(path.join(testDir, "node_modules", "ignore.js"), "ignore");
});

afterAll(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});

describe("better-tree CLI", () => {
  it("prints tree structure", () => {
    const output = execSync(`node ${cliPath} ${testDir}`, {
      encoding: "utf-8",
    });
    expect(output).toContain("file1.txt");
    expect(output).toContain("sub");
  });

  it("respects --ignore", () => {
    const output = execSync(
      `node ${cliPath} ${testDir} --ignore node_modules`,
      { encoding: "utf-8" },
    );
    expect(output).not.toContain("node_modules");
  });

  it("respects --files-only", () => {
    const output = execSync(`node ${cliPath} ${testDir} --files-only`, {
      encoding: "utf-8",
    });
    expect(output).toContain("file1.txt");
    expect(output).not.toContain("sub");
  });

  it("respects --dirs-only", () => {
    const output = execSync(`node ${cliPath} ${testDir} --dirs-only`, {
      encoding: "utf-8",
    });
    expect(output).toContain("sub");
    expect(output).not.toContain("file1.txt");
  });
});
