import { test, expect, configurations, openDemo, captureVisual, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { readLibraryMetadata } from '../../../scripts/library-manifest.mjs';

const designs = readLibraryMetadata().designSystems.map(design => design.id);
for (const config of configurations) {
    test(`public nested demo ${config.designSystem} ${config.colorMode}`, { tag: ['@rc-config-provider', '@boundary'] }, async ({ page, previewOrigin, browserName }, info) => {
        const root = await openDemo(page, previewOrigin, 'rc-config-provider', 'nested.demo.tsx', { ...config, direction: 'rtl', brandColor: '#0e7490', nonce: 'nested-boundary' });
        const summaries = root.locator('[data-resolved-config]');
        await expect(summaries).toHaveCount(4);
        const inherited = { designSystem: 'md3', colorMode: 'dark', size: 'large', density: 'compact', locale: 'en-US', direction: 'rtl', brandColor: '#0e7490', nonce: 'nested-boundary' };
        await expect.poll(() => summaries.evaluateAll(nodes => nodes.map(node => JSON.parse(node.getAttribute('data-resolved-config'))))).toEqual([inherited, { ...inherited, designSystem: 'shadcn', colorMode: 'light' }, { ...inherited, designSystem: 'apple' }, inherited]);
        await captureVisual(root, `${config.designSystem}-${config.colorMode}-public-nested-boundaries.png`, info, browserName);
    });
    test(`document boundaries ${config.designSystem} ${config.colorMode}`, { tag: ['@rc-config-provider', '@boundary'] }, async ({ page, previewOrigin, browserName }, info) => {
        const root = await openDemo(page, previewOrigin, 'rc-config-provider', 'config-documents.demo.tsx', config);
        const scene = page.getByRole('region', { name: 'ConfigProvider document boundaries', exact: true });
        const outer = scene.getByRole('textbox', { name: '业务草稿', exact: true });
        const frame = scene.frameLocator('iframe[title="ConfigProvider iframe"]');
        const iframeBoundary = frame.getByRole('region', { name: 'iframe boundary', exact: true });
        const shadowBoundary = scene.getByRole('region', { name: 'Shadow boundary', exact: true });
        await expect(iframeBoundary).toBeVisible(); await expect(shadowBoundary).toBeVisible();
        const inputs = [outer, iframeBoundary.getByRole('textbox'), shadowBoundary.getByRole('textbox')];
        const originals = await Promise.all(inputs.map(input => input.elementHandle()));
        for (const [index, input] of inputs.entries()) {
            const draft = `跨文档保留 ${index} · Draft through actual input`;
            await input.fill(draft);
            for (const peer of inputs) await expect(peer).toHaveValue(draft);
        }
        for (const current of [...configurations, config]) {
            const value = { ...current, size: 'large', density: 'comfortable', locale: 'zh-CN', direction: 'ltr', brandColor: null };
            await page.evaluate(value => globalThis.postMessage({ type: 'crab:preview-config', ...value }, globalThis.location.origin), value);
            await expect(root).toHaveAttribute('data-crab-design', current.designSystem);
            const expected = { designSystem: designs.find(design => design !== current.designSystem), colorMode: current.colorMode === 'light' ? 'dark' : 'light', size: 'small', density: 'comfortable', locale: 'en-US', direction: 'rtl', brandColor: '#0e7490', nonce: 'documents-boundary' };
            for (const boundary of [iframeBoundary, shadowBoundary]) {
                await expect.poll(async () => JSON.parse(await boundary.locator('[data-resolved-config]').textContent())).toEqual(expected);
                for (const [attribute, value] of Object.entries({ 'data-crab-design': expected.designSystem, 'data-theme': expected.colorMode, 'data-crab-size': expected.size, 'data-crab-density': expected.density, lang: expected.locale, dir: expected.direction })) await expect(boundary).toHaveAttribute(attribute, value);
                await expect.poll(() => boundary.evaluate(node => ({ brand: node.ownerDocument.defaultView.getComputedStyle(node).getPropertyValue('--token-semantic-color-brand-primary').trim(), radius: node.ownerDocument.defaultView.getComputedStyle(node.querySelector('input')).borderRadius, nonce: node.nonce, styleNonce: node.querySelector('[data-crab-brand-style]')?.nonce }))).toMatchObject({ brand: expect.stringMatching(/\S/), radius: expect.not.stringMatching(/^0(px)?$/), nonce: expected.nonce, styleNonce: expected.nonce });
            }
            for (const [index, input] of inputs.entries()) {
                expect(await originals[index].evaluate(node => node.isConnected)).toBe(true);
                await expect(input).toHaveValue('跨文档保留 2 · Draft through actual input');
            }
        }
        await iframeBoundary.evaluate(node => node.ownerDocument.fonts.ready);
        await settleFiniteAnimations(page);
        await captureVisual(scene, `${config.designSystem}-${config.colorMode}-document-boundaries.png`, info, browserName);
        await info.attach('boundary-scope', { body: JSON.stringify({ configurations: configurations.length, boundaries: ['same-origin iframe', 'open Shadow DOM'], styles: 'real workbench stylesheet resources', inheritedAxes: 8, retainedInputs: inputs.length }), contentType: 'application/json' });
    });
}
