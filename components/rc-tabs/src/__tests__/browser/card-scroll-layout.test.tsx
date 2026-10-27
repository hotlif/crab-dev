import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render, userEvent } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Tabs from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

const items = Array.from({ length: 8 }, (_, index) => ({
    key: String(index), label: `Document ${index + 1}`, children: `Panel ${index + 1}`,
}));

function expectVerticalFit(bar: HTMLDivElement, tab: HTMLButtonElement) {
    // Read real layout after browser scrolling; no dimension or scroll stubs.
    expect(bar.scrollHeight).toBe(bar.clientHeight);
    expect(bar.scrollTop).toBe(0);
    const bounds = bar.getBoundingClientRect();
    const item = tab.getBoundingClientRect();
    expect(item.top).toBeGreaterThanOrEqual(bounds.top + bar.clientTop);
    expect(item.bottom).toBeLessThanOrEqual(bounds.top + bar.clientTop + bar.clientHeight);
}

describe('Published card tabs retain their top edge during native scrolling', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            for (const direction of ['ltr', 'rtl'] as const) {
                for (const size of ['small', 'medium', 'large'] as const) {
                    it(`${designSystem}/${colorMode}/${direction}/${size} fits vertically and still reveals horizontal overflow`, async () => {
                        const view = await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction}>
                            <style>{compiledCss}</style>
                            {/* Only host width is constrained; all tab layout comes from published CSS. */}
                            <div data-tabs-host="" style={{ inlineSize: 180 }}>
                                <button data-before-tabs="">Before</button>
                                <Tabs type="card" size={size} defaultValue="0" items={items} />
                            </div>
                        </ConfigProvider>);
                        const bar = view.container.querySelector<HTMLDivElement>('[role="tablist"]');
                        const tabs = [...view.container.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
                        const before = view.container.querySelector<HTMLButtonElement>('[data-before-tabs]');
                        const host = view.container.querySelector<HTMLDivElement>('[data-tabs-host]');
                        const first = tabs[0], last = tabs.at(-1);
                        if (!bar || !before || !host || !first || !last) throw new Error('Missing published card tab fixture');
                        try {
                            expect(bar.scrollWidth).toBeGreaterThan(bar.clientWidth);
                            await act(() => { first.scrollIntoView({ block: 'center', inline: 'nearest' }); });
                            expectVerticalFit(bar, first);
                            const user = userEvent.setup();
                            await act(() => { before.focus(); });
                            await act(() => user.tab());
                            expect(document.activeElement).toBe(first);
                            expectVerticalFit(bar, first);
                            await act(() => user.keyboard('{End}'));
                            expect(document.activeElement).toBe(last);
                            expect(last.getAttribute('aria-selected')).toBe('true');
                            expect(Math.abs(bar.scrollLeft)).toBeGreaterThan(0);
                            expectVerticalFit(bar, last);
                            const end = last.getBoundingClientRect(), bounds = bar.getBoundingClientRect();
                            expect(end.left).toBeGreaterThanOrEqual(bounds.left - 0.01);
                            expect(end.right).toBeLessThanOrEqual(bounds.right + 0.01);
                            await act(() => user.keyboard('{Home}'));
                            expect(document.activeElement).toBe(first);
                            expect(first.getAttribute('aria-selected')).toBe('true');
                            expectVerticalFit(bar, first);
                            await act(() => user.keyboard(direction === 'rtl' ? '{ArrowLeft}' : '{ArrowRight}'));
                            expect(document.activeElement).toBe(tabs[1]);
                            expect(tabs[1]?.getAttribute('aria-selected')).toBe('true');
                            expectVerticalFit(bar, tabs[1]!);
                            await act(() => { host.style.inlineSize = '1100px'; });
                            // The reserved edge must not create a phantom scrollbar
                            // when every tab fits in the host's actual layout.
                            expect(bar.scrollWidth).toBe(bar.clientWidth);
                            expectVerticalFit(bar, tabs[1]!);
                        } finally {
                            await view.unmount();
                        }
                    });
                }
            }
        }
    }
});
