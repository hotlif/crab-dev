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
        if (state === "disabled") { await expect(control).toHaveAttribute("aria-disabled", "true"); await expect(control).toHaveAttribute("tabindex", "-1"); }
        if (state === "error") await expect(control).toHaveAttribute("aria-invalid", "true");
        await settleFiniteAnimations(page);
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
