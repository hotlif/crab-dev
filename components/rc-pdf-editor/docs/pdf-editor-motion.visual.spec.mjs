import { test, expect, configurations, openDemo, readVisualSpec } from '../../../test/visual/component-fixture.mjs';
import { readyPdf } from './pdf-editor.visual-helpers.mjs';
const spec = await readVisualSpec(import.meta.url);
test.use({ video: 'on' });

for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) test(`${config.designSystem} ${config.colorMode} ${size} ${density} actual Worker WASM initialization`, { tag: ['@rc-pdf-editor', '@matrix', '@motion', '@chromium-only'], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state: 'loading' }) } }, async ({ page, context, previewOrigin }, info) => {
    let release;
    const pending = new Promise(resolve => { release = resolve; });
    // A held real resource request represents slow local delivery. Worker, WASM
    // initialization and the editor's busy feedback remain the production path.
    await context.route('**/runtime/pdfium.wasm', async route => { await pending; await route.continue(); });
    try {
        await openDemo(page, previewOrigin, 'rc-pdf-editor', spec.demo, { ...config, size, density });
        const scene = page.getByRole('region', { name: 'PdfEditor visual matrix' });
        await expect(scene).toHaveAttribute('data-status', 'initializing');
        await page.waitForTimeout(200);
        const frames = [];
        for (let index = 0; index < 3; index++) {
            frames.push(await scene.evaluate(node => ({ time: performance.now(), animations: node.getAnimations({ subtree: true }).map(animation => ({ time: animation.currentTime, state: animation.playState })) })));
            await info.attach(`runtime-loading-${index}`, { body: await scene.screenshot({ animations: 'allow' }), contentType: 'image/png' });
            if (index < 2) await page.waitForTimeout(120);
        }
        expect(frames[2].time).toBeGreaterThan(frames[0].time);
        expect(frames.some(frame => frame.animations.some(animation => animation.state === 'running'))).toBe(true);
        await info.attach('natural-loading-time-series', { body: JSON.stringify(frames, null, 2), contentType: 'application/json' });
        release(); await expect(scene).toHaveAttribute('data-status', 'ready', { timeout: 20000 });
        await expect(scene).toHaveAttribute('data-document', 'professional-visual');
        await readyPdf(page);
    } finally { release(); }
});
