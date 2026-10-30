import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);

for (const config of configurations) {
    test('Divider real 200% '+config.designSystem+' '+config.colorMode, {
        tag: ['@rc-divider', '@environment', '@chromium-only'],
        annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
    }, async ({page, previewOrigin, realZoom}, info) => {
        await openDemo(page, previewOrigin, 'rc-divider', spec.demo, config);
        await realZoom.set200(page);
        await page.getByLabel('长文本', {exact:true}).check();
        await page.getByLabel('验收状态', {exact:true}).selectOption('with-text');
        const frame = page.getByRole('region', {name:'Divider visual matrix'});
        const target = frame.locator('[data-visual-target]').first();
        await target.scrollIntoViewIfNeeded();
        await expect(target).toBeVisible();

        const content = await target.textContent();
        await expect(target).toContainText('abcdefghijklmnopqrstuvwxyz0123456789');
        const initialGeometry = await frame.evaluate(node => ({
            component: {client:node.clientWidth, scroll:node.scrollWidth},
            document: {client:globalThis.document.documentElement.clientWidth, scroll:globalThis.document.documentElement.scrollWidth},
            viewport: {width:globalThis.innerWidth, height:globalThis.innerHeight},
        }));
        expect(initialGeometry.component.scroll).toBeLessThanOrEqual(initialGeometry.component.client+1);
        expect(initialGeometry.document.scroll).toBeLessThanOrEqual(initialGeometry.document.client+1);
        await info.attach('zoom-content-geometry', {body:JSON.stringify({content, ...initialGeometry}), contentType:'application/json'});
        await settleFiniteAnimations(page);
        await captureZoom(page, realZoom, config.designSystem+'-'+config.colorMode+'-zoom-200-content.png', info);

        

        

        

        
        const documentGeometry = await page.evaluate(() => ({client:globalThis.document.documentElement.clientWidth,scroll:globalThis.document.documentElement.scrollWidth}));
        expect(documentGeometry.scroll).toBeLessThanOrEqual(documentGeometry.client+1);
        await info.attach('zoom-capture-scope', {body:JSON.stringify({scope:'visible viewport at actual browser tab zoom 2; content/action captures may show different real scroll positions',documentGeometry}), contentType:'application/json'});
    });
}
