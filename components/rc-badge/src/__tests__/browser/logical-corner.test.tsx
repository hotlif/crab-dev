import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Badge from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

type Direction = 'ltr' | 'rtl';
const reverse = (direction: Direction): Direction => direction === 'ltr' ? 'rtl' : 'ltr';
const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
const settle = (scope: HTMLElement) => act(async () => {
    await nextFrame();
    await Promise.all(scope.getAnimations({ subtree: true }).filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => undefined)));
    await nextFrame();
});
function required(scope: ParentNode, selector: string): HTMLElement {
    const element = scope.querySelector<HTMLElement>(selector);
    if (!element) throw Error(`Missing Badge fixture ${selector}`);
    return element;
}
const near = (actual: number, expected: number) => expect(Math.abs(actual - expected)).toBeLessThan(0.75);
function corner(wrapper: HTMLElement, direction: Direction, x = 0, y = 0) {
    const badge = required(wrapper, '[role="status"]');
    const host = wrapper.getBoundingClientRect(), rect = badge.getBoundingClientRect();
    expect(getComputedStyle(badge).direction).toBe(direction);
    expect(rect.width).toBeGreaterThan(0);
    expect(rect.height).toBeGreaterThan(0);
    near(rect.left + rect.width / 2, (direction === 'ltr' ? host.right : host.left) + x);
    near(rect.top + rect.height / 2, host.top + y);
    expect(rect.left).toBeGreaterThanOrEqual(0);
    expect(rect.right).toBeLessThanOrEqual(globalThis.innerWidth);
    return badge;
}

function numericGlyphOrder(indicator: HTMLElement, expected: string) {
    const expression = required(indicator, 'bdi');
    expect(expression.textContent).toBe(expected);
    expect(getComputedStyle(expression).direction).toBe('ltr');
    expect(getComputedStyle(expression).unicodeBidi).toBe('isolate');
    const text = expression.firstChild;
    if (!text || text.nodeType !== Node.TEXT_NODE) throw Error('Missing actual numeric Badge text');
    let previousLeft = -Infinity;
    for (let index = 0; index < expected.length; index++) {
        const range = document.createRange();
        range.setStart(text, index);
        range.setEnd(text, index + 1);
        const rect = range.getBoundingClientRect();
        expect(rect.width).toBeGreaterThan(0);
        expect(rect.left).toBeGreaterThan(previousLeft);
        previousLeft = rect.left;
    }
}

describe('Badge logical corner with published CSS', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            for (const initialDirection of ['ltr', 'rtl'] as const) {
                it(`mirrors the actual DOM direction and preserves physical offsets (${designSystem}/${colorMode}/${initialDirection})`, async () => {
                    const content = <span style={{ display: 'inline-block', width: 36, height: 36 }}>A</span>;
                    const fixture = (direction: Direction) => <>
                        <style>{compiledCss}</style>
                        <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction}>
                            <div style={{ display: 'flex', gap: 64, padding: 64, flexWrap: 'wrap' }}>
                                <Badge data-badge="count" count={120}>{content}</Badge>
                                <Badge data-badge="dot" dot>{content}</Badge>
                                <Badge data-badge="offset" count={2} offset={[10, -4]}>{content}</Badge>
                                <Badge data-badge="calc" count={3} offset={['calc(8px + 3px)', 'calc(-2px - 3px)']}>{content}</Badge>
                                <Badge data-badge="native" dir={reverse(direction)} count={4}>{content}</Badge>
                                <span dir={reverse(direction)}><Badge data-badge="ancestor" count={5}>{content}</Badge></span>
                                <Badge data-badge="decimal" count={-12.5} />
                                <Badge data-badge="custom" count={<span dir="rtl" data-custom-count="">عد 12</span>} />
                                <Badge data-badge="override" count={6} offset={[20, 20]}
                                    indicatorStyle={{ transform: 'translate(3px, 4px)', top: 9, insetInlineEnd: 12 }}>{content}</Badge>
                            </div>
                        </ConfigProvider>
                    </>;
                    const view = await render(fixture(initialDirection));
                    await settle(view.container);
                    const count = required(view.container, '[data-badge="count"] [role="status"]');
                    const dot = required(view.container, '[data-badge="dot"] [role="status"]');
                    for (const direction of [initialDirection, reverse(initialDirection), initialDirection]) {
                        await view.rerender(fixture(direction));
                        await settle(view.container);
                        expect(corner(required(view.container, '[data-badge="count"]'), direction)).toBe(count);
                        expect(count.textContent).toBe('99+');
                        numericGlyphOrder(count, '99+');
                        numericGlyphOrder(required(view.container, '[data-badge="decimal"] [role="status"]'), '-12.5');
                        const custom = required(view.container, '[data-badge="custom"] [role="status"]');
                        expect(custom.querySelector('bdi')).toBeNull();
                        expect(getComputedStyle(required(custom, '[data-custom-count]')).direction).toBe('rtl');
                        expect(corner(required(view.container, '[data-badge="dot"]'), direction)).toBe(dot);
                        corner(required(view.container, '[data-badge="offset"]'), direction, 10, -4);
                        corner(required(view.container, '[data-badge="calc"]'), direction, 11, -5);
                        corner(required(view.container, '[data-badge="native"]'), reverse(direction));
                        corner(required(view.container, '[data-badge="ancestor"]'), reverse(direction));
                        const override = required(view.container, '[data-badge="override"]');
                        const host = override.getBoundingClientRect();
                        const indicator = required(override, '[role="status"]');
                        const rect = indicator.getBoundingClientRect();
                        near(rect.top, host.top + 13);
                        near(direction === 'ltr' ? rect.right : rect.left, direction === 'ltr' ? host.right - 9 : host.left + 15);
                        expect(indicator.style.transform).toBe('translate(3px, 4px)');
                    }
                });
            }
        }
    }
});
