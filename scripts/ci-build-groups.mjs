import { execFile } from "node:child_process";
import { copyFile, mkdir, readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { buildEnvironment } from "./build-library.mjs";
import { repositoryRoot } from "./library-manifest.mjs";
import { resolveYarnEntry, runYarn } from "./package-manager.mjs";

const taskSuffix = "#build:library";
const datePicker = "@crab-dev/rc-date-picker";

// Distribute the top-level builds, then build their common prerequisites once.
// DatePicker belongs to the first batch so its browser suite can start early.
export function packageBuildGroups(tasks) {
    const dependencies = new Map(Object.entries(tasks)
        .filter(([id]) => id.endsWith(taskSuffix))
        .map(([id, task]) => [id.slice(0, -taskSuffix.length), task.dependsOn.map(dep => dep.slice(0, -taskSuffix.length))]));
    const prerequisites = new Set([...dependencies.values()].flat());
    const leaves = [...dependencies.keys()].filter(name => !prerequisites.has(name)).sort();
    const owners = new Map();
    function assign(name, group) {
        if (!owners.has(name)) owners.set(name, new Set());
        const groups = owners.get(name);
        if (groups.has(group)) return;
        groups.add(group);
        for (const dep of dependencies.get(name)) assign(dep, group);
    }
    const groups = { shared: [], "group-1": [], "group-2": [], "group-3": [] };
    leaves.forEach((name, index) => assign(name, `group-${index % 3 + 1}`));
    assign(datePicker, "shared");
    for (const name of [...dependencies.keys()].sort()) {
        const ids = owners.get(name);
        if (!ids) throw new Error(`No CI build group owns ${name}.`);
        groups[ids.size > 1 ? "shared" : [...ids][0]].push(name);
    }
    return groups;
}

async function run(mode, group) {
    const { tasks } = JSON.parse(await readFile(join(repositoryRoot, "turbo.json"), "utf8"));
    const groups = packageBuildGroups(tasks);
    const restoring = mode === "restore";
    const packages = restoring && group === "all" ? Object.values(groups).flat() : groups[group];
    if ((!restoring && mode !== "build") || !Array.isArray(packages) || !packages.length) {
        throw new Error("Use build <group> or restore <group|all>.");
    }
    const selected = new Set(packages);
    const filters = packages.map(name => `--filter=${name}`);
    const yarn = await resolveYarnEntry(process.env.npm_execpath);
    const cacheDir = join(repositoryRoot, ".turbo", "cache");
    const env = { ...await buildEnvironment(), TURBO_CACHE_DIR: cacheDir };
    const command = ["exec", "turbo", "run", "build:library", ...filters];
    const { stdout } = await promisify(execFile)(process.execPath, [yarn, ...command, "--dry=json"], {
        cwd: repositoryRoot, env, windowsHide: true, maxBuffer: 16 * 1024 * 1024,
    });
    const plan = JSON.parse(stdout).tasks;
    for (const task of plan) {
        if ((restoring || !selected.has(task.package)) && !task.cache.local) {
            throw new Error(`Missing build artifact for ${task.taskId} (${task.hash}).`);
        }
    }
    const owned = plan.filter(task => selected.has(task.package));
    if (owned.length !== selected.size) throw new Error("Turbo's build plan does not cover the selected packages.");
    console.log(`${restoring ? "Restoring" : "Building"} ${group}: ${packages.join(", ")}`);
    const code = await runYarn(yarn, [...command, "--concurrency=2", "--output-logs=new-only"], { cwd: repositoryRoot, env });
    if (code !== 0) throw new Error(`Turbo build failed (${code}).`);
    if (restoring) return;

    // Transfer only this group's Turbo records, including package-specific outputs
    // such as PDF runtime assets. Shared records have a single artifact owner.
    const destination = join(repositoryRoot, ".tmp", "ci-build", group);
    await mkdir(destination, { recursive: true });
    const hashes = new Set(owned.map(task => task.hash));
    for (const file of await readdir(cacheDir)) {
        if (hashes.has(file.split(/[-.]/, 1)[0])) await copyFile(join(cacheDir, file), join(destination, file));
    }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    await run(...process.argv.slice(2));
}
