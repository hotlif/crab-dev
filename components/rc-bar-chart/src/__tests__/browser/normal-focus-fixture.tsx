import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
import BarChart from '../../../esm/index.mjs';
import { colorChannels, matchingPixels, screenshotPixels } from '../../../../../test/forced-color-pixels.mjs';
import { inspectFocusBand } from '../../../scripts/focus-pixels.mjs';

type Subject = 'bar' | 'legend' | 'hidden-legend';
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
const focusOptions = { preventScroll: true, focusVisible: true };
function check(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

/** Real published HTML/CSS focus paint; no forced pseudo-state or animation override. */
export function installNormalFocusFixture(subject: Subject): void {
    const params = new URLSearchParams(location.search);
    const designSystem = params.get('designSystem') as 'md3' | 'apple' | 'shadcn';
    const colorMode = params.get('colorMode') as 'light' | 'dark';
    check(['md3', 'apple', 'shadcn'].includes(designSystem) && ['light', 'dark'].includes(colorMode), 'Invalid normal focus configuration');
    const host = document.getElementById('root');
    check(host, 'Missing normal focus host');
    const root = createRoot(host);
    let callbacks = 0;
    function required(selector: string): HTMLElement {
        const nodes = host!.querySelectorAll<HTMLElement>(selector);
        check(nodes.length === 1, `Expected one ${selector}, found ${nodes.length}`);
        return nodes[0]!;
    }
    function target(): HTMLElement {
        return required(subject === 'bar' ? 'button[aria-label="East Online 820"]' : '[role="group"][aria-label="Legend"] button:first-child');
    }
    function chartGeometry() {
        return Array.from(host!.querySelectorAll<HTMLElement>('[data-chart-root], canvas, [role="group"] button'), element => ({
            tag: element.tagName, ariaLabel: element.getAttribute('aria-label'),
            rect: element.getBoundingClientRect().toJSON(),
        }));
    }
    function snapshot() {
        const element = target(), style = getComputedStyle(element);
        const legends = host!.querySelectorAll<HTMLElement>('[role="group"][aria-label="Legend"] button');
        const bars = host!.querySelectorAll('[role="group"][aria-label="Focus regression"] button');
        const current = {
            id: subject, rect: element.getBoundingClientRect().toJSON(),
            text: element.textContent, ariaLabel: element.getAttribute('aria-label'),
            focused: document.activeElement === element, focusVisible: element.matches(':focus-visible'),
            outlineStyle: style.outlineStyle, outlineWidth: Number.parseFloat(style.outlineWidth),
            outlineOffset: Number.parseFloat(style.outlineOffset), outlineColor: style.outlineColor,
            opacity: Number.parseFloat(style.opacity), textDecoration: style.textDecorationLine,
            boxShadow: style.boxShadow, pressed: element.getAttribute('aria-pressed'),
            surfaceColor: getComputedStyle(required('main')).backgroundColor,
        };
        return {
            href: location.href, forcedColors: matchMedia('(forced-colors: active)').matches,
            reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
            viewport: { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio },
            focusMethod: 'Native DOM focus with focusVisible request; actual activeElement and :focus-visible. Not trusted keyboard input.',
            callbacks, barCount: bars.length, legendPressed: Array.from(legends, item => item.getAttribute('aria-pressed')),
            subjects: [current],
            stability: { chartGeometry: chartGeometry(), callbacks, barCount: bars.length,
                legendPressed: Array.from(legends, item => item.getAttribute('aria-pressed')), focus: current },
        };
    }
    function assertState(result: ReturnType<typeof snapshot>) {
        const item = result.subjects[0]!;
        check(!result.forcedColors && !result.reducedMotion, 'Normal colors and actual normal motion preference required');
        check(item.focused && item.focusVisible, 'Target must retain actual focus-visible');
        check(item.outlineStyle === 'solid' && item.outlineWidth === 2 && item.outlineOffset === 0, 'Published CSS must paint a2px solid outline without changing geometry');
        check(item.opacity === 1 && colorChannels(item.outlineColor)[3] === 255, 'Focused target and semantic outline must be opaque');
        check(result.callbacks === 0, 'Focusing must not activate a bar');
        check(result.barCount === (subject === 'hidden-legend' ? 2 : 4), 'Focusing must not change visible series');
        check(JSON.stringify(result.legendPressed) === JSON.stringify(subject === 'hidden-legend' ? ['false', 'true'] : ['true', 'true']), 'Focusing must preserve series toggles');
        if (subject === 'hidden-legend') check(item.pressed === 'false' && item.textDecoration.includes('line-through'), 'Hidden focused legend must retain its non-color hidden-state indication');
    }
    async function waitForEntry() {
        const started = performance.now();
        // Natural frames only. This bounds focus-test preparation, not a claim
        // that all chart pixels or enter/update animation endpoints were proved.
        while (performance.now() - started < 950) await frame();
    }
    async function prepare() {
        check(!matchMedia('(forced-colors: active)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches, 'Unexpected normal focus media');
        flushSync(() => root.render(<ConfigProvider designSystem={designSystem} colorMode={colorMode} locale="en-US">
            <main style={{ padding: 48, minHeight: 620, background: 'var(--token-semantic-color-background-surface)', color: 'var(--token-semantic-color-text-primary)' }}>
                <section data-chart-root>
                    <BarChart width={600} height={320} categories={['East', 'West']}
                        series={[{ name: 'Online', data: [820, 640] }, { name: 'Store', data: [620, 400] }]}
                        aria-label="Focus regression" onBarClick={() => { callbacks += 1; }} />
                </section>
            </main>
        </ConfigProvider>));
        await document.fonts.ready;
        await waitForEntry();
        if (subject === 'hidden-legend') {
            target().click();
            await frame();
            await waitForEntry();
        }
        const beforeFocus = JSON.stringify(chartGeometry());
        target().focus(focusOptions);
        const focusedAt = performance.now();
        let previous = '', equalFrames = 0;
        while (performance.now() - focusedAt < 3000) {
            await frame();
            const current = JSON.stringify(snapshot().stability);
            equalFrames = current === previous ? equalFrames + 1 : 0;
            previous = current;
            if (equalFrames >= 4 && performance.now() - focusedAt >= 250) break;
        }
        check(equalFrames >= 4, 'Actual focus state and geometry failed to settle naturally');
        check(JSON.stringify(chartGeometry()) === beforeFocus, 'Focusing changed target/chart/canvas geometry');
        const result = snapshot();
        assertState(result);
        return result;
    }
    async function inspectPixels(base64: string) {
        const image = await screenshotPixels(base64), result = snapshot();
        assertState(result);
        const item = result.subjects[0]!, rect = item.rect, width = item.outlineWidth, inset = 6;
        const edges = [
            { side: 'top', x: rect.left + inset, y: rect.top - width, width: rect.width - inset * 2, height: width, dx: 0, dy: -2 },
            { side: 'bottom', x: rect.left + inset, y: rect.bottom, width: rect.width - inset * 2, height: width, dx: 0, dy: 2 },
            { side: 'left', x: rect.left - width, y: rect.top + inset, width, height: rect.height - inset * 2, dx: -2, dy: 0 },
            { side: 'right', x: rect.right, y: rect.top + inset, width, height: rect.height - inset * 2, dx: 2, dy: 0 },
        ];
        const expected = colorChannels(item.outlineColor);
        const surface = colorChannels(item.surfaceColor);
        const pixels = edges.map(edge => {
            check(edge.width > 0 && edge.height > 0, `Invalid ${subject}/${edge.side} geometry`);
            const ink = matchingPixels(image, edge, item.outlineColor);
            check(ink.ratio >= 0.65, `Actual ${subject}/${edge.side} outline missing or obscured: ${ink.ratio}`);
            // Shared with offline rejection of the actual pre-separator PNGs.
            return { ...edge, ink, ...inspectFocusBand(image, edge, expected, subject === 'bar' ? surface : null, subject) };
        });
        return { subject, pixels, focusMethod: result.focusMethod, scope: 'Actual normal published CSS four-side focus pixels and adjacent background contrast; no whole-Canvas animation terminal claim.' };
    }
    Object.assign(window, { __barChartNormalFocus: { prepare, snapshot, inspectPixels } });
}
