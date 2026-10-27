import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import type { CSSProperties } from 'react';
import Skeleton, { TokenVars } from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

const settle = () => act(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});

describe('published circular Skeleton geometry', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        it(`uses one axis to size a circle and preserves two explicit axes (${designSystem})`, async () => {
            const cases = [
                { id: 'width', width: 56, expected: [56, 56] },
                { id: 'height', height: 56, expected: [56, 56] },
                { id: 'percent-width', width: '50%', expected: [100, 100] },
                { id: 'percent-height', height: '25%', expected: [50, 50] },
                { id: 'both', width: 56, height: 32, expected: [56, 32] },
            ];
            const view = await render(<>
                <style>{compiledCss}</style>
                <ConfigProvider designSystem={designSystem}>
                    {(['circle', 'avatar'] as const).flatMap(variant => cases.map(item =>
                        <div key={`${variant}-${item.id}`} style={{ width: 200, height: 200 }}>
                            <Skeleton variant={variant} active={false} width={item.width} height={item.height}
                                data-testid={`${variant}-${item.id}`} />
                        </div>))}
                </ConfigProvider>
            </>);
            await settle();
            for (const variant of ['circle', 'avatar']) for (const item of cases) {
                const node = view.container.querySelector<HTMLElement>(`[data-testid="${variant}-${item.id}"]`);
                if (!node) throw new Error('Missing real Skeleton fixture');
                const rect = node.getBoundingClientRect();
                expect(rect.width).toBeCloseTo(item.expected[0]!, 1);
                expect(rect.height).toBeCloseTo(item.expected[1]!, 1);
                expect(getComputedStyle(node).borderRadius).not.toBe('0px');
            }
        });
    }
});

describe('ordinary Skeleton scoped fill stays independent of forced-color adaptation', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`retains caller fill and removes the placeholder when content loads (${designSystem}/${colorMode})`, async () => {
                expect(matchMedia('(forced-colors: none)').matches).toBe(true);
                const fixture = (loading: boolean) => <>
                    <style>{compiledCss}</style>
                    <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                        <div style={{ [TokenVars['root.background-color']]: 'rgb(13, 47, 91)' } as CSSProperties}>
                            <Skeleton variant="rect" active={false} width={120} height={48} loading={loading} data-scoped>
                                <span data-loaded>Loaded content</span>
                            </Skeleton>
                        </div>
                    </ConfigProvider>
                </>;
                const view = await render(fixture(true));
                await settle();
                const node = view.container.querySelector<HTMLElement>('[data-scoped]');
                if (!node) throw Error('Missing published scoped Skeleton');
                expect(getComputedStyle(node).backgroundColor).toBe('rgb(13, 47, 91)');
                expect(getComputedStyle(node).outlineStyle).toBe('none');
                expect(node.getBoundingClientRect().width).toBe(120);
                expect(node.getBoundingClientRect().height).toBe(48);
                await view.rerender(fixture(false));
                expect(view.container.querySelector('[data-scoped]')).toBeNull();
                const loaded = view.container.querySelector<HTMLElement>('[data-loaded]');
                if (!loaded) throw Error('Missing real content');
                expect(getComputedStyle(loaded).outlineStyle).toBe('none');
                expect(loaded.getAttribute('aria-busy')).toBeNull();
            });
        }
    }
});
