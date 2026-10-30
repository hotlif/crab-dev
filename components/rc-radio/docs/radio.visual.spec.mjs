import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";
import { assertRadioFeedback } from './visual-feedback.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.states.includes(state);
    test(`Radio ${config.designSystem} ${config.colorMode} ${size} ${state}`, {
        tag: ["@rc-radio", "@matrix", ...(!crossEngine ? ["@chromium-only"] : [])],
        annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density: "standard", state }) },
    }, async ({ page, browserName, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, "rc-radio", spec.demo, { ...config, size });
        const stateControl = page.getByLabel("验收状态", { exact: true });
        await stateControl.selectOption(state);
        const scene = page.locator("[data-visual-scene]");
        const frame = scene.locator("[data-visual-frame]");
        const control = frame.getByRole("radio", { name: "Primary option", exact: true });
        const target = control.locator('..');
        await expect(scene).toHaveAttribute("data-size", size);
        if (state.startsWith("selected")) {
            await target.click(); await expect(control).toBeChecked();
            await stateControl.hover(); await stateControl.focus();
        }
        if (state.includes("error")) {
            await expect(control).toHaveAttribute("aria-invalid", "true");
            const description = await control.getAttribute("aria-describedby");
            expect(description).toBeTruthy();
            await expect(frame.getByRole("alert")).toHaveAttribute("id", description);
        }
        if (state.startsWith("disabled")) {
            await expect(control).toBeDisabled();
            
            if (state === "disabled-selected") await expect(control).toBeChecked();
        }
        
        if (state.includes("hover") || state.includes("pressed")) await target.hover();
        if (state.includes("focus-visible")) {
            await stateControl.focus();
            await page.keyboard.press("Tab");
            await expect(control).toBeFocused();
            expect(await control.evaluate(node => node.matches(":focus-visible"))).toBe(true);
            await settleFiniteAnimations(page);
            const focusTarget = control.locator("..").locator("[data-radio-part='control']");
            const focusStyle = await focusTarget.evaluate(node => { const style = globalThis.getComputedStyle(node); return { width: Number.parseFloat(style.outlineWidth), offset: Number.parseFloat(style.outlineOffset), style: style.outlineStyle }; });
            expect(focusStyle.style).not.toBe("none");
            expect(focusStyle.width).toBeGreaterThan(0);
            const focusBounds = await focusTarget.boundingBox(), frameBounds = await frame.boundingBox();
            const reach = Math.max(0, focusStyle.width + focusStyle.offset);
            expect(focusBounds.x - reach).toBeGreaterThanOrEqual(frameBounds.x);
            expect(focusBounds.y - reach).toBeGreaterThanOrEqual(frameBounds.y);
            expect(focusBounds.x + focusBounds.width + reach).toBeLessThanOrEqual(frameBounds.x + frameBounds.width);
            expect(focusBounds.y + focusBounds.height + reach).toBeLessThanOrEqual(frameBounds.y + frameBounds.height);
        }
        if (state.includes("pressed")) await page.mouse.down();
        await settleFiniteAnimations(page);
        await expect(control).toHaveJSProperty("checked", state.startsWith("selected") || state === "disabled-selected");
        await assertRadioFeedback(frame, control);
        const geometry = await target.boundingBox();
        expect(geometry.width).toBeGreaterThan(0);
        expect(geometry.height).toBeGreaterThan(0);
        await info.attach("geometry", { body: JSON.stringify(geometry), contentType: "application/json" });
        await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${size}-${state}.png`, info, browserName);
        if (state.includes("pressed")) await page.mouse.up();
    });
}

