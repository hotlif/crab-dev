import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { repositoryRoot } from "./library-manifest.mjs";
import { resolveYarnEntry, runYarn } from "./package-manager.mjs";
import { workspaceCheckPlan } from "./check-plan.mjs";

const directory = process.cwd();
const manifest = JSON.parse(await readFile(resolve(directory, "package.json"), "utf8"));
const plan = workspaceCheckPlan(manifest);
const yarn = await resolveYarnEntry(process.env.npm_execpath);

async function run(args, cwd = directory) {
    const code = await runYarn(yarn, args, { cwd });
    if (code !== 0) process.exit(code);
}

for (const step of plan) await run(step.args, step.root ? repositoryRoot : directory);
