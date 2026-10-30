import { createHash } from "node:crypto";
import { glob, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { loadLibraryManifest, repositoryRoot } from "../library-manifest.mjs";

const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const excluded = new Set([".cache", ".tmp", ".turbo", ".wake", "coverage", "node_modules", "baselines", "esm", "cjs", "declarations", "css", "dist", "docs-dist"]);
async function filesAt(directory, { artifact = false } = {}) {
    let entries;
    try { entries = await readdir(directory, { withFileTypes: true }); }
    catch (error) { if (error.code === "ENOENT") return []; throw error; }
    return (await Promise.all(entries.filter(entry => artifact || (!excluded.has(entry.name) && !entry.name.startsWith(".wake-"))).map(entry => entry.isDirectory() ? filesAt(path.join(directory, entry.name), { artifact }) : [path.join(directory, entry.name)]))).flat();
}

/** Evidence/lifecycle bookkeeping cannot alter the rendering input identity. */
export function renderingManifest(manifest) {
    return { ...manifest, packages: manifest.packages.map(({ verification, designCoverage, ...product }) => product) };
}

/** Authored remote entries, fonts and samples are inputs; generated copies are not. */
export async function publicSourceFiles({ directory, packageJson }) {
    const files = await filesAt(path.join(directory, 'public'));
    const generated = new Set([path.join(directory, 'public/docgen.json')]);
    for (const pattern of Object.values(packageJson.crab?.generatedArtifacts ?? {}).flat().filter(pattern => pattern.startsWith('public/'))) {
        for await (const file of glob(pattern, { cwd: directory })) generated.add(path.join(directory, file));
    }
    return files.filter(file => !generated.has(file));
}

async function fingerprint(files, root, transform) {
    const records = [];
    const names = [...new Set(files)].sort();
    // Bound parallel IO: avoid thousands of NTFS round trips in sequence while
    // retaining only eight asset buffers at a time for large Worker/WASM files.
    for (let offset = 0; offset < names.length; offset += 8) {
        const batch = await Promise.all(names.slice(offset, offset + 8).map(async file => {
            let bytes;
            try { bytes = await readFile(file); }
            catch (error) { if (error.code === "ENOENT") return null; throw error; }
            const name = path.relative(root, file).replaceAll("\\", "/");
            return { path: name, sha256: hash(transform ? transform(name, bytes) : bytes) };
        }));
        records.push(...batch.filter(Boolean));
    }
    return { fingerprint: `sha256:${hash(JSON.stringify(records))}`, files: records };
}

/** Shared by local Windows and clean Linux snapshots; no Git metadata required. */
export async function captureVisualInputs({ root = repositoryRoot } = {}) {
    const manifest = await loadLibraryManifest({ root });
    const source = ["package.json", "yarn.lock", ".yarnrc.yml", "wake.config.toml", "turbo.json", "library.manifest.json"].map(name => path.join(root, name));
    const artifacts = [];
    const selected = manifest.packages.find(product => product.slug === process.env.CRAB_VISUAL_PACKAGE);
    const included = new Set();
    function collect(product) {
        if (!product || included.has(product.name)) return;
        included.add(product.name);
        for (const name of Object.keys(product.packageJson.dependencies ?? {})) collect(manifest.packages.find(entry => entry.name === name));
    }
    if (selected) {
        collect(selected);
        collect(manifest.packages.find(product => product.slug === "rc-theme"));
        for (const name of JSON.parse(process.env.CRAB_VISUAL_TARGETS ?? "[]")) collect(manifest.packages.find(product => product.name === name));
    }
    for (const product of manifest.packages.filter(product => !selected || included.has(product.name))) {
        for (const file of ["package.json", "token.toml", "wake.config.toml", "tsconfig.json"]) source.push(path.join(product.directory, file));
        for (const directory of ["src", "docs", "scripts"]) source.push(...await filesAt(path.join(product.directory, directory)));
        source.push(...await publicSourceFiles(product));
        for (const directory of ["esm", "css", "dist"]) artifacts.push(...await filesAt(path.join(product.directory, directory), { artifact: true }));
        if (!selected) artifacts.push(...await filesAt(path.join(root, ".website/docs-dist/components", product.slug, "workbench"), { artifact: true }));
    }
    if (process.env.CRAB_VISUAL_WORKBENCH_ROOT) artifacts.push(...await filesAt(process.env.CRAB_VISUAL_WORKBENCH_ROOT, { artifact: true }));
    for (const directory of ["scripts", "test/visual", "standards", ".website/scripts", ".website/docs/site", ".website/docs/examples", ".website/content"]) source.push(...await filesAt(path.join(root, directory)));
    for (const name of [".website/package.json", ".website/wake.config.toml", ".website/docs/theme.css"]) source.push(path.join(root, name));
    for (const directory of [".website/docs/guides", ".website/docs/learn"]) source.push(...(await filesAt(path.join(root, directory))).filter(file => path.relative(root, file).replaceAll('\\', '/') !== '.website/docs/guides/design-coverage.mdx'));
    source.push(path.join(root, '.website/docs/index.mdx'));
    return {
        source: await fingerprint(source, root, (name, bytes) => name === "library.manifest.json" ? JSON.stringify(renderingManifest(JSON.parse(bytes))) : bytes),
        // Coverage/search pages and review reports embed evidence identities.
        // Component workbenches and published ESM/CSS form the visual artifact
        // boundary; the complete site retains its separate build verification.
        artifact: await fingerprint(artifacts, root),
        // The complete site includes derived coverage pages. Record its actual
        // output separately, without feeding this hash into component coverage.
        ...(!selected ? { siteBuild: await fingerprint(await filesAt(path.join(root, '.website/docs-dist'), { artifact: true }), root) } : {}),
    };
}
