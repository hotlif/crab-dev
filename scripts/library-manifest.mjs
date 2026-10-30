import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Product-only metadata for synchronous renderers; workspace facts remain separate. */
export function readLibraryMetadata({ root = repositoryRoot } = {}) {
    return JSON.parse(readFileSync(resolve(root, "library.manifest.json"), "utf8"));
}

/** Product metadata is authored once; dependency and script facts come from each workspace. */
export async function loadLibraryManifest({ root = repositoryRoot } = {}) {
    const manifest = readLibraryMetadata({ root });
    const packages = await Promise.all(manifest.packages.map(async (entry) => {
        const directory = resolve(root, entry.path);
        const packageJson = JSON.parse(await readFile(resolve(directory, "package.json"), "utf8"));
        return { ...entry, slug: entry.path.split("/").at(-1), directory, packageJson };
    }));
    return { ...manifest, packages };
}

export async function listLibraryPackages(filter = {}, options) {
    const { packages } = await loadLibraryManifest(options);
    return packages.filter((entry) => Object.entries(filter).every(([key, value]) => entry[key] === value));
}

export async function getLibraryPackage(name, options) {
    const { packages } = await loadLibraryManifest(options);
    return packages.find((entry) => entry.name === name || entry.slug === name);
}
