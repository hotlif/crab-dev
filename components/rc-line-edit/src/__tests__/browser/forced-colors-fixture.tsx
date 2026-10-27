import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
import LineEdit from '../../../esm/index.mjs';
import { colorChannels, matchingPixels, screenshotPixels } from '../../../../../test/forced-color-pixels.mjs';

const params = new URLSearchParams(location.search);
const designSystem = params.get('designSystem') as 'md3' | 'apple' | 'shadcn';
const colorMode = params.get('colorMode') as 'light' | 'dark';
if (!['md3', 'apple', 'shadcn'].includes(designSystem) || !['light', 'dark'].includes(colorMode)) throw Error('Invalid LineEdit fixture configuration');
const host = document.getElementById('root');
if (!host) throw Error('Missing LineEdit fixture host');
const root = createRoot(host);
const appearances = ['outlined', 'filled'] as const;
function check(condition: unknown, message: string): asserts condition { if (!condition) throw Error(message); }
function required<T extends Element>(selector: string, scope: ParentNode = document): T {
    const elements = scope.querySelectorAll<T>(selector);
    check(elements.length === 1, `Expected one ${selector}; got ${elements.length}`);
    return elements[0]!;
}
function scene() {
    return <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
        <main style={{ display: 'grid', gap: 32, padding: 48, width: 320 }}>
            <span data-system-pair="disabled" aria-hidden="true"
                style={{ color: 'GrayText', backgroundColor: 'Canvas', forcedColorAdjust: 'none' }} />
            {appearances.map(appearance => <LineEdit key={appearance} appearance={appearance}
                aria-label={`Disabled ${appearance} value`} data-subject={appearance} value="30" disabled />)}
        </main>
    </ConfigProvider>;
}
function valueRegion(input: HTMLInputElement, control: HTMLElement) {
    const rect = input.getBoundingClientRect(), outer = control.getBoundingClientRect(), style = getComputedStyle(input);
    const pixels = (value: string) => { const result = Number.parseFloat(value); check(Number.isFinite(result), `Unresolved native input geometry: ${value}`); return result; };
    const left = rect.left + pixels(style.borderLeftWidth) + pixels(style.paddingLeft);
    const right = rect.right - pixels(style.borderRightWidth) - pixels(style.paddingRight);
    const top = rect.top + pixels(style.borderTopWidth) + pixels(style.paddingTop);
    const bottom = rect.bottom - pixels(style.borderBottomWidth) - pixels(style.paddingBottom);
    const lineHeight = pixels(style.lineHeight), fontSize = pixels(style.fontSize);
    const lineTop = top + Math.max(0, (bottom - top - lineHeight) / 2);
    // Native input.value has no DOM Text node. This is its measured content
    // band, not a fabricated Range or a claim of individual glyph geometry.
    // Keep the ROI inside the actual content and away from all control edges.
    const x = Math.max(left, outer.left + 4), y = Math.max(lineTop, outer.top + 4);
    const width = Math.min(right, outer.right - 4) - x;
    const height = Math.min(bottom, lineTop + lineHeight, outer.bottom - 4) - y;
    check(width > fontSize * 4 && height >= fontSize, 'Native value content band is too small');
    return { rect: { x, y, width, height }, fontSize, lineHeight, fontFamily: style.fontFamily,
        padding: style.padding, border: style.borderWidth, textAlign: style.textAlign, direction: style.direction };
}
function snapshot() {
    return { href: location.href, forcedColors: matchMedia('(forced-colors: active)').matches,
        viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight, dpr: globalThis.devicePixelRatio },
        subjects: appearances.map(id => {
            const input = required<HTMLInputElement>(`input[data-subject="${id}"]`);
            const control = input.closest<HTMLElement>('[data-field-control]');
            check(control, 'Missing actual LineEdit control');
            const boundary = input.closest('[data-crab-design][data-theme]');
            check(boundary, 'Missing actual configuration boundary');
            const style = getComputedStyle(input), controlStyle = getComputedStyle(control);
            return { id, rect: input.getBoundingClientRect().toJSON(), controlRect: control.getBoundingClientRect().toJSON(),
                config: { designSystem: boundary.getAttribute('data-crab-design'), colorMode: boundary.getAttribute('data-theme') },
                disabled: input.disabled, ariaDisabled: control.getAttribute('aria-disabled'), value: input.value,
                type: input.type, scrollLeft: input.scrollLeft, childNodes: input.childNodes.length,
                focused: document.activeElement === input, color: style.color, opacity: style.opacity,
                controlOpacity: controlStyle.opacity, forcedColorAdjust: style.forcedColorAdjust,
                controlForcedColorAdjust: controlStyle.forcedColorAdjust, region: valueRegion(input, control) };
        }) };
}
function validate() {
    const actual = snapshot(), reference = getComputedStyle(required<HTMLElement>('[data-system-pair="disabled"]'));
    check(actual.forcedColors, 'Actual forced-colors media is required');
    const foreground = colorChannels(reference.color), background = colorChannels(reference.backgroundColor);
    check(foreground.some((channel, index) => index < 3 && channel !== background[index]), 'System disabled pair has no contrast');
    for (const item of actual.subjects) {
        check(item.config.designSystem === designSystem && item.config.colorMode === colorMode, 'Actual LineEdit configuration changed');
        check(item.disabled && item.ariaDisabled === 'true' && item.value === '30' && item.type === 'text', `Native disabled value changed: ${item.id}`);
        check(!item.focused && item.scrollLeft === 0 && item.childNodes === 0, 'Value must remain an unfocused native input');
        check(item.controlOpacity === '1' && item.opacity === '1', `Disabled system color was attenuated: ${item.id}`);
        check(item.color === reference.color && item.forcedColorAdjust === 'auto' && item.controlForcedColorAdjust === 'auto', `Native GrayText or automatic adjustment lost: ${item.id}`);
        check(item.region.direction === 'ltr' && ['start', 'left'].includes(item.region.textAlign), 'Unexpected native value alignment');
        const control = required<HTMLInputElement>(`input[data-subject="${item.id}"]`).closest<HTMLElement>('[data-field-control]')!;
        check(!control.querySelector('label, fieldset, button, svg, [data-field-prefix], [data-field-suffix]'), 'Value ROI must not include labels, borders or accessory glyphs');
    }
    return actual;
}
async function prepare() {
    check(matchMedia('(forced-colors: active)').matches, 'Actual forced-colors media is required');
    flushSync(() => root.render(scene()));
    await document.fonts.ready;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    return validate();
}
async function inspectPixels(base64: string) {
    const image = await screenshotPixels(base64), actual = validate();
    const reference = getComputedStyle(required<HTMLElement>('[data-system-pair="disabled"]'));
    return actual.subjects.map(item => {
        // Native antialiasing can leave no fully solid foreground pixel. The
        // independent Canvas backdrop check stays strict to detect backplates.
        const foreground = matchingPixels(image, item.region.rect, reference.color, 32);
        const background = matchingPixels(image, item.region.rect, reference.backgroundColor);
        check(foreground.matched >= 4 && background.ratio > 0.5, `Actual disabled native value lost GrayText ink or its Canvas backdrop: ${item.id}`);
        return { id: item.id, method: 'native-value-content-ROI', value: item.value, region: item.region, foreground, background };
    });
}
Object.assign(window, { __lineEditForced: { prepare, snapshot, inspectPixels } });
