import { test, expect, configurations, openDemo } from './component-fixture.mjs';
import { sampleMotion } from './motion-fixture.mjs';

test.use({ video: 'on' });

// Observe the changed entry/exit offsets through the public, persistent demos.
// The stable frame remains measurable after the notice has completed its exit.
for (const slug of ['rc-message', 'rc-notification']) {
    const directions = slug === 'rc-message' ? ['default']
        : ['default', 'top', 'topLeft', 'bottom', 'bottomLeft', 'bottomRight'];
    for (const config of configurations) for (const direction of directions) {
        test(`${slug} ${config.designSystem} ${config.colorMode} ${direction} natural entry and exit`, {
            tag: ['@motion', `@${slug}`],
        }, async ({ page, previewOrigin }, info) => {
            const root = await openDemo(page, previewOrigin, slug, 'visual-matrix.demo.tsx', config);
            const frame = root.locator('[data-visual-frame]');
            const notice = frame.locator('[data-visual-target]');
            const close = page.getByRole('button', { name: '关闭展示', exact: true });
            await close.click();
            await expect(notice).toHaveCount(0);

            await page.getByLabel('验收状态', { exact: true }).selectOption(direction);
            await expect(notice).toHaveAttribute('data-state', 'open');
            await sampleMotion(page, frame, info, 'notice-entry');
            const instance = await notice.elementHandle();
            // Dispatch directly so the first closed frame is observed before
            // Playwright's click stabilization can consume a short transition.
            const exit = await close.evaluate(async (button, original) => {
                button.click();
                await new Promise(resolve => globalThis.requestAnimationFrame(resolve));
                return { connected: original.isConnected, state: original.dataset.state,
                    animations: original.getAnimations().map(animation => ({
                        property: animation.transitionProperty ?? animation.animationName,
                        state: animation.playState, time: Number(animation.currentTime),
                    })) };
            }, instance);
            expect(exit.connected).toBe(true);
            expect(exit.state).toBe('closed');
            await info.attach('exit-first-paint', { body: JSON.stringify(exit), contentType: 'application/json' });
            await sampleMotion(page, frame, info, 'notice-exit');
            await expect(notice).toHaveCount(0);
            await instance.dispose();

            // A live preference update must retain content, then make removal
            // immediate without a dependency on an animation completion event.
            await page.getByLabel('验收状态', { exact: true }).selectOption(direction);
            await expect(notice).toHaveAttribute('data-state', 'open');
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await expect(notice).toHaveCount(1);
            await expect.poll(() => notice.evaluate(node => node.getAnimations().length)).toBe(0);
            await close.evaluate(button => button.click());
            await expect(notice).toHaveCount(0);
        });
    }
}
