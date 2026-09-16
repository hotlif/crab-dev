import { writeFile } from "node:fs/promises";
import { connectReviewBrowser } from "./production-browser.mjs";
import { productionRevision } from "./production-revision.mjs";

const revision = await productionRevision();
const browser = await connectReviewBrowser();
const results = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const input = 'form[aria-label="成员资料表单"] input';
function record(check, evidence, passed) {
    results.push({ check, passed, evidence });
    console.log(`${passed ? "PASS" : "REVIEW"} ${check}: ${JSON.stringify(evidence)}`);
}
async function key(key, code, value, modifiers = 0) {
    await browser.call("Input.dispatchKeyEvent", { type: "keyDown", key, code, modifiers, windowsVirtualKeyCode: value, ...(key === "Enter" ? { text: "\r", unmodifiedText: "\r" } : {}) });
    await browser.call("Input.dispatchKeyEvent", { type: "keyUp", key, code, modifiers, windowsVirtualKeyCode: value });
    await delay(80);
}
async function activate(label) {
    const found = await browser.evaluate(`(() => {
        const buttons=Array.from(document.querySelectorAll('button')).filter(el=>el.getBoundingClientRect().width>0&&!el.closest('dialog:not([open])'));
        const el=buttons.find(el=>el.textContent.trim()===${JSON.stringify(label)})??buttons.find(el=>el.getAttribute('aria-label')===${JSON.stringify(label)});
        el?.focus();return Boolean(el);
    })()`);
    if (!found) throw new Error(`Profile action missing: ${label}`);
    await key("Enter", "Enter", 13);
}
async function setName(value) {
    await browser.evaluate(`document.querySelector(${JSON.stringify(input)}).focus()`);
    await key("a", "KeyA", 65, 2);
    await key("Backspace", "Backspace", 8);
    if (value) await browser.call("Input.insertText", { text: value });
}
async function snapshot() {
    return browser.evaluate(`(() => {
        const dialogs=Array.from(document.querySelectorAll('dialog[open]'));
        const field=document.querySelector(${JSON.stringify(input)});const form=document.querySelector('form[aria-label="成员资料表单"]');const top=dialogs.at(-1);const r=top?.getBoundingClientRect();
        return {dialogs:dialogs.length,focusInside:Boolean(top?.contains(document.activeElement)),documentFocused:document.hasFocus(),focusText:document.activeElement?.textContent.trim().slice(0,80),focusTag:document.activeElement?.tagName,value:field?.value,invalid:field?.getAttribute('aria-invalid'),focusedField:document.activeElement===field,busy:form?.getAttribute('aria-busy'),pageWidth:document.documentElement.scrollWidth,viewport:innerWidth,dialogWithin:!r||(r.left>=-1&&r.right<=innerWidth+1),text:top?.textContent.trim()};
    })()`);
}
try {
    await browser.call("Page.enable");
    await browser.call("Runtime.enable");
    for (const theme of ["light", "dark"]) for (const width of [320, 1440]) {
        const name = `${theme} ${width}`;
        await browser.call("Emulation.setDeviceMetricsOverride", { width, height: 960, deviceScaleFactor: 1, mobile: false });
        await browser.call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }, { name: "prefers-reduced-motion", value: "reduce" }] });
        await browser.call("Page.navigate", { url: "http://127.0.0.1:4173/design/forms" });
        for (let n = 0; n < 80; n++) {
            await delay(100);
            if (await browser.evaluate("Array.from(document.querySelectorAll('button')).some(el=>el.textContent.trim()==='编辑成员资料')")) break;
        }
        await activate("编辑成员资料");
        await delay(150);
        const opened = await snapshot();
        record(`${name} drawer open`, opened, opened.dialogs === 1 && opened.focusInside && opened.dialogWithin && opened.pageWidth <= width);
        let backgroundExcluded = true;
        let browserChromeStops = 0;
        let bodyStops = 0;
        let previousBodyStop = false;
        for (let n = 0; n < 12; n++) {
            await key("Tab", "Tab", 9);
            const state = await snapshot();
            // Native modal traversal can expose BODY at the browser boundary.
            // Headless hasFocus is inconsistent there; verify actual background
            // controls are inert and the next Tab returns to the modal separately.
            if (state.focusTag === "BODY") {
                bodyStops++;
                if (!state.documentFocused) browserChromeStops++;
                backgroundExcluded &&= !previousBodyStop;
                previousBodyStop = true;
            } else {
                backgroundExcluded &&= state.focusInside;
                previousBodyStop = false;
            }
        }
        if (previousBodyStop) {
            await key("Tab", "Tab", 9);
            backgroundExcluded &&= (await snapshot()).focusInside;
        }
        const backgroundFocusRejected = await browser.evaluate(`(() => {
            const trigger=Array.from(document.querySelectorAll('button')).find(el=>el.textContent.trim()==='编辑成员资料');
            trigger.focus();return document.activeElement!==trigger;
        })()`);
        record(`${name} modal background excluded`, { backgroundExcluded, backgroundFocusRejected, bodyStops, browserChromeStops }, backgroundExcluded && backgroundFocusRejected);
        await setName("审查草稿");
        await activate("取消编辑");
        const confirm = await snapshot();
        record(`${name} unsaved confirmation`, confirm, confirm.dialogs === 2 && confirm.focusInside && confirm.dialogWithin && confirm.text.includes("放弃未保存"));
        await activate("继续编辑");
        const retained = await snapshot();
        record(`${name} continue preserves draft`, retained, retained.dialogs === 1 && retained.focusInside && retained.value === "审查草稿");
        await setName("");
        await activate("保存修改");
        const invalid = await snapshot();
        record(`${name} validation recovery`, invalid, invalid.invalid === "true" && invalid.focusedField && invalid.dialogs === 1);
        await setName("审查成员");
        await activate("保存修改");
        const pending = await snapshot();
        record(`${name} pending feedback and focus`, pending, pending.busy === "true" && pending.focusInside && pending.text.includes("正在保存"));
        for (let n = 0; n < 40; n++) {
            await delay(100);
            if ((await snapshot()).dialogs === 0) break;
        }
        const saved = await browser.evaluate("({dialogs:document.querySelectorAll('dialog[open]').length,focus:document.activeElement?.textContent.trim(),notice:document.querySelector('.crab-language')?.textContent.includes('已保存 审查成员 的资料')})");
        record(`${name} saved and returned`, saved, saved.dialogs === 0 && saved.focus === "编辑成员资料" && saved.notice);
    }
} finally {
    await writeFile(new URL("../review/quality/production/profile-interactions.json", import.meta.url), JSON.stringify({ capturedAt: new Date().toISOString(), revision, scope: "Local success, validation and unsaved-draft flows. Server failure injection and screen reader remain separate.", results, exceptions: browser.exceptions }, null, 2) + "\n");
    await browser.call("Emulation.setEmulatedMedia", { features: [] });
    browser.close();
}
if (results.some(item => !item.passed) || browser.exceptions.length) process.exitCode = 1;
