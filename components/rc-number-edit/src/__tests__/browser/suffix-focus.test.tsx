import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
// Layout-only exception: measure the same extracted styles as an application,
// without the DOM suite's css() mock or a replacement focus/spacing rule.
import NumberEdit from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

const settleLayout = () => act(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    for (const animation of document.getAnimations()) {
        if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
    }
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});

function button(container: HTMLElement, name: string): HTMLButtonElement {
    const target = container.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`);
    if (!target) throw new Error(`Missing NumberEdit ${name} control`);
    return target;
}

function expectUnitClearOfFocusRing(unit: HTMLElement, target: HTMLButtonElement, direction: 'ltr' | 'rtl') {
    const range = document.createRange();
    range.selectNodeContents(unit);
    const textBounds = range.getBoundingClientRect();
    const controlBounds = target.getBoundingClientRect();
    const style = getComputedStyle(target);
    expect(document.activeElement).toBe(target);
    expect(target.matches(':focus-visible')).toBe(true);
    expect(style.outlineStyle).toBe('solid');
    expect(Number.parseFloat(style.outlineWidth)).toBeGreaterThan(0);
    const outset = Number.parseFloat(style.outlineWidth) + Number.parseFloat(style.outlineOffset);
    expect(outset).toBeGreaterThan(0);
    expect(textBounds.width).toBeGreaterThan(0);
    // Text glyph bounds, not a mocked container rectangle: this fails for the
    // candidate02 '%' ending at x=787 and the focus ring beginning at x=782.
    const clearance = direction === 'rtl'
        ? textBounds.left - (controlBounds.right + outset)
        : controlBounds.left - outset - textBounds.right;
    expect(clearance).toBeGreaterThanOrEqual(1);
    // A hidden/clipped focus ring is not a successful spacing fix.
    for (let ancestor = target.parentElement; ancestor; ancestor = ancestor.parentElement) {
        const ancestorStyle = getComputedStyle(ancestor);
        expect(ancestorStyle.overflowX).toBe('visible');
        expect(ancestorStyle.overflowY).toBe('visible');
    }
    expect(document.documentElement.scrollWidth).toBe(document.documentElement.clientWidth);
}

describe('NumberEdit unit and actual stepper focus geometry', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            for (const direction of ['ltr', 'rtl'] as const) {
                it(`keeps the unit outside enabled boundary controls' focus rings (${designSystem}/${colorMode}/${direction})`, async () => {
                    const fixture = (value: number, withSuffix = true, controls = true) => <>
                        <style>{compiledCss}</style>
                        <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction}>
                            <div style={{ width: 360, padding: 16 }}>
                                <NumberEdit
                                    label="Percent"
                                    value={value}
                                    min={0}
                                    max={100}
                                    suffix={withSuffix ? <span data-testid="unit">%</span> : undefined}
                                    controls={controls}
                                />
                            </div>
                        </ConfigProvider>
                    </>;
                    const view = await render(fixture(0));
                    for (const value of [0, 100]) {
                        await view.rerender(fixture(value));
                        await settleLayout();
                        const increase = button(view.container, '增加');
                        const decrease = button(view.container, '减少');
                        expect(increase.disabled).toBe(value === 100);
                        expect(decrease.disabled).toBe(value === 0);
                        const target = value === 0 ? increase : decrease;
                        await act(() => target.focus());
                        await settleLayout();
                        const unit = view.container.querySelector<HTMLElement>('[data-testid="unit"]');
                        if (!unit) throw new Error('Missing visible percent suffix');
                        expectUnitClearOfFocusRing(unit, target, direction);
                    }

                    // Removing the optional suffix must not leave a spacer before
                    // the first button; disabling controls must retain the unit.
                    await view.rerender(fixture(50, false));
                    await settleLayout();
                    const increase = button(view.container, '增加');
                    const stepper = increase.parentElement!;
                    const suffix = stepper.parentElement!;
                    // A flex item blockifies inline-flex to flex. Verify the
                    // observable absence of an empty suffix gap instead.
                    expect(suffix.getBoundingClientRect().width).toBeCloseTo(stepper.getBoundingClientRect().width, 1);
                    await view.rerender(fixture(50, true, false));
                    await settleLayout();
                    expect(view.container.querySelector('button[aria-label="增加"]')).toBeNull();
                    const unit = view.container.querySelector<HTMLElement>('[data-testid="unit"]');
                    expect(unit?.textContent).toBe('%');
                    expect(unit!.getBoundingClientRect().width).toBeGreaterThan(0);
                });
            }
        }
    }
});
