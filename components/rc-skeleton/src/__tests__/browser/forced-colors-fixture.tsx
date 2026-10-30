import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
import type { CSSProperties } from 'react';
import Skeleton, { TokenVars } from '../../../esm/index.mjs';
import { matchingPixels, screenshotPixels } from '../../../../../test/forced-color-pixels.mjs';

const params = new URLSearchParams(location.search);
const designSystem = params.get('designSystem') as 'md3' | 'apple' | 'shadcn';
const colorMode = params.get('colorMode') as 'light' | 'dark';
if (!['md3', 'apple', 'shadcn'].includes(designSystem) || !['light', 'dark'].includes(colorMode)) throw Error('Invalid Skeleton fixture configuration');
const host = document.getElementById('root');
if (!host) throw Error('Missing Skeleton fixture host');
const root = createRoot(host);
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
function check(condition: unknown, message: string): asserts condition { if (!condition) throw Error(message); }
function scene() {
    return <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 240px)', gap: 48, padding: 48 }}>
            {(['pulse', 'wave', 'static'] as const).map(mode => <section key={mode} data-mode={mode}
                style={{ display: 'grid', gap: 24, width: 240, [TokenVars['root.background-color']]: 'rgb(13, 47, 91)' } as CSSProperties}>
                <Skeleton data-shape="text" rows={3} active={mode !== 'static'} animation={mode === 'wave' ? 'wave' : 'pulse'} />
                <Skeleton data-shape="circle" variant="circle" width={48} active={mode !== 'static'} animation={mode === 'wave' ? 'wave' : 'pulse'} />
                <Skeleton data-shape="rect" variant="rect" width={120} height={48} active={mode !== 'static'} animation={mode === 'wave' ? 'wave' : 'pulse'} />
            </section>)}
        </div>
    </ConfigProvider>;
}
function subjects() {
    return Array.from(document.querySelectorAll<HTMLElement>('[data-mode]')).flatMap(section =>
        Array.from(section.querySelectorAll<HTMLElement>('[data-shape]')).flatMap(shape => {
            const nodes = shape.dataset.shape === 'text' ? Array.from(shape.querySelectorAll<HTMLElement>('span[aria-hidden="true"]')) : [shape];
            return nodes.map((element, index) => ({ id: `${section.dataset.mode}-${shape.dataset.shape}-${index}`, element, shape: shape.dataset.shape!, index }));
        }));
}
function snapshot() {
    return { href: location.href, config: { designSystem, colorMode }, forcedColors: matchMedia('(forced-colors: active)').matches,
        viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight, dpr: globalThis.devicePixelRatio },
        subjects: subjects().map(({ id, element, shape, index }) => {
            const style = getComputedStyle(element);
            return { id, shape, index, rect: element.getBoundingClientRect().toJSON(), background: style.backgroundColor,
                outline: style.outlineColor, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth,
                outlineOffset: style.outlineOffset, opacity: style.opacity, forcedColorAdjust: style.forcedColorAdjust,
                backgroundImage: style.backgroundImage, animations: element.getAnimations().length,
                borderWidth: style.borderWidth };
        }) };
}
async function prepare() {
    check(matchMedia('(forced-colors: active)').matches, 'Actual forced-colors media is required');
    flushSync(() => root.render(scene()));
    await frame(); await frame();
    const result = snapshot();
    check(result.subjects.length === 15, 'All pulse/wave/static text rows, circles and rectangles must exist');
    for (const item of result.subjects) {
        const expectedWidth = item.shape === 'circle' ? 48 : item.shape === 'rect' ? 120 : item.index === 2 ? 156 : 240;
        const expectedHeight = item.shape === 'text' ? 16 : 48;
        check(Math.abs(item.rect.width - expectedWidth) < 0.5 && Math.abs(item.rect.height - expectedHeight) < 0.5, `Outline changed geometry: ${item.id}`);
        check(item.outlineStyle === 'solid' && item.outlineWidth === '1px' && item.outlineOffset === '-1px' && item.borderWidth === '0px', `Missing inset-only outline: ${item.id}`);
        check(item.outline !== item.background && item.backgroundImage === 'none', `Invisible system outline: ${item.id}`);
        check(item.opacity === '1' && item.animations === 0 && item.forcedColorAdjust === 'auto', `Unexpected decorative motion or palette opt-out: ${item.id}`);
    }
    return result;
}
async function inspectPixels(base64: string) {
    const image = await screenshotPixels(base64);
    return snapshot().subjects.map(item => {
        const background = matchingPixels(image, item.rect, item.background);
        // A one-pixel curved outline is antialiased by Linux Chromium; allow
        // near-solid outline pixels while still requiring every quadrant.
        const outline = matchingPixels(image, item.rect, item.outline, 32);
        check(background.ratio > 0.5 && outline.matched > 4, `Actual screenshot lost the placeholder: ${item.id}`);
        // Inspect all four quadrants, including the curved circle outline. A
        // nearby label or a single stray border cannot satisfy this check.
        const quadrants = [0, 1, 2, 3].map(index => {
            const rect = { x: item.rect.x + (index % 2) * item.rect.width / 2,
                y: item.rect.y + Math.floor(index / 2) * item.rect.height / 2,
                width: item.rect.width / 2, height: item.rect.height / 2 };
            const pixels = matchingPixels(image, rect, item.outline, 32);
            check(pixels.matched > 0, `Incomplete actual outline quadrant ${index}: ${item.id}`);
            return pixels;
        });
        return { id: item.id, background, outline, quadrants };
    });
}
Object.assign(window, { __skeletonForced: { prepare, snapshot, inspectPixels } });
