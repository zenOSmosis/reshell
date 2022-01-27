const path = require("path");
const WorkerPlugin = require("worker-plugin");

// TODO: Will CRA pick up env variables added here?
// TODO: Add git info, build timestamp, and possibly some build-OS specifics as REACT_APP_ variables here

module.exports = {
  webpack: {
    alias: {
      "@root": path.resolve(__dirname),
      "@components": path.resolve(__dirname, "src/components"),
      "@core": path.resolve(__dirname, "src/core"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@icons": path.resolve(__dirname, "src/components/icons"),
      "@portals": path.resolve(__dirname, "src/portals"),
      "@services": path.resolve(__dirname, "src/services"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
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
