import assert from "node:assert/strict";
import { access, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { loadLibraryManifest } from "./library-manifest.mjs";

export function exportTargets(exports) {
    const targets = [];
    function visit(value, subpath = ".", condition = "default") {
        if (typeof value === "string") targets.push({ subpath, condition, target: value });
        else if (value && typeof value === "object") {
            for (const [key, child] of Object.entries(value)) visit(child, key.startsWith(".") ? key : subpath, key.startsWith(".") ? condition : key);
        }
    }
    visit(exports);
    return targets;
}

async function pathExists(target) {
    try {
        await access(target);
        return true;
    } catch {
        return false;
    }
}

export async function verifyTarget(directory, target) {
    const absolute = resolve(directory, target);
    const path = relative(directory, absolute);
    if (!target.startsWith("./") || path.startsWith("..") || isAbsolute(path)) return false;
    if (!target.includes("*")) return pathExists(absolute);
    const prefix = absolute.slice(0, absolute.indexOf("*"));
    const searchRoot = prefix.endsWith("/") || prefix.endsWith("\\") ? prefix : dirname(prefix);
    const pattern = new RegExp(`^${path.replaceAll("\\", "/").split("*").map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*")}$`);
    const pending = [searchRoot];
    while (pending.length) {
        const current = pending.pop();
        let entries;
        try { entries = await readdir(current, { withFileTypes: true }); }
        catch (error) {
            if (error.code === "ENOENT" || error.code === "ENOTDIR") continue;
            throw error;
        }
        for (const entry of entries) {
            const child = join(current, entry.name);
            if (entry.isDirectory()) pending.push(child);
            else if (entry.isFile() && pattern.test(relative(directory, child).replaceAll("\\", "/"))) return true;
        }
    }
    return false;
}

/** Verify packaged artifacts through manifest entrypoints; never import component source. */
export async function checkBuiltExports() {
    const { packages } = await loadLibraryManifest();
    const errors = [];
    let entrypoints = 0;
    for (const entry of packages) {
        const targets = exportTargets(entry.packageJson.exports);
        for (const { subpath, condition, target } of targets) {
            if (!await verifyTarget(entry.directory, target)) errors.push(`${entry.name}${subpath === "." ? "" : subpath.slice(1)} (${condition}): missing or unsafe ${target}`);
            entrypoints++;
        }
        const roots = targets.filter(({ subpath }) => subpath === ".");
        const esm = roots.find(({ condition, target }) => condition === "import" && /\.[cm]?js$/.test(target));
        const cjs = roots.find(({ condition, target }) => condition === "require" && /\.[cm]?js$/.test(target));
        if (!esm || !cjs) continue;
        try {
            const imported = await import(pathToFileURL(resolve(entry.directory, esm.target)).href);
            const required = createRequire(resolve(entry.directory, "package.json"))(entry.name);
            const keys = (module) => Object.keys(module).filter((key) => key !== "__esModule").sort();
            assert.deepEqual(keys(imported), keys(required));
        } catch (error) {
            errors.push(`${entry.name}: ESM/CommonJS consumption failed: ${error.message}`);
        }
    }
    if (errors.length) throw new Error(`Built export verification failed:\n${errors.map((error) => `- ${error}`).join("\n")}`);
    return { packages: packages.length, entrypoints };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        const result = await checkBuiltExports();
        console.log(`Built exports verified for ${result.packages} packages and ${result.entrypoints} entrypoints.`);
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
