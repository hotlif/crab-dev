import { test, expect, configurations, openDemo, readVisualSpec, captureVisual } from '../../../test/visual/component-fixture.mjs';
import { sourceToggle, highlightedSource } from './preview-visual-support.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) {
    test(`${config.designSystem} ${config.colorMode} source languages and compatibility`, { tag: ['@rc-component-preview', '@boundary'] }, async ({ page, previewOrigin, browserName }, info) => {
        await openDemo(page, previewOrigin, 'rc-component-preview', spec.demo, config);
        const scene = page.getByRole('region', { name: 'ComponentPreview visual matrix' });
        const draft = scene.getByRole('textbox');
        await draft.fill('Retained across source languages');
        const editor = await draft.elementHandle();
        const requests = [];
        page.on('request', request => { if (/\.(?:js|mjs)(?:\?|$)/.test(request.url())) requests.push(request.url()); });
        await sourceToggle(scene).click();
        await highlightedSource(scene);
        // A cold TSX expansion used to fetch approximately 495 scripts. This
        // budget covers the light renderer and its grammar dependencies while
        // allowing the bundler to change its chunk partitioning.
        expect(requests.length, 'Cold TSX should not load the full language graph').toBeLessThan(200);
        await info.attach('cold-tsx-script-requests', { body: JSON.stringify(requests), contentType: 'application/json' });

        const code = scene.locator('pre > code');
        for (const [language, token] of [
            ['javascript', 'export'], ['js', 'export'], ['typescript', 'string'], ['ts', 'string'],
            ['css', 'color'], ['json', '42'], ['python', 'def'], ['ruby', 'def'],
            ['text', null], ['unknown-language', null], ['tsx', 'export'],
        ]) {
            await scene.getByLabel('源码语言').selectOption(language);
            await expect(code).toContainText(language === 'tsx' ? '保存草稿' : language === 'css' ? 'padding' : 'Retained draft');
            // Uncommon grammars retain readable plain text while their legacy
            // module graph loads. Wait for that real async boundary before
            // checking tokens; it is separate from the fast TSX load budget.
            await expect(code).toHaveAttribute('data-source-language', language);
            await expect(code).not.toHaveAttribute('aria-busy', 'true', { timeout: 30000 });
            if (token) await expect(code.locator('.token').filter({ hasText: new RegExp(`^${token}$`) }).first()).toBeVisible();
            else await expect(code.locator('.token')).toHaveCount(0);
            await expect(draft).toHaveValue('Retained across source languages');
            expect(await editor.evaluate(node => node.isConnected)).toBe(true);
            await captureVisual(scene, `${config.designSystem}-${config.colorMode}-${language}.png`, info, browserName);
        }
        await draft.focus();
        await page.evaluate(config => globalThis.postMessage({ type: 'crab:preview-config', ...config }, globalThis.location.origin), {
            designSystem: config.designSystem === 'apple' ? 'shadcn' : 'apple',
            colorMode: config.colorMode === 'dark' ? 'light' : 'dark',
        });
        await expect(draft).toBeFocused();
        await expect(draft).toHaveValue('Retained across source languages');
    });
}
