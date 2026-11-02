import { test, expect, configurations, environmentCases, applyEnvironment, captureVisual, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { sitePages, openSite, readySitePage, assertSiteConfiguration, assertDocumentWidth } from './site-visual-support.mjs';

// A recovery scenario loads, fails and retries a real production document.
test.describe.configure({ timeout: 90_000 });
const home = sitePages.find(page => page.id === 'home');
const guideModule = /\/getting-started\.[a-f0-9]+\.js(?:\?.*)?$/;
const catalog = sitePages.find(page => page.id === 'catalog');
const component = sitePages.find(page => page.id === 'component');
const searchModule = /\/search-corpus\.[a-f0-9]+\.js(?:\?.*)?$/;
const environments = environmentCases.filter(environment => ['narrow', 'tablet', 'desktop', 'forced-colors', 'reduced-motion'].includes(environment.id));

async function captureFeedback(page, name, info) {
    await settleFiniteAnimations(page);
    await assertDocumentWidth(page, info);
    await captureVisual(page, name + '.png', info);
}

test('Site document network recovery', {
    tag: ['@website', '@site-feedback', '@chromium-only'],
    annotation: { type: 'site', description: JSON.stringify({ designSystem: 'md3', colorMode: 'light', environment: 'desktop', state: 'document-retry' }) },
}, async ({ page, previewOrigin }) => {
    let failing = true;
    await page.route(guideModule, route => failing ? route.abort('failed') : route.continue());
    await openSite(page, previewOrigin, home, { designSystem: 'md3', colorMode: 'light' });
    await page.locator('.crab-home-hero').getByRole('link', { name: '开始使用', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('文档加载失败');
    failing = false;
    await page.getByRole('button', { name: '重试加载', exact: true }).click();
    await expect(page.locator('.crab-docs-page .crab-docs-page-heading h1')).toHaveText('开始使用');
});

for (const config of configurations) for (const environment of environments) test('Site feedback ' + [config.designSystem, config.colorMode, environment.id].join(' '), {
    tag: ['@website', '@site-feedback', '@chromium-only'],
    annotation: { type: 'site', description: JSON.stringify({ ...config, environment: environment.id, state: 'document-and-search-feedback' }) },
}, async ({ page, previewOrigin }, info) => {
    await page.setViewportSize(environment.viewport ?? { width: 1440, height: 900 });
    await applyEnvironment(page, environment);
    await openSite(page, previewOrigin, home, config);
    const prefix = [config.designSystem, config.colorMode, environment.id].join('-');
    const missing = await page.goto(previewOrigin + '/guides/__missing_document__');
    expect(missing.status()).toBe(404);
    await expect(page.getByRole('heading', { name: '找不到这篇文档', level: 1, exact: true })).toBeVisible();
    await assertSiteConfiguration(page, config);
    const state = page.locator('.crab-docs-document-state');
    await expect(state.getByRole('link', { name: '查看组件目录', exact: true })).toHaveAttribute('href', '/learn/components');
    await expect(state.getByRole('link', { name: '返回首页', exact: true })).toHaveAttribute('href', '/');
    await captureFeedback(page, prefix + '-not-found', info);
    await state.getByRole('link', { name: '返回首页', exact: true }).click();
    await readySitePage(page, home, config);

    let failing = true;
    await page.route(guideModule, route => failing ? route.abort('failed') : route.continue());
    await page.locator('.crab-home-hero').getByRole('link', { name: '开始使用', exact: true }).click();
    await expect(page.getByRole('heading', { name: '文档加载失败', level: 1, exact: true })).toBeVisible();
    const details = state.locator('.crab-docs-error-details');
    await expect(details).not.toHaveAttribute('open');
    await expect(page.getByRole('alert')).not.toContainText('http://');
    if (['desktop', 'narrow'].includes(environment.id)) await captureFeedback(page, prefix + '-document-error', info);
    await details.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(details).toHaveAttribute('open', '');
    await expect(details.locator('pre')).toBeVisible();
    await assertDocumentWidth(page, info);
    failing = false;
    await state.getByRole('button', { name: '重试加载', exact: true }).click();
    await expect(page.locator('.crab-docs-page .crab-docs-page-heading h1')).toHaveText('开始使用');
    await expect(page.locator('.crab-docs-page .crab-docs-page-heading h1')).toBeFocused();

    await page.getByRole('button', { name: '搜索文档', exact: true }).click();
    const search = page.getByRole('dialog', { name: '搜索文档', exact: true });
    const query = search.getByRole('combobox');
    await query.fill('no_such_component_不存在的文档');
    await expect(search.getByText('没有匹配的文档', { exact: true })).toBeVisible();
    await expect(search.getByRole('button', { name: '编辑关键词', exact: true })).toHaveCount(0);
    await expect(search.getByRole('button', { name: '关闭', exact: true })).toHaveCount(1);
    await expect(search.locator('.crab-docs-search-help')).not.toContainText('Enter');
    const path = page.url();
    await query.press('Enter');
    await expect(search).toBeVisible();
    expect(page.url()).toBe(path);
    await captureFeedback(page, prefix + '-search-empty', info);
    await search.getByRole('button', { name: '清空关键词', exact: true }).click();
    await expect(query).toHaveValue('');
    await expect(query).toBeFocused();
    await expect.poll(() => search.getByRole('option').count()).toBeGreaterThan(0);
    await page.keyboard.press('Escape');
    await expect(search).not.toBeVisible();
    await expect(page.getByRole('button', { name: '搜索文档', exact: true })).toBeFocused();
});

for (const config of configurations) for (const viewport of [{ id: 'narrow', width: 320, height: 768 }, { id: 'desktop', width: 1440, height: 900 }]) test('Site inline feedback ' + [config.designSystem, config.colorMode, viewport.id].join(' '), {
    tag: ['@website', '@site-feedback', '@chromium-only'],
    annotation: { type: 'site', description: JSON.stringify({ ...config, environment: viewport.id, state: 'api-demo-and-search-recovery' }) },
}, async ({ page, previewOrigin }, info) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openSite(page, previewOrigin, component, config);
    const prefix = [config.designSystem, config.colorMode, viewport.id].join('-');
    const api = page.locator('.crab-docs-api').first();
    await expect.poll(() => api.locator('.crab-docs-properties > div').count()).toBeGreaterThan(0);
    const filter = api.getByRole('textbox', { name: '筛选 API 属性', exact: true });
    await filter.fill('no_such_property_不存在');
    await expect(api.getByText('没有匹配的属性', { exact: true })).toBeVisible();
    await api.scrollIntoViewIfNeeded();
    await captureFeedback(page, prefix + '-api-empty', info);
    await api.getByRole('button', { name: '清除筛选', exact: true }).click();
    await expect(filter).toHaveValue('');
    await expect(filter).toBeFocused();
    await expect.poll(() => api.locator('.crab-docs-properties > div').count()).toBeGreaterThan(0);

    const demo = page.locator('[data-component-demo-id]').first();
    const frame = demo.locator('iframe');
    await demo.scrollIntoViewIfNeeded();
    await expect(frame).toHaveAttribute('aria-busy', 'false', { timeout: 20_000 });
    await (await frame.elementHandle()).contentFrame().then(child => child.evaluate(() => {
        globalThis.parent.postMessage({ type: 'wake:error', error: 'The example could not be loaded: diagnostic-resource.js' }, globalThis.location.origin);
    }));
    await expect(demo.getByRole('alert')).toContainText('演示加载失败');
    await expect(demo.getByRole('alert')).not.toContainText('diagnostic-resource.js');
    await expect(demo.locator('.crab-docs-error-details')).not.toHaveAttribute('open');
    await expect(demo.getByRole('link', { name: '在工作台中打开（新窗口）', exact: true })).toHaveAttribute('target', '_blank');
    await demo.scrollIntoViewIfNeeded();
    await captureFeedback(page, prefix + '-demo-error', info);
    const retry = demo.getByRole('button', { name: '重新加载演示', exact: true });
    await retry.focus();
    await page.keyboard.press('Enter');
    await expect(frame).toHaveAttribute('aria-busy', 'false', { timeout: 20_000 });
    await expect(frame).toBeFocused();

    await page.route(searchModule, route => route.abort('failed'));
    await page.getByRole('button', { name: '搜索文档', exact: true }).click();
    const search = page.getByRole('dialog', { name: '搜索文档', exact: true });
    await expect(search.getByRole('alert')).toContainText('搜索暂时不可用');
    await expect(search.getByRole('option')).toHaveCount(0);
    await expect(search.locator('.crab-docs-error-details')).not.toHaveAttribute('open');
    await captureFeedback(page, prefix + '-search-error', info);
    await search.getByRole('button', { name: '浏览组件目录', exact: true }).click();
    await expect(search).not.toBeVisible();
    await readySitePage(page, catalog, config);
    await expect(page.locator('.crab-docs-page .crab-docs-page-heading h1')).toBeFocused();
});
