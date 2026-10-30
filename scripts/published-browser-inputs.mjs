import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, relative, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadLibraryManifest, repositoryRoot } from "./library-manifest.mjs";
import { inspectPackage } from "./library-graph.mjs";

async function filesAt(directory) {
    let entries;
    try { entries = await readdir(directory, { withFileTypes: true }); }
    catch (error) { if (error.code === "ENOENT") return []; throw error; }
    return (await Promise.all(entries.filter(entry => ![".cache", ".tmp", "coverage", "node_modules", "baselines"].includes(entry.name) && !entry.name.startsWith(".wake"))
        .map(entry => entry.isDirectory() ? filesAt(join(directory, entry.name)) : [join(directory, entry.name)]))).flat();
}

/** Bind browser evidence to both source and real publish artifacts, including test-only consumers. */
export async function capturePublishedInputs({ packageRoot, entry, root = repositoryRoot }) {
    const manifest = await loadLibraryManifest({ root });
    const packages = new Map(manifest.packages.map(product => [product.name, product]));
    const ownerPath = resolve(packageRoot), owner = manifest.packages.find(product => product.directory === ownerPath);
    if (!owner) throw new Error(`Unregistered browser fixture package: ${ownerPath}`);
    const files = new Set(), visited = new Set();
    async function collect(product) {
        if (visited.has(product.name)) return;
        visited.add(product.name);
        files.add(join(product.directory, "package.json"));
        for (const name of Object.keys(product.packageJson.dependencies ?? {})) if (packages.has(name)) await collect(packages.get(name));
        for (const child of ["src", "esm", "css", "dist"]) for (const file of await filesAt(join(product.directory, child))) files.add(file);
    }
    if (packages.has("@crab-dev/rc-theme")) await collect(packages.get("@crab-dev/rc-theme"));
    await collect(owner);
    const facts = await inspectPackage(owner);
    for (const name of facts.testImports) if (packages.has(name)) await collect(packages.get(name));
    for (const file of await filesAt(join(ownerPath, "scripts"))) files.add(file);
    files.add(join(ownerPath, ".cache/browser-css.json"));
    if (entry) files.add(resolve(entry));
    for (const directory of ['scripts/visual', 'test/visual']) for (const file of await filesAt(join(root, directory))) files.add(file);
    for (const path of ["package.json", "yarn.lock", "library.manifest.json", "scripts/library-manifest.mjs", "scripts/library-graph.mjs", "scripts/javascript-comments.mjs", "scripts/published-styles.mjs", "scripts/prepare-published-css.mjs", "scripts/test-published-forced-colors.mjs", "scripts/published-browser-runtime.mjs", "scripts/published-browser-readiness.mjs", "test/forced-color-pixels.mjs", "test/forced-color-pixels.d.mts"]) {
        const file = join(root, path);
        try { await readFile(file); files.add(file); }
        catch (error) { if (error.code !== "ENOENT") throw error; }
    }
    files.add(fileURLToPath(import.meta.url));
    return Promise.all([...files].sort().map(async file => ({
        path: relative(root, file).replaceAll("\\", "/"),
        sha256: createHash("sha256").update(await readFile(file)).digest("hex"),
    })));
}
