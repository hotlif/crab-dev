import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Switch from '../../../esm/index.mjs';
import { colorChannels, matchingPixels, screenshotPixels } from '../../../../../test/forced-color-pixels.mjs';

const params = new URLSearchParams(location.search);
const designSystem = params.get('designSystem') as 'md3' | 'apple' | 'shadcn';
const colorMode = params.get('colorMode') as 'light' | 'dark';
if (!['md3', 'apple', 'shadcn'].includes(designSystem) || !['light', 'dark'].includes(colorMode)) throw new Error('Invalid forced-color fixture configuration');
const host = document.getElementById('root');
if (!host) throw new Error('Missing fixture host');
const root = createRoot(host);
const directions = ['ltr', 'rtl'] as const;
const focusDirection = colorMode === 'light' ? 'ltr' : 'rtl';
const cases = directions.flatMap(direction => [false, true].flatMap(disabled => [false, true].map(checked => ({
    id: `${direction}-${disabled ? 'disabled' : 'enabled'}-${checked ? 'checked' : 'unchecked'}`,
    direction, disabled, checked, focused: false,
}))));
cases.push({ id: 'focus-checked', direction: focusDirection, disabled: false, checked: true, focused: true });
const sameColor = (first: string, second: string) => colorChannels(first).join(',') === colorChannels(second).join(',');
function required<T extends Element>(selector: string, scope: ParentNode = document): T {
    const found = scope.querySelectorAll<T>(selector);
    if (found.length !== 1) throw new Error(`Expected one ${selector}; got ${found.length}`);
    return found[0];
}
function subjects() {
    return cases.map(specification => {
        const track = required<HTMLButtonElement>(`[data-switch-case="${specification.id}"]`);
        const thumb = required<HTMLElement>(':scope > span', track);
        return { specification, track, thumb };
    });
}
function pair(specification: typeof cases[number]) {
    const reference = getComputedStyle(required('[data-system="' + (specification.disabled ? 'disabled' : specification.checked ? 'checked' : 'unchecked') + '"]'));
    return { track: reference.backgroundColor, thumb: reference.color };
}
function snapshot() {
    return { href: location.href, forcedColors: matchMedia('(forced-colors: active)').matches,
        viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight, dpr: globalThis.devicePixelRatio },
        focusMethod: 'Native DOM focus with focusVisible requested; not a trusted keyboard or native hover test',
        subjects: subjects().map(({ specification, track, thumb }) => ({ id: specification.id,
            rect: track.getBoundingClientRect().toJSON(), glyphs: [{ rect: thumb.getBoundingClientRect().toJSON() }],
            checked: track.getAttribute('aria-checked'), disabled: track.disabled,
            activeElement: document.activeElement === track, focusVisible: track.matches(':focus-visible'), hover: track.matches(':hover'),
            trackColor: getComputedStyle(track).backgroundColor, thumbColor: getComputedStyle(thumb).backgroundColor,
            direction: getComputedStyle(track).direction, outlineColor: getComputedStyle(track).outlineColor,
            outlineWidth: getComputedStyle(track).outlineWidth, outlineOffset: getComputedStyle(track).outlineOffset,
            stateLayer: getComputedStyle(track, '::after').content })) };
}
async function prepare() {
    flushSync(() => root.render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
        <main style={{ height: 720, background: 'Canvas', color: 'CanvasText' }}>
            <span data-system="unchecked" style={{ color: 'CanvasText', background: 'Canvas', forcedColorAdjust: 'none' }} />
            <span data-system="checked" style={{ color: 'HighlightText', background: 'Highlight', forcedColorAdjust: 'none' }} />
            <span data-system="disabled" style={{ color: 'GrayText', background: 'Canvas', forcedColorAdjust: 'none' }} />
            {cases.map((item, index) => <ConfigProvider key={item.id} direction={item.direction}>
                <div style={{ position: 'absolute', left: index === 8 ? 80 : 80 + Math.floor(index / 4) * 600,
                    top: index === 8 ? 520 : 50 + (index % 4) * 100, width: 400 }}>
                    <Switch data-switch-case={item.id} checked={item.checked} disabled={item.disabled}>{item.id}</Switch>
                </div>
            </ConfigProvider>)}
        </main>
    </ConfigProvider>));
    await document.fonts.ready;
    // Request the browser's visible-focus mode, independent of its last-input
    // heuristic. This is native DOM focus, not trusted Tab or pointer hover.
    required<HTMLElement>('[data-switch-case="focus-checked"]').focus({ preventScroll: true, focusVisible: true });
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    await Promise.all(document.getAnimations().filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity).map(animation => animation.finished));
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    if (!matchMedia('(forced-colors: active)').matches) throw new Error('Native forced-color media is required');
    for (const { specification, track, thumb } of subjects()) {
        const expected = pair(specification), trackStyle = getComputedStyle(track), thumbStyle = getComputedStyle(thumb);
        if (track.getAttribute('aria-checked') !== String(specification.checked) || track.disabled !== specification.disabled) throw new Error(`State lost: ${specification.id}`);
        if (trackStyle.direction !== specification.direction) throw new Error(`Direction lost: ${specification.id}`);
        if (!sameColor(trackStyle.backgroundColor, expected.track) || !sameColor(thumbStyle.backgroundColor, expected.thumb)) throw new Error(`System track/thumb pair overwritten: ${specification.id}`);
        if (sameColor(expected.track, expected.thumb)) throw new Error('System palette must distinguish the thumb and track');
        if (getComputedStyle(track, '::after').content !== 'none') throw new Error('Theme state-layer paint remains in forced colors');
        const rail = track.getBoundingClientRect(), handle = thumb.getBoundingClientRect();
        const rightHalf = handle.x + handle.width / 2 > rail.x + rail.width / 2;
        if (rightHalf !== (specification.checked !== (specification.direction === 'rtl'))) throw new Error(`Thumb is on the wrong logical side: ${specification.id}`);
        if (handle.left < rail.left || handle.right > rail.right || handle.top < rail.top || handle.bottom > rail.bottom) throw new Error(`Thumb exceeds the track: ${specification.id}`);
        if (specification.focused && (document.activeElement !== track || !track.matches(':focus-visible') || Number.parseFloat(trackStyle.outlineWidth) <= 0)) throw new Error('Actual focus-visible regression was not exercised');
    }
    return snapshot();
}
async function inspectPixels(base64: string) {
    const image = await screenshotPixels(base64);
    return subjects().map(({ specification, track, thumb }) => {
        const expected = pair(specification), rail = track.getBoundingClientRect(), handle = thumb.getBoundingClientRect();
        const thumbSample = matchingPixels(image, { x: handle.x + handle.width / 4, y: handle.y + handle.height / 4,
            width: handle.width / 2, height: handle.height / 2 }, expected.thumb);
        if (thumbSample.ratio < 0.98) throw new Error(`Actual thumb pixels are hidden or recolored: ${specification.id}`);
        const thumbOnRight = handle.x + handle.width / 2 > rail.x + rail.width / 2;
        const trackX = thumbOnRight ? rail.left + rail.height / 2 : rail.right - rail.height / 2;
        const trackSample = matchingPixels(image, { x: trackX - 1, y: rail.y + rail.height / 2 - 1, width: 2, height: 2 }, expected.track);
        if (trackSample.ratio < 0.98) throw new Error(`Actual track pixels do not preserve the system pair: ${specification.id}`);
        let focusSample: ReturnType<typeof matchingPixels> | undefined;
        if (specification.focused) {
            const style = getComputedStyle(track), width = Number.parseFloat(style.outlineWidth), offset = Number.parseFloat(style.outlineOffset);
            focusSample = matchingPixels(image, { x: rail.x + rail.width / 2 - 2, y: rail.top - offset - width, width: 4, height: width }, style.outlineColor);
            if (focusSample.ratio < 0.8 || document.activeElement !== track || !track.matches(':focus-visible')) throw new Error('Actual focus outline pixels or focused state disappeared');
        }
        return { id: specification.id, expected, thumbSample, trackSample, focusSample };
    });
}
(window as Window & { __switchForced?: unknown }).__switchForced = { prepare, snapshot, inspectPixels };
