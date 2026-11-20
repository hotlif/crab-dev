import assert from "node:assert/strict";
import { createHash, webcrypto } from "node:crypto";
import { test } from "node:test";
import { createFederationRuntime } from "@crab-dev/wake/federation";

const css = "button { color: red; }";
const asset = {
    kind: "css",
    url: "https://docs.example/demo.css",
    mime: "text/css",
    size: Buffer.byteLength(css),
    integrity: "sha384-" + createHash("sha384").update(css).digest("base64"),
};
const production = { development: false };
const headers = { "Content-Type": "text/css" };

function stylesheetTarget() {
    const links = [];
    return {
        links,
        append(link) {
            links.push(link);
            queueMicrotask(link.onload);
        },
    };
}

function fixture(respond) {
    const requests = [];
    const window = {
        crypto: webcrypto,
        document: { createElement: () => ({}) },
        fetch(url, options) {
            requests.push({ url, method: options.method, signal: options.signal });
            return respond(options);
        },
    };
    window.window = window;
    // Exercise the pinned Wake runtime's browser transport with controlled responses.
    const { transport } = createFederationRuntime({ global: window });
    return {
        requests,
        methods: () => requests.map(request => request.method),
        attach: (styleTarget, signal, assetContext = production) => transport.loadStyle(asset, {
            styleTarget,
            signal,
            assetContext,
            maxAssetSize: 1024,
        }),
    };
}

function validResponse({ method }) {
    return Promise.resolve(new Response(method === "HEAD" ? null : css, { headers }));
}

test("stylesheets in separate targets share concurrent and completed production preflights", async () => {
    const { attach, methods } = fixture(validResponse);
    const targets = Array.from({ length: 3 }, stylesheetTarget);
    const concurrent = await Promise.all(targets.slice(0, 2).map(target => attach(target)));
    const later = await attach(targets[2]);

    assert.deepEqual(methods(), ["HEAD", "GET"]);
    assert.equal(new Set([...concurrent, later]).size, targets.length);
    for (const { links } of targets) {
        assert.equal(links.length, 1);
        assert.equal(links[0].integrity, asset.integrity);
        assert.equal(links[0].rel, "stylesheet");
    }

    await attach(stylesheetTarget(), undefined, { development: true });
    await attach(stylesheetTarget(), undefined, { development: true });
    assert.deepEqual(methods(), ["HEAD", "GET", "HEAD", "GET", "HEAD", "GET"]);
});

test("a failed SHA-384 verification applies no styles and can be retried", async () => {
    let corrupt = true;
    const { attach, methods } = fixture(options => {
        if (options.method === "GET" && corrupt) {
            return Promise.resolve(new Response(css.replace("red", "tan"), { headers }));
        }
        return validResponse(options);
    });
    const target = stylesheetTarget();

    await assert.rejects(attach(target), { code: "FED_ASSET_INTEGRITY" });
    assert.equal(target.links.length, 0);
    corrupt = false;
    await attach(target);
    assert.deepEqual(methods(), ["HEAD", "GET", "HEAD", "GET"]);
    assert.equal(target.links.length, 1);
});

test("aborting one mount keeps the shared preflight alive for another mount", async () => {
    let releaseHead;
    const head = new Promise(resolve => { releaseHead = resolve; });
    const { attach, methods, requests } = fixture(options => options.method === "HEAD" ? head : validResponse(options));
    const controller = new AbortController();
    const cancelled = stylesheetTarget();
    const remaining = stylesheetTarget();

    const first = attach(cancelled, controller.signal);
    const second = attach(remaining);
    controller.abort();
    await assert.rejects(first, { name: "AbortError" });
    assert.equal(requests[0].signal.aborted, false);
    releaseHead(await validResponse({ method: "HEAD" }));
    await second;

    assert.deepEqual(methods(), ["HEAD", "GET"]);
    assert.equal(cancelled.links.length, 0);
    assert.equal(remaining.links.length, 1);
});

test("the last aborted mount releases the pending preflight for a fresh attempt", async () => {
    let wait = true;
    const { attach, methods, requests } = fixture(options => {
        if (!wait) return validResponse(options);
        return new Promise((_, reject) => {
            options.signal.addEventListener("abort", () => reject(options.signal.reason), { once: true });
        });
    });
    const controller = new AbortController();
    const first = attach(stylesheetTarget(), controller.signal);
    controller.abort();
    await assert.rejects(first, { name: "AbortError" });
    assert.equal(requests[0].signal.aborted, true);

    wait = false;
    const target = stylesheetTarget();
    await attach(target);
    assert.deepEqual(methods(), ["HEAD", "HEAD", "GET"]);
    assert.equal(target.links.length, 1);
});
