import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from '../../../test/visual/component-fixture.mjs';
import { assertCardThemeTransition } from './card-theme-transition.mjs';

const spec = await readVisualSpec(import.meta.url);
const variants = ['default', 'elevated', 'outlined', 'filled'];
// Native video is a worker option, so this moving scene owns a separate file.
test.use({ video: 'on' });
for (const config of configurations) test('Card environment ' + config.designSystem + ' ' + config.colorMode + ' theme-retention', {
    tag: ['@rc-card', '@environment'],
    annotation: { type: 'environment', description: JSON.stringify({ id: 'theme-retention', ...config }) },
}, async ({ page, browserName, previewOrigin }, info) => {
    await openDemo(page, previewOrigin, 'rc-card', spec.demo, config);
    const frame = page.getByRole('region', { name: 'Card visual matrix' });
    const draft = page.getByLabel('配置切换草稿', { exact: true });
    await draft.fill('Draft retained through theme changes');
    const instance = await draft.elementHandle();
    const target = frame.locator('[data-visual-target]');
    const cardInstance = await target.elementHandle();
    const boundary = page.locator('.demo-default-preview').first();
    const changed = { designSystem: config.designSystem === 'md3' ? 'apple' : 'md3', colorMode: config.colorMode === 'light' ? 'dark' : 'light' };
    for (const [index, variant] of variants.entries()) {
        await page.getByLabel('验收状态', { exact: true }).selectOption(variant);
        await expect(frame.locator('[data-visual-scene]')).toHaveAttribute('data-state', variant);
        await settleFiniteAnimations(page);
        const next = index % 2 === 0 ? changed : config;
        await assertCardThemeTransition(frame, next, variant, info);
        await expect(boundary).toHaveAttribute('data-crab-design', next.designSystem);
        await expect(boundary).toHaveAttribute('data-theme', next.colorMode);
        await expect(draft).toHaveValue('Draft retained through theme changes');
        expect(await draft.evaluate((node, previous) => node === previous, instance)).toBe(true);
        expect(await target.evaluate((node, previous) => node === previous, cardInstance)).toBe(true);
    }
    // Four real switches return to the initial configuration. The final static
    // PNG is that endpoint, while video/JSON retain the natural transitions.
    await page.getByLabel('验收状态', { exact: true }).selectOption('default');
    await settleFiniteAnimations(page);
    await info.attach('theme-retention-scope', {
        body: JSON.stringify({ variants, renderedConfig: config, renderedState: 'default', scope: 'Transitions: native video and natural rAF JSON. Final PNG: returned initial configuration.' }),
        contentType: 'application/json',
    });
    await captureVisual(frame, [config.designSystem, config.colorMode, 'theme-retention'].join('-') + '.png', info, browserName);
});
