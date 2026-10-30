import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.states.includes(state);
    test(`Segmented ${config.designSystem} ${config.colorMode} ${size} ${state}`, {
        tag: ["@rc-segmented", "@matrix", ...(!crossEngine ? ["@chromium-only"] : [])],
        annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density: "standard", state }) },
    }, async ({ page, browserName, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, "rc-segmented", spec.demo, { ...config, size });
        const stateControl = page.getByLabel("验收状态", { exact: true });
        await stateControl.selectOption(state);
        const scene = page.locator("[data-visual-scene]");
        const frame = scene.locator("[data-visual-frame]");
        const group = frame.getByRole("radiogroup", { name: "Time range" });
        const day = group.getByRole("radio", { name: "Day", exact: true });
        const week = group.getByRole("radio", { name: "Week", exact: true });
        const target = state.startsWith("selected") ? day : week;
        await expect(scene).toHaveAttribute("data-size", size);
        await expect(group.getByRole("radio")).toHaveCount(3);
        await expect(day).toBeChecked();
        await expect(group.getByRole("radio", { name: "Month" })).toBeDisabled();
        if (state === "disabled") {
            await expect(day).toBeDisabled();
            await expect(week).toBeDisabled();
        }
        if (state === "selected") {
            await week.locator("..").click();
            await expect(week).toBeChecked();
            await expect(day).not.toBeChecked();
            await stateControl.hover(); await stateControl.focus();
        }
        if (state === "selected-hover" || state === "selected-pressed") {
            await week.locator("..").click();
            await expect(week).toBeChecked();
            await day.locator("..").click();
            await expect(day).toBeChecked();
            await expect(week).not.toBeChecked();
            await stateControl.hover(); await stateControl.focus();
        }
        if (state === "item-disabled") {
            const month = group.getByRole("radio", { name: "Month" });
            await month.locator("..").hover();
            const disabledBounds = await month.locator("..").boundingBox();
            await page.mouse.click(disabledBounds.x + disabledBounds.width / 2, disabledBounds.y + disabledBounds.height / 2);
            await expect(month).toBeDisabled();
            await expect(month).not.toBeChecked();
            await expect(day).toBeChecked();
        }
        if (state.includes("hover") || state.includes("pressed")) await target.locator("..").hover();
        if (state === "focus-visible") {
            await stateControl.focus();
            await page.keyboard.press("Tab");
            await expect(day).toBeFocused();
            await page.keyboard.press("ArrowRight");
            await expect(week).toBeFocused();
            await expect(week).toBeChecked();
            expect(await week.evaluate(node => node.matches(":focus-visible"))).toBe(true);
            const outline = await week.locator("..").evaluate(node => globalThis.getComputedStyle(node).outlineStyle);
            expect(outline).not.toBe("none");
        }
        if (state.includes("pressed")) await page.mouse.down();
        await settleFiniteAnimations(page);
        const geometry = await group.boundingBox();
        expect(geometry.width).toBeGreaterThan(0);
        expect(await group.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
        await info.attach("geometry", { body: JSON.stringify(geometry), contentType: "application/json" });
        await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${size}-${state}.png`, info, browserName);
        if (state.includes("pressed")) await page.mouse.up();
    });
}
