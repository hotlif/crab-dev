import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const state of spec.states.filter(state => state !== "loading")) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.states.includes(state);
    test.describe(`${config.designSystem} ${config.colorMode} ${size} ${state}`, () => {
        test("Button action matrix", { tag: ["@rc-button", "@matrix", ...(!crossEngine ? ["@chromium-only"] : [])], annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density: "standard", state }) } }, async ({ page, browserName, previewOrigin }, info) => {
            await openDemo(page, previewOrigin, "rc-button", spec.demo, config);
            await page.getByLabel("验收尺寸", { exact: true }).selectOption(size);
            await page.getByLabel("验收状态", { exact: true }).selectOption(["disabled", "selected", "unselected", "variants"].includes(state) ? state : "default");
            const scene = page.locator("[data-visual-scene]");
            const frame = page.getByRole("region", { name: "Button visual matrix" });
            const primary = scene.locator('button[data-appearance="primary"]');
            await expect(scene).toHaveAttribute("data-size", size);
            await expect(scene.getByRole("button")).toHaveCount(5);
            if (state === "disabled") await expect(primary).toBeDisabled();
            if (state === "selected") await expect(primary).toHaveAttribute("aria-pressed", "true");
            if (state === "unselected") await expect(primary).toHaveAttribute("aria-pressed", "false");
            if (state === "variants") {
                await expect(frame.getByRole("button", { name: "Add item", exact: true })).toBeVisible();
                await expect(frame.getByLabel("Danger actions").getByRole("button")).toHaveCount(5);
            }
            const interactive = ['hover', 'focus-visible', 'pressed'].includes(state);
            if (state === 'focus-visible') await page.getByLabel('验收状态', { exact: true }).focus();
            // Every appearance has its own state-layer colors. A primary-only
            // interaction cannot validate the four secondary appearances.
            for (const action of interactive ? await scene.getByRole('button').all() : [primary]) {
                const appearance = await action.getAttribute('data-appearance');
                if (state === 'hover') await action.hover();
                if (state === 'focus-visible') {
                    await page.keyboard.press('Tab');
                    await expect(action).toBeFocused();
                    expect(await action.evaluate(node => node.matches(':focus-visible'))).toBe(true);
                }
                if (state === 'pressed') { await action.hover(); await page.mouse.down(); }
                try {
                    await settleFiniteAnimations(page);
                    const rect = await action.boundingBox();
                    expect(rect.width).toBeGreaterThan(0); expect(rect.height).toBeGreaterThan(0);
                    const style = await action.evaluate(node => {
                        const computed = globalThis.getComputedStyle(node);
                        return { height: computed.height, fontSize: computed.fontSize, fontFamily: computed.fontFamily, outlineWidth: computed.outlineWidth, outlineOffset: computed.outlineOffset, outlineStyle: computed.outlineStyle };
                    });
                    if (state === 'focus-visible') {
                        expect(style.outlineStyle).not.toBe('none'); expect(Number.parseFloat(style.outlineWidth)).toBeGreaterThan(0);
                        const bounds = await frame.boundingBox(), reach = Math.max(0, Number.parseFloat(style.outlineWidth) + Number.parseFloat(style.outlineOffset));
                        expect(rect.x - reach).toBeGreaterThanOrEqual(bounds.x); expect(rect.y - reach).toBeGreaterThanOrEqual(bounds.y);
                        expect(rect.x + rect.width + reach).toBeLessThanOrEqual(bounds.x + bounds.width); expect(rect.y + rect.height + reach).toBeLessThanOrEqual(bounds.y + bounds.height);
                    }
                    await info.attach(`geometry-${appearance}`, { body: JSON.stringify({ appearance, rect, style }), contentType: 'application/json' });
                    await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${size}-${state}${interactive ? `-${appearance}` : ''}.png`, info, browserName);
                    if (state === 'hover') expect(await action.evaluate(node => node.matches(':hover'))).toBe(true);
                    if (state === 'pressed') expect(await action.evaluate(node => node.matches(':active'))).toBe(true);
                } finally { if (state === 'pressed') await page.mouse.up(); }
            }
        });
    });
}
