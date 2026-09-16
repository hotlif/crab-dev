import { writeFile } from "node:fs/promises";
import { connectReviewBrowser } from "./production-browser.mjs";
import { productionRevision } from "./production-revision.mjs";

const browser = await connectReviewBrowser();
const results = [];
const revision = await productionRevision();
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function record(check, evidence, passed) {
    results.push({ check, passed, evidence });
    console.log(`${passed ? "PASS" : "REVIEW"} ${check}: ${JSON.stringify(evidence)}`);
}
async function key(key, code, value) {
    await browser.call("Input.dispatchKeyEvent", { type: "keyDown", key, code, windowsVirtualKeyCode: value, ...(key === "Enter" ? { text: "\r", unmodifiedText: "\r" } : {}) });
    await browser.call("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: value });
    await delay(150);
}
try {
    await browser.call("Page.enable");
    await browser.call("Runtime.enable");
    await browser.call("Emulation.setDeviceMetricsOverride", { width: 768, height: 960, deviceScaleFactor: 1, mobile: false });
    await browser.call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "light" }, { name: "prefers-reduced-motion", value: "reduce" }] });
    await browser.call("Page.navigate", { url: "http://127.0.0.1:4173/components/rc-token-global" });
    let ready = false;
    for (let n = 0; n < 60; n++) {
        await delay(100);
        ready = await browser.evaluate("Boolean(document.querySelector('button[aria-label=\"查看 purple.10\"]'))");
        if (ready) break;
    }
    if (!ready) throw new Error("Reference samples did not load");
    await browser.evaluate("document.querySelector('button[aria-label=\"查看 purple.10\"]').focus()");
    await key("ArrowRight", "ArrowRight", 39);
    const selection = await browser.evaluate(`(() => {
        const el=document.activeElement;const family=el.closest('.tgr-color-family');
        return {name:el.getAttribute('aria-label'),pressed:el.getAttribute('aria-pressed'),reference:family.querySelector('.tgr-expression').textContent,focus:getComputedStyle(el).outlineStyle,tabStops:family.querySelectorAll('.tgr-color-choice[tabindex="0"]').length};
    })()`);
    record("Purple keyboard selection", selection, selection.name === "查看 purple.20" && selection.pressed === "true" && selection.reference === 'globalToken.purple["20"]' && selection.focus === "solid" && selection.tabStops === 1);

    // The permission belongs only to this local isolated browser context.
    await browser.call("Browser.grantPermissions", { origin: "http://127.0.0.1:4173", permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"] });
    await browser.evaluate("document.querySelector('.tgr-color-family button[aria-label^=\"复制引用\"]').focus()");
    await key("Enter", "Enter", 13);
    const copied = await browser.evaluate("navigator.clipboard.readText().then(text=>({text,status:document.querySelector('.tgr-color-family .tgr-copy [role=status]').textContent,focused:document.activeElement===document.querySelector('.tgr-color-family button[aria-label^=\"复制引用\"]')}))");
    record("Copy public expression and retain focus", copied, copied.text === selection.reference && copied.status === "已复制" && copied.focused);

    // Explicit fault injection for a denied/unavailable clipboard; navigation clears it.
    await browser.evaluate("Object.defineProperty(navigator.clipboard,'writeText',{configurable:true,value:()=>Promise.reject(new DOMException('Review fault injection','NotAllowedError'))})");
    await browser.evaluate("document.querySelector('.tgr-color-family button[aria-label^=\"复制引用\"]').focus()");
    await key("Enter", "Enter", 13);
    const failure = await browser.evaluate("({status:document.querySelector('.tgr-color-family .tgr-copy [role=status]').textContent,code:document.querySelector('.tgr-color-family .tgr-expression').textContent,selection:getComputedStyle(document.querySelector('.tgr-color-family .tgr-expression')).userSelect})");
    record("Copy denial retains selectable code", failure, failure.status.includes("复制失败") && failure.code === selection.reference && failure.selection !== "none");

    const motionBefore = await browser.evaluate("document.querySelector('[data-group=motion]').getAttribute('data-moving')");
    await browser.evaluate("document.querySelector('[data-group=motion] button').focus()");
    await key("Enter", "Enter", 13);
    const motion = await browser.evaluate(`(() => {
        const section=document.querySelector('[data-group=motion]');
        return {before:${JSON.stringify(motionBefore)},after:section.getAttribute('data-moving'),reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,note:getComputedStyle(section.querySelector('.tgr-reduced')).display,samples:Array.from(section.querySelectorAll('.tgr-sample')).map(el=>({transition:getComputedStyle(el).transitionDuration,animation:getComputedStyle(el).animationName}))};
    })()`);
    record("Reduced motion preserves explicit state change", motion, motion.before === "false" && motion.after === "true" && motion.reduced && motion.note !== "none" && motion.samples.every(item => item.transition === "0s" && item.animation === "none"));
} finally {
    await writeFile(new URL("../review/quality/production/reference-interactions.json", import.meta.url), JSON.stringify({ capturedAt: new Date().toISOString(), revision, scope: "Isolated Chrome keyboard, clipboard and reduced-motion checks; clipboard denial explicitly injected.", results, exceptions: browser.exceptions }, null, 2) + "\n");
    await browser.call("Emulation.setEmulatedMedia", { features: [] });
    browser.close();
}
if (results.some(item => !item.passed)) process.exitCode = 1;
