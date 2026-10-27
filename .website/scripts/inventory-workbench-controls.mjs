import { readdir, writeFile } from "node:fs/promises";
import { connectReviewBrowser } from "./production-browser.mjs";
import { productionRevision } from "./production-revision.mjs";
import { captureControlSnapshot } from "./control-inventory-snapshot.mjs";

const browser = await connectReviewBrowser();
const revision = await productionRevision();
const results = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const components = (await readdir(new URL("../../components/", import.meta.url))).filter(name => name.startsWith("rc-")).sort();
const selector = '.demo-frame-root :is(button,a[href],input:not([type="hidden"]),textarea,select,[role="button"],[role="combobox"],[role="switch"],[role="slider"],[role="tab"],[role="menuitem"],[role="treeitem"],[role="separator"][tabindex])';
const output = new URL("../review/quality/production/workbench-control-inventory.json", import.meta.url);
async function save() {
    await writeFile(output, JSON.stringify({ capturedAt: new Date().toISOString(), revision, status: "Initial-state inspection only. Candidates require reproduction and source review; this is not a WCAG pass or a complete component audit.", conditions: "320 CSS px, light, coarse pointer, reduced motion; no operation is activated.", results, exceptions: browser.exceptions }, null, 2) + "\n");
}
try {
    await browser.call("Page.enable");
    await browser.call("Runtime.enable");
    await browser.call("Emulation.setDeviceMetricsOverride", { width: 320, height: 960, deviceScaleFactor: 1, mobile: false });
    await browser.call("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
    await browser.call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "light" }, { name: "prefers-reduced-motion", value: "reduce" }] });
    for (const component of components) {
        const directory = new URL(`../../components/${component}/docs/demos/`, import.meta.url);
        const entries = await readdir(directory, { recursive: true }).catch(error => {
            if (error.code === "ENOENT") return [];
            throw error;
        });
        for (const file of entries.filter(file => file.endsWith(".demo.tsx")).sort()) {
            const demo = `docs/demos/${file.replaceAll("\\", "/")}`;
            const url = `http://127.0.0.1:4173/components/${component}/workbench/?__wake_demo=${encodeURIComponent(demo)}`;
            await browser.call("Page.navigate", { url });
            let ready = false;
            for (let n = 0; n < 60; n++) {
                await delay(100);
                ready = await browser.evaluate("document.readyState==='complete' && Boolean(document.querySelector('.demo-frame-root')?.children.length)");
                if (ready) break;
            }
            if (!ready) {
                results.push({ component, demo, url, status: "unavailable" });
                console.log(`REVIEW ${component}/${file}: unavailable`);
                await save();
                continue;
            }
            await browser.evaluate("document.fonts.ready.then(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))");
            await delay(300);
            const metrics = await captureControlSnapshot(browser, selector, `(() => {
                const controls=Array.from(document.querySelectorAll(${JSON.stringify(selector)})).map((el,index)=>{
                    const label=el.matches('input[type=checkbox],input[type=radio]')?el.closest('label'):null;
                    const target=label??el,r=target.getBoundingClientRect();
                    const visible=target.checkVisibility({visibilityProperty:true,opacityProperty:true,contentVisibilityAuto:true})&&r.width>0&&r.height>0&&!el.closest('[inert]')&&!target.closest('[inert]');
                    const focusable=el.tabIndex>=0&&!el.disabled&&!el.closest('[inert]')&&el.checkVisibility({visibilityProperty:true,contentVisibilityAuto:true});
                    const ariaHidden=Boolean(el.closest('[aria-hidden="true"]'));
                    return {index,connected:el.isConnected,tag:el.tagName,role:el.getAttribute('role'),type:el.type,html:el.outerHTML.slice(0,650),width:r.width,height:r.height,visible,focusable,ariaHidden,tabIndex:el.tabIndex,disabled:Boolean(el.disabled)||el.getAttribute('aria-disabled')==='true',text:target.textContent.trim().slice(0,80)};
                });
                return {pageWidth:document.documentElement.scrollWidth,viewport:innerWidth,coarse:matchMedia('(pointer:coarse)').matches,controls};
            })()`);
            for (const control of metrics.controls.filter(control => control.visible || control.focusable && control.ariaHidden)) {
                control.candidates = [];
                if (!control.ignored && !control.accessibleName.trim()) control.candidates.push("name-needs-review");
                if (control.focusable && (control.ignored || control.ariaHidden)) control.candidates.push("hidden-focusable-needs-review");
                if (!control.disabled && (control.width < 44 || control.height < 44)) control.candidates.push("touch-target-needs-review");
            }
            const candidates = metrics.controls.filter(control => control.candidates?.length).length;
            results.push({ component, demo, url, status: "inspected", ...metrics });
            console.log(`INSPECTED ${component}/${file}: ${metrics.controls.length} controls, ${candidates} candidates, ${metrics.pageWidth}px page`);
            await save();
        }
    }
} catch (error) {
    results.push({ status: "script-error", message: error.message });
    throw error;
} finally {
    await save();
    await browser.call("Emulation.setTouchEmulationEnabled", { enabled: false });
    await browser.call("Emulation.setEmulatedMedia", { features: [] });
    browser.close();
}
