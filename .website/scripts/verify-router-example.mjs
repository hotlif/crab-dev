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
async function activate(text) {
    const found = await browser.evaluate(`(() => {
        const el=Array.from(document.querySelectorAll('.demo-frame-root a,.demo-frame-root button')).find(el=>el.textContent.trim()===${JSON.stringify(text)});
        el?.focus();return Boolean(el);
    })()`);
    if (!found) throw new Error(`Router example action missing: ${text}`);
    await browser.call("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r", unmodifiedText: "\r" });
    await browser.call("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
    await delay(150);
}
async function snapshot() {
    return browser.evaluate(`(() => {
        const frame=document.querySelector('iframe[title="Router 示例的独立 History"]');
        return {outerURL:location.href,frameURL:frame?.contentWindow.location.href,frameTitle:frame?.contentDocument.title,backDisabled:Array.from(document.querySelectorAll('button')).find(el=>el.textContent.trim()==='后退')?.disabled,text:document.querySelector('.demo-frame-root')?.textContent.trim(),current:Array.from(document.querySelectorAll('.demo-frame-root [aria-current]')).map(el=>el.textContent.trim()),error:document.querySelector('.frame-error')?.textContent};
    })()`);
}
try {
    await browser.call("Page.enable");
    await browser.call("Runtime.enable");
    for (const theme of ["light", "dark"]) {
        await browser.call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }] });
        const url = "http://127.0.0.1:4173/components/rc-router/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx";
        await browser.call("Page.navigate", { url });
        let ready = false;
        for (let n = 0; n < 80; n++) {
            await delay(100);
            ready = await browser.evaluate("Boolean(document.querySelector('.demo-frame-root a'))");
            if (ready) break;
        }
        if (!ready) throw new Error(JSON.stringify(await snapshot()));
        const initial = await snapshot();
        record(`${theme} initial isolated route`, initial, initial.outerURL === url && initial.text.includes("请选择一个示例页面") && initial.backDisabled && !initial.error);
        await activate("用户");
        const user = await snapshot();
        record(`${theme} user navigation`, user, user.outerURL === url && user.frameURL.endsWith("/users/42") && user.text.includes("当前用户：42") && user.current.includes("用户"));
        await activate("搜索参数");
        await activate("切换到活动");
        const search = await snapshot();
        record(`${theme} query update`, search, search.outerURL === url && search.frameURL.endsWith("/search?tab=activity") && search.text.includes("当前标签：activity"));
        await activate("后退");
        const back = await snapshot();
        record(`${theme} back within example`, back, back.outerURL === url && back.frameURL.endsWith("/search") && back.text.includes("当前标签：overview") && back.frameTitle === "Router 示例 History");
        await activate("后退");
        const userBack = await snapshot();
        record(`${theme} back to user`, userBack, userBack.outerURL === url && userBack.text.includes("当前用户：42"));
        await activate("后退");
        const homeBack = await snapshot();
        record(`${theme} stop at initial entry`, homeBack, homeBack.outerURL === url && homeBack.backDisabled && homeBack.text.includes("请选择一个示例页面"));
    }
} finally {
    await writeFile(new URL("../review/quality/production/router-interactions.json", import.meta.url), JSON.stringify({ capturedAt: new Date().toISOString(), revision, results, exceptions: browser.exceptions }, null, 2) + "\n");
    await browser.call("Emulation.setEmulatedMedia", { features: [] });
    browser.close();
}
if (results.some(item => !item.passed) || browser.exceptions.length) process.exitCode = 1;
