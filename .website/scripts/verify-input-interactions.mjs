import { writeFile } from "node:fs/promises";
import { connectReviewBrowser } from "./production-browser.mjs";
import { productionRevision } from "./production-revision.mjs";

const revision = await productionRevision();
const browser = await connectReviewBrowser();
const results = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function record(check, evidence, passed) {
    results.push({ check, passed, evidence });
    console.log(`${passed ? "PASS" : "REVIEW"} ${check}: ${JSON.stringify(evidence)}`);
}
async function key(key, code, value, modifiers = 0) {
    await browser.call("Input.dispatchKeyEvent", { type: "keyDown", key, code, modifiers, windowsVirtualKeyCode: value, ...(key === "Enter" ? { text: "\r", unmodifiedText: "\r" } : {}) });
    await browser.call("Input.dispatchKeyEvent", { type: "keyUp", key, code, modifiers, windowsVirtualKeyCode: value });
    await delay(100);
}
async function navigate(component, demo, theme, forced = false, width = 768, coarse = false) {
    await browser.call("Emulation.setTouchEmulationEnabled", { enabled: coarse, maxTouchPoints: 1 });
    await browser.call("Emulation.setDeviceMetricsOverride", { width, height: 960, deviceScaleFactor: 1, mobile: false });
    await browser.call("Emulation.setEmulatedMedia", { features: [
        { name: "prefers-color-scheme", value: theme },
        { name: "forced-colors", value: forced ? "active" : "none" },
        { name: "prefers-reduced-motion", value: "reduce" },
    ] });
    const route = `/components/rc-${component}/workbench/?__wake_demo=docs%2Fdemos%2F${demo}.demo.tsx`;
    await browser.call("Page.navigate", { url: `http://127.0.0.1:4173${route}` });
    const selector = component === "line-edit" ? "input" : "textarea";
    let ready = false;
    for (let n = 0; n < 80; n++) {
        await delay(100);
        ready = await browser.evaluate(`Boolean(document.querySelector('.demo-frame-root ${selector}'))`);
        if (ready) break;
    }
    if (!ready) throw new Error(`Input demo unavailable: ${route}`);
    await delay(200);
}
try {
    await browser.call("Page.enable");
    await browser.call("Runtime.enable");
    for (const component of ["line-edit", "text-edit"]) {
        const selector = component === "line-edit" ? "input" : "textarea";
        for (const theme of ["light", "dark"]) for (const forced of [false, true]) {
            const name = `${component} ${theme} ${forced ? "forced" : "normal"}`;
            await navigate(component, "allow-clear", theme, forced);
            await browser.evaluate(`document.querySelector('.demo-frame-root ${selector}').focus()`);
            await key("Tab", "Tab", 9);
            const action = await browser.evaluate(`(() => {
                const el=document.activeElement; const c=getComputedStyle(el);const input=document.querySelector('.demo-frame-root ${selector}');
                return {label:el.getAttribute('aria-label'),visible:el.matches(':focus-visible'),outline:c.outlineStyle,width:parseFloat(c.outlineWidth),controls:el.getAttribute('aria-controls')===input.id};
            })()`);
            record(`${name} clear focus`, action, action.label === "清除" && action.visible && action.outline === "solid" && action.width >= 2 && action.controls);
            await key("Enter", "Enter", 13);
            const cleared = await browser.evaluate(`(() => {
                const el=document.querySelector('.demo-frame-root ${selector}');return {value:el.value,focus:document.activeElement===el,clearExists:Boolean(document.querySelector('button[aria-label="清除"]'))};
            })()`);
            record(`${name} clear recovery`, cleared, cleared.value === "" && cleared.focus && !cleared.clearExists);
            await browser.call("Input.insertText", { text: "继续编辑" });
            const typed = await browser.evaluate(`document.querySelector('.demo-frame-root ${selector}').value`);
            record(`${name} editing resumes`, { value: typed }, typed === "继续编辑");

            await navigate(component, "status", theme, forced);
            await browser.evaluate(`document.querySelector('.demo-frame-root ${selector}').focus()`);
            // Real keyboard return establishes :focus-visible; programmatic focus alone
            // does not always request a visible focus indicator in an inactive CDP page.
            await key("Tab", "Tab", 9);
            await key("Tab", "Tab", 9, 8);
            const error = await browser.evaluate(`(() => {
                const el=document.querySelector('.demo-frame-root ${selector}'); const c=getComputedStyle(el.parentElement);
                return {invalid:el.getAttribute('aria-invalid'),focus:document.activeElement===el,outline:c.outlineStyle,width:parseFloat(c.outlineWidth),border:c.borderColor,ring:c.outlineColor};
            })()`);
            record(`${name} error and focus`, error, error.invalid === "true" && error.focus && error.outline === "solid" && error.width >= 2 && (forced || error.border !== error.ring));
        }
        for (const theme of ["light", "dark"]) {
            await navigate(component, "allow-clear", theme, false, 320, true);
            const targets = await browser.evaluate(`(() => {
                const input=document.querySelector('.demo-frame-root ${selector}');const action=document.querySelector('button[aria-label="清除"]');
                const a=action.getBoundingClientRect(),i=input.getBoundingClientRect(),container=input.parentElement.getBoundingClientRect();
                return {coarse:matchMedia('(pointer: coarse)').matches,inputHeight:i.height,actionWidth:a.width,actionHeight:a.height,containerRight:container.right,viewport:innerWidth,pageWidth:document.documentElement.scrollWidth,actionWithin:a.right<=container.right+1&&a.bottom<=container.bottom+1};
            })()`);
            record(`${component} ${theme} 320 coarse targets`, targets, targets.coarse && targets.inputHeight >= 44 && targets.actionWidth >= 44 && targets.actionHeight >= 44 && targets.actionWithin && targets.containerRight <= targets.viewport && targets.pageWidth <= targets.viewport);
            const image = await browser.call("Page.captureScreenshot", { format: "png" });
            await writeFile(new URL(`../review/quality/production/${component}-${theme}-touch-320.png`, import.meta.url), Buffer.from(image.data, "base64"));
        }
    }
    for (const theme of ["light", "dark"]) {
        await navigate("line-edit", "password", theme);
        const disabled = await browser.evaluate(`(() => {
            const input=document.querySelector('input[aria-label="禁用密码示例"]');const action=input.parentElement.querySelector('button');action.click();action.focus();
            return {inputDisabled:input.disabled,actionDisabled:action.disabled,type:input.type,notFocused:document.activeElement!==action};
        })()`);
        record(`password ${theme} disabled`, disabled, disabled.inputDisabled && disabled.actionDisabled && disabled.type === "password" && disabled.notFocused);
        await browser.evaluate("document.querySelector('input[aria-label=\"只读密码示例\"]').focus()");
        await key("Tab", "Tab", 9);
        await key("Enter", "Enter", 13);
        const readonly = await browser.evaluate(`(() => {
            const input=document.querySelector('input[aria-label="只读密码示例"]'); return {readOnly:input.readOnly,value:input.value,type:input.type,label:document.activeElement.getAttribute('aria-label')};
        })()`);
        record(`password ${theme} readOnly visibility`, readonly, readonly.readOnly && readonly.value === "readonly-example" && readonly.type === "text" && readonly.label === "隐藏密码");
    }
} finally {
    await writeFile(new URL("../review/quality/production/input-interactions.json", import.meta.url), JSON.stringify({ capturedAt: new Date().toISOString(), revision, scope: "Production workbench keyboard and emulated media checks; no React gate, screen reader or physical touch pass implied.", results, exceptions: browser.exceptions }, null, 2) + "\n");
    await browser.call("Emulation.setTouchEmulationEnabled", { enabled: false });
    await browser.call("Emulation.setEmulatedMedia", { features: [] });
    browser.close();
}
if (results.some(item => !item.passed) || browser.exceptions.length) process.exitCode = 1;
