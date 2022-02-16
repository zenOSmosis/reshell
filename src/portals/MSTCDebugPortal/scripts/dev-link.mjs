#!/usr/bin/env zx

// import fs from "fs";
// import path from "path";

// TODO: Ensure we're running in context of media-stream-track-controller app
const mstcPackageJSON = require("../../../../../package.json");

if (mstcPackageJSON.name !== "media-stream-track-controller") {
  throw new Error(
    "media-stream-track-controller parent package does not exist"
  );
}

await $`cd ../ && npm link && cd dev.frontend && npm link media-stream-track-controller`;
