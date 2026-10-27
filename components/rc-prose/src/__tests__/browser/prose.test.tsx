import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import semantic from '@crab-dev/rc-token-semantic';
// Published output and actual generated CSS are essential for this regression.
// The ordinary source/DOM suite intentionally uses a CSS compilation mock.
import Prose, { TokenVars } from '../../../esm/index.mjs';
import token from '../../token.js';
import compiledCss from '../../../.cache/browser-css.json';

const hostReset = `
    a { color: rgb(200, 0, 100); }
    a:hover { color: rgb(201, 0, 101); }
    a:focus-visible { outline: 7px dotted rgb(202, 0, 102); outline-offset: 9px; }
    kbd { padding: 9px; border: 7px solid red; background: red; font: 9px/1 monospace; }
    code { padding: 8px; border: 6px solid red; background: red; font: 8px/1 serif; }
    pre { padding: 7px; border: 5px solid red; background: red; color: red; }
    pre code { font-size: 7px; padding: 6px; color: red; background: red; }
    h2 { font-size: 7px; line-height: 1; color: red; }
    table { width: 50px; border-collapse: collapse; border: 5px solid red; }
    th, td { padding: 9px; text-align: right; }
    li::marker { color: red; }
`;

function required<T extends Element>(root: ParentNode, selector: string): T {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing Prose fixture: ${selector}`);
    return element;
}

function readRole(root: ParentNode, role: string) {
    return required<HTMLElement>(root, `[data-role="${role}"]`);
}

function snapshot(element: Element, properties: readonly string[], pseudo?: string) {
    const style = getComputedStyle(element, pseudo);
    return Object.fromEntries(properties.map(property => [property, style.getPropertyValue(property)]));
}

function assertSyntaxGlyphOrder(element: HTMLElement) {
    const node = element.firstChild;
    if (!(node instanceof globalThis.Text)) throw new Error('Expected a native code text node');
    const lines = node.data.split('\n');
    let offset = 0;
    let previousLineTop = -Infinity;
    for (const line of lines) {
        const boxes: DOMRect[] = [];
        for (let index = 0; index < line.length; index += 1) {
            if (/\s/.test(line[index])) continue;
            const range = document.createRange();
            range.setStart(node, offset + index);
            range.setEnd(node, offset + index + 1);
            boxes.push(range.getBoundingClientRect());
        }
        expect(boxes.length).toBeGreaterThan(1);
        for (let index = 0; index < boxes.length; index += 1) {
            expect(boxes[index].width).toBeGreaterThan(0);
            expect(boxes[index].height).toBeGreaterThan(0);
            if (index > 0) {
                // Includes syntax punctuation, not just the Latin word run.
                expect(boxes[index].left).toBeGreaterThan(boxes[index - 1].left);
                expect(Math.abs(boxes[index].top - boxes[0].top)).toBeLessThan(0.5);
            }
        }
        expect(boxes[0].top).toBeGreaterThan(previousLineTop);
        previousLineTop = boxes[0].top;
        offset += line.length + 1;
    }
}

type Rgb = readonly [red: number, green: number, blue: number];
type Rgba = readonly [red: number, green: number, blue: number, alpha: number];

function nativeColor(value: string): Rgba {
    if (!CSS.supports('color', value)) throw new Error(`Unsupported actual computed color: ${value}`);
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Native sRGB color parser unavailable');
    context.fillStyle = value;
    context.fillRect(0, 0, 1, 1);
    const pixel = context.getImageData(0, 0, 1, 1).data;
    return [pixel[0] / 255, pixel[1] / 255, pixel[2] / 255, pixel[3] / 255];
}

function over(foreground: Rgba, background: Rgb): Rgb {
    return [
        foreground[0] * foreground[3] + background[0] * (1 - foreground[3]),
        foreground[1] * foreground[3] + background[1] * (1 - foreground[3]),
        foreground[2] * foreground[3] + background[2] * (1 - foreground[3]),
    ];
}

function paintedBackground(element: HTMLElement): Rgb {
    const layers: Rgba[] = [];
    for (let node: HTMLElement | null = element; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (style.opacity !== '1' || style.backgroundImage !== 'none') {
            throw new Error('Contrast fixture requires actual opaque ancestry without images/group opacity');
        }
        const color = nativeColor(style.backgroundColor);
        layers.push(color);
        if (color[3] === 1) {
            let background: Rgb = [color[0], color[1], color[2]];
            for (let index = layers.length - 2; index >= 0; index -= 1) {
                background = over(layers[index], background);
            }
            return background;
        }
    }
    throw new Error('No actual opaque background in Prose contrast fixture');
}

function textContrast(element: HTMLElement, pseudo?: string): number {
    const background = paintedBackground(element);
    const foreground = over(nativeColor(getComputedStyle(element, pseudo).color), background);
    const luminance = (color: Rgb) => {
        const linear = color.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const a = luminance(foreground), b = luminance(background);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const properties = {
    heading: ['color', 'font-size', 'font-weight', 'line-height', 'margin-top'],
    link: ['color', 'font-size', 'font-weight', 'text-decoration-line'],
    keyboard: ['color', 'font-size', 'font-family', 'line-height', 'font-weight', 'padding-top', 'padding-left', 'border-top-width', 'background-color', 'box-shadow'],
    inline: ['color', 'font-size', 'font-family', 'line-height', 'padding-top', 'padding-left', 'border-top-width', 'background-color'],
    block: ['color', 'font-size', 'font-family', 'line-height', 'padding-top', 'padding-left', 'border-top-width', 'background-color', 'overflow-x'],
    nested: ['color', 'font-size', 'font-family', 'line-height', 'padding-top', 'padding-left', 'border-top-width', 'background-color'],
    table: ['width', 'font-size', 'border-collapse', 'border-top-width', 'border-top-color'],
    cell: ['padding-top', 'padding-left', 'text-align'],
} as const;

describe('Prose published scoped styles', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`keeps syntax glyphs in LTR order when the native article direction changes: ${designSystem}/${colorMode}`, async () => {
                const view = await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode} direction="rtl">
                    <style>{compiledCss}</style>
                    <section data-role="direction-frame" dir="rtl" style={{ width: 640 }}>
                        <Prose as="article" data-role="article">
                            <p data-role="paragraph"><span data-role="before-code">قبل</span>{' '}<code data-role="syntax-inline">{'fn({ value: 1 });'}</code>{' '}<span data-role="after-code">بعد</span></p>
                            <pre data-role="syntax-block"><code data-role="syntax-nested">{'import Prose from "crab";\nfunction App() { return <Prose />; }\nconst result = fn({ value: 1 });'}</code></pre>
                            <ol data-role="direction-list"><li>عنصر</li></ol>
                            <blockquote data-role="direction-quote">اقتباس</blockquote>
                            <div className="not-prose"><code data-role="direction-escape">{'fn();'}</code></div>
                        </Prose>
                    </section>
                </ConfigProvider>);
                try {
                    const frame = readRole(view.container, 'direction-frame');
                    const article = readRole(view.container, 'article');
                    const inline = readRole(view.container, 'syntax-inline');
                    const block = readRole(view.container, 'syntax-block');
                    const nested = readRole(view.container, 'syntax-nested');
                    const semanticContent = article.innerHTML;
                    for (const direction of ['rtl', 'ltr', 'rtl'] as const) {
                        // Native dir mutation leaves the same component/text nodes mounted.
                        await act(() => frame.setAttribute('dir', direction));
                        for (const role of ['article', 'paragraph', 'direction-list', 'direction-quote', 'direction-escape']) {
                            expect(getComputedStyle(readRole(view.container, role)).direction).toBe(direction);
                        }
                        for (const element of [inline, block, nested]) {
                            expect(getComputedStyle(element).direction).toBe('ltr');
                            expect(getComputedStyle(element).unicodeBidi).toBe('isolate');
                        }
                        assertSyntaxGlyphOrder(inline);
                        assertSyntaxGlyphOrder(nested);
                        const before = readRole(view.container, 'before-code').getBoundingClientRect();
                        const after = readRole(view.container, 'after-code').getBoundingClientRect();
                        const code = inline.getBoundingClientRect();
                        if (direction === 'rtl') {
                            expect(before.left).toBeGreaterThan(code.right);
                            expect(after.right).toBeLessThan(code.left);
                        }
                        // Arabic remains a strong RTL run even in an LTR
                        // paragraph. The Unicode bidi algorithm may retain its
                        // surrounding run order; parent direction must not be
                        // mistaken for a forced reversal of Arabic text.
                        const paragraph = readRole(view.container, 'paragraph').getBoundingClientRect();
                        for (const bounds of [before, code, after]) {
                            expect(bounds.left).toBeGreaterThanOrEqual(paragraph.left);
                            expect(bounds.right).toBeLessThanOrEqual(paragraph.right);
                        }
                        expect(before.right <= code.left || before.left >= code.right).toBe(true);
                        expect(after.right <= code.left || after.left >= code.right).toBe(true);
                        expect(getComputedStyle(block).textAlign).toBe('start');
                        expect(getComputedStyle(block).overflowX).toBe('auto');
                        expect(article.innerHTML).toBe(semanticContent);
                        expect(readRole(view.container, 'syntax-nested')).toBe(nested);
                    }
                } finally {
                    await view.unmount();
                }
            });
        }
    }

    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            for (const invert of [false, true]) {
                for (const size of ['sm', 'base', 'lg', 'xl'] as const) {
                    it(`preserves roles, escape and multiline focus under host resets: ${designSystem}/${colorMode}/${invert ? 'inverse' : 'normal'}/${size}`, async () => {
                        const view = await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                            <style>{compiledCss}</style>
                            <section data-role="frame" style={{ width: 284, padding: 12, boxSizing: 'border-box', background: invert ? semantic.color.background.inverse : semantic.color.surface.content }}>
                                <Prose as="article" size={size} invert={invert}>
                                    <h2 data-role="heading">中文标题与 English</h2>
                                    <p><a data-role="link" href="#prose-end">中文长链接 https://example.com/documentation/long-continuous-reference-for-typography-and-overflow</a></p>
                                    <p className="lead" data-role="lead">导语与 English 必须保持清晰。</p>
                                    <p data-role="body">输入 <code data-role="inline">const answer = 42</code> 后按 <kbd data-role="keyboard">Enter</kbd>。</p>
                                    <pre data-role="block"><code data-role="nested">{'const message = "保留代码块的等宽字阶和单独横向滚动";'}</code></pre>
                                    <blockquote data-role="quote"><p>引用说明也需要足够对比度。</p></blockquote>
                                    <figure><figcaption data-role="caption">图注与 Caption 保留独立字阶。</figcaption></figure>
                                    <ol><li data-role="counter">有序项目</li></ol>
                                    <ul><li data-role="bullet">无序项目</li></ul>
                                    <table data-role="table"><thead><tr><th>项目</th></tr></thead><tbody><tr><td data-role="cell">说明文本</td></tr></tbody></table>
                                    <a className="not-prose" data-role="escape-self" href="#prose-end">独立链接</a>
                                    <div className="not-prose"><div>
                                        <h2 data-role="escape-heading">独立标题</h2>
                                        <a data-role="escape-link" href="#prose-end">内部链接</a>
                                        <kbd data-role="escape-keyboard">Space</kbd>
                                        <code data-role="escape-code">code</code>
                                        <table data-role="escape-table"><tbody><tr><td>x</td></tr></tbody></table>
                                    </div></div>
                                    <span hidden data-role="expected-link" style={{ color: token.link.color }} />
                                    <span hidden data-role="expected-focus" style={{ color: token.link['outline-color-focus'] }} />
                                    <span hidden data-role="expected-counter" style={{ color: token.list.counter.color }} />
                                    <span hidden data-role="expected-bullet" style={{ color: token.list.bullet.color }} />
                                </Prose>
                            </section>
                        </ConfigProvider>);
                        const reset = document.createElement('style');
                        try {
                            const before = Object.fromEntries(Object.entries(properties).map(([role, names]) => [role, snapshot(readRole(view.container, role), names)]));
                            reset.textContent = hostReset;
                            // A later author reset must not silently take over this component.
                            await act(() => view.container.append(reset));
                            for (const [role, names] of Object.entries(properties)) {
                                expect(snapshot(readRole(view.container, role), names)).toEqual(before[role]);
                            }

                            const keyboard = getComputedStyle(readRole(view.container, 'keyboard'));
                            expect(keyboard.borderTopWidth).toBe('0px');
                            expect(keyboard.backgroundColor).toBe('rgba(0, 0, 0, 0)');
                            expect(keyboard.boxShadow).not.toBe('none');
                            const block = getComputedStyle(readRole(view.container, 'block'));
                            const nested = getComputedStyle(readRole(view.container, 'nested'));
                            expect(nested.fontSize).toBe(block.fontSize);
                            expect(nested.lineHeight).toBe(block.lineHeight);
                            expect(nested.fontFamily).toBe(block.fontFamily);
                            expect(nested.paddingTop).toBe('0px');
                            expect(nested.paddingLeft).toBe('0px');
                            expect(nested.borderTopWidth).toBe('0px');
                            expect(nested.backgroundColor).toBe('rgba(0, 0, 0, 0)');
                            expect(block.overflowX).toBe('auto');

                            // The48 published-CSS cases cover all4 sizes, both container
                            // modes and six actual design+color boundaries. Parse actual
                            // computed colors natively, then include each translucent
                            // code/pre surface before compositing its foreground.
                            for (const role of ['body', 'lead', 'caption', 'inline', 'block', 'keyboard', 'quote']) {
                                expect(textContrast(readRole(view.container, role))).toBeGreaterThanOrEqual(4.5);
                            }
                            expect(textContrast(readRole(view.container, 'counter'), '::marker')).toBeGreaterThanOrEqual(4.5);

                            for (const role of ['counter', 'bullet']) {
                                expect(getComputedStyle(readRole(view.container, role), '::marker').color)
                                    .toBe(getComputedStyle(readRole(view.container, `expected-${role}`)).color);
                            }
                            // Escaping is tested on the target itself and a deeper descendant;
                            // inherited root typography is intentionally not reset by not-prose.
                            for (const role of ['escape-self', 'escape-link']) {
                                expect(getComputedStyle(readRole(view.container, role)).color).toBe('rgb(200, 0, 100)');
                            }
                            expect(getComputedStyle(readRole(view.container, 'escape-heading')).fontSize).toBe('7px');
                            expect(getComputedStyle(readRole(view.container, 'escape-keyboard')).borderTopWidth).toBe('7px');
                            expect(getComputedStyle(readRole(view.container, 'escape-code')).fontSize).toBe('8px');
                            expect(getComputedStyle(readRole(view.container, 'escape-table')).width).toBe('50px');

                            const link = readRole(view.container, 'link');
                            await act(() => link.focus());
                            expect(document.activeElement).toBe(link);
                            expect(link.matches(':focus-visible')).toBe(true);
                            const focused = getComputedStyle(link);
                            expect(focused.color).toBe(getComputedStyle(readRole(view.container, 'expected-link')).color);
                            expect(focused.outlineColor).toBe(getComputedStyle(readRole(view.container, 'expected-focus')).color);
                            expect(focused.outlineStyle).toBe('solid');
                            expect(focused.outlineWidth).toBe('2px');
                            expect(focused.outlineOffset).toBe('2px');
                            const rects = [...link.getClientRects()];
                            expect(rects.length).toBeGreaterThan(1);
                            const frame = readRole(view.container, 'frame').getBoundingClientRect();
                            const extension = parseFloat(focused.outlineWidth) + parseFloat(focused.outlineOffset);
                            for (const rect of rects) {
                                expect(rect.width).toBeGreaterThan(0);
                                expect(rect.height).toBeGreaterThan(0);
                                expect(rect.left - extension).toBeGreaterThanOrEqual(frame.left);
                                expect(rect.right + extension).toBeLessThanOrEqual(frame.right);
                            }
                            // Geometry/roles are assertions; actual painting is independently
                            // reviewed from the candidate's original viewport screenshots.
                        } finally {
                            await act(() => reset.remove());
                            await view.unmount();
                        }
                    });
                }
            }
        }
    }

    it('keeps an explicit consumer override and public focus variables effective', async () => {
        const view = await render(<ConfigProvider>
            <style>{compiledCss}</style>
            <style>{`
                .consumer-prose a { color: rgb(20, 60, 100); }
                .consumer-prose a:focus-visible { outline-color: rgb(20, 60, 100); }
                [data-focus-overrides] {
                    ${TokenVars['link.outline-width-focus']}: 4px;
                    ${TokenVars['link.outline-offset-focus']}: 3px;
                    ${TokenVars['link.outline-color-focus']}: rgb(20, 60, 100);
                }
            `}</style>
            <Prose className="consumer-prose"><a href="#override" data-role="consumer">Consumer</a></Prose>
            <Prose data-focus-overrides=""><a href="#override" data-role="variables">Variables</a></Prose>
        </ConfigProvider>);
        try {
            const consumer = readRole(view.container, 'consumer');
            await act(() => consumer.focus());
            expect(getComputedStyle(consumer).color).toBe('rgb(20, 60, 100)');
            expect(getComputedStyle(consumer).outlineColor).toBe('rgb(20, 60, 100)');
            const variables = readRole(view.container, 'variables');
            await act(() => variables.focus());
            const focused = getComputedStyle(variables);
            expect(focused.outlineWidth).toBe('4px');
            expect(focused.outlineOffset).toBe('3px');
            expect(focused.outlineColor).toBe('rgb(20, 60, 100)');
        } finally {
            await view.unmount();
        }
    });

    it('keeps descendant escape guards and valid marker selectors in the real CSSOM', () => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(compiledCss);
        const selectors: string[] = [];
        function visit(rules: CSSRuleList) {
            for (const rule of rules) {
                if (rule instanceof globalThis.CSSStyleRule) selectors.push(rule.selectorText);
                if (rule instanceof globalThis.CSSGroupingRule) visit(rule.cssRules);
            }
        }
        visit(sheet.cssRules);
        const proseDescendants = selectors.filter(selector => selector.includes('.rc-prose-') && selector.includes(':where('));
        expect(proseDescendants.length).toBeGreaterThan(0);
        expect(proseDescendants.every(selector => selector.includes('not-prose'))).toBe(true);
        expect(proseDescendants.some(selector => /:where\(\.rc-prose-/.test(selector))).toBe(false);
        expect(proseDescendants.filter(selector => selector.includes('::marker')).length).toBe(2);
    });
});
