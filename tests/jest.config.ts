import {defaults as tsjPreset} from "ts-jest/presets";

module.exports = {
    rootDir: "./src",
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
    testTimeout: 120000
}