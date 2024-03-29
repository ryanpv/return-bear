import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  verbose: true,
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.ts$": "<rootDir>/dist/$1.ts",
  },
  // testMatch: [
  //   "<rootDir>/dist/**/*.test.js", // Match JavaScript test files in the dist folder
  // ],
  testPathIgnorePatterns: ['src/'] // Ignore typescript tests
};

export default config;
