import { test, expect, configurations, openDemo, readVisualSpec, captureVisual, settleFiniteAnimations, environmentCases, applyEnvironment } from '../../../test/visual/component-fixture.mjs';
import { sourceToggle, highlightedSource, assertToolbarReachable, inspectSourceScroll } from './preview-visual-support.mjs';
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const density of spec.densities) for (const state of spec.states.filter(state => state !== 'loading')) {
    const cross = spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${density} ${state}`, { tag: ['@rc-component-preview', '@matrix', ...(!cross ? ['@chromium-only'] : [])], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size: 'medium', density, state }) } }, async ({ page, previewOrigin, browserName }, info) => {
        await openDemo(page, previewOrigin, 'rc-component-preview', spec.demo, { ...config, density });
        const scene = page.getByRole('region', { name: 'ComponentPreview visual matrix' });
        const source = sourceToggle(scene);
        if (state === 'dark-source') await scene.getByLabel('源码配色').selectOption('dark');
        if (['expanded', 'dark-source'].includes(state)) {
            await source.click();
            await expect(source).toHaveAttribute('aria-expanded', 'true');
            await highlightedSource(scene);
        }
        if (state === 'copy-error') await scene.getByLabel('拒绝复制').check();
        if (state.startsWith('copy-')) {
            await scene.getByRole('button', { name: '复制代码', exact: true }).click();
            await expect(scene.getByLabel('操作结果')).toContainText(state === 'copy-error' ? 'Copy failed' : 'Copy succeeded');
        }
        if (state === 'external') {
            await scene.getByRole('button', { name: '在新窗口打开', exact: true }).click();
            await expect(scene.getByLabel('操作结果')).toContainText('https://example.com/workspace');
        }
        if (state === 'focus-visible') {
            await scene.getByRole('textbox').focus();
            await page.keyboard.press('Tab');
            await expect(scene.getByRole('button', { name: '复制代码', exact: true })).toBeFocused();
        }
        await settleFiniteAnimations(page);
        await captureVisual(scene, `${config.designSystem}-${config.colorMode}-${density}-${state}.png`, info, browserName);
    });
}
for (const config of configurations) for (const environment of environmentCases) {
    test.describe(`preview ${config.designSystem} ${config.colorMode} ${environment.id}`, () => {
        test.use({ hasTouch: environment.hasTouch ?? false });
        test('preview environment and source draft', { tag: ['@rc-component-preview', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: environment.id }) } }, async ({ page, previewOrigin, browserName }, info) => {
            await applyEnvironment(page, environment);
            const root = await openDemo(page, previewOrigin, 'rc-component-preview', spec.demo, { ...config, ...environment.config });
            const scene = root.getByRole('region', { name: 'ComponentPreview visual matrix' });
            const input = scene.getByRole('textbox'); await input.fill('Draft remains while source is expanded');
            const source = sourceToggle(scene);
            if (environment.hasTouch) await source.tap();
            else await source.click();
            await highlightedSource(scene);
            await expect(input).toHaveValue('Draft remains while source is expanded');
            await assertToolbarReachable(scene, page, info);
            await inspectSourceScroll(scene, page, info, { touch: environment.hasTouch });
            expect(await scene.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
            await settleFiniteAnimations(page);
            await captureVisual(scene, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
            const activate = action => environment.hasTouch ? action.tap() : action.click();
            await activate(scene.getByRole('button', { name: /^(复制代码|Copy code)$/ }));
            await expect(scene.getByLabel('操作结果')).toContainText('Copy succeeded');
            await activate(scene.getByRole('button', { name: /^(在新窗口打开|Open in new window)$/ }));
            await expect(scene.getByLabel('操作结果')).toContainText('https://example.com/workspace');
            await activate(source);
            await expect(source).toHaveAttribute('aria-expanded', 'false');
            await expect(input).toHaveValue('Draft remains while source is expanded');
        });
    });
}
