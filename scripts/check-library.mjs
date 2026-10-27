import { access, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { loadLibraryManifest, repositoryRoot } from "./library-manifest.mjs";
import { findDependencyCycle, inspectLibrary, libraryBuildGraph } from "./library-graph.mjs";
import { loadReactPeerRequirements, reactPeerRanges, requiredReactPeers } from "./react-peer-contract.mjs";
import { validateDesignVerification } from "./design-verification.mjs";

const maturity = new Set(["experimental", "stable", "deprecated"]);
const coverage = new Set(["partial", "verified", "not-applicable"]);
const allowedFamilies = {
    foundation: new Set(["foundation"]),
    base: new Set(["foundation", "base"]),
    composite: new Set(["foundation", "base", "composite"]),
    extension: new Set(["foundation", "base", "composite", "extension"]),
    integration: new Set(["foundation", "base", "composite", "integration"]),
    devtool: new Set(["foundation", "base", "composite", "extension", "integration", "devtool"]),
};
export function validateReactPeers(pkg, requiredPeers) {
    const errors = [];
    for (const [name, range] of Object.entries(reactPeerRanges)) {
        if (pkg.dependencies?.[name]) errors.push(`${name} must be a peer instead of a bundled dependency.`);
        if (requiredPeers.has(name)) {
            if (pkg.peerDependencies?.[name] !== range) errors.push(`${name} runtime dependency chain requires the supported ${range} peer range.`);
            if (!pkg.devDependencies?.[name]) errors.push(`${name} peers need a development dependency for local checks.`);
        } else if (pkg.peerDependencies?.[name]) errors.push(`${name} peer is unused by the runtime dependency graph.`);
    }
    return errors;
}

export function validateLibrary(manifest, inspection, peers = requiredReactPeers(manifest, inspection)) {
    const errors = [];
    const report = (entry, problem) => errors.push(`${entry.name}: ${problem}`);
    const packages = new Map(manifest.packages.map((entry) => [entry.name, entry]));
    const paths = new Set();
    const categories = new Set(manifest.categories.map(({ id }) => id));
    const designs = manifest.designSystems.map(({ id }) => id);
    if (manifest.schemaVersion !== 1) errors.push("Unsupported library manifest schema.");
    if (packages.size !== manifest.packages.length) errors.push("Duplicate library package names.");
    if (new Set(designs).size !== 3 || !["md3", "apple", "shadcn"].every((id) => designs.includes(id))) errors.push("Design system IDs must be md3, apple and shadcn.");
    for (const entry of manifest.packages) {
        const pkg = entry.packageJson;
        const facts = inspection.get(entry.name);
        if (entry.name !== pkg.name) report(entry, "manifest name disagrees with package.json.");
        if (!/^components\/rc-[a-z0-9-]+$/.test(entry.path) || paths.has(entry.path)) report(entry, "invalid or duplicate workspace path.");
        paths.add(entry.path);
        if (!allowedFamilies[entry.family]) report(entry, "unknown architecture family.");
        if (!categories.has(entry.category)) report(entry, "unknown usage category.");
        if (!entry.title?.trim()) report(entry, "product title is required.");
        if (!maturity.has(entry.status)) report(entry, "invalid maturity status.");
        if (entry.status === "deprecated" && !entry.deprecation) report(entry, "deprecated packages need a migration destination.");
        if (Object.keys(entry.designCoverage ?? {}).length !== designs.length || designs.some((id) => !coverage.has(entry.designCoverage?.[id]))) report(entry, "complete design coverage is required.");
        for (const problem of validateDesignVerification(entry, designs)) report(entry, problem);
        if (pkg.websiteConfig) report(entry, "product metadata belongs in library.manifest.json.");
        if (pkg.type !== "module") report(entry, "all packages must be ESM.");
        if (pkg.nx) report(entry, "obsolete task-runner configuration is not supported.");
        for (const task of ["lint", "typecheck", "build:library"]) if (!pkg.scripts?.[task]) report(entry, `missing ${task} command.`);
        if (pkg.scripts?.check !== "node ../../scripts/check-package.mjs") report(entry, "check must use the shared package check contract.");
        if (facts.testImports.size > 0 && !pkg.scripts?.test?.includes("wake test --serial --coverage")) report(entry, "component tests must use Wake serial coverage.");
        const docsDependencies = new Set(pkg.crab?.docsDependencies ?? []);
        for (const name of docsDependencies) {
            if (!pkg.devDependencies?.[name] || !facts.docsImports.has(name)) report(entry, `${name} is not a declared, used docs dependency.`);
            if (facts.productionImports.has(name) || facts.tokenImports.has(name)) report(entry, `${name} cannot be marked docs-only.`);
        }
        for (const section of ["dependencies", "devDependencies"]) {
            for (const [name, version] of Object.entries(pkg[section] ?? {})) {
                if ((packages.has(name) || name.startsWith("@crab-dev/standards-")) && version !== "workspace:^") report(entry, `${name} must use workspace:^.`);
                if (["@crab-dev/wake", "@crab-dev/css"].includes(name) && version !== "0.1.45") report(entry, `${name} must be pinned to 0.1.45.`);
                if (section === "dependencies" && pkg.devDependencies?.[name]) report(entry, `${name} is duplicated in dependency sections.`);
            }
        }
        for (const problem of validateReactPeers(pkg, peers.get(entry.name))) report(entry, problem);
        for (const name of facts.productionImports) {
            if (name === entry.name || Object.hasOwn(reactPeerRanges, name) || name.startsWith("@types/")) continue;
            if (!pkg.dependencies?.[name]) report(entry, `production import ${name} is missing from dependencies.`);
        }
        for (const name of Object.keys(pkg.devDependencies ?? {})) {
            if (facts.docsImports.has(name) && !facts.productionImports.has(name) && !facts.tokenImports.has(name) && !docsDependencies.has(name)) report(entry, `${name} needs an explicit docs dependency role.`);
        }
        for (const name of Object.keys(pkg.dependencies ?? {})) {
            const dependency = packages.get(name);
            if (dependency && !allowedFamilies[entry.family]?.has(dependency.family)) report(entry, `cannot depend on ${dependency.family} package ${name}.`);
        }
    }
    const cycle = findDependencyCycle(libraryBuildGraph(manifest, inspection));
    if (cycle) errors.push(`Library build dependency cycle: ${cycle.join(" -> ")}`);
    return errors;
}

export async function checkLibrary({ root = repositoryRoot } = {}) {
    const manifest = await loadLibraryManifest({ root });
    const inspection = await inspectLibrary(manifest);
    const errors = validateLibrary(manifest, inspection, await loadReactPeerRequirements(manifest, inspection));
    for (const entry of manifest.packages) {
        for (const record of Object.values(entry.verification ?? {})) {
            for (const path of Array.isArray(record?.evidencePaths) ? record.evidencePaths : []) {
                if (typeof path !== "string" || path.startsWith("/") || path.includes("\\") || path.split("/").includes("..") || /^[a-z]+:/i.test(path)) continue;
                try { await access(resolve(root, path)); }
                catch { errors.push(`${entry.name}: recorded design evidence does not exist: ${path}`); }
            }
        }
    }
    const actual = (await readdir(resolve(root, "components"), { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => `components/${entry.name}`).sort();
    const listed = manifest.packages.map((entry) => entry.path).sort();
    if (JSON.stringify(actual) !== JSON.stringify(listed)) errors.push("Library inventory must cover every component workspace exactly once.");
    if (errors.length) throw new Error(`Library contract check failed:\n${errors.map((error) => `- ${error}`).join("\n")}`);
    return manifest.packages.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        console.log(`Library contracts verified for ${await checkLibrary()} packages.`);
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
