import { test, expect, configurations, openDemo, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';

for (const config of configurations) {
    test(`${config.designSystem} ${config.colorMode} replacement exit with an infinite child`, {
        tag: ['@motion', '@rc-dialog', '@presence'],
    }, async ({ page, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-dialog', 'motion.demo.tsx', config);
        const trigger = page.getByRole('button', { name: '打开连续性演示', exact: true });
        await trigger.focus();
        await trigger.press('Enter');
        const dialog = page.getByRole('dialog', { name: '动效连续性', exact: true });
        await settleFiniteAnimations(page);

        // Supply real native Animation instances. Cancellation during the exit
        // must cause presence to observe the replacement's finished promise.
        const probe = await dialog.evaluateHandle(node => {
            const input = node.querySelector('input');
            const panel = input.closest('[data-state]');
            const child = input.animate([{ opacity: 1 }, { opacity: 0.95 }], { duration: 80, iterations: Infinity });
            const previous = panel.animate([{ opacity: 1 }, { opacity: 0.95 }], { duration: 2000 });
            let observer;
            const done = new Promise(resolve => {
                observer = new MutationObserver(() => {
                    if (panel.dataset.state !== 'closed') return;
                    observer.disconnect();
                    previous.cancel();
                    const replacement = panel.animate([{ opacity: 0.95 }, { opacity: 0 }], { duration: 600 });
                    void replacement.finished.then(() => resolve({
                        openAtReplacementEnd: node.open,
                        childState: child.playState,
                        state: panel.dataset.state,
                    }), () => resolve({ cancelled: true }));
                });
                observer.observe(panel, { attributes: true, attributeFilter: ['data-state'] });
            });
            return { done, cleanup: () => { observer.disconnect(); previous.cancel(); child.cancel(); } };
        });
        try {
            await page.keyboard.press('Escape');
            const result = await probe.evaluate(probe => probe.done);
            await info.attach('native-exit-replacement', { body: JSON.stringify(result), contentType: 'application/json' });
            expect(result).toEqual({ openAtReplacementEnd: true, childState: 'running', state: 'closed' });
            // The child's infinite animation remains active until cleanup, so
            // it cannot be used as the condition for releasing the modal.
            await expect(dialog).not.toBeVisible();
            await expect(trigger).toBeFocused();
        } finally {
            await probe.evaluate(probe => probe.cleanup());
            await probe.dispose();
        }
    });
}
