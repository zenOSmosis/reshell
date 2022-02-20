#!/usr/bin/env zx

// IMPORTANT: This is only suited for GitHub Pages publishing, and currently
// has hardcoding specifically for the ReShell portal project.  It shouldn't be
// used for other projects / portals potentially without extensive modification.

import fs from "fs";
import path from "path";

const PUBLISH_FROM_BRANCH = "master";

const gitBranch = (await $`git rev-parse --abbrev-ref HEAD`).stdout.replace(
  "\n",
  ""
);

// Ensure we're publishing from the correct branch
if (gitBranch !== PUBLISH_FROM_BRANCH) {
  throw new Error(`Must be on "${PUBLISH_FROM_BRANCH}" branch`);
}

// Ensure the latest npm modules are installed
await $`npm install --verbose`;

const PROJECT_ROOT_PATH = path.resolve(__dirname, "..", "..", "..", "..");

const packageJSON = require(path.join(PROJECT_ROOT_PATH, "package.json"));
const packageVersion = packageJSON.version;

const GH_PAGES_REPO = "git@github.com:zenOSmosis/reshell.org-static.git";
const TMP_REPO_PATH = "/tmp/reshell.org-static.git";

// Delete TMP_REPO_PATH from filesystem (the script will create it again)
//
// FIXME: (jh) This fixes an issue where the script would sometimes error out
// when rebuilding but deleting each time might not be the best approach,
// either. This should be looked into.
await $`rm -rf ${TMP_REPO_PATH}`;

// Build the ReShell portal
await $`npm run build ReShell.org`;

// Resolve the absolute build path
const BUILD_PATH = path.resolve(PROJECT_ROOT_PATH, "build");

// Clone the GitHub Pages repo into temp location
try {
  await $`git clone ${GH_PAGES_REPO} ${TMP_REPO_PATH}`;
} catch (p) {
  // Ignore error if already exists
  if (p.exitCode !== 128) {
    throw p;
  }
}

// Remove all files except for the ignored files from the GitHub Pages temp
// repo
const IGNORE_PATH_NAMES = [".git", "CNAME", "README.md"];
for (const pathName of fs.readdirSync(TMP_REPO_PATH)) {
  if (!IGNORE_PATH_NAMES.includes(pathName)) {
    fs.rmSync(path.resolve(TMP_REPO_PATH, pathName), {
      recursive: true,
      force: true,
    });
  }
}

// Copy files from the build to the GitHub Pages temp repo
await $`cp -r ${BUILD_PATH}/* ${TMP_REPO_PATH}/.`;

// Copy the index.html to the 404.html (fixes GitHub Pages issue where opening
// non-index.html file would lead to 404 page that wasn't React app)
await $`cp ${TMP_REPO_PATH}/index.html ${TMP_REPO_PATH}/404.html`;

// Show the files in the temp path (for debugging purposes)
await $`ls ${TMP_REPO_PATH}`;

// Stage the files and make the commit, using package version obtained from
// package.json
//
// IMPORTANT: Not pushing here
await $`cd ${TMP_REPO_PATH} && git add . && git commit -m "v${packageVersion}"`;

// Prompt the user to push manually
console.log(
  `\n\n\nNOTE: Skipping auto-publish and opening temporary intermediate terminal at the ${TMP_REPO_PATH} location for testing / manual remote commit\n\nType "git push" to publish`
);
await $`cd ${TMP_REPO_PATH} && bash`;
