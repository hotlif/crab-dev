import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import Preview from '../preview.js';

describe('ComponentPreview actions', () => {
    it('retains one live preview while the source closes and removes collapsed source from interaction', async () => {
        const { container } = await render(
            <Preview sourceCode="export default 1;"><input aria-label="Live value" defaultValue="initial" /></Preview>,
        );
        const toggle = screen.getByRole('button', { name: '查看源码' });
        const source = document.getElementById(toggle.getAttribute('aria-controls')!);
        expect(source?.getAttribute('inert')).not.toBeNull();
        expect(source?.querySelector('pre')).toBeNull();
        const input = screen.getByRole('textbox', { name: 'Live value' });
        await fireEvent.input(input, { target: { value: 'edited' } });
        await act(async () => {
            await fireEvent.click(toggle);
            // Keep the real lazy source module resolution inside React's async boundary.
            await import('../sourceCode.js');
        });
        expect(source?.getAttribute('aria-hidden')).toBe('false');
        expect(source?.hasAttribute('inert')).toBe(false);
        expect(source?.querySelector('pre')?.textContent).toContain('export default 1;');
        await fireEvent.click(screen.getByRole('button', { name: '收起源码' }));
        expect(source?.isConnected).toBe(true);
        expect(source?.getAttribute('aria-hidden')).toBe('true');
        expect(source?.hasAttribute('inert')).toBe(true);
        expect(container.querySelectorAll('input')).toHaveLength(1);
        expect((input as HTMLInputElement).value).toBe('edited');
    });
    it('copies the complete source and reports success only after copying', async () => {
        const source = 'import Button from "@crab-dev/rc-button";\nexport default Button;';
        const copy = mock.fn(async () => {});
        await render(<Preview sourceCode={source} onCopyCode={copy}>Preview</Preview>);
        await fireEvent.click(screen.getByRole('button', { name: '复制代码' }));
        expect(copy).toHaveBeenCalledWith(source);
        expect(screen.getByRole('button', { name: '复制代码' }).textContent).toContain('已复制');
    });

    it('keeps the copy action available after the caller rejects copying', async () => {
        const copy = mock.fn(async () => { throw new Error('clipboard denied'); });
        await render(<Preview sourceCode="source" onCopyCode={copy}>Preview</Preview>);
        await fireEvent.click(screen.getByRole('button', { name: '复制代码' }));
        expect(screen.getByRole('button', { name: '复制代码' }).textContent).toBe('复制');
        expect(screen.getByRole('button', { name: '查看源码' }).getAttribute('aria-expanded')).toBe('false');
    });
});
