import { test, expect, configurations, openDemo, readVisualSpec } from "../../../test/visual/component-fixture.mjs";

test.use({ video: "on" });
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) test(`${config.designSystem} ${config.colorMode} ${size} ${density} loading`, { tag: ["@rc-select", "@matrix", "@chromium-only"], annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density, state: "loading" }) } }, async ({ page, previewOrigin }, info) => {
    await openDemo(page, previewOrigin, "rc-select", spec.demo, { ...config, size, density });
    await page.getByLabel("验收状态", { exact: true }).selectOption("loading");
    const field = page.getByRole("combobox", { name: "团队 Team", exact: true }); await expect(field).toHaveAttribute("aria-busy", "true");
    await expect(field).toHaveAttribute("aria-disabled", "false");
    await field.click({ position: { x: 12, y: 12 } }); await expect(field).toHaveAttribute("aria-expanded", "true");
    const popup = page.getByRole("listbox"); await expect(popup).toBeVisible(); await expect(popup).toHaveAttribute("aria-busy", "true");
    for (let frame = 0; frame < 2; frame++) { await page.waitForTimeout(250); await info.attach(`natural-loading-frame-${frame}`, { body: await page.screenshot({ animations: "allow", caret: "hide" }), contentType: "image/png" }); }
});
