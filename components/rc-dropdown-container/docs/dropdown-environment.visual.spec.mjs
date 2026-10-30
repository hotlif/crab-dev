import { test, expect, configurations, environmentCases, applyEnvironment, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const environment of environmentCases) test.describe(environment.id, () => {
    test.use({ hasTouch: environment.hasTouch ?? false });
    for (const config of configurations) test(`${config.designSystem} ${config.colorMode} ${environment.id}`, { tag: ["@rc-dropdown-container", "@environment"], annotation: { type: "environment", description: JSON.stringify({ id: environment.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await applyEnvironment(page, environment);
        await openDemo(page, previewOrigin, "rc-dropdown-container", spec.demo, { ...config, ...environment.config });
        const trigger = page.getByRole("button", { name: "打开验收浮层", exact: true }); if (environment.hasTouch) { expect((await trigger.boundingBox()).height).toBeGreaterThanOrEqual(44); await trigger.tap(); } else await trigger.click();
        const popup = page.getByRole("dialog", { name: "浮层内容" }); await expect(popup).toBeVisible(); const rect = await popup.boundingBox(); expect(rect.x).toBeGreaterThanOrEqual(0); expect(rect.x + rect.width).toBeLessThanOrEqual(page.viewportSize().width); const input = popup.getByRole("textbox", { name: "浮层草稿" }); await input.fill("保持草稿 Draft");
        await settleFiniteAnimations(page); await captureVisual(page, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
        await input.press("Escape"); await expect(popup).not.toBeVisible(); await expect(trigger).toBeFocused();
    });
});
