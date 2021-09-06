const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@core": path.resolve(__dirname, "src/core"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@portals": path.resolve(__dirname, "src/portals"),
    },
  },
};
