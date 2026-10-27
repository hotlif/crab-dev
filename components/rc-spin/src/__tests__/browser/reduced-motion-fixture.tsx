import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
import { SpinIndicator, ExpressiveSpinIndicator } from '@crab-dev/rc-spin';
import token from '@crab-dev/rc-token-semantic';
import { screenshotPixels, colorChannels } from '../../../../../test/forced-color-pixels.mjs';

const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
function check(value: unknown, message: string): asserts value {
    if (!value) throw new Error(message);
}
// Exact Wake0.1.45 Docs host policy that previously suppressed essential progress.
// This fixture deliberately reproduces the host, never changes product animation.
const hostReset = `@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important;
        animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}`;
const ordinaryAnimation = `@keyframes ordinary-decoration { to { transform: translateX(24px); } }
    [data-ordinary-decoration] { width:20px;height:20px;background:currentColor;animation:ordinary-decoration 2s linear infinite; }`;
const params = new URLSearchParams(location.search);
const designSystem = params.get('designSystem') as 'md3' | 'apple' | 'shadcn';
const colorMode = params.get('colorMode') as 'light' | 'dark';
check(['md3', 'apple', 'shadcn'].includes(designSystem) && ['light', 'dark'].includes(colorMode), 'Invalid configuration');
const host = document.getElementById('root');
check(host, 'Missing host');
const root = createRoot(host);
function required(selector: string) {
    const found = host!.querySelectorAll<HTMLElement | SVGSVGElement>(selector);
    check(found.length === 1, `Expected one ${selector}`);
    return found[0]!;
}
function subjects() {
    return [{ id: 'circular', element: required('svg') }, { id: 'expressive', element: required('[data-indicator="expressive"]') }];
}
function styleFor(id: string, element: Element) {
    return getComputedStyle(element, id === 'expressive' ? '::before' : null);
}
function nativeAnimation(element: Element) {
    const all = element.getAnimations({ subtree: true });
    check(all.length === 1 && all[0] instanceof window.CSSAnimation, 'Expected exactly one actual native breathe animation');
    return all[0] as CSSAnimation;
}
function ordinaryState() {
    const element = required('[data-ordinary-decoration]'), style = getComputedStyle(element);
    return { duration: style.animationDuration, iterations: style.animationIterationCount,
        running: element.getAnimations().filter(a => a.playState === 'running' || a.pending).length };
}
function snapshot() {
    const rows = subjects().map(({ id, element }) => {
        const animation = nativeAnimation(element), timing = animation.effect!.getTiming(), style = styleFor(id, element);
        return { id, rect: element.getBoundingClientRect().toJSON(), name: animation.animationName,
            duration: timing.duration, iterations: timing.iterations, playState: animation.playState,
            opacity: style.opacity, transform: style.transform, nativeCurrentTime: animation.currentTime };
    });
    return { href: location.href, forcedColors: matchMedia('(forced-colors: active)').matches,
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        viewport: { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio },
        subjects: rows, stability: { subjects: rows.map(({ id, rect, name, duration, iterations, playState }) => ({ id, rect, name, duration, iterations, playState })),
            ordinary: ordinaryState(), active: document.activeElement?.tagName, scroll: [window.scrollX, window.scrollY, document.documentElement.scrollWidth] } };
}
let cycleEvidence: unknown;
async function prepare() {
    check(matchMedia('(prefers-reduced-motion: reduce)').matches && !matchMedia('(forced-colors: active)').matches, 'Actual reduced ordinary-color media required');
    flushSync(() => root.render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
        <style>{hostReset + ordinaryAnimation}</style>
        <main style={{ padding: 64, minHeight: 580, background: token.color.surface.content, color: token.color.text.primary }}>
            <div style={{ display: 'flex', gap: 96, alignItems: 'center' }}><SpinIndicator /><ExpressiveSpinIndicator /></div>
            <div data-ordinary-decoration style={{ marginTop: 80 }} />
        </main>
    </ConfigProvider>));
    await document.fonts.ready;
    await frame(); await frame();
    const readyAt = performance.now();
    while (ordinaryState().running !== 0 || subjects().some(({ element }) => {
        const animation = nativeAnimation(element);
        return animation.pending || animation.playState !== 'running';
    })) {
        check(performance.now() - readyAt < 1000, 'Host-reset decoration must finish and native progress must start before observation');
        await frame();
    }
    const initial = snapshot(), geometry = JSON.stringify(initial.stability), elements = subjects();
    const actual = elements.map(({ id, element }) => {
        const animation = nativeAnimation(element), effect = animation.effect;
        check(effect instanceof window.KeyframeEffect, 'Expected a native keyframe effect');
        const timing = effect.getTiming(), frames = effect.getKeyframes();
        check(timing.duration === 1600 && timing.iterations === Infinity, `${id} must retain actual L3 breathe1.6s/infinite under host reset`);
        check(animation.animationName.includes('breathe') && !/rotate|orbit|morph/.test(animation.animationName), 'Reduced animation must be breathe only');
        check(frames.some(f => f.opacity !== undefined), 'Actual keyframes must include breathing opacity');
        check(frames.every(f => !f.transform || f.transform === 'none' || id === 'expressive' && /^scale\((0\.8|1)\)$/.test(String(f.transform))), 'Reduced keyframes must not rotate/orbit/morph');
        return { id, element, animation, startedAt: Number(animation.currentTime), opacities: new Set<string>(), frames };
    });
    const start = performance.now(); let count = 0;
    while (performance.now() - start < 4500) {
        await frame(); count++;
        const current = snapshot().stability;
        check(JSON.stringify(current) === geometry, `Natural breathing must preserve outer layout, focus and ordinary-decoration suppression: ${JSON.stringify({ initial: initial.stability, current })}`);
        for (const item of actual) {
            check(nativeAnimation(item.element) === item.animation && item.animation.playState === 'running' && !item.animation.pending, 'Same native animation must keep running');
            const style = styleFor(item.id, item.element), matrix = new window.DOMMatrixReadOnly(style.transform);
            check(matrix.b === 0 && matrix.c === 0 && matrix.e === 0 && matrix.f === 0 && Math.abs(matrix.a - matrix.d) < 0.00001, 'No spatial rotation or orbit allowed');
            check(item.id === 'expressive' ? matrix.a >= 0.799 && matrix.a <= 1.001 : style.transform === 'none', 'Only existing expressive0.8..1 breathing scale is allowed');
            item.opacities.add(style.opacity);
        }
        if (performance.now() - start >= 1600 && actual.every(a => Number(a.animation.currentTime) - a.startedAt >= 1600)) break;
    }
    check(count >= 12 && performance.now() - start >= 1600, 'Need a real naturally sampled native cycle');
    check(actual.every(a => Number(a.animation.currentTime) - a.startedAt >= 1600 && a.opacities.size >= 8), 'Both actual breathe cycles must advance and change opacity');
    const ordinary = ordinaryState();
    check(Number.parseFloat(ordinary.duration) <= 0.00001 && ordinary.iterations === '1' && ordinary.running === 0, 'Ordinary decoration must remain suppressed by exact host reset');
    cycleEvidence = { frames: count, elapsed: performance.now() - start, subjects: actual.map(a => ({ id: a.id, delta: Number(a.animation.currentTime) - a.startedAt, opacityCount: a.opacities.size, keyframes: a.frames })), ordinary };
    return snapshot();
}
async function inspectPixels(base64: string) {
    const pixels = await screenshotPixels(base64), current = snapshot();
    const background = colorChannels(getComputedStyle(required('main')).backgroundColor);
    check(background[3] === 255, 'Ink comparison requires the actual opaque semantic surface');
    const ink = current.subjects.map(subject => {
        let count = 0;
        const r = subject.rect;
        for (let y = Math.ceil(r.top); y < Math.floor(r.bottom); y++) for (let x = Math.ceil(r.left); x < Math.floor(r.right); x++) {
            const offset = (y * pixels.width + x) * 4;
            if ([0, 1, 2].some(c => Math.abs(pixels.data[offset + c]! - background[c]!) > 2)) count++;
        }
        check(count > 8, `${subject.id} actual reduced-progress PNG must contain visible ink`);
        return { id: subject.id, count, rect: r };
    });
    return { ink, cycleEvidence, scope: 'Actual published CSS, exact host reset, native reduced cycles and screenshot ink; no animation cancellation, seek, completion or product-style injection.' };
}
Object.assign(window, { __spinReducedMotion: { prepare, snapshot, inspectPixels } });
