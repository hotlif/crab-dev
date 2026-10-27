import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import type { CSSProperties } from 'react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Skeleton, { TokenVars as skeletonVars } from '@crab-dev/rc-skeleton';
import Card, { TokenVars as cardVars } from '../../../esm/index.mjs';

const variants = [undefined, 'elevated', 'outlined', 'filled'] as const;
const search = new URLSearchParams(location.search);
const designSystem = search.get('designSystem') as 'md3' | 'apple' | 'shadcn';
const colorMode = search.get('colorMode') as 'light' | 'dark';
if (!['md3', 'apple', 'shadcn'].includes(designSystem) || !['light', 'dark'].includes(colorMode)) throw Error('Invalid natural-motion fixture configuration');
const host = document.getElementById('root');
if (!host) throw Error('Missing fixture host');
const root = createRoot(host);
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
function check(condition: unknown, message: string): asserts condition { if (!condition) throw Error(message); }
function required(selector: string, scope: ParentNode = document): HTMLElement {
    const nodes = scope.querySelectorAll<HTMLElement>(selector);
    if (nodes.length !== 1) throw Error(`Expected one fixture node: ${selector}; actual ${nodes.length}`);
    return nodes[0]!;
}
const cards = () => Array.from(document.querySelectorAll<HTMLElement>('[data-card]'));
const leaves = () => cards().flatMap(card => Array.from(card.querySelectorAll<HTMLElement>('span[aria-hidden="true"]')));
function scene(loading: boolean, style?: CSSProperties) {
    return <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 240px)', gap: 16, padding: 24 }}>
            {variants.map(variant => <Card key={variant ?? 'default'} variant={variant}
                data-card={variant ?? 'default'} loading={loading} style={style}
                cover={<div>Ready cover</div>} title="Ready title">
                <Skeleton data-consumer variant="rect" active={false} width={120} height={24} />
            </Card>)}
            <Skeleton data-outside variant="rect" active={false} width={120} height={24} />
            <span data-fill-reference style={{ backgroundColor: 'var(--token-semantic-color-fill-translucent)' }} />
        </div>
    </ConfigProvider>;
}
async function render(loading: boolean, style?: CSSProperties) {
    // Ordinary React application commit; no Wake test/act/fireEvent bridge.
    flushSync(() => root.render(scene(loading, style)));
    await frame(); await frame();
}
const fill = (element: Element) => getComputedStyle(element).backgroundColor;
function snapshot() {
    return { href: location.href, config: { designSystem, colorMode },
        normalMotion: matchMedia('(prefers-reduced-motion: no-preference)').matches,
        viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight, dpr: globalThis.devicePixelRatio },
        referenceFill: fill(required('[data-fill-reference]')), outsideFill: fill(required('[data-outside]')),
        cards: cards().map(card => ({ variant: card.dataset.card, busy: card.getAttribute('aria-busy'),
            rect: card.getBoundingClientRect().toJSON(), background: fill(card),
            leaves: Array.from(card.querySelectorAll<HTMLElement>('span[aria-hidden="true"]')).map(leaf => ({
                rect: leaf.getBoundingClientRect().toJSON(), background: fill(leaf), opacity: Number(getComputedStyle(leaf).opacity),
                animations: leaf.getAnimations().map(animation => ({ cssAnimation: animation instanceof globalThis.CSSAnimation,
                    name: animation instanceof globalThis.CSSAnimation ? animation.animationName : null,
                    playState: animation.playState, pending: animation.pending, currentTime: Number(animation.currentTime),
                    duration: Number(animation.effect?.getTiming().duration), iterations: String(animation.effect?.getComputedTiming().iterations) })) })) })) };
}
async function prepare() {
    check(matchMedia('(prefers-reduced-motion: no-preference)').matches, 'Normal-motion environment is required');
    await render(true);
    const reference = fill(required('[data-fill-reference]'));
    check(cards().length === 4, 'Four actual Card variants required');
    for (const card of cards()) {
        check(card.getAttribute('aria-busy') === 'true', 'Loading Card must be busy');
        const items = card.querySelectorAll('span[aria-hidden="true"]');
        check(items.length === 5, 'Cover, title and three text skeletons required');
        for (const item of items) {
            check(fill(item) === reference && fill(item) !== fill(card), 'Card loading fill must map to the visible semantic translucent fill');
            check(getComputedStyle(item).backgroundImage === 'none', 'Do not replace the actual pulse');
            const rect = item.getBoundingClientRect();
            check(rect.width > 0 && rect.height > 0 && rect.left >= 0 && rect.top >= 0 && rect.right <= globalThis.innerWidth && rect.bottom <= globalThis.innerHeight, 'Whole skeleton must fit actual viewport');
        }
    }
    return snapshot();
}
async function observe() {
    const items = leaves();
    const animations = items.map(item => {
        const actual = item.getAnimations();
        check(actual.length === 1 && actual[0] instanceof globalThis.CSSAnimation, 'One actual CSSAnimation per skeleton required');
        check(actual[0].effect?.getComputedTiming().iterations === Infinity, 'Observe original infinite pulse');
        return actual[0];
    });
    const duration = Math.max(...animations.map(animation => Number(animation.effect?.getTiming().duration)));
    check(Number.isFinite(duration) && duration > 0 && duration <= 2500, 'Finite positive pulse duration required');
    const ranges = items.map((_, index) => ({ min: Infinity, max: -Infinity, samples: 0, startTime: Number(animations[index]!.currentTime), sameObject: true }));
    const started = performance.now(), reference = fill(required('[data-fill-reference]'));
    do {
        await frame();
        for (const [index, item] of items.entries()) {
            const range = ranges[index]!, opacity = Number(getComputedStyle(item).opacity);
            range.min = Math.min(range.min, opacity); range.max = Math.max(range.max, opacity); range.samples += 1;
            range.sameObject &&= item.getAnimations()[0] === animations[index];
            check(fill(item) === reference, 'Fill changed during natural animation');
        }
    } while (performance.now() - started < duration + 100);
    const actual = ranges.map((range, index) => ({ ...range, endTime: Number(animations[index]!.currentTime), playState: animations[index]!.playState }));
    for (const range of actual) check(range.sameObject && range.samples > 10 && range.min >= 0.49 && range.min < 0.6 && range.max > 0.9 && range.max <= 1 && range.endTime > range.startTime && range.playState === 'running', 'Natural full-cycle pulse evidence failed');
    return { duration, elapsedMs: performance.now() - started, actual, snapshot: snapshot() };
}
async function overrides() {
    const outside = fill(required('[data-outside]'));
    const cardOverride = { [cardVars['loading.background-color']]: 'rgb(13, 47, 91)' } as CSSProperties;
    await render(true, cardOverride);
    check(leaves().every(item => fill(item) === 'rgb(13, 47, 91)'), 'Public Card fill override failed');
    const cardToken = snapshot();
    await render(true, { ...cardOverride, [skeletonVars['root.background-color']]: 'rgb(29, 83, 137)' } as CSSProperties);
    check(leaves().every(item => fill(item) === 'rgb(29, 83, 137)'), 'Explicit public Skeleton variable priority failed');
    const skeletonToken = snapshot();
    await render(false, cardOverride);
    for (const card of cards()) {
        check(card.getAttribute('aria-busy') === null && card.textContent?.includes('Ready cover') && card.textContent.includes('Ready title'), 'Real content not restored');
        check(fill(required('[data-consumer]', card)) === outside, 'Loading-only variable leaked to real consumer Skeleton');
        check(card.getAnimations({ subtree: true }).length === 0, 'Loading animation leaked after loading=false');
    }
    check(fill(required('[data-outside]')) === outside, 'Sibling Skeleton changed');
    return { cardToken, skeletonToken, unloaded: snapshot() };
}
declare global { interface Window { __cardNatural: { prepare: typeof prepare; observe: typeof observe; overrides: typeof overrides; snapshot: typeof snapshot } } }
window.__cardNatural = { prepare, observe, overrides, snapshot };
