import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { browserErrorDetails, waitForOwnDevTools } from './published-browser-readiness.mjs';

// A small shared launcher for actual published focus/color fixture checks.
// The fixture owns component assertions and pixel analysis; this owns only its
// isolated browser/process, source hashes and screenshot geometry bracket.
const options = Object.fromEntries(process.argv.slice(2).map(argument => {
    const match = /^--(package|fixture|api|colors|motion|validate-only)=(.+)$/.exec(argument);
    if (!match) throw Error('Use --package=PATH --fixture=PATH --api=__fixtureName [--colors=active|normal] [--validate-only=true]');
    return [match[1], match[2]];
}));
if (!options.package || !options.fixture || !/^__[A-Za-z0-9_]+$/.test(options.api ?? '')) throw Error('Missing package/fixture or invalid window API identifier');
const colors = options.colors ?? 'active';
if (!['active', 'normal'].includes(colors)) throw Error('Invalid colors mode: expected active or normal');
if (options['validate-only'] !== undefined && options['validate-only'] !== 'true') throw Error('validate-only must be true when provided');
const forcedColors = colors === 'active';
const motion = options.motion ?? 'normal';
if (!['normal', 'reduce'].includes(motion) || (motion === 'reduce' && forcedColors)) throw Error('Invalid motion mode: reduce requires colors=normal');
const reducedMotion = motion === 'reduce';
const packageRoot = path.resolve(options.package), entry = path.resolve(packageRoot, options.fixture);
if (!entry.startsWith(packageRoot + path.sep)) throw Error('Fixture must be inside the declared package');
// Parse/environment contract only: no package imports, output, server or browser.
if (options['validate-only'] === 'true') {
    console.log(JSON.stringify({ colors, forcedColors, reducedMotion, packageRoot, entry, api: options.api }));
    process.exit(0);
}
const require = createRequire(path.join(packageRoot, 'package.json')), wake = require('@crab-dev/wake');
if (wake.version() !== '0.1.45') throw Error('Forced-colors check requires public Wake 0.1.45 bundle API');
const packageName = JSON.parse(await fs.readFile(path.join(packageRoot, 'package.json'), 'utf8')).name;
const api = 'window.' + options.api;
const repoRoot = path.resolve(packageRoot, '../..');
const out = path.join(packageRoot, '.cache', reducedMotion ? 'reduced-motion' : forcedColors ? 'forced-colors' : 'focus-colors', new Date().toISOString().replaceAll(/[:.]/g, '-'));
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
    await collect('@crab-dev/rc-theme'); await collect(packageName);
    for (const file of await filesAt(path.join(packageRoot, 'scripts'))) files.add(file);
    files.add(path.join(packageRoot, '.cache/browser-css.json'));
    files.add(path.join(repoRoot, 'scripts/test-published-forced-colors.mjs'));
    files.add(path.join(repoRoot, 'scripts/published-browser-readiness.mjs'));
    files.add(path.join(repoRoot, 'scripts/prepare-published-css.mjs'));
    for (const helper of ['test/forced-color-pixels.mjs', 'test/forced-color-pixels.d.mts']) {
        const pixelHelper = path.join(repoRoot, helper);
        try { await fs.access(pixelHelper); files.add(pixelHelper); }
        catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
    files.add(entry);
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
const bundle = await wake.bundle({ cwd: packageRoot, configPath: path.join(packageRoot, 'scripts/forced-colors-bundle/wake.config.toml'),
    entry, outfile: path.join(out, 'fixture.js'),
    platform: 'browser', format: 'iife', minify: false, sourceMap: true, cache: false });
if (typeof bundle.code !== 'string') throw Error('Public bundle returned no code');
const html = '<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><link rel="stylesheet" href="/components.css"><title>Published ' + (forcedColors ? 'forced-colors' : 'normal focus') + ' regression</title></head><body style="margin:0"><div id="root"></div><script defer src="/fixture.js"></script></body></html>';
const assets = new Map([['/', { type: 'text/html', body: html }], ['/fixture.js', { type: 'text/javascript', body: bundle.code }], ['/components.css', { type: 'text/css', body: css }]]);
for (const [name, asset] of assets) await fs.writeFile(path.join(out, name === '/' ? 'index.html' : name.slice(1)), asset.body);
const fixture = [...assets].map(([name, asset]) => ({ path: name, sha256: hash(asset.body) }));
const chromePath = await executable();
const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'crab-forced-colors-'));
const server = http.createServer((request, response) => {
    const asset = assets.get(new URL(request.url, 'http://127.0.0.1').pathname);
    if (!['GET', 'HEAD'].includes(request.method) || !asset) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { 'Content-Type': asset.type, 'Cache-Control': 'no-store' }); response.end(request.method === 'HEAD' ? undefined : asset.body);
});
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
const origin = `http://127.0.0.1:${server.address().port}`;
const launchArgs = ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', 'about:blank'];
const stderrPath = path.join(out, 'chrome-stderr.log');
let chrome, stderrHandle, launchError, exit;
let socket, call, fatalError, fatalErrorDetails; const records = [], cleanupErrors = [], exceptions = [], readiness = {};
const configs = ['md3', 'apple', 'shadcn'].flatMap(designSystem => ['light', 'dark'].map(colorMode => ({ designSystem, colorMode })));
try {
    stderrHandle = await fs.open(stderrPath, 'wx');
    chrome = spawn(chromePath, launchArgs, { stdio: ['ignore', 'ignore', stderrHandle.fd], windowsHide: true });
    const processExited = new Promise(resolve => {
        chrome.once('error', error => { launchError = browserErrorDetails(error); resolve({ launchError }); });
        chrome.once('exit', (exitCode, signalCode) => { exit = { exitCode, signalCode, at: new Date().toISOString() }; resolve(exit); });
    });
    await json('run-start.json', { before, fixture, colors, forcedColors, motion, reducedMotion, chromePath, launchArgs, pid: chrome.pid, origin, profile, configs, runtime: { wake: wake.version(), react: require('react/package.json').version }, scope: 'Independent public ESM/CSS regression. No Docs candidate or visual-review claim.' });
    const { port, targets } = await waitForOwnDevTools({
        readPort: async () => Number((await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]),
        processState: () => ({ exitCode: chrome.exitCode, signalCode: chrome.signalCode, launchError }),
        processExited, trace: readiness,
    });
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
    // Only our isolated headless page is activated. Its document otherwise
    // reports hasFocus()=false, so programmatic element focus cannot exercise
    // the browser's real :focus-visible painting. No element pseudo-state is
    // forced; fixtures must still focus and verify their own actual target.
    // https://chromedevtools.github.io/devtools-protocol/tot/Emulation/#method-setFocusEmulationEnabled
    await call('Page.bringToFront');
    await call('Emulation.setFocusEmulationEnabled', { enabled: true });
    await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
    await json('browser.json', await call('Browser.getVersion'));
    for (const config of configs) {
        const id = `${config.designSystem}-${config.colorMode}`, record = { id, config, colors, execution: 'running', visualReview: 'pending' };
        try {
            await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reducedMotion ? 'reduce' : 'no-preference' }, { name: 'forced-colors', value: forcedColors ? 'active' : 'none' }, { name: 'prefers-color-scheme', value: config.colorMode }] });
            const url = origin + '/?' + new URLSearchParams(config); await call('Page.navigate', { url });
            await until('ordinary React fixture API ready', () => evaluate('!!' + api), Boolean);
            record.documentFocus = await evaluate('document.hasFocus()');
            if (!record.documentFocus) throw Error('The isolated browser document is not focused');
            record.prepared = await evaluate(api + '.prepare()');
            record.beforeCapture = await evaluate(api + '.snapshot()');
            const screenshot = await call('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
            const bytes = Buffer.from(screenshot.data, 'base64'), file = id + (reducedMotion ? '--reduced-motion-viewport.png' : forcedColors ? '--forced-colors-viewport.png' : '--normal-focus-viewport.png'); await fs.writeFile(path.join(out, file), bytes, { flag: 'wx' });
            record.screenshot = { path: file, sha256: hash(bytes), width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
            record.afterCapture = await evaluate(api + '.snapshot()');
            const valid = snapshot => snapshot?.href === url && snapshot.forcedColors === forcedColors && (forcedColors || snapshot.reducedMotion === reducedMotion) && snapshot.viewport?.width === 1280 && snapshot.viewport?.height === 720 && snapshot.viewport?.dpr === 1 && (forcedColors || snapshot.stability && typeof snapshot.stability === 'object') && Array.isArray(snapshot.subjects) && snapshot.subjects.length > 0 && snapshot.subjects.every(subject => typeof subject.id === 'string' && subject.rect && ['left', 'top', 'right', 'bottom', 'width', 'height'].every(key => Number.isFinite(subject.rect[key])) && subject.rect.width > 0 && subject.rect.height > 0 && subject.rect.left >= 0 && subject.rect.top >= 0 && subject.rect.right <= 1280 && subject.rect.bottom <= 720);
            const geometry = snapshot => JSON.stringify(snapshot.subjects.map(subject => [subject.id, subject.rect, subject.glyphs?.map(glyph => glyph.rect)]));
            if (![record.prepared, record.beforeCapture, record.afterCapture].every(valid) || geometry(record.beforeCapture) !== geometry(record.afterCapture) || record.screenshot.width !== 1280 || record.screenshot.height !== 720) throw Error('Forced-colors screenshot geometry/environment bracket failed');
            if (!forcedColors && JSON.stringify(record.beforeCapture.stability) !== JSON.stringify(record.afterCapture.stability)) throw Error('Normal focus screenshot changed actual component geometry/state');
            record.pixels = await evaluate(api + '.inspectPixels(' + JSON.stringify(screenshot.data) + ')');
            record.afterPixels = await evaluate(api + '.snapshot()');
            if (!valid(record.afterPixels) || geometry(record.afterCapture) !== geometry(record.afterPixels)) throw Error('Pixel assertion changed fixture geometry/environment');
            if (!forcedColors && JSON.stringify(record.afterCapture.stability) !== JSON.stringify(record.afterPixels.stability)) throw Error('Normal focus pixel assertion changed actual component geometry/state');
            record.execution = 'passed';
        } catch (error) { record.execution = 'failed'; record.error = error.message; }
        records.push(record); await json(id + '.json', record);
    }
} catch (error) { fatalError = error.message; fatalErrorDetails = browserErrorDetails(error); }
finally {
    if (call) { try { await call('Browser.close'); } catch (error) { cleanupErrors.push(error.message); } }
    socket?.close();
    if (chrome) {
        if (chrome.exitCode === null && chrome.signalCode === null) { try { chrome.kill(); } catch (error) { cleanupErrors.push(error.message); } }
        try { await until('own Chrome exit', async () => ({ exitCode: chrome.exitCode, signalCode: chrome.signalCode }), state => state.exitCode !== null || state.signalCode !== null, 5000); }
        catch (error) { cleanupErrors.push(error.message); }
    }
    if (stderrHandle) { try { await stderrHandle.close(); } catch (error) { cleanupErrors.push(error.message); } }
    await new Promise(resolve => server.close(resolve));
    // Keep this isolated profile as diagnostic evidence; never delete user data.
}
const after = await inputs(), inputsStable = JSON.stringify(before) === JSON.stringify(after);
let stderr;
try { const bytes = await fs.readFile(stderrPath); stderr = { path: 'chrome-stderr.log', bytes: bytes.length, sha256: hash(bytes) }; }
catch (error) { stderr = { path: 'chrome-stderr.log', status: 'unavailable', error: browserErrorDetails(error) }; cleanupErrors.push('Chrome stderr evidence: ' + error.message); }
const startup = { readiness, exit: exit ?? null, launchError: launchError ?? null, finalProcessState: chrome ? { exitCode: chrome.exitCode, signalCode: chrome.signalCode } : null, stderr };
await json('browser-startup.json', startup);
const passed = records.length === 6 && records.every(record => record.execution === 'passed') && inputsStable && !fatalError && !exceptions.length && !cleanupErrors.length;
await json('summary.json', { passed, before, after, inputsStable, fixture, colors, forcedColors, motion, reducedMotion, records: records.map(({ id, execution, error }) => ({ id, execution, error })), fatalError, fatalErrorDetails, startup, exceptions, cleanupErrors, profile, limits: ['Fixture assertions and actual screenshot pixel counts are machine evidence; manual PNG review remains separate.', 'Color mode is native browser media emulation and read back by the fixture. No product style or animation is disabled, completed, cancelled or seeked by this launcher.'] });
console.log(JSON.stringify({ passed, records: records.length, inputsStable, fatalError, cleanupErrors, out }, null, 2));
if (!passed) process.exitCode = 1;
