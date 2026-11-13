import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.states.includes(state);
    test(`Slider ${config.designSystem} ${config.colorMode} ${size} ${state}`, {
        tag: ["@rc-slider", "@matrix", ...(!crossEngine ? ["@chromium-only"] : [])],
        annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density: "standard", state }) },
    }, async ({ page, browserName, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, "rc-slider", spec.demo, config);
        await page.getByLabel("验收尺寸", { exact: true }).selectOption(size);
        const stateControl = page.getByLabel("验收状态", { exact: true });
        await stateControl.selectOption(state);
        const scene = page.locator("[data-visual-scene]");
        const frame = scene.locator("[data-visual-frame]");
        const control = frame.getByRole("slider");
        const handle = control.locator("[data-slot='slider-handle-container']");
        await expect(scene).toHaveAttribute("data-size", size);
        if (state === "hover") await handle.hover();
        if (["focus-visible", "minimum", "maximum"].includes(state)) {
            await stateControl.focus();
            await page.keyboard.press("Tab");
            await expect(control).toBeFocused();
            if (state === "minimum") await page.keyboard.press("Home");
            else if (state === "maximum") await page.keyboard.press("End");
            else {
                await page.keyboard.press("ArrowRight");
                await expect(control).toHaveAttribute("aria-valuenow", "45");
                expect(await control.evaluate(node => node.matches(":focus-visible"))).toBe(true);
                const focus = await control.locator("[data-slot='slider-handle']").evaluate(node => { const style = globalThis.getComputedStyle(node); return { width: Number.parseFloat(style.outlineWidth), style: style.outlineStyle }; });
                expect(focus.style).not.toBe("none");
                expect(focus.width).toBeGreaterThan(0);
            }
        }
        if (state === "dragging") {
            await handle.hover();
            await page.mouse.down();
            const bounds = await control.boundingBox();
            await page.mouse.move(bounds.x + bounds.width * 0.7, bounds.y + bounds.height / 2, { steps: 5 });
            await expect(control.locator("[data-slot='slider-handle']")).toHaveAttribute("data-is-dragging", "true");
            await expect(control).not.toHaveAttribute("aria-valuenow", "40");
        }
        if (state === "minimum") await expect(control).toHaveAttribute("aria-valuenow", "0");
        if (state === "maximum") await expect(control).toHaveAttribute("aria-valuenow", "100");
        if (state === 'scientific') {
            await expect(control).toHaveAttribute('aria-valuenow', '5e-7');
            await control.focus();
            await control.press('ArrowRight');
            await expect(control).toHaveAttribute('aria-valuenow', '6e-7');
            const bounds = await control.boundingBox();
            await page.mouse.click(bounds.x + bounds.width * 0.75, bounds.y + bounds.height / 2);
            await expect(control).toHaveAttribute('aria-valuenow', '7e-7');
        }
        if (state === "disabled") { await expect(control).toHaveAttribute("aria-disabled", "true"); await expect(control).toHaveAttribute("tabindex", "-1"); }
        if (state === "error") await expect(control).toHaveAttribute("aria-invalid", "true");
        await settleFiniteAnimations(page);
        if (config.designSystem === 'macos') {
            await expect(control.locator('[data-slot="slider-handle"]')).toHaveCSS('backdrop-filter', state === 'dragging' ? 'blur(24px) saturate(1.5)' : 'none');
            const rail = control.locator('[data-slot="slider-rail"]');
            const track = control.locator('[data-slot="slider-track"]');
            await expect(rail).toHaveCSS('border-radius', '9999px');
            await expect(track).toHaveCSS('border-radius', '9999px');
            expect((await rail.boundingBox()).width).toBeCloseTo((await control.boundingBox()).width, 1);
            const min = Number(await control.getAttribute('aria-valuemin'));
            const max = Number(await control.getAttribute('aria-valuemax'));
            const value = Number(await control.getAttribute('aria-valuenow'));
            expect((await track.boundingBox()).width / (await rail.boundingBox()).width).toBeCloseTo((value - min) / (max - min), 2);
        }
        const geometry = await control.boundingBox();
        expect(geometry.height).toBeGreaterThan(0);
        const handleGeometry = await handle.boundingBox();
        expect(handleGeometry.x).toBeGreaterThanOrEqual(geometry.x - handleGeometry.width);
        expect(handleGeometry.x).toBeLessThanOrEqual(geometry.x + geometry.width);
        await info.attach("geometry", { body: JSON.stringify({ geometry, handleGeometry }), contentType: "application/json" });
        await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${size}-${state}.png`, info, browserName);
        if (state === "dragging") await page.mouse.up();
    });
}

for (const config of configurations) {
    test(`secondary pointer input and horizontal wheel ${config.designSystem} ${config.colorMode}`, { tag: ['@rc-slider', '@boundary'] }, async ({ page, previewOrigin }) => {
        const root = await openDemo(page, previewOrigin, 'rc-slider', spec.demo, config);
        const control = root.getByRole('slider');
        const bounds = await control.boundingBox();
        for (const button of ['middle', 'right']) {
            await page.mouse.click(bounds.x + bounds.width * 0.8, bounds.y + bounds.height / 2, { button });
            await page.keyboard.press('Escape');
            await expect(control).toHaveAttribute('aria-valuenow', '40');
            await expect(control.locator('[data-slot="slider-handle"]')).toHaveAttribute('data-is-dragging', 'false');
        }
        await control.hover();
        await page.mouse.wheel(80, 0);
        await page.evaluate(() => new Promise(resolve => globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(resolve))));
        await expect(control).toHaveAttribute('aria-valuenow', '40');
    });
}
