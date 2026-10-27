import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, userEvent } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
// The extracted Button + Tag CSS must participate in the actual cascade.
import Tag from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

async function settleLayout() {
    await act(async () => {
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        for (const animation of document.getAnimations()) {
            if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
        }
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    });
}

describe('Tag close paint role with published CSS', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`keeps compact paint, inherited foreground and native feedback (${designSystem}/${colorMode})`, async () => {
                const onClose = mock.fn();
                const onTagClick = mock.fn();
                const fixture = (size: 'small' | 'medium' | 'large') => <>
                    <style>{compiledCss}</style>
                    <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                        <div style={{ padding: 48 }}>
                            <button type="button" data-before>Before</button>
                            <Tag data-tag color="primary" size={size} closable onClose={onClose} onClick={onTagClick}>Label</Tag>
                        </div>
                    </ConfigProvider>
                </>;
                const view = await render(fixture('small'));
                const user = userEvent.setup();
                for (const size of ['small', 'medium', 'large'] as const) {
                    await view.rerender(fixture(size));
                    await settleLayout();
                    const tag = view.container.querySelector<HTMLElement>('[data-tag]')!;
                    const close = tag.querySelector<HTMLButtonElement>('button')!;
                    const before = view.container.querySelector<HTMLButtonElement>('[data-before]')!;
                    const expectedSize = size === 'small' ? 18 : 20;
                    const bounds = close.getBoundingClientRect();
                    const tagBounds = tag.getBoundingClientRect();
                    expect(bounds.width).toBeCloseTo(expectedSize, 1);
                    expect(bounds.height).toBeCloseTo(expectedSize, 1);
                    expect(bounds.top).toBeGreaterThanOrEqual(tagBounds.top + 1);
                    expect(bounds.bottom).toBeLessThanOrEqual(tagBounds.bottom - 1);
                    expect(getComputedStyle(close).color).toBe(getComputedStyle(tag).color);
                    expect(close.getAttribute('type')).toBe('button');

                    await act(() => user.hover(close));
                    await settleLayout();
                    expect(close.matches(':hover')).toBe(true);
                    const hoverBackground = getComputedStyle(close).backgroundColor;
                    expect(hoverBackground).not.toBe('rgba(0, 0, 0, 0)');
                    expect(getComputedStyle(close).color).toBe(getComputedStyle(tag).color);
                    await act(() => user.unhover(view.container));
                    await act(() => before.focus());
                    await act(() => user.tab());
                    await settleLayout();
                    expect(document.activeElement).toBe(close);
                    expect(close.matches(':focus-visible')).toBe(true);
                    const focused = getComputedStyle(close);
                    expect(focused.outlineStyle).toBe('solid');
                    expect(Number.parseFloat(focused.outlineWidth)).toBe(2);
                    expect(Number.parseFloat(focused.outlineOffset)).toBe(-2);
                    expect(focused.outlineColor).toBe(focused.color);

                    // Exercise Button's actual assistive-click feedback, not a
                    // forced pseudo-class or a claim about a physical held press.
                    await fireEvent.click(close, { detail: 0 });
                    expect(close.hasAttribute('data-press-feedback')).toBe(true);
                    await settleLayout();
                    expect(close.hasAttribute('data-press-feedback')).toBe(true);
                    expect(getComputedStyle(close).backgroundColor).not.toBe(hoverBackground);
                    expect(close.getBoundingClientRect().width).toBeCloseTo(expectedSize, 1);
                    // Let the real feedback timer finish before measuring the
                    // next size's idle/hover state on the retained Button node.
                    const deadline = performance.now() + 1500;
                    while (close.hasAttribute('data-press-feedback') && performance.now() < deadline) {
                        await act(async () => {
                            await new Promise<void>(resolve => setTimeout(resolve, 25));
                        });
                    }
                    expect(close.hasAttribute('data-press-feedback')).toBe(false);
                }
                expect(onClose).toHaveBeenCalledTimes(3);
                expect(onTagClick).not.toHaveBeenCalled();
            });
        }
    }
});
