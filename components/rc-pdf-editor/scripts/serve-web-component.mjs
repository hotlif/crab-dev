import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT ?? 4174);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.wasm': 'application/wasm', '.pdf': 'application/pdf' };
createServer(async (request, response) => {
    try {
        const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        const target = resolve(root, `.${path === '/' ? '/index.html' : path}`);
        if (!target.startsWith(root.endsWith(sep) ? root : root + sep)) { response.writeHead(403).end(); return; }
        const body = await readFile(target);
        response.writeHead(200, { 'Content-Type': mime[extname(target)] ?? 'application/octet-stream' });
        response.end(body);
    } catch { response.writeHead(404).end('Not found'); }
}).listen(port, '127.0.0.1', () => { console.log(`PDF Web Component: http://127.0.0.1:${port}`); });
