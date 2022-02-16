#!/usr/bin/env zx

// IMPORTANT: This is only suited for GitHub Pages publishing, and currently
// has hardcoding specifically for the ReShell portal project.  It shouldn't be
// used for other projects / portals without [possibly] extensive modification.

import fs from "fs";
import path from "path";

// Ensure the latest npm modules are installed
await $`npm install --verbose`;

const PROJECT_ROOT_PATH = path.resolve(__dirname, "..", "..", "..", "..");

const GH_PAGES_REPO = "git@github.com:zenOSmosis/reshell.org-static.git";
const TMP_REPO_PATH = "/tmp/reshell.org-static.git";

await $`npm run build`;
const BUILD_PATH = path.resolve(PROJECT_ROOT_PATH, "build");

try {
  await $`git clone ${GH_PAGES_REPO} ${TMP_REPO_PATH}`;
} catch (p) {
  // Ignore error if already exists
  if (p.exitCode !== 128) {
    throw p;
  }
}

const IGNORE_PATH_NAMES = [".git", "CNAME", "README.md"];

for (const pathName of fs.readdirSync(TMP_REPO_PATH)) {
  if (!IGNORE_PATH_NAMES.includes(pathName)) {
    fs.rmSync(path.resolve(TMP_REPO_PATH, pathName), {
      recursive: true,
      force: true,
    });
  }
}

// Copy files from the build to the temp project
await $`cp -r ${BUILD_PATH}/* ${TMP_REPO_PATH}/.`;

// Copy the index.html to the 404.html
await $`cp ${TMP_REPO_PATH}/index.html ${TMP_REPO_PATH}/404.html`;

await $`ls ${TMP_REPO_PATH}`;

console.log(
  `\n\n\nNOTE: Skipping auto-commit back to parent repo, and opening temporary intermediate terminal at the ${TMP_REPO_PATH} location for testing / manual remote commit`
);
await $`cd ${TMP_REPO_PATH} && bash`;
