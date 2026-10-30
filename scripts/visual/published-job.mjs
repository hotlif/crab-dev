import path from "node:path";
import { configureBrowserEnvironment } from './browser-environment.mjs';
import { mkdir, writeFile } from "node:fs/promises";
import { repositoryRoot } from "../library-manifest.mjs";
import { resolveYarnEntry, runYarn } from "../package-manager.mjs";
import { browserExecutable } from "../published-browser-runtime.mjs";

export function parsePublishedVisualOptions(args) {
    const options = Object.fromEntries(args.map(argument => {
        const match = /^--(package|fixture|api|colors|motion|validate-only)=(.+)$/.exec(argument);
        if (!match) throw Error("Use --package=PATH --fixture=PATH --api=__fixtureName [--colors=active|normal] [--motion=normal|reduce] [--validate-only=true]");
        return [match[1], match[2]];
    }));
    if (!options.package || !options.fixture || !/^__[A-Za-z0-9_]+$/.test(options.api ?? "")) throw Error("Missing package/fixture or invalid window API identifier");
    const colors = options.colors ?? "active", motion = options.motion ?? "normal";
    if (!["active", "normal"].includes(colors)) throw Error("Invalid colors mode: expected active or normal");
    if (!["normal", "reduce"].includes(motion) || (motion === "reduce" && colors === "active")) throw Error("Invalid motion mode: reduce requires colors=normal");
    if (options["validate-only"] !== undefined && options["validate-only"] !== "true") throw Error("validate-only must be true when provided");
    const packageRoot = path.resolve(options.package), entry = path.resolve(packageRoot, options.fixture);
    if (!entry.startsWith(packageRoot + path.sep)) throw Error("Fixture must be inside the declared package");
    return { packageRoot, entry, api: options.api, colors, forcedColors: colors === "active", reducedMotion: motion === "reduce", validateOnly: options["validate-only"] === "true", kind: "colors" };
}

/** Compatibility entry points delegate execution and reporting to Playwright Test. */
export async function runPublishedVisualJob(job) {
    if (job.validateOnly) {
        const { colors, forcedColors, reducedMotion, packageRoot, entry, api } = job;
        console.log(JSON.stringify({ colors, forcedColors, reducedMotion, packageRoot, entry, api }));
        return 0;
    }
    configureBrowserEnvironment();
    const suite = job.kind === "natural" ? "natural-motion" : job.reducedMotion ? "reduced-motion" : job.forcedColors ? "forced-colors" : "focus-colors";
    const output = path.join(job.packageRoot, ".cache", suite, new Date().toISOString().replaceAll(/[:.]/g, "-"));
    await mkdir(output, { recursive: true });
    const file = path.join(output, "job.json");
    // Prefer the framework's official cache, with installed Chrome retained as
    // the existing Windows fallback when no managed cache is configured.
    const browserPath = process.env.CRAB_TEST_BROWSER_PATH ?? (process.platform === "win32" && !process.env.PLAYWRIGHT_BROWSERS_PATH ? await browserExecutable() : undefined);
    await writeFile(file, JSON.stringify({ ...job, output, browserPath }, null, 2) + "\n", { flag: "wx" });
    const previous = process.env.CRAB_VISUAL_JOB;
    process.env.CRAB_VISUAL_JOB = file;
    // Yarn PnP uses an asynchronous ESM loader. Playwright's new synchronous
    // Node loader cannot consume its source result on Node 22.15. Use the
    // framework's async loader path; remove when both loader paths interoperate.
    process.env.PLAYWRIGHT_FORCE_ASYNC_LOADER ??= "1";
    try {
        const yarn = await resolveYarnEntry(process.env.npm_execpath);
        return await runYarn(yarn, ["exec", "playwright", "test", "--config", "test/visual/playwright.config.mjs", "--project", "chromium"], { cwd: repositoryRoot });
    } finally {
        if (previous === undefined) delete process.env.CRAB_VISUAL_JOB;
        else process.env.CRAB_VISUAL_JOB = previous;
        console.log(`Playwright published fixture evidence: ${output}`);
    }
}
