import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, userEvent } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Notification from '../../../esm/index.mjs';
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

describe('Notification close role with published CSS', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`preserves opaque interaction and local foreground (${designSystem}/${colorMode})`, async () => {
                const onOpenChange = mock.fn();
                const view = await render(<>
                    <style>{compiledCss}</style>
                    <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                        <div style={{ padding: 48 }}>
                            <button type="button" data-before>Before</button>
                            <Notification open title="Notification" duration={0} onOpenChange={onOpenChange}>Details</Notification>
                            <span data-local-color style={{ color: 'var(--token-semantic-color-text-secondary)' }}>Color reference</span>
                        </div>
                    </ConfigProvider>
                </>);
                await settleLayout();
                const close = view.container.querySelector<HTMLButtonElement>('[role="status"] button')!;
                const before = view.container.querySelector<HTMLButtonElement>('[data-before]')!;
                const reference = view.container.querySelector<HTMLElement>('[data-local-color]')!;
                const user = userEvent.setup();
                expect(getComputedStyle(close).opacity).toBe('1');
                expect(getComputedStyle(close).color).toBe(getComputedStyle(reference).color);
                await act(() => user.hover(close));
                await settleLayout();
                expect(close.matches(':hover')).toBe(true);
                const hoverBackground = getComputedStyle(close).backgroundColor;
                expect(hoverBackground).not.toBe('rgba(0, 0, 0, 0)');
                expect(getComputedStyle(close).opacity).toBe('1');

                await act(() => user.unhover(view.container));
                await act(() => before.focus());
                await act(() => user.tab());
                await settleLayout();
                expect(document.activeElement).toBe(close);
                expect(close.matches(':focus-visible')).toBe(true);
                expect(getComputedStyle(close).outlineStyle).toBe('solid');
                expect(Number.parseFloat(getComputedStyle(close).outlineWidth)).toBeGreaterThanOrEqual(2);
                expect(getComputedStyle(close).opacity).toBe('1');

                // Read the real React-produced assistive click state while open
                // is controlled. This does not claim a physical held press.
                await fireEvent.click(close, { detail: 0 });
                expect(close.hasAttribute('data-press-feedback')).toBe(true);
                await settleLayout();
                expect(close.hasAttribute('data-press-feedback')).toBe(true);
                expect(getComputedStyle(close).backgroundColor).not.toBe(hoverBackground);
                expect(getComputedStyle(close).color).toBe(getComputedStyle(reference).color);
                expect(onOpenChange).toHaveBeenCalledTimes(1);
                expect(onOpenChange).toHaveBeenCalledWith(false, expect.objectContaining({ reason: 'close-button' }));
            });
        }
    }
});
