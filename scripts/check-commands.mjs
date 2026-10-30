import { readFile, readdir } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { repositoryRoot } from "./library-manifest.mjs";

export function requiredCheckScripts(pkg) {
    const checks = pkg.crab?.requiredChecks;
    if (checks === undefined) return [];
    if (!Array.isArray(checks)) throw new Error(`${pkg.name}: crab.requiredChecks must be an array.`);
    if (new Set(checks).size !== checks.length) throw new Error(`${pkg.name}: crab.requiredChecks must not contain duplicates.`);
    for (const task of checks) {
        if (typeof task !== "string" || !/^test:[a-z0-9][a-z0-9:_-]*$/i.test(task)) throw new Error(`${pkg.name}: required checks must name additional test:* scripts.`);
        if (typeof pkg.scripts?.[task] !== "string" || !pkg.scripts[task].trim()) throw new Error(`${pkg.name}: required check ${task} has no executable script.`);
    }
    return [...checks];
}

export async function readWorkspaceManifests({ root = repositoryRoot } = {}) {
    const rootPackage = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
    if (!Array.isArray(rootPackage.workspaces)) throw new Error("Root workspaces must be an array.");
    const paths = new Set();
    for (const pattern of rootPackage.workspaces) {
        if (typeof pattern !== "string" || !pattern || /[?{}!\[\]\\]/.test(pattern) || pattern.startsWith("/") || pattern.split("/").some((part) => part === "." || part === "..")) {
            throw new Error(`Unsupported workspace pattern: ${pattern}`);
        }
        if (!pattern.includes("*")) {
            paths.add(pattern);
        } else if (/^[^*]+\/\*$/.test(pattern)) {
            const group = pattern.slice(0, -2);
            for (const entry of await readdir(resolve(root, group), { withFileTypes: true })) {
                if (entry.isDirectory()) paths.add(`${group}/${entry.name}`);
            }
        } else {
            throw new Error(`Unsupported workspace pattern: ${pattern}`);
        }
    }
    return Promise.all([...paths].sort().map(async (path) => {
        const directory = resolve(root, path);
        const pkg = JSON.parse(await readFile(resolve(directory, "package.json"), "utf8"));
        return { path, directory, packageJson: pkg };
    }));
}

export async function checkCommandContracts({ root = repositoryRoot } = {}) {
    const errors = [];
    const rootPackage = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
    const compilerVersion = rootPackage.devDependencies?.typescript;
    if (compilerVersion !== "6.0.2") errors.push("The repository must pin official TypeScript 6.0.2.");
    const workspaces = await readWorkspaceManifests({ root });
    for (const { path, directory, packageJson: pkg } of workspaces) {
        const runner = relative(directory, resolve(root, "scripts/check-package.mjs")).replaceAll("\\", "/");
        if (pkg.scripts?.check !== `node ${runner}`) errors.push(`${pkg.name}: check must use the shared workspace check runner.`);
        if (!pkg.scripts?.lint) errors.push(`${pkg.name}: lint is required.`);
        if (pkg.scripts?.typecheck && pkg.scripts.typecheck !== "tsc --noEmit") errors.push(`${pkg.name}: typecheck must call the official compiler directly.`);
        if ((pkg.scripts?.typecheck || pkg.devDependencies?.typescript) && pkg.devDependencies?.typescript !== compilerVersion) errors.push(`${pkg.name}: TypeScript must match the root compiler version.`);
        if (pkg.type !== "module") errors.push(`${pkg.name}: type must be module.`);
        if (path.startsWith("components/") && (!pkg.scripts?.typecheck || !pkg.scripts?.["build:library"])) errors.push(`${pkg.name}: library workspaces require typecheck and build:library.`);
        if (Object.keys(pkg.scripts ?? {}).some((name) => /^(?:lint|check)$/.test(name) && /(?:^|\s)eslint(?:\s|$)/.test(pkg.scripts[name]))) errors.push(`${pkg.name}: checks must use Wake Lint.`);
        try { requiredCheckScripts(pkg); }
        catch (error) { errors.push(error.message); }
    }
    if (errors.length) throw new Error(`Workspace command contract failed:\n${errors.map((error) => `- ${error}`).join("\n")}`);
    return workspaces.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        console.log(`Workspace command contracts verified for ${await checkCommandContracts()} packages.`);
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
