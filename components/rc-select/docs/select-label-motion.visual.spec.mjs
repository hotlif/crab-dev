import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { sampleMotion, settleMotionGeometry } from '../../../test/visual/motion-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
test.use({ video: 'on' });
for (const config of configurations) for (const size of spec.sizes) {
    test(`${config.designSystem} ${config.colorMode} ${size} select label continuity`, { tag: ['@motion', '@rc-select', ...(size !== 'medium' ? ['@chromium-only'] : [])] }, async ({ page, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-select', spec.demo, { ...config, size });
        const control = page.getByRole('combobox', { name: '团队 Team', exact: true });
        // Isolate focus from the initial theme's deferred metric transitions.
        await settleMotionGeometry(page.getByRole('region', { name: 'Select visual matrix' }));
        const delta = await control.evaluate(node => {
            const label = node.parentElement.querySelector('[data-role="select-label"]');
            const before = label.getBoundingClientRect(), box = node.getBoundingClientRect();
            // Measure label motion within its field. Browser focus scrolling
            // must not be mistaken for a discontinuity in the label animation.
            node.focus({ preventScroll: true });
            const after = label.getBoundingClientRect(), focusedBox = node.getBoundingClientRect();
            return { firstFrame: Math.abs((after.y - focusedBox.y) - (before.y - box.y)),
                center: Math.abs(before.y + before.height / 2 - box.y - box.height / 2),
                label: { before: before.y, after: after.y }, field: { before: box.y, after: focusedBox.y } };
        });
        await info.attach('focus-label-geometry', { body: JSON.stringify(delta), contentType: 'application/json' });
        expect(delta.firstFrame).toBeLessThan(1);
        if (config.designSystem === 'md3') expect(delta.center, 'Empty label is centered in the actual field row').toBeLessThan(1);
        await sampleMotion(page, page.getByRole('region', { name: 'Select visual matrix' }), info, 'label-float');
        await settleFiniteAnimations(page);
        await control.press('ArrowDown');
        await expect(page.getByRole('listbox')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(control).toBeFocused();
    });
}
