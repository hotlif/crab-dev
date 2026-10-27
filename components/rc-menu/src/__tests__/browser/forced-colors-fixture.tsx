import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Menu, { MenuItemType } from '../../../esm/index.mjs';
import { colorChannels, matchingPixels, screenshotPixels } from '../../../../../test/forced-color-pixels.mjs';

const params = new URLSearchParams(location.search);
const designSystem = params.get('designSystem') as 'md3' | 'apple' | 'shadcn';
const colorMode = params.get('colorMode') as 'light' | 'dark';
if (!['md3', 'apple', 'shadcn'].includes(designSystem) || !['light', 'dark'].includes(colorMode)) throw new Error('Invalid forced-color fixture configuration');
const host = document.getElementById('root');
if (!host) throw new Error('Missing fixture host');
const root = createRoot(host);
const directions = ['ltr', 'rtl'] as const;
const leaf = (key: string, title: string) => ({ type: MenuItemType.Item, key, title });
const verticalItems = [
    { ...leaf('closed', 'Closed branch'), children: [leaf('hidden', 'Hidden leaf')] },
    { ...leaf('open', 'Open branch'), children: [leaf('child', 'Visible leaf')] },
    leaf('current', 'Current leaf'),
];
const horizontalItems = [leaf('current', 'Current'), leaf('idle', 'Idle'), {
    ...leaf('root', 'Branches'), children: [
        { ...leaf('nested-current', 'Current branch'), children: [leaf('nested-leaf', 'Child')] },
        { ...leaf('nested-idle', 'Idle branch'), children: [leaf('other-leaf', 'Other child')] },
    ],
}];
const specifications = [
    { mode: 'vertical', text: 'Closed branch', arrow: true, expanded: false, selected: false },
    { mode: 'vertical', text: 'Open branch', arrow: true, expanded: true, selected: false },
    { mode: 'vertical', text: 'Current leaf', arrow: false, selected: true },
    { mode: 'horizontal', text: 'Current', arrow: false, selected: true },
    { mode: 'horizontal', text: 'Idle', arrow: false, selected: false },
    { mode: 'horizontal', text: 'Branches', arrow: false, expanded: true, selected: false },
    { mode: 'horizontal', text: 'Current branch', arrow: true, expanded: false, selected: true },
    { mode: 'horizontal', text: 'Idle branch', arrow: true, expanded: false, selected: false },
] as const;

function subjects() {
    return directions.flatMap(direction => specifications.map(specification => {
        const scope = document.querySelector(`[data-scene="${direction}-${specification.mode}"]`);
        if (!scope) throw new Error('Missing actual menu scene');
        const rows = [...scope.querySelectorAll<HTMLElement>('[data-menu-item]')].filter(row => row.textContent?.trim() === specification.text);
        if (rows.length !== 1) throw new Error(`Menu row is not unique: ${direction}/${specification.text}`);
        const row = rows[0];
        const title = [...row.children].find(child => child.textContent === specification.text);
        if (!title) throw new Error('Missing actual menu title');
        const range = document.createRange();
        range.selectNodeContents(title);
        const arrow = row.querySelector<HTMLElement>('i');
        if (Boolean(arrow) !== specification.arrow) throw new Error('Actual menu arrow does not match its branch');
        return { id: `${direction}-${specification.mode}-${specification.text}`, direction, specification, row, arrow,
            titleRect: range.getBoundingClientRect() };
    }));
}

function surface(element: Element): string {
    const background = getComputedStyle(element).backgroundColor;
    if (colorChannels(background)[3] > 0) return background;
    if (element.parentElement) return surface(element.parentElement);
    throw new Error('Missing painted fixture surface');
}

function separatorRegion(row: HTMLElement) {
    const menu = row.closest('ul');
    if (!menu) throw new Error('Missing actual horizontal menu root');
    const rootRect = menu.getBoundingClientRect(), rowRect = row.getBoundingClientRect();
    // The open submenu legitimately paints over part of the root separator.
    // Sample under the idle sibling, not at the root midpoint under that popup.
    const rect = new globalThis.DOMRect(Math.ceil(rowRect.x + rowRect.width / 2) - 6, rootRect.bottom - 1, 12, 1);
    if (document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2) !== menu) {
        throw new Error('Separator sample is covered by another actual element');
    }
    return { rect, rootRect };
}

function horizontalSpacing(row: HTMLElement, titleRect: DOMRect, arrow: HTMLElement | null) {
    const style = getComputedStyle(row), rect = row.getBoundingClientRect();
    const rtl = style.direction === 'rtl';
    const paddingStart = Number.parseFloat(style.paddingInlineStart), paddingEnd = Number.parseFloat(style.paddingInlineEnd);
    const textStart = rtl ? rect.right - titleRect.right : titleRect.left - rect.left;
    const textEnd = rtl ? titleRect.left - rect.left : rect.right - titleRect.right;
    const slot = arrow?.parentElement?.getBoundingClientRect();
    const slotEnd = slot ? (rtl ? slot.left - rect.left : rect.right - slot.right) : null;
    if (paddingEnd <= 0 || Math.abs(paddingStart - paddingEnd) > 0.5 || textStart < paddingStart - 0.5 || textEnd < paddingEnd - 0.5) {
        throw new Error(`Horizontal text touches its container: ${JSON.stringify({ paddingStart, paddingEnd, textStart, textEnd })}`);
    }
    if (slotEnd !== null && Math.abs(slotEnd - paddingEnd) > 0.5) throw new Error('Arrow slot duplicates or consumes the logical end inset');
    return { paddingStart, paddingEnd, textStart, textEnd, slotEnd };
}

function snapshot() {
    return { href: location.href, forcedColors: matchMedia('(forced-colors: active)').matches,
        viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight, dpr: globalThis.devicePixelRatio },
        subjects: subjects().map(({ id, row, arrow, titleRect, specification }) => ({ id, rect: row.getBoundingClientRect().toJSON(),
            selected: row.getAttribute('aria-current'), expanded: row.getAttribute('aria-expanded'),
            color: getComputedStyle(row).color, surface: surface(row),
            inlineSpacing: specification.mode === 'horizontal' ? horizontalSpacing(row, titleRect, arrow) : null,
            glyphs: [{ rect: titleRect.toJSON() }, ...(arrow ? [{ rect: arrow.getBoundingClientRect().toJSON() }] : []),
                ...(specification.text === 'Idle' ? [{ rect: separatorRegion(row).rootRect.toJSON() }, { rect: separatorRegion(row).rect.toJSON() }] : [])] })) };
}

async function prepare() {
    flushSync(() => root.render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
        <div style={{ minHeight: 720, background: 'Canvas', color: 'CanvasText' }}>
            {directions.map((direction, index) => <ConfigProvider key={direction} direction={direction}>
                <div data-scene={`${direction}-vertical`} style={{ position: 'absolute', left: 40 + index * 640, top: 40, width: 300 }}>
                    <Menu items={verticalItems} selectedKeys={['current']} openKeys={['open']} />
                </div>
                <div data-scene={`${direction}-horizontal`} style={{ position: 'absolute', left: 40 + index * 640, top: 320, width: 500 }}>
                    <Menu mode="horizontal" items={horizontalItems} selectedKeys={['current', 'nested-current']} openKeys={['root']} />
                </div>
            </ConfigProvider>)}
        </div>
    </ConfigProvider>));
    await document.fonts.ready;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    // Wait for natural finite effects; never finish/cancel or disable motion.
    await Promise.all(document.getAnimations().filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity).map(animation => animation.finished));
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    if (!matchMedia('(forced-colors: active)').matches) throw new Error('Native forced-color media is required');
    for (const { id, row, arrow, specification, direction } of subjects()) {
        if (getComputedStyle(row).direction !== direction) throw new Error(`Direction lost: ${id}`);
        if ((row.getAttribute('aria-current') === 'page') !== specification.selected) throw new Error(`Selection lost: ${id}`);
        if (getComputedStyle(row).forcedColorAdjust !== (specification.selected ? 'none' : 'auto')) throw new Error(`System color adjustment escaped its selected scope: ${id}`);
        if ('expanded' in specification && row.getAttribute('aria-expanded') !== String(specification.expanded)) throw new Error(`Expansion lost: ${id}`);
        if (arrow) {
            for (const pseudo of ['::before', '::after']) {
                const stroke = getComputedStyle(arrow, pseudo);
                if (Number.parseFloat(stroke.borderTopWidth) <= 0 || stroke.borderTopStyle !== 'solid') throw new Error(`Missing real system-color stroke: ${id}`);
            }
        }
        if (specification.mode === 'horizontal') {
            const item = row.parentElement;
            if (!item || Number.parseFloat(getComputedStyle(item).borderBottomWidth) !== 0) throw new Error(`An item-level underline remains: ${id}`);
        }
    }
    return snapshot();
}

// Count antialiased ink from the original screenshot along the actual foreground /
// background color segment. Diagonal 1px strokes need not contain an opaque pixel.
function inkPixels(image: ImageData, rect: Pick<DOMRectReadOnly, 'x' | 'y' | 'width' | 'height'>, foreground: string, background: string) {
    const ink = colorChannels(foreground), paper = colorChannels(background);
    const vector = ink.slice(0, 3).map((channel, index) => channel - paper[index]);
    const length = vector.reduce((sum, channel) => sum + channel * channel, 0);
    if (length < 1024) throw new Error('Stroke and surface do not have visible contrast');
    let count = 0;
    for (let y = Math.ceil(rect.y); y < Math.floor(rect.y + rect.height); y++) {
        for (let x = Math.ceil(rect.x); x < Math.floor(rect.x + rect.width); x++) {
            const offset = (y * image.width + x) * 4;
            const delta = vector.map((_, index) => image.data[offset + index] - paper[index]);
            const alpha = delta.reduce((sum, channel, index) => sum + channel * vector[index], 0) / length;
            if (alpha >= 0.2 && alpha <= 1.05 && delta.every((channel, index) => Math.abs(channel - alpha * vector[index]) < 18)) count++;
        }
    }
    return count;
}

async function inspectPixels(base64: string) {
    const image = await screenshotPixels(base64);
    return subjects().map(({ id, row, arrow, titleRect, specification }) => {
        const background = surface(row), foreground = getComputedStyle(row).color;
        if (specification.selected && row.parentElement && colorChannels(background).join(',') === colorChannels(surface(row.parentElement)).join(',')) {
            throw new Error(`Selected container is indistinguishable from its surroundings: ${id}`);
        }
        const textInk = inkPixels(image, titleRect, foreground, background);
        const textPaper = matchingPixels(image, titleRect, background);
        if (textInk < 3 || textPaper.ratio < 0.25) throw new Error(`Unreadable menu label or forced text backplate: ${id}`);
        let arrowInk: { first: number; second: number } | undefined;
        if (arrow) {
            const rect = arrow.getBoundingClientRect();
            const stroke = getComputedStyle(arrow, '::before').borderTopColor;
            if (colorChannels(stroke).join(',') !== colorChannels(foreground).join(',')) throw new Error(`Chevron lost the menu foreground pair: ${id}`);
            const horizontal = specification.mode === 'horizontal';
            const first = { x: rect.x, y: rect.y, width: horizontal ? rect.width : rect.width / 2, height: horizontal ? rect.height / 2 : rect.height };
            const second = { ...first, x: first.x + (horizontal ? 0 : first.width), y: first.y + (horizontal ? first.height : 0) };
            arrowInk = { first: inkPixels(image, first, stroke, background), second: inkPixels(image, second, stroke, background) };
            if (arrowInk.first < 2 || arrowInk.second < 2) throw new Error(`One or both submenu chevron arms are absent: ${id} ${JSON.stringify(arrowInk)}`);
        }
        const rect = row.getBoundingClientRect();
        const interior = { x: rect.x + rect.width / 4, y: rect.y + 3, width: rect.width / 2, height: 2 };
        const selectedSurface = specification.selected ? matchingPixels(image, interior, background) : undefined;
        if (selectedSurface && selectedSurface.ratio < 0.9) throw new Error(`Selected system surface is not painted: ${id}`);
        // Check the actual bottom interior of the unselected root item. The root
        // menu's neutral separator lies outside this strip and remains allowed.
        const idleBottom = specification.text === 'Idle' ? matchingPixels(image,
            { x: rect.x + rect.width / 4, y: rect.bottom - 2, width: rect.width / 2, height: 1 }, background) : undefined;
        if (idleBottom && idleBottom.ratio < 0.9) throw new Error(`Unselected horizontal item paints a false selection line: ${id}`);
        let separator: ReturnType<typeof matchingPixels> | undefined;
        if (specification.text === 'Idle') {
            separator = matchingPixels(image, separatorRegion(row).rect, foreground);
            if (separator.ratio < 0.9) throw new Error(`Root separator does not paint its neutral system color: ${id}`);
        }
        return { id, textInk, textPaper, arrowInk, selectedSurface, idleBottom, separator };
    });
}

(window as Window & { __menuForced?: unknown }).__menuForced = { prepare, snapshot, inspectPixels };
