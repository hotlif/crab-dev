import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";

// --- mocks (must be declared before dynamic import of the module under test) ---

const mockRun = jest.fn<(cb: (err: Error | null, stats: unknown) => void) => void>();
const mockWebpackCompiler = { run: mockRun };

jest.unstable_mockModule("webpack", () => ({
    default: jest.fn().mockReturnValue(mockWebpackCompiler),
}));

jest.unstable_mockModule("webpack-merge", () => ({
    merge: jest.fn<(...args: unknown[]) => unknown>().mockImplementation(
        (...cfgs: unknown[]) => Object.assign({}, ...(cfgs as object[]))
    ),
}));

jest.unstable_mockModule("../presetWebpack/standard.js", () => ({
    default: jest.fn<() => Promise<unknown>>().mockResolvedValue({ entry: "/mock/entry.tsx" }),
}));

jest.unstable_mockModule("../presetWebpack/module.js", () => ({
    default: jest.fn<() => Promise<unknown>>().mockResolvedValue({ module: { rules: [] } }),
}));

jest.unstable_mockModule("../plugins/ReactWebpackPlugin.js", () => ({
    default: class MockReactWebpackPlugin { apply() {} },
}));

jest.unstable_mockModule("../util.js", () => ({
    getCwdDir: jest.fn().mockReturnValue("/mock-cwd"),
    getModsWebpackMerge: jest.fn().mockImplementation((_mods: unknown, cfg: unknown) => cfg),
    getCurrentProjectPath: jest.fn().mockReturnValue("/mock-project"),
}));

const { build } = await import("../index.js");

// --- helpers ---

type StatsLike = {
    hasErrors: () => boolean;
    hasWarnings: () => boolean;
    toString: (_opts?: unknown) => string;
};

const makeStats = (hasErrors: boolean, hasWarnings = false): StatsLike => ({
    hasErrors: () => hasErrors,
    hasWarnings: () => hasWarnings,
    toString: () => (hasErrors ? "compilation errors" : hasWarnings ? "warnings" : ""),
});

// --- tests ---

describe("build — process.exit behaviour", () => {
    let mockExit: ReturnType<typeof jest.spyOn>;

    beforeEach(() => {
        mockExit = jest.spyOn(process, "exit").mockImplementation((() => undefined) as never);
    });

    afterEach(() => {
        mockExit.mockRestore();
    });

    it("should call process.exit(1) when webpack reports a fatal error", async () => {
        mockRun.mockImplementationOnce((cb) => {
            cb(new Error("webpack fatal error"), undefined);
        });
        await build({});
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    it("should call process.exit(1) when stats.hasErrors() is true", async () => {
        mockRun.mockImplementationOnce((cb) => {
            cb(null, makeStats(true));
        });
        await build({});
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    it("should NOT call process.exit on a successful build", async () => {
        mockRun.mockImplementationOnce((cb) => {
            cb(null, makeStats(false));
        });
        await build({});
        expect(mockExit).not.toHaveBeenCalled();
    });

    it("should NOT call process.exit(1) when build has only warnings", async () => {
        mockRun.mockImplementationOnce((cb) => {
            cb(null, makeStats(false, true));
        });
        await build({});
        expect(mockExit).not.toHaveBeenCalled();
    });

    it("should call process.exit(1) exactly once even when both error and stats.hasErrors occur", async () => {
        mockRun.mockImplementationOnce((cb) => {
            cb(new Error("fatal"), makeStats(true));
        });
        await build({});
        expect(mockExit).toHaveBeenCalledTimes(1);
        expect(mockExit).toHaveBeenCalledWith(1);
    });
});
