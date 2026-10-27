import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Tag, { CheckableTag } from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';
import { colorChannels, matchingPixels, screenshotPixels } from '../../../../../test/forced-color-pixels.mjs';

const params = new URLSearchParams(location.search);
const designSystem = params.get('designSystem') as 'md3' | 'apple' | 'shadcn';
const colorMode = params.get('colorMode') as 'light' | 'dark';
if (!['md3', 'apple', 'shadcn'].includes(designSystem) || !['light', 'dark'].includes(colorMode)) throw new Error('Invalid forced-color fixture configuration');
const host = document.getElementById('root');
if (!host) throw new Error('Missing fixture host');
const root = createRoot(host);
const states = [{ checked: true, disabled: false }, { checked: false, disabled: false },
    { checked: true, disabled: true }, { checked: false, disabled: true }];
const ordinaryLabels = ['已选择：Books / Movies', '默认标签 30', '自定义标签 30', '显式配色 30'];
const tags = () => [...document.querySelectorAll<HTMLElement>('[data-tag]')];
const required = <T extends Element = HTMLElement,>(selector: string, scope: ParentNode = document): T => {
    const matches = scope.querySelectorAll<T>(selector);
    if (matches.length !== 1) throw new Error(`Expected one ${selector}; found ${matches.length}`);
    return matches[0]!;
};
const expectedLabel = (tag: HTMLElement) => {
    const index = Number(tag.dataset.tag);
    const label = index < states.length ? '30' : ordinaryLabels[index - states.length];
    if (!label) throw new Error('Unknown actual Tag subject');
    return label;
};
function labelElement(tag: HTMLElement) {
    const label = expectedLabel(tag);
    const matches = [...tag.children].filter(child => child.tagName === 'SPAN' && child.textContent === label);
    if (matches.length !== 1) throw new Error(`Missing actual Tag label: ${label}`);
    return matches[0]!;
}
function glyphs(tag: HTMLElement) {
    const text = labelElement(tag);
    const range = document.createRange();
    range.selectNodeContents(text);
    return { text: text.textContent, rect: range.getBoundingClientRect().toJSON() };
}
function characters(tag: HTMLElement) {
    const node = labelElement(tag).firstChild;
    const contents = node?.textContent;
    if (!node || node.nodeType !== globalThis.Node.TEXT_NODE || typeof contents !== 'string' || contents !== expectedLabel(tag)) throw new Error('Expected real Tag text node');
    return [...contents].flatMap((text, offset) => {
        if (!text.trim()) return [];
        const range = document.createRange();
        range.setStart(node, offset); range.setEnd(node, offset + 1);
        return [{ text, rect: range.getBoundingClientRect().toJSON() }];
    });
}
function closeButton() {
    return required<HTMLButtonElement>('[data-tag="6"] button[aria-label="移除自定义标签"]');
}
function closeSnapshot() {
    const button = closeButton(), style = getComputedStyle(button);
    return { id: 'ordinary-custom-close', rect: button.getBoundingClientRect().toJSON(),
        focused: document.activeElement === button, focusVisible: button.matches(':focus-visible'),
        type: button.type, ariaLabel: button.getAttribute('aria-label'),
        color: style.color, backgroundColor: style.backgroundColor,
        outline: { color: style.outlineColor, width: style.outlineWidth, offset: style.outlineOffset, style: style.outlineStyle },
        icon: required<SVGSVGElement>('svg', button).getBoundingClientRect().toJSON() };
}
function opacityChain(tag: HTMLElement) {
    const values = [];
    for (let element: Element | null = labelElement(tag); element; element = element.parentElement) {
        values.push({ tag: element.tagName, opacity: getComputedStyle(element).opacity });
    }
    return values;
}
function snapshot() {
    return { href: location.href, forcedColors: matchMedia('(forced-colors: active)').matches,
        viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight, dpr: globalThis.devicePixelRatio },
        subjects: [...tags().map((tag, index) => ({ id: `tag-${index}`, rect: tag.getBoundingClientRect().toJSON(), glyphs: [glyphs(tag)], characters: characters(tag), opacityChain: opacityChain(tag),
            role: tag.getAttribute('role'), checked: tag.getAttribute('aria-checked'), disabled: tag.getAttribute('aria-disabled'),
            color: getComputedStyle(tag).color, backgroundColor: getComputedStyle(tag).backgroundColor,
            borderColor: getComputedStyle(tag).borderTopColor, forcedColorAdjust: getComputedStyle(tag).forcedColorAdjust })), closeSnapshot()] };
}
async function prepare() {
    flushSync(() => root.render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
        <style>{compiledCss}</style>
        <span data-reference="canvas" style={{ color: 'CanvasText', backgroundColor: 'Canvas', forcedColorAdjust: 'none' }} />
        <span data-reference="button" style={{ color: 'ButtonText', backgroundColor: 'ButtonFace', forcedColorAdjust: 'none' }} />
        <span data-reference="focus" style={{ color: 'Highlight', forcedColorAdjust: 'none' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 32, padding: 48 }}>
            <div style={{ display: 'flex', gap: 32 }}>
                {states.map((state, index) => <CheckableTag key={index} {...state} data-tag={index}>30</CheckableTag>)}
            </div>
            <Tag data-tag="4" color="primary">{ordinaryLabels[0]}</Tag>
            <Tag data-tag="5" icon={<svg data-prefix-icon viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 1 15 8 8 15 1 8Z" /></svg>}>{ordinaryLabels[1]}</Tag>
            <Tag data-tag="6" color="#1677ff" closable closeAriaLabel="移除自定义标签">{ordinaryLabels[2]}</Tag>
            <Tag data-tag="7" color="#722ed1" style={{ color: 'ivory' }} bordered={false}>{ordinaryLabels[3]}</Tag>
        </div>
    </ConfigProvider>));
    await document.fonts.ready;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    if (!matchMedia('(forced-colors: active)').matches || tags().length !== 8) throw new Error('Actual checkable and ordinary forced-color tags required');
    for (const [index, tag] of tags().entries()) {
        if (getComputedStyle(tag).forcedColorAdjust !== 'none') throw new Error('Tag system color pair must remain intact');
        const style = getComputedStyle(tag);
        if (colorChannels(style.color).slice(0, 3).every((channel, position) => channel === colorChannels(style.backgroundColor)[position])) throw new Error('Tag text has no contrast against its system surface');
        if (index < states.length) {
            if (tag.getAttribute('aria-checked') !== String(states[index]!.checked)) throw new Error('Tag selection lost');
            if (Boolean(tag.querySelector('[data-role="selected-icon"]')) !== states[index]!.checked) throw new Error('Selected checkmark missing');
            if (states[index]!.disabled && tag.tabIndex !== -1) throw new Error('Disabled tag remains keyboard interactive');
        } else {
            const reference = getComputedStyle(required('[data-reference="canvas"]'));
            if (style.color !== reference.color || style.backgroundColor !== reference.backgroundColor || style.borderTopColor !== reference.color) throw new Error('Ordinary Tag must retain its actual system foreground/surface/border pair');
            if (tag.hasAttribute('role') || tag.hasAttribute('aria-checked')) throw new Error('Ordinary Tag acquired checkbox semantics');
            const labelStyle = getComputedStyle(labelElement(tag));
            if (labelStyle.forcedColorAdjust !== 'none' || labelStyle.color !== style.color) throw new Error('Ordinary label lost its inherited system ink or permits an automatic text backplate');
        }
        if (opacityChain(tag).some(item => item.opacity !== '1')) throw new Error('Opacity changed the Tag glyph fixture');
        glyphs(tag);
    }
    const close = closeButton();
    close.focus();
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    const focused = closeSnapshot();
    const buttonPair = getComputedStyle(required('[data-reference="button"]'));
    if (!focused.focused || !focused.focusVisible || focused.type !== 'button') throw new Error('Actual native close focus is missing');
    if (focused.color !== buttonPair.color || focused.backgroundColor !== buttonPair.backgroundColor) throw new Error('Close Button system colors changed');
    if (focused.outline.style !== 'solid' || focused.outline.width !== '2px' || focused.outline.offset !== '-2px' || focused.outline.color !== getComputedStyle(required('[data-reference="focus"]')).color) throw new Error('Close role lost its actual inset system focus');
    return snapshot();
}

// Windows LCD antialiasing may paint a narrow punctuation mark with no pixel
// near all three foreground channels (e.g. adjacent [181,93,0]/[0,93,181]).
// Average at most three horizontal screenshot pixels, strictly INSIDE this
// character's real Range. Retain the single-alpha segment diagnosis, but LCD
// coverage can differ per channel even after averaging a two-pixel-wide glyph.
// In that case every channel must stay between its measured foreground and
// background endpoints, with >=20% mean coverage and >=10% in two channels.
// Never sample adjacent glyphs, enlarge the Range, repaint text, or relax the
// independent background test. This detects ink, not a contrast ratio.
function blendedGlyphInk(image: ImageData, rect: DOMRectReadOnly, foreground: string, background: string) {
    const ink = colorChannels(foreground), surface = colorChannels(background);
    const vector = ink.slice(0, 3).map((channel, index) => channel - surface[index]!);
    const lengthSquared = vector.reduce((sum, channel) => sum + channel * channel, 0);
    if (lengthSquared === 0) throw new Error('No foreground/background segment');
    const left = Math.max(0, Math.ceil(rect.x)), right = Math.min(image.width, Math.floor(rect.x + rect.width));
    const top = Math.max(0, Math.ceil(rect.y)), bottom = Math.min(image.height, Math.floor(rect.y + rect.height));
    let matched = 0, sampled = 0, maxCoverage = 0, singleAlphaMatched = 0, lcdChannelMatched = 0;
    const samples: { x: number; y: number; fromX: number; toXExclusive: number; average: number[]; coverage: number; residual: number; channelCoverage: number[]; method: string }[] = [];
    for (let y = top; y < bottom; y++) {
        for (let x = left; x < right; x++) {
            const fromX = Math.max(left, x - 1), toX = Math.min(right, x + 2);
            const average = [0, 0, 0];
            for (let tap = fromX; tap < toX; tap++) {
                const offset = (y * image.width + tap) * 4;
                for (let channel = 0; channel < 3; channel++) {
                    const total = average[channel];
                    const sample = image.data[offset + channel];
                    if (total === undefined || sample === undefined) throw new Error('LCD sample is outside the actual image channels');
                    average[channel] = total + sample / (toX - fromX);
                }
            }
            const coverage = vector.reduce((sum, channel, index) => sum + (average[index]! - surface[index]!) * channel, 0) / lengthSquared;
            const residual = Math.max(...average.map((value, index) => Math.abs(value - (surface[index]! + coverage * vector[index]!))));
            const channelCoverage = vector.flatMap((channel, index) => channel === 0 ? [] : [(average[index]! - surface[index]!) / channel]);
            const withinEndpoints = average.every((value, index) => value >= Math.min(surface[index]!, ink[index]!) - 2 && value <= Math.max(surface[index]!, ink[index]!) + 2);
            const meanChannelCoverage = channelCoverage.reduce((sum, value) => sum + value, 0) / channelCoverage.length;
            const singleAlpha = coverage >= 0.2 && coverage <= 1 && residual <= 8;
            const lcdChannels = withinEndpoints && meanChannelCoverage >= 0.2 && channelCoverage.filter(value => value >= 0.1).length >= Math.min(2, channelCoverage.length);
            sampled++;
            if (singleAlpha) singleAlphaMatched++;
            if (lcdChannels) lcdChannelMatched++;
            if (singleAlpha || lcdChannels) {
                matched++; maxCoverage = Math.max(maxCoverage, coverage);
                if (samples.length < 8) samples.push({ x, y, fromX, toXExclusive: toX, average, coverage, residual, channelCoverage, method: singleAlpha ? 'single-alpha' : 'lcd-channel-coverage' });
            }
        }
    }
    if (!sampled) throw new Error('Glyph Range has no complete screenshot pixels');
    return { matched, sampled, singleAlphaMatched, lcdChannelMatched, maxCoverage, samples, bounds: { left, right, top, bottom }, maxHorizontalTaps: 3, minimumCoverage: 0.2, maximumSingleAlphaResidual: 8, endpointTolerance: 2, minimumTwoChannelCoverage: 0.1 };
}
function glyphPaint(image: ImageData, rect: DOMRectReadOnly, foreground: string, background: string) {
    const nearSolid = matchingPixels(image, rect, foreground, 48);
    const surface = matchingPixels(image, rect, background);
    const blended = blendedGlyphInk(image, rect, foreground, background);
    return { passed: (nearSolid.matched > 0 || blended.matched > 0) && surface.ratio >= 0.2, nearSolid, background: surface, blended };
}
function negativeGlyphControls(foreground: string, background: string) {
    const rect = new globalThis.DOMRectReadOnly(0, 0, 6, 6);
    const solid = (color: string) => {
        const image = new globalThis.ImageData(6, 6), channels = colorChannels(color);
        for (let index = 0; index < image.data.length; index += 4) image.data.set(channels, index);
        return glyphPaint(image, rect, foreground, background);
    };
    const emptyBackground = solid(background), solidTextBackplate = solid(foreground);
    if (emptyBackground.passed || solidTextBackplate.passed) throw new Error('Glyph guard accepted missing text or a solid foreground backplate');
    return { emptyBackground, solidTextBackplate };
}
async function inspectPixels(base64: string) {
    const image = await screenshotPixels(base64);
    const labels = tags().map((tag, index) => {
        const bounds = glyphs(tag).rect;
        const style = getComputedStyle(tag);
        // Thin 14px glyphs can consist entirely of antialiased pixels. Require
        // near-solid ink and the actual system fill together; a white backplate
        // still fails the independently strict background check below.
        const foreground = matchingPixels(image, bounds, style.color, 32);
        const background = matchingPixels(image, bounds, style.backgroundColor);
        if (foreground.matched < 3 || background.ratio < 0.25) throw new Error(`Tag ${index} glyphs or selected background are covered by a text backplate`);
        const characterPixels = characters(tag).map(character => {
            const paint = glyphPaint(image, character.rect, style.color, style.backgroundColor);
            if (!paint.passed) throw new Error(`Tag ${index} hides actual character ${character.text}: ${JSON.stringify({ character, paint })}`);
            return { ...character, ...paint };
        });
        return { id: `tag-${index}`, foreground, background, characters: characterPixels, negativeControls: negativeGlyphControls(style.color, style.backgroundColor) };
    });
    const prefix = required<SVGSVGElement>('[data-prefix-icon]');
    const prefixInk = matchingPixels(image, prefix.getBoundingClientRect(), getComputedStyle(prefix).color, 32);
    const close = closeSnapshot();
    const closeInk = matchingPixels(image, close.icon, close.color, 32);
    if (prefixInk.matched < 3 || closeInk.matched < 3) throw new Error('Actual Tag prefix or native close icon is hidden');
    const bounds = close.rect;
    const focusEdges = [
        { x: bounds.x + bounds.width / 2 - 3, y: bounds.y, width: 6, height: 2 },
        { x: bounds.x + bounds.width / 2 - 3, y: bounds.bottom - 2, width: 6, height: 2 },
        { x: bounds.x, y: bounds.y + bounds.height / 2 - 3, width: 2, height: 6 },
        { x: bounds.right - 2, y: bounds.y + bounds.height / 2 - 3, width: 2, height: 6 },
    ].map(edge => ({ rect: edge, ink: matchingPixels(image, edge, close.outline.color, 48) }));
    if (!close.focused || !close.focusVisible || focusEdges.some(edge => edge.ink.matched < 1)) throw new Error('Actual close focus outline is not visible on all four edges');
    return { labels, prefixInk, closeInk, focusEdges };
}
(window as Window & { __tagForced?: unknown }).__tagForced = { prepare, snapshot, inspectPixels };
