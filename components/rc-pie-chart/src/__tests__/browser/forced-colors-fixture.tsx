import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import ConfigProvider from '@crab-dev/rc-config-provider';
import { matchingPixels, screenshotPixels } from '../../../../../test/forced-color-pixels.mjs';
import PieChart from '../../../esm/index.mjs';

const params = new URLSearchParams(location.search);
const designSystem = params.get('designSystem') as 'md3' | 'macos' | 'shadcn';
const colorMode = params.get('colorMode') as 'light' | 'dark';
const host = document.getElementById('root')!;
const root = createRoot(host);
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
const data = [{ name: 'Direct', value: 1 }, { name: 'Search', value: 3 }];
let callbacks = 0;

function slice() {
    const element = host.querySelector<HTMLButtonElement>('[aria-label="Search 3 100%"]');
    if (!element) throw new Error('Missing the remaining visible sector');
    return element;
}

function snapshot() {
    const element = slice();
    return {
        href: location.href,
        forcedColors: matchMedia('(forced-colors: active)').matches,
        viewport: { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio },
        subjects: [{ id: 'focused-sector', rect: element.getBoundingClientRect().toJSON() }],
        focusVisible: element.matches(':focus-visible'),
        outlineColor: getComputedStyle(element).outlineColor,
    };
}

async function prepare() {
    flushSync(() => root.render(<ConfigProvider designSystem={designSystem} colorMode={colorMode} locale="en-US">
        <section style={{ padding: 36 }}>
            <PieChart width={320} height={220} innerRadiusRatio={0.4} data={data} onSliceClick={() => { callbacks++; }} />
            <span id="highlight" style={{ color: 'Highlight' }} />
        </section>
    </ConfigProvider>));
    const legend = host.querySelector<HTMLButtonElement>('button[aria-pressed="true"]')!;
    flushSync(() => legend.click());
    if (legend.getAttribute('aria-pressed') !== 'false' || !getComputedStyle(legend).textDecorationLine.includes('line-through')) {
        throw new Error('Hidden categories need a visible, non-color cue');
    }
    const element = slice();
    element.focus({ preventScroll: true, focusVisible: true });
    await frame();
    await frame();
    const result = snapshot();
    const style = getComputedStyle(element);
    const highlight = getComputedStyle(document.getElementById('highlight')!).color;
    if (!result.focusVisible || document.activeElement !== element || callbacks) throw new Error('Unexpected sector focus or activation');
    if (style.outlineStyle !== 'solid' || parseFloat(style.outlineWidth) < 2 || result.outlineColor !== highlight) {
        throw new Error('Missing system-color focus outline');
    }
    return result;
}

async function inspectPixels(base64: string) {
    const image = await screenshotPixels(base64);
    const element = slice();
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const width = parseFloat(style.outlineWidth);
    const offset = parseFloat(style.outlineOffset);
    // A small round focus target has horizontal tangent edges at its top and bottom.
    const x = rect.left + rect.width / 2;
    const yCenter = rect.top + rect.height / 2;
    const center = matchingPixels(image, { x: x - 1, y: yCenter - 1, width: 2, height: 2 }, 'Canvas', 4);
    if (center.ratio !== 1) throw new Error('Missing contrasting system-color center inside the focused sector marker');
    const ys = [rect.top - offset - width, rect.bottom + offset];
    return ys.map(y => {
        const nearby = (Math.floor(y + width / 2) * image.width + Math.floor(x - rect.width - width)) * 4;
        const backdrop = Array.from(image.data.slice(nearby, nearby + 4));
        const ink = matchingPixels(image, { x: x - 1, y, width: 2, height: width }, style.outlineColor, 12, [backdrop]);
        if (ink.matched === 0) throw new Error('Focus outline is absent from the screenshot');
        return ink;
    });
}

Object.assign(window, { __pieChartForced: { prepare, snapshot, inspectPixels } });
