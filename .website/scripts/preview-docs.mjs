import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("../", import.meta.url)), process.env.DOCS_PREVIEW_DIR ?? "docs-dist");
const base = `/${(process.env.DOCS_PREVIEW_BASE ?? "").replace(/^\/+|\/+$/g, "")}`;
const port = Number(process.env.DOCS_PREVIEW_PORT ?? 4173);
const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".woff2": "font/woff2",
    ".wasm": "application/wasm",
};

createServer(async (request, response) => {
    try {
        const requestPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
        if (base !== "/" && requestPath !== base && !requestPath.startsWith(`${base}/`)) {
            response.writeHead(404).end("页面不在当前部署前缀内。");
            return;
        }
        const pathname = base === "/" ? requestPath : requestPath.slice(base.length) || "/";
        let file = path.resolve(root, `.${pathname}`);
        if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
            response.writeHead(403).end();
            return;
        }
        const info = await stat(file).catch(() => null);
        if (info?.isDirectory()) file = path.join(file, "index.html");
        else if (!info && !path.extname(file)) file = `${file}.html`;
        const body = await readFile(file).catch(async error => {
            if (error.code !== "ENOENT" || path.extname(pathname)) throw error;
            // 交给 Wake 的 NotFound 展示组件，同时保留正确的 HTTP 状态。
            response.statusCode = 404;
            file = path.join(root, "index.html");
            return readFile(file);
        });
        response.writeHead(response.statusCode, {
            "Content-Type": types[path.extname(file)] ?? "application/octet-stream",
            "Cache-Control": "no-store",
        });
        response.end(body);
    } catch {
        response
            .writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
            .end("页面不存在。请先运行 yarn build。");
    }
}).listen(port, "127.0.0.1", () => console.log(`生产文档预览：http://127.0.0.1:${port}${base === "/" ? "/" : `${base}/`}`));
