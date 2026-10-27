import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';

const highlighter = { ready: false, resolve: () => { /* Set by the controlled promise below. */ } };
const pending = new Promise<void>(resolve => { highlighter.resolve = resolve; });
// Keep the real lazy SourceCode module and Suspense boundary. Only the external
// highlighter is delayed, so its import completion can be awaited inside act.
mock.module('react-syntax-highlighter', () => ({ Prism: () => {
    if (!highlighter.ready) throw pending;
    return null;
} }));

let Preview: (typeof import('../preview.js'))['default'];
beforeAll(async () => {
    Preview = (await mock.import<typeof import('../preview.js')>('../preview.js')).default;
});

describe('ComponentPreview source loading palette', () => {
    it('follows codeTheme independently of page colorMode while keeping the live preview', async () => {
        const view = await render(
            <ConfigProvider colorMode="light"><Preview sourceCode="export default 1;" codeTheme="dark">
                <input aria-label="Live preview" defaultValue="Unchanged" />
            </Preview></ConfigProvider>,
        );
        try {
            await act(async () => {
                await fireEvent.click(screen.getByRole('button', { name: '查看源码' }));
                await import('../sourceCode.js');
            });
            const input = screen.getByRole('textbox', { name: 'Live preview' });
            const loading = screen.getByRole('status');
            const darkPalette = loading.className;
            expect(loading.textContent).toBe('正在加载源码高亮…');

            await view.rerender(
                <ConfigProvider colorMode="dark"><Preview sourceCode="export default 1;" codeTheme="dark" defaultExpanded>
                    <input aria-label="Live preview" defaultValue="Unchanged" />
                </Preview></ConfigProvider>,
            );
            expect(screen.getByRole('status')).toBe(loading);
            expect(loading.className).toBe(darkPalette);

            await view.rerender(
                <ConfigProvider colorMode="dark"><Preview sourceCode="export default 1;" codeTheme="light" defaultExpanded>
                    <input aria-label="Live preview" defaultValue="Unchanged" />
                </Preview></ConfigProvider>,
            );
            const lightPalette = loading.className;
            expect(lightPalette).not.toBe(darkPalette);

            await view.rerender(
                <ConfigProvider colorMode="light" locale="en-US"><Preview sourceCode="export default 1;" codeTheme="light" defaultExpanded>
                    <input aria-label="Live preview" defaultValue="Unchanged" />
                </Preview></ConfigProvider>,
            );
            expect(loading.className).toBe(lightPalette);
            expect(loading.textContent).toBe('Loading syntax highlighting…');
            expect(screen.getByRole('textbox', { name: 'Live preview' })).toBe(input);
        } finally {
            await act(async () => {
                highlighter.ready = true;
                highlighter.resolve();
                await pending;
                await view.unmount();
            });
        }
    });
});
