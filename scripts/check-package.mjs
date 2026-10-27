import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { repositoryRoot } from "./library-manifest.mjs";
import { resolveYarnEntry } from "./package-manager.mjs";
import { requiredCheckScripts } from "./check-commands.mjs";

const directory = process.cwd();
const manifest = JSON.parse(await readFile(resolve(directory, "package.json"), "utf8"));
const additionalChecks = requiredCheckScripts(manifest);
const yarn = await resolveYarnEntry(process.env.npm_execpath);

async function run(args, cwd = directory) {
    const code = await new Promise((resolveExit, reject) => {
        const child = spawn(process.execPath, [yarn, ...args], { cwd, stdio: "inherit", windowsHide: true });
        child.once("error", reject);
        child.once("exit", (exitCode, signal) => signal ? reject(new Error(`Check terminated by ${signal}`)) : resolveExit(exitCode ?? 1));
    });
    if (code !== 0) process.exit(code);
}

// Build the selected package and its generated dependency closure before checking declarations.
if (manifest.scripts?.["build:library"]) {
    await run(["exec", "turbo", "run", "build:library", `--filter=${manifest.name}`], repositoryRoot);
}
for (const task of ["lint", "typecheck", "test"]) {
    if (manifest.scripts?.[task]) await run(["run", task]);
}
for (const task of additionalChecks) await run(["run", task]);
// L1 contains generated token data rather than executable components or component tests.
if (manifest.name === "@crab-dev/rc-token-global") await run(["run", "check:tokens"], repositoryRoot);
if (manifest.private && manifest.scripts?.build) await run(["run", "build"]);
