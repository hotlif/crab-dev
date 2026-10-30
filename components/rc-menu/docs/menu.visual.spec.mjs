import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${density} ${state}`, { tag: ["@rc-menu", "@matrix", ...(!crossEngine ? ["@chromium-only"] : [])], annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, "rc-menu", spec.demo, { ...config, size, density });
        if (["horizontal", "horizontal-expanded", "inline"].includes(state)) await page.getByLabel("验收模式", { exact: true }).selectOption(state === "inline" ? "inline" : "horizontal");
        const collapsed = ["collapsed", "collapsed-expanded"].includes(state);
        if (collapsed) { await page.getByLabel("折叠导航", { exact: true }).check(); await expect(page.getByRole("menu", { name: "项目导航" })).toBeVisible(); }
        const scene = page.getByRole("region", { name: "Menu visual matrix" }); const first = scene.getByRole(collapsed ? "menuitem" : "button", { name: "总览 Overview", exact: true });
        if (state === "hover") await first.hover();
        if (state === "focus-visible") { await page.getByLabel("折叠导航", { exact: true }).focus(); await page.keyboard.press("Tab"); await expect(first).toBeFocused(); expect(await first.evaluate(node => node.matches(":focus-visible"))).toBe(true); }
        if (state === "pressed") { await first.hover(); await page.mouse.down(); }
        if (state === "selected") { await first.click(); await expect(first).toHaveAttribute("aria-current", "page"); await expect(page.getByLabel("已选导航", { exact: true })).toHaveText("overview"); }
        if (state === "expanded") { const parent = scene.getByRole("button", { name: "项目 Projects", exact: true }); await parent.click(); await expect(parent).toHaveAttribute("aria-expanded", "true"); await expect(scene.getByRole("button", { name: "进行中 Active", exact: true })).toBeVisible(); }
        if (["horizontal-expanded", "collapsed-expanded"].includes(state)) {
            const parent = scene.getByRole(collapsed ? "menuitem" : "button", { name: "项目 Projects", exact: true });
            await parent.click(); await expect(parent).toHaveAttribute("aria-expanded", "true");
            const active = page.getByRole("button", { name: "进行中 Active", exact: true }); await expect(active).toBeVisible();
            await active.focus(); await active.press("Tab");
            const archived = page.getByRole("button", { name: "归档 Archived", exact: true }); await expect(archived).toBeFocused(); expect(await archived.evaluate(node => node.matches(":focus-visible"))).toBe(true);
            const popup = page.locator(`[id="${await parent.getAttribute("aria-controls")}"]`); const rect = await popup.boundingBox(), viewport = page.viewportSize();
            expect(rect.x).toBeGreaterThanOrEqual(0); expect(rect.y).toBeGreaterThanOrEqual(0); expect(rect.x + rect.width).toBeLessThanOrEqual(viewport.width); expect(rect.y + rect.height).toBeLessThanOrEqual(viewport.height);
            const boundary = popup.locator("xpath=ancestor-or-self::*[@data-crab-design][1]"); await expect(boundary).toHaveAttribute("data-crab-design", config.designSystem); await expect(boundary).toHaveAttribute("data-theme", config.colorMode);
        }
        await settleFiniteAnimations(page); const rect = await first.boundingBox(); expect(rect.width).toBeGreaterThan(0); expect(rect.height).toBeGreaterThan(0);
        await captureVisual(page, `${config.designSystem}-${config.colorMode}-${density}-${state}.png`, info, browserName);
        if (state === "pressed") await page.mouse.up();
    });
}

test("selection and keyboard navigation survive configuration changes", { tag: ["@rc-menu", "@boundary"] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, "rc-menu", spec.demo, configurations[0]); const first = page.getByRole("button", { name: "总览 Overview", exact: true }); await first.click(); const original = await first.elementHandle();
    for (const config of configurations) { await page.evaluate(config => globalThis.postMessage({ type: "crab:preview-config", ...config, direction: "rtl", locale: "en-US", density: "compact", brandColor: "#8b5cf6" }, globalThis.location.origin), config); await expect(page.locator(".demo-default-preview").first()).toHaveAttribute("data-crab-design", config.designSystem); await expect(first).toHaveAttribute("aria-current", "page"); expect(await original.evaluate(node => node.isConnected)).toBe(true); }
    await first.focus(); await first.press("ArrowDown"); const parent = page.getByRole("button", { name: "项目 Projects", exact: true }); await expect(parent).toBeFocused(); await parent.press("Enter"); await expect(parent).toHaveAttribute("aria-expanded", "true"); await parent.press("ArrowDown"); await expect(page.getByRole("button", { name: "进行中 Active", exact: true })).toBeFocused();
});

