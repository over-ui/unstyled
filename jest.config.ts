import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
  },
  watchPathIgnorePatterns: ["node_modules", "dist"],
  testPathIgnorePatterns: ["node_modules", "<rootDir>/packages/playground"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/"],
};

export default jestConfig;
