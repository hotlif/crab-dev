import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Tabs from '../../../esm/index.mjs';
import token from '../../token.js';
import compiledCss from '../../../.cache/browser-css.json';

describe('Tabs close action compiled CSS contract', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`keeps ${designSystem}/${colorMode} neutral close feedback and its own focus ring`, async () => {
                const close = mock.fn();
                const view = await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                    <style>{compiledCss}</style>
                    <Tabs defaultValue="one" onTabClose={close} items={[{ key: 'one', label: 'Document', closable: true, children: 'Body' }]} />
                </ConfigProvider>);
                const button = view.container.querySelector<HTMLButtonElement>('button[aria-label="关闭标签页"]');
                if (!button) throw new Error('Missing actual close button');
                // Freeze only interpolation, never recreate the actual color/state CSS.
                button.style.transition = 'none';
                const witness = document.createElement('span');
                witness.style.color = token.close.color;
                witness.style.backgroundColor = token.close['background-color-hover'];
                witness.style.outlineColor = token.close['outline-color-focus'];
                button.parentElement!.append(witness);
                try {
                    const expected = getComputedStyle(witness);
                    expect(getComputedStyle(button).color).toBe(expected.color);
                    expect(getComputedStyle(button).backgroundColor).toBe('rgba(0, 0, 0, 0)');
                    const initial = button.getBoundingClientRect();
                    // tabIndex=-1 is intentional; this proves focus CSS, not Tab reachability.
                    await act(async () => { button.focus(); });
                    expect(document.activeElement).toBe(button);
                    expect(button.matches(':focus-visible')).toBe(true);
                    expect(getComputedStyle(button).backgroundColor).toBe(expected.backgroundColor);
                    expect(getComputedStyle(button).outlineColor).toBe(expected.outlineColor);
                    expect(getComputedStyle(button).outlineStyle).toBe('solid');
                    expect(getComputedStyle(button).outlineWidth).toBe('2px');
                    // Static selector probe: real pressed CSS, not a simulated native :active.
                    button.setAttribute('data-press-feedback', '');
                    expect(getComputedStyle(button).backgroundColor).toBe(expected.backgroundColor);
                    expect(getComputedStyle(button).color).toBe(expected.color);
                    expect(button.getBoundingClientRect().width).toBe(initial.width);
                    expect(button.getBoundingClientRect().height).toBe(initial.height);
                    expect(close).not.toHaveBeenCalled();
                } finally {
                    button.removeAttribute('data-press-feedback');
                    witness.remove();
                }
            });
        }
    }
});
