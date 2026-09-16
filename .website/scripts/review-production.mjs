import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { productionRevision } from "./production-revision.mjs";

// Local, isolated Chrome only. No dependencies, account sessions or production writes.
const debugOrigin = "http://127.0.0.1:9334";
const siteOrigin = "http://127.0.0.1:4173";
const output = new URL("../review/quality/production/", import.meta.url);
await mkdir(output, { recursive: true });
const targets = await (await fetch(`${debugOrigin}/json/list`)).json();
const target = targets.find(item => item.type === "page");
if (!target) throw new Error("Isolated Chrome has no page target");
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
let sequence = 0;
const pending = new Map();
let pageErrors = [];
socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (message.method === "Runtime.exceptionThrown") pageErrors.push(message.params.exceptionDetails.text);
    if (!message.id) return;
    const request = pending.get(message.id);
    if (!request) return;
    clearTimeout(request.timeout);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(JSON.stringify(message.error)));
    else request.resolve(message.result);
});
function call(method, params = {}) {
    return new Promise((resolve, reject) => {
        const id = ++sequence;
        const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
        pending.set(id, { resolve, reject, timeout });
        socket.send(JSON.stringify({ id, method, params }));
    });
}
async function evaluate(expression) {
    const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const baseline = JSON.parse(await readFile(new URL("../review/quality/baseline.json", import.meta.url), "utf8"));
const all = baseline.pages.map(page => "/" + page.path.replace(/^\.website\/docs\//, "").replace(/(?:\/index)?\.mdx$/, "").replace(/^index$/, ""));
const priorityRoutes = ["/", "/learn/components", "/components/rc-token-global", "/components/rc-token-semantic"];
const requestedRoutes = process.argv.find(arg => arg.startsWith("--routes="))?.slice("--routes=".length).split(",");
if (requestedRoutes?.some(route => !all.includes(route))) throw new Error("Requested route is outside the baseline inventory");
const routes = requestedRoutes ?? (process.argv.includes("--all") ? all : priorityRoutes);
const resultFile = requestedRoutes ? "batch-pages.json" : process.argv.includes("--all") ? "all-pages.json" : "priority-pages.json";
const results = [];
const revision = await productionRevision();
const buildHash = createHash("sha256").update(await readFile(new URL("../docs-dist/index.html", import.meta.url))).digest("hex");
try {
    await call("Page.enable");
    await call("Runtime.enable");
    for (const route of routes) for (const theme of ["light", "dark"]) for (const width of [320, 768, 1440]) {
        pageErrors = [];
        await call("Emulation.setDeviceMetricsOverride", { width, height: 960, deviceScaleFactor: 1, mobile: false });
        await call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }] });
        await call("Page.navigate", { url: `${siteOrigin}${route}` });
        let ready = false;
        for (let attempt = 0; attempt < 40; attempt++) {
            await delay(100);
            ready = await evaluate(`location.pathname === ${JSON.stringify(route)} && document.readyState === 'complete' && Boolean(document.querySelector('main h1')) && Boolean(document.querySelector('.crab-docs-prose h1, .crab-home-hero h1, .crab-catalog-grid'))`);
            if (ready) break;
        }
        if (!ready) throw new Error(`Page did not become ready: ${route}`);
        await evaluate("document.fonts.ready.then(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))");
        // The shell and TOC mount before the asynchronous MDX body. Measure only a settled body.
        let lastHeight = 0;
        let stable = 0;
        for (let attempt = 0; attempt < 20 && stable < 3; attempt++) {
            await delay(200);
            const height = await evaluate("document.documentElement.scrollHeight");
            stable = height === lastHeight ? stable + 1 : 0;
            lastHeight = height;
        }
        const metrics = await evaluate(`(() => {
            const root = document.documentElement;
            const visible = el => { const r = el.getBoundingClientRect(); const c = getComputedStyle(el); return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none' && !el.closest('[inert],[aria-hidden="true"]'); };
            return {
                title: document.title, theme: document.querySelector('.crab-docs')?.getAttribute('data-theme'),
                viewport: innerWidth, pageWidth: root.scrollWidth, height: root.scrollHeight,
                headings: Array.from(document.querySelectorAll('main h1, main h2')).map(el => ({ tag: el.tagName, id: el.id, text: el.textContent.trim(), visible: visible(el) })),
                outside: Array.from(document.querySelectorAll('main *')).filter(visible).filter(el => { const r = el.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1; }).slice(0, 12).map(el => ({ tag: el.tagName, class: el.className?.baseVal ?? el.className, text: el.textContent.slice(0, 80) })),
            };
        })()`);
        const name = (route === "/" ? "home" : route.slice(1).replaceAll("/", "-")) + `-${theme}-${width}`;
        // Detailed screenshots for priority pages; all pages still get measured.
        if (priorityRoutes.includes(route)) {
            const capture = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: Math.min(metrics.height, 24000), scale: 1 } });
            await writeFile(new URL(`${name}.png`, output), Buffer.from(capture.data, "base64"));
            const top = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
            await writeFile(new URL(`${name}-top.png`, output), Buffer.from(top.data, "base64"));
        }
        const row = { route, expectedTheme: theme, width, ...metrics, errors: pageErrors, overflow: metrics.pageWidth > width + 1, themeMatches: metrics.theme === theme };
        results.push(row);
        console.log(`${row.overflow || !row.themeMatches || pageErrors.length ? "REVIEW" : "MEASURED"} ${name}: ${metrics.pageWidth}px, ${metrics.height}px high`);
        await writeFile(new URL(resultFile, output), JSON.stringify({ capturedAt: new Date().toISOString(), browser: (await (await fetch(`${debugOrigin}/json/version`)).json()).Browser, buildHash, revision, status: "Measurements only; manual visual and assistive-technology review required.", results }, null, 2) + "\n");
    }
} finally {
    socket.close();
    for (const request of pending.values()) clearTimeout(request.timeout);
}
