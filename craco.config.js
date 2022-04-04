const path = require("path");
const WorkerPlugin = require("worker-plugin");

const jsconfig = require("./jsconfig.json");

// FIXME: Will CRA pick up env variables added here?
// FIXME: Add git info, build timestamp, and possibly some build-OS specifics as REACT_APP_ variables here

module.exports = {
  webpack: {
    alias:
      // Dynamically configure via jsconfig.json
      Object.fromEntries(
        Object.entries(jsconfig.compilerOptions.paths).map(([key, value]) => [
          key.replace("/*", ""),
          path.resolve(__dirname, value[0].replace("/*", "")),
        ])
      ),
    plugins: {
      add: [
        new WorkerPlugin({
          // use "self" as the global object when receiving hot updates.
          globalObject: "self", // <-- this is the default value
          filename: "[name].worker.js",
        }),
      ],
    },
  },
};
