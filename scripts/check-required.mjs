import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { readWorkspaceManifests, requiredCheckScripts } from "./check-commands.mjs";
import { repositoryRoot } from "./library-manifest.mjs";
import { resolveYarnEntry } from "./package-manager.mjs";

export function requiredCheckPlan(workspaces) {
    return workspaces.flatMap(({ packageJson }) => requiredCheckScripts(packageJson).map((task) => ({ workspace: packageJson.name, task })));
}

export async function runRequiredChecks({ list = false } = {}) {
    // Validate every declaration before executing any task; malformed metadata must fail closed.
    const checks = requiredCheckPlan(await readWorkspaceManifests());
    if (list) {
        for (const { workspace, task } of checks) console.log(`${workspace}: ${task}`);
        return checks.length;
    }
    const yarn = await resolveYarnEntry(process.env.npm_execpath);
    for (const { workspace, task } of checks) {
        console.log(`Required check: ${workspace} ${task}`);
        const code = await new Promise((resolveExit, reject) => {
            const child = spawn(process.execPath, [yarn, "workspace", workspace, "run", task], { cwd: repositoryRoot, stdio: "inherit", windowsHide: true });
            child.once("error", reject);
            child.once("exit", (exitCode, signal) => signal ? reject(new Error(`Required check terminated by ${signal}`)) : resolveExit(exitCode ?? 1));
        });
        if (code !== 0) throw new Error(`${workspace} ${task} failed (${code}).`);
    }
    return checks.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        if (process.argv.slice(2).some((argument) => argument !== "--list")) throw new Error("Only --list is supported.");
        const list = process.argv.includes("--list");
        const count = await runRequiredChecks({ list });
        console.log(`${list ? "Listed" : "Passed"} ${count} required workspace checks.`);
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
