import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from '../../../test/visual/component-fixture.mjs';
import { readyPdf, waitForPdfPresentation } from './pdf-editor.visual-helpers.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) test(`${config.designSystem} ${config.colorMode} PDF workspace at real 200%`, {
    tag: ['@rc-pdf-editor', '@environment', '@chromium-only'],
    annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
}, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, 'rc-pdf-editor', spec.demo, config);
    const scene = await readyPdf(page);
    const properties = scene.getByRole('button', { name: '属性面板', exact: true });
    if (await properties.getAttribute('aria-expanded') === 'false') await properties.click();
    await scene.getByRole('treeitem').first().click();
    const x = scene.getByLabel('X（pt）', { exact: true }); await expect(x).toBeVisible(); await x.fill('72');
    const original = await x.elementHandle(), revision = await scene.getAttribute('data-revision');
    const zoom = scene.getByLabel('缩放百分比', { exact: true }), documentZoom = await zoom.inputValue();
    await realZoom.set200(page);
    await expect(scene).toHaveAttribute('data-document', 'professional-visual'); await expect(scene).toHaveAttribute('data-revision', revision);
    expect(await original.evaluate(node => node.isConnected)).toBe(true); await expect(zoom).toHaveValue(documentZoom);

    const toolbar = scene.getByRole('toolbar', { name: 'PDF 编辑工具栏', exact: true });
    await toolbar.scrollIntoViewIfNeeded();
    const open = toolbar.getByRole('button', { name: '打开 PDF', exact: true }); await open.focus();
    await page.keyboard.press('ArrowRight');
    expect(await toolbar.evaluate(node => node.contains(document.activeElement) && document.activeElement.matches(':focus-visible'))).toBe(true);
    await waitForPdfPresentation(scene);
    await settleFiniteAnimations(page);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-pdf-toolbar.png`, info);

    // True browser zoom changes available CSS width and activates the editor's
    // existing compact layout. Reopen the real panel to inspect the same draft.
    await properties.scrollIntoViewIfNeeded();
    if (await properties.getAttribute('aria-expanded') === 'false') await properties.click();
    await expect(x).toHaveValue('72'); await x.scrollIntoViewIfNeeded();
    await waitForPdfPresentation(scene);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-pdf-draft.png`, info);
    await expect(scene.getByRole('button', { name: '应用修改', exact: true })).toBeEnabled();
    await expect(scene).toHaveAttribute('data-revision', revision);

    // Keep the domain zoom unchanged while navigating the actual virtualized PDF.
    const canvas = scene.getByLabel('PDF 连续页面预览', { exact: true });
    await properties.scrollIntoViewIfNeeded();
    if (await properties.getAttribute('aria-expanded') === 'true') await properties.click();
    await canvas.scrollIntoViewIfNeeded(); await canvas.focus(); await page.keyboard.press('End');
    await expect(scene).toHaveAttribute('data-page', '1');
    await expect(scene.locator('[aria-busy]').first()).toHaveAttribute('aria-busy', 'false');
    await expect(zoom).toHaveValue(documentZoom); await expect(scene).toHaveAttribute('data-document', 'professional-visual');
    await waitForPdfPresentation(scene);
    await settleFiniteAnimations(page);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-pdf-page-2.png`, info);
    await info.attach('zoom-pdf-state', { body: JSON.stringify({ revision, documentZoom, currentPage: await scene.getAttribute('data-page'), document: await scene.getAttribute('data-document'), draftInputConnected: await original.evaluate(node => node.isConnected) }), contentType: 'application/json' });
});
