import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { createDocsPreview } from "./preview-docs.mjs";

let root;
before(async () => {
    root = await mkdtemp(path.join(tmpdir(), "crab-docs-preview-"));
    await mkdir(path.join(root, "guides"));
    await writeFile(path.join(root, "index.html"), "<main>首页与未找到页面外壳</main>");
    await writeFile(path.join(root, "guides", "start.html"), "<main>开始使用</main>");
    await writeFile(path.join(root, "guides", "index.html"), "<main>指南目录</main>");
    await writeFile(path.join(root, "app.js"), "export const ready = true;");
    await writeFile(path.join(root, "theme.css"), "body { margin: 0; }");
});
after(async () => { await rm(root, { recursive: true, force: true }); });

async function preview(context, base = "") {
    const server = createDocsPreview({ root, base });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    context.after(() => new Promise((resolve, reject) => {
        server.close(error => error ? reject(error) : resolve());
        server.closeAllConnections();
    }));
    return `http://127.0.0.1:${server.address().port}`;
}

test("预览首页、无扩展名页面与目录索引", async context => {
    const origin = await preview(context);
    for (const [route, content] of [["/", "首页"], ["/guides/start?from=nav", "开始使用"], ["/guides/", "指南目录"]]) {
        const response = await fetch(`${origin}${route}`);
        assert.equal(response.status, 200, route);
        assert.match(response.headers.get("content-type"), /^text\/html/);
        assert.equal(response.headers.get("cache-control"), "no-store");
        assert.ok((await response.text()).includes(content));
    }
});

test("静态资源保留类型，丢失资源不返回 HTML", async context => {
    const origin = await preview(context);
    for (const [file, type] of [["app.js", "text/javascript"], ["theme.css", "text/css"]]) {
        const response = await fetch(`${origin}/${file}`);
        assert.equal(response.status, 200);
        assert.ok(response.headers.get("content-type").startsWith(type));
        await response.text();
    }
    const missing = await fetch(`${origin}/missing.js`);
    assert.equal(missing.status, 404);
    assert.match(missing.headers.get("content-type"), /^text\/plain/);
});

test("缺失文档使用站点外壳且保留 404", async context => {
    const origin = await preview(context);
    const response = await fetch(`${origin}/guides/missing`);
    assert.equal(response.status, 404);
    assert.match(response.headers.get("content-type"), /^text\/html/);
    assert.ok((await response.text()).includes("未找到页面外壳"));
});

for (const base of ["/handbook", "/handbook/"]) test(`子路径部署 ${base} 限制前缀并正确加载页面与资源`, async context => {
    const origin = await preview(context, base);
    for (const route of ["/handbook", "/handbook/", "/handbook/guides/start", "/handbook/app.js"]) {
        const response = await fetch(`${origin}${route}`);
        assert.equal(response.status, 200, route);
        await response.text();
    }
    for (const route of ["/", "/guides/start", "/handbook-extra/guides/start"]) {
        const response = await fetch(`${origin}${route}`);
        assert.equal(response.status, 404, route);
        assert.ok((await response.text()).includes("部署前缀"));
    }
});
