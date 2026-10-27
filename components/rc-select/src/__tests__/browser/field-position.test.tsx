import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Select from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

async function settle() {
    await act(async () => {
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        for (const animation of document.getAnimations()) {
            if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
        }
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    });
}

function geometry(container: HTMLElement) {
    const control = container.querySelector<HTMLElement>('[role="combobox"]');
    const listbox = document.querySelector<HTMLElement>('[role="listbox"]');
    const popup = listbox?.closest<HTMLElement>('[data-state="open"]');
    const field = control?.parentElement?.parentElement;
    if (!control || !popup || !field) throw new Error('Missing actual Select field or popup');
    return { control, field, popup };
}

describe('Select own field positioning and actual focus reference', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            for (const direction of ['ltr', 'rtl'] as const) {
                it(`clears own help, long help and errors (${designSystem}/${colorMode}/${direction})`, async () => {
                    const changed = mock.fn();
                    const fixture = (supportingText?: string, errorText?: string) => <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction}>
                        <style>{compiledCss}</style>
                        <div style={{ position: 'fixed', top: 32, insetInlineStart: 32, width: 240 }}>
                            <Select label="Project" supportingText={supportingText} errorText={errorText} defaultOpen
                                onOpenChange={changed} options={[{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }]} />
                        </div>
                    </ConfigProvider>;
                    const view = await render(fixture());
                    let previousHeight = 0;
                    for (const [support, error] of [[undefined, undefined], ['Choose a project', undefined], ['说明文字会换行。Long supporting text must remain readable above the open popup. '.repeat(3), undefined], [undefined, 'Choose an available project before continuing.']] as const) {
                        await view.rerender(fixture(support, error));
                        await settle();
                        const { control, field, popup } = geometry(view.container);
                        const bounds = field.getBoundingClientRect();
                        const floating = popup.getBoundingClientRect();
                        const input = control.getBoundingClientRect();
                        expect(floating.top).toBeGreaterThanOrEqual(bounds.bottom + 5);
                        expect(floating.width).toBeCloseTo(input.width, 1);
                        expect(direction === 'ltr' ? floating.left : floating.right).toBeCloseTo(direction === 'ltr' ? input.left : input.right, 1);
                        if (support?.length && support.length > 100) expect(bounds.height).toBeGreaterThan(previousHeight);
                        previousHeight = bounds.height;
                    }
                    const { control } = geometry(view.container);
                    await act(async () => { control.focus(); });
                    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
                    await fireEvent(control, escape);
                    await settle();
                    expect(document.activeElement).toBe(control);
                    expect(control.getAttribute('aria-expanded')).toBe('false');
                    expect(changed).toHaveBeenCalledTimes(1);
                    expect(changed.calls.calls[0][0]).toBe(false);
                    expect(changed.calls.calls[0][1].reason).toBe('escape');
                    expect(changed.calls.calls[0][1].event).toBe(escape);
                });
            }
            it(`flips above the whole field near the viewport bottom (${designSystem}/${colorMode})`, async () => {
                const view = await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                    <style>{compiledCss}</style>
                    <div style={{ position: 'fixed', bottom: 16, left: 32, width: 240 }}>
                        <Select label="Project" supportingText="Own supporting text" defaultOpen options={[{ value: 'one', label: 'One' }]} />
                    </div>
                </ConfigProvider>);
                await settle();
                const { field, popup } = geometry(view.container);
                expect(popup.getBoundingClientRect().bottom).toBeLessThanOrEqual(field.getBoundingClientRect().top - 5);
            });
        }
    }
});
