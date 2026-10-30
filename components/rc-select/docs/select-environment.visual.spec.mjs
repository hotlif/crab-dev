import { test, expect, configurations, environmentCases, applyEnvironment, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const environment of environmentCases) test.describe(environment.id, () => {
    test.use({ hasTouch: environment.hasTouch ?? false });
    for (const config of configurations) test(`${config.designSystem} ${config.colorMode} ${environment.id}`, { tag: ["@rc-select", "@environment"], annotation: { type: "environment", description: JSON.stringify({ id: environment.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await applyEnvironment(page, environment);
        await openDemo(page, previewOrigin, "rc-select", spec.demo, { ...config, ...environment.config });
        const field = page.getByRole("combobox", { name: "团队 Team", exact: true });
        if (environment.hasTouch) await field.tap({ position: { x: 12, y: 12 } }); else await field.click({ position: { x: 12, y: 12 } });
        const popup = page.getByRole("listbox"); await expect(popup).toBeVisible(); const rect = await popup.boundingBox(); expect(rect.x).toBeGreaterThanOrEqual(0); expect(rect.x + rect.width).toBeLessThanOrEqual(page.viewportSize().width);
        const option = page.getByRole("option", { name: "工程 Engineering", exact: true }); if (environment.hasTouch) expect((await option.boundingBox()).height).toBeGreaterThanOrEqual(44);
        await settleFiniteAnimations(page); await captureVisual(page, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
        await option.click(); await expect(field).toContainText("工程 Engineering");
    });
});
