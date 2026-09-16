import { readdir, writeFile } from "node:fs/promises";
import { connectReviewBrowser } from "./production-browser.mjs";
import { productionRevision } from "./production-revision.mjs";

const browser = await connectReviewBrowser();
const revision = await productionRevision();
const results = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const demos = [];
for (const component of ["canvas", "flow-diagram", "tree", "bar-chart"]) {
    const files = await readdir(new URL(`../../components/rc-${component}/docs/demos/`, import.meta.url));
    for (const file of files.filter(file => file.endsWith(".demo.tsx")).sort()) demos.push([component, file]);
}
for (const demo of ["disabled", "icon", "loading", "size"]) demos.push(["button", `${demo}.demo.tsx`]);
demos.push(["tabs", "closable.demo.tsx"], ["menu", "horizontal.demo.tsx"], ["segmented", "block.demo.tsx"]);

function record(check, evidence, passed) {
    results.push({ check, evidence, passed });
    console.log(`${passed ? "PASS" : "REVIEW"} ${check}: ${JSON.stringify(evidence)}`);
}
try {
    await browser.call("Page.enable");
    await browser.call("Runtime.enable");
    await browser.call("Emulation.setTouchEmulationEnabled", { enabled: false });
    for (const theme of ["light", "dark"]) for (const width of [320, 768, 1440]) {
        await browser.call("Emulation.setDeviceMetricsOverride", { width, height: 960, deviceScaleFactor: 1, mobile: false });
        await browser.call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }, { name: "prefers-reduced-motion", value: "reduce" }] });
        for (const [component, file] of demos) {
            const name = `${component}/${file} ${theme} ${width}`;
            await browser.call("Page.navigate", { url: `http://127.0.0.1:4173/components/rc-${component}/workbench/?__wake_demo=${encodeURIComponent(`docs/demos/${file}`)}` });
            let ready = false;
            for (let n = 0; n < 70; n++) {
                await delay(100);
                ready = await browser.evaluate("document.readyState==='complete' && Boolean(document.querySelector('.demo-default-preview')?.children.length)");
                if (ready) break;
            }
            if (!ready) {
                record(name, { error: "Example did not load" }, false);
                continue;
            }
            await browser.evaluate("document.fonts.ready");
            await delay(450);
            const metrics = await browser.evaluate(`(() => {
                const root=document.querySelector('.demo-default-preview'),r=root.getBoundingClientRect();
                const canvases=Array.from(root.querySelectorAll('canvas')).map(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}));
                const regions=Array.from(root.querySelectorAll('[role=region]')).map(el=>({name:el.getAttribute('aria-label'),width:el.clientWidth,scrollWidth:el.scrollWidth,tabIndex:el.tabIndex,overflow:getComputedStyle(el).overflowX}));
                return {pageWidth:document.documentElement.scrollWidth,viewport:innerWidth,previewWidth:r.width,previewHeight:r.height,text:root.textContent.trim().slice(0,80),canvases,regions,tableRows:root.querySelectorAll('tbody tr').length};
            })()`);
            const visibleContent = component === "tree" ? metrics.text.length > 0 && metrics.previewHeight >= 200
                : ["canvas", "flow-diagram", "bar-chart"].includes(component) ? metrics.canvases.length > 0 && metrics.canvases.every(canvas => canvas.width > 0 && canvas.height > 0) : true;
            record(name, metrics, metrics.pageWidth <= width && metrics.previewWidth > 0 && visibleContent);
            if (width === 320 && ["canvas", "flow-diagram"].includes(component)) {
                await browser.evaluate("document.querySelector('.demo-default-preview [role=region]').focus()");
                await browser.call("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39 });
                await browser.call("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39 });
                await delay(250);
                const scroll = await browser.evaluate(`(() => {const el=document.querySelector('.demo-default-preview [role=region]');return {focused:document.activeElement===el,offset:el.scrollLeft,range:el.scrollWidth-el.clientWidth,outline:getComputedStyle(el).outlineWidth,name:el.getAttribute('aria-label')};})()`);
                record(`${name} keyboard scroll`, scroll, scroll.focused && scroll.range > 0 && scroll.offset > 0 && parseFloat(scroll.outline) >= 2 && Boolean(scroll.name));
            }
            if (width === 320 && ((component === "canvas" && file === "text.demo.tsx") || (component === "tree" && file === "checkable.demo.tsx") || (component === "bar-chart" && file === "multi-series.demo.tsx"))) {
                const capture = await browser.call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
                await writeFile(new URL(`../review/quality/production/gallery-${component}-${theme}-320.png`, import.meta.url), Buffer.from(capture.data, "base64"));
            }
        }
    }
} catch (error) {
    record("script completion", { message: error.message }, false);
    throw error;
} finally {
    await writeFile(new URL("../review/quality/production/gallery-layout.json", import.meta.url), JSON.stringify({ capturedAt: new Date().toISOString(), revision, status: "Layout and local keyboard scrolling only; graph editing and complete accessibility remain separate reviews.", results, exceptions: browser.exceptions }, null, 2) + "\n");
    await browser.call("Emulation.setEmulatedMedia", { features: [] });
    browser.close();
}
if (results.some(result => !result.passed) || browser.exceptions.length) process.exitCode = 1;
