import { browser } from "@crab/standards-jest-preset";
export default {
    ...browser,
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTests.ts']
};