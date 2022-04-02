const path = require("path");
const WorkerPlugin = require("worker-plugin");

const jsconfig = require("./jsconfig.json");

// TODO: Will CRA pick up env variables added here?
// TODO: Add git info, build timestamp, and possibly some build-OS specifics as REACT_APP_ variables here

module.exports = {
  webpack: {
    alias: (() =>
      Object.fromEntries(
        Object.entries(jsconfig.compilerOptions.paths).map(([key, value]) => [
          key,
          path.resolve(__dirname, "src", value[0]),
        ])
      ))(),
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
