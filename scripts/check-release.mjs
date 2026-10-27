import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";

export function validateReleaseEvent(event, repository, head, actionSha) {
    const run = event.workflow_run;
    return run?.conclusion === "success" && run.event === "push" && run.head_branch === "canary"
        && run.head_repository?.full_name === repository && run.head_sha === head && actionSha === head;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        if (process.env.GITHUB_ACTIONS !== "true" || process.env.GITHUB_EVENT_NAME !== "workflow_run") throw new Error("Publishing requires the verified CI release workflow.");
        const { stdout } = await promisify(execFile)("git", ["rev-parse", "HEAD"], { windowsHide: true });
        const head = stdout.trim();
        const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, "utf8"));
        // Changesets also uses the action context SHA for its version branch and API tags.
        if (head !== process.env.CRAB_VERIFIED_SHA || !validateReleaseEvent(event, process.env.GITHUB_REPOSITORY, head, process.env.GITHUB_SHA)) throw new Error("The checkout and action context SHA must match the successful verification run for this repository's canary push.");
        console.log(`Release verification matches ${head}.`);
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
