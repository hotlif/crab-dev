import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { loadLibraryManifest, repositoryRoot } from "./library-manifest.mjs";
import { findDependencyCycle, inspectLibrary, libraryBuildGraph } from "./library-graph.mjs";
import { generateLibraryMetadata, libraryMetadataOutputs } from "./generate-library-metadata.mjs";

/** Turbo owns execution and caching; this generator only declares dependency topology. */
export function createTurboConfig(manifest, inspection) {
    const graph = libraryBuildGraph(manifest, inspection);
    const cycle = findDependencyCycle(graph);
    if (cycle) throw new Error(`Library build dependency cycle: ${cycle.join(" -> ")}`);
    const names = new Set(graph.keys());
    // Behavior/browser evidence belongs to the actual host and run. Build
    // outputs remain cacheable; a prior test result is not a fresh check.
    const testTask = { inputs: ["$TURBO_DEFAULT$"], outputs: ["coverage/**"], cache: false };
    const tasks = {
        "build:library": {
            inputs: ["$TURBO_DEFAULT$", "!**/*.test.tsx", "!**/*.test.ts", "!src/__tests__/**/*", "!src/token.ts", "!docs/**/*", "!coverage/**/*"],
            outputs: ["esm/**", "cjs/**", "declarations/**", "css/**", "src/token.ts", "dist/**"],
        },
        test: testTask,
        typecheck: {
            inputs: ["$TURBO_DEFAULT$", "$TURBO_ROOT$/standards/typescript-preset/**/*"],
            outputs: [],
        },
        "generate:token": { inputs: ["token.toml", "scripts/**/*"], outputs: ["src/token.ts"] },
        "generate:docgen": { inputs: ["src/**/*", "tsconfig.json"], outputs: ["public/docgen.json"] },
        lint: { inputs: ["$TURBO_DEFAULT$", "$TURBO_ROOT$/wake.config.toml"], outputs: [] },
        "@crab-dev/standards-typescript-preset#test": {
            ...testTask,
            inputs: ["$TURBO_DEFAULT$", "$TURBO_ROOT$/scripts/typecheck-fixtures.mjs"],
        },
    };
    for (const entry of manifest.packages) {
        const facts = inspection.get(entry.name);
        const buildDependencies = graph.get(entry.name);
        const tokenOutputs = entry.packageJson.crab?.generatedArtifacts?.["generate:token"] ?? ["src/token.ts"];
        const declaredBuildOutputs = entry.packageJson.crab?.generatedArtifacts?.['build:library'];
        const buildOutputs = declaredBuildOutputs === undefined ? [] : declaredBuildOutputs;
        if (!Array.isArray(buildOutputs) || buildOutputs.some(file => typeof file !== 'string' || !file || /^[!/$]|^[A-Za-z]:/.test(file) || file.includes('\\') || file.split('/').some(part => part === '.' || part === '..'))) throw new Error(`${entry.name}: build:library generated artifacts must be relative positive output patterns.`);
        tasks[`${entry.name}#build:library`] = {
            ...tasks["build:library"],
            inputs: [...new Set([...tasks["build:library"].inputs, ...[...tokenOutputs, ...buildOutputs].map((file) => `!${file}`)])],
            outputs: [...new Set([...tasks["build:library"].outputs, ...tokenOutputs, ...buildOutputs])],
            dependsOn: buildDependencies.map((name) => `${name}#build:library`),
        };
        const metadata = libraryMetadataOutputs(manifest).filter(output => output.path.startsWith(`${entry.path}/`));
        if (metadata.length) {
            tasks[`${entry.name}#build:library`].inputs.push("$TURBO_ROOT$/library.manifest.json", "$TURBO_ROOT$/scripts/generate-library-metadata.mjs", ...metadata.map(output => `!${output.path.slice(entry.path.length + 1)}`));
            tasks[`${entry.name}#build:library`].outputs.push(...metadata.map(output => output.path.slice(entry.path.length + 1)));
        }
        const testDependencies = [...new Set([...buildDependencies, ...facts.testImports])]
            .filter((name) => names.has(name) && name !== entry.name).sort();
        for (const task of ["test", "typecheck"]) {
            if (entry.packageJson.scripts?.[task]) tasks[`${entry.name}#${task}`] = { ...tasks[task], dependsOn: testDependencies.map((name) => `${name}#build:library`) };
        }
        if (entry.packageJson.scripts?.["generate:token"]) {
            tasks[`${entry.name}#generate:token`] = {
                ...tasks["generate:token"],
                outputs: tokenOutputs,
                dependsOn: [...facts.tokenImports].filter((name) => names.has(name)).sort().map((name) => `${name}#generate:token`),
            };
        }
    }
    // The docs application is the consumer of the full library, never its build prerequisite.
    tasks["@crab-dev/website#test"] = { ...tasks.test, dependsOn: [...names].sort().map((name) => `${name}#build:library`) };
    tasks["@crab-dev/website#typecheck"] = { ...tasks.typecheck, dependsOn: [...names].sort().map((name) => `${name}#build:library`) };
    return {
        $schema: "https://turbo.build/schema.json",
        // Resource limits, writable temp roots and browser locations must reach
        // strict-mode tasks. None changes library semantics; tests never cache.
        globalPassThroughEnv: ['RAYON_NUM_THREADS', 'TEMP', 'TMP', 'TMPDIR', 'PLAYWRIGHT_BROWSERS_PATH', 'CRAB_TEST_BROWSER_PATH'],
        tasks,
    };
}

export async function generateLibraryTasks({ check = false, root = repositoryRoot } = {}) {
    await generateLibraryMetadata({ root, check });
    const manifest = await loadLibraryManifest({ root });
    const output = `${JSON.stringify(createTurboConfig(manifest, await inspectLibrary(manifest)), null, 4)}\n`;
    const target = resolve(root, "turbo.json");
    if (check) {
        if (await readFile(target, "utf8") !== output) throw new Error("turbo.json is stale; run yarn generate:architecture.");
    } else await writeFile(target, output);
    return manifest.packages.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        const count = await generateLibraryTasks({ check: process.argv.includes("--check") });
        console.log(`Library task topology ${process.argv.includes("--check") ? "verified" : "generated"} for ${count} packages.`);
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
