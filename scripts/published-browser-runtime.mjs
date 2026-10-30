import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';

export async function browserExecutable() {
    const configured = process.env.CRAB_TEST_BROWSER_PATH ?? process.env.CHROME_PATH;
    const candidates = configured ? [configured] : process.platform === 'win32'
        ? [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA].filter(Boolean).flatMap(base => [path.join(base, 'Google/Chrome/Application/chrome.exe'), path.join(base, 'Microsoft/Edge/Application/msedge.exe')])
        : process.platform === 'darwin' ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'] : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
    for (const file of candidates) { try { await fs.access(file); return file; } catch { /* Try the next installation. */ } }
    throw Error('Chrome/Chromium is required; set CRAB_TEST_BROWSER_PATH. Missing browser is a failure, never a skip.');
}

export async function until(label, read, accepts, timeout = 10000) {
    const start = performance.now(); let actual;
    while (performance.now() - start < timeout) { actual = await read(); if (accepts(actual)) return actual; await new Promise(resolve => setTimeout(resolve, 40)); }
    throw Error(`Timed out: ${label}; actual ${JSON.stringify(actual)}`);
}

/** Only serves the fixture's explicit, in-memory assets on loopback. */
export async function serveBrowserAssets(assets) {
    const server = http.createServer((request, response) => {
        const asset = assets.get(new URL(request.url, 'http://127.0.0.1').pathname);
        if (!['GET', 'HEAD'].includes(request.method) || !asset) { response.writeHead(404); response.end(); return; }
        response.writeHead(200, { 'Content-Type': asset.type, 'Cache-Control': 'no-store' });
        response.end(request.method === 'HEAD' ? undefined : asset.body);
    });
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
    return { server, origin: `http://127.0.0.1:${server.address().port}` };
}

/** Requires the unique blank page returned by our own browser process. */
export async function connectOwnBrowser({ targets, port, exceptions }) {
    const pages = targets.filter(target => target.type === 'page');
    if (pages.length !== 1 || pages[0].url !== 'about:blank') throw Error('Fresh isolated browser must contain one blank page');
    const address = new URL(pages[0].webSocketDebuggerUrl);
    if (!['127.0.0.1', 'localhost'].includes(address.hostname) || address.port !== String(port)) throw Error('Unexpected own-process debugger address');
    const socket = new globalThis.WebSocket(address);
    await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
    let sequence = 0;
    const pending = new Map();
    const rejectPending = () => {
        for (const request of pending.values()) { clearTimeout(request.timer); request.reject(Error('Own browser connection closed')); }
        pending.clear();
    };
    socket.addEventListener('close', rejectPending, { once: true });
    socket.addEventListener('message', event => {
        const message = JSON.parse(event.data);
        if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
        const request = pending.get(message.id);
        if (!request) return;
        clearTimeout(request.timer); pending.delete(message.id);
        if (message.error) request.reject(Error(JSON.stringify(message.error)));
        else request.resolve(message.result);
    });
    const call = (method, params = {}) => new Promise((resolve, reject) => {
        const id = ++sequence, timer = setTimeout(() => { pending.delete(id); reject(Error(`CDP timeout: ${method}`)); }, 15000);
        pending.set(id, { resolve, reject, timer });
        try { socket.send(JSON.stringify({ id, method, params })); }
        catch (error) { clearTimeout(timer); pending.delete(id); reject(error); }
    });
    const evaluate = async expression => {
        const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
        if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
        return result.result.value;
    };
    return { socket, call, evaluate };
}

export async function captureBrowserScreenshot(call, out, name) {
    const screenshot = await call('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
    const bytes = Buffer.from(screenshot.data, 'base64');
    await fs.writeFile(path.join(out, name), bytes, { flag: 'wx' });
    return { screenshot, bytes };
}
