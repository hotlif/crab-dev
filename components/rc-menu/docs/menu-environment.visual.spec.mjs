import { test, expect, configurations, environmentCases, applyEnvironment, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const environment of environmentCases) test.describe(environment.id, () => {
    test.use({ hasTouch: environment.hasTouch ?? false });
    for (const config of configurations) test(`${config.designSystem} ${config.colorMode} ${environment.id}`, { tag: ["@rc-menu", "@environment"], annotation: { type: "environment", description: JSON.stringify({ id: environment.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await applyEnvironment(page, environment);
        await openDemo(page, previewOrigin, "rc-menu", spec.demo, { ...config, ...environment.config });
        const first = page.getByRole("button", { name: "总览 Overview", exact: true }); if (environment.hasTouch) { expect((await first.boundingBox()).height).toBeGreaterThanOrEqual(44); await first.tap(); } else await first.click(); await expect(first).toHaveAttribute("aria-current", "page"); const rect = await first.boundingBox(); expect(rect.x).toBeGreaterThanOrEqual(0); expect(rect.x + rect.width).toBeLessThanOrEqual(page.viewportSize().width);
        const parent = page.getByRole("button", { name: "项目 Projects", exact: true }); await parent.click(); await expect(parent).toHaveAttribute("aria-expanded", "true"); await expect(page.getByRole("button", { name: "进行中 Active", exact: true })).toBeVisible();
        await settleFiniteAnimations(page); await captureVisual(page, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
    });
});
