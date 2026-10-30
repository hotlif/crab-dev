import { test, expect, openDemo } from "./component-fixture.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { loadLibraryManifest } from "../../scripts/library-manifest.mjs";

// Inventory is a prerequisite, never a substitute for a component's state/size
// matrix or reviewed pixel baselines. Product membership comes from the manifest.
const manifest = await loadLibraryManifest();

for (const product of manifest.packages.filter(entry => Object.values(entry.designCoverage).some(value => value !== "not-applicable") && (!process.env.CRAB_VISUAL_PACKAGE || entry.slug === process.env.CRAB_VISUAL_PACKAGE))) {
    const directory = path.join(product.directory, "docs/demos");
    const demos = (await fs.readdir(directory)).filter(name => name.endsWith(".demo.tsx")).sort();
    let presentation;
    try { presentation = JSON.parse(await fs.readFile(path.join(product.directory, "docs/presentation.json"), "utf8")); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
    const demo = presentation?.heroDemo ?? demos.find(name => /^(?:basic|base|basis|simple)\.demo\.tsx$/.test(name)) ?? demos[0];
    if (!demo || !demos.includes(demo)) throw Error(`${product.name}: missing inventory demo`);
    for (const { id: designSystem } of manifest.designSystems) for (const colorMode of ["light", "dark"]) {
        test(`${product.slug} ${designSystem} ${colorMode}`, { tag: ["@inventory", `@${product.slug}`] }, async ({ page, browser, previewOrigin }, testInfo) => {
            const config = { type: "crab:preview-config", designSystem, colorMode, size: "medium", density: "standard", locale: "zh-CN", direction: "ltr", brandColor: null };
            const root = await openDemo(page, previewOrigin, product.slug, demo, config);
            const box = await root.boundingBox();
            expect(box.width).toBeGreaterThan(0);
            expect(box.height).toBeGreaterThan(0);
            const bytes = await page.screenshot({ animations: "allow", caret: "initial", scale: "css" });
            await testInfo.attach("inventory-actual", { body: bytes, contentType: "image/png" });
            await testInfo.attach("inventory-scope", { body: JSON.stringify({ package: product.name, demo, config, box, browser: browser.version(), sha256: createHash("sha256").update(bytes).digest("hex"), visualReview: "pending", scope: "Default demo viewport only; no state/size acceptance or pixel baseline approval." }, null, 2), contentType: "application/json" });
        });
    }
}

