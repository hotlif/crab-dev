import { test, expect, configurations, openDemo, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

async function openBoundary(page, origin, host, config) {
    await openDemo(page, origin, "rc-drawer", "document-boundaries.demo.tsx", config);
    await page.getByLabel("承载边界", { exact: true }).selectOption(host);
    const scene = host === "iframe" ? page.frameLocator('iframe[title="Overlay document iframe"]').getByRole("region", { name: "iframe interactions", exact: true }) : page.getByRole("region", { name: "shadow interactions", exact: true });
    await expect(scene).toBeVisible();
    await scene.evaluate(node => node.ownerDocument.fonts.ready);
    expect(JSON.parse(await scene.getByLabel("最近完整配置", { exact: true }).textContent())).toEqual({ ...config, size: "small", density: "compact", locale: "en-US", direction: "rtl", brandColor: "#0e7490", nonce: "overlay-documents" });
    return scene;
}

async function assertBoundary(target, reference, host, config) {
    const boundary = target.locator("xpath=ancestor-or-self::*[@data-crab-design][1]");
    await expect(boundary).toHaveAttribute("data-crab-design", config.designSystem); await expect(boundary).toHaveAttribute("data-theme", config.colorMode); await expect(boundary).toHaveAttribute("data-crab-size", "small"); await expect(boundary).toHaveAttribute("data-crab-density", "compact"); await expect(boundary).toHaveAttribute("dir", "rtl"); await expect(boundary).toHaveAttribute("lang", "en-US");
    expect(await boundary.evaluate(node => node.nonce)).toBe("overlay-documents"); expect(await boundary.getAttribute("data-crab-brand")).toBeTruthy();
    const ref = await reference.elementHandle();
    expect(await target.evaluate((node, owner) => node.ownerDocument === owner.ownerDocument && node.getRootNode() === owner.getRootNode(), ref)).toBe(true);
    expect(await target.evaluate(node => node.ownerDocument.defaultView.frameElement !== null)).toBe(host === "iframe");
    expect(await target.evaluate(node => node.getRootNode().nodeType === 11)).toBe(host === "shadow");
}

async function assertReachable(target) {
    await target.scrollIntoViewIfNeeded();
    const geometry = await target.evaluate(node => {
        const rect = node.getBoundingClientRect(), owner = node.ownerDocument;
        return { width: rect.width, height: rect.height, left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, viewportWidth: owner.defaultView.innerWidth, viewportHeight: owner.defaultView.innerHeight };
    });
    expect(geometry.width).toBeGreaterThan(0); expect(geometry.height).toBeGreaterThan(0); expect(geometry.left).toBeGreaterThanOrEqual(0); expect(geometry.top).toBeGreaterThanOrEqual(0); expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth); expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
    // Native framework hit testing includes clipping, occlusion and Shadow DOM.
    await target.click({ trial: true });
}

async function settleBoundary(page, scene) {
    await settleFiniteAnimations(page);
    await expect.poll(() => scene.evaluate(node => node.ownerDocument.getAnimations().filter(animation => animation.playState === "running" && Number.isFinite(animation.effect?.getComputedTiming().endTime)).length)).toBe(0);
}

for (const config of configurations) for (const host of ["iframe", "shadow"]) {
    const annotation = component => ({ type: "document-boundary", description: JSON.stringify({ host, component, ...config, sourceDemo: "rc-drawer/document-boundaries.demo.tsx" }) });
    test(`${config.designSystem} ${config.colorMode} ${host} Select real collection`, { tag: ["@rc-drawer", "@rc-select", "@boundary"], annotation: annotation("rc-select") }, async ({ page, previewOrigin, browserName }, info) => {
        const scene = await openBoundary(page, previewOrigin, host, config), trigger = scene.getByRole("combobox", { name: "团队 Team", exact: true });
        await trigger.focus(); await trigger.press("ArrowDown");
        const scope = host === "iframe" ? page.frameLocator('iframe[title="Overlay document iframe"]') : page;
        const popup = scope.getByRole("listbox"); await expect(popup).toBeVisible(); await assertBoundary(popup, trigger, host, config);
        const option = scope.getByRole("option", { name: "工程 Engineering", exact: true }); await assertReachable(option);
        await settleBoundary(page, scene); await captureVisual(page, `${config.designSystem}-${config.colorMode}-${host}-select-expanded.png`, info, browserName);
        await option.click(); await expect(trigger).toContainText("工程 Engineering"); await expect(popup).not.toBeVisible(); await expect(trigger).toBeFocused();
    });
    test(`${config.designSystem} ${config.colorMode} ${host} Dropdown nested Escape`, { tag: ["@rc-drawer", "@rc-dropdown-container", "@boundary"], annotation: annotation("rc-dropdown-container") }, async ({ page, previewOrigin, browserName }, info) => {
        const scene = await openBoundary(page, previewOrigin, host, config), trigger = scene.getByRole("button", { name: "打开跨文档浮层", exact: true });
        const scope = host === "iframe" ? page.frameLocator('iframe[title="Overlay document iframe"]') : page;
        await trigger.click(); const outer = scope.getByRole("dialog", { name: "跨文档外层", exact: true }); await expect(outer).toBeVisible(); await assertBoundary(outer, trigger, host, config);
        const draft = outer.getByRole("textbox", { name: "外层草稿", exact: true }); await draft.fill("Document draft kept");
        const innerTrigger = outer.getByRole("button", { name: "打开内部浮层", exact: true }); await innerTrigger.click();
        const inner = scope.getByRole("dialog", { name: "跨文档内层", exact: true }); await expect(inner).toBeVisible(); await assertBoundary(inner, innerTrigger, host, config);
        const action = inner.getByRole("button", { name: "内部浮层操作", exact: true }); await action.focus(); await assertReachable(action);
        await settleBoundary(page, scene); await captureVisual(page, `${config.designSystem}-${config.colorMode}-${host}-dropdown-stacked.png`, info, browserName);
        await action.press("Escape"); await expect(inner).not.toBeVisible(); await expect(outer).toBeVisible(); await expect(innerTrigger).toBeFocused();
        await innerTrigger.press("Escape"); await expect(outer).not.toBeVisible(); await expect(trigger).toBeFocused(); await trigger.click(); await expect(draft).toHaveValue("Document draft kept");
    });
    test(`${config.designSystem} ${config.colorMode} ${host} Drawer native modal stack`, { tag: ["@rc-drawer", "@boundary"], annotation: annotation("rc-drawer") }, async ({ page, previewOrigin, browserName }, info) => {
        const scene = await openBoundary(page, previewOrigin, host, config), trigger = scene.getByRole("button", { name: "打开跨文档抽屉", exact: true });
        const scope = host === "iframe" ? page.frameLocator('iframe[title="Overlay document iframe"]') : page;
        const outerOverflow = await page.evaluate(() => globalThis.document.body.style.overflow);
        await trigger.click(); const outer = scope.getByRole("dialog", { name: "跨文档详情", exact: true }); await expect(outer).toBeVisible(); await assertBoundary(outer, trigger, host, config);
        expect(await outer.evaluate(node => node.ownerDocument.body.style.overflow)).toBe("hidden"); if (host === "iframe") expect(await page.evaluate(() => globalThis.document.body.style.overflow)).toBe(outerOverflow);
        const draft = outer.getByRole("textbox", { name: "抽屉草稿", exact: true }); await draft.fill("Native drawer draft"); const innerTrigger = outer.getByRole("button", { name: "打开嵌套抽屉", exact: true }); await innerTrigger.click();
        const inner = scope.getByRole("dialog", { name: "嵌套详情", exact: true }); await expect(inner).toBeVisible(); await assertBoundary(inner, innerTrigger, host, config);
        const action = inner.getByRole("button", { name: "嵌套抽屉操作", exact: true }); await action.focus(); await action.press("Shift+Tab"); await page.keyboard.press("Tab"); await expect(action).toBeFocused(); expect(await action.evaluate(node => node.matches(":focus-visible"))).toBe(true); await assertReachable(action);
        await settleBoundary(page, scene); await captureVisual(page, `${config.designSystem}-${config.colorMode}-${host}-drawer-stacked.png`, info, browserName);
        await action.press("Escape"); await expect(inner).not.toBeVisible(); await expect(outer).toBeVisible(); await expect(innerTrigger).toBeFocused();
        await innerTrigger.press("Escape"); await expect(outer).not.toBeVisible(); await expect(trigger).toBeFocused(); await trigger.click(); await expect(draft).toHaveValue("Native drawer draft");
    });
}
