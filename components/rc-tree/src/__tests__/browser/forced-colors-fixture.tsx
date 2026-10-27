import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
// Paint regression: use the actual published ESM and dependency-ordered CSS
// loaded by the shared launcher, without source CSS mocks or Docs overrides.
import Tree, { LoadStateType, NodeType } from '../../../esm/index.mjs';
import type { Node } from '../../type.js';
import { colorChannels, matchingPixels, screenshotPixels } from '../../../../../test/forced-color-pixels.mjs';

const params = new URLSearchParams(location.search);
const designSystem = params.get('designSystem') as 'md3' | 'apple' | 'shadcn';
const colorMode = params.get('colorMode') as 'light' | 'dark';
if (!['md3', 'apple', 'shadcn'].includes(designSystem) || !['light', 'dark'].includes(colorMode)) throw Error('Invalid Tree fixture configuration');
const host = document.getElementById('root');
if (!host) throw Error('Missing Tree fixture host');
const root = createRoot(host);
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
function check(condition: unknown, message: string): asserts condition { if (!condition) throw Error(message); }
function required(selector: string, scope: ParentNode = document): HTMLElement {
    const elements = scope.querySelectorAll<HTMLElement>(selector);
    check(elements.length === 1, `Expected one ${selector}; got ${elements.length}`);
    return elements[0]!;
}

const folder: Node = { id: 'folder', title: 'Files', parent: null, type: NodeType.FOLDER, loadState: LoadStateType.LOADING_COMPLETED };
const nodes: Node[] = [folder,
    { id: 'selected', title: '选中文件30', parent: folder, type: NodeType.FILE, loadState: LoadStateType.LOADING_COMPLETED },
    { id: 'plain', title: 'PLAIN', parent: folder, type: NodeType.FILE, loadState: LoadStateType.LOADING_COMPLETED },
    { id: 'disabled', title: 'DISABLED', parent: folder, type: NodeType.FILE, loadState: LoadStateType.LOADING_COMPLETED, disabled: true },
];
const selectedKeys = ['selected', 'disabled'];
let treeChangeCount = 0;
function scene() {
    return <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
        <main style={{ padding: 48 }}>
            <span data-system-pair="highlight" aria-hidden="true"
                style={{ color: 'HighlightText', backgroundColor: 'Highlight', forcedColorAdjust: 'none' }} />
            <Tree treeData={nodes} selectedKeys={selectedKeys} expandedKeys={['folder']}
                width={480} height={192} aria-label="Forced color file tree" onTreeNodeChange={() => { treeChangeCount++; }} />
        </main>
    </ConfigProvider>;
}
function glyphs(title: HTMLElement) {
    // Each range belongs to actual rendered text. No canvas text replacement,
    // injected event or product style override is used to manufacture evidence.
    const text = title.firstChild;
    check(text?.nodeType === globalThis.Node.TEXT_NODE && title.childNodes.length === 1, 'Expected the actual plain file title');
    return Array.from(text.textContent ?? '', (character, offset) => {
        const range = document.createRange();
        range.setStart(text, offset); range.setEnd(text, offset + character.length);
        return { text: character, rect: range.getBoundingClientRect().toJSON() };
    }).filter(glyph => glyph.text.trim());
}
function snapshot() {
    const tree = required('[role="tree"]');
    const boundary = tree.closest('[data-crab-design][data-theme]');
    check(boundary, 'Missing actual Tree configuration boundary');
    return {
        href: location.href, forcedColors: matchMedia('(forced-colors: active)').matches,
        treeChangeCount,
        viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight, dpr: globalThis.devicePixelRatio },
        config: { designSystem: boundary.getAttribute('data-crab-design'), colorMode: boundary.getAttribute('data-theme') },
        tree: { role: tree.getAttribute('role'), forcedColorAdjust: getComputedStyle(tree).forcedColorAdjust },
        subjects: nodes.map(node => {
            const row = required(`[role="treeitem"][id$="-${node.id}"]`, tree);
            const title = required('[data-node-title]', row), style = getComputedStyle(row), titleStyle = getComputedStyle(title);
            return { id: String(node.id), rect: row.getBoundingClientRect().toJSON(), text: title.textContent,
                role: row.getAttribute('role'), level: row.getAttribute('aria-level'), expanded: row.getAttribute('aria-expanded'),
                selected: row.getAttribute('aria-selected'), disabled: row.getAttribute('aria-disabled'),
                dataSelected: row.getAttribute('data-selected'), dataDisabled: row.getAttribute('data-disabled'),
                color: style.color, background: style.backgroundColor, forcedColorAdjust: style.forcedColorAdjust,
                titleColor: titleStyle.color, titleForcedColorAdjust: titleStyle.forcedColorAdjust, glyphs: glyphs(title) };
        }),
    };
}
function validate() {
    const actual = snapshot(), pair = getComputedStyle(required('[data-system-pair="highlight"]'));
    check(actual.forcedColors, 'Actual forced-colors media is required');
    check(actual.treeChangeCount === 0, 'Rendering controlled selection must not notify a user tree mutation');
    check(actual.config.designSystem === designSystem && actual.config.colorMode === colorMode, 'Actual Tree configuration changed');
    check(actual.tree.forcedColorAdjust === 'auto', 'Tree root must retain automatic forced-color adjustment');
    check(document.querySelectorAll('[role="treeitem"]').length === nodes.length, 'Incomplete actual file hierarchy');
    const foreground = colorChannels(pair.color), background = colorChannels(pair.backgroundColor);
    check(foreground.some((channel, index) => index < 3 && channel !== background[index]), 'System selection pair has no contrast');
    for (const [index, item] of actual.subjects.entries()) {
        const node = nodes[index]!;
        const selected = selectedKeys.includes(String(node.id)), disabled = node.disabled === true;
        check(item.role === 'treeitem' && item.level === (node.parent ? '2' : '1'), `Actual hierarchy lost: ${item.id}`);
        check(item.expanded === (node.type === NodeType.FOLDER ? 'true' : null), `File/folder semantics lost: ${item.id}`);
        check(item.selected === String(selected) && item.dataSelected === String(selected)
            && item.disabled === String(disabled) && item.dataDisabled === String(disabled), `Selection/disabled state changed: ${item.id}`);
        check(item.text === node.title && item.glyphs.length > 0, `Actual title missing: ${item.id}`);
        check(item.rect.width > 0 && item.rect.height > 0 && item.rect.left >= 0 && item.rect.top >= 0
            && item.rect.right <= globalThis.innerWidth && item.rect.bottom <= globalThis.innerHeight, `Incomplete row: ${item.id}`);
        for (const glyph of item.glyphs) {
            check(glyph.rect.width > 0 && glyph.rect.height > 0 && glyph.rect.left >= item.rect.left && glyph.rect.top >= item.rect.top
                && glyph.rect.right <= item.rect.right && glyph.rect.bottom <= item.rect.bottom, `Clipped title glyph: ${item.id}/${glyph.text}`);
        }
        if (selected && !disabled) {
            check(item.color === pair.color && item.titleColor === pair.color && item.background === pair.backgroundColor, `System selection pair mismatch: ${item.id}`);
            check(item.forcedColorAdjust === 'none' && item.titleForcedColorAdjust === 'none', `Selected text backplate not prevented: ${item.id}`);
        } else {
            check(item.forcedColorAdjust === 'auto' && item.titleForcedColorAdjust === 'auto', `Forced-color opt-out leaked to ordinary or disabled row: ${item.id}`);
        }
    }
    return actual;
}
async function prepare() {
    check(matchMedia('(forced-colors: active)').matches, 'Actual forced-colors media is required');
    flushSync(() => root.render(scene()));
    await document.fonts.ready; await frame(); await frame();
    return validate();
}
async function inspectPixels(base64: string) {
    const image = await screenshotPixels(base64), actual = validate();
    const selected = actual.subjects.filter(item => item.selected === 'true' && item.disabled === 'false');
    check(selected.length === 1 && selected[0]!.id === 'selected', 'Missing enabled selected FILE pixel subject');
    return selected.map(item => {
        const fill = matchingPixels(image, item.rect, item.background);
        check(fill.ratio > 0.7, 'Actual selected row lost its system background');
        const characters = item.glyphs.map(glyph => {
            // Thin native-font strokes may be entirely antialiased (the CJK
            // middle stroke has no exact-color pixels at this font size).
            // The independent background test remains exact and rejects the
            // previously observed solid text backplate.
            const foreground = matchingPixels(image, glyph.rect, item.color, 32);
            const background = matchingPixels(image, glyph.rect, item.background);
            // A foreground-colored rectangular backplate can satisfy an ink-
            // only assertion. Require the real row fill between every glyph.
            check(foreground.matched >= 2 && background.ratio > 0.25, `Actual selected FILE glyph/backdrop hidden: ${glyph.text}`);
            return { ...glyph, foreground, background };
        });
        return { id: item.id, fill, characters };
    });
}
Object.assign(window, { __treeForced: { prepare, snapshot, inspectPixels } });
