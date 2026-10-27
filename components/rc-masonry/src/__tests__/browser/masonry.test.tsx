import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import ConfigProvider, { type ConfigDensity } from '@crab-dev/rc-config-provider';
// Layout-only exception: use the published renderer and extracted CSS so an
// absent positioning origin or an incorrect RTL transform cannot pass a mock.
import Masonry from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

type Direction = 'ltr' | 'rtl';
const heights = [30, 70, 50, 80, 20, 40, 10];

async function settleLayout(): Promise<void> {
    await act(async () => {
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        for (const animation of document.getAnimations()) {
            if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
        }
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    });
}

function getRoot(container: HTMLElement): HTMLElement {
    const root = container.querySelector<HTMLElement>('[data-testid="masonry-geometry"]');
    if (!root) throw new Error('Missing Masonry geometry fixture');
    return root;
}

function assertContained(root: HTMLElement): DOMRect[] {
    const bounds = root.getBoundingClientRect();
    const rects = Array.from(root.children, item => item.getBoundingClientRect());
    for (const rect of rects) {
        expect(rect.width).toBeGreaterThan(0);
        expect(rect.left).toBeGreaterThanOrEqual(bounds.left - 0.1);
        expect(rect.right).toBeLessThanOrEqual(bounds.right + 0.1);
        expect(rect.top).toBeGreaterThanOrEqual(bounds.top - 0.1);
        expect(rect.bottom).toBeLessThanOrEqual(bounds.bottom + 0.1);
    }
    expect(root.scrollWidth).toBe(root.clientWidth);
    return rects;
}

describe('Masonry published CSS logical positioning', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            for (const direction of ['ltr', 'rtl'] as const) {
                it(`${designSystem}/${colorMode}/${direction}: uses live density for both axes, with explicit gutter taking precedence`, async () => {
                    const fixture = (density: ConfigDensity, gutter?: number) => <>
                        <style>{compiledCss}</style>
                        <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction} density="comfortable">
                            <ConfigProvider density={density}>
                                <Masonry columns={3} sequential gutter={gutter} style={{ width: 330 }} data-testid="masonry-geometry">
                                    {[30, 70, 50, 80].map((height, index) => <div key={index} style={{ height }}>Item {index + 1}</div>)}
                                </Masonry>
                            </ConfigProvider>
                        </ConfigProvider>
                    </>;
                    const view = await render(fixture('standard'));
                    const root = getRoot(view.container);
                    const children = Array.from(root.children);
                    const assertGap = (gap: number) => {
                        const rects = assertContained(root);
                        expect(rects[0].width).toBeCloseTo((330 - gap * 2) / 3, 1);
                        expect(rects[3].top - rects[0].top).toBeCloseTo(30 + gap, 1);
                        expect(direction === 'ltr' ? rects[1].left - rects[0].right : rects[0].left - rects[1].right).toBeCloseTo(gap, 1);
                        expect(root.getBoundingClientRect().height).toBeCloseTo(110 + gap, 1);
                        children.forEach((child, index) => expect(root.children[index]).toBe(child));
                    };
                    for (const [density, gap] of [['compact', 6], ['standard', 8], ['comfortable', 12]] as const) {
                        await view.rerender(fixture(density));
                        await settleLayout();
                        expect(Number.parseFloat(getComputedStyle(root).columnGap)).toBe(gap);
                        assertGap(gap);
                    }
                    for (const gutter of [0, 17]) {
                        for (const density of ['compact', 'comfortable'] as const) {
                            await view.rerender(fixture(density, gutter));
                            await settleLayout();
                            assertGap(gutter);
                        }
                    }
                    await view.rerender(fixture('standard'));
                    await settleLayout();
                    assertGap(8);
                });
            }
        }
    }

    for (const sequential of [false, true]) {
        for (const inherited of [false, true]) {
            it(`mirrors every column and preserves unequal row heights (sequential=${sequential}, inherited=${inherited})`, async () => {
                const fixture = (direction: Direction) => <>
                    <style>{compiledCss}</style>
                    <div dir={inherited ? direction : undefined}>
                        <Masonry columns={3} gutter={15} sequential={sequential} dir={inherited ? undefined : direction}
                            style={{ width: 330 }} data-testid="masonry-geometry">
                            {heights.map((height, index) => <div key={index} style={{ height }}>Item {index + 1}</div>)}
                        </Masonry>
                    </div>
                </>;
                const view = await render(fixture('ltr'));
                const root = getRoot(view.container);
                const initialNodes = Array.from(root.children);
                const columns = sequential ? [0, 1, 2, 0, 1, 2, 0] : [0, 1, 2, 0, 2, 1, 2];
                const tops = sequential ? [0, 0, 0, 45, 85, 65, 140] : [0, 0, 0, 45, 65, 85, 100];
                for (const direction of ['ltr', 'rtl', 'ltr'] as const) {
                    await view.rerender(fixture(direction));
                    await settleLayout();
                    const rects = assertContained(root);
                    const bounds = root.getBoundingClientRect();
                    expect(rects).toHaveLength(heights.length);
                    expect(bounds.height).toBe(sequential ? 150 : 125);
                    rects.forEach((rect, index) => {
                        expect(root.children[index]).toBe(initialNodes[index]);
                        expect(rect.width).toBe(100);
                        expect(rect.height).toBe(heights[index]);
                        expect(rect.top - bounds.top).toBeCloseTo(tops[index], 1);
                        expect(rect.left - bounds.left).toBeCloseTo((direction === 'ltr' ? columns[index] : 2 - columns[index]) * 115, 1);
                    });
                }
            });
        }
    }

    it('reflows changed columns, explicit gaps and independently resized children in RTL', async () => {
        const fixture = (columns: number, gap: number, firstHeight: number) => <>
            <style>{compiledCss}</style>
            <Masonry columns={columns} gutter={gap} sequential dir="rtl" style={{ width: 330 }} data-testid="masonry-geometry">
                <div style={{ height: firstHeight }}>First</div>
                <div style={{ height: 60 }}>Second</div>
                <div style={{ height: 20 }}>Third</div>
            </Masonry>
        </>;
        const view = await render(fixture(2, 10, 40));
        const root = getRoot(view.container);
        await settleLayout();
        let rects = assertContained(root);
        expect(rects.map(rect => rect.width)).toEqual([160, 160, 160]);
        expect(rects[2].top - rects[0].top).toBe(50);
        expect(root.getBoundingClientRect().height).toBe(70);

        await view.rerender(fixture(2, 10, 80));
        await settleLayout();
        rects = assertContained(root);
        expect(rects[2].top - rects[0].top).toBe(90);
        expect(root.getBoundingClientRect().height).toBe(110);

        await view.rerender(fixture(3, 0, 80));
        await settleLayout();
        rects = assertContained(root);
        expect(rects.map(rect => rect.width)).toEqual([110, 110, 110]);
        expect(rects.map(rect => rect.top)).toEqual([rects[0].top, rects[0].top, rects[0].top]);
        expect(root.getBoundingClientRect().height).toBe(80);
    });
});
