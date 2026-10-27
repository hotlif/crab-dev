import { describe, expect, it } from '@crab-dev/wake/test';
import { asError } from '../client.js';
import { PdfEditorError } from '../types.js';
import { builtinPdfMessage, formatPdfError, pdfError, pdfMessages, restorePdfError } from '../pdf-messages.js';

describe('library-owned PDF message provenance', () => {
    it('keeps command error compatibility while formatting explicit library identities and parameters', () => {
        const cause = new Error('Network adapter detail');
        const error = pdfError('source', 'source.http', { status: 403 }, { cause });
        expect(error instanceof PdfEditorError).toBe(true);
        expect(error.name).toBe('PdfEditorError');
        expect(error.code).toBe('source');
        expect(error.message).toBe('无法加载文件（403）');
        expect(error.cause).toBe(cause);
        expect(builtinPdfMessage(error)).toEqual({ id: 'source.http', values: { status: 403 } });
        expect(formatPdfError(error, 'en-US')).toBe('Unable to load the file (403).');
        expect(formatPdfError(error, 'zh-CN')).toBe(error.message);
    });

    it('preserves caller errors even when their text matches a library fallback', () => {
        const error = new PdfEditorError('source', '无法加载文件');
        expect(formatPdfError(error, 'en-US')).toBe('无法加载文件');
        expect(builtinPdfMessage(error)).toBeUndefined();
        const host = asError(new Error('远端业务错误'));
        expect(formatPdfError(host, 'en-US')).toBe('远端业务错误');
        expect(formatPdfError(asError(undefined), 'en-US')).toBe('The operation failed.');
        const overridden = pdfError('source', 'source.load');
        overridden.message = 'Caller replacement';
        expect(formatPdfError(overridden, 'en-US')).toBe('Caller replacement');
        expect(builtinPdfMessage(overridden)).toBeUndefined();
    });

    it('restores only recognized structured Worker metadata and preserves raw fallback packets', () => {
        const original = pdfError('password', 'engine.passwordRequired');
        const packet = structuredClone({ code: original.code, message: original.message, builtinMessage: builtinPdfMessage(original) });
        const restored = restorePdfError(packet.code, packet.message, packet.builtinMessage);
        expect(restored.message).toBe(original.message);
        expect(formatPdfError(restored, 'en-US')).toBe('Enter the correct PDF password');
        for (const metadata of [undefined, null, { id: 'caller.error' }, { id: 'source.http' }, { id: 'source.http', values: { status: {} } }]) {
            expect(formatPdfError(restorePdfError('operation', 'Caller packet detail', metadata), 'en-US')).toBe('Caller packet detail');
        }
    });

    it('has nonempty resources and identical parameter names in both supported languages', () => {
        for (const message of Object.values(pdfMessages)) {
            expect(message['zh-CN'].trim().length).toBeGreaterThan(0);
            expect(message['en-US'].trim().length).toBeGreaterThan(0);
            const parameters = (value: string) => [...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
            expect(parameters(message['en-US'])).toEqual(parameters(message['zh-CN']));
        }
    });
});
