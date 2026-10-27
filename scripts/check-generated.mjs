import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";
import { loadLibraryManifest, repositoryRoot } from "./library-manifest.mjs";
import { resolveYarnEntry } from "./package-manager.mjs";

export function generatedLibraryPaths(manifest) {
    return manifest.packages.flatMap((entry) => {
        if (!entry.packageJson.scripts?.["generate:token"]) return [];
        const files = entry.packageJson.crab?.generatedArtifacts?.["generate:token"] ?? ["src/token.ts"];
        return files.map((file) => `${entry.path}/${file}`);
    }).sort();
}

export function generatedContentChanges(before, after) {
    return [...new Set([...before.keys(), ...after.keys()])].filter((path) => before.get(path) !== after.get(path)).sort();
}

async function contentSnapshot(paths) {
    const result = new Map();
    for (const path of paths) {
        try {
            result.set(path, createHash("sha256").update(await readFile(resolve(repositoryRoot, path))).digest("hex"));
        } catch (error) {
            if (error.code !== "ENOENT") throw error;
            result.set(path, null);
        }
    }
    return result;
}

export async function checkGeneratedDrift() {
    const paths = [...generatedLibraryPaths(await loadLibraryManifest()), ".pnp.cjs", ".pnp.loader.mjs"];
    const before = await contentSnapshot(paths);
    const yarn = await resolveYarnEntry(process.env.npm_execpath);
    const run = promisify(execFile);
    console.log("Regenerating declared artifacts and checking content drift without consulting Git status.");
    await run(process.execPath, [yarn, "install", "--immutable"], { cwd: repositoryRoot, windowsHide: true, maxBuffer: 16 * 1024 * 1024 });
    await run(process.execPath, [yarn, "run", "generate:token", "--force"], { cwd: repositoryRoot, windowsHide: true, maxBuffer: 16 * 1024 * 1024 });
    const after = await contentSnapshot(paths);
    const missing = [...after].filter(([, content]) => content === null).map(([path]) => path);
    if (missing.length) throw new Error(`Declared generated artifacts are missing:\n${missing.join("\n")}`);
    const changed = generatedContentChanges(before, after);
    if (changed.length) throw new Error(`Generated artifacts changed on regeneration; review the refreshed files and rerun:\n${changed.join("\n")}`);
    return paths.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        if (process.argv.includes("--regenerate")) {
            console.log(`Regeneration reproduced ${await checkGeneratedDrift()} generated files without content drift.`);
            process.exit(0);
        }
        const paths = generatedLibraryPaths(await loadLibraryManifest());
        const { stdout } = await promisify(execFile)("git", ["status", "--porcelain", "--", ...paths, ".pnp.cjs", ".pnp.loader.mjs"], { cwd: repositoryRoot, windowsHide: true });
        if (stdout.trim()) throw new Error(`Generated token or PnP files are missing or stale:\n${stdout}`);
        console.log(`Generated artifacts verified for ${paths.length} token files and PnP.`);
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
