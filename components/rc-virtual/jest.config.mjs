import { browser } from "@crab-dev/standards-jest-preset";
export default {
    ...browser,
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTests.ts']
};