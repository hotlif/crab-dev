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

export function requiredTestArgs(checks, shard, browserShard) {
    if (browserShard === undefined) return checks.map(check => ({ ...check, args: [] }));
    const match = /^([1-9]\d*)\/([1-9]\d*)$/.exec(browserShard);
    if (shard !== "date-picker" || !match || Number(match[1]) > Number(match[2])
        || !checks.some(check => check.workspace === datePickerWorkspace && check.task === "test:browser")) {
        throw new Error("Expected a registered DatePicker browser suite and a valid --browser-shard INDEX/TOTAL.");
    }
    // Future non-browser checks on this workspace still run once.
    return checks.filter(check => check.task === "test:browser" || match[1] === "1")
        .map(check => ({ ...check, args: check.task === "test:browser" ? ["--shard", browserShard] : [] }));
}

export async function runRequiredChecks({ list = false, shard, browserShard } = {}) {
    // Validate every declaration before executing any task; malformed metadata must fail closed.
    const selected = requiredCheckShard(requiredCheckPlan(await readWorkspaceManifests()), shard);
    const checks = requiredTestArgs(selected, shard, browserShard);
    if (shard !== undefined && checks.length === 0) throw new Error(`Required check shard ${shard} is empty.`);
    if (list) {
        for (const { workspace, task, args } of checks) console.log(`${workspace}: ${[task, ...args].join(" ")}`);
        return checks.length;
    }
    const yarn = await resolveYarnEntry(process.env.npm_execpath);
    for (const { workspace, task, args } of checks) {
        console.log(`Required check: ${workspace} ${[task, ...args].join(" ")}`);
        const code = await runYarn(yarn, ["workspace", workspace, "run", task, ...args], { cwd: repositoryRoot, signalMessage: "Required check terminated by" });
        if (code !== 0) throw new Error(`${workspace} ${task} failed (${code}).`);
    }
    return checks.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        const { values: { list, shard, "browser-shard": browserShard } } = parseArgs({
            options: { list: { type: "boolean" }, shard: { type: "string" }, "browser-shard": { type: "string" } },
        });
        const count = await runRequiredChecks({ list, shard, browserShard });
        console.log(`${list ? "Listed" : "Passed"} ${count} required workspace checks.`);
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
