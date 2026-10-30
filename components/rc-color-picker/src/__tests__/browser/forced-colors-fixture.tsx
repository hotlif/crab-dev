import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
import ColorPicker, { ColorPickerPanel } from '../../../esm/index.mjs';
import token from '../../token.js';
import compiledCss from '../../../.cache/browser-css.json';
import { matchingPixels, screenshotPixels } from '../../../../../test/forced-color-pixels.mjs';

const params = new URLSearchParams(location.search);
const designSystem = params.get('designSystem') as 'md3' | 'apple' | 'shadcn';
const colorMode = params.get('colorMode') as 'light' | 'dark';
if (!['md3', 'apple', 'shadcn'].includes(designSystem) || !['light', 'dark'].includes(colorMode)) throw new Error('Invalid forced-color fixture configuration');
const host = document.getElementById('root');
if (!host) throw new Error('Missing fixture host');
const root = createRoot(host);
const colors = [255, 145, 30].map(hue => ({ lightness: 0.62, chroma: 0.19, hue, alpha: 1 }));
const triggerSamples = [
    ...colors.map((value, index) => ({ id: `opaque-${index}`, label: `Opaque ${index + 1}`, value, disabled: false })),
    { id: 'alpha-half', label: 'Alpha 0.5', value: { lightness: 0.62, chroma: 0.19, hue: 255, alpha: 0.5 }, disabled: false },
    { id: 'alpha-zero', label: 'Alpha 0', value: { lightness: 0.62, chroma: 0.19, hue: 255, alpha: 0 }, disabled: false },
    { id: 'disabled-opaque', label: 'Disabled opaque', value: { lightness: 0.62, chroma: 0.19, hue: 255, alpha: 1 }, disabled: true },
    { id: 'disabled-alpha', label: 'Disabled alpha 0.5', value: { lightness: 0.62, chroma: 0.19, hue: 255, alpha: 0.5 }, disabled: true },
];
let openNotifications = 0;
function triggers() { return [...document.querySelectorAll<HTMLElement>('[data-trigger]')]; }
function swatches() {
    return triggers().map(trigger => {
        if (!(trigger.firstElementChild instanceof HTMLElement)) throw new Error('Missing trigger data swatch');
        return trigger.firstElementChild;
    });
}
function canvasSurface() {
    const surface = document.querySelector<HTMLElement>('[data-trigger-surface]');
    if (!surface) throw new Error('Missing actual Canvas surface');
    return surface;
}
function expectedColor(index: number) {
    const sample = triggerSamples[index];
    if (!sample) throw new Error('Missing trigger sample');
    const { lightness, chroma, hue, alpha } = sample.value;
    return `oklch(${lightness} ${chroma} ${hue}${alpha === 1 ? '' : ` / ${alpha}`})`;
}
function compositeColor(color: string, background: string) {
    // Browser Canvas resolves the actual CSS color and alpha over the measured
    // Canvas surface. There is no product checkerboard or opaque-color fiction.
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Missing alpha-compositing reference');
    context.fillStyle = background;
    context.fillRect(0, 0, 1, 1);
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    const rgba = [...context.getImageData(0, 0, 1, 1).data];
    if (rgba[3] !== 255) throw new Error('Measured Canvas base must be opaque');
    return { css: `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`, rgba };
}
function panels() { return [...document.querySelectorAll<HTMLElement>('[data-panel]')]; }
function focusTokenGeometry(reference: HTMLElement) {
    // Resolve the generated L3 roles in the same inherited boundary as the real
    // trigger. This reference never receives focus, never changes product CSS,
    // and is removed before any further snapshot or pixel inspection.
    const probe = reference.ownerDocument.createElement('span');
    Object.assign(probe.style, { position: 'fixed', visibility: 'hidden', pointerEvents: 'none',
        outlineStyle: 'solid', outlineWidth: token.trigger.ring['width-focus'],
        outlineOffset: token.trigger.ring['outline-offset-focus'] });
    reference.append(probe);
    try {
        const style = getComputedStyle(probe);
        const geometry = { width: style.outlineWidth, offset: style.outlineOffset,
            widthPx: Number.parseFloat(style.outlineWidth), offsetPx: Number.parseFloat(style.outlineOffset) };
        if (!Number.isFinite(geometry.widthPx) || geometry.widthPx < 2 || !Number.isFinite(geometry.offsetPx) || geometry.offsetPx < 0) throw new Error('Invalid focus geometry tokens');
        return geometry;
    } finally { probe.remove(); }
}
function previews() {
    return panels().map(panel => {
        if (!(panel.firstElementChild instanceof HTMLElement)) throw new Error('Missing selected-color preview');
        return panel.firstElementChild;
    });
}
function snapshot() {
    return { href: location.href, forcedColors: matchMedia('(forced-colors: active)').matches,
        viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight, dpr: globalThis.devicePixelRatio },
        openNotifications,
        surface: { color: getComputedStyle(canvasSurface()).backgroundColor, rect: canvasSurface().getBoundingClientRect().toJSON() },
        subjects: [
            ...previews().map((preview, index) => ({ id: `preview-${index}`, rect: preview.getBoundingClientRect().toJSON(),
                color: getComputedStyle(preview).backgroundColor, forcedColorAdjust: getComputedStyle(preview).forcedColorAdjust })),
            ...swatches().map((swatch, index) => {
                const trigger = triggers()[index];
                if (!trigger) throw new Error('Missing swatch trigger');
                const style = getComputedStyle(trigger);
                return { id: `swatch-${triggerSamples[index].id}`, rect: swatch.getBoundingClientRect().toJSON(),
                    color: getComputedStyle(swatch).backgroundColor, forcedColorAdjust: getComputedStyle(swatch).forcedColorAdjust,
                    trigger: { rect: trigger.getBoundingClientRect().toJSON(), forcedColorAdjust: style.forcedColorAdjust, opacity: style.opacity,
                        backgroundColor: style.backgroundColor, borderColor: style.borderTopColor, outlineColor: style.outlineColor,
                        outlineWidth: style.outlineWidth, outlineOffset: style.outlineOffset, focused: document.activeElement === trigger,
                        focusVisible: trigger.matches(':focus-visible'), disabled: trigger.getAttribute('aria-disabled'),
                        expanded: trigger.getAttribute('aria-expanded'), tabIndex: trigger.tabIndex } };
            }),
        ] };
}
async function prepare() {
    flushSync(() => root.render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
        <style>{compiledCss}</style>
        <div data-trigger-surface="" style={{ display: 'flex', gap: 24, padding: 32, backgroundColor: 'Canvas' }}>
            {triggerSamples.map(sample => <div key={sample.id} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
                <span data-system-label={sample.id} style={{ color: sample.disabled ? 'GrayText' : undefined }}>{sample.label}</span>
                <ColorPicker data-trigger={sample.id} aria-label={sample.label} value={sample.value} disabled={sample.disabled}
                    onOpenChange={() => { openNotifications++; }} />
            </div>)}
        </div>
        <div style={{ display: 'flex', gap: 24, padding: '0 32px 32px' }}>
            {colors.map((value, index) => <div key={value.hue} style={{ width: 320 }}>
                <ColorPickerPanel data-panel={index} value={value} showEyeDropper={false} showAlpha={false} />
            </div>)}
        </div>
    </ConfigProvider>));
    await document.fonts.ready;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    if (!matchMedia('(forced-colors: active)').matches || previews().length !== 3) throw new Error('Actual forced-color previews required');
    for (const [index, preview] of previews().entries()) {
        if (getComputedStyle(preview).forcedColorAdjust !== 'none') throw new Error('Selected color lost data-color preservation');
        if (getComputedStyle(panels()[index]).forcedColorAdjust !== 'auto') throw new Error('Do not opt out the entire color panel');
        const actual = getComputedStyle(preview).backgroundColor;
        if (actual !== `oklch(0.62 0.19 ${colors[index].hue})`) throw new Error(`Selected color changed: ${actual}`);
    }
    if (triggers().length !== triggerSamples.length) throw new Error('Missing real published triggers');
    for (const [index, trigger] of triggers().entries()) {
        const sample = triggerSamples[index], swatch = swatches()[index];
        if (!sample || !swatch) throw new Error('Missing trigger sample');
        if (getComputedStyle(trigger).forcedColorAdjust !== 'auto') throw new Error('Do not opt out the entire input');
        if (getComputedStyle(swatch).forcedColorAdjust !== 'none' || getComputedStyle(swatch).backgroundColor !== expectedColor(index)) throw new Error('Trigger lost original data color or alpha');
        if (getComputedStyle(trigger).opacity !== '1') throw new Error('Parent opacity must not fade forced-color data');
        if (sample.disabled) {
            if (trigger.getAttribute('aria-disabled') !== 'true' || trigger.tabIndex !== -1) throw new Error('Disabled semantics changed');
            const label = document.querySelector<HTMLElement>(`[data-system-label="${sample.id}"]`);
            // The fixture label resolves real system GrayText without overriding input CSS.
            if (!(label instanceof HTMLElement)) throw new Error('Missing disabled system-color witness');
            const border = getComputedStyle(trigger), grayText = getComputedStyle(label).color;
            if ([border.borderTopColor, border.borderRightColor, border.borderBottomColor, border.borderLeftColor].some(color => color !== grayText)) throw new Error('Disabled boundary must use system GrayText');
            // DOM activation checks the disabled handler; this is not a native-pointer claim.
            trigger.click();
            if (trigger.getAttribute('aria-expanded') !== 'false') throw new Error('Disabled trigger opened');
        }
    }
    const focused = triggers()[0];
    if (!focused) throw new Error('Missing enabled focus target');
    focused.focus();
    if (document.activeElement !== focused || !focused.matches(':focus-visible') || openNotifications !== 0) throw new Error('Real focus or disabled activation contract failed');
    return snapshot();
}
async function inspectPixels(base64: string) {
    const image = await screenshotPixels(base64);
    if (openNotifications !== 0 || triggers().some(trigger => trigger.getAttribute('aria-expanded') !== 'false')) throw new Error('Screenshot changed the closed trigger contract');
    const previewPixels = previews().map((preview, index) => {
        const bounds = preview.getBoundingClientRect();
        const color = getComputedStyle(preview).backgroundColor;
        const sample = matchingPixels(image, { x: bounds.x + bounds.width / 3, y: bounds.y + bounds.height / 3,
            width: bounds.width / 3, height: bounds.height / 3 }, color);
        if (sample.ratio < 0.98) throw new Error(`Preview ${index} does not paint its actual selected color`);
        return { id: `preview-${index}`, color, ...sample };
    });
    const surface = canvasSurface(), background = getComputedStyle(surface).backgroundColor;
    const surfaceBounds = surface.getBoundingClientRect();
    const surfacePixels = matchingPixels(image, { x: surfaceBounds.left + 4, y: surfaceBounds.top + 4, width: 12, height: 12 }, background, 2);
    if (surfacePixels.ratio !== 1) throw new Error('Actual Canvas base does not match compositing reference');
    const triggerPixels = swatches().map((swatch, index) => {
        const trigger = triggers()[index], sample = triggerSamples[index];
        if (!trigger || !sample) throw new Error('Missing trigger pixel subject');
        const bounds = swatch.getBoundingClientRect();
        const expected = compositeColor(expectedColor(index), background);
        const pixels = matchingPixels(image, { x: bounds.x + bounds.width / 4, y: bounds.y + bounds.height / 4,
            width: bounds.width / 2, height: bounds.height / 2 }, expected.css, 2);
        if (pixels.ratio !== 1) throw new Error(`Trigger ${sample.id} data color/alpha was replaced or faded: ${JSON.stringify(pixels)}`);
        const triggerBounds = trigger.getBoundingClientRect();
        // At this launcher's verified DPR 1, the actual 1px CSS border is rasterized
        // on the nearest integer column. A fractional width-1 ROI has no complete
        // pixels under ceil/floor sampling. Original six-image RGBA confirmed the
        // rounded column is GrayText, while its neighbor is Canvas; never search
        // a wider region or borrow background pixels to satisfy this assertion.
        const disabledBorder = sample.disabled ? matchingPixels(image, { x: Math.round(triggerBounds.left), y: triggerBounds.top + triggerBounds.height / 3,
            width: 1, height: triggerBounds.height / 3 }, getComputedStyle(trigger).borderLeftColor, 2) : null;
        if (disabledBorder && disabledBorder.ratio < 0.9) throw new Error('Disabled system boundary is not painted');
        return { id: `swatch-${sample.id}`, sourceColor: expectedColor(index), alpha: sample.value.alpha,
            disabled: sample.disabled, actualCanvas: background, compositedRgba: expected.rgba, disabledBorder, ...pixels };
    });
    const focused = triggers()[0];
    if (!focused || !focused.matches(':focus-visible') || document.activeElement !== focused) throw new Error('Focus lost before pixel check');
    const b = focused.getBoundingClientRect(), style = getComputedStyle(focused);
    const expectedFocus = focusTokenGeometry(focused);
    if (style.outlineWidth !== expectedFocus.width || style.outlineOffset !== expectedFocus.offset) throw new Error(`Unexpected real input focus geometry: ${JSON.stringify({ expected: expectedFocus, outlineWidth: style.outlineWidth, outlineOffset: style.outlineOffset, focused: document.activeElement === focused, focusVisible: focused.matches(':focus-visible'), rect: b.toJSON() })}`);
    const width = expectedFocus.widthPx, offset = expectedFocus.offsetPx;
    const focusEdges = [
        { x: b.left - offset - width, y: b.top + b.height / 3, width, height: b.height / 3 },
        { x: b.right + offset, y: b.top + b.height / 3, width, height: b.height / 3 },
        { x: b.left + b.width / 3, y: b.top - offset - width, width: b.width / 3, height: width },
        { x: b.left + b.width / 3, y: b.bottom + offset, width: b.width / 3, height: width },
    ].map(rect => ({ rect, ...matchingPixels(image, rect, style.outlineColor, 2) }));
    if (focusEdges.some(edge => edge.ratio < 0.9)) throw new Error('Input system focus outline is not visible on every side');
    return { previewPixels, surfacePixels, triggerPixels, focusGeometry: expectedFocus, focusEdges,
        limits: ['Native browser focus via HTMLElement.focus; no OS Tab or physical pointer claim.', 'Alpha samples composite over the measured Canvas surface; product has no checkerboard.'] };
}
(window as Window & { __colorForced?: unknown }).__colorForced = { prepare, snapshot, inspectPixels };
