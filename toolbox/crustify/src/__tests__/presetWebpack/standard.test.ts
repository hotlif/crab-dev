import { describe, it, expect, afterEach } from "@jest/globals";
import { existsSync, rmSync } from "fs";
import { join } from "node:path";
import CssMinimizerWebpackPlugin from "css-minimizer-webpack-plugin";
import MiniExtractPlugin from "mini-css-extract-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
import { default as presetStandard } from "../../presetWebpack/standard.js";

afterEach(() => {
    const tmp = join(process.cwd(), ".tmp");
    if (existsSync(tmp)) rmSync(tmp, { recursive: true });
});

describe("presetStandard — CSS minimizer bug fix", () => {
    it("production: minimizer should contain CssMinimizerWebpackPlugin", async () => {
        const config = await presetStandard({ isProduction: true, conf: {} });
        const minimizers = (config.optimization?.minimizer ?? []) as object[];
        expect(minimizers.some(m => m instanceof CssMinimizerWebpackPlugin)).toBe(true);
    });

    it("production: minimizer should contain TerserWebpackPlugin", async () => {
        const config = await presetStandard({ isProduction: true, conf: {} });
        const minimizers = (config.optimization?.minimizer ?? []) as object[];
        expect(minimizers.some(m => m instanceof TerserWebpackPlugin)).toBe(true);
    });

    it("production: minimizer should NOT contain MiniExtractPlugin", async () => {
        const config = await presetStandard({ isProduction: true, conf: {} });
        const minimizers = (config.optimization?.minimizer ?? []) as object[];
        expect(minimizers.some(m => m instanceof MiniExtractPlugin)).toBe(false);
    });

    it("production: plugins should contain MiniExtractPlugin", async () => {
        const config = await presetStandard({ isProduction: true, conf: {} });
        const plugins = (config.plugins ?? []) as object[];
        expect(plugins.some(p => p instanceof MiniExtractPlugin)).toBe(true);
    });

    it("development: plugins should NOT contain MiniExtractPlugin", async () => {
        const config = await presetStandard({ isProduction: false, conf: {} });
        const plugins = (config.plugins ?? []) as object[];
        expect(plugins.some(p => p instanceof MiniExtractPlugin)).toBe(false);
    });

    it("development: optimization.minimizer should be undefined", async () => {
        const config = await presetStandard({ isProduction: false, conf: {} });
        expect(config.optimization?.minimizer).toBeUndefined();
    });
});

describe("presetStandard — filesystem cache", () => {
    it("should enable filesystem cache", async () => {
        const config = await presetStandard({ isProduction: false, conf: {} });
        const cache = config.cache as { type?: string };
        expect(cache?.type).toBe("filesystem");
    });

    it("development: cache name should be 'development-cache'", async () => {
        const config = await presetStandard({ isProduction: false, conf: {} });
        const cache = config.cache as { name?: string };
        expect(cache?.name).toBe("development-cache");
    });

    it("production: cache name should be 'production-cache'", async () => {
        const config = await presetStandard({ isProduction: true, conf: {} });
        const cache = config.cache as { name?: string };
        expect(cache?.name).toBe("production-cache");
    });
});

describe("presetStandard — publicPath", () => {
    it("should use conf.publicPath when provided", async () => {
        const config = await presetStandard({ isProduction: false, conf: { publicPath: "/app/" } });
        expect(config.output?.publicPath).toBe("/app/");
    });

    it("should default publicPath to '/' when not configured", async () => {
        const config = await presetStandard({ isProduction: false, conf: {} });
        expect(config.output?.publicPath).toBe("/");
    });

    it("should use custom publicPath in production mode too", async () => {
        const config = await presetStandard({ isProduction: true, conf: { publicPath: "/cdn/" } });
        expect(config.output?.publicPath).toBe("/cdn/");
    });
});
