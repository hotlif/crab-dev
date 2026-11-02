import { test, expect, configurations, environmentCases, applyEnvironment, captureVisual } from '../../../test/visual/component-fixture.mjs';
import { sitePages, openSite, assertDocumentWidth, appearanceTrigger, openAppearance } from './site-visual-support.mjs';

// Include deliberately delayed responses and their real transition captures.
test.describe.configure({ timeout: 90_000 });
const home = sitePages.find(page => page.id === 'home');
const environments = environmentCases.filter(environment => ['narrow', 'tablet', 'desktop', 'forced-colors', 'reduced-motion'].includes(environment.id));
const guideModule = /\/getting-started\.[a-f0-9]+\.js(?:\?.*)?$/;
const componentModule = /\/rc-line-edit\.[a-f0-9]+\.js(?:\?.*)?$/;

async function holdModule(page, pattern) {
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    await page.route(pattern, async route => { await gate; await route.continue(); });
    return release;
}

async function inspectPlaceholder(page, title, info) {
    const placeholder = page.locator('.crab-docs-page-placeholder');
    await expect(placeholder).toBeVisible();
    await expect(placeholder).toHaveAttribute('aria-busy', 'true');
    await expect(placeholder.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(placeholder).toHaveAttribute('data-stage', 'loading');
    await expect(placeholder.getByRole('link')).toHaveCount(0);
    await expect(placeholder.getByRole('button')).toHaveCount(0);
    await expect(page.locator('.crab-docs-page-load-status')).toContainText(title);
    const skeletonVisible = await placeholder.locator('.crab-docs-page-load-code-label').evaluate(node => {
        const style = getComputedStyle(node);
        return style.backgroundColor !== getComputedStyle(node.parentElement).backgroundColor
            || Number.parseFloat(style.borderWidth) > 0 || Number.parseFloat(style.outlineWidth) > 0;
    });
    expect(skeletonVisible, 'Skeleton remains distinguishable from the example surface').toBe(true);
    expect(await placeholder.evaluate(node => node.getBoundingClientRect().height >= globalThis.innerHeight - 64)).toBe(true);
    await assertDocumentWidth(page, info);
    return placeholder;
}

async function captureLoading(page, name, info) {
    // A held response is an explicit loading premise. Capture the progress bar
    // at one fixed phase after checking the user's motion preference.
    await page.evaluate(() => {
        for (const animation of document.querySelector('.crab-docs-page-load-progress').getAnimations({ subtree: true })) {
            animation.pause();
            animation.currentTime = 800;
        }
    });
    await captureVisual(page, name, info);
}

for (const config of configurations) for (const environment of environments) {
    test('Site document transition ' + [config.designSystem, config.colorMode, environment.id].join(' '), {
        tag: ['@website', '@site-loading', '@chromium-only'],
        annotation: { type: 'site', description: JSON.stringify({ ...config, environment: environment.id, state: 'document-loading' }) },
    }, async ({ page, previewOrigin }, info) => {
        await page.setViewportSize(environment.viewport ?? { width: 1440, height: 900 });
        await applyEnvironment(page, environment);
        const release = await holdModule(page, guideModule);
        try {
            await openSite(page, previewOrigin, home, config);
            await page.locator('.crab-home-hero').getByRole('link', { name: '开始使用', exact: true }).click();
            const placeholder = await inspectPlaceholder(page, '开始使用', info);
            const headingBox = await placeholder.getByRole('heading', { level: 1 }).boundingBox();
            await expect(appearanceTrigger(page)).toBeVisible();
            await expect(page.getByRole('button', { name: '搜索文档', exact: true })).toBeEnabled();
            if (environment.id === 'reduced-motion') {
                expect(await page.locator('.crab-docs-page-load-progress span').evaluate(node => getComputedStyle(node).animationName)).toBe('none');
            }
            await captureLoading(page, [config.designSystem, config.colorMode, environment.id, 'document-loading'].join('-') + '.png', info);
            release();
            await expect(placeholder).toHaveCount(0);
            const heading = page.locator('.crab-docs-page .crab-docs-page-heading h1');
            await expect(heading).toHaveText('开始使用');
            await expect(heading).toBeFocused();
            const loadedBox = await heading.boundingBox();
            expect(Math.abs(loadedBox.x - headingBox.x)).toBeLessThan(1);
            expect(Math.abs(loadedBox.y - headingBox.y)).toBeLessThan(1);
            await expect(page.locator('.crab-docs-page-load-status')).toHaveCount(0);
        } finally { release(); }
    });
}

for (const config of configurations) test('Site component transition ' + [config.designSystem, config.colorMode].join(' '), {
    tag: ['@website', '@site-loading', '@chromium-only'],
    annotation: { type: 'site', description: JSON.stringify({ ...config, environment: 'narrow', state: 'component-loading' }) },
}, async ({ page, previewOrigin }, info) => {
    await page.setViewportSize({ width: 320, height: 768 });
    const release = await holdModule(page, componentModule);
    try {
        await openSite(page, previewOrigin, home, config);
        await page.getByRole('navigation', { name: '输入与操作组件', exact: true }).getByRole('link', { name: '文本输入', exact: true }).click();
        const placeholder = await inspectPlaceholder(page, 'LineEdit 单行输入框', info);
        await expect(placeholder.locator('.crab-docs-page-load-artwork')).toBeVisible();
        expect(await page.evaluate(() => globalThis.scrollY)).toBe(0);
        await captureLoading(page, [config.designSystem, config.colorMode, 'narrow', 'component-loading'].join('-') + '.png', info);
        release();
        await expect(placeholder).toHaveCount(0);
        await expect(page.locator('.crab-docs-page .crab-docs-page-heading h1')).toHaveText('LineEdit 单行输入框');
        await expect(page.locator('.crab-docs-page .crab-docs-page-heading h1')).toBeFocused();
    } finally { release(); }
});

test('Site initial document, slow response, theme and keyboard', {
    tag: ['@website', '@site-loading', '@chromium-only'],
    annotation: { type: 'site', description: JSON.stringify({ designSystem: 'md3', colorMode: 'light', environment: 'desktop', state: 'initial-slow-loading' }) },
}, async ({ page, previewOrigin }, info) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const release = await holdModule(page, guideModule);
    try {
        await page.goto(previewOrigin + '/guides/getting-started');
        const placeholder = await inspectPlaceholder(page, '开始使用', info);
        await expect(placeholder).toHaveAttribute('data-stage', 'slow', { timeout: 12_000 });
        await expect(page.locator('.crab-docs-page-load-status')).toContainText('准备好后会自动显示');
        const retained = await placeholder.elementHandle();
        const menu = await openAppearance(page, { keyboard: true });
        await menu.getByRole('menuitemradio', { name: 'Apple', exact: true }).click();
        expect(await retained.evaluate(node => node === document.querySelector('.crab-docs-page-placeholder'))).toBe(true);
        await expect(placeholder).toHaveAttribute('data-stage', 'slow');
        await page.getByRole('button', { name: '搜索文档', exact: true }).focus();
        await page.keyboard.press('Enter');
        await expect(page.getByRole('dialog', { name: '搜索文档', exact: true })).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.getByRole('button', { name: '搜索文档', exact: true })).toBeFocused();
        release();
        await expect(placeholder).toHaveCount(0);
        await expect(page.locator('.crab-docs-page .crab-docs-page-heading h1')).toHaveText('开始使用');
    } finally { release(); }
});

test('Site abandoned transition ignores late completion', {
    tag: ['@website', '@site-loading', '@chromium-only'],
    annotation: { type: 'site', description: JSON.stringify({ designSystem: 'md3', colorMode: 'light', environment: 'desktop', state: 'abandoned-loading' }) },
}, async ({ page, previewOrigin }, info) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const release = await holdModule(page, guideModule);
    try {
        await openSite(page, previewOrigin, home, { designSystem: 'md3', colorMode: 'light' });
        await page.locator('.crab-home-hero').getByRole('link', { name: '开始使用', exact: true }).click();
        await inspectPlaceholder(page, '开始使用', info);
        await page.getByRole('navigation', { name: '站点导航', exact: true }).getByRole('link', { name: '公共 API 约定', exact: true }).click();
        await expect(page.locator('.crab-docs-page .crab-docs-page-heading h1')).toHaveText('公共 API 约定');
        const completed = page.waitForResponse(guideModule);
        release();
        await completed;
        await expect(page.locator('.crab-docs-page .crab-docs-page-heading h1')).toHaveText('公共 API 约定');
        await expect(page.locator('.crab-docs-page-placeholder')).toHaveCount(0);
        await expect(page.locator('.crab-docs-page .crab-docs-page-heading h1')).toBeFocused();
    } finally { release(); }
});

test('Site failed transition keeps the framework retry action', {
    tag: ['@website', '@site-loading', '@chromium-only'],
    annotation: { type: 'site', description: JSON.stringify({ designSystem: 'md3', colorMode: 'light', environment: 'desktop', state: 'loading-error' }) },
}, async ({ page, previewOrigin }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.route(guideModule, route => route.abort('failed'));
    await openSite(page, previewOrigin, home, { designSystem: 'md3', colorMode: 'light' });
    await page.locator('.crab-home-hero').getByRole('link', { name: '开始使用', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('文档加载失败');
    await expect(page.locator('.crab-docs-page-placeholder')).toHaveCount(0);
    await expect(page.getByRole('button', { name: '重试加载', exact: true })).toBeEnabled();
});
