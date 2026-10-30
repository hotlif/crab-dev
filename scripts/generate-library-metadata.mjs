import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { loadLibraryManifest, repositoryRoot } from "./library-manifest.mjs";

export function libraryMetadataOutputs(manifest) {
    const owner = manifest.packages.find(entry => entry.name === "@crab-dev/rc-token-semantic");
    if (!owner || !manifest.designSystems) return [];
    const registry = Object.fromEntries(manifest.designSystems.map(design => [design.id, {
        label: design.title, fullName: design.fullName, source: design.source,
        ...(design.reference ? { reference: design.reference } : {}),
    }]));
    const selectors = Object.fromEntries(manifest.designSystems.map(design => [design.id, {
        light: `[data-crab-design="${design.id}"][data-theme="light"]`,
        dark: `[data-crab-design="${design.id}"][data-theme="dark"]`,
    }]));
    return [{ path: `${owner.path}/src/design-system.ts`, content:
        "// Generated from library.manifest.json by generate:architecture. Do not edit.\n"
        + `export const designSystemRegistry = ${JSON.stringify(registry, null, 4)} as const;\n\n`
        + "export type DesignSystem = keyof typeof designSystemRegistry;\n\n"
        + `export const defaultDesignSystem: DesignSystem = ${JSON.stringify(manifest.defaultDesignSystem)};\n\n`
        + "export const themeSelectors = { light: ':root, [data-theme=\"light\"]', dark: '[data-theme=\"dark\"]', forcedColors: '@media (forced-colors: active)' } as const;\n\n"
        + `export const designThemeSelectors = ${JSON.stringify(selectors, null, 4)} as const;\n`,
    }];
}

export async function generateLibraryMetadata({ root = repositoryRoot, check = false } = {}) {
    const outputs = libraryMetadataOutputs(await loadLibraryManifest({ root }));
    for (const output of outputs) {
        const path = resolve(root, output.path);
        let before;
        try { before = await readFile(path, "utf8"); }
        catch (error) { if (error.code !== "ENOENT") throw error; }
        if (before === output.content) continue;
        if (check) throw new Error(`${output.path} is stale; run yarn generate:architecture.`);
        await writeFile(path, output.content);
    }
    return outputs.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    await generateLibraryMetadata({ check: process.argv.includes("--check") });
}
