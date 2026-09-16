import { readFile, writeFile } from "node:fs/promises";
import { connectReviewBrowser } from "./production-browser.mjs";
import { readGlobalTokens } from "./generate-token-reference.mjs";
import { productionRevision } from "./production-revision.mjs";

// Browser integration evidence complements, and never replaces, the package test gate.
const browser = await connectReviewBrowser();
const results = [];
const revision = await productionRevision();
const globals = new Map(readGlobalTokens(await readFile(new URL("../../components/rc-token-global/token.toml", import.meta.url), "utf8")).map(entry => [entry.key, entry.value]));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function key(key, code, virtualKey) {
    await browser.call("Input.dispatchKeyEvent", { type: "keyDown", key, code, windowsVirtualKeyCode: virtualKey, ...(key === "Enter" ? { text: "\r", unmodifiedText: "\r" } : {}) });
    await browser.call("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: virtualKey });
    await delay(100);
}
async function navigate(route, theme, forced = false) {
    await browser.call("Emulation.setTouchEmulationEnabled", { enabled: false });
    await browser.call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 960, deviceScaleFactor: 1, mobile: false });
    await browser.call("Emulation.setEmulatedMedia", { features: [
        { name: "prefers-color-scheme", value: theme },
        { name: "forced-colors", value: forced ? "active" : "none" },
        { name: "prefers-reduced-motion", value: "reduce" },
    ] });
    await browser.call("Page.navigate", { url: `http://127.0.0.1:4173${route}` });
    let ready = false;
    for (let n = 0; n < 60; n++) {
        await delay(100);
        ready = await browser.evaluate(`location.pathname === ${JSON.stringify(route)} && document.readyState === 'complete' && Boolean(document.querySelector('[data-live-example]'))`);
        if (ready) break;
    }
    if (!ready) throw new Error(`Live example unavailable: ${route}`);
    await delay(600);
}
function record(check, data, passed) {
    results.push({ check, passed, ...data });
    console.log(`${passed ? "PASS" : "REVIEW"} ${check}: ${JSON.stringify(data)}`);
}
try {
    await browser.call("Page.enable");
    await browser.call("Runtime.enable");
    for (const component of ["checkbox", "radio", "switch"]) {
        const selector = component === "switch" ? '[role="switch"]' : `input[type="${component}"]`;
        for (const theme of ["light", "dark"]) for (const forced of [false, true]) {
            await navigate(`/components/rc-${component}`, theme, forced);
            // Enter the live example through its preceding reset control, then use real Tab.
            await browser.evaluate("document.querySelector('[data-live-example] button[aria-label=\"重置基础示例\"]').focus()");
            await key("Tab", "Tab", 9);
            const before = await browser.evaluate(`(() => {
                const controls = Array.from(document.querySelectorAll('[data-live-example] ${selector}'));
                const index = ${JSON.stringify(component)} === 'radio' ? Math.max(0, controls.indexOf(document.activeElement)) : 0;
                const el = controls[index];
                const visual = el.matches('input') ? el.nextElementSibling : el;
                const css = getComputedStyle(visual);
                return { index, count:controls.length, focused:document.activeElement === el, visible:el.matches(':focus-visible'), state:el.checked ?? el.getAttribute('aria-checked'), outline:css.outlineStyle, outlineWidth:parseFloat(css.outlineWidth), outlineColor:css.outlineColor, color:css.color, background:css.backgroundColor, forced:matchMedia('(forced-colors: active)').matches, label:el.closest('label')?.textContent.trim() };
            })()`);
            const root = await browser.call("DOM.getDocument", { depth: 0 });
            const nodes = await browser.call("DOM.querySelectorAll", { nodeId: root.root.nodeId, selector: `[data-live-example] ${selector}` });
            const accessibility = await browser.call("Accessibility.getPartialAXTree", { nodeId: nodes.nodeIds[before.index], fetchRelatives: false });
            before.accessibleName = accessibility.nodes.find(item => !item.ignored)?.name?.value;
            record(`${component} ${theme} ${forced ? "forced" : "normal"} keyboard focus`, before, before.focused && before.visible && before.outline === "solid" && before.outlineWidth >= 2 && Boolean(before.accessibleName));
            await key(" ", "Space", 32);
            const after = await browser.evaluate(`(() => {const el=document.querySelectorAll('[data-live-example] ${selector}')[${before.index}];const visual=el.matches('input')?el.nextElementSibling:el;return {state:el.checked ?? el.getAttribute('aria-checked'),background:getComputedStyle(visual).backgroundColor}})()`);
            record(`${component} ${theme} ${forced ? "forced" : "normal"} Space`, { before: before.state, after: after.state }, component === "radio" ? after.state === true : after.state !== before.state);
            if (forced && component !== "radio") record(`${component} ${theme} system color state distinction`, { before: before.background, after: after.background }, before.background !== after.background);
            if (component === "radio") {
                await key("ArrowRight", "ArrowRight", 39);
                const moved = await browser.evaluate(`(() => {
                    const radios=Array.from(document.querySelectorAll('[data-live-example] input[type=radio]'));
                    return {index:radios.indexOf(document.activeElement),background:getComputedStyle(radios[${before.index}].nextElementSibling).backgroundColor};
                })()`);
                record(`radio ${theme} ${forced ? "forced" : "normal"} arrow moves within group`, moved, moved.index === (before.index + 1) % before.count);
                if (forced) record(`radio ${theme} system color state distinction`, { checked: after.background, unchecked: moved.background }, after.background !== moved.background);
                for (let n = 1; n < before.count; n++) await key("ArrowRight", "ArrowRight", 39);
                const group = await browser.evaluate(`(() => {
                    const radios=Array.from(document.querySelectorAll('[data-live-example] input[type=radio]'));
                    return {focusedOriginal:document.activeElement===radios[${before.index}],checked:radios.map(el=>el.checked),sameGroup:radios.every(el=>el.name===radios[0].name),named:Boolean(radios[0].name)};
                })()`);
                record(`radio ${theme} ${forced ? "forced" : "normal"} arrow loop stays in group`, group, group.focusedOriginal && group.checked[before.index] && group.checked.filter(Boolean).length === 1 && group.sameGroup && group.named);
            }
        }
        await browser.call("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
        const target = await browser.evaluate(`(() => {
            const el=document.querySelector('[data-live-example] ${selector}'); const r=el.closest('label').getBoundingClientRect();
            return {coarse:matchMedia('(pointer: coarse)').matches,width:r.width,height:r.height};
        })()`);
        record(`${component} coarse target`, target, target.coarse && target.width >= 44 && target.height >= 44);
    }
    for (const theme of ["light", "dark"]) {
        await browser.call("Emulation.setTouchEmulationEnabled", { enabled: false });
        await browser.call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }, { name: "prefers-reduced-motion", value: "reduce" }] });
        await browser.call("Page.navigate", { url: "http://127.0.0.1:4173/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Floading.demo.tsx" });
        for (let n = 0; n < 60; n++) {
            await delay(100);
            if (await browser.evaluate("document.querySelectorAll('button[data-is-loading]').length === 5")) break;
        }
        const loading = await browser.evaluate(`Array.from(document.querySelectorAll('button[data-is-loading]')).map(el => {
            const css=getComputedStyle(el); const accepted=el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
            return {name:el.textContent.trim(),busy:el.getAttribute('aria-busy'),disabled:el.getAttribute('aria-disabled'),defaultPrevented:!accepted,opacity:css.opacity,color:css.color,background:css.backgroundColor};
        })`);
        record(`button ${theme} loading activation`, { buttons: loading }, loading.length === 5 && loading.every(item => item.busy === "true" && item.disabled === "true" && item.defaultPrevented && item.opacity === "1"));
        const expected = await browser.evaluate(`(() => {
            const probe=document.createElement('span');probe.hidden=true;document.body.append(probe);
            const normalize=value=>{probe.style.color=value;return getComputedStyle(probe).color};
            const result={background:normalize(${JSON.stringify(globals.get(theme === "light" ? "purple.40" : "purple.80"))}),foreground:normalize(${JSON.stringify(globals.get(theme === "light" ? "white" : "purple.20"))})};probe.remove();return result;
        })()`);
        record(`button ${theme} standalone public theme`, { expected, actual: loading[0] }, loading[0]?.background === expected.background && loading[0]?.color === expected.foreground);
        await browser.evaluate(`document.querySelector('button[data-is-loading]').focus(); globalThis.reviewActivation=null; document.addEventListener('click', event => {setTimeout(() => {globalThis.reviewActivation={keyGenerated:event.detail===0,defaultPrevented:event.defaultPrevented}},0)}, {capture:true,once:true})`);
        await key("Enter", "Enter", 13);
        const keyboard = await browser.evaluate("({activation:globalThis.reviewActivation,focused:document.activeElement?.matches('button[data-is-loading]'),outline:getComputedStyle(document.activeElement).outlineStyle})");
        record(`button ${theme} loading Enter`, keyboard, keyboard.activation?.keyGenerated && keyboard.activation.defaultPrevented && keyboard.focused && keyboard.outline === "solid");
        await browser.call("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
        const targets = await browser.evaluate("Array.from(document.querySelectorAll('button[data-is-loading]')).map(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height}})");
        record(`button ${theme} coarse targets`, { targets }, targets.length === 5 && targets.every(item => item.width >= 44 && item.height >= 44));
        await browser.call("Page.navigate", { url: "http://127.0.0.1:4173/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fselected.demo.tsx" });
        for (let n = 0; n < 60; n++) {
            await delay(100);
            if (await browser.evaluate("Boolean(document.querySelector('button[aria-label=\"居中对齐\"]'))")) break;
        }
        await browser.evaluate("document.querySelector('button[aria-label=\"居中对齐\"]').focus()");
        await key("Enter", "Enter", 13);
        const toggles = await browser.evaluate("Array.from(document.querySelectorAll('button[aria-label]')).map(el=>({name:el.getAttribute('aria-label'),pressed:el.getAttribute('aria-pressed')}))");
        record(`button ${theme} selected state after keyboard activation`, { toggles }, toggles.find(item => item.name === "居中对齐")?.pressed === "true" && toggles.filter(item => item.pressed === "true").length === 1 && toggles.filter(item => item.pressed === "false").length === 2);
    }
} finally {
    await writeFile(new URL("../review/quality/production/first-controls.json", import.meta.url), JSON.stringify({ capturedAt: new Date().toISOString(), revision, scope: "Rendered first live examples in isolated Chrome; no screen reader or physical device claim; React gate remains separate.", results, exceptions: browser.exceptions }, null, 2) + "\n");
    await browser.call("Emulation.setTouchEmulationEnabled", { enabled: false });
    await browser.call("Emulation.setEmulatedMedia", { features: [] });
    browser.close();
}
if (results.some(item => !item.passed)) process.exitCode = 1;
