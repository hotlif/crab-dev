import { describe, it, expect, jest } from "@jest/globals";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const mockLoadConfig = jest.fn<(...args: unknown[]) => Promise<unknown>>();
jest.unstable_mockModule("unconfig", () => ({
    loadConfig: mockLoadConfig,
}));

const { defineConfig, getConfig, renderHTML } = await import("../../conf.js");

describe("conf", () => {
    it("defineConfig should return the same config object", () => {
        const input = { rootDir: "/test" };
        const result = defineConfig(input);
        expect(result).toBe(input);
    });

    it("getConfig should load and return config", async () => {
        mockLoadConfig.mockResolvedValueOnce({ config: { rootDir: "/mock-root" } });
        const config = await getConfig(__dirname);
        expect(config).toEqual({ rootDir: "/mock-root" });
        expect(mockLoadConfig).toHaveBeenCalledWith(
            expect.objectContaining({ cwd: __dirname, merge: true })
        );
    });

    it("renderHTML should load and return transformed component", async () => {
        const MockComponent = () => null;
        mockLoadConfig.mockResolvedValueOnce({ config: MockComponent });
        const Component = await renderHTML(__dirname);
        expect(Component).toBe(MockComponent);
    });

    it("renderHTML should invoke the transform callback", async () => {
        const MockComponent = () => null;
        mockLoadConfig.mockImplementationOnce(async (...args: unknown[]) => {
            const options = args[0] as { sources?: { transform?: (s: string) => string }[] };
            const transform = options.sources?.[0]?.transform;
            expect(transform).toBeDefined();
            const result = transform!('export default function App() { return null; }');
            expect(typeof result).toBe('string');
            return { config: MockComponent };
        });
        const Component = await renderHTML(__dirname);
        expect(Component).toBe(MockComponent);
    });

    it("defineConfig should accept publicPath field", () => {
        const input = { publicPath: "/app/" };
        const result = defineConfig(input);
        expect(result.publicPath).toBe("/app/");
    });

    it("defineConfig should accept devServer port, host and open fields", () => {
        const input = {
            devServer: { server: "http" as const, port: 3000, host: "0.0.0.0", open: true },
        };
        const result = defineConfig(input);
        expect(result.devServer?.port).toBe(3000);
        expect(result.devServer?.host).toBe("0.0.0.0");
        expect(result.devServer?.open).toBe(true);
    });

    it("defineConfig should allow omitting the new devServer fields", () => {
        const input = { devServer: { server: "https" as const } };
        const result = defineConfig(input);
        expect(result.devServer?.port).toBeUndefined();
        expect(result.devServer?.host).toBeUndefined();
        expect(result.devServer?.open).toBeUndefined();
    });
});
