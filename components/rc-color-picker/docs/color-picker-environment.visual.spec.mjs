import { test, expect, configurations, environmentCases, applyEnvironment, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";
import { commitHexPreservingAlpha } from "./color-picker-assertions.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const environment of environmentCases) test.describe(environment.id, () => {
    test.use({ hasTouch: environment.hasTouch ?? false });
    for (const config of configurations) test(`${config.designSystem} ${config.colorMode} ${environment.id}`, { tag: ["@rc-color-picker", "@environment"], annotation: { type: "environment", description: JSON.stringify({ id: environment.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await applyEnvironment(page, environment);
        await openDemo(page, previewOrigin, "rc-color-picker", spec.demo, { ...config, ...environment.config });
        const trigger = page.getByRole("button", { name: "主题颜色", exact: true }); if (environment.hasTouch) { const rect = await trigger.boundingBox(); expect(rect.width).toBeGreaterThanOrEqual(44); expect(rect.height).toBeGreaterThanOrEqual(44); await trigger.tap(); } else await trigger.click();
        const dialog = page.getByRole("dialog"); await expect(dialog).toBeVisible(); await expect(dialog.getByRole("slider")).toHaveCount(4); const boundary = dialog.locator("xpath=ancestor::*[@data-state][1]"); const rect = await boundary.boundingBox(); expect(rect.x).toBeGreaterThanOrEqual(0); expect(rect.x + rect.width).toBeLessThanOrEqual(page.viewportSize().width);
        await commitHexPreservingAlpha(page, dialog, "#123456");
        await settleFiniteAnimations(page); await captureVisual(page, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
        await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
    });
});
