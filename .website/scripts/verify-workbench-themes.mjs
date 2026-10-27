import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { connectReviewBrowser } from "./production-browser.mjs";
import { productionRevision } from "./production-revision.mjs";
import { loadLibraryManifest } from "../../scripts/library-manifest.mjs";
import { createThemeRoleAuditExpression, themeRoleAuditPassed } from "./theme-role-validation.mjs";

const inventory = await loadLibraryManifest();
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const output = new URL(`../review/runs/${runId}/`, import.meta.url);
await mkdir(output, { recursive: true });
const publicCSS = await readFile(new URL("../../components/rc-theme/css/index.css", import.meta.url), "utf8");
const names = [...new Set(publicCSS.match(/--token-semantic-[\w-]+(?=\s*:)/g))].sort();
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
    for (const item of inventory.packages) {
        const component = item.name.replace("@crab-dev/", "");
        const entries = await readdir(new URL(`../../components/${component}/docs/demos/`, import.meta.url)).catch(error => {
            if (error.code === "ENOENT") return [];
            throw error;
        });
        const demos = entries.filter(file => file.endsWith(".demo.tsx")).sort();
        const demo = demos.includes("simple.demo.tsx") ? "simple.demo.tsx" : demos[0];
        if (!demo) { results.push({ component, status: "not-applicable", reason: "No standalone demo in this package; bridge contract checked separately." }); continue; }
        for (const design of inventory.designSystems.map(system => system.id)) for (const theme of ["light", "dark"]) {
            await browser.call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }, { name: "prefers-reduced-motion", value: "reduce" }] });
            await browser.call("Page.navigate", { url: `http://127.0.0.1:4173/components/${component}/workbench/?__wake_demo=${encodeURIComponent(`docs/demos/${demo}`)}` });
            let ready = false;
            for (let n = 0; n < 80; n++) {
                await delay(100);
                ready = await browser.evaluate("document.readyState === 'complete' && Boolean(document.querySelector('.demo-frame-root')?.children.length)");
                if (ready) break;
            }
            if (!ready) {
                results.push({ component, designSystem: design, colorMode: theme, passed: false, reason: "Demo did not render" });
                console.log(`REVIEW ${component} ${theme}: demo unavailable`);
                continue;
            }
            await browser.evaluate(`(() => {
                localStorage.setItem('crab-docs-design', ${JSON.stringify(design)});
                localStorage.setItem('wake-docs-theme', ${JSON.stringify(theme)});
                window.postMessage({type:'crab:preview-config',designSystem:${JSON.stringify(design)},colorMode:${JSON.stringify(theme)}}, location.origin);
            })()`);
            await delay(150);
            const data = await browser.evaluate(createThemeRoleAuditExpression(names, design, theme));
            const passed = themeRoleAuditPassed(data, design, theme);
            results.push({ component, demo, designSystem: design, colorMode: theme, passed, ...data });
            console.log(`${passed ? "PASS" : "REVIEW"} ${component} ${theme}: ${names.length} public roles, ${data.differences.length} differences`);
        }
    }
} finally {
    await writeFile(new URL("workbench-themes.json", output), JSON.stringify({ capturedAt: new Date().toISOString(), revision, scope: "First standalone demo host per product; three design systems and two color modes; public L2 parity, excluding full component states and nested overlays.", results, exceptions: browser.exceptions }, null, 2) + "\n");
    await browser.call("Emulation.setEmulatedMedia", { features: [] });
    browser.close();
}
if (results.some(item => item.passed === false) || browser.exceptions.length) process.exitCode = 1;
