import { test, expect, configurations, environmentCases, applyEnvironment, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const environment of environmentCases) test.describe(environment.id, () => {
    test.use({ hasTouch: environment.hasTouch ?? false });
    for (const config of configurations) test(`${config.designSystem} ${config.colorMode} ${environment.id}`, { tag: ["@rc-tooltip", "@environment"], annotation: { type: "environment", description: JSON.stringify({ id: environment.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await applyEnvironment(page, environment);
        await openDemo(page, previewOrigin, "rc-tooltip", spec.demo, { ...config, ...environment.config });
        await page.getByLabel("验收状态", { exact: true }).selectOption("long-text"); const trigger = page.getByRole("button", { name: "提示触发器", exact: true }); if (environment.hasTouch) { expect((await trigger.boundingBox()).height).toBeGreaterThanOrEqual(44); await trigger.tap(); await expect(trigger).toBeFocused(); } else await trigger.hover();
        // Touch has no hover requirement; keyboard focus is the real Web fallback.
        if (environment.hasTouch) { await page.getByLabel("验收状态", { exact: true }).focus(); await page.keyboard.press("Tab"); }
        const tip = page.getByRole("tooltip"); await expect(tip).toBeVisible(); const rect = await tip.boundingBox(); expect(rect.x).toBeGreaterThanOrEqual(0); expect(rect.x + rect.width).toBeLessThanOrEqual(page.viewportSize().width);
        await settleFiniteAnimations(page); await captureVisual(page, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
        await page.keyboard.press("Escape"); await expect(tip).not.toBeVisible();
    });
});
