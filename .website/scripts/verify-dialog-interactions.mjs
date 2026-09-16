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
    await delay(60);
}
async function open() {
    const found = await browser.evaluate("(() => {const trigger=Array.from(document.querySelectorAll('button')).find(el=>el.textContent.trim()==='打开对话框');trigger?.focus();return Boolean(trigger)})()");
    if (!found) throw new Error("Dialog demo trigger missing");
    await key("Enter", "Enter", 13);
    let opened = false;
    for (let n = 0; n < 40; n++) {
        opened = await browser.evaluate("Boolean(document.querySelector('dialog[open]'))");
        if (opened) break;
        await delay(50);
    }
    if (!opened) throw new Error("Dialog did not reopen after one keyboard activation");
    await delay(300);
}
async function snapshot() {
    return browser.evaluate(`(() => {
        const dialog=document.querySelector('dialog[open]');
        if(!dialog)return {open:false,focus:document.activeElement?.textContent.trim()};
        const panel=dialog.children[1];const close=dialog.querySelector('svg[data-icon="close"]')?.closest('button');
        const r=dialog.getBoundingClientRect(),p=panel.getBoundingClientRect(),c=close?.getBoundingClientRect();
        const buttons=Array.from(panel.lastElementChild.querySelectorAll('button')).map(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,clientWidth:el.clientWidth,scrollWidth:el.scrollWidth,clientHeight:el.clientHeight,scrollHeight:el.scrollHeight}));
        return {open:true,within:r.left>=0&&r.right<=innerWidth+1&&p.top>=0&&p.bottom<=innerHeight+1,pageWidth:document.documentElement.scrollWidth,viewport:innerWidth,panelWidth:panel.clientWidth,panelScrollWidth:panel.scrollWidth,panelHeight:panel.clientHeight,panelScrollHeight:panel.scrollHeight,panelScrollTop:panel.scrollTop,closeName:close?.getAttribute('aria-label'),closeVisible:Boolean(close&&!close.closest('[aria-hidden="true"]')),closeWidth:c?.width,closeHeight:c?.height,closeFocused:document.activeElement===close,closeOutline:close?getComputedStyle(close).outlineStyle:null,closeOutlineWidth:close?getComputedStyle(close).outlineWidth:null,forcedBoundary:getComputedStyle(panel).outlineStyle,transition:close?getComputedStyle(close).transitionDuration:null,buttons};
    })()`);
}
try {
    await browser.call("Page.enable");
    await browser.call("Runtime.enable");
    for (const theme of ["light", "dark"]) for (const width of [320, 1440]) for (const mode of ["normal", "coarse", "forced", "reduced"]) {
        const label = `${theme} ${width} ${mode}`;
        await browser.call("Emulation.setDeviceMetricsOverride", { width, height: width === 320 ? 480 : 960, deviceScaleFactor: 1, mobile: false });
        await browser.call("Emulation.setTouchEmulationEnabled", { enabled: mode === "coarse", maxTouchPoints: 1 });
        await browser.call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }, { name: "forced-colors", value: mode === "forced" ? "active" : "none" }, { name: "prefers-reduced-motion", value: mode === "reduced" ? "reduce" : "no-preference" }] });
        await browser.call("Page.navigate", { url: "http://127.0.0.1:4173/components/rc-dialog/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx" });
        for (let n = 0; n < 80; n++) {
            await delay(100);
            if (await browser.evaluate("Array.from(document.querySelectorAll('button')).some(el=>el.textContent.trim()==='打开对话框')")) break;
        }
        await open();
        const opened = await snapshot();
        // Wake's shared reduced-motion reset uses a 0.01ms floor for lifecycle events.
        const reducedTransition = opened.transition?.split(",").every(value => Number.parseFloat(value) <= 0.00001);
        record(`${label} named close and focus`, opened, opened.open && opened.within && opened.closeVisible && opened.closeName === "取消" && opened.closeFocused && opened.closeOutline === "solid" && Number.parseFloat(opened.closeOutlineWidth) >= 2 && (mode !== "coarse" || (opened.closeWidth >= 44 && opened.closeHeight >= 44)) && (mode !== "forced" || opened.forcedBoundary === "solid") && (mode !== "reduced" || reducedTransition));
        await key("Enter", "Enter", 13);
        await delay(250);
        const closed = await snapshot();
        record(`${label} close returns focus`, closed, !closed.open && closed.focus === "打开对话框");
        await open();
        // Synthetic long content only: no React props or handlers are patched.
        await browser.evaluate(`(() => {
            const dialog=document.querySelector('dialog[open]'),panel=dialog.children[1];
            document.getElementById(dialog.getAttribute('aria-labelledby')).textContent='确认归档华东区域企业项目台账与成员编辑记录 Project-2026-Long-Identifier';
            panel.children[1].textContent='请核对项目范围，归档后可从历史记录查看完整内容。'.repeat(270);
            const buttons=panel.lastElementChild.querySelectorAll('button');
            buttons[0].querySelector('span').textContent='继续核对项目资料并保留当前编辑内容';
            buttons[1].querySelector('span').textContent='确认归档全部已选项目 ArchiveAllSelectedProjects2026';
        })()`);
        if (mode === "normal") {
            // Explicit text enlargement simulation, not a claim of native browser zoom.
            // Read all sizes first to avoid multiplying inherited sizes repeatedly.
            await browser.evaluate(`(() => {
                const nodes=Array.from(document.querySelectorAll('dialog,dialog *')).filter(el=>el instanceof HTMLElement);
                const sizes=nodes.map(el=>{const s=getComputedStyle(el);return {el,font:parseFloat(s.fontSize)*2,line:parseFloat(s.lineHeight)*2}});
                for(const {el,font,line} of sizes){el.style.fontSize=font+'px';if(Number.isFinite(line))el.style.lineHeight=line+'px'}
            })()`);
        }
        await browser.evaluate("document.querySelector('dialog[open]').children[1].lastElementChild.querySelector('button:last-child').focus()");
        await delay(150);
        const long = await snapshot();
        record(`${label} long content${mode === "normal" ? " with 200% simulated text" : ""}`, long, long.within && long.pageWidth <= width && long.panelScrollWidth <= long.panelWidth + 1 && long.buttons.every(button => button.scrollWidth <= button.clientWidth + 1 && button.scrollHeight <= button.clientHeight + 1) && long.panelScrollTop > 0);
        if (width === 320 && mode === "normal") {
            const shot = await browser.call("Page.captureScreenshot", { format: "png" });
            await writeFile(new URL(`../review/quality/production/dialog-long-${theme}-320.png`, import.meta.url), Buffer.from(shot.data, "base64"));
        }
        await key("Escape", "Escape", 27);
        await delay(250);
        const escaped = await snapshot();
        record(`${label} Escape returns focus`, escaped, !escaped.open && escaped.focus === "打开对话框");
    }
} catch (error) {
    record("script completion", { error: error.message }, false);
    throw error;
} finally {
    await writeFile(new URL("../review/quality/production/dialog-interactions.json", import.meta.url), JSON.stringify({ capturedAt: new Date().toISOString(), revision, scope: "Production base demo. Long text and 200% text size are explicitly injected layout fixtures; async cancellation, native text-only zoom and real screen reader remain separate.", results, exceptions: browser.exceptions }, null, 2) + "\n");
    await browser.call("Emulation.setTouchEmulationEnabled", { enabled: false });
    await browser.call("Emulation.setEmulatedMedia", { features: [] });
    browser.close();
}
if (results.some(item => !item.passed) || browser.exceptions.length) process.exitCode = 1;
