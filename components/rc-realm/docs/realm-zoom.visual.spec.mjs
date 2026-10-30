import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) test(`${config.designSystem} ${config.colorMode} remote drafts at real 200%`, {
    tag: ['@rc-realm', '@environment', '@chromium-only'],
    annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
}, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, 'rc-realm', spec.demo, config);
    const complete = page.getByRole('button', { name: '完成请求', exact: true }); await expect(complete).toBeEnabled(); await complete.click();
    const scene = page.getByRole('region', { name: 'Realm visual matrix' }), input = scene.getByRole('textbox');
    await input.fill('保留 200% remote draft'); const original = await input.elementHandle();
    await expect(scene.locator('[aria-busy]').first()).toHaveAttribute('aria-busy', 'false');
    await realZoom.set200(page); await scene.scrollIntoViewIfNeeded(); await settleFiniteAnimations(page);
    expect(await original.evaluate(node => node.isConnected)).toBe(true); await expect(input).toHaveValue('保留 200% remote draft');
    await input.scrollIntoViewIfNeeded(); await input.focus(); await page.keyboard.press('End');
    // A real pointer blur keeps the static viewport free from a blinking caret.
    await scene.click({ position: { x: 2, y: 2 } });
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-remote-draft.png`, info);

    await page.getByRole('button', { name: '切换协议', exact: true }).click(); await expect(scene).toHaveAttribute('data-protocol', 'mount');
    await expect(complete).toBeEnabled(); await scene.scrollIntoViewIfNeeded();
    await expect(scene.locator('[aria-busy]').first()).toHaveAttribute('aria-busy', 'true');
    const frames = [];
    for (let index = 0; index < 3; index++) {
        frames.push(await scene.evaluate(node => ({ time: performance.now(), animations: node.getAnimations({ subtree: true }).map(animation => ({ time: animation.currentTime, state: animation.playState })) })));
        await info.attach(`zoom-natural-loading-${index}`, { body: await realZoom.capture200(page), contentType: 'image/png' });
        if (index < 2) await page.waitForTimeout(120);
    }
    expect(frames[2].time).toBeGreaterThan(frames[0].time);
    expect(frames.some(frame => frame.animations.some(animation => animation.state === 'running'))).toBe(true);
    await info.attach('zoom-loading-time-series', { body: JSON.stringify(frames, null, 2), contentType: 'application/json' });
    await complete.click();
    const shadowInput = scene.getByRole('textbox'); await expect(shadowInput).toBeVisible();
    expect(await shadowInput.evaluate(node => node.getRootNode() instanceof globalThis.ShadowRoot)).toBe(true);
    await shadowInput.fill('Shadow draft at 200%'); await shadowInput.scrollIntoViewIfNeeded(); await settleFiniteAnimations(page);
    await expect(shadowInput).toHaveValue('Shadow draft at 200%');
    await scene.click({ position: { x: 2, y: 2 } });
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-shadow-draft.png`, info);
});
