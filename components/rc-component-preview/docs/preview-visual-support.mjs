import { expect } from '../../../test/visual/component-fixture.mjs';

export const sourceToggle = scene => scene.getByRole('button', { name: /^(查看源码|收起源码|Show source|Hide source)$/ });
export const sourceLoading = scene => scene.getByRole('status').filter({ hasText: /^(正在加载源码高亮…|Loading syntax highlighting…)$/ });

export async function highlightedSource(scene) {
    await expect(sourceToggle(scene)).toHaveAttribute('aria-expanded', 'true');
    // The complete Prism language module graph is lazy. Cold local production
    // routes may still be importing after the panel itself has expanded.
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

export async function inspectSourceScroll(scene, page, info, { touch = false } = {}) {
    const pre = scene.locator('pre');
    const scrollport = pre.locator('..');
    await scrollport.scrollIntoViewIfNeeded();
    const geometry = await scrollport.evaluate(node => ({ client: node.clientWidth, scroll: node.scrollWidth, overflow: globalThis.getComputedStyle(node).overflowX }));
    expect(geometry.client).toBeGreaterThan(0);
    const overflowing = geometry.scroll > geometry.client + 1;
    if (overflowing) {
        expect(['auto', 'scroll']).toContain(geometry.overflow);
        if (!touch) {
            await scrollport.hover();
            // A real horizontal wheel gesture moves this code-owned scrollport.
            // Keep the document fixed and never crop or hide the source text.
            const direction = await scrollport.evaluate(node => globalThis.getComputedStyle(node).direction === 'rtl' ? -1 : 1);
            await page.mouse.wheel(direction * geometry.scroll, 0);
            await expect.poll(() => scrollport.evaluate(node => Math.abs(node.scrollLeft))).toBeGreaterThan(0);
        }
    }
    await info.attach('preview-source-scroll', { body: JSON.stringify({ ...geometry, overflowing, input: overflowing ? touch ? 'touch pan not exercised; tap actions covered separately' : 'native horizontal wheel' : 'source fits; no horizontal scroll required' }), contentType: 'application/json' });
}
