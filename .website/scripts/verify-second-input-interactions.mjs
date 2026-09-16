import { writeFile } from "node:fs/promises";
import { connectReviewBrowser } from "./production-browser.mjs";
import { productionRevision } from "./production-revision.mjs";

const browser = await connectReviewBrowser();
const revision = await productionRevision();
const results = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function record(check, evidence, passed) {
    results.push({ check, evidence, passed });
    console.log(`${passed ? "PASS" : "REVIEW"} ${check}: ${JSON.stringify(evidence)}`);
}
async function key(key, code, value, modifiers = 0) {
    await browser.call("Input.dispatchKeyEvent", { type: "keyDown", key, code, modifiers, windowsVirtualKeyCode: value, ...(key === "Enter" ? { text: "\r", unmodifiedText: "\r" } : {}) });
    await browser.call("Input.dispatchKeyEvent", { type: "keyUp", key, code, modifiers, windowsVirtualKeyCode: value });
    await delay(80);
}
async function load(component, demo, selector) {
    await browser.call("Page.navigate", { url: `http://127.0.0.1:4173/components/rc-${component}/workbench/?__wake_demo=${encodeURIComponent(`docs/demos/${demo}.demo.tsx`)}` });
    for (let n = 0; n < 80; n++) {
        await delay(100);
        if (await browser.evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)) return;
    }
    throw new Error(`Demo unavailable: ${component}/${demo}`);
}
async function enterNumber(text) {
    await browser.evaluate("document.querySelector('input[role=spinbutton]').focus()");
    await key("a", "KeyA", 65, 2);
    await key("Backspace", "Backspace", 8);
    if (text) await browser.call("Input.insertText", { text });
    await delay(80);
}
async function numberState() {
    return browser.evaluate(`(() => {
        const input=document.querySelector('input[role=spinbutton]');
        return {value:input.value,ariaValue:input.getAttribute('aria-valuenow'),label:input.labels?.[0]?.textContent,focus:document.activeElement===input,upDisabled:document.querySelector('button[aria-label="增加"]').disabled,downDisabled:document.querySelector('button[aria-label="减少"]').disabled,pageWidth:document.documentElement.scrollWidth,viewport:innerWidth};
    })()`);
}
async function selectState() {
    return browser.evaluate(`(() => {
        const control=document.querySelector('[role=combobox]');
        return {value:control.textContent.trim(),focus:document.activeElement===control,expanded:control.getAttribute('aria-expanded'),activeDescendant:control.getAttribute('aria-activedescendant'),listbox:!!document.querySelector('[role=listbox]'),clear:!!document.querySelector('[data-role=select-clear]'),pageWidth:document.documentElement.scrollWidth,viewport:innerWidth};
    })()`);
}
try {
    await browser.call("Page.enable");
    await browser.call("Runtime.enable");
    await browser.call("Emulation.setTouchEmulationEnabled", { enabled: false });
    for (const theme of ["light", "dark"]) for (const width of [320, 768, 1440]) {
        const name = `${theme} ${width}`;
        await browser.call("Emulation.setDeviceMetricsOverride", { width, height: 960, deviceScaleFactor: 1, mobile: false });
        await browser.call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }, { name: "prefers-reduced-motion", value: "reduce" }] });
        await load("number-edit", "basic", "input[role=spinbutton]");
        const initial = await numberState();
        record(`${name} number label and layout`, initial, initial.value === "3" && initial.label === "项目数量" && initial.pageWidth <= width);
        await enterNumber("20");
        const draft = await numberState();
        record(`${name} number draft semantics`, draft, draft.ariaValue === "20");
        await key("ArrowUp", "ArrowUp", 38);
        const stepped = await numberState();
        record(`${name} number draft step`, stepped, stepped.value === "21" && stepped.focus);
        await enterNumber("20.5");
        await key("ArrowUp", "ArrowUp", 38, 8);
        const fractional = await numberState();
        record(`${name} number fractional large step`, fractional, fractional.value === "30.5");
        await key("PageDown", "PageDown", 34);
        const pageStep = await numberState();
        record(`${name} number PageDown`, pageStep, pageStep.value === "20.5");
        await enterNumber("");
        await key("ArrowUp", "ArrowUp", 38);
        const empty = await numberState();
        record(`${name} number empty step`, empty, empty.value === "1");
        await enterNumber("100");
        const boundary = await numberState();
        await key("ArrowUp", "ArrowUp", 38);
        const clamped = await numberState();
        record(`${name} number upper bound`, { boundary, clamped }, boundary.upDisabled && clamped.value === "100");
        await enterNumber("20");
        const enabled = await numberState();
        const point = await browser.evaluate("(() => {const r=document.querySelector('button[aria-label=增加]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");
        await browser.call("Input.dispatchMouseEvent", { type: "mousePressed", button: "left", buttons: 1, clickCount: 1, ...point });
        await browser.call("Input.dispatchMouseEvent", { type: "mouseReleased", button: "left", buttons: 0, clickCount: 1, ...point });
        await delay(100);
        const pointer = await numberState();
        record(`${name} number pointer draft step`, { enabled, pointer }, !enabled.upDisabled && pointer.value === "21" && pointer.focus);
        await load("select", "allowClear", "[role=combobox]");
        await browser.evaluate("document.querySelector('[role=combobox]').focus()");
        await key("Tab", "Tab", 9);
        const clearFocused = await browser.evaluate("document.activeElement?.getAttribute('data-role') === 'select-clear'");
        await key("Enter", "Enter", 13);
        const cleared = await selectState();
        record(`${name} select keyboard clear`, { clearFocused, cleared }, clearFocused && cleared.focus && !cleared.clear && cleared.expanded === "false" && cleared.pageWidth <= width);
        await key("ArrowDown", "ArrowDown", 40);
        const reopened = await selectState();
        record(`${name} select resumes selection`, reopened, reopened.listbox && reopened.expanded === "true" && Boolean(reopened.activeDescendant));
        await key("Enter", "Enter", 13);
        const selected = await selectState();
        record(`${name} select replacement value`, selected, selected.value === "北京" && selected.expanded === "false" && selected.focus);
    }
} catch (error) {
    record("script completion", { error: error.message }, false);
    throw error;
} finally {
    await writeFile(new URL("../review/quality/production/second-input-interactions.json", import.meta.url), JSON.stringify({ capturedAt: new Date().toISOString(), revision, scope: "NumberEdit draft stepping and Select clear recovery only; full search, touch, input formatting and composite state review remain separate.", results, exceptions: browser.exceptions }, null, 2) + "\n");
    await browser.call("Emulation.setEmulatedMedia", { features: [] });
    browser.close();
}
if (results.some(item => !item.passed) || browser.exceptions.length) process.exitCode = 1;
