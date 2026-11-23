import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { readWorkspaceManifests, requiredCheckScripts } from "./check-commands.mjs";
import { repositoryRoot } from "./library-manifest.mjs";
import { resolveYarnEntry, runYarn } from "./package-manager.mjs";

const datePickerWorkspace = "@crab-dev/rc-date-picker";

export function requiredCheckPlan(workspaces) {
    return workspaces.flatMap(({ packageJson }) => requiredCheckScripts(packageJson).map((task) => ({ workspace: packageJson.name, task })));
}

export function requiredCheckShard(checks, shard) {
    if (shard === undefined) return checks;
    if (shard === "date-picker") return checks.filter(({ workspace }) => workspace === datePickerWorkspace);

    const match = /^([1-9]\d*)\/([1-9]\d*)$/.exec(shard);
    const index = Number(match?.[1]);
    const total = Number(match?.[2]);
    if (!Number.isSafeInteger(index) || !Number.isSafeInteger(total) || index > total) {
        throw new Error("Expected --shard date-picker or --shard INDEX/TOTAL with 1 <= INDEX <= TOTAL.");
    }

    const remaining = checks.filter(({ workspace }) => workspace !== datePickerWorkspace);
    // Keep each workspace's scripts together, including those sharing browser fixtures.
    const workspaces = [...new Set(remaining.map(({ workspace }) => workspace))];
    const selected = new Set(workspaces.filter((_, position) => position % total === index - 1));
    return remaining.filter(({ workspace }) => selected.has(workspace));
}

export async function runRequiredChecks({ list = false, shard } = {}) {
    // Validate every declaration before executing any task; malformed metadata must fail closed.
    const checks = requiredCheckShard(requiredCheckPlan(await readWorkspaceManifests()), shard);
    if (shard !== undefined && checks.length === 0) throw new Error(`Required check shard ${shard} is empty.`);
    if (list) {
        for (const { workspace, task } of checks) console.log(`${workspace}: ${task}`);
        return checks.length;
    }
    const yarn = await resolveYarnEntry(process.env.npm_execpath);
    for (const { workspace, task } of checks) {
        console.log(`Required check: ${workspace} ${task}`);
        const code = await runYarn(yarn, ["workspace", workspace, "run", task], { cwd: repositoryRoot, signalMessage: "Required check terminated by" });
        if (code !== 0) throw new Error(`${workspace} ${task} failed (${code}).`);
    }
    return checks.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        const { values: { list, shard } } = parseArgs({
            options: { list: { type: "boolean" }, shard: { type: "string" } },
        });
        const count = await runRequiredChecks({ list, shard });
        console.log(`${list ? "Listed" : "Passed"} ${count} required workspace checks.`);
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
