import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Tabs from '../../../esm/index.mjs';
import { colorChannels, matchingPixels, screenshotPixels } from '../../../../../test/forced-color-pixels.mjs';

type Direction = 'ltr' | 'rtl';
type Rect = Pick<DOMRectReadOnly, 'x' | 'y' | 'width' | 'height' | 'top' | 'right' | 'bottom' | 'left'>;
type PixelRect = Pick<Rect, 'x' | 'y' | 'width' | 'height'>;
const params = new URLSearchParams(location.search);
const designSystem = params.get('designSystem') as 'md3' | 'apple' | 'shadcn';
const colorMode = params.get('colorMode') as 'light' | 'dark';
if (!['md3', 'apple', 'shadcn'].includes(designSystem) || !['light', 'dark'].includes(colorMode)) throw new Error('Invalid forced-colors line fixture configuration');
const host = document.getElementById('root');
if (!host) throw new Error('Missing forced-colors line fixture host');
const root = createRoot(host);
const label = '概览 30';
const focusOptions = { preventScroll: true, focusVisible: true };
let focusDirection: Direction = 'ltr';

function scenes() {
    return [
        { id: 'selected-ltr', direction: 'ltr' as const, focused: false },
        { id: 'selected-rtl', direction: 'rtl' as const, focused: false },
        { id: `focused-${focusDirection}`, direction: focusDirection, focused: true },
    ];
}

function check(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

function required(selector: string, scope: ParentNode = document): HTMLElement {
    const elements = scope.querySelectorAll<HTMLElement>(selector);
    check(elements.length === 1, `Expected one ${selector}; got ${elements.length}`);
    return elements[0]!;
}

function rect(element: Element | Range): Rect {
    const value = element.getBoundingClientRect();
    return { x: value.x, y: value.y, width: value.width, height: value.height,
        top: value.top, right: value.right, bottom: value.bottom, left: value.left };
}

function glyphs(element: HTMLElement) {
    const walker = document.createTreeWalker(element, globalThis.NodeFilter.SHOW_TEXT);
    const result: { text: string; rect: Rect }[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.textContent ?? '';
        for (let offset = 0; offset < text.length; offset += 1) {
            if (!text[offset]!.trim()) continue;
            const range = document.createRange();
            range.setStart(node, offset);
            range.setEnd(node, offset + 1);
            result.push({ text: text[offset]!, rect: rect(range) });
        }
    }
    return result;
}

function snapshot() {
    return {
        href: location.href,
        config: { designSystem, colorMode },
        focusDirection,
        focusMethod: { api: 'HTMLElement.focus', options: focusOptions, keyboardNavigation: 'not-exercised-by-this-fixture' },
        documentHasFocus: document.hasFocus(),
        activeElement: { tag: document.activeElement?.tagName, id: document.activeElement?.id },
        forcedColors: matchMedia('(forced-colors: active)').matches,
        viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight, dpr: globalThis.devicePixelRatio },
        subjects: scenes().map(scene => {
            const scope = required(`[data-scene="${scene.id}"]`);
            const tab = required('[role="tab"][aria-selected="true"]', scope);
            const list = required('[role="tablist"]', scope);
            const panel = required('[role="tabpanel"]:not([hidden])', scope);
            const labelElement = required(':scope > span', tab);
            const indicator = required(':scope > span[aria-hidden="true"]', labelElement);
            const unselected = required('[role="tab"][aria-selected="false"]:not(:disabled)', scope);
            const style = getComputedStyle(tab), indicatorStyle = getComputedStyle(indicator);
            return {
                id: scene.id, direction: getComputedStyle(tab).direction, rect: rect(tab), glyphs: glyphs(labelElement), text: tab.textContent,
                labelRect: rect(labelElement), listRect: rect(list), listOverflowX: getComputedStyle(list).overflowX,
                focused: document.activeElement === tab, focusVisible: tab.matches(':focus-visible'),
                selected: tab.getAttribute('aria-selected'), disabled: tab.matches(':disabled'),
                controls: tab.getAttribute('aria-controls'), panelId: panel.id,
                labelledBy: panel.getAttribute('aria-labelledby'), tabId: tab.id,
                tabCount: list.querySelectorAll('[role="tab"]').length,
                outline: { style: style.outlineStyle, color: style.outlineColor,
                    width: Number.parseFloat(style.outlineWidth), offset: Number.parseFloat(style.outlineOffset) },
                radius: Number.parseFloat(style.borderTopLeftRadius), color: style.color, background: style.backgroundColor,
                forcedColorAdjust: style.forcedColorAdjust,
                indicator: { rect: rect(indicator), opacity: indicatorStyle.opacity, background: indicatorStyle.backgroundColor },
                unselected: { selected: unselected.getAttribute('aria-selected'), focused: document.activeElement === unselected,
                    outlineStyle: getComputedStyle(unselected).outlineStyle },
            };
        }),
    };
}

function systemColors() {
    const canvas = getComputedStyle(required('[data-system-canvas]'));
    const highlight = getComputedStyle(required('[data-system-highlight]'));
    return { foreground: canvas.color, background: canvas.backgroundColor, selection: highlight.color };
}

function verify(actual: ReturnType<typeof snapshot>) {
    check(actual.forcedColors && actual.documentHasFocus, 'Actual forced-colors and focused document are required');
    check(actual.viewport.width === 1280 && actual.viewport.height === 720 && actual.viewport.dpr === 1, 'Line pixel assertions require the actual 1x viewport');
    const colors = systemColors();
    check(new Set(Object.values(colors).map(color => colorChannels(color).slice(0, 3).join(','))).size === 3,
        'Focus, selection and background must be distinguishable system colors');
    for (const [index, subject] of actual.subjects.entries()) {
        const scene = scenes()[index]!;
        check(subject.direction === scene.direction, `Writing direction mismatch: ${subject.id}`);
        check(subject.focused === scene.focused && subject.focusVisible === scene.focused, `Actual focus mismatch: ${JSON.stringify({ subject, active: actual.activeElement })}`);
        check(subject.selected === 'true' && !subject.disabled && subject.tabCount === 3, `Selected line tab semantics lost: ${subject.id}`);
        check(subject.controls === subject.panelId && subject.labelledBy === subject.tabId, `Tab/panel association lost: ${subject.id}`);
        check(subject.text === label && subject.glyphs.length === 4, `Missing actual line label ranges: ${subject.id}`);
        check(colorChannels(subject.color).slice(0, 3).some((channel, channelIndex) => channel !== colorChannels(colors.background)[channelIndex]),
            `Selected text and background are indistinguishable: ${subject.id}`);
        check(subject.unselected.selected === 'false' && !subject.unselected.focused && subject.unselected.outlineStyle === 'none', `Unselected line tab acquired a selection ring: ${subject.id}`);
        check(subject.outline.style === 'solid' && subject.outline.width > 0
            && subject.outline.color === (scene.focused ? colors.foreground : colors.selection), `Wrong actual line outline: ${subject.id}`);
        check(scene.focused ? subject.outline.offset < -subject.outline.width : subject.outline.offset === -subject.outline.width,
            `Line outline is not contained: ${subject.id}`);
        check(subject.listOverflowX === 'auto', 'Regression must retain the real scrolling tablist');
        check(subject.rect.left >= subject.listRect.left && subject.rect.right <= subject.listRect.right
            && subject.rect.top >= subject.listRect.top && subject.rect.bottom <= subject.listRect.bottom, `Tab body clipped by real tablist: ${subject.id}`);
        for (const bounds of [subject.rect, ...subject.glyphs.map(glyph => glyph.rect)]) check(bounds.width > 0 && bounds.height > 0
            && bounds.left >= 0 && bounds.top >= 0 && bounds.right <= actual.viewport.width && bounds.bottom <= actual.viewport.height, `Incomplete actual subject: ${subject.id}`);
        const inset = -subject.outline.offset;
        for (const glyph of subject.glyphs) check(glyph.rect.left >= subject.rect.left + inset && glyph.rect.right <= subject.rect.right - inset
            && glyph.rect.top >= subject.rect.top + inset && glyph.rect.bottom <= subject.rect.bottom - inset, `Outline intersects text: ${subject.id}/${glyph.text}`);
        check(subject.indicator.opacity === '1', `Selected indicator opacity lost: ${subject.id}`);
        check(Math.abs(subject.indicator.rect.height - (designSystem === 'md3' ? 3 : 0)) <= 0.01,
            `Unexpected design-specific underline height: ${subject.id}/${subject.indicator.rect.height}`);
    }
    return actual;
}

async function prepare(direction: Direction) {
    focusDirection = direction;
    flushSync(() => root.render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
        <main style={{ padding: 48 }}>
            <span data-system-canvas="" style={{ color: 'CanvasText', backgroundColor: 'Canvas', forcedColorAdjust: 'none' }} />
            <span data-system-highlight="" style={{ color: 'Highlight', forcedColorAdjust: 'none' }} />
            {scenes().map(scene => <section key={scene.id} data-scene={scene.id} dir={scene.direction} style={{ width: 420, marginBottom: 48 }}>
                <Tabs type="line" defaultValue="overview" items={[
                    { key: 'overview', label, children: '当前面板' },
                    { key: 'details', label: '详情', children: '详情面板' },
                    { key: 'disabled', label: '不可用', disabled: true },
                ]} />
            </section>)}
        </main>
    </ConfigProvider>));
    await document.fonts.ready;
    // This is real DOM focus-visible paint, not trusted Tab navigation and not
    // a forced pseudo-state. Separate fixture calls exercise each direction.
    required(`[data-scene="focused-${direction}"] [role="tab"][aria-selected="true"]`).focus(focusOptions);
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    return verify(snapshot());
}

function intersects(a: PixelRect, b: Rect) {
    return a.x < b.right && a.x + a.width > b.left && a.y < b.bottom && a.y + a.height > b.top;
}

function edgeStrips(subject: ReturnType<typeof snapshot>['subjects'][number]) {
    const bounds = subject.rect, thickness = subject.outline.width;
    const outer = -subject.outline.offset - thickness;
    const corner = Math.min(subject.radius, bounds.width / 2, bounds.height / 2);
    const width = Math.min(24, bounds.width - 2 * (corner + outer + 1));
    const height = Math.min(12, bounds.height - 2 * (corner + outer + 1));
    // Bottom sampling stays in label-external padding: the M3 underline cannot
    // make a clipped bottom outline pass. Mid-edge strips also avoid corners.
    const gaps = [
        { x: bounds.left + corner + outer + 1, end: subject.labelRect.left - 1 },
        { x: subject.labelRect.right + 1, end: bounds.right - corner - outer - 1 },
    ].sort((a, b) => (b.end - b.x) - (a.end - a.x));
    const gap = gaps[0]!;
    check(width >= 2 && height >= 2 && gap.end - gap.x >= 2, `No complete edge pixel bands: ${subject.id}`);
    const strips: { edge: string; rect: PixelRect }[] = [
        { edge: 'top', rect: { x: bounds.left + (bounds.width - width) / 2, y: bounds.top + outer, width, height: thickness } },
        { edge: 'bottom', rect: { x: gap.x, y: bounds.bottom - outer - thickness, width: gap.end - gap.x, height: thickness } },
        { edge: 'left', rect: { x: bounds.left + outer, y: bounds.top + (bounds.height - height) / 2, width: thickness, height } },
        { edge: 'right', rect: { x: bounds.right - outer - thickness, y: bounds.top + (bounds.height - height) / 2, width: thickness, height } },
    ];
    for (const strip of strips) {
        for (const glyph of subject.glyphs) check(!intersects(strip.rect, glyph.rect), `Edge ROI intersects text: ${subject.id}/${strip.edge}`);
        if (subject.indicator.rect.height > 0) check(!intersects(strip.rect, subject.indicator.rect), `Edge ROI includes underline: ${subject.id}/${strip.edge}`);
    }
    return strips;
}

async function inspectPixels(base64: string) {
    const image = await screenshotPixels(base64);
    const actual = verify(snapshot()), colors = systemColors();
    return actual.subjects.map(subject => {
        const edges = edgeStrips(subject).map(strip => {
            const expected = subject.focused ? colors.foreground : colors.selection;
            const other = subject.focused ? colors.selection : colors.foreground;
            const pixels = matchingPixels(image, strip.rect, expected);
            const otherState = matchingPixels(image, strip.rect, other);
            check(pixels.total >= 2 && pixels.ratio > 0.8 && otherState.ratio < 0.05,
                `Original PNG line ${strip.edge} ring missing or indistinguishable: ${subject.id}/${JSON.stringify({ pixels, otherState })}`);
            return { ...strip, pixels, otherState };
        });
        const characters = subject.glyphs.map(glyph => {
            const foreground = matchingPixels(image, glyph.rect, subject.color, 32);
            const background = matchingPixels(image, glyph.rect, colors.background, 2);
            check(foreground.matched >= 2 && background.matched >= 2 && background.ratio > 0.2,
                `Actual selected text ink/gaps missing: ${subject.id}/${glyph.text}`);
            return { ...glyph, foreground, background };
        });
        const inner = -subject.outline.offset, outer = inner - subject.outline.width;
        const indicator = subject.indicator.rect;
        const x = subject.labelRect.left + subject.labelRect.width / 4, width = subject.labelRect.width / 2;
        // Sample the actual M3 band, or the corresponding hypothetical 3px band
        // in other designs, after subtracting the outline. Selection leaves the
        // top row free; inset focus leaves the bottom row free. A sample above
        // the whole band could not disprove an unwanted underline under focus.
        const top = designSystem === 'md3' ? indicator.top : subject.rect.bottom - 3;
        const bottom = designSystem === 'md3' ? indicator.bottom : subject.rect.bottom;
        const bands = [
            { y: top, end: Math.min(bottom, subject.rect.bottom - inner) },
            { y: Math.max(top, subject.rect.bottom - outer), end: bottom },
        ].sort((a, b) => (b.end - b.y) - (a.end - a.y));
        const band = bands[0]!;
        check(Math.floor(band.end) - Math.ceil(band.y) >= 1, `No independent underline pixel row: ${subject.id}`);
        const underlineRegion: PixelRect = { x, y: band.y, width, height: band.end - band.y };
        for (const glyph of subject.glyphs) check(!intersects(underlineRegion, glyph.rect), `Underline ROI intersects label: ${subject.id}`);
        const underline = matchingPixels(image, underlineRegion, colors.selection);
        const underlineBackground = matchingPixels(image, underlineRegion, colors.background);
        check(underline.total >= 2, `Empty underline pixel region: ${subject.id}`);
        check(designSystem === 'md3' ? underline.ratio > 0.8 : underline.ratio < 0.05 && underlineBackground.ratio > 0.8,
            `Actual design-specific underline pixels mismatch: ${subject.id}/${JSON.stringify({ underline, underlineBackground })}`);
        return { id: subject.id, focused: subject.focused, direction: subject.direction, edges, characters,
            underline: { region: underlineRegion, expected: designSystem === 'md3', pixels: underline, background: underlineBackground } };
    });
}

Object.assign(window, {
    __tabsLineForcedLtr: { prepare: () => prepare('ltr'), snapshot, inspectPixels },
    __tabsLineForcedRtl: { prepare: () => prepare('rtl'), snapshot, inspectPixels },
});
