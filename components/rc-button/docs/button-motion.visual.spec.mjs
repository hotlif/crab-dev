import { test, expect, configurations, openDemo, readVisualSpec } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
test.use({ video: "on" });
for (const config of configurations) for (const size of spec.sizes) {
    test(`${config.designSystem} ${config.colorMode} ${size} loading`, { tag: ["@rc-button", "@matrix", "@motion", "@chromium-only"], annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density: "standard", state: "loading" }) } }, async ({ page, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, "rc-button", spec.demo, config);
        await page.getByLabel("验收尺寸", { exact: true }).selectOption(size);
        await page.getByLabel("验收状态", { exact: true }).selectOption("loading");
        const scene = page.locator("[data-visual-scene]");
        const frame = page.getByRole('region', { name: 'Button visual matrix' });
        const primary = scene.locator('button[data-appearance="primary"]');
        await expect(primary).toHaveAttribute("data-is-loading", "true");
        const observations = [];
        for (let index = 0; index < 4; index++) {
            if (index) await page.evaluate(() => new Promise(resolve => {
                const start = globalThis.performance.now();
                const advance = now => now - start >= 180 ? resolve() : globalThis.requestAnimationFrame(advance);
                globalThis.requestAnimationFrame(advance);
            }));
            observations.push(await scene.evaluate(node => ({
                time: globalThis.performance.now(),
                buttons: [...node.querySelectorAll('button')].map(button => ({
                    appearance: button.dataset.appearance, busy: button.getAttribute('aria-busy'),
                    animations: button.getAnimations({ subtree: true }).map(animation => ({ currentTime: Number(animation.currentTime), playState: animation.playState })),
                    graphics: [...button.querySelectorAll('svg, svg *')].map(graphic => {
                        const style = globalThis.getComputedStyle(graphic), matrix = graphic.getScreenCTM?.();
                        return { tag: graphic.tagName, transform: style.transform, rotate: style.rotate, dash: style.strokeDasharray, offset: style.strokeDashoffset, path: style.getPropertyValue('d'), matrix: matrix ? [matrix.a, matrix.b, matrix.c, matrix.d] : null };
                    }),
                })),
            })));
            // The padded component boundary retains elevated outer shadows.
            await info.attach(`motion-actual-${index}`, { body: await frame.screenshot({ animations: 'allow', caret: 'hide' }), contentType: 'image/png' });
        }
        await info.attach('motion-observation', { body: JSON.stringify(observations), contentType: 'application/json' });
        for (let index = 0; index < observations[0].buttons.length; index++) {
            const sequence = observations.map(observation => observation.buttons[index]);
            expect(sequence.every(button => button.busy === 'true' && button.graphics.length > 0)).toBe(true);
            expect(sequence.every(button => button.animations.some(animation => animation.playState === 'running'))).toBe(true);
            expect(new Set(sequence.map(button => JSON.stringify(button.graphics))).size, `${sequence[0].appearance} has actual moving SVG geometry`).toBeGreaterThan(1);
            expect(sequence.at(-1).animations.some((animation, position) => animation.currentTime > sequence[0].animations[position]?.currentTime)).toBe(true);
        }
    });
}
