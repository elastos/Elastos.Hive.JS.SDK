import type { InitialOptionsTsJest } from 'ts-jest/dist/types'
import { defaults as tsjPreset } from 'ts-jest/presets'
import { writeFileSync, existsSync, mkdirSync } from "fs";

// Empty browser data stub for nodejs tests.
if (!existsSync("./generated"))
    mkdirSync("./generated");
writeFileSync("./generated/browserdata.json", "{}");

const config: InitialOptionsTsJest = {
  rootDir: "./tests/src",
  preset: 'ts-jest',
  transform: {
    ...tsjPreset.transform,
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  reporters: [
    "default",
    [
      "jest-html-reporter", {
        pageTitle: "Hive JS SDK NodeJS test report",
        includeFailureMsg: true,
        includeSuiteFailure: true
      }
    ]
  ],
  testEnvironment: "node",
  testRunner: "jest-circus/runner",
  globals: {
    "ts-jest": {
      "tsconfig": "./tsconfig.json"
    }
  },
  testTimeout: 6000000
}
export default config