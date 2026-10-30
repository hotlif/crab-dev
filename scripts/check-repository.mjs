import { repositoryCheckPlan } from "./check-plan.mjs";
import { repositoryRoot } from "./library-manifest.mjs";
import { resolveYarnEntry, runYarn } from "./package-manager.mjs";
import { inspectVisualStorage } from './visual/local-storage.mjs';

if (process.argv.includes("--list")) {
    console.log(repositoryCheckPlan.map(script => `yarn ${script}`).join("\n"));
} else {
    await inspectVisualStorage(repositoryRoot, 'repository');
    const yarn = await resolveYarnEntry(process.env.npm_execpath);
    for (const script of repositoryCheckPlan) {
        const started = Date.now();
        console.log(process.env.GITHUB_ACTIONS ? `::group::${script}` : `Checking ${script}`);
        const code = await runYarn(yarn, ["run", script], { cwd: repositoryRoot });
        console.log(`${script}: ${code === 0 ? "passed" : "failed"} (${((Date.now() - started) / 1000).toFixed(1)}s)`);
        if (process.env.GITHUB_ACTIONS) console.log("::endgroup::");
        if (code !== 0) { process.exitCode = code; break; }
    }
}
