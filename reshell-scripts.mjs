#!/usr/bin/env zx

import fs from "fs";
import path from "path";
import symlinkDir from "symlink-dir";
import chalk from "chalk";
import { question } from "zx";

// TODO: Abstract console.log statements not intended to be re-routed to
// Phantom globalLogger

// Currently PhantomCore isn't pre-built nor is an ESM module
const PhantomCore = require("phantom-core");
const { sleep } = PhantomCore;

const PORTALS_BASE_PATH = path.join(__dirname, "src", "portals");

const INITIAL_PORTAL_NAME = process.argv[4];

// FIXME: (jh) Capitalize these and use "INITIAL" prefixes (like
// "INITIAL_PORTAL_NAME")
const cmd = process.argv[3];
const scriptName = process.argv[5];

// FIXME: (jh) Pass additional process argvs to reshell-script commands

// Initial setup work
if (INITIAL_PORTAL_NAME) {
  setupPortalWithName(INITIAL_PORTAL_NAME);
}

const commands = {
  "list-commands": {
    description: "Lists the available commands",
    action: () => {
      Object.entries(commands).forEach(([cmd, meta], idx) => {
        if (idx > 0) {
          console.log("");
        }

        console.log(chalk.bold("  " + cmd));

        if (meta.description) {
          console.log("   " + meta.description);
        }

        const usage = `${meta.example || `npm run ${cmd}`}`;
        console.log(chalk.gray("   Usage: " + usage));
      });
    },
  },

  "list-portals": {
    description: "Lists the available portals",
    action: () => {
      console.log(
        getAvailablePortalNames()
          .map(portalName => ` -- ${portalName}`)
          .join("\n")
      );
    },
  },

  "list-portal-scripts": {
    description: "Lists the available scripts for the given portal",
    example: "npm run list-portal-scripts ExamplePortal",
    action: () => {
      const portalScripts = getPortalScripts(INITIAL_PORTAL_NAME);

      if (portalScripts.length) {
        console.log(
          portalScripts.map(scriptFile => ` -- ${scriptFile}`).join("\n")
        );
      } else {
        console.warn(
          `No portal scripts are available for portal: ${INITIAL_PORTAL_NAME}`
        );
      }
    },
  },

  exec: {
    description: `Executes a portal script using Google's ZX interpreter`,
    example: "npm run exec ExamplePortal hello-world.js",
    action: async () => {
      await execPortalScript(INITIAL_PORTAL_NAME, scriptName);
    },
  },

  start: {
    description: `Starts a portal's development environment`,
    example: "npm run start ExamplePortal",
    action: async () => {
      if (!INITIAL_PORTAL_NAME) {
        // Multiple-choice selection
        const portalName = await askForPortalName();

        await setupPortalWithName(portalName);
      }

      await $`HTTPS=true craco start`;
    },
  },

  "start:no-ssl": {
    description: `Starts a portal's development environment w/o an SSL frontend`,
    example: "npm run start:no-ssl ExamplePortal",
    action: async () => {
      if (!INITIAL_PORTAL_NAME) {
        // Multiple-choice selection
        const portalName = await askForPortalName(
          "Choose a portal to start without SSL"
        );

        await setupPortalWithName(portalName);
      }

      await $`craco start`;
    },
  },

  build: {
    description: `Builds a portal for production`,
    example: "npm run build ExamplePortal",
    action: async () => {
      if (!INITIAL_PORTAL_NAME) {
        // Multiple-choice selection
        const portalName = await askForPortalName("Choose a portal to build");

        await setupPortalWithName(portalName);
      }

      await $`craco build --profile`;
    },
  },

  test: {
    description: `Runs ReShell tests for all portals`,
    action: async () => {
      await $`craco test`;
    },
  },
};

if (commands[cmd]) {
  await commands[cmd].action();
} else {
  throw new ReferenceError(`Unknown command: ${cmd}`);
}

/**
 * Prompts the user with the list of portal names, with incrementing numeric
 * identifiers starting from 1 (one).
 *
 * NOTES:
 *  - If only one portal name is registered, it will automatically use it.
 *  - If an invalid option is selected, it will recursively call itself until
 *    the user enters a valid option.
 *
 * @param {string} questionText? [default = "Choose a portal"]
 * @return {Promise<string>}
 */
async function askForPortalName(questionText = "Choose a portal") {
  const availablePortalNames = getAvailablePortalNames();

  const lenPortalNames = availablePortalNames.length;

  if (lenPortalNames === 1) {
    return availablePortalNames[0];
  }

  for (const idx in availablePortalNames) {
    console.log(`  ${parseInt(idx, 10) + 1}. ${availablePortalNames[idx]}`);
  }

  console.log("");

  const answer = parseInt(
    await question(`${questionText} [1 - ${lenPortalNames}]: `, {
      choices: getAvailablePortalNames().map((nil, idx) => idx),
    }),
    10
  );

  const portalName = availablePortalNames[answer - 1];

  if (!portalName) {
    console.warn(
      `Please choose a number between 1 - ${availablePortalNames.length}`
    );

    // Sleep for one second, to allow the user to read the previous message
    await sleep();

    // Intentional extra line break
    console.log("");

    return askForPortalName(questionText);
  }

  // Intentional extra line break
  console.log("");

  console.log(`Chosen portal: ${portalName}`);

  // Sleep for one second, to allow the user to read the previous message
  await sleep();

  // Intentional extra line break
  console.log("");

  return portalName;
}

/**
 * @param {string} portalName
 * @return {Promise<void>}
 */
async function setupPortalWithName(portalName) {
  // Validate portal name
  if (!getAvailablePortalNames().includes(portalName)) {
    throw new ReferenceError(`Unknown portal name: ${portalName}`);
  }

  // Write __registerPortals__.js
  fs.writeFileSync(
    path.join(__dirname, "src", "__registerPortals__.js"),
    generateRegisterPortalsScript(portalName)
  );

  // Symlink portal public directory to package root public
  await (async () => {
    // If portal doesn't contain a public folder, use the one from ReShell.org
    const publicPortalName = fs.existsSync(
      path.join(PORTALS_BASE_PATH, portalName, "public")
    )
      ? portalName
      : "ReShell.org";

    await symlinkDir(
      path.join(PORTALS_BASE_PATH, publicPortalName, "public"),
      path.join(__dirname, "public")
    );
  })();
}

/**
 * TODO: Ensure this only returns directory names
 *
 * @return {string[]}
 */
function getAvailablePortalNames() {
  return fs.readdirSync(PORTALS_BASE_PATH);
}

/**
 * @return {string[]}
 */
function getPortalScripts(portalName) {
  const scriptsBasePath = path.join(PORTALS_BASE_PATH, portalName, "scripts");

  if (fs.existsSync(scriptsBasePath)) {
    return fs.readdirSync(scriptsBasePath);
  } else {
    return [];
  }
}

/**
 * @param {string} portalName
 * @return {string}
 */
function generateRegisterPortalsScript(portalName) {
  let ret =
    "// This file is automatically generated and should not be directly modified\n\n";
  ret += 'import React from "react";\n';
  ret += 'import ReShellCore from "./core";';
  ret += "\n\n";
  ret +=
    "// The portals defined here are what are selectable inside of the application\n";
  ret += "const portals = {\n";
  ret += "  default: React.lazy(() =>\n";
  ret += `    import("@portals/${portalName}")\n`;
  ret += "  )\n";

  ret += "};\n";
  ret += "\n";
  ret += "ReShellCore.registerPortals(portals);\n";

  return ret;
}

/**
 * @param {string} portalName
 * @param {string} scriptName
 * @return {Promise<any>}
 */
async function execPortalScript(portalName, scriptName) {
  return $`zx ${path.join(
    PORTALS_BASE_PATH,
    portalName,
    "scripts",
    scriptName
  )}`;
}
