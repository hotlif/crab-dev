import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual, environmentCases, applyEnvironment } from '../../../test/visual/component-fixture.mjs';
import { expectFlowLabelContainment, readFlowLabelBands, waitForFlowPresentation } from './flow-diagram.visual-helpers.mjs';
const spec = await readVisualSpec(import.meta.url);
async function capture(scene, name, browserName, info) {
    await waitForFlowPresentation(scene);
    await captureVisual(scene, name, info, browserName);
}
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ['@rc-flow-diagram', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-flow-diagram', spec.demo, { ...config, size, density });
        const scene = page.getByRole('region', { name: 'FlowDiagram visual matrix' });
        const status = scene.getByLabel('布局状态');
        if (state === 'error') {
            // The failure state preserves an existing real layout. Complete the
            // first ELK request before replacing it with an invalid algorithm.
            await expect(status).toHaveAttribute('data-layout', 'ready');
            await expect(status).toHaveAttribute('data-node-count', '3');
        }
        await page.getByLabel('验收状态', { exact: true }).selectOption(['empty', 'error', 'manual-route', 'refresh'].includes(state) ? state : 'default');
        await expect(status).toHaveAttribute('data-layout', state === 'error' ? 'error' : 'ready');
        await expect(status).toHaveAttribute('data-node-count', state === 'empty' ? '0' : state === 'refresh' ? '4' : '3');
        await waitForFlowPresentation(scene, { labels: state !== 'empty' });
        if (state === 'empty') await expect(status).toContainText('暂无节点');
        if (state === 'error') {
            await expect(scene.getByRole('alert')).toContainText('保留上次画面');
            const summary = scene.getByText('查看布局错误详情', { exact: true });
            await summary.click();
            await expect(scene.locator('details[data-layout-error]')).toHaveAttribute('open', '');
            await expect(scene.locator('details[data-layout-error]')).toContainText('crab.invalid-algorithm');
            expect(await scene.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
            await capture(scene, `${config.designSystem}-${config.colorMode}-error-details.png`, browserName, info);
            await summary.click();
        }
        if (state === 'manual-route') {
            const points = JSON.parse(await status.getAttribute('data-routes'))['to-review'].points;
            const waypoint = { x: 180, y: 150 };
            expect(points.some((point, index) => {
                const next = points[index + 1];
                return next && ((point.x === next.x && point.x === waypoint.x && waypoint.y >= Math.min(point.y, next.y) && waypoint.y <= Math.max(point.y, next.y))
                    || (point.y === next.y && point.y === waypoint.y && waypoint.x >= Math.min(point.x, next.x) && waypoint.x <= Math.max(point.x, next.x)));
            })).toBe(true);
        }
        const entry = scene.getByRole('group', { name: '节点键盘入口' }).getByRole('button', { name: 'request', exact: true });
        if (state === 'focus-visible') {
            await scene.getByRole('region', { name: '流程图滚动区域' }).focus();
            // Canvas itself is focusable before the host's explicit node entry.
            const tabBound = await scene.locator('button:not([disabled])').count() + 2;
            for (let i = 0; i < tabBound && !await entry.evaluate(node => node === document.activeElement); i++) await page.keyboard.press('Tab');
            await expect(entry).toBeFocused(); expect(await entry.evaluate(node => node.matches(':focus-visible'))).toBe(true);
        }
        if (state === 'selected') { await entry.click(); await expect(entry).toHaveAttribute('aria-pressed', 'true'); await expect(scene).toHaveAttribute('data-selection', 'request'); }
        if (state === 'dragged') {
            const canvas = scene.locator('canvas').first();
            await canvas.scrollIntoViewIfNeeded();
            const bounds = await canvas.boundingBox();
            const node = JSON.parse(await status.getAttribute('data-node-rects')).request;
            const scale = await canvas.evaluate(element => ({ x: element.getBoundingClientRect().width / element.clientWidth, y: element.getBoundingClientRect().height / element.clientHeight }));
            const start = { x: bounds.x + (node.x + node.width / 2) * scale.x, y: bounds.y + (node.y + node.height / 2) * scale.y };
            expect(await canvas.evaluate((element, point) => element.ownerDocument.elementFromPoint(point.x, point.y) === element, start)).toBe(true);
            await page.mouse.move(start.x, start.y); await page.mouse.down();
            await page.mouse.move(start.x + 25 * scale.x, start.y + 30 * scale.y, { steps: 6 }); await page.mouse.up();
            await expect.poll(async () => JSON.parse(await scene.getAttribute('data-positions')).request).toBeDefined();
            const position = JSON.parse(await scene.getAttribute('data-positions')).request;
            expect(position.x).toBeCloseTo(node.x + 25, 1); expect(position.y).toBeCloseTo(node.y + 30, 1);
        }
        await settleFiniteAnimations(page);
        await capture(scene, `${config.designSystem}-${config.colorMode}-${size}-${density}-${state}.png`, browserName, info);
    });
}

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} keyboard movement and configuration preserve positions`, { tag: ['@rc-flow-diagram', '@boundary'] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, 'rc-flow-diagram', spec.demo, config);
    const scene = page.getByRole('region', { name: 'FlowDiagram visual matrix' });
    await expect(scene.getByLabel('布局状态')).toHaveAttribute('data-layout', 'ready');
    await waitForFlowPresentation(scene, { labels: true });
    const entry = scene.getByRole('button', { name: 'request', exact: true });
    await entry.focus(); await page.keyboard.press('ArrowRight');
    const positions = await scene.getAttribute('data-positions'); expect(positions).not.toBe('{}');
    await entry.click();
    const canvas = await scene.locator('canvas').first().elementHandle();
    for (const next of configurations) {
        await page.evaluate(config => globalThis.postMessage({ type: 'crab:preview-config', ...config, size: 'large', density: 'comfortable', locale: 'en-US', direction: 'rtl' }, location.origin), next);
        await expect(page.locator('.demo-default-preview').first()).toHaveAttribute('data-crab-design', next.designSystem);
        expect(await canvas.evaluate(node => node.isConnected)).toBe(true);
        await expect(scene).toHaveAttribute('data-positions', positions); await expect(entry).toHaveAttribute('aria-pressed', 'true');
    }
});

for (const environment of environmentCases) test.describe('FlowDiagram environment ' + environment.id, () => {
    test.use({ hasTouch: environment.hasTouch ?? false });
    for (const config of configurations) test(config.designSystem + ' ' + config.colorMode, { tag: ['@rc-flow-diagram', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ id: environment.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await applyEnvironment(page, environment);
        await openDemo(page, previewOrigin, 'rc-flow-diagram', spec.demo, { ...config, ...environment.config });
        const scene = page.getByRole('region', { name: 'FlowDiagram visual matrix' });
        await expect(scene.getByLabel('布局状态')).toHaveAttribute('data-layout', 'ready');
        await waitForFlowPresentation(scene, { labels: true });
        const bands = await readFlowLabelBands(scene);
        await page.getByLabel('验收状态', { exact: true }).selectOption('long-text');
        await expect(scene.getByLabel('布局状态')).toHaveAttribute('data-layout', 'ready');
        await waitForFlowPresentation(scene, { labels: true });
        await expectFlowLabelContainment(scene, bands);
        const entry = scene.getByRole('button', { name: 'request', exact: true });
        if (environment.hasTouch) {
            const bounds = await entry.boundingBox(); expect(bounds.height).toBeGreaterThanOrEqual(44); expect(bounds.width).toBeGreaterThanOrEqual(44);
            await entry.tap();
        } else { await entry.focus(); await page.keyboard.press('Space'); await page.keyboard.press('ArrowRight'); }
        await expect(entry).toHaveAttribute('aria-pressed', 'true');
        expect(await scene.evaluate(node => node.getBoundingClientRect().right <= globalThis.innerWidth + 1)).toBe(true);
        await capture(scene, config.designSystem + '-' + config.colorMode + '-' + environment.id + '.png', browserName, info);
    });
});

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} long labels remain inside nodes`, { tag: ['@rc-flow-diagram', '@domain-labels'] }, async ({ page, previewOrigin, browserName }, info) => {
    await openDemo(page, previewOrigin, 'rc-flow-diagram', spec.demo, config);
    const scene = page.getByRole('region', { name: 'FlowDiagram visual matrix' });
    await expect(scene.getByLabel('布局状态')).toHaveAttribute('data-layout', 'ready');
    await waitForFlowPresentation(scene, { labels: true });
    const bands = await readFlowLabelBands(scene);
    await page.getByLabel('验收状态', { exact: true }).selectOption('long-text');
    await expect(scene.getByLabel('布局状态')).toHaveAttribute('data-layout', 'ready');
    await waitForFlowPresentation(scene, { labels: true }); await expectFlowLabelContainment(scene, bands);
    await capture(scene, `${config.designSystem}-${config.colorMode}-contained-long-labels.png`, browserName, info);
});

test.describe('narrow touch layout feedback', () => {
    test.use({ hasTouch: true });
    for (const config of configurations) test(`${config.designSystem} ${config.colorMode}`, { tag: ['@rc-flow-diagram', '@domain-feedback', '@chromium-only'] }, async ({ page, previewOrigin, browserName }, info) => {
        await page.setViewportSize({ width: 320, height: 768 });
        await openDemo(page, previewOrigin, 'rc-flow-diagram', spec.demo, config);
        const scene = page.getByRole('region', { name: 'FlowDiagram visual matrix' }), status = scene.getByLabel('布局状态');
        await expect(status).toHaveAttribute('data-layout', 'ready'); await waitForFlowPresentation(scene, { labels: true });
        const canvas = await scene.locator('canvas').first().elementHandle(), positions = await status.getAttribute('data-node-rects');
        const scroll = scene.getByRole('region', { name: '流程图滚动区域' });
        for (const control of await scene.getByRole('toolbar', { name: '流程图视图工具栏' }).getByRole('button').all()) await expect(control).toBeInViewport({ ratio: 1 });
        await page.getByLabel('验收状态', { exact: true }).selectOption('error');
        await expect(status).toHaveAttribute('data-layout', 'error'); await expect(status).toHaveAttribute('data-node-rects', positions);
        const summary = scene.getByText('查看布局错误详情', { exact: true });
        expect((await summary.boundingBox()).height).toBeGreaterThanOrEqual(48);
        await summary.tap();
        const details = scene.locator('details[data-layout-error]'); await expect(details).toHaveAttribute('open', '');
        expect((await details.boundingBox()).width).toBeLessThanOrEqual((await scroll.boundingBox()).width + 1);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
        await capture(scene, `${config.designSystem}-${config.colorMode}-narrow-touch-error.png`, browserName, info);
        await summary.tap(); await page.getByLabel('验收状态', { exact: true }).selectOption('default');
        await expect(status).toHaveAttribute('data-layout', 'ready');
        expect(await canvas.evaluate(node => node.isConnected)).toBe(true);
    });
});
