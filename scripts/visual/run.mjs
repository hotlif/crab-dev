import path from "node:path";
import { readFile, access, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { repositoryRoot, getLibraryPackage, loadLibraryManifest } from "../library-manifest.mjs";
import { resolveYarnEntry, runYarn } from "../package-manager.mjs";
import { inspectPackage } from "../library-graph.mjs";
import { browserExecutable } from "../published-browser-runtime.mjs";
import { linuxVisualImage } from "./environment.mjs";
import { visualCaptureScope } from './argument-intent.mjs';
import { configureBrowserEnvironment } from "./browser-environment.mjs";
import { inspectVisualStorage } from './local-storage.mjs';
import { hasSnapshotUpdateOption } from './baseline-transfer.mjs';

process.env.PLAYWRIGHT_FORCE_ASYNC_LOADER ??= "1";
configureBrowserEnvironment();
process.env.CRAB_VISUAL_RUN ??= new Date().toISOString().replaceAll(/[:.]/g, "-");
const args = process.argv.slice(2);
const yarn = await resolveYarnEntry(process.env.npm_execpath);
if (args[0] === "report") {
    if (!args[1]) throw Error("Pass the report directory printed by the visual run.");
    process.exit(await runYarn(yarn, ["exec", "playwright", "show-report", ...args.slice(1)], { cwd: repositoryRoot }));
}
const canonical = process.platform === "linux" && process.env.CRAB_VISUAL_IMAGE === linuxVisualImage;
if (hasSnapshotUpdateOption(args) && !canonical) throw Error("Update visual baselines in the pinned local Linux image after reviewing its candidate report.");
if (hasSnapshotUpdateOption(args) && args.includes('--candidate')) throw Error('Candidate capture and baseline updates must be separate explicit runs.');
const candidateIndex = args.indexOf("--candidate");
if (candidateIndex !== -1) {
    args.splice(candidateIndex, 1);
    process.env.CRAB_VISUAL_CANDIDATE = "1";
    console.log("Candidate capture only: automated assertions run; visual review and baseline approval remain pending.");
}
if (!canonical) {
    process.env.CRAB_VISUAL_CANDIDATE = "1";
    process.env.CRAB_VISUAL_MODE = "native-check";
    console.log("Native environment checks: assertions and captures run; canonical pixel comparison runs in the pinned Linux image.");
    if (process.platform === "win32") {
        if (!args.includes("--list") && !args.includes("--help") && !process.env.CRAB_TEST_BROWSER_PATH) {
            try { await access(createRequire(import.meta.url)("@playwright/test").chromium.executablePath()); }
            catch { process.env.CRAB_TEST_BROWSER_PATH = await browserExecutable(); }
        }
        if (!args.some(argument => argument === "--project" || argument.startsWith("--project="))) args.push("--project", "chromium");
    }
} else process.env.CRAB_VISUAL_MODE = process.env.CRAB_VISUAL_CANDIDATE === "1" ? "candidate" : hasSnapshotUpdateOption(args) ? 'baseline-update' : "regression";
const packageIndex = args.indexOf("--package");
process.env.CRAB_VISUAL_SCOPE = visualCaptureScope(args);
const storage = args.includes('--help') ? undefined : await inspectVisualStorage(repositoryRoot, process.env.CRAB_VISUAL_SCOPE === 'repository' ? 'repository' : 'filtered');
const manifest = await loadLibraryManifest();
if (packageIndex !== -1) {
    const selected = args[packageIndex + 1];
    const product = selected === "." ? manifest.packages.find(product => product.directory === process.cwd()) : await getLibraryPackage(selected);
    if (!product || !product.packageJson.scripts?.["build:visual"]) throw Error(`No component visual build registered for ${selected}`);
    args.splice(packageIndex, 2);
    const names = new Set(manifest.packages.map(entry => entry.name));
    const require = createRequire(import.meta.url);
    const wake = JSON.parse(await readFile(require.resolve("@crab-dev/wake/package.json"), "utf8"));
    // Wake's standalone workbench UI imports its own public control dependencies.
    // Resolve those from the pinned package instead of maintaining a second list.
    const controls = Object.keys(wake.dependencies ?? {}).filter(name => names.has(name));
    const facts = await inspectPackage(product);
    const docs = [...facts.docsImports].filter(name => names.has(name));
    const targets = [...new Set([product.name, "@crab-dev/rc-theme", ...controls, ...docs])];
    const base = `/components/${product.slug}/workbench`;
    if (!args.includes("--list")) {
        const build = await runYarn(yarn, ["exec", "turbo", "run", "build:library", ...targets.map(name => `--filter=${name}`), "--concurrency=2"], { cwd: repositoryRoot });
        if (build !== 0) process.exit(build);
        const code = await runYarn(yarn, ["workspace", product.name, "build:visual", "--base", `${base}/`], { cwd: repositoryRoot });
        if (code !== 0) process.exit(code);
    }
    process.env.CRAB_VISUAL_WORKBENCH_ROOT = path.join(product.directory, ".cache/visual-workbench");
    process.env.CRAB_VISUAL_WORKBENCH_BASE = base;
    process.env.CRAB_VISUAL_PACKAGE = product.slug;
    process.env.CRAB_VISUAL_TARGETS = JSON.stringify(targets);
}
const included = new Set();
function include(product) {
    if (!product || included.has(product.name)) return;
    included.add(product.name);
    for (const name of Object.keys(product.packageJson.dependencies ?? {})) include(manifest.packages.find(product => product.name === name));
}
const targetNames = process.env.CRAB_VISUAL_PACKAGE ? JSON.parse(process.env.CRAB_VISUAL_TARGETS) : manifest.packages.map(product => product.name);
for (const name of targetNames) include(manifest.packages.find(product => product.name === name));
const capabilities = new Set();
for (const product of manifest.packages.filter(product => included.has(product.name))) {
    try {
        const specification = JSON.parse(await readFile(path.join(product.directory, 'docs/visual.json'), 'utf8'));
        for (const capability of specification.capabilities ?? []) capabilities.add(capability);
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
process.env.CRAB_VISUAL_REQUIRE_WEBGL2 = capabilities.has('webgl2') ? '1' : '0';
const out = path.join(repositoryRoot, ".cache/visual", process.env.CRAB_VISUAL_RUN);
if (storage) {
    await mkdir(out, { recursive: true });
    await writeFile(path.join(out, 'local-storage.json'), JSON.stringify({ checkedAt: new Date().toISOString(), ...storage }, null, 2));
}
console.log(`Playwright visual evidence: ${out}`);
process.exitCode = await runYarn(yarn, ["exec", "playwright", "test", "--config", "test/visual/playwright.config.mjs", ...args], { cwd: repositoryRoot });
