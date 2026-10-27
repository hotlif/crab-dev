import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const sourceExtension = /\.(?:[cm]?[jt]sx?)$/;
const testFile = /(?:^|[\\/])(?:__tests__|browser-tests)(?:[\\/])|\.(?:test|spec)\.[cm]?[jt]sx?$/;

export function packageName(specifier) {
    if (specifier.startsWith(".") || specifier.startsWith("/") || specifier.startsWith("node:")) return null;
    return specifier.split("/").slice(0, specifier.startsWith("@") ? 2 : 1).join("/");
}

/** Include type exports: emitted declarations must be resolvable by consumers too. */
export function extractPackageImports(source) {
    const code = source.replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, "");
    const imports = new Set();
    const patterns = [
        /(?:^|\n)\s*(?:import|export)\s+(?:type\s+)?(?:[\w\s{},*$]+?\s+from\s+)?["']([^"']+)["']/g,
        /\bimport\s*\(\s*["']([^"']+)["']/g,
        /\brequire\s*\(\s*["']([^"']+)["']/g,
    ];
    for (const pattern of patterns) {
        for (const match of code.matchAll(pattern)) {
            const name = packageName(match[1]);
            if (name !== null) imports.add(name);
        }
    }
    return imports;
}

export async function sourceFiles(directory) {
    const files = [];
    let entries;
    try {
        entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
        if (error.code === "ENOENT") return files;
        throw error;
    }
    for (const entry of entries) {
        const absolutePath = join(directory, entry.name);
        if (entry.isDirectory()) files.push(...await sourceFiles(absolutePath));
        else if (sourceExtension.test(entry.name) && entry.name !== "token.ts") files.push(absolutePath);
    }
    return files.sort();
}

async function importsFrom(files) {
    const result = new Set();
    for (const file of files) {
        for (const name of extractPackageImports(await readFile(file, "utf8"))) result.add(name);
    }
    return result;
}

export async function inspectPackage(entry) {
    const sources = await sourceFiles(join(entry.directory, "src"));
    const tokenImports = new Set();
    try {
        const definition = await readFile(join(entry.directory, "token.toml"), "utf8");
        const imports = definition.match(/^imports\s*=\s*\[([\s\S]*?)\]/m)?.[1] ?? "";
        for (const match of imports.matchAll(/["'](@crab-dev\/[^"']+)["']/g)) tokenImports.add(match[1]);
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }
    return {
        productionImports: await importsFrom(sources.filter((file) => !testFile.test(file))),
        testImports: await importsFrom([
            ...sources.filter((file) => testFile.test(file)),
            ...await sourceFiles(join(entry.directory, "browser-tests")),
        ]),
        docsImports: await importsFrom(await sourceFiles(join(entry.directory, "docs"))),
        tokenImports,
    };
}

export async function inspectLibrary(manifest) {
    return new Map(await Promise.all(manifest.packages.map(async (entry) => [entry.name, await inspectPackage(entry)])));
}

export function findDependencyCycle(graph) {
    const visited = new Set();
    const stack = [];
    const active = new Set();
    function visit(name) {
        if (active.has(name)) return [...stack.slice(stack.indexOf(name)), name];
        if (visited.has(name)) return null;
        active.add(name);
        stack.push(name);
        for (const dependency of graph.get(name) ?? []) {
            const cycle = visit(dependency);
            if (cycle) return cycle;
        }
        stack.pop();
        active.delete(name);
        visited.add(name);
        return null;
    }
    for (const name of graph.keys()) {
        const cycle = visit(name);
        if (cycle) return cycle;
    }
    return null;
}

export function libraryBuildGraph(manifest, inspection) {
    const names = new Set(manifest.packages.map((entry) => entry.name));
    return new Map(manifest.packages.map((entry) => {
        const facts = inspection.get(entry.name);
        const dependencies = new Set([
            ...Object.keys(entry.packageJson.dependencies ?? {}),
            ...facts.productionImports,
            ...facts.tokenImports,
        ]);
        return [entry.name, [...dependencies].filter((name) => names.has(name) && name !== entry.name).sort()];
    }));
}
