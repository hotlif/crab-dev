import type { ConfigLocale } from '@crab-dev/rc-config-provider';
import { engineMessages } from '../engine-messages.js';
import { formatPdfMessage, pdfError, pdfMessages, type PdfBuiltinMessageId } from '../pdf-messages.js';

/** Type-only regression: neither this function nor the rejected assignments run. */
export function verifyPdfMessageContract(engineId: keyof typeof engineMessages, locale: ConfigLocale, unknownId: string): string {
    const builtinId: PdfBuiltinMessageId = engineId;
    const localized: string = pdfMessages[builtinId][locale];
    pdfError('source', 'source.http', { status: 403 });
    pdfError('source', 'source.http', { status: 'unavailable' }, { cause: new Error('network') });
    pdfError('operation', 'plugin.install', { plugin: 'ocr' });
    pdfError('operation', 'plugin.cleanup', { plugin: 'ocr' });
    pdfError('operation', 'plugin.invalid-action', { plugin: 'ocr' });
    pdfError('operation', 'font.missing-character', { character: '文' });
    pdfError('password', 'engine.passwordRequired');
    pdfError('operation', engineId);
    formatPdfMessage({ id: 'reason.clippingPath' }, locale);

    // @ts-expect-error Arbitrary strings do not become library message identities.
    const invalidId: PdfBuiltinMessageId = unknownId;
    // @ts-expect-error Misspelled component identities are rejected.
    pdfError('source', 'source.htpp', { status: 403 });
    // @ts-expect-error Unknown engine identities are rejected too.
    pdfError('operation', 'engine.callerOwned');
    // @ts-expect-error Widening the public resource map must not erase required placeholders.
    pdfError('source', 'source.http');
    // @ts-expect-error Parameter names come from the literal resource, not a string dictionary.
    pdfError('source', 'source.http', { code: 403 });
    // @ts-expect-error Interpolation accepts strings and numbers only.
    pdfError('source', 'source.http', { status: true });
    // @ts-expect-error Every parameter-bearing component identity requires its own values.
    pdfError('operation', 'font.missing-character');
    // @ts-expect-error The character template cannot receive another message's parameter.
    pdfError('operation', 'font.missing-character', { plugin: 'ocr' });
    // @ts-expect-error Cleanup keeps its required parameter after declaration emission.
    pdfError('operation', 'plugin.cleanup');
    // @ts-expect-error Invalid action messages also retain the plugin association.
    pdfError('operation', 'plugin.invalid-action', { status: 403 });
    // @ts-expect-error A parameter-free engine template does not accept arbitrary parameters.
    pdfError('password', 'engine.passwordRequired', { password: 'secret' });
    // @ts-expect-error Format callers retain the same exact identity union.
    formatPdfMessage({ id: 'caller.error' }, locale);
    // @ts-expect-error Lookup keys remain the real component + engine identity union.
    const missing = pdfMessages['caller.error'];
    // @ts-expect-error Only the two supported locales are present.
    const unsupported = pdfMessages['source.load']['fr-FR'];
    // @ts-expect-error Public language resources are readonly.
    pdfMessages['source.load']['en-US'] = 'Replacement';
    // @ts-expect-error Public message entries are readonly.
    pdfMessages['source.load'] = { 'zh-CN': '替换', 'en-US': 'Replacement' };
    void invalidId;
    void missing;
    void unsupported;
    return localized;
}
