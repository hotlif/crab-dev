import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadLibraryManifest, repositoryRoot } from "./library-manifest.mjs";

/** Collect actual published CSS once, with dependencies before their consumers. */
export async function collectPublishedStyles(directories, { root = repositoryRoot } = {}) {
    const manifest = await loadLibraryManifest({ root });
    const packages = new Map(manifest.packages.map(entry => [entry.name, entry]));
    const styles = [], visited = new Set();
    async function collect(directory) {
        const absolute = resolve(directory instanceof URL ? fileURLToPath(directory) : directory);
        if (visited.has(absolute)) return;
        visited.add(absolute);
        const pkg = JSON.parse(await readFile(resolve(absolute, "package.json"), "utf8"));
        for (const name of Object.keys(pkg.dependencies ?? {})) {
            const dependency = packages.get(name);
            if (dependency) await collect(dependency.directory);
        }
        try {
            styles.push(await readFile(resolve(absolute, "css/index.css"), "utf8"));
        } catch (error) {
            if (error.code !== "ENOENT" || pkg.exports?.["./css/index.css"]) throw error;
        }
    }
    for (const directory of directories) await collect(directory);
    return styles;
}
