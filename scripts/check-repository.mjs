import { parseArgs } from "node:util";
import { repositoryCheckPlan, repositoryProjectCheckPlan } from "./check-plan.mjs";
import { repositoryRoot } from "./library-manifest.mjs";
import { resolveYarnEntry, runYarn } from "./package-manager.mjs";

const { values } = parseArgs({
    options: { list: { type: "boolean" }, "project-checks": { type: "boolean" }, "reuse-build": { type: "boolean" } },
});
const plan = values["project-checks"] ? repositoryProjectCheckPlan : repositoryCheckPlan;
if (values.list) {
    console.log(plan.map(script => `yarn ${script}`).join("\n"));
} else {
    const yarn = await resolveYarnEntry(process.env.npm_execpath);
    for (const script of plan) {
        const started = Date.now();
        console.log(process.env.GITHUB_ACTIONS ? `::group::${script}` : `Checking ${script}`);
        const args = values["reuse-build"] && script === "build:library" ? ["ci:build", "restore", "all"] : [script];
        const code = await runYarn(yarn, ["run", ...args], { cwd: repositoryRoot });
        console.log(`${script}: ${code === 0 ? "passed" : "failed"} (${((Date.now() - started) / 1000).toFixed(1)}s)`);
        if (process.env.GITHUB_ACTIONS) console.log("::endgroup::");
        if (code !== 0) { process.exitCode = code; break; }
    }
}
