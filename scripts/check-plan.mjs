import { requiredCheckScripts } from "./check-commands.mjs";

/** Public script names are the verification contract for local runs and CI. */
export const repositoryCheckPlan = [
    "check:architecture", "check:tokens", "check:generated:local", "lint",
    "build:library", "check:exports", "check:consumer", "typecheck", "test",
    "test:required", "docs:build",
];

export function workspaceCheckPlan(pkg) {
    const plan = [];
    if (pkg.scripts?.["build:library"]) plan.push({ root: true, args: ["exec", "turbo", "run", "build:library", `--filter=${pkg.name}`] });
    for (const script of new Set(["lint", "typecheck", "test", ...requiredCheckScripts(pkg)])) {
        if (pkg.scripts?.[script]) plan.push({ root: false, args: ["run", script] });
    }
    // L1 has no executable component suite; its data is checked by the token contract.
    if (pkg.name === "@crab-dev/rc-token-global") plan.push({ root: true, args: ["run", "check:tokens"] });
    if (pkg.private && pkg.scripts?.build) plan.push({ root: false, args: ["run", "build"] });
    return plan;
}
