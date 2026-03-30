
import { describe, it, expect } from "@jest/globals";
import { dirname, join } from 'node:path';
import { existsSync, rmdirSync} from "fs";
import { fileURLToPath } from 'node:url';

import { getTmpDir, getCwdDir, getModsWebpackMerge, getCurrentProjectPath } from "../util.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("test util", () => {
    it("test generate getTmpDir", async () => {
        if (existsSync(join(__dirname, ".tmp"))) {
            rmdirSync(join(__dirname, ".tmp"))
        }
        const path = getTmpDir(__dirname);
        expect(existsSync(path)).toBe(true);
    })

    it("getTmpDir should use process.cwd() when rootDir is undefined", () => {
        const path = getTmpDir(undefined);
        expect(path).toBe(join(process.cwd(), ".tmp"));
    })

    it("getCwdDir should return rootDir when provided", () => {
        expect(getCwdDir("/custom/path")).toBe("/custom/path");
    })

    it("getCwdDir should return process.cwd() when rootDir is undefined", () => {
        expect(getCwdDir(undefined)).toBe(process.cwd());
    })

    it("getModsWebpackMerge should apply modifyWebpack from mods", () => {
        const mods = [
            {
                modifyWebpack: (config: Record<string, unknown>) => ({ ...config, mode: "production" as const })
            },
            {
                modifyWebpack: (config: Record<string, unknown>) => ({ ...config, devtool: false as const })
            }
        ];
        const result = getModsWebpackMerge(mods, { mode: "development" });
        expect(result.mode).toBe("production");
        expect(result.devtool).toBe(false);
    })

    it("getModsWebpackMerge should skip mods without modifyWebpack", () => {
        const mods = [
            { modifyEntry: (entry: string) => entry },
            { modifyWebpack: (config: Record<string, unknown>) => ({ ...config, mode: "production" as const }) }
        ];
        const result = getModsWebpackMerge(mods, { mode: "development" });
        expect(result.mode).toBe("production");
    })

    it("getModsWebpackMerge should return original config with empty mods", () => {
        const config = { mode: "development" as const };
        const result = getModsWebpackMerge([], config);
        expect(result).toBe(config);
    })

    it("getCurrentProjectPath should find the nearest package.json", () => {
        const result = getCurrentProjectPath(__dirname);
        expect(existsSync(join(result, "package.json"))).toBe(true);
    })
})
