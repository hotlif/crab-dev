import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import type { CSSProperties } from 'react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Skeleton, { TokenVars as skeletonVars } from '@crab-dev/rc-skeleton';
import Card, { TokenVars as cardVars } from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

const variants = [undefined, 'elevated', 'outlined', 'filled'] as const;
const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
const settle = () => act(async () => { await nextFrame(); await nextFrame(); });

function required<T extends Element>(scope: ParentNode, selector: string): T {
    const element = scope.querySelector<T>(selector);
    if (!element) throw new Error(`Missing rendered Card fixture: ${selector}`);
    return element;
}

describe('Card loading fill with published CSS', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`keeps four reduced-motion surfaces legible and removes local fill after loading (${designSystem}/${colorMode})`, async () => {
                // Wake 0.1.45 fixes its real browser profile to reduce. Natural
                // pulse is separately observed by the normal-motion fixture;
                // neither suite changes or mocks the animation implementation.
                expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
                const fixture = (loading: boolean, style?: CSSProperties, customLoading = false) => <>
                    <style>{compiledCss}</style>
                    <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 240px)', gap: 16, padding: 24 }}>
                            {variants.map(variant => <Card key={variant ?? 'default'} variant={variant}
                                data-card={variant ?? 'default'} loading={loading} style={style}
                                loadingContent={customLoading ? <>
                                    <Card.Cover data-custom-cover="">
                                        <Skeleton data-custom-placeholder="cover" variant="rect" active={false} width="100%" height={48} />
                                    </Card.Cover>
                                    <Card.Body data-custom-body="">
                                        <Skeleton data-custom-placeholder="body" variant="text" active={false} width={80} height={20} />
                                    </Card.Body>
                                </> : undefined}
                                cover={<div>Ready cover</div>} title="Ready title">
                                <Skeleton data-consumer variant="rect" active={false} width={120} height={24} />
                            </Card>)}
                            <Skeleton data-outside variant="rect" active={false} width={120} height={24} />
                            <span data-fill-reference style={{ backgroundColor: 'var(--token-semantic-color-fill-translucent)' }} />
                        </div>
                    </ConfigProvider>
                </>;
                const view = await render(fixture(true));
                await settle();
                const referenceFill = getComputedStyle(required<HTMLElement>(view.container, '[data-fill-reference]')).backgroundColor;
                const outside = required<HTMLElement>(view.container, '[data-outside]');
                const outsideFill = getComputedStyle(outside).backgroundColor;
                const roots = variants.map(variant => required<HTMLElement>(view.container, `[data-card="${variant ?? 'default'}"]`));
                const leaves = roots.flatMap(root => {
                    expect(root.getAttribute('aria-busy')).toBe('true');
                    const items = Array.from(root.querySelectorAll<HTMLElement>('span[aria-hidden="true"]'));
                    expect(items.length).toBe(5); // cover, title and three text rows
                    for (const item of items) {
                        expect(getComputedStyle(item).backgroundColor).toBe(referenceFill);
                        expect(getComputedStyle(item).backgroundColor).not.toBe(getComputedStyle(root).backgroundColor);
                        expect(getComputedStyle(item).backgroundImage).toBe('none');
                        expect(item.getBoundingClientRect().width).toBeGreaterThan(0);
                        expect(item.getBoundingClientRect().height).toBeGreaterThan(0);
                    }
                    return items;
                });
                for (const leaf of leaves) {
                    expect(leaf.getAnimations().length).toBe(0);
                    expect(Number(getComputedStyle(leaf).opacity)).toBe(1);
                }
                expect(getComputedStyle(outside).backgroundColor).toBe(outsideFill);

                // Public Card fill override applies to all internal skeletons.
                const cardOverride = { [cardVars['loading.background-color']]: 'rgb(13, 47, 91)' } as CSSProperties;
                await view.rerender(fixture(true, cardOverride));
                await settle();
                for (const root of roots) {
                    expect(getComputedStyle(required<HTMLElement>(root, 'span[aria-hidden="true"]')).backgroundColor).toBe('rgb(13, 47, 91)');
                }
                // An explicit root Skeleton variable remains the consumer's
                // higher-priority override, including when Card's token exists.
                const directOverride = { ...cardOverride, [skeletonVars['root.background-color']]: 'rgb(29, 83, 137)' } as CSSProperties;
                await view.rerender(fixture(true, directOverride));
                await settle();
                for (const root of roots) {
                    expect(getComputedStyle(required<HTMLElement>(root, 'span[aria-hidden="true"]')).backgroundColor).toBe('rgb(29, 83, 137)');
                }

                // Leave the Card token override present while loading ends:
                // it must no longer re-theme a consumer's real Skeleton child.
                await view.rerender(fixture(false, cardOverride));
                await settle();
                for (const root of roots) {
                    expect(root.getAttribute('aria-busy')).toBeNull();
                    expect(root.textContent).toContain('Ready title');
                    expect(root.textContent).toContain('Ready cover');
                    expect(getComputedStyle(required<HTMLElement>(root, '[data-consumer]')).backgroundColor).toBe(outsideFill);
                    expect(root.getAnimations({ subtree: true }).length).toBe(0);
                }
                expect(getComputedStyle(outside).backgroundColor).toBe(outsideFill);

                // A caller's complete loading layout inherits the same scoped
                // fill through real Card slots, without an implicit second Body.
                const readyBodyPadding = roots.map(root => {
                    const body = required<HTMLElement>(root, '[data-consumer]').parentElement;
                    if (!body) throw new Error('The ready Skeleton must have a real Card.Body parent.');
                    return getComputedStyle(body).paddingLeft;
                });
                await view.rerender(fixture(true, undefined, true));
                await settle();
                const customLeaves = roots.flatMap((root, index) => {
                    expect(root.getAttribute('aria-busy')).toBe('true');
                    expect(root.querySelector('[data-consumer]')).toBeNull();
                    const cover = required<HTMLElement>(root, '[data-custom-cover]');
                    const body = required<HTMLElement>(root, '[data-custom-body]');
                    expect(cover.parentElement).toBe(root);
                    expect(body.parentElement).toBe(root);
                    expect(root.children.length).toBe(2);
                    expect(getComputedStyle(body).paddingLeft).toBe(readyBodyPadding[index]);
                    expect(root.querySelectorAll('[data-custom-placeholder]').length).toBe(2);
                    // Text Skeleton's public marker belongs to its group;
                    // sample its painted span, not the transparent wrapper.
                    const items = Array.from(root.querySelectorAll<HTMLElement>('span[aria-hidden="true"]'));
                    expect(items.length).toBe(2);
                    for (const item of items) {
                        expect(getComputedStyle(item).backgroundColor).toBe(referenceFill);
                        expect(item.getBoundingClientRect().width).toBeGreaterThan(0);
                        expect(item.getBoundingClientRect().height).toBeGreaterThan(0);
                        expect(item.getAnimations().length).toBe(0);
                    }
                    return items;
                });
                expect(getComputedStyle(outside).backgroundColor).toBe(outsideFill);

                await view.rerender(fixture(true, cardOverride, true));
                await settle();
                for (const item of customLeaves) {
                    expect(item.isConnected).toBe(true);
                    expect(getComputedStyle(item).backgroundColor).toBe('rgb(13, 47, 91)');
                }
                expect(getComputedStyle(outside).backgroundColor).toBe(outsideFill);

                await view.rerender(fixture(true, directOverride, true));
                await settle();
                for (const item of customLeaves) {
                    expect(getComputedStyle(item).backgroundColor).toBe('rgb(29, 83, 137)');
                }

                // Keep the caller's Skeleton override when ready, but unmount
                // the complete loading subtree. Only Card's mapping is scoped.
                await view.rerender(fixture(false, directOverride, true));
                await settle();
                for (const item of customLeaves) expect(item.isConnected).toBe(false);
                for (const root of roots) {
                    expect(root.getAttribute('aria-busy')).toBeNull();
                    expect(root.querySelector('[data-custom-cover]')).toBeNull();
                    expect(root.querySelector('[data-custom-body]')).toBeNull();
                    expect(root.textContent).toContain('Ready title');
                    expect(root.textContent).toContain('Ready cover');
                    expect(getComputedStyle(required<HTMLElement>(root, '[data-consumer]')).backgroundColor).toBe('rgb(29, 83, 137)');
                }
                expect(getComputedStyle(outside).backgroundColor).toBe(outsideFill);

                // Leaving only the Card token cannot recolor the real consumer
                // Skeleton or the sibling after the custom loading slot exits.
                await view.rerender(fixture(false, cardOverride, true));
                await settle();
                for (const root of roots) {
                    expect(getComputedStyle(required<HTMLElement>(root, '[data-consumer]')).backgroundColor).toBe(outsideFill);
                    expect(root.querySelector('[data-custom-placeholder]')).toBeNull();
                }
                expect(getComputedStyle(outside).backgroundColor).toBe(outsideFill);
            });
        }
    }
});
