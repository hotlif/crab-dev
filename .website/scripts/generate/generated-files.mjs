import { readFile, readdir, mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { repositoryRoot } from "../../../scripts/library-manifest.mjs";
import { GENERATED_MARKER } from "./format.mjs";

export async function readIfPresent(filePath) {
    try {
        return await withGeneratedFileRetry(() => readFile(filePath, "utf8"));
    } catch (error) {
        if (error?.code === "ENOENT") return undefined;
        throw error;
    }
}

export async function withGeneratedFileRetry(operation, platform = process.platform) {
    for (let attempt = 0; ; attempt++) {
        try { return await operation(); }
        catch (error) {
            if (platform !== "win32" || !["UNKNOWN", "EBUSY", "EPERM", "EACCES"].includes(error.code) || attempt >= 4) throw error;
            await new Promise(resolve => setTimeout(resolve, 100 * 2 ** attempt));
        }
    }
}

export async function emitGeneratedFile(filePath, content, drift, { check = false } = {}) {
    const current = await readIfPresent(filePath);
    if (current === content) return false;
    drift.push(path.relative(repositoryRoot, filePath));
    if (!check) {
        await mkdir(path.dirname(filePath), { recursive: true });
        await withGeneratedFileRetry(() => writeFile(filePath, content, "utf8"));
    }
    return true;
}

export async function removeOrphanGeneratedFiles(directory, expectedFiles, drift, shouldCheck = false) {
    let entries;
    try {
        entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
        if (error?.code === "ENOENT") return;
        throw error;
    }
    for (const entry of entries) {
        if (!entry.isFile() || !/\.(ts|mdx)$/.test(entry.name)) continue;
        const filePath = path.join(directory, entry.name);
        if (expectedFiles.has(filePath)) continue;
        if (entry.name.endsWith(".mdx") && !(await readFile(filePath, "utf8")).includes(GENERATED_MARKER)) continue;
        drift.push(path.relative(repositoryRoot, filePath));
        if (!shouldCheck) await unlink(filePath);
    }
}
