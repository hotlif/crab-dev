import { test, expect, configurations, environmentCases, applyEnvironment, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const environment of environmentCases) test.describe(environment.id, () => {
    test.use({ hasTouch: environment.hasTouch ?? false });
    for (const config of configurations) test(`${config.designSystem} ${config.colorMode} ${environment.id}`, { tag: ["@rc-dialog", "@environment"], annotation: { type: "environment", description: JSON.stringify({ id: environment.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await applyEnvironment(page, environment);
        await openDemo(page, previewOrigin, "rc-dialog", spec.demo, { ...config, ...environment.config });
        await page.getByLabel("验收状态", { exact: true }).selectOption("long-content"); const trigger = page.getByRole("button", { name: "打开验收对话框", exact: true }); if (environment.hasTouch) await trigger.tap(); else await trigger.click();
        const dialog = page.getByRole("dialog"); const confirm = dialog.locator('[data-dialog-action="confirm"]'); await confirm.scrollIntoViewIfNeeded(); await expect(confirm).toBeInViewport(); const rect = await dialog.boundingBox(); expect(rect.x).toBeGreaterThanOrEqual(0); expect(rect.x + rect.width).toBeLessThanOrEqual(page.viewportSize().width); if (environment.hasTouch) expect((await confirm.boundingBox()).height).toBeGreaterThanOrEqual(44);
        await settleFiniteAnimations(page); await captureVisual(page, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
        await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
    });
});
