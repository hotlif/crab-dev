import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Tabs from '../../../esm/index.mjs';
import { colorChannels, matchingPixels, screenshotPixels } from '../../../../../test/forced-color-pixels.mjs';

const params = new URLSearchParams(location.search);
const designSystem = params.get('designSystem') as 'md3' | 'apple' | 'shadcn';
const colorMode = params.get('colorMode') as 'light' | 'dark';
if (!['md3', 'apple', 'shadcn'].includes(designSystem) || !['light', 'dark'].includes(colorMode)) throw new Error('Invalid forced-colors fixture configuration');
const host = document.getElementById('root');
if (!host) throw new Error('Missing forced-colors fixture host');
const root = createRoot(host);
const scenes = [
    { id: 'selected-ltr', direction: 'ltr', focused: false },
    { id: 'focused-ltr', direction: 'ltr', focused: true },
    { id: 'selected-rtl', direction: 'rtl', focused: false },
] as const;
const label = '概览 30';
const focusOptions = { preventScroll: true, focusVisible: true };

function check(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

function required(selector: string, scope: ParentNode = document): HTMLElement {
    const elements = scope.querySelectorAll<HTMLElement>(selector);
    check(elements.length === 1, `Expected one ${selector}; got ${elements.length}`);
    return elements[0]!;
}

function glyphs(element: HTMLElement) {
    const walker = document.createTreeWalker(element, globalThis.NodeFilter.SHOW_TEXT);
    const result: { text: string; rect: ReturnType<DOMRect['toJSON']> }[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.textContent ?? '';
        for (let offset = 0; offset < text.length; offset++) {
            if (!text[offset]!.trim()) continue;
            const range = document.createRange();
            range.setStart(node, offset);
            range.setEnd(node, offset + 1);
            result.push({ text: text[offset]!, rect: range.getBoundingClientRect().toJSON() });
        }
    }
    return result;
}

function snapshot() {
    return {
        href: location.href,
        config: { designSystem, colorMode },
        focusMethod: { api: 'HTMLElement.focus', options: focusOptions, keyboardNavigation: 'not-exercised-by-this-fixture' },
        documentHasFocus: document.hasFocus(),
        activeElement: { tag: document.activeElement?.tagName, id: document.activeElement?.id,
            role: document.activeElement?.getAttribute('role') },
        forcedColors: matchMedia('(forced-colors: active)').matches,
        viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight, dpr: globalThis.devicePixelRatio },
        subjects: scenes.map(scene => {
            const scope = required(`[data-scene="${scene.id}"]`);
            const tab = required('[role="tab"][aria-selected="true"]', scope);
            const tabList = required('[role="tablist"]', scope);
            const panel = required('[role="tabpanel"]:not([hidden])', scope);
            const style = getComputedStyle(tab);
            return {
                id: scene.id, direction: getComputedStyle(tab).direction,
                rect: tab.getBoundingClientRect().toJSON(), glyphs: glyphs(tab), text: tab.textContent,
                tabListRect: tabList.getBoundingClientRect().toJSON(),
                tabListOverflowX: getComputedStyle(tabList).overflowX,
                focused: document.activeElement === tab, focusVisible: tab.matches(':focus-visible'),
                outline: { style: style.outlineStyle, color: style.outlineColor,
                    width: Number.parseFloat(style.outlineWidth), offset: Number.parseFloat(style.outlineOffset) },
                borderRadius: Number.parseFloat(style.borderTopLeftRadius),
                selected: tab.getAttribute('aria-selected'), disabled: tab.matches(':disabled'),
                controls: tab.getAttribute('aria-controls'), panelId: panel.id,
                labelledBy: panel.getAttribute('aria-labelledby'), tabId: tab.id,
                tabCount: tabList.querySelectorAll('[role="tab"]').length,
                color: style.color, background: style.backgroundColor, forcedColorAdjust: style.forcedColorAdjust,
                labelForcedColorAdjust: getComputedStyle(required('span', tab)).forcedColorAdjust,
            };
        }),
    };
}

function verify(actual: ReturnType<typeof snapshot>) {
    check(actual.forcedColors, 'Actual forced-colors media is required');
    check(actual.viewport.width === 1280 && actual.viewport.height === 720 && actual.viewport.dpr === 1, 'Pixel assertions require the actual 1x viewport');
    const pair = getComputedStyle(required('[data-system-pair]'));
    check(colorChannels(pair.color).slice(0, 3).some((channel, index) => channel !== colorChannels(pair.backgroundColor)[index]), 'System foreground and background must differ');
    for (const [index, subject] of actual.subjects.entries()) {
        check(subject.direction === scenes[index]!.direction, `Unexpected writing direction: ${subject.id}`);
        check(subject.focused === scenes[index]!.focused && subject.focusVisible === scenes[index]!.focused,
            `Actual focus state mismatch: ${JSON.stringify({ id: subject.id, focused: subject.focused, focusVisible: subject.focusVisible,
                documentHasFocus: actual.documentHasFocus, activeElement: actual.activeElement })}`);
        check(subject.selected === 'true' && !subject.disabled && subject.tabCount === 3, `Selected pill semantics lost: ${subject.id}`);
        check(subject.controls === subject.panelId && subject.labelledBy === subject.tabId, `Tab/panel association lost: ${subject.id}`);
        check(subject.text === label && subject.glyphs.length === 4, `Actual selected text ranges missing: ${subject.id}`);
        check(subject.color === pair.color && subject.background === pair.backgroundColor, `Selected pill system pair mismatch: ${subject.id}`);
        check(subject.forcedColorAdjust === 'none' && subject.labelForcedColorAdjust === 'none', `Automatic text backplate remains enabled: ${subject.id}`);
        for (const bounds of [subject.rect, ...subject.glyphs.map(glyph => glyph.rect)]) {
            check(bounds.width > 0 && bounds.height > 0 && bounds.left >= 0 && bounds.top >= 0
                && bounds.right <= actual.viewport.width && bounds.bottom <= actual.viewport.height, `Incomplete screenshot subject: ${subject.id}`);
        }
        if (subject.focused) {
            check(subject.outline.style === 'solid' && subject.outline.color === pair.color
                && subject.outline.width > 0 && subject.outline.offset < -subject.outline.width, 'Selected focus needs an inset system-foreground outline');
            const { rect, tabListRect } = subject;
            check(subject.tabListOverflowX === 'auto', 'Focus must be checked inside the real scrolling tablist');
            check(rect.left >= tabListRect.left && rect.right <= tabListRect.right
                && rect.top >= tabListRect.top && rect.bottom <= tabListRect.bottom, 'Focused pill is clipped by its scrolling tablist');
            const innerInset = -subject.outline.offset;
            // Derive the band's inner boundary from actual computed width and
            // offset, keeping the assertion valid for public focus-width tokens.
            for (const glyph of subject.glyphs) check(glyph.rect.left >= rect.left + innerInset && glyph.rect.right <= rect.right - innerInset
                && glyph.rect.top >= rect.top + innerInset && glyph.rect.bottom <= rect.bottom - innerInset, `Inset outline intersects glyph: ${glyph.text}`);
        }
    }
    return actual;
}

async function prepare() {
    flushSync(() => root.render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
        <main style={{ padding: 48 }}>
            <span data-system-pair="highlight" style={{ color: 'HighlightText', backgroundColor: 'Highlight', forcedColorAdjust: 'none' }} />
            {scenes.map(scene => <section key={scene.id} data-scene={scene.id} dir={scene.direction} style={{ marginBottom: 48 }}>
                <Tabs type="pill" defaultValue="overview" items={[
                    { key: 'overview', label, children: '当前面板' },
                    { key: 'details', label: '详情', children: '详情面板' },
                    { key: 'disabled', label: '不可用', disabled: true },
                ]} />
            </section>)}
        </main>
    </ConfigProvider>));
    await document.fonts.ready;
    // Native FocusOptions requests a visible focus indication. Plain focus()
    // intentionally leaves that decision to browser heuristics. This is a
    // focused-paint check; actual Tab navigation has separate browser coverage.
    // https://html.spec.whatwg.org/multipage/interaction.html#focus-management-apis
    required('[data-scene="focused-ltr"] [role="tab"][aria-selected="true"]').focus(focusOptions);
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    return verify(snapshot());
}

async function inspectPixels(base64: string) {
    // Read only the actual Chrome PNG. Foreground alone could be a solid
    // text backplate, so each real glyph range must also retain the pill fill.
    const image = await screenshotPixels(base64);
    const actual = verify(snapshot());
    const focused = actual.subjects.find(subject => subject.focused);
    check(focused, 'Missing actually focused pill');
    const thickness = focused.outline.width;
    const outerInset = -focused.outline.offset - thickness;
    const results = actual.subjects.map(subject => {
        const fill = matchingPixels(image, subject.rect, subject.background);
        check(fill.ratio > 0.25, `Selected pill fill missing: ${subject.id}`);
        const characters = subject.glyphs.map(glyph => {
            const foreground = matchingPixels(image, glyph.rect, subject.color, 32);
            const background = matchingPixels(image, glyph.rect, subject.background);
            check(foreground.matched >= 2, `Selected glyph ink missing: ${subject.id}/${glyph.text}`);
            check(background.matched >= 2 && background.ratio > 0.2, `Text backplate hides glyph shape: ${subject.id}/${glyph.text}`);
            return { ...glyph, foreground, background };
        });
        // Central top/bottom strips avoid pill corner curvature and text ink.
        // The same relative regions in unfocused controls must have no ring.
        const corner = Math.min(subject.borderRadius, subject.rect.width / 2, subject.rect.height / 2);
        const width = Math.min(24, subject.rect.width - corner * 2 - 2);
        check(Number.isFinite(width) && width > 2, `No safe central outline strip: ${subject.id}`);
        const x = subject.rect.left + (subject.rect.width - width) / 2;
        const strips = [
            { x, y: subject.rect.top + outerInset, width, height: thickness },
            { x, y: subject.rect.bottom - outerInset - thickness, width, height: thickness },
        ].map(rect => {
            for (const glyph of subject.glyphs) check(rect.x + rect.width <= glyph.rect.left || rect.x >= glyph.rect.right
                || rect.y + rect.height <= glyph.rect.top || rect.y >= glyph.rect.bottom, `Outline pixel strip intersects text: ${subject.id}`);
            return { rect, foreground: matchingPixels(image, rect, subject.color) };
        });
        for (const strip of strips) check(subject.focused ? strip.foreground.ratio > 0.8 : strip.foreground.ratio < 0.05,
            `Actual focus-ring pixels do not distinguish ${subject.id}`);
        return { id: subject.id, focused: subject.focused, fill, characters, strips, measuredFocusBand: { thickness, outerInset } };
    });
    return results;
}

Object.assign(window, { __tabsForced: { prepare, snapshot, inspectPixels } });
