import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { repositoryRoot } from "./library-manifest.mjs";
import { resolveYarnEntry, runYarn } from "./package-manager.mjs";

export async function buildEnvironment({ root = repositoryRoot, platform = process.platform, env = process.env } = {}) {
    if (platform !== "win32") return { ...env };
    // Nested Yarn processes create xfs-* launchers before compilation starts.
    // Keep these in the writable checkout instead of the Windows user Temp directory.
    const temporary = resolve(root, ".tmp", "build-library");
    await mkdir(temporary, { recursive: true });
    return { ...env, TEMP: temporary, TMP: temporary, TMPDIR: temporary };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    const yarn = await resolveYarnEntry(process.env.npm_execpath);
    process.exitCode = await runYarn(yarn, ["exec", "turbo", "run", "build:library", "--concurrency=2", ...process.argv.slice(2)], {
        cwd: repositoryRoot,
        env: await buildEnvironment(),
    });
}
