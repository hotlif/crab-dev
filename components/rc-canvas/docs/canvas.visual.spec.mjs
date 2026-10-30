import { test, expect, configurations, openDemo, readVisualSpec, captureVisual, environmentCases, applyEnvironment } from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
async function ready(scene) { await expect.poll(async () => Number(await scene.getByRole('region', { name: '画布局部滚动区' }).getAttribute('data-render-count'))).toBeGreaterThan(0); }
for (const config of configurations) for (const state of spec.states.filter(value => value !== 'flowing')) {
    const cross = spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${state}`, { tag: ['@rc-canvas', '@matrix', ...(!cross ? ['@chromium-only'] : [])], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size: 'medium', density: 'standard', state }) } }, async ({ page, previewOrigin, browserName }, info) => {
        await openDemo(page, previewOrigin, 'rc-canvas', spec.demo, config);
        const scene = page.getByRole('region', { name: 'Canvas visual matrix', exact: true }); await ready(scene);
        const canvas = scene.locator('canvas'), rect = await canvas.boundingBox();
        if (state === 'hover') await page.mouse.move(rect.x + 64, rect.y + 130);
        if (state === 'selected') { await page.mouse.click(rect.x + 64, rect.y + 130); await expect(scene.getByLabel('画布模型')).toContainText('selected'); await page.mouse.move(rect.x + 400, rect.y + 190); }
        if (state === 'dragged') { await page.mouse.move(rect.x + 64, rect.y + 130); await page.mouse.down(); await page.mouse.move(rect.x + 104, rect.y + 154, { steps: 6 }); await page.mouse.up(); await expect(scene.getByLabel('画布模型')).toContainText('64,128'); }
        if (state === 'focus-visible') { await scene.getByRole('checkbox').focus(); await page.keyboard.press('Tab'); await expect(scene.getByRole('region', { name: '画布局部滚动区' })).toBeFocused(); }
        if (['editing', 'committed', 'cancelled'].includes(state)) {
            await page.mouse.dblclick(rect.x + 90, rect.y + 40);
            const editor = scene.getByRole('textbox', { name: 'Canvas draft' }); await expect(editor).toBeFocused();
            await editor.fill('跨主题的编辑草稿 Canvas draft');
            if (state !== 'editing') { await editor.press(state === 'committed' ? 'Enter' : 'Escape'); await expect(editor).toHaveCount(0); await expect(scene.getByLabel('画布模型')).toContainText(state === 'committed' ? '跨主题的编辑草稿 Canvas draft' : '双击编辑 Edit text'); }
        }
        if (state === 'restored') {
            const count = Number(await scene.getByRole('region', { name: '画布局部滚动区' }).getAttribute('data-render-count'));
            await canvas.evaluate(async node => { const gl = node.getContext('webgl2'), extension = gl?.getExtension('WEBGL_lose_context'); if (!extension) throw Error('WEBGL_lose_context is required for the recovery scenario'); const lost = new Promise(resolve => node.addEventListener('webglcontextlost', resolve, { once: true })); extension.loseContext(); await lost; const restored = new Promise(resolve => node.addEventListener('webglcontextrestored', resolve, { once: true })); extension.restoreContext(); await restored; });
            await expect.poll(async () => Number(await scene.getByRole('region', { name: '画布局部滚动区' }).getAttribute('data-render-count'))).toBeGreaterThan(count);
        }
        await captureVisual(scene, `${config.designSystem}-${config.colorMode}-${state}.png`, info, browserName);
    });
}
for (const config of configurations) for (const environment of environmentCases) {
    test.describe(`canvas ${config.designSystem} ${config.colorMode} ${environment.id}`, () => {
        test.use({ hasTouch: environment.hasTouch ?? false });
        test('canvas environment and text draft', { tag: ['@rc-canvas', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: environment.id }) } }, async ({ page, previewOrigin, browserName }, info) => {
            await applyEnvironment(page, environment);
            const root = await openDemo(page, previewOrigin, 'rc-canvas', spec.demo, { ...config, ...environment.config });
            const scene = root.getByRole('region', { name: 'Canvas visual matrix', exact: true }); await ready(scene);
            const scroll = scene.getByRole('region', { name: '画布局部滚动区' });
            expect(await root.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
            if (environment.id === 'narrow') expect(await scroll.evaluate(node => node.scrollWidth > node.clientWidth)).toBe(true);
            await captureVisual(scene, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
        });
    });
}
