// Ordinary published React application, isolated Chrome, actual no-preference.
// Wake 0.1.45 browser tests fix reduced motion to reduce; this separate required
// check observes the original CSS pulse without changing or completing it.
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url), wake = require('@crab-dev/wake');
if (wake.version() !== '0.1.45') throw Error('Natural check requires public Wake 0.1.45 bundle API');
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(packageRoot, '../..');
const out = path.join(packageRoot, '.cache', 'natural-motion', new Date().toISOString().replaceAll(/[:.]/g, '-'));
await fs.mkdir(out, { recursive: true });
const hash = value => createHash('sha256').update(value).digest('hex');
const json = (name, value) => fs.writeFile(path.join(out, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
async function filesAt(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    return (await Promise.all(entries.map(entry => entry.isDirectory() ? filesAt(path.join(directory, entry.name)) : [path.join(directory, entry.name)]))).flat().sort();
}
async function inputs() {
    const files = new Set(), visited = new Set();
    async function collect(name) {
        if (visited.has(name)) return; visited.add(name);
        const directory = path.join(repoRoot, 'components', name.slice('@crab-dev/'.length));
        const manifest = path.join(directory, 'package.json'); files.add(manifest);
        for (const dependency of Object.keys(JSON.parse(await fs.readFile(manifest, 'utf8')).dependencies ?? {})) if (dependency.startsWith('@crab-dev/rc-')) await collect(dependency);
        for (const child of ['src', 'esm', 'css']) {
            try { for (const file of await filesAt(path.join(directory, child))) files.add(file); }
            catch (error) { if (error.code !== 'ENOENT') throw error; }
        }
    }
    await collect('@crab-dev/rc-theme'); await collect('@crab-dev/rc-card');
    for (const file of await filesAt(path.join(packageRoot, 'scripts'))) files.add(file);
    files.add(path.join(packageRoot, '.cache/browser-css.json'));
    return Promise.all([...files].sort().map(async file => ({ path: path.relative(repoRoot, file).replaceAll(path.sep, '/'), sha256: hash(await fs.readFile(file)) })));
}
async function executable() {
    const configured = process.env.CRAB_TEST_BROWSER_PATH ?? process.env.CHROME_PATH;
    const candidates = configured ? [configured] : process.platform === 'win32'
        ? [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA].filter(Boolean).flatMap(base => [path.join(base, 'Google/Chrome/Application/chrome.exe'), path.join(base, 'Microsoft/Edge/Application/msedge.exe')])
        : process.platform === 'darwin' ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'] : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
    for (const file of candidates) { try { await fs.access(file); return file; } catch { /* Try next documented installation. */ } }
    throw Error('Chrome/Chromium is required; set CRAB_TEST_BROWSER_PATH. Missing browser is a failure, never a skip.');
}
async function until(label, read, accepts, timeout = 10000) {
    const start = performance.now(); let actual;
    while (performance.now() - start < timeout) { actual = await read(); if (accepts(actual)) return actual; await new Promise(resolve => setTimeout(resolve, 40)); }
    throw Error(`Timed out: ${label}; actual ${JSON.stringify(actual)}`);
}
const before = await inputs(), css = JSON.parse(await fs.readFile(path.join(packageRoot, '.cache/browser-css.json'), 'utf8'));
if (typeof css !== 'string' || !css.length) throw Error('Prepare actual published CSS before this check');
const bundle = await wake.bundle({ cwd: packageRoot, configPath: path.join(packageRoot, 'scripts/natural-bundle/wake.config.toml'),
    entry: path.join(packageRoot, 'src/__tests__/browser/natural-fixture.tsx'), outfile: path.join(out, 'fixture.js'),
    platform: 'browser', format: 'iife', minify: false, sourceMap: true, cache: false });
if (typeof bundle.code !== 'string') throw Error('Public bundle returned no code');
const html = '<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><link rel="stylesheet" href="/components.css"><title>Card natural motion regression</title></head><body style="margin:0"><div id="root"></div><script defer src="/fixture.js"></script></body></html>';
const assets = new Map([['/', { type: 'text/html', body: html }], ['/fixture.js', { type: 'text/javascript', body: bundle.code }], ['/components.css', { type: 'text/css', body: css }]]);
for (const [name, asset] of assets) await fs.writeFile(path.join(out, name === '/' ? 'index.html' : name.slice(1)), asset.body);
const fixture = [...assets].map(([name, asset]) => ({ path: name, sha256: hash(asset.body) }));
const chromePath = await executable();
const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'crab-card-natural-'));
const server = http.createServer((request, response) => {
    const asset = assets.get(new URL(request.url, 'http://127.0.0.1').pathname);
    if (!['GET', 'HEAD'].includes(request.method) || !asset) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { 'Content-Type': asset.type, 'Cache-Control': 'no-store' }); response.end(request.method === 'HEAD' ? undefined : asset.body);
});
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
const origin = `http://127.0.0.1:${server.address().port}`;
const launchArgs = ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', 'about:blank'];
const chrome = spawn(chromePath, launchArgs, { stdio: 'ignore', windowsHide: true });
let launchError; chrome.once('error', error => { launchError = error.message; });
let socket, call, fatalError; const records = [], cleanupErrors = [], exceptions = [];
const configs = ['md3', 'apple', 'shadcn'].flatMap(designSystem => ['light', 'dark'].map(colorMode => ({ designSystem, colorMode })));
await json('run-start.json', { before, fixture, chromePath, launchArgs, pid: chrome.pid, origin, profile, configs, runtime: { wake: wake.version(), react: require('react/package.json').version }, scope: 'Independent public ESM/CSS regression. No Docs candidate or visual-review claim.' });
try {
    const port = await until('own Chrome DevToolsActivePort', async () => { if (launchError) throw Error(launchError); try { return Number((await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]); } catch { return null; } }, value => Number.isInteger(value) && value > 0);
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const pages = targets.filter(target => target.type === 'page');
    if (pages.length !== 1 || pages[0].url !== 'about:blank') throw Error('Fresh isolated browser must contain one blank page');
    const address = new URL(pages[0].webSocketDebuggerUrl);
    if (!['127.0.0.1', 'localhost'].includes(address.hostname) || address.port !== String(port)) throw Error('Unexpected own-process debugger address');
    socket = new globalThis.WebSocket(address); await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
    let sequence = 0; const pending = new Map();
    socket.addEventListener('message', event => { const message = JSON.parse(event.data); if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails); const request = pending.get(message.id); if (!request) return; clearTimeout(request.timer); pending.delete(message.id); if (message.error) request.reject(Error(JSON.stringify(message.error))); else request.resolve(message.result); });
    call = (method, params = {}) => new Promise((resolve, reject) => { const id = ++sequence, timer = setTimeout(() => { pending.delete(id); reject(Error(`CDP timeout: ${method}`)); }, 15000); pending.set(id, { resolve, reject, timer }); socket.send(JSON.stringify({ id, method, params })); });
    const evaluate = async expression => { const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails)); return result.result.value; };
    await call('Page.enable'); await call('Runtime.enable');
    await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }, { name: 'forced-colors', value: 'none' }] });
    await json('browser.json', await call('Browser.getVersion'));
    for (const config of configs) {
        const id = `${config.designSystem}-${config.colorMode}`, record = { id, config, execution: 'running', visualReview: 'pending' };
        try {
            const url = origin + '/?' + new URLSearchParams(config); await call('Page.navigate', { url });
            await until('normal React fixture ready', () => evaluate('!!window.__cardNatural'), Boolean);
            record.prepared = await evaluate('window.__cardNatural.prepare()');
            record.pulse = await evaluate('window.__cardNatural.observe()');
            record.beforeCapture = await evaluate('window.__cardNatural.snapshot()');
            const screenshot = await call('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
            const bytes = Buffer.from(screenshot.data, 'base64'), file = id + '--natural-viewport.png'; await fs.writeFile(path.join(out, file), bytes, { flag: 'wx' });
            record.screenshot = { path: file, sha256: hash(bytes), width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
            record.afterCapture = await evaluate('window.__cardNatural.snapshot()');
            const geometry = snapshot => JSON.stringify(snapshot.cards.map(card => [card.rect, card.leaves.map(leaf => leaf.rect)]));
            if (record.beforeCapture.href !== url || record.afterCapture.href !== url || !record.beforeCapture.normalMotion || !record.afterCapture.normalMotion || geometry(record.beforeCapture) !== geometry(record.afterCapture) || record.screenshot.width !== 1280 || record.screenshot.height !== 720) throw Error('Natural screenshot geometry/environment bracket failed');
            record.overrides = await evaluate('window.__cardNatural.overrides()'); record.execution = 'passed';
        } catch (error) { record.execution = 'failed'; record.error = error.message; }
        records.push(record); await json(id + '.json', record);
    }
} catch (error) { fatalError = error.message; }
finally {
    if (call) { try { await call('Browser.close'); } catch (error) { cleanupErrors.push(error.message); } }
    socket?.close();
    if (chrome.exitCode === null && chrome.signalCode === null) { try { chrome.kill(); } catch (error) { cleanupErrors.push(error.message); } }
    try { await until('own Chrome exit', async () => ({ exitCode: chrome.exitCode, signalCode: chrome.signalCode }), state => state.exitCode !== null || state.signalCode !== null, 5000); }
    catch (error) { cleanupErrors.push(error.message); }
    await new Promise(resolve => server.close(resolve));
    // Keep this isolated profile as diagnostic evidence; never delete user data.
}
const after = await inputs(), inputsStable = JSON.stringify(before) === JSON.stringify(after);
const passed = records.length === 6 && records.every(record => record.execution === 'passed') && inputsStable && !fatalError && !exceptions.length && !cleanupErrors.length;
await json('summary.json', { passed, before, after, inputsStable, fixture, records: records.map(({ id, execution, error }) => ({ id, execution, error })), fatalError, exceptions, cleanupErrors, profile, limits: ['Normal motion and static overrides are machine assertions; PNG visual review remains separate.', 'Each configuration contains four variants. Native pulse is observed, never finished/cancelled/paused/seeked.'] });
console.log(JSON.stringify({ passed, records: records.length, inputsStable, fatalError, cleanupErrors, out }, null, 2));
if (!passed) process.exitCode = 1;
