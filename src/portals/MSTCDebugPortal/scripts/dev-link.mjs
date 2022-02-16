#!/usr/bin/env zx

// This script adds media-stream-track-controller as npm linked module for this
// ReShell portal to use

// Ensure we're running in context of media-stream-track-controller
const mstcPackageJSON = require("../../../../../package.json");
if (mstcPackageJSON.name !== "media-stream-track-controller") {
  throw new Error(
    "media-stream-track-controller parent package does not exist"
  );
}

// Add media-stream-track-controller as npm link for ReShell
await $`cd ${__dirname}/../../../../../ && npm link && cd dev.frontend && npm link media-stream-track-controller`;
