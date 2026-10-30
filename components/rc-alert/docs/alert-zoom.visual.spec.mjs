import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);

for (const config of configurations) {
    test('Alert real 200% '+config.designSystem+' '+config.colorMode, {
        tag: ['@rc-alert', '@environment', '@chromium-only'],
        annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
    }, async ({page, previewOrigin, realZoom}, info) => {
        await openDemo(page, previewOrigin, 'rc-alert', spec.demo, config);
        await realZoom.set200(page);
        await page.getByLabel('长文本', {exact:true}).check();
        await page.getByLabel('验收状态', {exact:true}).selectOption('title');
        const frame = page.getByRole('region', {name:'Alert visual matrix'});
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

        

        
        const action = target.getByRole('button').first();
        await action.scrollIntoViewIfNeeded();
        await expect(action).toBeVisible();
        await expect(action).toBeEnabled();
        await page.getByLabel('配置切换草稿',{exact:true}).focus();
        await page.keyboard.press('Tab');
        await expect(action).toBeFocused();
        expect(await action.evaluate(node=>node.matches(':focus-visible'))).toBe(true);
        await action.scrollIntoViewIfNeeded();
        const actionGeometry = await action.evaluate(node => {
            const rect=node.getBoundingClientRect();
            return {x:rect.x,y:rect.y,right:rect.right,bottom:rect.bottom,width:rect.width,height:rect.height,viewportWidth:globalThis.innerWidth,viewportHeight:globalThis.innerHeight};
        });
        expect(actionGeometry.width).toBeGreaterThan(0); expect(actionGeometry.height).toBeGreaterThan(0);
        expect(actionGeometry.x).toBeGreaterThanOrEqual(0); expect(actionGeometry.y).toBeGreaterThanOrEqual(0);
        expect(actionGeometry.right).toBeLessThanOrEqual(actionGeometry.viewportWidth+1);
        expect(actionGeometry.bottom).toBeLessThanOrEqual(actionGeometry.viewportHeight+1);
        await info.attach('zoom-action-geometry', {body:JSON.stringify(actionGeometry), contentType:'application/json'});
        await captureZoom(page, realZoom, config.designSystem+'-'+config.colorMode+'-zoom-200-action.png', info);
        await action.press('Enter'); await expect(target).toHaveCount(0);
        await settleFiniteAnimations(page);

        

        
        const documentGeometry = await page.evaluate(() => ({client:globalThis.document.documentElement.clientWidth,scroll:globalThis.document.documentElement.scrollWidth}));
        expect(documentGeometry.scroll).toBeLessThanOrEqual(documentGeometry.client+1);
        await info.attach('zoom-capture-scope', {body:JSON.stringify({scope:'visible viewport at actual browser tab zoom 2; content/action captures may show different real scroll positions',documentGeometry}), contentType:'application/json'});
    });
}
