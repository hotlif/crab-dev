import { Buffer } from 'node:buffer';
import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from '../../../test/visual/component-fixture.mjs';

// Headed native zoom shares a display; retain independent, sequential cases.
test.describe.configure({ mode: 'default' });
import { sampleFlowFrames, waitForFlowPresentation } from './flow-diagram.visual-helpers.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) test(`${config.designSystem} ${config.colorMode} diagram at real 200%`, {
    tag: ['@rc-flow-diagram', '@environment', '@chromium-only'],
    annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
}, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, 'rc-flow-diagram', spec.demo, config);
    const scene = page.getByRole('region', { name: 'FlowDiagram visual matrix' });
    await expect(scene.getByLabel('布局状态')).toHaveAttribute('data-layout', 'ready');
    await expect(scene.getByLabel('布局状态')).toHaveAttribute('data-node-count', '3');
    await waitForFlowPresentation(scene, { labels: true });
    const entry = scene.getByRole('button', { name: 'request', exact: true });
    await entry.click(); await page.keyboard.press('ArrowRight');
    const positions = await scene.getAttribute('data-positions'), canvas = await scene.locator('canvas').first().elementHandle();
    expect(positions).not.toBe('{}');
    await realZoom.set200(page); await scene.scrollIntoViewIfNeeded(); await settleFiniteAnimations(page);
    expect(await canvas.evaluate(node => node.isConnected)).toBe(true);
    await waitForFlowPresentation(scene);
    await expect(scene).toHaveAttribute('data-positions', positions); await expect(scene).toHaveAttribute('data-selection', 'request');
    await expect(entry).toHaveAttribute('aria-pressed', 'true');
    const scroll = scene.getByRole('region', { name: '流程图滚动区域' });
    await scroll.scrollIntoViewIfNeeded(); await scroll.focus();
    const before = await scroll.evaluate(node => ({ left: node.scrollLeft, clientWidth: node.clientWidth, scrollWidth: node.scrollWidth, overflow: getComputedStyle(node).overflowX }));
    expect(before.overflow).toBe('auto'); expect(before.clientWidth).toBeGreaterThan(0);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-diagram.png`, info);
    if (before.scrollWidth > before.clientWidth + 1) {
        // Element.scrollBy changes the real named scroll container. The physical
        // viewport is captured again; no image stitching or artificial viewport is used.
        await scroll.evaluate(node => node.scrollBy({ left: node.clientWidth, behavior: 'instant' }));
        await expect.poll(() => scroll.evaluate(node => node.scrollLeft)).toBeGreaterThan(before.left);
        await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-diagram-scrolled.png`, info);
    }
    await info.attach('zoom-diagram-state', { body: JSON.stringify({ positions, before, after: await scroll.evaluate(node => ({ left: node.scrollLeft, clientWidth: node.clientWidth, scrollWidth: node.scrollWidth })) }), contentType: 'application/json' });

    // A second domain state keeps natural flowing edges visible in native video.
    // These raw time samples are evidence, rather than a frozen animation baseline.
    await page.getByLabel('验收状态', { exact: true }).selectOption('motion');
    await expect(scene.getByLabel('布局状态')).toHaveAttribute('data-layout', 'ready');
    await scroll.evaluate(node => node.scrollTo({ left: 0, behavior: 'instant' })); await scroll.scrollIntoViewIfNeeded();
    await waitForFlowPresentation(scene);
    // Selection uses its own paired label paint; the initial default-label
    // probe above is intentionally not reused for this selected node.
    // Native desktop capture can sample the same phase of repeating dashes.
    // Prove movement from actual GPU paints on natural frames at the real zoom.
    const paints = await sampleFlowFrames(scene.locator('canvas').first(), 900);
    const distinct = [...new Map(paints.map(frame => [frame.png, frame])).values()];
    expect(distinct.length).toBeGreaterThan(2);
    for (const index of [0, Math.floor(distinct.length / 2), distinct.length - 1]) {
        await info.attach(`zoom-gpu-edge-${index}`, { body: Buffer.from(distinct[index].png.split(',')[1], 'base64'), contentType: 'image/png' });
    }
    const frames = [];
    for (let index = 0; index < 3; index++) {
        frames.push({ index, time: await page.evaluate(() => performance.now()) });
        const image = await realZoom.capture200(page);
        await info.attach(`zoom-natural-edge-${index}`, { body: image, contentType: 'image/png' });
        if (index < 2) await page.waitForTimeout(120);
    }
    expect(frames[2].time).toBeGreaterThan(frames[0].time);
    await info.attach('zoom-edge-time-series', { body: JSON.stringify({ desktopFrames: frames, gpuOffsets: paints.map(frame => frame.time - paints[0].time), distinctPaints: distinct.length }, null, 2), contentType: 'application/json' });
});
