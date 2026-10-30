import { test, expect, configurations, environmentCases, applyEnvironment, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const environment of environmentCases) test.describe(environment.id, () => {
    test.use({ hasTouch: environment.hasTouch ?? false });
    for (const config of configurations) test(`${config.designSystem} ${config.colorMode} ${environment.id}`, { tag: ["@rc-drawer", "@environment"], annotation: { type: "environment", description: JSON.stringify({ id: environment.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await applyEnvironment(page, environment);
        await openDemo(page, previewOrigin, "rc-drawer", spec.demo, { ...config, ...environment.config });
        await page.getByLabel("长内容", { exact: true }).check(); const trigger = page.getByRole("button", { name: "打开验收抽屉", exact: true }); if (environment.hasTouch) await trigger.tap(); else await trigger.click();
        const dialog = page.getByRole("dialog"); const panel = dialog.getByRole("document"); await expect(panel).toBeVisible(); await settleFiniteAnimations(page); const rect = await panel.boundingBox(); expect(rect.x).toBeGreaterThanOrEqual(-1); expect(rect.x + rect.width).toBeLessThanOrEqual(page.viewportSize().width + 1); await expect(dialog.getByRole("button", { name: "保存草稿" })).toBeInViewport(); if (environment.hasTouch) { const close = await dialog.getByRole("button").first().boundingBox(); expect(close.width).toBeGreaterThanOrEqual(44); expect(close.height).toBeGreaterThanOrEqual(44); }
        await settleFiniteAnimations(page); await captureVisual(page, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
        await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
    });
});
