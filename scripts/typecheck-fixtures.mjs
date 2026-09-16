import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, unlink, writeFile } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repository = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspace = join(repository, "standards", "typescript-preset");
const runner = join(repository, "scripts", "typecheck.mjs");
const temporaryRoot = join(workspace, ".tmp");
const resultsPath = join(temporaryRoot, "typecheck-results.json");
await mkdir(temporaryRoot, { recursive: true });
await unlink(resultsPath).catch(error => {
    if (error.code !== "ENOENT") throw error;
});
const fixtures = await mkdtemp(join(temporaryRoot, "native-pnp-"));
if (!resolve(fixtures).startsWith(temporaryRoot + sep)) throw new Error("Unexpected fixture cleanup path");

function compile(name, args) {
    const result = spawnSync(process.execPath, [runner, ...args], {
        cwd: workspace, encoding: "utf8", timeout: 30000, windowsHide: true,
    });
    if (result.error) throw result.error;
    if (result.signal || result.status === null) throw new Error(`Compiler fixture ${name} was interrupted`);
    return { name, code: result.status, output: result.stdout + result.stderr };
}

try {
    const results = [compile("version", ["--version"])];
    const cases = [
        ["valid", "index.tsx", 'import type { ReactNode } from "react";\nexport const view: ReactNode = <button>Save</button>;\n'],
        ["invalid-type", "index.ts", 'export const count: number = "three";\n'],
        ["strict-null", "index.ts", "export const count: number = null;\n"],
        ["missing-package", "index.ts", 'export { missing } from "crab-undeclared-typecheck-fixture";\n'],
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
        results.push(compile(name, ["--noEmit", "--pretty", "false", "--project", directory]));
    }
    await writeFile(resultsPath, JSON.stringify(results, null, 4) + "\n");
    console.log(`Executed ${results.length} native TypeScript 7 fixtures; Wake Test will verify their results.`);
} finally {
    await rm(fixtures, { recursive: true, force: true });
}
