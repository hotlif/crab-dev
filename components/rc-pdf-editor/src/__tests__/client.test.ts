import { afterAll, afterEach, beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { PdfClient } from '../client.js';
import wasmBase64 from '../../.fixtures/test-wasm.json';
import workerCode from '../../.fixtures/test-worker.json';
import { fixture } from './fixture.js';

let workerUrl: string;
const wasmBinary = Uint8Array.from(atob(wasmBase64), character => character.charCodeAt(0)).buffer;
beforeAll(() => { workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' })); });
afterAll(() => { URL.revokeObjectURL(workerUrl); });
afterEach(() => { mock.restoreAll(); });

describe('连续页面共享渲染缓存', () => {
    it('预览和编辑画布共用一次真实 Worker 渲染，往返与排序复用，内容修改和新文档失效', async () => {
        const sent = mock.spyOn(globalThis.Worker.prototype, 'postMessage');
        const client = new PdfClient({ workerUrl, wasmBinary }), signal = new AbortController().signal;
        try {
            let info = await client.request('open', { bytes: fixture(3), password: '' });
            const before = sent.calls.calls.length;
            const [preview, active] = await Promise.all([
                client.preview(info.pages[0], info.revision, 1, signal),
                client.frame(info.pages[0], info.revision, 1, undefined, signal),
            ]);
            expect(sent.calls.calls.length - before).toBe(1);
            expect(preview.image).toBe(active.image);
            expect(preview.image.rgba.byteLength).toBe(preview.image.width * preview.image.height * 4);
            expect(preview.objects.find(object => object.text === 'Page 1')).toBeDefined();
            await client.preview(info.pages[1], info.revision, 1, signal);
            const afterVisit = sent.calls.calls.length;
            expect((await client.preview(info.pages[0], info.revision, 1, signal)).image).toBe(preview.image);
            expect(sent.calls.calls.length).toBe(afterVisit);

            info = await client.request('edit', { revision: info.revision, command: { kind: 'movePages', pages: [0], to: 1 } });
            const afterSort = sent.calls.calls.length;
            const reordered = await client.preview(info.pages[1], info.revision, 1, signal);
            expect(reordered.image).toBe(preview.image);
            expect(reordered.info.index).toBe(1);
            expect(sent.calls.calls.length).toBe(afterSort);

            info = await client.request('edit', { revision: info.revision, command: { kind: 'rotatePages', pages: [1], turns: 1 } });
            const rotated = await client.preview(info.pages[1], info.revision, 1, signal);
            expect(rotated.image.width).toBe(preview.image.height);
            expect(rotated.image).not.toBe(preview.image);
            await expect(client.request('open', { bytes: new Uint8Array([1, 2, 3]), password: '' })).rejects.toThrow();
            const afterFailure = sent.calls.calls.length;
            expect((await client.preview(info.pages[1], info.revision, 1, signal)).image).toBe(rotated.image);
            expect(sent.calls.calls.length).toBe(afterFailure);

            info = await client.request('open', { bytes: fixture(1), password: '' });
            const beforeNew = sent.calls.calls.length;
            expect((await client.preview(info.pages[0], info.revision, 1, signal)).image).not.toBe(preview.image);
            expect(sent.calls.calls.length - beforeNew).toBe(1);
        } finally { client.close(); }
    });

    it('取消一个消费方不影响另一个，全部取消可重试，缓存不能绕过关闭或取消', async () => {
        const sent = mock.spyOn(globalThis.Worker.prototype, 'postMessage');
        const client = new PdfClient({ workerUrl, wasmBinary });
        try {
            const info = await client.request('open', { bytes: fixture(), password: '' });
            const first = new AbortController(), second = new AbortController();
            const before = sent.calls.calls.length;
            const abandoned = client.preview(info.pages[0], info.revision, 1, first.signal);
            const rejection = expect(abandoned).rejects.toThrow('渲染已取消');
            const kept = client.frame(info.pages[0], info.revision, 1, undefined, second.signal);
            first.abort(); await rejection;
            expect((await kept).image).toBeDefined();
            expect(sent.calls.calls.length - before).toBe(1);
            await expect(client.preview(info.pages[0], info.revision, 1, first.signal)).rejects.toThrow('渲染已取消');

            const all = new AbortController();
            const cancelled = client.preview(info.pages[1], info.revision, 1, all.signal);
            const allRejected = expect(cancelled).rejects.toThrow('渲染已取消');
            all.abort(); await allRejected;
            expect((await client.preview(info.pages[1], info.revision, 1, second.signal)).objects.length).toBeGreaterThan(0);
            await expect(client.preview(info.pages[0], info.revision, NaN, second.signal)).rejects.toThrow();
            expect((await client.preview(info.pages[0], info.revision, 2, second.signal)).image.width).toBe(440);

            client.close();
            await expect(client.preview(info.pages[0], info.revision, 1, second.signal)).rejects.toThrow('编辑器已关闭');
        } finally { client.close(); }
    });

    it('缓存淘汰最旧页面，限制页数和像素内存，保留最近浏览页', async () => {
        const sent = mock.spyOn(globalThis.Worker.prototype, 'postMessage');
        const client = new PdfClient({ workerUrl, wasmBinary }), signal = new AbortController().signal;
        try {
            const info = await client.request('open', { bytes: fixture(25), password: '' });
            for (const page of info.pages) await client.preview(page, info.revision, 1, signal);
            let before = sent.calls.calls.length;
            await client.preview(info.pages[24], info.revision, 1, signal);
            expect(sent.calls.calls.length).toBe(before);
            await client.preview(info.pages[0], info.revision, 1, signal);
            expect(sent.calls.calls.length - before).toBe(1);
            for (const page of info.pages.slice(0, 8)) await client.preview(page, info.revision, 8, signal);
            before = sent.calls.calls.length;
            await client.preview(info.pages[7], info.revision, 8, signal);
            expect(sent.calls.calls.length).toBe(before);
            await client.preview(info.pages[0], info.revision, 8, signal);
            expect(sent.calls.calls.length - before).toBe(1);
        } finally { client.close(); }
    });
});
