import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, unlink, writeFile } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { typecheckFileSystem } from "./typescript-pnp-fs.mjs";

const repository = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspace = join(repository, "standards", "typescript-preset");
const require = createRequire(new URL("../standards/typescript-preset/package.json", import.meta.url));
const compiler = join(dirname(require.resolve("typescript/package.json")), "bin/tsc");
const checker = join(repository, "scripts", "typecheck.mjs");
const temporaryRoot = join(workspace, ".tmp");
const resultsPath = join(temporaryRoot, "typecheck-results.json");
await mkdir(temporaryRoot, { recursive: true });
await unlink(resultsPath).catch(error => {
    if (error.code !== "ENOENT") throw error;
});
const fixtures = await mkdtemp(join(temporaryRoot, "typescript-pnp-"));
if (!resolve(fixtures).startsWith(temporaryRoot + sep)) throw new Error("Unexpected fixture cleanup path");

function compile(name, args) {
    const result = spawnSync(process.execPath, args, {
        cwd: workspace, encoding: "utf8", timeout: 30000, windowsHide: true,
    });
    if (result.error) throw result.error;
    if (result.signal || result.status === null) throw new Error(`Compiler fixture ${name} was interrupted`);
    return { name, code: result.status, output: result.stdout + result.stderr };
}

try {
    const results = [compile("version", [compiler, "--version"])];
    const { fs } = typecheckFileSystem(join(workspace, "tsconfig.json"));
    const localModules = join(workspace, "node_modules");
    assert.ok(fs.fileExists(join(localModules, "@crab-dev/wake/package.json")));
    const reactTypes = fs.realpath(join(localModules, "@types/react"));
    assert.ok(fs.fileExists(join(reactTypes, "node_modules/csstype/package.json")));
    // TypeScript walks ancestor directories on a miss. React's declarations must not
    // inherit this workspace's Wake dependency anywhere along that walk.
    for (let dir = resolve(reactTypes); dirname(dir) !== dir; dir = dirname(dir)) {
        assert.ok(!fs.fileExists(join(dir, "node_modules/@crab-dev/wake/package.json")));
    }
    const cases = [
        ["valid", "index.tsx", 'import type { ReactNode } from "react";\nexport const view: ReactNode = <button>Save</button>;\n'],
        ["invalid-type", "index.ts", '/* 类型 */ export const count: number = "three";\n'],
        ["strict-null", "index.ts", "export const count: number = null;\n"],
        // The root declares Changesets, but this workspace must not see it.
        ["missing-package", "index.ts", 'export * from "@changesets/cli";\n'],
        ["invalid-declaration", "index.d.ts", "export declare function table({ height = 400 }: { height?: number }): void;\n"],
    ];
    for (const [name, file, source] of cases) {
        const directory = join(fixtures, name);
        await mkdir(directory);
        await writeFile(join(directory, "tsconfig.json"), JSON.stringify({
            extends: "@crab-dev/standards-typescript-preset/tsconfig.browser.react.json",
            // Deliberately validate declaration files as well as source files.
            compilerOptions: { skipLibCheck: false },
            include: ["*.ts", "*.tsx"],
        }));
        await writeFile(join(directory, file), source);
        results.push(compile(name, [checker, "--project", directory]));
    }
    await writeFile(resultsPath, JSON.stringify(results, null, 4) + "\n");
    console.log(`Executed ${results.length} official TypeScript PnP fixtures; Wake Test will verify their results.`);
} finally {
    await rm(fixtures, { recursive: true, force: true });
}
