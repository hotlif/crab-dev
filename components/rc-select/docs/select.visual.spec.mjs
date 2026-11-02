import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states.filter(value => value !== "loading")) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ["@rc-select", "@matrix", ...(!crossEngine ? ["@chromium-only"] : [])], annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, "rc-select", spec.demo, { ...config, size, density });
        const scenario = page.getByLabel("验收状态", { exact: true });
        await scenario.selectOption(["error", "warning", "disabled", "empty", "multiple"].includes(state) ? state : "default");
        const field = page.getByRole("combobox", { name: "团队 Team", exact: true });
        if (state === "hover") { const bounds = await field.boundingBox(); await field.hover({ position: { x: bounds.width / 2, y: bounds.height * 0.85 } }); }
        if (state === "focus-visible") { await scenario.focus(); await page.keyboard.press("Tab"); await expect(field).toBeFocused(); expect(await field.evaluate(node => node.matches(":focus-visible"))).toBe(true); }
        if (["expanded", "selected", "empty", "multiple"].includes(state)) {
            await field.click({ position: { x: 12, y: 12 } });
            await expect(field).toHaveAttribute("aria-expanded", "true");
            await expect(page.getByRole("listbox")).toBeVisible();
        }
        if (state === "selected") { await page.getByRole("option", { name: "工程 Engineering", exact: true }).click(); await expect(field).toContainText("工程 Engineering"); await field.press("ArrowDown"); await expect(page.getByRole("option", { name: "工程 Engineering", exact: true })).toHaveAttribute("aria-selected", "true"); }
        if (state === "multiple") await expect(page.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
        if (state === "disabled") await expect(field).toHaveAttribute("aria-disabled", "true");
        if (state === "error") await expect(field).toHaveAttribute("aria-invalid", "true");
        if (state === "empty") {
            const listbox = page.getByRole('listbox');
            await expect(listbox.getByRole('option')).toHaveCount(0);
            await expect(listbox).toContainText('暂无选项');
        }
        await settleFiniteAnimations(page);
        const rect = await field.boundingBox(); expect(rect.width).toBeGreaterThan(0); expect(rect.height).toBeGreaterThan(0);
        if (await page.getByRole("listbox").count()) { const popup = await page.getByRole("listbox").boundingBox(); expect(popup.x).toBeGreaterThanOrEqual(0); expect(popup.y).toBeGreaterThanOrEqual(0); }
        await captureVisual(page, `${config.designSystem}-${config.colorMode}-${size}-${density}-${state}.png`, info, browserName);
        if (state === 'focus-visible') {
            await field.press('Tab');
            await expect(page.getByRole('combobox', { name: '填充团队', exact: true })).toBeFocused();
            await page.keyboard.press('Shift+Tab');
            await expect(field).toBeFocused();
        }
    });
}

test("selection and search draft survive configuration changes across the Portal boundary", { tag: ["@rc-select", "@boundary"] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, "rc-select", spec.demo, configurations[0]);
    const field = page.getByRole("combobox", { name: "团队 Team", exact: true });
    await field.click({ position: { x: 12, y: 12 } });
    const search = field.getByRole("textbox"); await search.fill("工程");
    const original = await search.elementHandle();
    for (const config of configurations) {
        await page.evaluate(config => globalThis.postMessage({ type: "crab:preview-config", ...config, direction: "rtl", locale: "en-US", brandColor: "#8b5cf6" }, globalThis.location.origin), config);
        await expect(page.locator(".demo-default-preview").first()).toHaveAttribute("data-crab-design", config.designSystem);
        await expect(search).toHaveValue("工程"); expect(await original.evaluate(node => node.isConnected)).toBe(true);
        await expect(page.getByRole("option", { name: "工程 Engineering", exact: true })).toBeVisible();
        const portal = page.getByRole("listbox").locator("xpath=ancestor::*[@data-crab-design][1]");
        await expect(portal).toHaveAttribute("data-crab-design", config.designSystem);
    }
    await page.getByRole("option", { name: "工程 Engineering", exact: true }).click();
    await expect(field).toContainText("工程 Engineering");
    await page.mouse.move(0, 0);
    await field.focus();
    await field.press('Tab');
    const clear = field.getByRole('button', { name: /Clear|清除/ });
    await expect(clear).toBeFocused();
    await clear.press('Enter');
    await expect(field).toBeFocused();
    await expect(field).not.toContainText('工程 Engineering');
});

