import { test as base, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { createDocsPreview } from "../../.website/scripts/dev/preview-docs.mjs";
import { readLibraryMetadata, repositoryRoot } from "../../scripts/library-manifest.mjs";
import { captureVisualInputs } from "../../scripts/visual/evidence-inputs.mjs";
import { validateVisualSpec } from "../../scripts/visual/specification.mjs";
import { zoomFixtures } from "./zoom-fixture.mjs";
import { inspectBrowserRendering } from './browser-capabilities.mjs';

export { expect };
export { environmentCases, applyEnvironment } from "./environments.mjs";
export const configurations = readLibraryMetadata().designSystems.flatMap(({ id: designSystem }) => ["light", "dark"].map(colorMode => ({ designSystem, colorMode })));

export async function openDemo(page, origin, slug, demo, configuration) {
    const response = await page.goto(`${origin}/components/${slug}/workbench/?__wake_demo=${encodeURIComponent(`docs/demos/${demo}`)}`);
    expect(response.status()).toBe(200);
    const root = page.locator(".demo-default-preview").first();
    await expect(root).toBeVisible();
    const config = { type: "crab:preview-config", size: "medium", density: "standard", locale: "zh-CN", direction: "ltr", brandColor: null, ...configuration };
    await page.emulateMedia({ colorScheme: config.colorMode });
    await page.evaluate(config => globalThis.postMessage(config, globalThis.location.origin), config);
    await expect(root).toHaveAttribute("data-crab-design", config.designSystem);
    await expect(root).toHaveAttribute("data-theme", config.colorMode);
    await expect(root).toHaveAttribute("data-crab-size", config.size);
    await expect(root).toHaveAttribute("data-crab-density", config.density);
    await page.evaluate(() => globalThis.document.fonts.ready);
    await settleFiniteAnimations(page);
    return root;
}

export async function settleFiniteAnimations(page) {
    await expect.poll(() => page.evaluate(() => globalThis.document.getAnimations().filter(animation => animation.playState === "running" && Number.isFinite(animation.effect?.getComputedTiming().endTime)).length), { message: "Finite transitions settle naturally" }).toBe(0);
}

/** Capture/comparison policy is shared; each package chooses its meaningful boundary. */
export async function captureVisual(target, name, info) {
    await attachSnapshotTarget(info, name);
    if (process.env.CRAB_VISUAL_CANDIDATE !== "1") {
        await expect(target).toHaveScreenshot(name, { animations: "allow", caret: "hide" });
    } else {
        await info.attach("actual", { body: await target.screenshot({ animations: "allow", caret: "hide" }), contentType: "image/png" });
    }
}

export const test = base.extend({
    renderingEnvironment: [async ({ browser, browserName }, use, workerInfo) => {
        const record = await inspectBrowserRendering(browser);
        const file = path.join(path.dirname(workerInfo.project.outputDir), `rendering-worker-${workerInfo.workerIndex}.json`);
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, JSON.stringify({ ...record, browserName, image: process.env.CRAB_VISUAL_IMAGE }, null, 2));
        if (process.env.CRAB_VISUAL_REQUIRE_WEBGL2 === '1') expect(record.webgl2 && record.drawn && record.error === 0, `Real WebGL2 drawing is required; see ${file}`).toBe(true);
        await use({ file, browserName, browser: record.browser });
    }, { scope: 'worker', timeout: 120_000 }],
    visualInputs: [async ({ renderingEnvironment }, use, workerInfo) => {
        const before = await captureVisualInputs();
        const file = path.join(path.dirname(workerInfo.project.outputDir), `inputs-worker-${workerInfo.workerIndex}.json`);
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, JSON.stringify({ before, status: "capturing" }, null, 2));
        try { await use({ source: before.source.fingerprint, artifact: before.artifact.fingerprint, ...(before.siteBuild ? { siteBuild: before.siteBuild.fingerprint } : {}), file, renderingEnvironment }); }
        finally {
            const after = await captureVisualInputs();
            const stable = JSON.stringify(before) === JSON.stringify(after);
            await fs.writeFile(file, JSON.stringify({ before, after, stable }, null, 2));
            expect(stable, "Visual source and artifacts must be unchanged during capture").toBe(true);
        }
    }, { scope: "worker", timeout: 120_000 }],
    previewOrigin: [async ({ visualInputs }, use) => {
        if (!visualInputs.source || !visualInputs.artifact) throw Error("Missing visual input fingerprints");
        const server = createDocsPreview({ root: process.env.CRAB_VISUAL_WORKBENCH_ROOT, base: process.env.CRAB_VISUAL_WORKBENCH_BASE });
        await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
        try { await use(`http://127.0.0.1:${server.address().port}`); }
        finally { await new Promise(resolve => server.close(resolve)); }
    }, { scope: "worker" }],
    runtimeErrors: [async ({ page }, use, info) => {
        const errors = [], consoleErrors = [];
        page.on("pageerror", error => errors.push(error.message));
        page.on("console", message => { if (message.type() === "error") consoleErrors.push({ text: message.text(), location: message.location() }); });
        await use(errors);
        if (consoleErrors.length) await info.attach('browser-console', { body: JSON.stringify(consoleErrors), contentType: 'application/json' });
        expect(errors, "Browser runtime errors").toEqual([]);
    }, { auto: true }],
    evidence: [async ({ visualInputs, context, browserName }, use, info) => {
        await use();
        await info.attach("candidate-inputs", { body: JSON.stringify({ ...visualInputs, browserName, browser: context.browser()?.version(), platform: process.platform, arch: process.arch, image: process.env.CRAB_VISUAL_IMAGE, mode: process.env.CRAB_VISUAL_MODE, visualReview: "pending" }, null, 2), contentType: "application/json" });
    }, { auto: true }],
});
export const zoomTest = test.extend(zoomFixtures);

export async function captureZoom(page, realZoom, name, info) {
    await attachSnapshotTarget(info, name);
    const body = await realZoom.capture200(page);
    await info.attach('actual-zoom-200', { body, contentType: 'image/png' });
    if (process.env.CRAB_VISUAL_CANDIDATE !== '1') expect(body).toMatchSnapshot(name, { maxDiffPixels: 0 });
}

async function attachSnapshotTarget(info, name) {
    await info.attach('snapshot-target', { body: JSON.stringify({ name, path: path.relative(repositoryRoot, info.snapshotPath(name)).replaceAll('\\', '/') }), contentType: 'application/json' });
}

/** Matrix axes are component-owned; no central component-name switch table. */
export async function readVisualSpec(url) {
    const spec = JSON.parse(await fs.readFile(new URL("visual.json", url), "utf8"));
    const demos = await fs.readdir(new URL("demos/", url));
    const errors = validateVisualSpec(spec, demos);
    if (errors.length) throw Error(`${url}: ${errors.join("; ")}`);
    return spec;
}
