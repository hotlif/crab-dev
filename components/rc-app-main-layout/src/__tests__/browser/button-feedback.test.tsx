import { describe, expect, it } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Layout, { AppMainLayoutProvider } from '../../../esm/index.mjs';
import token from '../../token.js';
import compiledCss from '../../../.cache/browser-css.json';

describe('Layout tab menu compiled CSS contract', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`keeps ${designSystem}/${colorMode} neutral menu feedback across focus and press`, async () => {
                await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                    <style>{compiledCss}</style>
                    <div style={{ width: 900, height: 480 }}>
                        <AppMainLayoutProvider initialTabs={[{ key: 'dashboard', title: 'Dashboard', closable: false, children: 'Body' }]}>
                            <Layout fullscreenable={false} />
                        </AppMainLayoutProvider>
                    </div>
                </ConfigProvider>);
                const tab = screen.getByRole('tab', { name: 'Dashboard' });
                await act(async () => { tab.focus(); });
                await fireEvent.keyDown(tab, { key: 'F10', shiftKey: true });
                const button = screen.getByRole('menuitem', { name: '重新加载页面' }) as HTMLButtonElement;
                const disabled = screen.getByRole('menuitem', { name: '关闭' }) as HTMLButtonElement;
                button.style.transition = 'none';
                const witness = document.createElement('span');
                witness.style.color = token.tab['context-menu'].item.color;
                witness.style.backgroundColor = token.tab['context-menu'].item['background-color-hover'];
                button.parentElement!.append(witness);
                try {
                    await act(async () => { button.blur(); });
                    const expected = getComputedStyle(witness);
                    expect(getComputedStyle(button).color).toBe(expected.color);
                    expect(getComputedStyle(button).backgroundColor).toBe('rgba(0, 0, 0, 0)');
                    const initial = button.getBoundingClientRect();
                    await act(async () => { button.focus(); });
                    expect(document.activeElement).toBe(button);
                    expect(button.matches(':focus-visible')).toBe(true);
                    expect(getComputedStyle(button).backgroundColor).toBe(expected.backgroundColor);
                    expect(getComputedStyle(button).outlineColor).toBe(expected.color);
                    expect(getComputedStyle(button).outlineStyle).toBe('solid');
                    expect(getComputedStyle(button).outlineWidth).toBe('2px');
                    // Real compiled feedback selector; native pointer hover/hold is audited separately.
                    button.setAttribute('data-press-feedback', '');
                    expect(getComputedStyle(button).backgroundColor).toBe(expected.backgroundColor);
                    expect(getComputedStyle(button).color).toBe(expected.color);
                    expect(button.getBoundingClientRect().width).toBe(initial.width);
                    expect(button.getBoundingClientRect().height).toBe(initial.height);
                    disabled.setAttribute('data-press-feedback', '');
                    expect(disabled.disabled).toBe(true);
                    expect(getComputedStyle(disabled).backgroundColor).toBe('rgba(0, 0, 0, 0)');
                } finally {
                    button.removeAttribute('data-press-feedback');
                    disabled.removeAttribute('data-press-feedback');
                    witness.remove();
                }
            });
        }
    }
});
