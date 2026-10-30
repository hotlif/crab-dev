import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs/promises';
import { test, expect, configurations, openDemo, captureVisual, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { readyPdf, waitForPdfPresentation } from './pdf-editor.visual-helpers.mjs';

async function prepare(page, previewOrigin, config) {
    const resources = Promise.all([
        page.waitForResponse(response => response.url().endsWith('/fixtures/visual-document.pdf')),
        page.waitForResponse(response => response.url().endsWith('/fixtures/LiberationSans-Regular.ttf')),
    ]);
    await openDemo(page, previewOrigin, 'rc-pdf-editor', 'professional-actions.demo.tsx', config);
    const scene = await readyPdf(page, 'professional-rich');
    await expect(scene.getByRole('button', { name: '添加文字', exact: true })).toBeEnabled();
    const actual = await resources;
    for (const response of actual) { expect(response.status()).toBe(200); expect(new URL(response.url()).origin).toBe(new URL(previewOrigin).origin); }
    expect((await actual[0].request().allHeaders())['x-crab-visual']).toBe('local-fixture');
    return scene;
}
async function changed(scene, revision) {
    await expect(scene).not.toHaveAttribute('data-revision', revision);
    await waitForPdfPresentation(scene, await scene.getAttribute('data-document'));
}
async function selectObject(page, scene, text, end = false) {
    const tree = scene.getByRole('tree', { name: '页面对象', exact: true });
    await tree.hover(); await page.mouse.wheel(0, end ? 1000 : -1000);
    const item = scene.getByRole('treeitem').filter({ hasText: text }).first();
    await expect(item).toBeVisible(); await item.click();
    await waitForPdfPresentation(scene, 'professional-rich');
}
async function chooseFont(page, scope) {
    await scope.getByRole('combobox', { name: '字体', exact: true }).click();
    await page.getByRole('option', { name: 'Liberation Sans', exact: true }).click();
}
async function capturePage(scene) {
    const image = scene.getByRole('img', { name: '实际 PDF 区域像素', exact: true });
    const previous = await image.count() ? await image.getAttribute('src') : undefined;
    await scene.getByRole('button', { name: '捕获当前页', exact: true }).click();
    await expect(image).toBeVisible();
    if (previous) await expect(image).not.toHaveAttribute('src', previous);
    return Buffer.from(await image.evaluate(async node => { await node.decode(); return [...new Uint8Array(await (await fetch(node.src)).arrayBuffer())]; }));
}
async function chooseImage(page, scene, name, replacement = false) {
    const response = await page.request.get(new URL(`./fixtures/visual-image${replacement ? '-replacement' : ''}.png`, page.url()).href);
    expect(response.status()).toBe(200);
    const chooser = page.waitForEvent('filechooser');
    await scene.getByRole('button', { name, exact: true }).click();
    await (await chooser).setFiles({ name: replacement ? 'replacement.png' : 'fixture.png', mimeType: 'image/png', buffer: await response.body() });
}
async function downloadPdf(page, link) {
    const pending = page.waitForEvent('download'); await link.click();
    const download = await pending; expect(await download.failure()).toBe(null);
    const bytes = await readFile(await download.path());
    expect(bytes.subarray(0, 4).toString()).toBe('%PDF'); expect(bytes.length).toBeGreaterThan(100);
    return bytes;
}
async function captureDomain(page, target, name, info, browserName) {
    await settleFiniteAnimations(page);
    await captureVisual(target, name, info, browserName);
}

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} real font text edit transform history and insertion`, { tag: ['@rc-pdf-editor', '@domain'], annotation: { type: 'domain', description: JSON.stringify({ ...config, case: 'text-transform-history', size: 'medium', density: 'standard' }) } }, async ({ page, browserName, previewOrigin }, info) => {
    test.setTimeout(90000);
    const scene = await prepare(page, previewOrigin, config);
    await selectObject(page, scene, 'CRAB / Sample order');
    await scene.getByRole('textbox', { name: '文字内容', exact: true }).fill('Edited professional text');
    await chooseFont(page, scene);
    let revision = await scene.getAttribute('data-revision');
    await scene.getByRole('button', { name: '应用修改', exact: true }).click(); await changed(scene, revision);
    await expect(scene.getByRole('treeitem').filter({ hasText: 'Edited professional text' })).toBeVisible();
    const x = scene.getByLabel('X（pt）', { exact: true }), originalX = await x.inputValue();
    await x.fill('72'); revision = await scene.getAttribute('data-revision');
    await scene.getByRole('button', { name: '应用修改', exact: true }).click(); await changed(scene, revision); await expect(x).toHaveValue('72');
    revision = await scene.getAttribute('data-revision'); await scene.getByRole('button', { name: '撤销', exact: true }).click(); await changed(scene, revision);
    await selectObject(page, scene, 'Edited professional text'); await expect(x).toHaveValue(originalX);
    revision = await scene.getAttribute('data-revision'); await scene.getByRole('button', { name: '重做', exact: true }).click(); await changed(scene, revision);
    await selectObject(page, scene, 'Edited professional text'); await expect(x).toHaveValue('72');
    await scene.getByRole('button', { name: '添加文字', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: '添加文字', exact: true });
    await dialog.getByRole('textbox', { name: '文字内容', exact: true }).fill('Inserted professional text'); await chooseFont(page, dialog);
    await captureDomain(page, page, `${config.designSystem}-${config.colorMode}-real-text-dialog.png`, info, browserName);
    revision = await scene.getAttribute('data-revision'); await dialog.getByRole('button', { name: '确定', exact: true }).click();
    await expect(dialog).toBeHidden(); await changed(scene, revision);
    await selectObject(page, scene, 'Inserted professional text', true);
    await expect(scene.getByRole('textbox', { name: '文字内容', exact: true })).toHaveValue('Inserted professional text');
    await captureDomain(page, scene, `${config.designSystem}-${config.colorMode}-committed-text-history.png`, info, browserName);
});

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} actual image insertion replacement and drawing`, { tag: ['@rc-pdf-editor', '@domain'], annotation: { type: 'domain', description: JSON.stringify({ ...config, case: 'image-drawing', size: 'medium', density: 'standard' }) } }, async ({ page, browserName, previewOrigin }, info) => {
    test.setTimeout(90000);
    const scene = await prepare(page, previewOrigin, config);
    let revision = await scene.getAttribute('data-revision');
    await chooseImage(page, scene, '添加图片'); await changed(scene, revision);
    await selectObject(page, scene, '图片', true);
    const before = await capturePage(scene);
    revision = await scene.getAttribute('data-revision'); await chooseImage(page, scene, '替换图片', true); await changed(scene, revision);
    const replaced = await capturePage(scene); expect(replaced.equals(before)).toBe(false);
    revision = await scene.getAttribute('data-revision');
    await scene.getByRole('button', { name: '矩形边框', exact: true }).click();
    const canvas = scene.getByRole('main').locator('[data-page-frame][data-visible=true] canvas');
    await canvas.scrollIntoViewIfNeeded();
    const box = await canvas.boundingBox();
    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.55); await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.75, { steps: 8 }); await page.mouse.up();
    await changed(scene, revision); await page.keyboard.press('Escape');
    await selectObject(page, scene, '矩形边框', true);
    const drawn = await capturePage(scene); expect(drawn.equals(replaced)).toBe(false);
    expect([...drawn.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    await info.attach('actual-page-with-inserted-image-and-drawing', { body: drawn, contentType: 'image/png' });
    await captureDomain(page, scene, `${config.designSystem}-${config.colorMode}-image-replacement-drawing.png`, info, browserName);
});

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} remote URL toolbar plugin region save export roundtrip`, { tag: ['@rc-pdf-editor', '@domain'], annotation: { type: 'domain', description: JSON.stringify({ ...config, case: 'toolbar-region-export', size: 'medium', density: 'standard' }) } }, async ({ page, browserName, previewOrigin }, info) => {
    test.setTimeout(90000);
    const scene = await prepare(page, previewOrigin, config);
    await scene.getByRole('button', { name: '文档摘要', exact: true }).click(); await expect(scene.getByLabel('文档摘要结果')).toContainText('professional-rich.pdf · 2页');
    await scene.getByRole('checkbox', { name: '显示绘图工具', exact: true }).uncheck(); await expect(scene.getByRole('button', { name: '矩形边框', exact: true })).toHaveCount(0);
    await scene.getByRole('checkbox', { name: '显示绘图工具', exact: true }).check(); await expect(scene.getByRole('button', { name: '矩形边框', exact: true })).toBeVisible();
    const life = scene.getByLabel('区域插件状态');
    await expect.poll(async () => Number(await life.getAttribute('data-installs'))).toBeGreaterThan(0);
    const installs = Number(await life.getAttribute('data-installs')), cleanups = Number(await life.getAttribute('data-cleanups')), aborts = Number(await life.getAttribute('data-aborts'));
    await scene.getByRole('checkbox', { name: '启用区域插件', exact: true }).uncheck(); await expect(scene.getByRole('button', { name: '交互区域捕获', exact: true })).toHaveCount(0);
    await expect(life).toHaveAttribute('data-cleanups', String(cleanups + 1)); await expect(life).toHaveAttribute('data-aborts', String(aborts + 1));
    await scene.getByRole('checkbox', { name: '启用区域插件', exact: true }).check(); await expect(life).toHaveAttribute('data-installs', String(installs + 1));
    await scene.getByRole('button', { name: '交互区域捕获', exact: true }).click();
    const selector = scene.getByRole('region', { name: 'PDF 区域选择', exact: true }); await expect(selector).toBeFocused();
    await selector.scrollIntoViewIfNeeded();
    const box = await selector.boundingBox();
    await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3); await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.65, { steps: 6 }); await page.mouse.up();
    await expect(selector).toHaveCount(0); await expect(scene.getByRole('img', { name: '实际 PDF 区域像素', exact: true })).toBeVisible();
    const originalRevision = await scene.getAttribute('data-revision');
    await scene.getByRole('button', { name: '跨页区域捕获', exact: true }).click();
    await expect(scene.locator('figure')).toHaveAttribute('data-region-parts', '2');
    await expect(scene.locator('figure')).toHaveAttribute('data-region-height', '160');
    await expect(scene).toHaveAttribute('data-revision', originalRevision);
    await captureDomain(page, scene, `${config.designSystem}-${config.colorMode}-actual-cross-page-region.png`, info, browserName);
    await scene.getByRole('button', { name: '旋转页面', exact: true }).click(); await changed(scene, originalRevision);
    await scene.getByRole('button', { name: '保存 PDF', exact: true }).click();
    await expect(scene.getByLabel('保存结果')).toHaveAttribute('data-valid-pdf', 'true'); await expect(scene).toHaveAttribute('data-dirty', 'false');
    await scene.getByRole('button', { name: '导出当前 PDF', exact: true }).click();
    const full = await downloadPdf(page, scene.getByRole('link', { name: '下载导出 PDF', exact: true }));
    await info.attach('public-export-pdf', { body: full, contentType: 'application/pdf' });
    await scene.getByRole('button', { name: '重新打开导出 PDF', exact: true }).click(); await readyPdf(page, 'professional-reopened'); await expect(scene).toHaveAttribute('data-page-count', '2');
    const link = scene.getByRole('link', { name: '下载导出 PDF', exact: true }), fullHref = await link.getAttribute('href');
    await scene.getByRole('button', { name: '提取第一页', exact: true }).click(); await expect(link).not.toHaveAttribute('href', fullHref); await downloadPdf(page, link);
    await scene.getByRole('button', { name: '重新打开导出 PDF', exact: true }).click(); await readyPdf(page, 'professional-reopened'); await expect(scene).toHaveAttribute('data-page-count', '1');
});

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} actual standalone WebComponent chrome and public export`, { tag: ['@rc-pdf-editor', '@domain', '@web-component'], annotation: { type: 'domain', description: JSON.stringify({ ...config, case: 'standalone-web-component', size: 'medium', density: 'standard' }) } }, async ({ page, browserName, previewOrigin }, info) => {
    test.setTimeout(90000);
    const resource = page.waitForResponse(response => response.url().endsWith('/runtime/pdf-editor.js'));
    await openDemo(page, previewOrigin, 'rc-pdf-editor', 'web-component-runtime.demo.tsx', config);
    expect((await resource).status()).toBe(200);
    const scene = await readyPdf(page, 'professional-web-component'), element = scene.locator('crab-pdf-editor');
    expect(await element.evaluate(node => node instanceof globalThis.customElements.get('crab-pdf-editor') && node.shadowRoot instanceof globalThis.ShadowRoot)).toBe(true);
    const boundary = element.locator('[data-crab-design][data-theme]').first();
    await expect(boundary).toHaveAttribute('data-crab-design', config.designSystem); await expect(boundary).toHaveAttribute('data-theme', config.colorMode);
    await scene.getByRole('treeitem').first().click(); const x = scene.getByLabel('X（pt）', { exact: true }); await x.fill('72');
    const original = await x.elementHandle(), revision = await scene.getAttribute('data-revision');
    // Flip through another real configuration, then restore the declared one
    // before capturing; the original input and document must survive both.
    for (const next of [
        { designSystem: config.designSystem === 'apple' ? 'md3' : 'apple', colorMode: config.colorMode === 'light' ? 'dark' : 'light', size: 'large', density: 'comfortable', locale: 'en-US', direction: 'rtl', brandColor: '#8b3c75', nonce: 'visual-pdf' },
        { ...config, size: 'medium', density: 'standard', locale: 'zh-CN', direction: 'ltr', brandColor: null, nonce: undefined },
    ]) {
        await page.evaluate(config => globalThis.postMessage({ type: 'crab:preview-config', ...config }, location.origin), next);
        await expect(boundary).toHaveAttribute('data-crab-design', next.designSystem); await expect(boundary).toHaveAttribute('data-theme', next.colorMode);
        await expect(boundary).toHaveAttribute('data-crab-size', next.size); await expect(boundary).toHaveAttribute('data-crab-density', next.density);
        await expect(element).toHaveAttribute('lang', next.locale); await expect(element).toHaveAttribute('dir', next.direction);
        if (next.brandColor) await expect(element).toHaveAttribute('brand-color', next.brandColor); else expect(await element.getAttribute('brand-color')).toBe(null);
        expect(await element.evaluate(node => node.nonce)).toBe(next.nonce ?? '');
        expect(await original.evaluate(node => node.isConnected && node.value === '72')).toBe(true);
        await expect(scene.getByLabel(next.locale === 'en-US' ? 'X (pt)' : 'X（pt）', { exact: true })).toHaveValue('72');
    }
    await expect(scene).toHaveAttribute('data-revision', revision); await waitForPdfPresentation(scene, 'professional-web-component');
    await captureDomain(page, scene, `${config.designSystem}-${config.colorMode}-standalone-web-component.png`, info, browserName);
    await scene.getByRole('button', { name: '应用修改', exact: true }).click(); await changed(scene, revision);
    await scene.getByRole('button', { name: '保存 PDF', exact: true }).click();
    await expect(scene.getByText('Web Component 文档已保存', { exact: true })).toBeVisible(); await expect(scene).toHaveAttribute('data-dirty', 'false');
    await scene.getByRole('button', { name: '导出 Web Component PDF', exact: true }).click();
    const pdf = await downloadPdf(page, scene.getByRole('link', { name: '下载 Web Component PDF', exact: true }));
    await info.attach('standalone-web-component-export', { body: pdf, contentType: 'application/pdf' });
});
