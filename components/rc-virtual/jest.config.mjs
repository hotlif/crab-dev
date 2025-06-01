import preset from "@crab/standards-jest-preset/jest.browser.react.config.mjs";
export default {
    ...preset,
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTests.ts']
}
