import { test as base, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { readLibraryMetadata } from "../../scripts/library-manifest.mjs";
import { capturePublishedInputs } from "../../scripts/published-browser-inputs.mjs";
import { serveBrowserAssets } from "../../scripts/published-browser-runtime.mjs";

const job = JSON.parse(await fs.readFile(process.env.CRAB_VISUAL_JOB, "utf8"));
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const test = base.extend({
    published: [async ({}, use, workerInfo) => {
        const before = await capturePublishedInputs(job);
        const require = createRequire(path.join(job.packageRoot, "package.json")), wake = require("@crab-dev/wake");
        if (wake.version() !== "0.1.45") throw Error("Published fixture requires Wake 0.1.45");
        const css = JSON.parse(await fs.readFile(path.join(job.packageRoot, ".cache/browser-css.json"), "utf8"));
        if (typeof css !== "string" || !css.length) throw Error("Prepare actual published CSS before this check");
        const directory = path.join(job.output, `worker-${workerInfo.workerIndex}`);
        await fs.mkdir(directory, { recursive: true });
        const configPath = path.join(job.packageRoot, "scripts", job.kind === "natural" ? "natural-bundle" : "forced-colors-bundle", "wake.config.toml");
        const bundle = await wake.bundle({ cwd: job.packageRoot, configPath, entry: job.entry, outfile: path.join(directory, "fixture.js"), platform: "browser", format: "iife", minify: false, sourceMap: true, cache: false });
        if (typeof bundle.code !== "string") throw Error("Public bundle returned no code");
        const assets = new Map([
            ["/", { type: "text/html", body: '<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><link rel="stylesheet" href="/components.css"><title>Published component regression</title></head><body style="margin:0"><div id="root"></div><script defer src="/fixture.js"></script></body></html>' }],
            ["/fixture.js", { type: "text/javascript", body: bundle.code }],
            ["/components.css", { type: "text/css", body: css }],
        ]);
        const fixture = [];
        for (const [name, asset] of assets) {
            await fs.writeFile(path.join(directory, name === "/" ? "index.html" : name.slice(1)), asset.body);
            fixture.push({ path: name, sha256: hash(asset.body) });
        }
        const { server, origin } = await serveBrowserAssets(assets);
        try { await use({ origin, before, fixture }); }
        finally {
            await new Promise(resolve => server.close(resolve));
            const after = await capturePublishedInputs(job);
            await fs.writeFile(path.join(directory, "inputs.json"), JSON.stringify({ before, after, fixture, inputsStable: JSON.stringify(before) === JSON.stringify(after) }, null, 2));
            expect(after, "Source and published artifacts must remain unchanged during capture").toEqual(before);
        }
    }, { scope: "worker" }],
});

for (const { id: designSystem } of readLibraryMetadata().designSystems) for (const colorMode of ["light", "dark"]) {
    test(`${designSystem} ${colorMode} ${job.kind === "natural" ? "natural motion" : job.reducedMotion ? "reduced motion" : job.colors + " colors"}`, async ({ page, browser, published }, testInfo) => {
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        await page.emulateMedia({ colorScheme: colorMode, forcedColors: job.forcedColors ? "active" : "none", reducedMotion: job.reducedMotion ? "reduce" : "no-preference" });
        const url = published.origin + "/?" + new URLSearchParams({ designSystem, colorMode });
        await page.goto(url);
        await page.waitForFunction(api => Boolean(globalThis[api]), job.api);
        expect(await page.evaluate(() => globalThis.document.hasFocus())).toBe(true);
        const invoke = (method, argument) => page.evaluate(({ api, method, argument }) => globalThis[api][method](argument), { api: job.api, method, argument });
        const prepared = await invoke("prepare");
        const pulse = job.kind === "natural" ? await invoke("observe") : undefined;
        const beforeCapture = await invoke("snapshot");
        const bytes = await page.screenshot({ animations: "allow", caret: "initial", scale: "css" });
        await testInfo.attach("actual", { body: bytes, contentType: "image/png" });
        const afterCapture = await invoke("snapshot");
        const geometry = snapshot => job.kind === "natural"
            ? snapshot.cards.map(card => [card.rect, card.leaves.map(leaf => leaf.rect)])
            : snapshot.subjects.map(subject => [subject.id, subject.rect, subject.glyphs?.map(glyph => glyph.rect)]);
        expect(afterCapture.href).toBe(url);
        expect(beforeCapture.href).toBe(url);
        expect(geometry(afterCapture)).toEqual(geometry(beforeCapture));
        expect(bytes.readUInt32BE(16)).toBe(1280);
        expect(bytes.readUInt32BE(20)).toBe(720);
        let pixels, afterPixels, overrides;
        if (job.kind === "natural") {
            expect(beforeCapture.normalMotion).toBe(true);
            expect(afterCapture.normalMotion).toBe(true);
            overrides = await invoke("overrides");
        } else {
            for (const snapshot of [prepared, beforeCapture, afterCapture]) validateSnapshot(snapshot, url);
            if (!job.forcedColors) expect(afterCapture.stability).toEqual(beforeCapture.stability);
            pixels = await invoke("inspectPixels", bytes.toString("base64"));
            afterPixels = await invoke("snapshot");
            validateSnapshot(afterPixels, url);
            expect(geometry(afterPixels)).toEqual(geometry(afterCapture));
            if (!job.forcedColors) expect(afterPixels.stability).toEqual(afterCapture.stability);
        }
        expect(errors, "Browser runtime errors").toEqual([]);
        await testInfo.attach("evidence", { body: JSON.stringify({ config: { designSystem, colorMode }, prepared, pulse, beforeCapture, afterCapture, afterPixels, pixels, overrides, source: published.before, fixture: published.fixture, screenshot: { sha256: hash(bytes), width: 1280, height: 720 }, browser: browser.version(), visualReview: "pending" }, null, 2), contentType: "application/json" });
    });
}

function validateSnapshot(snapshot, url) {
    expect(snapshot.href).toBe(url);
    expect(snapshot.forcedColors).toBe(Boolean(job.forcedColors));
    if (!job.forcedColors) {
        expect(snapshot.reducedMotion).toBe(Boolean(job.reducedMotion));
        expect(snapshot.stability).toBeTruthy();
    }
    expect(snapshot.viewport).toEqual({ width: 1280, height: 720, dpr: 1 });
    expect(snapshot.subjects.length).toBeGreaterThan(0);
    for (const subject of snapshot.subjects) {
        expect(typeof subject.id).toBe("string");
        for (const key of ["left", "top", "right", "bottom", "width", "height"]) expect(Number.isFinite(subject.rect[key])).toBe(true);
        expect(subject.rect.width).toBeGreaterThan(0);
        expect(subject.rect.height).toBeGreaterThan(0);
        expect(subject.rect.left).toBeGreaterThanOrEqual(0);
        expect(subject.rect.top).toBeGreaterThanOrEqual(0);
        expect(subject.rect.right).toBeLessThanOrEqual(1280);
        expect(subject.rect.bottom).toBeLessThanOrEqual(720);
    }
}

