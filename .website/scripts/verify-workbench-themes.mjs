import { readFile, readdir, writeFile } from "node:fs/promises";
import { connectReviewBrowser } from "./production-browser.mjs";
import { productionRevision } from "./production-revision.mjs";

const baseline = JSON.parse(await readFile(new URL("../review/quality/baseline.json", import.meta.url), "utf8"));
const publicCSS = await readFile(new URL("../../components/rc-theme/css/index.css", import.meta.url), "utf8");
const names = [...new Set(publicCSS.match(/--token-semantic-(?:color-[\w-]+|shadow-focus-ring)(?=\s*:)/g))].sort();
if (!names.length) throw new Error("Public theme CSS has no color declarations; build rc-theme first.");
const revision = await productionRevision();
const browser = await connectReviewBrowser();
const results = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
    await browser.call("Page.enable");
    await browser.call("Runtime.enable");
    await browser.call("Emulation.setTouchEmulationEnabled", { enabled: false });
    await browser.call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 960, deviceScaleFactor: 1, mobile: false });
    for (const item of baseline.packages) {
        const component = item.name.replace("@crab-dev/", "");
        const entries = await readdir(new URL(`../../components/${component}/docs/demos/`, import.meta.url)).catch(error => {
            if (error.code === "ENOENT") return [];
            throw error;
        });
        const demos = entries.filter(file => file.endsWith(".demo.tsx")).sort();
        const demo = demos.includes("simple.demo.tsx") ? "simple.demo.tsx" : demos[0];
        if (!demo) { results.push({ component, status: "not-applicable", reason: "No standalone demo in this package; bridge contract checked separately." }); continue; }
        for (const theme of ["light", "dark"]) {
            await browser.call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }, { name: "prefers-reduced-motion", value: "reduce" }] });
            await browser.call("Page.navigate", { url: `http://127.0.0.1:4173/components/${component}/workbench/?__wake_demo=${encodeURIComponent(`docs/demos/${demo}`)}` });
            let ready = false;
            for (let n = 0; n < 80; n++) {
                await delay(100);
                ready = await browser.evaluate("document.readyState === 'complete' && Boolean(document.querySelector('.demo-frame-root')?.children.length)");
                if (ready) break;
            }
            if (!ready) {
                results.push({ component, theme, passed: false, reason: "Demo did not render" });
                console.log(`REVIEW ${component} ${theme}: demo unavailable`);
                continue;
            }
            const data = await browser.evaluate(`(() => {
                // A sibling scope receives rc-theme without Wake's frame-only defaults.
                const probe=document.createElement('div');probe.hidden=true;probe.dataset.theme=${JSON.stringify(theme)};document.body.append(probe);
                const expected=getComputedStyle(probe);const frame=document.querySelector('.demo-frame-root');const actual=getComputedStyle(frame);
                const differences=${JSON.stringify(names)}.map(name=>({name,expected:expected.getPropertyValue(name).trim(),actual:actual.getPropertyValue(name).trim()})).filter(item=>item.expected!==item.actual||!item.expected);
                const data={actualTheme:frame.dataset.theme,roles:${names.length},differences};probe.remove();return data;
            })()`);
            const passed = data.differences.length === 0 && data.actualTheme === theme;
            results.push({ component, demo, theme, passed, ...data });
            console.log(`${passed ? "PASS" : "REVIEW"} ${component} ${theme}: ${names.length} public roles, ${data.differences.length} differences`);
        }
    }
} finally {
    await writeFile(new URL("../review/quality/production/workbench-themes.json", import.meta.url), JSON.stringify({ capturedAt: new Date().toISOString(), revision, scope: "First standalone demo host of each package; theme parity only, not all component states or nested overlays.", results, exceptions: browser.exceptions }, null, 2) + "\n");
    await browser.call("Emulation.setEmulatedMedia", { features: [] });
    browser.close();
}
if (results.some(item => item.passed === false) || browser.exceptions.length) process.exitCode = 1;
