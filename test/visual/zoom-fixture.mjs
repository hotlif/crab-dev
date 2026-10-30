import { chromium, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const extension = fileURLToPath(new URL('./zoom-extension', import.meta.url));

async function metrics(page) {
    return { viewportOption: page.viewportSize(), ...await page.evaluate(() => ({
        innerWidth: globalThis.innerWidth, innerHeight: globalThis.innerHeight,
        outerWidth: globalThis.outerWidth, outerHeight: globalThis.outerHeight,
        devicePixelRatio: globalThis.devicePixelRatio,
        htmlZoom: globalThis.getComputedStyle(globalThis.document.documentElement).zoom,
        bodyZoom: globalThis.getComputedStyle(globalThis.document.body).zoom,
        visualViewportScale: globalThis.visualViewport.scale,
    })) };
}

// Equivalent to native screenshots' caret:'hide'. The protocol compatibility
// capture has no caret option, so hide only insertion carets for this capture,
// including real iframe and open-shadow editors. Focus and animations stay live.
async function withoutCarets(page, capture) {
    const sheets = [];
    let result, failure;
    try {
        for (const frame of page.frames()) sheets.push(await frame.evaluateHandle(() => {
            const styles = [];
            function visit(root) {
                const style = globalThis.document.createElement('style');
                style.textContent = '* { caret-color: transparent !important; }';
                (root.nodeType === 9 ? root.documentElement : root).append(style);
                styles.push(style);
                for (const node of root.querySelectorAll('*')) if (node.shadowRoot) visit(node.shadowRoot);
            }
            visit(globalThis.document);
            return styles;
        }));
        result = await capture();
    } catch (error) { failure = error; }
    const cleanup = await Promise.allSettled(sheets.map(async sheet => {
        try { await sheet.evaluate(styles => { for (const style of styles) style.remove(); }); }
        finally { await sheet.dispose(); }
    }));
    if (failure) throw failure;
    const errors = cleanup.filter(result => result.status === 'rejected').map(result => result.reason);
    if (errors.length) throw new AggregateError(errors, 'Unable to restore screenshot caret styles');
    return result;
}

/** Only dedicated 200% tests override native context; ordinary matrix tests reuse browsers. */
export const zoomFixtures = {
    context: async ({ headless, locale, timezoneId, colorScheme, reducedMotion }, use, info) => {
        const context = await chromium.launchPersistentContext('', {
            // Clear Test's ordinary DPR=1 option. Undefined requests the actual
            // browser display scale; it neither sets nor simulates a DPR.
            channel: 'chromium', headless, viewport: null, deviceScaleFactor: undefined, locale, timezoneId, colorScheme, reducedMotion,
            args: ['--window-size=1280,900', `--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
            recordVideo: { dir: info.outputPath('native-video'), size: { width: 1280, height: 900 } },
        });
        try { await use(context); }
        finally {
            const videos = context.pages().map(page => page.video()).filter(Boolean);
            await context.close();
            for (const [index, video] of videos.entries()) await info.attach(`zoom-video-${index}`, { path: await video.path(), contentType: 'video/webm' });
        }
    },
    page: async ({ context }, use) => { await use(context.pages()[0] ?? await context.newPage()); },
    realZoom: async ({ context }, use, info) => {
        let [worker] = context.serviceWorkers();
        worker ??= await context.waitForEvent('serviceworker');
        async function tab(page) {
            expect(page.context()).toBe(context);
            expect(new URL(page.url()).hostname).toBe('127.0.0.1');
            return worker.evaluate(async url => {
                const tabs = (await globalThis.chrome.tabs.query({})).filter(tab => tab.url === url);
                if (tabs.length !== 1) throw Error(`Expected one owned loopback tab; received ${tabs.length}`);
                return tabs[0].id;
            }, page.url());
        }
        await use({
            async set200(page) {
                const id = await tab(page);
                const before = { ...await metrics(page), tabZoom: await worker.evaluate(id => globalThis.chrome.tabs.getZoom(id), id) };
                expect(before.viewportOption).toBeNull(); expect(before.tabZoom).toBe(1);
                await worker.evaluate(async id => {
                    await globalThis.chrome.tabs.setZoomSettings(id, { mode: 'automatic', scope: 'per-tab' });
                    await globalThis.chrome.tabs.setZoom(id, 2);
                }, id);
                await expect.poll(() => worker.evaluate(id => globalThis.chrome.tabs.getZoom(id), id)).toBe(2);
                await expect.poll(() => page.evaluate(() => globalThis.devicePixelRatio)).toBeCloseTo(before.devicePixelRatio * 2, 5);
                const after = { ...await metrics(page), tabZoom: await worker.evaluate(id => globalThis.chrome.tabs.getZoom(id), id) };
                expect(after.outerWidth).toBe(before.outerWidth); expect(after.outerHeight).toBe(before.outerHeight);
                expect(Math.abs(after.innerWidth * 2 - before.innerWidth)).toBeLessThanOrEqual(1);
                expect(after.htmlZoom).toBe(before.htmlZoom); expect(after.bodyZoom).toBe(before.bodyZoom);
                expect(after.visualViewportScale).toBe(1);
                await info.attach('real-zoom-proof', { body: JSON.stringify({ method: 'chrome.tabs.setZoom', before, after }), contentType: 'application/json' });
            },
            async capture200(page) {
                const id = await tab(page);
                expect(await worker.evaluate(id => globalThis.chrome.tabs.getZoom(id), id)).toBe(2);
                const current = await metrics(page), session = await context.newCDPSession(page);
                let body;
                try {
                    // Playwright 1.64.1 Page/Locator screenshots crop true tab zoom.
                    // The native protocol omits that clip; native PNG assertions still
                    // own comparison, diffs and reports. Remove this exception once
                    // upstream Page screenshots pass the same physical-size proof.
                    const result = await withoutCarets(page, () => session.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false }));
                    body = Buffer.from(result.data, 'base64');
                } finally { await session.detach(); }
                expect(Math.abs(body.readUInt32BE(16) - current.innerWidth * current.devicePixelRatio)).toBeLessThanOrEqual(2);
                expect(Math.abs(body.readUInt32BE(20) - current.innerHeight * current.devicePixelRatio)).toBeLessThanOrEqual(2);
                return body;
            },
        });
    },
};
