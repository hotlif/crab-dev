// Run from the repository root after the production documentation build finishes.
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createDocsPreview } from '../../scripts/dev/preview-docs.mjs';
import { readLibraryMetadata } from '../../../scripts/library-manifest.mjs';
import { browserExecutable, connectOwnBrowser, until, captureBrowserScreenshot } from '../../../scripts/published-browser-runtime.mjs';
import { waitForOwnDevTools } from '../../../scripts/published-browser-readiness.mjs';

const hash = value => createHash('sha256').update(value).digest('hex');
async function fileRecords(files) {
    const records = [];
    for (const file of [...new Set(files)].sort()) {
        try { records.push({ path: file.replaceAll('\\', '/'), sha256: hash(await fs.readFile(file)) }); }
        catch (error) { if (error.code !== 'ENOENT') throw error; records.push({ path: file, sha256: null }); }
    }
    return { fingerprint: `sha256:${hash(JSON.stringify(records))}`, files: records };
}
async function filesAt(root) {
    const entries = await fs.readdir(root, { withFileTypes: true });
    return (await Promise.all(entries.map(entry => entry.isDirectory() ? filesAt(path.join(root, entry.name)) : [path.join(root, entry.name)]))).flat();
}
async function inputs() {
    const names = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).split('\0').filter(Boolean);
    const roots = new Set(['package.json', 'yarn.lock', 'library.manifest.json', 'turbo.json', 'wake.config.toml', '.yarnrc.yml', '.pnp.cjs', '.pnp.loader.mjs', 'tsconfig.json', 'AGENTS.md', 'README.md']);
    const prefixes = ['components/', 'standards/', 'scripts/', '.website/', '.yarn/sdks/', '.yarn/patches/', '.github/'];
    const excluded = new Set(['.cache', '.tmp', '.turbo', 'coverage', 'esm', 'cjs', 'declarations', 'css', 'docs-dist', 'node_modules']);
    const source = names.filter(file => (roots.has(file) || prefixes.some(prefix => file.startsWith(prefix))) && !file.startsWith('.website/review/') && !file.split('/').some(part => excluded.has(part) || part.startsWith('.wake')));
    return { source: await fileRecords(source), artifact: await fileRecords(await filesAt('.website/docs-dist')) };
}

const out = path.resolve('.tmp', `docs-final-${new Date().toISOString().replaceAll(/[:.]/g, '-')}`);
await fs.mkdir(out, { recursive: true });
const before = await inputs(), preview = createDocsPreview();
await new Promise(resolve => preview.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${preview.address().port}`, profile = path.join(out, 'profile');
await fs.mkdir(profile);
const executable = await browserExecutable();
const launchArgs = ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', 'about:blank'];
const chrome = spawn(executable, launchArgs, { stdio: 'ignore', windowsHide: true });
let launchError, connection, browser, failure;
const processExited = new Promise(resolve => {
    chrome.once('error', error => { launchError = error.message; resolve({ launchError }); });
    chrome.once('exit', (exitCode, signalCode) => resolve({ exitCode, signalCode }));
});
const exceptions = [], trace = {}, records = [];
try {
    const ready = await waitForOwnDevTools({
        readPort: async () => Number((await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]),
        processState: () => ({ exitCode: chrome.exitCode, signalCode: chrome.signalCode, launchError }), processExited, trace,
    });
    connection = await connectOwnBrowser({ ...ready, exceptions });
    const { call, evaluate } = connection;
    await call('Page.enable'); await call('Runtime.enable');
    await call('Page.bringToFront'); await call('Emulation.setFocusEmulationEnabled', { enabled: true });
    await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    browser = await call('Browser.getVersion');
    await call('Page.navigate', { url: origin + '/guides/design-styles' });
    await until('actual design guide ready', () => evaluate('document.querySelector("h1")?.textContent'), value => value?.includes('三套设计体系'), 30000);
    await evaluate(`const field = [...document.querySelectorAll('input')].find(node => node.value === '设计系统工作区'); field.focus(); field.select(); window.__reviewField = field; void 0;`);
    await call('Input.insertText', { text: '保留草稿内容' });
    const settle = () => until('finite UI transitions settle naturally', () => evaluate(`document.getAnimations().filter(animation => animation.playState === 'running' && animation.effect?.getComputedTiming().iterations !== Infinity).length`), count => count === 0);
    const photograph = async name => {
        await evaluate(`document.querySelector('[aria-label="三种风格交互对照"]').scrollIntoView({ block: 'start' }); window.scrollBy(0, -80);`);
        await settle();
        const state = await evaluate(`({ design: document.querySelector('.crab-docs').dataset.crabDesign, mode: document.querySelector('.crab-docs').dataset.theme, value: window.__reviewField.value, retained: window.__reviewField.isConnected, forcedColors: matchMedia('(forced-colors: active)').matches, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches })`);
        if (state.value !== '保留草稿内容' || !state.retained) throw Error('Theme switch lost the input draft');
        const { bytes } = await captureBrowserScreenshot(call, out, name);
        records.push({ ...state, screenshot: name, sha256: hash(bytes), visualReview: 'pending' });
    };
    for (const design of readLibraryMetadata().designSystems) for (const mode of ['light', 'dark']) {
        await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: mode }] });
        await evaluate(`document.querySelector(${JSON.stringify(`input[type=radio][value="${design.id}"]`)}).click()`);
        await until('actual nearest configuration', () => evaluate(`document.querySelector('.crab-docs').dataset.crabDesign + '-' + document.querySelector('.crab-docs').dataset.theme`), value => value === `${design.id}-${mode}`);
        await photograph(`${design.id}-${mode}.png`);
    }
    for (const width of [320, 768]) {
        await call('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 1, mobile: false });
        await evaluate('window.scrollTo(0, 0)'); await settle();
        const state = await evaluate('({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth })');
        if (state.scrollWidth > state.viewport) throw Error('Page overflows the narrow viewport');
        const name = `viewport-${width}.png`, { bytes } = await captureBrowserScreenshot(call, out, name);
        records.push({ ...state, screenshot: name, sha256: hash(bytes), visualReview: 'pending' });
    }
    await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    for (const condition of [{ name: 'forced-colors', forced: true, reduced: false }, { name: 'reduced-motion', forced: false, reduced: true }]) {
        await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }, { name: 'forced-colors', value: condition.forced ? 'active' : 'none' }, { name: 'prefers-reduced-motion', value: condition.reduced ? 'reduce' : 'no-preference' }] });
        await photograph(condition.name + '.png');
    }
} catch (error) { failure = error.message; process.exitCode = 1; }
finally {
    if (connection) { await connection.call('Browser.close').catch(() => {}); connection.socket.close(); }
    chrome.kill(); await new Promise(resolve => preview.close(resolve));
    const after = await inputs();
    const stable = before.source.fingerprint === after.source.fingerprint && before.artifact.fingerprint === after.artifact.fingerprint;
    if (!stable || exceptions.length) process.exitCode = 1;
    await fs.writeFile(path.join(out, 'candidate.json'), JSON.stringify({
        capturedAt: new Date().toISOString(), source: { kind: 'worktree', ref: before.source.fingerprint, files: before.source.files },
        artifact: before.artifact, after: { source: after.source.fingerprint, artifact: after.artifact.fingerprint }, inputsStable: stable,
        captureScriptFingerprint: hash(await fs.readFile(fileURLToPath(import.meta.url))), browser, executable, launchArgs, trace, records, failure, exceptions,
        limits: ['Specified guide and states only; whole-library visual coverage stays partial.', 'Animations follow the selected native media preference; the capture never overrides product styles or seeks, cancels or completes animations.'],
    }, null, 2));
    console.log(JSON.stringify({ out, inputsStable: stable, screenshots: records.length, failure, exceptions }, null, 2));
}
