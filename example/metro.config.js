const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const libraryRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// Watch the library source for live changes
config.watchFolders = [libraryRoot];

// Resolve from both example and library node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(libraryRoot, "node_modules"),
];

// Prevent duplicate React / React Native from the library's node_modules
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
