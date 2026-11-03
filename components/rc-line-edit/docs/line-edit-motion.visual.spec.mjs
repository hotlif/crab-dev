import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { sampleMotion, settleMotionGeometry } from '../../../test/visual/motion-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
test.use({ video: 'on' });
for (const config of configurations) for (const size of spec.sizes) {
    test(`${config.designSystem} ${config.colorMode} ${size} label float continuity`, { tag: ['@motion', '@rc-line-edit', ...(size !== 'medium' ? ['@chromium-only'] : [])] }, async ({ page, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-line-edit', spec.demo, { ...config, size });
        const scene = page.getByRole('region', { name: 'LineEdit visual matrix' });
        await settleMotionGeometry(scene);
        for (const appearance of ['outlined', 'filled']) {
            const input = scene.getByRole('textbox', { name: `项目名称 · ${appearance}`, exact: true });
            const delta = await input.evaluate(node => {
                const label = node.labels[0];
                const before = label.getBoundingClientRect();
                const control = node.closest('[data-field-control]').getBoundingClientRect();
                node.focus({ preventScroll: true });
                const after = label.getBoundingClientRect();
                const focusedControl = node.closest('[data-field-control]').getBoundingClientRect();
                return { firstFrame: Math.abs((before.y - control.y) - (after.y - focusedControl.y)),
                    restingCenter: Math.abs(before.y + before.height / 2 - control.y - control.height / 2) };
            });
            await info.attach(`${appearance}-focus-geometry`, { body: JSON.stringify(delta), contentType: 'application/json' });
            expect(delta.firstFrame, 'Focus must not jump alignment before the first animation frame').toBeLessThan(1);
            if (config.designSystem === 'md3') expect(delta.restingCenter, 'Empty labels are centered in the actual control row').toBeLessThan(1);
            await sampleMotion(page, scene, info, `${appearance}-float`);
            await settleFiniteAnimations(page);
            await input.fill('保留的项目草稿');
            await page.getByLabel('验收状态', { exact: true }).focus();
            await expect(input).toHaveValue('保留的项目草稿');
            await input.fill('');
            await page.getByLabel('验收状态', { exact: true }).focus();
            await settleFiniteAnimations(page);
        }
    });
}
