const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@core": path.resolve(__dirname, "src/core"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@icons": path.resolve(__dirname, "src/components/icons"),
      "@portals": path.resolve(__dirname, "src/portals"),
      "@services": path.resolve(__dirname, "src/services"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  },
};
