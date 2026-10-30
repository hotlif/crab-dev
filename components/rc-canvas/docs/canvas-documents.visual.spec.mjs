import { test, expect, configurations, openDemo, captureVisual, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { readLibraryMetadata } from '../../../scripts/library-manifest.mjs';

const designs = readLibraryMetadata().designSystems.map(design => design.id);
async function renderedPixels(scene) {
    return scene.evaluate(node => {
        const record = JSON.parse(node.dataset.renderPixels);
        const probe = node.querySelector('[data-drawing-color]');
        const color = node.ownerDocument.defaultView.getComputedStyle(probe).color;
        const reference = node.ownerDocument.createElement('canvas');
        reference.width = reference.height = 1;
        const context = reference.getContext('2d');
        if (!context) throw Error('A native 2D color reference is required');
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        return { ...record, expected: [...context.getImageData(0, 0, 1, 1).data], color, count: Number(node.dataset.renderCount) };
    });
}
async function expectActualThemePixels(scene) {
    await expect.poll(async () => {
        const { shape, expected, empty, error, bitmap } = await renderedPixels(scene);
        return error === 0 && bitmap[0] === 540 && bitmap[1] === 240 && shape[3] === 255 && empty[3] === 0 &&
            shape.every((channel, index) => Math.abs(channel - expected[index]) <= 2);
    }, { message: 'Real GPU pixels must match the actual nearest Theme foreground at explicit DPR 1.5' }).toBe(true);
    return renderedPixels(scene);
}

for (const config of configurations) {
    test(`foreign iframe Shadow theme ${config.designSystem} ${config.colorMode}`, {
        tag: ['@rc-canvas', '@boundary'],
        annotation: { type: 'boundary', description: JSON.stringify({ ...config, id: 'foreign-iframe-shadow', explicitDpr: 1.5 }) },
    }, async ({ page, previewOrigin, browserName }, info) => {
        await openDemo(page, previewOrigin, 'rc-canvas', 'document-shadow.demo.tsx', config);
        const outer = page.getByRole('region', { name: 'Canvas foreign Shadow document', exact: true });
        const iframe = outer.locator('iframe[title="Canvas iframe Shadow boundary"]');
        const frame = outer.frameLocator('iframe[title="Canvas iframe Shadow boundary"]');
        const scene = frame.getByRole('region', { name: 'iframe Shadow canvas', exact: true });
        await expect(scene).toBeVisible();
        await expect.poll(async () => Number(await scene.getAttribute('data-render-count'))).toBeGreaterThan(0);
        await expectActualThemePixels(scene);
        const realm = await iframe.evaluate(element => {
            const owner = element.contentDocument;
            const host = owner.querySelector('[data-canvas-shadow-host]');
            const shadow = host.shadowRoot;
            return {
                foreign: !(shadow instanceof globalThis.ShadowRoot),
                ownRealm: shadow instanceof owner.defaultView.ShadowRoot,
                ownerDocument: host.ownerDocument === owner,
                documentSheets: [...owner.head.querySelectorAll('link[rel="stylesheet"]')].map(link => link.href),
                shadowSheets: [...shadow.querySelectorAll('link[rel="stylesheet"]')].map(link => link.href),
                documentStyles: owner.head.querySelectorAll('style').length,
                shadowStyles: shadow.querySelectorAll('style').length,
            };
        });
        expect(realm.foreign).toBe(true);
        expect(realm.ownRealm).toBe(true);
        expect(realm.ownerDocument).toBe(true);
        expect(realm.documentSheets.length + realm.documentStyles).toBeGreaterThan(0);
        expect(realm.shadowSheets).toEqual(realm.documentSheets);
        await info.attach('foreign-realm-and-real-style-resources', { body: JSON.stringify(realm), contentType: 'application/json' });

        const canvas = scene.locator('canvas');
        const input = scene.getByRole('textbox', { name: '跨文档画布草稿', exact: true });
        const handles = await Promise.all([iframe, canvas, input].map(target => target.elementHandle()));
        await input.fill('保留真实 iframe Shadow 草稿 / Retained draft');
        const bounds = await canvas.boundingBox();
        await page.mouse.move(bounds.x + 80, bounds.y + 96);
        await page.mouse.down();
        await page.mouse.move(bounds.x + 112, bounds.y + 112, { steps: 4 });
        await page.mouse.up();
        await expect(scene.getByLabel('跨文档画布坐标', { exact: true })).toHaveText('64,80');
        const initial = await expectActualThemePixels(scene);
        const history = [{ step: 'initial-after-real-drag', ...initial }];
        const retained = async () => {
            for (const handle of handles) expect(await handle.evaluate(node => node.isConnected)).toBe(true);
            await expect(input).toHaveValue('保留真实 iframe Shadow 草稿 / Retained draft');
            await expect(scene.getByLabel('跨文档画布坐标', { exact: true })).toHaveText('64,80');
            await expect(canvas).toHaveAttribute('width', '540');
            await expect(canvas).toHaveAttribute('height', '240');
        };
        const waitForDrawing = async before => {
            await expect.poll(async () => Number(await scene.getAttribute('data-render-count'))).toBeGreaterThan(before);
            const result = await expectActualThemePixels(scene);
            await retained();
            return result;
        };
        const opposite = config.colorMode === 'light' ? 'dark' : 'light';
        const nearestMode = outer.getByRole('combobox', { name: '最近边界明暗', exact: true });
        await nearestMode.selectOption(opposite);
        const nearest = await waitForDrawing(initial.count);
        expect(nearest.shape).not.toEqual(initial.shape);
        history.push({ step: 'nearest-theme-changed', ...nearest });

        // Changing the outer boundary must not override the nearest one.
        await outer.getByRole('combobox', { name: '外层边界明暗', exact: true }).selectOption(config.colorMode);
        const inherited = await waitForDrawing(nearest.count);
        expect(inherited.shape).toEqual(nearest.shape);
        history.push({ step: 'outer-theme-changed-nearest-preserved', ...inherited });
        await outer.getByRole('combobox', { name: '最近边界设计体系', exact: true }).selectOption(designs.find(design => design !== config.designSystem));
        const design = await waitForDrawing(inherited.count);
        history.push({ step: 'nearest-design-changed', ...design });
        await nearestMode.selectOption(config.colorMode);
        const final = await waitForDrawing(design.count);
        expect(final.shape).not.toEqual(design.shape);
        history.push({ step: 'nearest-mode-restored', ...final });
        await info.attach('actual-gpu-theme-pixels', { body: JSON.stringify(history), contentType: 'application/json' });
        await scene.evaluate(node => node.ownerDocument.fonts.ready);
        await settleFiniteAnimations(page);
        await captureVisual(outer, `${config.designSystem}-${config.colorMode}-foreign-shadow-theme.png`, info, browserName);
    });
}
