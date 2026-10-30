import { test, expect, configurations, openDemo, readVisualSpec } from '../../../test/visual/component-fixture.mjs';

test.use({ video: 'on' });
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) {
    const state = 'validating';
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} validating`, { tag: ['@rc-form', '@matrix', '@chromium-only'], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-form', spec.demo, { ...config, size, density });
        const frame = page.getByRole('region', { name: 'Form visual matrix' });
        await page.getByLabel('验收状态', { exact: true }).selectOption('validating');
        await frame.getByRole('button', { name: '校验字段', exact: true }).click();
        const field = frame.getByRole('textbox', { name: '项目名称', exact: true });
        await expect(field).toHaveAttribute('aria-busy', 'true');
        for (const sample of [0, 1, 2]) {
            await info.attach(`motion-${sample}`, { body: await frame.screenshot({ animations: 'allow', caret: 'hide' }), contentType: 'image/png' });
            await page.waitForTimeout(180);
        }
        await frame.getByRole('button', { name: '完成校验', exact: true }).click();
        await expect(field).not.toHaveAttribute('aria-busy', 'true');
        await expect(frame.getByRole('status')).toContainText('校验完成');
    });
}
