import { expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';

export async function settleChart(page, { empty = false } = {}) {
    // Production geometry uses a finite RAF transition of at most 600ms plus
    // 300ms category stagger. Observe natural frames through that entire bound.
    const frames = await page.evaluate(() => new Promise(resolve => {
        const started = performance.now();
        let count = 0;
        function frame(now) {
            count++;
            if (now - started < 950) requestAnimationFrame(frame);
            else requestAnimationFrame(presented => resolve({ elapsed: now - started, presented, lastTransitionFrame: now, count }));
        }
        requestAnimationFrame(frame);
    }));
    expect(frames.elapsed).toBeGreaterThanOrEqual(950);
    expect(frames.count).toBeGreaterThan(1);
    expect(frames.presented).toBeGreaterThan(frames.lastTransitionFrame);
    await settleFiniteAnimations(page);
    if (empty) {
        const scene = page.getByRole('region', { name: 'BarChart visual matrix' });
        await expect(scene.getByRole('status', { name: '暂无数据', exact: true })).toBeVisible();
        await expect(scene.getByRole('group', { name: 'Revenue chart', exact: true }).getByRole('button')).toHaveCount(0);
        await expect(scene.locator('canvas')).toHaveCount(0);
        return;
    }
    await expect.poll(() => page.getByRole('region', { name: 'BarChart visual matrix' }).locator('canvas').first().evaluate(canvas => {
        const gl = canvas.getContext('webgl2'), box = canvas.getBoundingClientRect();
        return !!gl && !gl.isContextLost() && box.width > 1 && box.height > 1
            && canvas.width === Math.round(box.width * globalThis.devicePixelRatio) && canvas.height === Math.round(box.height * globalThis.devicePixelRatio)
            && gl.drawingBufferWidth === canvas.width && gl.drawingBufferHeight === canvas.height;
    }), { message: 'The natural chart transition must end in a live GPU bitmap matching the measured canvas viewport' }).toBe(true);
}
