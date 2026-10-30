import { defineConfig } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { repositoryRoot } from "../../scripts/library-manifest.mjs";
import { linuxVisualImage } from '../../scripts/visual/environment.mjs';

const job = process.env.CRAB_VISUAL_JOB ? JSON.parse(readFileSync(process.env.CRAB_VISUAL_JOB, "utf8")) : undefined;
const output = job?.output ?? path.join(repositoryRoot, ".cache/visual", process.env.CRAB_VISUAL_RUN ?? "current");
const browserPath = process.env.CRAB_TEST_BROWSER_PATH ?? job?.browserPath;
const selected = process.env.CRAB_VISUAL_PACKAGE;

export default defineConfig({
    testDir: job ? "." : repositoryRoot,
    testMatch: job ? "published.spec.mjs" : selected ? ["test/visual/inventory.visual.spec.mjs", `components/${selected}/docs/*.visual.spec.mjs`] : ["test/visual/*.visual.spec.mjs", "components/*/docs/*.visual.spec.mjs", ".website/docs/site/*.visual.spec.mjs"],
    testIgnore: ["**/.tmp/**", "**/.yarn/**", "**/.cache/**", "**/.website/review/**", "**/.reports/**"],
    respectGitIgnore: true,
    outputDir: path.join(output, "results"),
    snapshotPathTemplate: path.join(repositoryRoot, "test/visual/baselines/{platform}/{projectName}/{testFilePath}/{arg}{ext}"),
    updateSnapshots: "none",
    forbidOnly: true,
    fullyParallel: true,
    retries: 0,
    maxFailures: 35,
    workers: 4,
    timeout: 45_000,
    expect: { timeout: 10_000, toHaveScreenshot: { animations: "allow", caret: "hide", scale: "css", maxDiffPixels: 0 } },
    reporter: [["list"], ["html", { outputFolder: path.join(output, "report"), open: "never" }], ["json", { outputFile: path.join(output, "results.json") }], ["./matrix-reporter.mjs"]],
    use: {
        viewport: { width: 1280, height: 720 },
        locale: "zh-CN",
        timezoneId: "Asia/Shanghai",
        reducedMotion: "no-preference",
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
        // Static failures retain screenshots and native trace. Recording every
        // static case wastes an encoder; motion and real-zoom fixtures opt in.
        video: job?.kind === "natural" ? "on" : "off",
    },
    projects: ["chromium", "firefox", "webkit"].map(browserName => ({
        name: browserName,
        ...(browserName !== "chromium" ? { grepInvert: /@chromium-only/ } : {}),
        use: {
            browserName,
            ...(browserName === 'chromium' ? { channel: 'chromium' } : {}),
            ...(browserName === 'firefox' && process.env.CRAB_VISUAL_IMAGE === linuxVisualImage ? { headless: false } : {}),
            // Worker browser startup has its own timeout, outside test.timeout.
            launchOptions: { timeout: 30_000, ...(browserName === 'chromium' && browserPath ? { executablePath: browserPath } : {}) },
        },
    })),
});
