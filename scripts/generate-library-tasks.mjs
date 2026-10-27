import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { loadLibraryManifest, repositoryRoot } from "./library-manifest.mjs";
import { findDependencyCycle, inspectLibrary, libraryBuildGraph } from "./library-graph.mjs";

/** Turbo owns execution and caching; this generator only declares dependency topology. */
export function createTurboConfig(manifest, inspection) {
    const graph = libraryBuildGraph(manifest, inspection);
    const cycle = findDependencyCycle(graph);
    if (cycle) throw new Error(`Library build dependency cycle: ${cycle.join(" -> ")}`);
    const names = new Set(graph.keys());
    const tasks = {
        "build:library": {
            inputs: ["$TURBO_DEFAULT$", "!**/*.test.tsx", "!**/*.test.ts", "!src/__tests__/**/*", "!src/token.ts", "!docs/**/*", "!coverage/**/*"],
            outputs: ["esm/**", "cjs/**", "declarations/**", "css/**", "src/token.ts", "dist/**"],
        },
        test: { inputs: ["$TURBO_DEFAULT$"], outputs: ["coverage/**"] },
        typecheck: {
            inputs: ["$TURBO_DEFAULT$", "$TURBO_ROOT$/standards/typescript-preset/**/*", "$TURBO_ROOT$/scripts/typecheck.mjs", "$TURBO_ROOT$/scripts/typescript-pnp.lock.json"],
            outputs: [],
        },
        "generate:token": { inputs: ["token.toml", "scripts/**/*"], outputs: ["src/token.ts"] },
        "generate:docgen": { inputs: ["src/**/*", "tsconfig.json"], outputs: ["public/docgen.json"] },
        lint: { inputs: ["$TURBO_DEFAULT$", "$TURBO_ROOT$/wake.config.toml"], outputs: [] },
        "@crab-dev/standards-typescript-preset#test": {
            inputs: ["$TURBO_DEFAULT$", "$TURBO_ROOT$/scripts/typecheck.mjs", "$TURBO_ROOT$/scripts/typecheck-fixtures.mjs", "$TURBO_ROOT$/scripts/typescript-pnp.lock.json"],
            outputs: ["coverage/**"],
        },
    };
    for (const entry of manifest.packages) {
        const facts = inspection.get(entry.name);
        const buildDependencies = graph.get(entry.name);
        const tokenOutputs = entry.packageJson.crab?.generatedArtifacts?.["generate:token"] ?? ["src/token.ts"];
        tasks[`${entry.name}#build:library`] = {
            ...tasks["build:library"],
            inputs: [...new Set([...tasks["build:library"].inputs, ...tokenOutputs.map((file) => `!${file}`)])],
            outputs: [...new Set([...tasks["build:library"].outputs, ...tokenOutputs])],
            dependsOn: buildDependencies.map((name) => `${name}#build:library`),
        };
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
    return { $schema: "https://turbo.build/schema.json", tasks };
}

export async function generateLibraryTasks({ check = false, root = repositoryRoot } = {}) {
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
