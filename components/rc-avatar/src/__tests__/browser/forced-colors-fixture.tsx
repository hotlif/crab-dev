import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Badge from '@crab-dev/rc-badge';
import Avatar, { AvatarGroup } from '../../../esm/index.mjs';
import { screenshotPixels } from '../../../../../test/forced-color-pixels.mjs';

const search = new URLSearchParams(location.search);
const designSystem = search.get('designSystem') as 'md3' | 'apple' | 'shadcn';
const colorMode = search.get('colorMode') as 'light' | 'dark';
if (!['md3', 'apple', 'shadcn'].includes(designSystem) || !['light', 'dark'].includes(colorMode)) throw Error('Invalid forced-colors fixture configuration');
const host = document.getElementById('root');
if (!host) throw Error('Missing forced-colors fixture host');
const root = createRoot(host);
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
function check(condition: unknown, message: string): asserts condition { if (!condition) throw Error(message); }
function required(selector: string, scope: ParentNode = document): HTMLElement {
    const items = scope.querySelectorAll<HTMLElement>(selector);
    check(items.length === 1, `Expected one ${selector}; got ${items.length}`);
    return items[0]!;
}
function scene() {
    return <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
        <main style={{ padding: 48, width: 1180, boxSizing: 'border-box' }}>
            <span data-reference="highlight" style={{ color: 'HighlightText', backgroundColor: 'Highlight', forcedColorAdjust: 'none' }} />
            <span data-reference="canvas" style={{ color: 'CanvasText', backgroundColor: 'Canvas', forcedColorAdjust: 'none' }} />
            {(['ltr', 'rtl'] as const).map(direction => <section key={direction} dir={direction} style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 32, padding: 24 }}>
                    {([undefined, 'default', 'processing', 'success', 'warning', 'error', '#e34b12'] as const).map((color, index) =>
                        <Badge key={color ?? 'base'} data-paint={`count-${direction}-${index}`} count={120} color={color} />)}
                    <Badge data-paint={`nested-${direction}`} count={<bdi dir="ltr">+3</bdi>} />
                    <Badge data-paint={`dot-${direction}`} dot />
                    <Badge data-paint={`wrapped-${direction}`} count={120} indicatorStyle={{ color: 'white', backgroundColor: 'white' }}>
                        <span style={{ display: 'inline-block', width: 32, height: 32 }}>Z</span>
                    </Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 32, padding: 24 }}>
                    {(['primary', 'default', 'success', 'warning', 'error'] as const).map((variant, index) =>
                        <Avatar key={variant} data-avatar-paint={`${variant}-${direction}`} variant={variant}>{String.fromCharCode(65 + index)}</Avatar>)}
                    <div data-flow-case={`long-${direction}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
                        <AvatarGroup data-group-paint={`group-${direction}`} max={2} renderExtra={count => `还有 ${count} 位`}>
                            <Avatar data-avatar-paint={`primary-group-A-${direction}`} variant="primary">A</Avatar>
                            <Avatar data-counter-anchor data-avatar-paint={`primary-group-F-${direction}`} variant="primary">F</Avatar><Avatar>C</Avatar><Avatar>D</Avatar>
                        </AvatarGroup>
                        <AvatarGroup><Avatar data-neighbor-avatar>K</Avatar><Avatar>L</Avatar></AvatarGroup>
                    </div>
                </div>
                <div style={{ display: 'flex', padding: 24 }}>
                    <div data-flow-case={`small-${direction}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
                        <AvatarGroup data-group-paint={`small-${direction}`} size="small" shape="square" spacing={-6} max={3}>
                            <Avatar>SQ</Avatar><Avatar>AR</Avatar><Avatar data-counter-anchor>E1</Avatar><Avatar>E2</Avatar>
                        </AvatarGroup>
                        <AvatarGroup size="large" spacing={-14}><Avatar data-neighbor-avatar>K</Avatar><Avatar>L</Avatar><Avatar>M</Avatar></AvatarGroup>
                    </div>
                </div>
            </section>)}
        </main>
    </ConfigProvider>;
}
function subjects() {
    return [
        ...Array.from(document.querySelectorAll<HTMLElement>('[data-paint]')).map(wrapper => ({ id: wrapper.dataset.paint!, element: required('[role="status"]', wrapper), pair: 'highlight' })),
        ...Array.from(document.querySelectorAll<HTMLElement>('[data-avatar-paint]')).map(element => ({ id: element.dataset.avatarPaint!, element, pair: element.dataset.avatarPaint!.startsWith('primary') ? 'highlight' : 'canvas' })),
        ...Array.from(document.querySelectorAll<HTMLElement>('[data-group-paint]')).map(wrapper => ({ id: wrapper.dataset.groupPaint!, element: required('[role="status"]', wrapper), pair: 'highlight' })),
    ];
}
function glyphs(element: HTMLElement) {
    const walker = document.createTreeWalker(element, globalThis.NodeFilter.SHOW_TEXT);
    const result: { text: string; rect: ReturnType<DOMRect['toJSON']> }[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        for (let offset = 0; offset < (node.textContent?.length ?? 0); offset++) {
            const text = node.textContent![offset]!;
            if (!text.trim()) continue;
            const range = document.createRange();
            range.setStart(node, offset); range.setEnd(node, offset + 1);
            result.push({ text, rect: range.getBoundingClientRect().toJSON() });
        }
    }
    return result;
}
function snapshot() {
    return { href: location.href, config: { designSystem, colorMode },
        forcedColors: matchMedia('(forced-colors: active)').matches,
        viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight, dpr: globalThis.devicePixelRatio },
        groups: Array.from(document.querySelectorAll<HTMLElement>('[data-flow-case]')).map(row => {
            const group = row.children[0] as HTMLElement;
            const adjacent = row.children[1] as HTMLElement;
            const indicator = required('[role="status"]', group);
            const avatar = required('[data-counter-anchor]', group);
            const neighbor = required('[data-neighbor-avatar]', adjacent);
            const bounds = indicator.getBoundingClientRect(), groupBounds = group.getBoundingClientRect();
            const avatarBounds = avatar.getBoundingClientRect(), adjacentBounds = adjacent.getBoundingClientRect();
            const neighborBounds = neighbor.getBoundingClientRect(), direction = getComputedStyle(group).direction;
            check(bounds.left >= groupBounds.left - 0.5 && bounds.right <= groupBounds.right + 0.5, 'Counter is outside group inline bounds');
            check(Math.abs((direction === 'rtl' ? bounds.right - avatarBounds.left : bounds.left - avatarBounds.right)) <= 0.5, 'Counter must touch actual avatar logical end');
            check(Math.abs(bounds.top + bounds.height / 2 - avatarBounds.top) <= 0.5, 'Counter vertical anchor changed');
            check(Math.abs((direction === 'rtl' ? groupBounds.left - adjacentBounds.right : adjacentBounds.left - groupBounds.right) - 16) <= 0.5, 'Adjacent group gap changed');
            check(bounds.right <= neighborBounds.left || bounds.left >= neighborBounds.right, 'Counter intersects adjacent avatar');
            return { id: row.dataset.flowCase, direction, group: groupBounds.toJSON(), avatar: avatarBounds.toJSON(), counter: bounds.toJSON(), adjacent: adjacentBounds.toJSON(), neighbor: neighborBounds.toJSON() };
        }),
        subjects: subjects().map(({ id, element, pair }) => {
            const style = getComputedStyle(element);
            return { id, pair, text: element.textContent, rect: element.getBoundingClientRect().toJSON(),
                color: style.color, background: style.backgroundColor, forcedColorAdjust: style.forcedColorAdjust, glyphs: glyphs(element) };
        }) };
}
async function prepare() {
    check(matchMedia('(forced-colors: active)').matches, 'Actual forced-colors media is required');
    flushSync(() => root.render(scene()));
    await document.fonts.ready; await frame(); await frame();
    const actual = snapshot();
    check(actual.subjects.length === 38, 'Both directions must contain all 19 indicator/initial subjects');
    check(actual.groups.length === 4, 'Both directions must include long and small adjacent-group geometry');
    for (const item of actual.subjects) {
        const pair = getComputedStyle(required(`[data-reference="${item.pair}"]`));
        check(item.color === pair.color && item.background === pair.backgroundColor && item.color !== item.background, `System pair mismatch: ${item.id}`);
        check(item.forcedColorAdjust === 'none', `Unexpected automatic text backplate: ${item.id}`);
        check(item.rect.width > 0 && item.rect.height > 0 && item.rect.left >= 0 && item.rect.top >= 0 && item.rect.right <= globalThis.innerWidth && item.rect.bottom <= globalThis.innerHeight, `Incomplete subject: ${item.id}`);
        if (!item.id.startsWith('dot')) check(item.glyphs.length > 0, `Missing actual text range: ${item.id}`);
    }
    return actual;
}
async function inspectPixels(base64: string) {
    // Decode only the actual CDP screenshot, never repaint component text to
    // infer visibility. Each real DOM glyph range must contain foreground ink.
    const image = await screenshotPixels(base64);
    check(image.width === globalThis.innerWidth && image.height === globalThis.innerHeight && globalThis.devicePixelRatio === 1, 'Pixel measurement requires the captured 1x viewport');
    const pixels = image.data;
    const rgb = (value: string) => {
        const match = /^rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)/.exec(value);
        check(match, `Expected resolved system RGB: ${value}`);
        return [Number(match[1]), Number(match[2]), Number(match[3])];
    };
    const counts = (rect: DOMRect | ReturnType<DOMRect['toJSON']>, color: number[]) => {
        let matches = 0;
        for (let y = Math.max(0, Math.floor(rect.top)); y < Math.min(image.height, Math.ceil(rect.bottom)); y++) {
            for (let x = Math.max(0, Math.floor(rect.left)); x < Math.min(image.width, Math.ceil(rect.right)); x++) {
                const index = (y * image.width + x) * 4;
                if (color.every((channel, channelIndex) => Math.abs(channel - pixels[index + channelIndex]!) <= 48)) matches++;
            }
        }
        return matches;
    };
    return snapshot().subjects.map(item => {
        const backgroundPixels = counts(item.rect, rgb(item.background));
        check(backgroundPixels > 2, `Missing actual indicator background pixels: ${item.id}`);
        const characters = item.glyphs.map(glyph => {
            const foregroundPixels = counts(glyph.rect, rgb(item.color));
            const glyphBackgroundPixels = counts(glyph.rect, rgb(item.background));
            check(foregroundPixels > 1, `Actual screenshot hides glyph ${glyph.text}: ${item.id}`);
            // A solid HighlightText-colored backplate also contains foreground
            // pixels; require the indicator fill between the glyph strokes.
            check(glyphBackgroundPixels > 1, `Text backplate hides glyph shape ${glyph.text}: ${item.id}`);
            return { ...glyph, foregroundPixels, backgroundPixels: glyphBackgroundPixels };
        });
        return { id: item.id, backgroundPixels, characters };
    });
}
Object.assign(window, { __badgeForced: { prepare, snapshot, inspectPixels } });
