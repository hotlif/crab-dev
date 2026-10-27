import { describe, expect, it } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import { TokenVars as skeletonVars } from '@crab-dev/rc-skeleton';
import LoadingDemo from '../../../.cache/loading-demo.mjs';
import compiledCss from '../../../.cache/browser-css.json';

// Public Wake buildLibrary compiles the byte-identical docs example and extracts
// its CSS. These are 320 / 216 CSS-pixel containers in Wake's 1280 x 720 browser,
// not narrow viewports. fireEvent invokes the actual example's click handler;
// this regression does not claim physical pointer input or normal-motion frames.
const slots = ['avatar', 'title', 'description-1', 'description-2', 'description-3'] as const;
const textSlots = ['title', 'description-1', 'description-2', 'description-3'] as const;
const selectors = {
    stack: '[data-card-loading-demo]',
    button: 'button[data-card-loading-toggle]',
    card: '[data-card-loading-card]',
    cover: '[data-card-loading-cover]',
    body: '[data-card-loading-body]',
    meta: '[data-card-loading-meta]',
    status: '[role="status"][data-card-loading-status]',
    ...Object.fromEntries(slots.map(slot => [slot, `[data-card-loading-slot="${slot}"]`])),
};
const rectFields = ['x', 'y', 'width', 'height', 'top', 'right', 'bottom', 'left'] as const;
type Geometry = Record<string, Record<typeof rectFields[number], number>>;

function required<T extends Element>(root: ParentNode, selector: string): T {
    const elements = root.querySelectorAll<T>(selector);
    if (elements.length !== 1) throw new Error(`Expected one actual loading demo element: ${selector}; found ${elements.length}`);
    return elements[0];
}

const settle = () => act(async () => {
    await document.fonts.ready;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});

function geometry(host: HTMLElement): Geometry {
    return Object.fromEntries(Object.entries(selectors).map(([name, selector]) => {
        const bounds = required<HTMLElement>(host, selector).getBoundingClientRect();
        expect(bounds.width).toBeGreaterThan(0);
        expect(bounds.height).toBeGreaterThan(0);
        const values = Object.fromEntries(rectFields.map(field => [field, bounds[field]])) as Geometry[string];
        for (const value of Object.values(values)) expect(Number.isFinite(value)).toBe(true);
        return [name, values];
    }));
}

function expectSameGeometry(baseline: Geometry, actual: Geometry): void {
    const changes = Object.keys(baseline).flatMap(name => rectFields.flatMap(field => {
        const difference = actual[name][field] - baseline[name][field];
        return Math.abs(difference) <= 0.01 ? [] : [{ name, field, before: baseline[name][field], after: actual[name][field], difference }];
    }));
    // Report every shifted axis/size instead of only comparing Card width.
    expect(changes).toEqual([]);
}

function assertTextPlaceholderSpacing(host: HTMLElement): void {
    const ink = textSlots.map(slot => {
        const region = required<HTMLElement>(host, `[data-card-loading-slot="${slot}"]`);
        const placeholder = required<HTMLElement>(region, '[data-card-loading-placeholder="true"]');
        const bounds = region.getBoundingClientRect();
        const fill = placeholder.getBoundingClientRect();
        const topInset = fill.top - bounds.top;
        const bottomInset = bounds.bottom - fill.bottom;

        // Distinct text lines need actual background above and below their ink,
        // independently of the unchanged outer Card and line-slot rectangles.
        expect(fill.height).toBeLessThan(bounds.height);
        expect(topInset).toBeGreaterThan(0.5);
        expect(bottomInset).toBeGreaterThan(0.5);
        expect(Math.abs(topInset - bottomInset)).toBeLessThanOrEqual(0.1);
        expect(fill.left).toBeGreaterThanOrEqual(bounds.left);
        expect(fill.right).toBeLessThanOrEqual(bounds.right);
        return fill;
    });

    // Skip the separate title and check both joins between the three body lines.
    for (let index = 2; index < ink.length; index += 1) {
        expect(ink[index].top - ink[index - 1].bottom).toBeGreaterThan(1);
    }
}

function assertState(host: HTMLElement, loading: boolean): HTMLElement[] {
    const card = required<HTMLElement>(host, selectors.card);
    const button = required<HTMLButtonElement>(host, selectors.button);
    const status = required<HTMLElement>(host, selectors.status);
    expect(card.getAttribute('aria-busy')).toBe(loading ? 'true' : null);
    expect(button.textContent).toBe(loading ? '完成加载' : '重新加载');
    expect(button.disabled).toBe(false);
    expect(status.textContent).toBe(loading ? '正在加载卡片内容。' : '卡片内容已加载。');
    expect(card.contains(status)).toBe(false);

    const current = loading ? 'placeholder' : 'content';
    const previous = loading ? 'content' : 'placeholder';
    expect(card.querySelectorAll(`[data-card-loading-${current}="true"]`).length).toBe(6);
    expect(card.querySelectorAll(`[data-card-loading-${previous}]`).length).toBe(0);
    const regions = [required<HTMLElement>(host, selectors.cover), ...slots.map(slot => required<HTMLElement>(host, `[data-card-loading-slot="${slot}"]`))];
    const nodes = regions.map(region => required<HTMLElement>(region, `[data-card-loading-${current}="true"]`));
    for (const node of nodes) {
        const bounds = node.getBoundingClientRect();
        expect(bounds.width).toBeGreaterThan(0);
        expect(bounds.height).toBeGreaterThan(0);
        if (loading) {
            expect(node.tagName).toBe('SPAN');
            expect(node.getAttribute('aria-hidden')).toBe('true');
            expect(getComputedStyle(node).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
        }
    }
    const mappedFill = getComputedStyle(card).getPropertyValue(skeletonVars['root.background-color']).trim();
    if (loading) {
        expect(mappedFill.length).toBeGreaterThan(0);
        expect(card.textContent).toBe('');
        assertTextPlaceholderSpacing(host);
    } else {
        // The Card's loading-only Skeleton variable mapping must leave with the
        // placeholders; compare inherited context instead of hardcoding a color.
        expect(mappedFill).toBe(getComputedStyle(host).getPropertyValue(skeletonVars['root.background-color']).trim());
        expect(required<HTMLElement>(host, '[data-card-loading-slot="avatar"]').textContent).toBe('禾');
        expect(required<HTMLElement>(host, '[data-card-loading-slot="title"]').textContent).toBe('内容加载完成');
        const lines = ['骨架与封面对应。', '标题与头像对齐。', '三行正文保持位置。'];
        for (const [index, text] of lines.entries()) {
            const line = required<HTMLElement>(host, `[data-card-loading-slot="description-${index + 1}"]`);
            expect(line.textContent).toBe(text);
            const style = getComputedStyle(line);
            expect(style.whiteSpace).toBe('nowrap');
            expect(style.textOverflow).toBe('ellipsis');
            expect(style.overflowX).toBe('hidden');
        }
    }
    return nodes;
}

describe('actual loading demo geometry with published components and extracted CSS', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`keeps every loading/content slot fixed over two cycles (${designSystem}/${colorMode})`, async () => {
                expect(window.innerWidth).toBe(1280);
                expect(window.innerHeight).toBe(720);
                expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
                const view = await render(<>
                    <style>{compiledCss}</style>
                    <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, padding: 24 }}>
                            {[320, 216].map(width => <div key={width} data-demo-container={width} style={{ width, flex: '0 0 auto' }}>
                                <LoadingDemo />
                            </div>)}
                        </div>
                    </ConfigProvider>
                </>);
                try {
                    await settle();
                    for (const width of [320, 216]) {
                        const host = required<HTMLElement>(view.container, `[data-demo-container="${width}"]`);
                        let previousNodes = assertState(host, true);
                        const baseline = geometry(host);
                        expect(Math.abs(baseline.stack.width - width)).toBeLessThanOrEqual(0.01);
                        expect(baseline.stack.left).toBeGreaterThanOrEqual(0);
                        expect(baseline.stack.right).toBeLessThanOrEqual(window.innerWidth);
                        expect(baseline.stack.top).toBeGreaterThanOrEqual(0);
                        expect(baseline.stack.bottom).toBeLessThanOrEqual(window.innerHeight);
                        for (let cycle = 0; cycle < 2; cycle += 1) {
                            for (const loading of [false, true]) {
                                await fireEvent.click(required<HTMLButtonElement>(host, selectors.button));
                                await settle();
                                for (const previous of previousNodes) expect(previous.isConnected).toBe(false);
                                previousNodes = assertState(host, loading);
                                expectSameGeometry(baseline, geometry(host));
                            }
                        }
                    }
                } finally {
                    await view.unmount();
                }
            });
        }
    }
});
