import { expect } from '../../../test/visual/component-fixture.mjs';

export const sourceToggle = scene => scene.getByRole('button', { name: /^(查看源码|收起源码|Show source|Hide source)$/ });
export const sourceLoading = scene => scene.getByRole('status').filter({ hasText: /^(正在加载源码高亮…|Loading syntax highlighting…)$/ });

export async function highlightedSource(scene) {
    await expect(sourceToggle(scene)).toHaveAttribute('aria-expanded', 'true');
    // The light highlighter is lazy. Wait for actual syntax, not merely the
    // panel's completed expansion or an unhighlighted compatibility fallback.
    await expect(sourceLoading(scene)).toHaveCount(0, { timeout: 30_000 });
    // The installed Prism renderer applies inline styles and may omit the
    // optional language class. Its real code structure and tokens prove ready.
    const code = scene.locator('pre > code');
    await expect(code).toBeVisible();
    await expect(code).toContainText('export function Workspace');
    // The real Prism renderer splits syntax into tokens. Raw source text alone
    // cannot prove the lazy highlighter has finished rendering its output.
    await expect(code.locator('.token').filter({ hasText: /^export$/ }).first()).toBeVisible();
    return code;
}

export async function assertSourceContrast(scene, info) {
    const samples = await scene.locator('pre > code').evaluate(code => {
        const canvas = code.ownerDocument.createElement('canvas');
        canvas.width = canvas.height = 1;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        const rgba = color => {
            context.clearRect(0, 0, 1, 1);
            context.fillStyle = color;
            context.fillRect(0, 0, 1, 1);
            return [...context.getImageData(0, 0, 1, 1).data].map((value, index) => index === 3 ? value / 255 : value);
        };
        const blend = (color, background) => color.slice(0, 3).map((value, index) => value * color[3] + background[index] * (1 - color[3]));
        const luminance = color => color.map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
        const samples = new Map();
        const walker = code.ownerDocument.createTreeWalker(code, globalThis.NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            const text = walker.currentNode.textContent.trim();
            if (!text) continue;
            const element = walker.currentNode.parentElement;
            const style = globalThis.getComputedStyle(element);
            const ancestors = []; let current = element;
            while (current) { ancestors.unshift(current); current = current.parentElement; }
            let background = [255, 255, 255];
            for (const ancestor of ancestors) background = blend(rgba(globalThis.getComputedStyle(ancestor).backgroundColor), background);
            const foreground = blend(rgba(style.color), background);
            const lightness = [luminance(foreground), luminance(background)];
            const ratio = (Math.max(...lightness) + 0.05) / (Math.min(...lightness) + 0.05);
            samples.set(`${style.color}/${background}`, { text, foreground, background, ratio });
        }
        return [...samples.values()];
    });
    await info.attach('source-text-contrast', { body: JSON.stringify(samples), contentType: 'application/json' });
    expect(samples.length, 'Real syntax and line-number colors').toBeGreaterThan(5);
    for (const sample of samples) expect(sample.ratio, `Source text contrast: ${sample.text}`).toBeGreaterThanOrEqual(4.5);
}

export async function focusSourceWithKeyboard(scene, page) {
    const scrollport = scene.getByRole('region', { name: /^(示例源码|Example source)$/ });
    const actions = scene.getByRole('group', { name: /^(预览操作|Preview actions)$/ }).getByRole('button');
    await actions.last().focus();
    await page.keyboard.press('Tab');
    await expect(scrollport).toBeFocused();
    const outline = await scrollport.evaluate(node => {
        const style = globalThis.getComputedStyle(node);
        return { visible: node.matches(':focus-visible'), width: Number.parseFloat(style.outlineWidth), style: style.outlineStyle, direction: style.direction };
    });
    expect(outline).toMatchObject({ visible: true, style: 'solid', direction: 'ltr' });
    expect(outline.width).toBeGreaterThan(0);
    return scrollport;
}

export async function assertToolbarReachable(scene, page, info) {
    const actions = scene.getByRole('group', { name: /^(预览操作|Preview actions)$/ }).getByRole('button');
    await expect(actions).toHaveCount(3);
    const geometry = [];
    for (const action of await actions.all()) {
        await action.scrollIntoViewIfNeeded();
        await expect(action).toBeVisible();
        await expect(action).toBeEnabled();
        const bounds = await action.evaluate(node => {
            const rect = node.getBoundingClientRect();
            const hit = node.ownerDocument.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
            return { name: node.getAttribute('aria-label'), x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom,
                viewportWidth: globalThis.innerWidth, viewportHeight: globalThis.innerHeight, hit: hit === node || node.contains(hit) };
        });
        geometry.push(bounds);
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.y).toBeGreaterThanOrEqual(0);
        expect(bounds.right).toBeLessThanOrEqual(bounds.viewportWidth + 1);
        expect(bounds.bottom).toBeLessThanOrEqual(bounds.viewportHeight + 1);
        expect(bounds.hit).toBe(true);
    }
    const document = await page.evaluate(() => ({ client: globalThis.document.documentElement.clientWidth, scroll: globalThis.document.documentElement.scrollWidth }));
    await info.attach('preview-toolbar-geometry', { body: JSON.stringify({ actions: geometry, document }), contentType: 'application/json' });
    expect(document.scroll).toBeLessThanOrEqual(document.client + 1);
}

async function settleSourceScroll(scrollport) {
    const stable = await scrollport.evaluate(async node => {
        let previous = node.scrollLeft, frames = 0;
        for (let index = 0; index < 120 && frames < 4; index += 1) {
            await new Promise(resolve => node.ownerDocument.defaultView.requestAnimationFrame(resolve));
            const current = node.scrollLeft;
            frames = Math.abs(current - previous) < 0.01 ? frames + 1 : 0;
            previous = current;
        }
        return frames;
    });
    expect(stable, 'Native source scroll converges through real frames').toBe(4);
}

export async function inspectSourceScroll(scene, page, info, { touch = false } = {}) {
    const pre = scene.locator('pre');
    const scrollport = pre.locator('..');
    await expect(scrollport).toHaveAttribute('tabindex', '0');
    await expect(scrollport).toHaveAttribute('dir', 'ltr');
    await scrollport.scrollIntoViewIfNeeded();
    await page.evaluate(() => globalThis.document.fonts.ready);
    const geometry = await scrollport.evaluate(node => ({ client: node.clientWidth, scroll: node.scrollWidth, overflow: globalThis.getComputedStyle(node).overflowX }));
    expect(geometry.client).toBeGreaterThan(0);
    const overflowing = geometry.scroll > geometry.client + 1;
    if (overflowing) {
        expect(['auto', 'scroll']).toContain(geometry.overflow);
        if (!touch) {
            await focusSourceWithKeyboard(scene, page);
            await page.keyboard.press('ArrowRight');
            await expect.poll(() => scrollport.evaluate(node => Math.abs(node.scrollLeft))).toBeGreaterThan(0);
            await settleSourceScroll(scrollport);
            // Start the wheel gesture after the native key scroll has ended.
            // Returning with the opposite key also proves both directions use
            // this code-owned scrollport, without assigning scroll positions.
            await page.keyboard.press('ArrowLeft');
            await expect.poll(() => scrollport.evaluate(node => Math.abs(node.scrollLeft))).toBeLessThanOrEqual(1);
            await settleSourceScroll(scrollport);
            await scrollport.hover();
            // A real horizontal wheel gesture moves this code-owned scrollport.
            // Keep the document fixed and never crop or hide the source text.
            const direction = await scrollport.evaluate(node => globalThis.getComputedStyle(node).direction === 'rtl' ? -1 : 1);
            await page.mouse.wheel(direction * geometry.scroll, 0);
            await expect.poll(() => scrollport.evaluate(node => Math.abs(node.scrollLeft))).toBeGreaterThan(0);
            await settleSourceScroll(scrollport);
            const extent = await scrollport.evaluate(node => {
                const range = node.ownerDocument.createRange();
                const walker = node.ownerDocument.createTreeWalker(node.querySelector('code'), globalThis.NodeFilter.SHOW_TEXT);
                let contentRight = -Infinity;
                while (walker.nextNode()) {
                    if (!walker.currentNode.textContent.trim()) continue;
                    range.selectNodeContents(walker.currentNode);
                    for (const rect of range.getClientRects()) contentRight = Math.max(contentRight, rect.right);
                }
                const rect = node.getBoundingClientRect();
                const style = node.ownerDocument.defaultView.getComputedStyle(node);
                // Overflow paints inside the padding box. clientWidth omits
                // the stable scrollbar gutter, including when it is unpainted.
                return { contentRight, viewportRight: rect.right - Number.parseFloat(style.borderRightWidth), clientRight: rect.left + node.clientLeft + node.clientWidth, left: node.scrollLeft, maximum: node.scrollWidth - node.clientWidth };
            });
            await info.attach('native-source-scroll-end', { body: JSON.stringify(extent), contentType: 'application/json' });
            expect(extent.contentRight, 'Rightmost source text is reachable through the native wheel').toBeLessThanOrEqual(extent.viewportRight + 1);
        }
    }
    await info.attach('preview-source-scroll', { body: JSON.stringify({ ...geometry, overflowing, input: overflowing ? touch ? 'touch pan not exercised; tap actions covered separately' : 'native horizontal wheel' : 'source fits; no horizontal scroll required' }), contentType: 'application/json' });
}
