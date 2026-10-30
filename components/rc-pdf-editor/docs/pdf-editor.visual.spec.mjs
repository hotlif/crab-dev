import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual, environmentCases, applyEnvironment } from '../../../test/visual/component-fixture.mjs';
import { readyPdf, waitForPdfPresentation } from './pdf-editor.visual-helpers.mjs';
const spec = await readVisualSpec(import.meta.url);
async function capture(scene, name, browserName, info, documentId = 'professional-visual', target = scene) {
    if (documentId !== null) await waitForPdfPresentation(scene, documentId);
    await settleFiniteAnimations(scene.page());
    await captureVisual(target, name, info, browserName);
}
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states.filter(state => state !== 'loading')) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ['@rc-pdf-editor', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-pdf-editor', spec.demo, { ...config, size, density });
        const scene = await readyPdf(page), toolbar = scene.getByRole('toolbar', { name: 'PDF 编辑工具栏', exact: true });
        const open = toolbar.getByRole('button', { name: '打开 PDF', exact: true });
        if (state === 'hover') { await open.hover(); await expect(page.getByRole('tooltip')).toBeVisible(); }
        if (state === 'focus-visible') {
            await page.getByRole('checkbox', { name: '只读模式', exact: true }).focus(); await page.keyboard.press('Tab');
            await expect(open).toBeFocused(); expect(await open.evaluate(node => node.matches(':focus-visible'))).toBe(true);
            await page.keyboard.press('ArrowRight'); expect(await toolbar.evaluate(node => node.contains(document.activeElement))).toBe(true);
        }
        if (state === 'pressed') { await open.hover(); await page.mouse.down(); }
        if (state === 'disabled') await expect(toolbar.getByRole('button', { name: '添加文字', exact: true })).toBeDisabled();
        if (state === 'selected') {
            const select = scene.getByRole('button', { name: '矩形边框', exact: true }); await select.click(); await expect(select).toHaveAttribute('aria-pressed', 'true');
            const properties = scene.getByRole('button', { name: '属性面板', exact: true });
            if (await properties.getAttribute('aria-expanded') === 'false') await properties.click();
            await expect(scene.getByRole('complementary', { name: '对象属性', exact: true })).toContainText('矩形边框');
        }
        if (state === 'error') {
            await scene.locator('input[type=file][accept="application/pdf,.pdf"]').first().setInputFiles({ name: 'invalid.pdf', mimeType: 'application/pdf', buffer: Buffer.from('This is not a valid PDF document') });
            await expect(scene.getByRole('alert')).toBeVisible();
            // A failed replacement must leave the existing document visible.
            await expect(scene).toHaveAttribute('data-document', 'professional-visual');
        }
        if (state === 'empty') {
            await page.getByRole('button', { name: '关闭文档', exact: true }).click(); await expect(scene).toHaveAttribute('data-document', '');
            await expect(scene.getByRole('heading', { name: '在本地编辑 PDF', exact: true })).toBeVisible();
        }
        if (state === 'read-only') {
            await page.getByRole('checkbox', { name: '只读模式', exact: true }).check();
            await expect(scene.getByRole('button', { name: '矩形边框', exact: true })).toBeDisabled();
            await expect(scene.getByRole('button', { name: '适应页面', exact: true })).toBeEnabled();
        }
        if (state === 'expanded') {
            const toggle = scene.getByRole('button', { name: '属性面板', exact: true });
            if (await toggle.getAttribute('aria-expanded') === 'true') await toggle.click();
            await expect(toggle).toHaveAttribute('aria-expanded', 'false');
            await toggle.click(); await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        }
        if (state === 'edited') {
            await toolbar.getByRole('button', { name: '旋转页面', exact: true }).click();
            await expect(scene).toHaveAttribute('data-dirty', 'true');
            await expect(toolbar.getByRole('button', { name: '撤销', exact: true })).toBeEnabled();
            await expect(scene.locator('[aria-busy]').first()).toHaveAttribute('aria-busy', 'false');
        }
        if (state === 'scroll') {
            const pages = scene.getByRole('button', { name: '页面面板', exact: true });
            if (await pages.getAttribute('aria-expanded') === 'false') await pages.click();
            const canvas = scene.getByLabel('PDF 连续页面预览', { exact: true }); await canvas.focus(); await page.keyboard.press('End');
            await expect(scene).toHaveAttribute('data-page', '1'); await expect(scene.getByRole('option', { name: '第 2 页', exact: true })).toHaveAttribute('aria-current', 'page');
        }
        try { await capture(scene, `${config.designSystem}-${config.colorMode}-${size}-${density}-${state}.png`, browserName, info, state === 'empty' ? null : 'professional-visual', state === 'hover' ? page : scene); }
        finally { if (state === 'pressed') { await page.mouse.move(0, 0); await page.mouse.up(); } }
    });
}

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} document and edit draft survive configuration`, { tag: ['@rc-pdf-editor', '@boundary'] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, 'rc-pdf-editor', spec.demo, config);
    const scene = await readyPdf(page);
    const properties = scene.getByRole('button', { name: '属性面板', exact: true });
    if (await properties.getAttribute('aria-expanded') === 'false') await properties.click();
    await scene.getByRole('treeitem').first().click();
    const x = scene.getByLabel('X（pt）', { exact: true }); await expect(x).toBeVisible();
    await x.fill('72');
    const original = await x.elementHandle(), revision = await scene.getAttribute('data-revision');
    for (const next of configurations) {
        await page.evaluate(config => globalThis.postMessage({ type: 'crab:preview-config', ...config, size: 'large', density: 'comfortable', locale: 'en-US', direction: 'rtl', brandColor: '#8b3c75' }, location.origin), next);
        await expect(page.locator('.demo-default-preview').first()).toHaveAttribute('data-crab-design', next.designSystem);
        expect(await original.evaluate(node => node.isConnected)).toBe(true);
        await expect(scene.getByLabel('X (pt)', { exact: true })).toHaveValue('72');
        await expect(scene).toHaveAttribute('data-revision', revision); await expect(scene).toHaveAttribute('data-document', 'professional-visual');
    }
});

for (const environment of environmentCases) test.describe('PdfEditor environment ' + environment.id, () => {
    test.use({ hasTouch: environment.hasTouch ?? false });
    for (const config of configurations) test(config.designSystem + ' ' + config.colorMode, { tag: ['@rc-pdf-editor', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ id: environment.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await applyEnvironment(page, environment);
        await openDemo(page, previewOrigin, 'rc-pdf-editor', spec.demo, { ...config, ...environment.config });
        const scene = await readyPdf(page), en = environment.config?.locale === 'en-US';
        await page.getByRole('button', { name: '打开长文件名', exact: true }).click();
        await expect(scene).toHaveAttribute('data-document', 'professional-long');
        await expect(scene.locator('[aria-busy]').first()).toHaveAttribute('aria-busy', 'false');
        await expect(scene.getByRole('toolbar', { name: en ? 'PDF editor toolbar' : 'PDF 编辑工具栏', exact: true })).toContainText('Enterprise professional document workspace');
        const tool = scene.getByRole('button', { name: en ? 'Rectangle' : '矩形边框', exact: true });
        if (environment.hasTouch) {
            const bounds = await tool.locator(':scope > span[aria-hidden=true]').first().boundingBox();
            expect(bounds.height).toBeGreaterThanOrEqual(44); expect(bounds.width).toBeGreaterThanOrEqual(44); await tool.tap();
        } else { await tool.focus(); await page.keyboard.press('Space'); }
        await expect(tool).toHaveAttribute('aria-pressed', 'true');
        expect(await scene.evaluate(node => node.getBoundingClientRect().right <= globalThis.innerWidth + 1)).toBe(true);
        await capture(scene, config.designSystem + '-' + config.colorMode + '-' + environment.id + '.png', browserName, info, 'professional-long');
    });
});
