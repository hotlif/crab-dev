import { test, expect, configurations, openDemo, captureVisual } from '../../../test/visual/component-fixture.mjs';
import { readyPdf, waitForPdfPresentation } from './pdf-editor.visual-helpers.mjs';

async function enterCoordinate(input) {
    // Focus formatting settles before a user's select-all and replacement.
    await input.focus();
    await input.press('ControlOrMeta+A');
    await input.pressSequentially('72');
}

async function expectVisibleFocus(target) {
    await expect(target).toBeFocused();
    await expect.poll(() => target.evaluate(node => {
        const style = getComputedStyle(node);
        return style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 2;
    })).toBe(true);
}

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} responsive panel focus and draft`, {
    tag: ['@rc-pdf-editor', '@domain', '@boundary'],
}, async ({ page, previewOrigin, browserName }, info) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await openDemo(page, previewOrigin, 'rc-pdf-editor', 'visual-matrix.demo.tsx', config);
    const scene = await readyPdf(page);
    const properties = scene.getByRole('button', { name: '属性面板', exact: true });
    const pages = scene.getByRole('button', { name: '页面面板', exact: true });
    await expect(properties).toHaveAttribute('aria-expanded', 'true');
    await scene.getByRole('treeitem').first().click();
    const x = scene.getByLabel('X（pt）', { exact: true });
    const initialCoordinate = await x.inputValue();
    await enterCoordinate(x);
    const original = await x.elementHandle(), revision = await scene.getAttribute('data-revision');
    await page.setViewportSize({ width: 768, height: 900 });
    await expect(properties).toHaveAttribute('aria-expanded', 'false');
    await expectVisibleFocus(properties);
    await expect(properties).toBeInViewport({ ratio: 1 });
    expect(await original.evaluate(node => node.isConnected)).toBe(true);
    await expect(x).toHaveValue('72.00');
    await expect(scene).toHaveAttribute('data-revision', revision);
    await waitForPdfPresentation(scene);
    await captureVisual(scene, `${config.designSystem}-${config.colorMode}-collapsed-properties-focus.png`, info, browserName);

    await properties.click();
    await enterCoordinate(x);
    await pages.click();
    await expect(pages).toBeFocused();
    await expect(pages).toHaveAttribute('aria-expanded', 'true');
    await expect(properties).toHaveAttribute('aria-expanded', 'false');
    await expect(x).toHaveValue('72.00');

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(pages).toHaveAttribute('aria-expanded', 'true');
    await expect(x).toHaveValue('72.00');
    const closePages = scene.getByRole('button', { name: '收起页面面板', exact: true });
    await closePages.focus();
    await page.keyboard.press('ArrowRight');
    await expect(closePages).toBeFocused();
    await expect(scene).toHaveAttribute('data-revision', revision);
    await page.setViewportSize({ width: 768, height: 900 });
    await expect(pages).toHaveAttribute('aria-expanded', 'false');
    await expectVisibleFocus(pages);
    await expect(pages).toBeInViewport({ ratio: 1 });

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(properties).toHaveAttribute('aria-expanded', 'true');
    const zoom = scene.getByLabel('缩放百分比', { exact: true });
    await zoom.focus();
    await page.setViewportSize({ width: 768, height: 900 });
    await expect(properties).toHaveAttribute('aria-expanded', 'false');
    await expect(zoom).toBeFocused();
    await expect(scene).toHaveAttribute('data-revision', revision);
    await info.attach('panel-focus-and-retained-draft', { body: JSON.stringify({ revision, value: await x.inputValue(), connected: await original.evaluate(node => node.isConnected), checkedPanels: ['properties', 'pages'], compactPanelSwitch: true, externalFocusRetained: true }), contentType: 'application/json' });

    // Object shortcuts remain available on the canvas, and document history
    // remains available when a sidebar button subsequently takes focus.
    await page.setViewportSize({ width: 1440, height: 900 });
    const canvas = scene.getByRole('main', { name: 'PDF 页面画布', exact: true });
    await canvas.focus(); await page.keyboard.press('ArrowRight');
    await expect(scene).not.toHaveAttribute('data-revision', revision);
    await expect(x).toHaveValue('73.00');
    await waitForPdfPresentation(scene);
    const movedRevision = await scene.getAttribute('data-revision');
    await closePages.focus(); await page.keyboard.press('ControlOrMeta+z');
    await expect(scene).not.toHaveAttribute('data-revision', movedRevision);
    await expect(scene).toHaveAttribute('data-dirty', 'false');
    await expect(closePages).toBeFocused();
    await waitForPdfPresentation(scene);
    await scene.getByRole('treeitem').first().click();
    await expect(x).toHaveValue(initialCoordinate);
});
