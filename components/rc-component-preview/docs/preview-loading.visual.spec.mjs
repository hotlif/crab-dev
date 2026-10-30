import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { sourceToggle, sourceLoading, highlightedSource } from './preview-visual-support.mjs';

// Loading output is observed naturally, including any future continuous
// indicator. It never enters a static pixel baseline or stops an animation.
test.use({ video: 'on' });
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const density of spec.densities) {
    test(`${config.designSystem} ${config.colorMode} ${density} loading`, {
        tag: ['@rc-component-preview', '@matrix', '@motion', '@chromium-only'],
        annotation: { type: 'matrix', description: JSON.stringify({ ...config, size: 'medium', density, state: 'loading' }) },
    }, async ({ page, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-component-preview', spec.demo, { ...config, density });
        const scene = page.getByRole('region', { name: 'ComponentPreview visual matrix' });
        const input = scene.getByRole('textbox');
        await input.fill('Draft remains during the actual pending import');
        let release;
        const pending = new Promise(resolve => { release = resolve; });
        const requests = [];
        const pattern = /\.(?:js|mjs)(?:\?|$)/;
        const hold = async route => { requests.push(route.request().url()); await pending; await route.continue(); };
        await page.route(pattern, hold);
        try {
            await sourceToggle(scene).click();
            await expect(sourceToggle(scene)).toHaveAttribute('aria-expanded', 'true');
            await expect(sourceLoading(scene)).toBeVisible();
            await expect.poll(() => requests.length).toBeGreaterThan(0);
            await expect(scene.locator('pre')).toHaveCount(0);
            await expect(input).toHaveValue('Draft remains during the actual pending import');
            await settleFiniteAnimations(page);
            const samples = [];
            for (let frame = 0; frame < 3; frame++) {
                if (frame) await page.waitForTimeout(180);
                samples.push(await scene.evaluate(node => ({
                    time: globalThis.performance.now(),
                    animations: node.getAnimations({ subtree: true }).map(animation => ({ name: animation.animationName, currentTime: Number(animation.currentTime), iterations: animation.effect?.getComputedTiming().iterations === Infinity ? 'infinite' : animation.effect?.getComputedTiming().iterations, state: animation.playState })),
                })));
                await expect(sourceLoading(scene)).toBeVisible();
                await info.attach(`source-loading-${frame}`, { body: await scene.screenshot({ animations: 'allow', caret: 'hide' }), contentType: 'image/png' });
            }
            const continuous = samples[0].animations.filter(animation => animation.iterations === 'infinite' && animation.state === 'running');
            for (const animation of continuous) {
                expect(samples[2].animations.some(last => last.name === animation.name && last.currentTime > animation.currentTime && last.state === 'running')).toBe(true);
            }
            await info.attach('source-loading-time-series', { body: JSON.stringify({
                scope: 'real pending network import; natural PNG samples and native video; no static golden',
                currentFallback: 'text only; an empty animation list does not prove Spinner motion',
                requests, samples,
            }), contentType: 'application/json' });
        } finally {
            release();
            // This isolated page owns only the loading gate. Drain its active
            // callbacks before removing interception, which resumes routes.
            await page.unrouteAll({ behavior: 'wait' });
        }
        await highlightedSource(scene);
        await expect(input).toHaveValue('Draft remains during the actual pending import');
    });
}
