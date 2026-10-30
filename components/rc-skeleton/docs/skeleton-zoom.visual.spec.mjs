import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);

for (const config of configurations) {
    test('Skeleton real 200% '+config.designSystem+' '+config.colorMode, {
        tag: ['@rc-skeleton', '@environment', '@chromium-only'],
        annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
    }, async ({page, previewOrigin, realZoom}, info) => {
        await openDemo(page, previewOrigin, 'rc-skeleton', spec.demo, config);
        await realZoom.set200(page);
        await page.getByLabel('长文本', {exact:true}).check();
        
        const frame = page.getByRole('region', {name:'Skeleton visual matrix'});
        const target = frame.locator('[data-visual-target]').first();
        await target.scrollIntoViewIfNeeded();
        await expect(target).toBeVisible();

        const content = await target.textContent();
        await expect(target).toHaveAttribute('aria-busy','true');
        const initialGeometry = await frame.evaluate(node => ({
            component: {client:node.clientWidth, scroll:node.scrollWidth},
            document: {client:globalThis.document.documentElement.clientWidth, scroll:globalThis.document.documentElement.scrollWidth},
            viewport: {width:globalThis.innerWidth, height:globalThis.innerHeight},
        }));
        expect(initialGeometry.component.scroll).toBeLessThanOrEqual(initialGeometry.component.client+1);
        expect(initialGeometry.document.scroll).toBeLessThanOrEqual(initialGeometry.document.client+1);
        await info.attach('zoom-content-geometry', {body:JSON.stringify({content, ...initialGeometry}), contentType:'application/json'});
        

        // Continuous state remains live. These viewport samples and the native video are evidence, not a frozen pixel baseline.
        await page.getByLabel('验收状态', {exact:true}).selectOption('default');
        await target.scrollIntoViewIfNeeded();
        const samples = [];
        for (let sample=0; sample<3; sample++) {
            if (sample) await page.waitForTimeout(180);
            const timings = await target.evaluate(node => node.getAnimations({subtree:true})
                .filter(animation => animation.effect?.getComputedTiming().iterations === Infinity)
                .map(animation => ({time:animation.currentTime, state:animation.playState})));
            expect(timings.length).toBeGreaterThan(0);
            expect(timings.every(animation => animation.state === 'running')).toBe(true);
            samples.push(timings);
            await info.attach('actual-zoom-200-natural-'+sample, {body:await realZoom.capture200(page), contentType:'image/png'});
        }
        expect(samples[2][0].time).toBeGreaterThan(samples[0][0].time);
        await info.attach('zoom-natural-time-series', {body:JSON.stringify({scope:'visible viewport only; continuous animation has no static golden',samples}), contentType:'application/json'});
        await page.getByLabel('验收状态', {exact:true}).selectOption('loaded');
        await target.scrollIntoViewIfNeeded();
        await settleFiniteAnimations(page);
        await captureZoom(page, realZoom, config.designSystem+'-'+config.colorMode+'-zoom-200-loaded.png', info);

        

        

        const finalShape = frame.locator('[data-visual-scene] > *').last();
        await finalShape.scrollIntoViewIfNeeded();
        await expect(finalShape).toBeVisible();
        await captureZoom(page, realZoom, config.designSystem+'-'+config.colorMode+'-zoom-200-last-shape.png', info);
        const documentGeometry = await page.evaluate(() => ({client:globalThis.document.documentElement.clientWidth,scroll:globalThis.document.documentElement.scrollWidth}));
        expect(documentGeometry.scroll).toBeLessThanOrEqual(documentGeometry.client+1);
        await info.attach('zoom-capture-scope', {body:JSON.stringify({scope:'visible viewport at actual browser tab zoom 2; content/action captures may show different real scroll positions',documentGeometry}), contentType:'application/json'});
    });
}
