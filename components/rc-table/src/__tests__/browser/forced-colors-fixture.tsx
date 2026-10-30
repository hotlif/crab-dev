import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Table from '../../../esm/index.mjs';
import type { ColumnType, Row } from '../../types.js';
import { colorChannels, matchingPixels, screenshotPixels } from '../../../../../test/forced-color-pixels.mjs';

interface Entry extends Row { dataRef: { name: string; number: string; state: string }; }
const rows: Entry[] = [
    { id: 'selected', dataRef: { name: 'Alice 张', number: '120', state: 'Ready' } },
    { id: 'ordinary', dataRef: { name: 'Bob 李', number: '240', state: 'Pending' } },
];
const columns: ColumnType<Entry>[] = [
    { name: '$.name', title: 'Name', width: 160, fixed: 'left' },
    { name: '$.number', title: 'Number', width: 160 },
    { name: '$.state', title: 'State', width: 160, fixed: 'right' },
];
const params = new URLSearchParams(location.search);
const designSystem = params.get('designSystem') as 'md3' | 'apple' | 'shadcn';
const colorMode = params.get('colorMode') as 'light' | 'dark';
if (!['md3', 'apple', 'shadcn'].includes(designSystem) || !['light', 'dark'].includes(colorMode)) throw Error('Invalid Table fixture configuration');
const host = document.getElementById('root');
if (!host) throw Error('Missing Table fixture host');
const root = createRoot(host);
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
function check(condition: unknown, message: string): asserts condition { if (!condition) throw Error(message); }
function required(selector: string, scope: ParentNode = document): HTMLElement {
    const nodes = scope.querySelectorAll<HTMLElement>(selector);
    check(nodes.length === 1, `Expected one ${selector}; actual ${nodes.length}`);
    return nodes[0]!;
}
function scene() {
    return <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
        <main style={{ padding: 48, display: 'grid', gap: 24 }}>
            <span data-system-pair style={{ color: 'HighlightText', backgroundColor: 'Highlight', forcedColorAdjust: 'none' }} />
            {(['ltr', 'rtl'] as const).map(direction => <Table<Entry> key={direction} data-direction={direction} dir={direction}
                aria-label={`Selected row ${direction}`} width={600} height={200} rows={rows} columns={columns}
                rowSelection={{ type: 'checkbox', selectedRowIds: new Set<string>(['selected']) }} />)}
        </main>
    </ConfigProvider>;
}
function glyphs(element: HTMLElement) {
    const walker = document.createTreeWalker(element, globalThis.NodeFilter.SHOW_TEXT);
    const output: { text: string; rect: ReturnType<DOMRect['toJSON']> }[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) for (let index = 0; index < (node.textContent?.length ?? 0); index++) {
        const text = node.textContent![index]!;
        if (!text.trim()) continue;
        const range = document.createRange(); range.setStart(node, index); range.setEnd(node, index + 1);
        output.push({ text, rect: range.getBoundingClientRect().toJSON() });
    }
    return output;
}
function words(element: HTMLElement) {
    const walker = document.createTreeWalker(element, globalThis.NodeFilter.SHOW_TEXT);
    const output: { text: string; rect: ReturnType<DOMRect['toJSON']> }[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) for (const match of (node.textContent ?? '').matchAll(/\S+/g)) {
        const range = document.createRange(); range.setStart(node, match.index); range.setEnd(node, match.index + match[0].length);
        output.push({ text: match[0], rect: range.getBoundingClientRect().toJSON() });
    }
    return output;
}
function subjects() {
    return (['ltr', 'rtl'] as const).flatMap(direction => {
        const grid = required(`[data-direction="${direction}"]`);
        const selected = required('[data-row-index="0"][aria-selected="true"]', grid);
        const ordinary = required('[data-row-index="1"][aria-selected="false"]', grid);
        check(getComputedStyle(ordinary).forcedColorAdjust === 'auto', 'Unselected rows must retain browser palette adjustment');
        const cells = Array.from(selected.querySelectorAll<HTMLElement>('[role="gridcell"]'));
        return Object.entries(rows[0]!.dataRef).map(([field, text]) => {
            const matches = cells.filter(cell => cell.textContent === text);
            check(matches.length === 1, `Missing actual selected ${field} cell in ${direction}`);
            const element = matches[0]!;
            return { id: `${direction}-${field}`, direction, element, text, selected };
        });
    });
}
function snapshot() {
    return { href: location.href, forcedColors: matchMedia('(forced-colors: active)').matches,
        viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight, dpr: globalThis.devicePixelRatio },
        subjects: subjects().map(({ id, direction, element, text, selected }) => {
            const style = getComputedStyle(element);
            return { id, direction, text, rect: element.getBoundingClientRect().toJSON(), glyphs: glyphs(element), words: words(element),
                color: style.color, background: style.backgroundColor, forcedColorAdjust: style.forcedColorAdjust,
                selected: selected.getAttribute('aria-selected'), position: style.position };
        }) };
}
async function prepare() {
    check(matchMedia('(forced-colors: active)').matches, 'Native forced-colors media is required');
    flushSync(() => root.render(scene()));
    await document.fonts.ready; await frame(); await frame();
    await Promise.all(host!.getAnimations({ subtree: true }).filter(animation => Number.isFinite(animation.effect?.getComputedTiming().endTime)).map(animation => animation.finished));
    await frame();
    const result = snapshot(), pair = getComputedStyle(required('[data-system-pair]'));
    check(result.subjects.length === 6, 'Three selected cells in each direction are required');
    for (const item of result.subjects) {
        check(item.selected === 'true' && item.color === pair.color && item.background === pair.backgroundColor && item.color !== item.background, `Unpaired selected cell: ${item.id}`);
        check(item.forcedColorAdjust === 'none' && item.glyphs.length > 0, `Unexpected selected text backplate: ${item.id}`);
        check(item.rect.width === 160 && item.rect.height > 0, `Invalid actual cell geometry: ${item.id}`);
        check(item.words.length > 0, `Missing actual word ranges: ${item.id}`);
        for (const range of [...item.glyphs, ...item.words]) check(range.rect.left >= item.rect.left && range.rect.right <= item.rect.right && range.rect.top >= item.rect.top && range.rect.bottom <= item.rect.bottom, `Clipped selected text: ${item.id}`);
    }
    return result;
}
async function inspectPixels(base64: string) {
    const image = await screenshotPixels(base64);
    return snapshot().subjects.map(item => {
        // The selected cell and its selected row both use Highlight. On
        // platforms with translucent Highlight, the cell is painted over the
        // already-composited row rather than directly over Canvas.
        const row = colorChannels(item.background), canvas = colorChannels('Canvas');
        const alpha = Number(row[3]) / 255;
        const rowBackdrop = row.map((channel, index) => index < 3 ? Math.round(channel * alpha + canvas[index]! * (1 - alpha)) : 255);
        const characters = item.glyphs.map(glyph => {
            const foreground = matchingPixels(image, glyph.rect, item.color), antialiasedForeground = matchingPixels(image, glyph.rect, item.color, 32);
            const background = matchingPixels(image, glyph.rect, item.background, 2, [rowBackdrop]);
            // A one-pixel stem can contain only subpixel antialiasing. Preserve its
            // measurements; require strict background gaps per glyph, and actual
            // foreground strokes across each real word rather than increasing
            // tolerance until a particular thin character happens to pass.
            check(background.matched > 0, `Actual selected cell glyph is backplated: ${item.id}/${glyph.text}`);
            return { text: glyph.text, rect: glyph.rect, foreground, antialiasedForeground, background };
        });
        const textWords = item.words.map(word => {
            // Thin CJK strokes can be subpixel-antialiased against the selected
            // surface; retain separate foreground and background requirements.
            const foreground = matchingPixels(image, word.rect, item.color, 64), background = matchingPixels(image, word.rect, item.background, 2, [rowBackdrop]);
            check(foreground.matched >= 2 && background.matched > 0 && background.ratio > 0.2, `Actual selected cell word is hidden or backplated: ${item.id}/${word.text}`);
            return { text: word.text, rect: word.rect, foreground, background };
        });
        return { id: item.id, text: item.text, characters, words: textWords };
    });
}
Object.assign(window, { __tableForced: { prepare, snapshot, inspectPixels } });
