import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { render, screen } from '@crab-dev/wake/test/react';
import { StrictMode } from 'react';
import { createPortal } from 'react-dom';
import ConfigProvider from '../config-provider.js';
import { useConfig } from '../context.js';

function Probe({ name }: { name: string }) {
    const { theme, locale, size } = useConfig();
    return <output aria-label={name}>{`${theme}/${locale}/${size}`}</output>;
}

describe('ConfigProvider', () => {
    it('provides defaults without a provider', async () => {
        await render(<Probe name="defaults" />);
        expect(screen.getByLabelText('defaults').textContent).toBe('light/zh-CN/middle');
    });

    it('inherits each omitted field and isolates nested and sibling overrides', async () => {
        await render(
            <ConfigProvider theme="dark" locale="en-US" size="large">
                <Probe name="parent" />
                <ConfigProvider theme="light">
                    <Probe name="light" />
                    <ConfigProvider locale="zh-CN" size="small"><Probe name="nested" /></ConfigProvider>
                </ConfigProvider>
                <ConfigProvider><Probe name="sibling" /></ConfigProvider>
            </ConfigProvider>,
        );
        expect(screen.getByLabelText('parent').textContent).toBe('dark/en-US/large');
        expect(screen.getByLabelText('light').textContent).toBe('light/en-US/large');
        expect(screen.getByLabelText('nested').textContent).toBe('light/zh-CN/small');
        expect(screen.getByLabelText('sibling').textContent).toBe('dark/en-US/large');
        expect(screen.getByLabelText('light').parentElement?.dataset.theme).toBe('light');
    });

    it('updates inherited fields and restores inheritance when an override is removed', async () => {
        const { rerender } = await render(
            <ConfigProvider theme="dark" locale="en-US" size="large">
                <ConfigProvider theme="light"><Probe name="value" /></ConfigProvider>
            </ConfigProvider>,
        );
        await rerender(
            <ConfigProvider theme="dark" locale="zh-CN" size="small">
                <ConfigProvider><Probe name="value" /></ConfigProvider>
            </ConfigProvider>,
        );
        const output = screen.getByLabelText('value');
        expect(output.textContent).toBe('dark/zh-CN/small');
        expect(output.parentElement?.getAttribute('lang')).toBe('zh-CN');
        expect(output.parentElement?.dataset.theme).toBe('dark');
    });

    it('forwards native attributes and React 19 refs without mutating the document', async () => {
        const rootTheme = document.documentElement.getAttribute('data-theme');
        const cleanupRef = mock.fn();
        const ref = mock.fn(() => cleanupRef);
        const { unmount } = await render(
            <StrictMode>
                <ConfigProvider theme="dark" locale="en-US" ref={ref} id="scope" className="custom" aria-label="scope">
                    <Probe name="value" />
                </ConfigProvider>
            </StrictMode>,
        );
        const scope = screen.getByLabelText('scope');
        expect(scope.id).toBe('scope');
        expect(scope.className).toBe('custom');
        expect(scope.getAttribute('style')).toBeNull();
        expect(ref).toHaveBeenCalledWith(scope);
        await unmount();
        expect(cleanupRef).toHaveBeenCalled();
        expect(document.documentElement.getAttribute('data-theme')).toBe(rootTheme);
    });

    it('can re-establish the CSS boundary inside a portal while inheriting context', async () => {
        await render(
            <ConfigProvider theme="dark" locale="en-US">
                {createPortal(<ConfigProvider><Probe name="portal" /></ConfigProvider>, document.body)}
            </ConfigProvider>,
        );
        const output = screen.getByLabelText('portal');
        expect(output.textContent).toBe('dark/en-US/middle');
        expect(output.parentElement?.dataset.theme).toBe('dark');
    });
});
