import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { connectReviewBrowser } from "../../../scripts/production-browser.mjs";

const base = process.env.DOCS_REVIEW_URL ?? "http://127.0.0.1:4175";
const browser = await connectReviewBrowser();
const results = [];
const pause = () => new Promise(resolve => setTimeout(resolve, 500));
try {
    await browser.call("Page.enable");
    await browser.call("Runtime.enable");
    for (const width of [1440, 1024, 768, 320]) {
        for (const theme of ["dark", "light"]) {
            await browser.call("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false });
            await browser.call("Emulation.setEmulatedMedia", { features: [
                { name: "prefers-color-scheme", value: theme },
                { name: "prefers-reduced-motion", value: "reduce" },
            ] });
            await browser.call("Page.navigate", { url: `${base}/components/rc-token-global` });
            for (let attempt = 0; attempt < 30; attempt++) {
                if (await browser.evaluate("!!document.querySelector('.crab-docs-nav-page[aria-current]')")) break;
                await pause();
            }
            if (width < 1024) {
                await browser.evaluate("document.querySelector('.crab-docs-menu-trigger').click()");
                await pause();
            }
            await browser.call("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
            await browser.call("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
            const result = await browser.evaluate(`(() => {
                const visible = element => element.getBoundingClientRect().width > 0;
                const navs = [...document.querySelectorAll('.crab-docs-navigation')].filter(visible);
                const nav = navs[0];
                const selected = nav.querySelector('[aria-current="page"]');
                const label = selected.querySelector('.crab-docs-nav-label');
                selected.focus();
                return {
                    width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
                    navs: navs.length, rail: !!document.querySelector('.crab-docs-rail'),
                    height: selected.getBoundingClientRect().height,
                    labelSize: getComputedStyle(selected).fontSize,
                    wrap: getComputedStyle(label).whiteSpace,
                    marker: getComputedStyle(selected, '::after').content,
                    treeLine: getComputedStyle(selected.parentElement).borderInlineStartWidth,
                    focused: document.activeElement === selected,
                    focusOutline: getComputedStyle(selected).outlineStyle,
                    sidebarVisible: visible(document.querySelector('.crab-docs-sidebar')),
                };
            })()`);
            assert.equal(result.overflow, false);
            assert.equal(result.navs, 1);
            assert.equal(result.rail, false);
            assert.equal(result.height, 56);
            assert.equal(result.labelSize, "14px");
            assert.equal(result.wrap, "nowrap");
            assert.equal(result.marker, "none");
            assert.equal(result.treeLine, "0px");
            assert.equal(result.focused, true);
            assert.equal(result.focusOutline, "solid");
            assert.equal(result.sidebarVisible, width >= 1024);
            results.push({ theme, ...result });
            await browser.evaluate("document.activeElement.blur()");
            const shot = await browser.call("Page.captureScreenshot", { format: "png" });
            await writeFile(new URL(`navigation-${width}-${theme}.png`, import.meta.url), Buffer.from(shot.data, "base64"));
        }
    }
    // A real destination must dismiss the modal drawer and change the route.
    await browser.evaluate(`document.querySelector('dialog[open] a[href$="/components/rc-theme"]').click()`);
    await pause();
    assert.equal(await browser.evaluate("location.pathname.endsWith('/components/rc-theme')"), true);
    assert.equal(await browser.evaluate("!!document.querySelector('dialog[open]')"), false);
    await browser.call("Emulation.setEmulatedMedia", { features: [{ name: "forced-colors", value: "active" }] });
    await browser.evaluate("document.querySelector('.crab-docs-menu-trigger').click()");
    await pause();
    assert.equal(await browser.evaluate("getComputedStyle(document.querySelector('dialog[open] [aria-current=page]')).outlineStyle"), "solid");
    await browser.call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await browser.call("Emulation.setEmulatedMedia", { features: [{ name: "forced-colors", value: "none" }] });
    for (const path of ["/", "/learn/components", "/guides/getting-started", "/learn"]) {
        await browser.call("Page.navigate", { url: `${base}${path}` });
        for (let attempt = 0; attempt < 30; attempt++) {
            if (await browser.evaluate("!!document.querySelector('.crab-docs-nav-page[aria-current]')")) break;
            await pause();
        }
        assert.equal(await browser.evaluate("document.documentElement.scrollWidth > innerWidth"), false);
        assert.equal(await browser.evaluate("!!document.querySelector('.crab-docs-nav-page[aria-current=page]')"), true, `Selected destination: ${path}`);
    }
    await browser.call("Page.navigate", { url: `${base}/components/rc-token-global` });
    await pause();
    const states = [];
    for (const selector of [".crab-docs-sidebar [aria-current=page]", ".crab-docs-sidebar .crab-docs-category-heading button"]) {
        const readState = () => browser.evaluate(`(() => {
            const element = document.querySelector(${JSON.stringify(selector)});
            const rect = element.getBoundingClientRect(), style = getComputedStyle(element);
            return { background: style.backgroundColor, radius: style.borderRadius,
                width: rect.width, height: rect.height, x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
        })()`);
        await browser.call("Input.dispatchMouseEvent", { type: "mouseMoved", x: 900, y: 300 });
        await pause();
        const normal = await readState();
        await browser.call("Input.dispatchMouseEvent", { type: "mouseMoved", x: normal.x, y: normal.y });
        await pause();
        const hover = await readState();
        await browser.call("Input.dispatchMouseEvent", { type: "mousePressed", x: normal.x, y: normal.y, button: "left", clickCount: 1 });
        await pause();
        const pressed = await readState();
        await browser.call("Input.dispatchMouseEvent", { type: "mouseMoved", x: 900, y: 300 });
        await browser.call("Input.dispatchMouseEvent", { type: "mouseReleased", x: 900, y: 300, button: "left", clickCount: 1 });
        assert.notEqual(normal.background, hover.background);
        assert.notEqual(hover.background, pressed.background);
        for (const state of [hover, pressed]) {
            assert.equal(state.radius, normal.radius);
            assert.equal(state.width, normal.width);
            assert.equal(state.height, normal.height);
        }
        states.push({ selector, normal, hover, pressed });
    }
    assert.deepEqual(browser.exceptions, []);
    await writeFile(new URL("navigation-checks.json", import.meta.url), JSON.stringify({ base, results, states, modalNavigation: true, forcedColors: true, exceptions: [] }, null, 2));
    console.log(`PASS: ${results.length} navigation layouts, focus, modal route/dismissal, forced colors.`);
} finally {
    browser.close();
}
