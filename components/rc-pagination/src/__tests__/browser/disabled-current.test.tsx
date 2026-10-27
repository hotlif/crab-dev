import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Pagination from '../../../esm/index.mjs';
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

describe('Pagination disabled current location with published CSS', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`keeps a neutral visible marker without enabling navigation (${designSystem}/${colorMode})`, async () => {
                const onValueChange = mock.fn();
                const fixture = (disabled: boolean) => <>
                    <style>{compiledCss}</style>
                    <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                        <div style={{ padding: 32 }}>
                            <Pagination defaultValue={3} total={80} disabled={disabled} onValueChange={onValueChange} />
                            <span data-disabled-surface style={{ background: 'var(--token-semantic-color-background-disabled)' }}>Surface reference</span>
                        </div>
                    </ConfigProvider>
                </>;
                const view = await render(fixture(false));
                await settleLayout();
                const current = view.container.querySelector<HTMLButtonElement>('[aria-current="page"]')!;
                expect(current.textContent).toBe('3');
                await view.rerender(fixture(true));
                await settleLayout();
                expect(view.container.querySelector('[aria-current="page"]')).toBe(current);
                expect(view.container.querySelectorAll('[aria-current="page"]').length).toBe(1);
                const other = view.container.querySelector<HTMLButtonElement>('button[aria-label="页码 2"]')!;
                const reference = view.container.querySelector<HTMLElement>('[data-disabled-surface]')!;
                const currentStyle = getComputedStyle(current);
                const otherStyle = getComputedStyle(other);
                expect(currentStyle.backgroundColor).toBe(getComputedStyle(reference).backgroundColor);
                expect(currentStyle.backgroundColor).not.toBe(otherStyle.backgroundColor);
                expect(currentStyle.borderColor).not.toBe(otherStyle.borderColor);
                expect(currentStyle.borderStyle).toBe('solid');
                expect(Number.parseFloat(currentStyle.borderWidth)).toBeGreaterThan(0);
                expect(currentStyle.color).toBe(otherStyle.color);
                for (const button of view.container.querySelectorAll('button')) {
                    expect(button.disabled).toBe(true);
                    expect(button.getAttribute('aria-disabled')).toBe('true');
                    await act(() => button.click());
                }
                expect(onValueChange).not.toHaveBeenCalled();
                expect(current.getAttribute('aria-current')).toBe('page');
                await view.rerender(fixture(false));
                await settleLayout();
                expect(current.disabled).toBe(false);
                expect(current.getAttribute('aria-current')).toBe('page');
                expect(onValueChange).not.toHaveBeenCalled();
            });
        }
    }
});
