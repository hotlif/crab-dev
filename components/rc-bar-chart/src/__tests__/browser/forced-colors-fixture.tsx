import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
import BarChart from '../../../esm/index.mjs';
import { matchingPixels, screenshotPixels } from '../../../../../test/forced-color-pixels.mjs';

type Subject = 'bar' | 'legend';
// Chrome supports the standard focusVisible request; a variable also keeps
// this fixture compatible with TypeScript DOM declarations that lag the API.
const focusOptions = { preventScroll: true, focusVisible: true };
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
function check(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

/** Uses DOM focus, not a claim of trusted keyboard input or Canvas pointer hits. */
export function installForcedFocusFixture(subject: Subject): void {
    const params = new URLSearchParams(location.search);
    const designSystem = params.get('designSystem') as 'md3' | 'apple' | 'shadcn';
    const colorMode = params.get('colorMode') as 'light' | 'dark';
    check(['md3', 'apple', 'shadcn'].includes(designSystem) && ['light', 'dark'].includes(colorMode), 'Invalid BarChart fixture configuration');
    const host = document.getElementById('root');
    check(host, 'Missing BarChart fixture host');
    const root = createRoot(host);
    let callbacks = 0;

    function required(selector: string): HTMLElement {
        const nodes = host!.querySelectorAll<HTMLElement>(selector);
        check(nodes.length === 1, `Expected one ${selector}; actual ${nodes.length}`);
        return nodes[0]!;
    }
    function target(): HTMLElement {
        return required(subject === 'bar'
            ? 'button[aria-label="East Online 820"]'
            : '[role="group"][aria-label="Legend"] button[aria-pressed="true"]:first-child');
    }
    function snapshot() {
        const element = target(), style = getComputedStyle(element);
        const probe = getComputedStyle(required('[data-system-highlight]'));
        const bars = host!.querySelectorAll('[role="group"][aria-label="Focus regression"] button');
        const legends = host!.querySelectorAll('[role="group"][aria-label="Legend"] button');
        return {
            href: location.href,
            forcedColors: matchMedia('(forced-colors: active)').matches,
            reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
            viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight, dpr: globalThis.devicePixelRatio },
            focusMethod: 'HTMLElement.focus({ preventScroll: true, focusVisible: true }); actual activeElement and :focus-visible checked; not trusted keyboard input',
            callbacks, barCount: bars.length,
            legendPressed: Array.from(legends, legend => legend.getAttribute('aria-pressed')),
            subjects: [{
                id: subject, rect: element.getBoundingClientRect().toJSON(),
                text: element.textContent, ariaLabel: element.getAttribute('aria-label'),
                focused: document.activeElement === element, focusVisible: element.matches(':focus-visible'),
                outlineStyle: style.outlineStyle, outlineWidth: Number.parseFloat(style.outlineWidth),
                outlineOffset: Number.parseFloat(style.outlineOffset), outlineColor: style.outlineColor,
                boxShadow: style.boxShadow, highlight: probe.color,
            }],
        };
    }
    async function prepare() {
        check(matchMedia('(forced-colors: active)').matches, 'Native forced-colors media is required');
        check(!matchMedia('(prefers-reduced-motion: reduce)').matches, 'This fixture retains normal motion preference');
        flushSync(() => root.render(<ConfigProvider designSystem={designSystem} colorMode={colorMode} locale="en-US">
            <main style={{ padding: 48, minHeight: 620, background: 'Canvas', color: 'CanvasText' }}>
                <span data-system-highlight style={{ color: 'Highlight', forcedColorAdjust: 'none' }} />
                <BarChart width={600} height={320} categories={['East', 'West']}
                    series={[{ name: 'Online', data: [820, 640] }, { name: 'Store', data: [620, 400] }]}
                    aria-label="Focus regression" onBarClick={() => { callbacks += 1; }} />
            </main>
        </ConfigProvider>));
        await document.fonts.ready;
        // The production Canvas/animation remains active. Crossing the maximum
        // entry duration is only preparation; four-side screenshot ink below is
        // the focus regression, not a whole-chart animation-stability claim.
        const mountedAt = performance.now();
        while (performance.now() - mountedAt < 950) await frame();
        target().focus(focusOptions);
        await frame();
        await Promise.all(host!.getAnimations({ subtree: true })
            .filter(animation => Number.isFinite(animation.effect?.getComputedTiming().endTime))
            .map(animation => animation.finished));
        const focusedAt = performance.now();
        let previous = '', equalFrames = 0;
        while (performance.now() - focusedAt < 3000) {
            await frame();
            const result = snapshot(), geometry = JSON.stringify(result.subjects[0]!.rect);
            equalFrames = geometry === previous ? equalFrames + 1 : 0;
            previous = geometry;
            if (equalFrames >= 4 && performance.now() - focusedAt >= 250) break;
        }
        const result = snapshot(), current = result.subjects[0]!;
        check(equalFrames >= 4, 'Actual focused target geometry did not settle');
        check(current.focused && current.focusVisible, 'Actual DOM focus-visible target was not reached');
        check(current.outlineStyle === 'solid' && current.outlineWidth >= 2 && current.outlineOffset === 0, 'Published CSS lost the forced-color focus outline');
        check(current.outlineColor === current.highlight && current.boxShadow === 'none', 'System outline must survive native shadow suppression');
        check(result.callbacks === 0 && result.barCount === 4 && result.legendPressed.every(value => value === 'true'), 'Focusing must not click a bar or hide a series');
        return result;
    }
    async function inspectPixels(base64: string) {
        const image = await screenshotPixels(base64), result = snapshot(), item = result.subjects[0]!;
        check(item.focused && item.focusVisible && result.callbacks === 0, 'Focus changed before actual pixel inspection');
        const rect = item.rect, width = item.outlineWidth, inset = 6;
        // Sample straight sections just outside each actual element. Requiring
        // all four sides rejects an adjacent colored bar, text or a grid line as
        // a substitute for a focus ring; rounded corners are excluded.
        const edges = [
            { side: 'top', x: rect.left + inset, y: rect.top - width, width: rect.width - inset * 2, height: width },
            { side: 'bottom', x: rect.left + inset, y: rect.bottom, width: rect.width - inset * 2, height: width },
            { side: 'left', x: rect.left - width, y: rect.top + inset, width, height: rect.height - inset * 2 },
            { side: 'right', x: rect.right, y: rect.top + inset, width, height: rect.height - inset * 2 },
        ];
        const pixels = edges.map(edge => {
            check(edge.width > 0 && edge.height > 0, `Invalid ${subject}/${edge.side} ring geometry`);
            const ink = matchingPixels(image, edge, item.highlight);
            check(ink.ratio >= 0.65, `Actual ${subject}/${edge.side} focus outline is missing or obscured: ${ink.ratio}`);
            return { ...edge, ink };
        });
        return { subject, pixels, focusMethod: result.focusMethod, scope: 'Actual published forced-color four-side focus pixels; not a full Canvas stability or trusted-keyboard claim' };
    }
    Object.assign(window, { __barChartForced: { prepare, snapshot, inspectPixels } });
}
