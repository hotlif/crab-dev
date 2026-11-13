import { readFile } from 'node:fs/promises';
import { test, expect, captureVisual, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { openSite, chooseDesign, chooseMode, assertDocumentWidth, openAppearance, readySitePage } from './site-visual-support.mjs';

const documents = JSON.parse(await readFile(new URL('../../../components/rc-button/docs/designs.json', import.meta.url), 'utf8'));
const definition = { path: '/components/rc-button', heading: 'Button 按钮' };

for (const [designSystem, headline] of Object.entries({ md3: '让关键操作突出。', macos: '熟悉的桌面秩序。', shadcn: '清楚表达每个任务。' })) {
    test(`home and catalog follow the document design ${designSystem}`, async ({ page, previewOrigin }, info) => {
        const home = { id: 'home', path: '/', heading: 'Crab UI' };
        await page.setViewportSize({ width: 1440, height: 960 });
        await openSite(page, previewOrigin, home, { designSystem, colorMode: 'light' });
        await expect(page.locator('.crab-home-headline')).toContainText(headline);
        await assertDocumentWidth(page, info);
        await captureVisual(page, `home-${designSystem}-desktop.png`, info);
        await page.setViewportSize({ width: 375, height: 812 });
        await assertDocumentWidth(page, info);
        await captureVisual(page, `home-${designSystem}-mobile.png`, info);
        await chooseMode(page, 'dark');
        await page.setViewportSize({ width: 1440, height: 960 });
        const catalog = { id: 'catalog', path: '/learn/components', heading: '组件目录' };
        await page.goto(previewOrigin + catalog.path);
        await readySitePage(page, catalog, { designSystem, colorMode: 'dark' });
        const button = page.locator('.crab-catalog-item').filter({ hasText: 'Button' }).first();
        await expect(button).toContainText(documents[designSystem].summary);
        await button.scrollIntoViewIfNeeded();
        await expect.poll(() => button.evaluate(node => globalThis.getComputedStyle(node.closest('.crab-catalog-section')).opacity)).toBe('1');
        await settleFiniteAnimations(page);
        await assertDocumentWidth(page, info);
        await captureVisual(page, `catalog-${designSystem}-desktop.png`, info);
        await page.setViewportSize({ width: 375, height: 812 });
        await button.scrollIntoViewIfNeeded();
        await settleFiniteAnimations(page);
        await assertDocumentWidth(page, info);
        await captureVisual(page, `catalog-${designSystem}-mobile.png`, info);
    });
}

for (const designSystem of ['md3', 'macos', 'shadcn']) for (const colorMode of ['light', 'dark']) {
    test(`isolated component documents ${designSystem} ${colorMode}`, async ({ page, previewOrigin }, info) => {
        await page.setViewportSize({ width: 1440, height: 960 });
        await openSite(page, previewOrigin, definition, { designSystem, colorMode });
        const intro = page.locator('[data-design-document]');
        await expect(intro).toHaveAttribute('data-design-document', designSystem);
        await expect(intro).toContainText(documents[designSystem].usage);
        await expect(page.locator('[data-design-example-description]')).toHaveText(documents[designSystem].exampleDescription);
        const demos = page.locator('[data-design-examples] [data-component-demo-id]');
        await expect(demos).toHaveCount(documents[designSystem].demos.length);
        await expect(page.locator('[data-component-hero] iframe')).toHaveAttribute('src', new RegExp(encodeURIComponent(`docs/demos/${documents[designSystem].demos[0]}`).replaceAll('.', '\\.')));
        if (designSystem !== 'macos') await expect(page.locator('[data-component-demo-id="docs/demos/macos.demo.tsx"]')).toHaveCount(0);
        if (designSystem !== 'md3') await expect(page.locator('[data-component-demo-id="docs/demos/expressive.demo.tsx"]')).toHaveCount(0);
        const frame = page.locator('[data-component-hero] iframe');
        await expect(frame).toBeVisible();
        await expect(frame.contentFrame().locator('html')).toHaveAttribute('data-crab-design', designSystem);
        await expect(frame.contentFrame().locator('[data-crab-design]').first()).toBeVisible();
        expect(await frame.contentFrame().locator(`[data-crab-design]:not([data-crab-design="${designSystem}"])`).count()).toBe(0);
        const references = await page.locator('[data-design-guide] a').evaluateAll(nodes => nodes.map(node => node.href).join(' '));
        if (designSystem === 'md3') expect(references).not.toMatch(/apple|shadcn/i);
        if (designSystem === 'macos') expect(references).not.toMatch(/material|shadcn/i);
        if (designSystem === 'shadcn') expect(references).not.toMatch(/material|apple/i);
        await assertDocumentWidth(page, info);
        await captureVisual(page, `docs-${designSystem}-${colorMode}-desktop.png`, info);
        await page.locator('.crab-docs-rail-search').click();
        const search = page.getByRole('dialog', { name: '搜索文档', exact: true });
        const query = search.getByRole('combobox');
        await query.fill('链接按钮');
        await expect(search.getByRole('option', { name: '链接按钮', exact: true })).toBeVisible();
        await query.fill('macOS Tahoe');
        const desktopDemo = search.getByRole('option', { name: 'macOS Tahoe：桌面控件与浮动玻璃操作', exact: true });
        if (designSystem === 'macos') await expect(desktopDemo).toBeVisible();
        else await expect(desktopDemo).toHaveCount(0);
        await query.press('Escape');
        await expect(search).not.toBeVisible();
        await page.setViewportSize({ width: 375, height: 812 });
        await assertDocumentWidth(page, info);
        const menu = await openAppearance(page, { keyboard: true });
        await page.keyboard.press('Escape');
        await expect(menu).not.toBeVisible();
        await expect(frame).toBeVisible();
        await expect(frame).toHaveAttribute('aria-busy', 'false');
        await captureVisual(page, `docs-${designSystem}-${colorMode}-mobile.png`, info);
        await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
        await expect(page.getByRole('button', { name: /^文档外观：/ })).toBeFocused();
        await assertDocumentWidth(page, info);
    });
}

test('document switching preserves the common live input and updates its design', async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, { path: '/components/rc-line-edit', heading: 'LineEdit 单行输入框' }, { designSystem: 'md3', colorMode: 'light' });
    const card = page.locator('[data-component-demo-id="docs/demos/simple.demo.tsx"]');
    await card.scrollIntoViewIfNeeded();
    const iframe = card.locator('iframe');
    const input = iframe.contentFrame().getByRole('textbox').first();
    await input.fill('切换主题保留的草稿');
    const handle = await iframe.elementHandle();
    for (const design of ['macos', 'shadcn', 'md3']) {
        await chooseDesign(page, design);
        expect(await iframe.evaluate((node, previous) => node === previous, handle)).toBe(true);
        await expect(input).toHaveValue('切换主题保留的草稿');
        await expect(iframe.contentFrame().locator('html')).toHaveAttribute('data-crab-design', design);
        await expect(page.locator('[data-design-document]')).toHaveAttribute('data-design-document', design);
    }
    await handle.dispose();
});
