import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
const demo = 'network-web-component.demo.tsx';
const networkStates = { 'web-component-var': 'var', 'web-component-module': 'module' };

async function loadNetworkComponent(page, previewOrigin, config, entryType) {
    await openDemo(page, previewOrigin, 'rc-realm', demo, config);
    await page.getByLabel('远程入口格式', { exact: true }).selectOption(entryType);
    const extension = entryType === 'var' ? 'js' : 'mjs';
    // The existing native previewOrigin fixture serves the real public assets.
    // No route fulfilment, global container registration or replacement loader.
    const responses = Promise.all([
        page.waitForResponse(response => new URL(response.url()).pathname.endsWith(`/remote/web-component-entry.${extension}`)),
        page.waitForResponse(response => new URL(response.url()).pathname.endsWith('/remote/web-component.mjs')),
    ]);
    await page.getByRole('button', { name: '加载远程 Web Component', exact: true }).click();
    const resources = await responses;
    for (const resource of resources) {
        expect(resource.status()).toBe(200);
        expect(new URL(resource.url()).origin).toBe(new URL(previewOrigin).origin);
        expect(resource.headers()['content-type']).toContain('javascript');
    }
    const scene = page.getByRole('region', { name: 'Realm network Web Component' });
    await expect(scene).toHaveAttribute('data-entry-type', entryType);
    await expect(scene).toHaveAttribute('data-status', 'ready');
    await expect(scene.locator('[aria-busy]').first()).toHaveAttribute('aria-busy', 'false');
    const element = scene.locator('crab-realm-network-draft');
    await expect(element).toBeVisible(); await expect(element).toHaveAttribute('data-connected', 'true');
    expect(await element.evaluate(node => node instanceof globalThis.customElements.get(node.localName) && node.shadowRoot instanceof globalThis.ShadowRoot)).toBe(true);
    await expect(scene.getByRole('textbox', { name: 'Web Component draft', exact: true })).toHaveValue('Network CRAB-2026');
    return { scene, element, resources: resources.map(resource => ({ url: resource.url(), status: resource.status(), type: resource.request().resourceType() })) };
}

for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const [state, entryType] of Object.entries(networkStates)) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ['@rc-realm', '@matrix', '@network', ...(!crossEngine ? ['@chromium-only'] : [])], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, browserName, previewOrigin }, info) => {
        const { scene, element, resources } = await loadNetworkComponent(page, previewOrigin, { ...config, size, density }, entryType);
        const original = await element.elementHandle(), input = scene.getByRole('textbox', { name: 'Web Component draft', exact: true });
        await input.fill('Preserved network draft');
        await page.getByRole('button', { name: '更新远程属性', exact: true }).click();
        await expect(scene.getByText('Updated through the mount lifecycle', { exact: true })).toBeVisible();
        await expect(input).toHaveValue('Preserved network draft'); expect(await original.evaluate(node => node.isConnected)).toBe(true);
        await input.focus(); await settleFiniteAnimations(page);
        await captureVisual(scene, `${config.designSystem}-${config.colorMode}-${size}-${density}-${state}.png`, info, browserName);
        await info.attach('real-remote-resources', { body: JSON.stringify({ entryType, resources, customElement: await element.evaluate(node => node.localName) }), contentType: 'application/json' });
        await page.getByRole('button', { name: '卸载远程内容', exact: true }).click();
        await expect(scene).toHaveAttribute('data-status', 'idle');
        expect(await original.evaluate(node => !node.isConnected && node.dataset.connected === 'false')).toBe(true);
    });
}

for (const config of configurations) for (const entryType of ['var', 'module']) test(`${config.designSystem} ${config.colorMode} ${entryType} actual remote draft survives configuration`, { tag: ['@rc-realm', '@boundary', '@network'] }, async ({ page, previewOrigin }) => {
    const { scene, element } = await loadNetworkComponent(page, previewOrigin, config, entryType);
    const input = scene.getByRole('textbox', { name: 'Web Component draft', exact: true });
    await input.fill('Network configuration draft'); const original = await element.elementHandle();
    for (const next of configurations) {
        await page.evaluate(config => globalThis.postMessage({ type: 'crab:preview-config', ...config, size: 'large', density: 'comfortable', locale: 'en-US', direction: 'rtl', brandColor: '#8b3c75' }, location.origin), next);
        await expect(page.locator('.demo-default-preview').first()).toHaveAttribute('data-crab-design', next.designSystem);
        await expect(page.locator('.demo-default-preview').first()).toHaveAttribute('data-theme', next.colorMode);
        expect(await original.evaluate(node => node.isConnected)).toBe(true);
        await expect(input).toHaveValue('Network configuration draft');
        expect(await input.evaluate(node => getComputedStyle(node).direction)).toBe('rtl');
    }
});

for (const config of configurations) for (const entryType of ['var', 'module']) test(`${config.designSystem} ${config.colorMode} ${entryType} real entry failure and retry`, { tag: ['@rc-realm', '@interaction', '@network'] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, 'rc-realm', demo, config);
    await page.getByLabel('远程入口格式', { exact: true }).selectOption(entryType);
    const extension = entryType === 'var' ? 'js' : 'mjs', pattern = `**/remote/web-component-entry.${extension}`;
    await page.route(pattern, route => route.abort('failed'));
    await page.getByRole('button', { name: '加载远程 Web Component', exact: true }).click();
    const scene = page.getByRole('region', { name: 'Realm network Web Component' });
    await expect(scene).toHaveAttribute('data-status', 'error'); await expect(scene.getByRole('alert')).toBeVisible();
    await page.unroute(pattern);
    const response = page.waitForResponse(response => new URL(response.url()).pathname.endsWith(`/remote/web-component-entry.${extension}`));
    await scene.getByRole('button', { name: '重试', exact: true }).click();
    expect((await response).status()).toBe(200);
    await expect(scene).toHaveAttribute('data-status', 'ready');
    await expect(scene.locator('crab-realm-network-draft')).toHaveAttribute('data-connected', 'true');
    await expect(scene.getByRole('textbox', { name: 'Web Component draft', exact: true })).toHaveValue('Network CRAB-2026');
});
