const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push("cjs");

// Enable React Native conditional exports for Firebase
defaultConfig.resolver.unstable_conditionNames = [
  "react-native",
  "browser",
  "require",
];

module.exports = defaultConfig;
