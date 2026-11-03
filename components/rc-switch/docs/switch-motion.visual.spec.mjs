import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { sampleMotion } from '../../../test/visual/motion-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
test.use({ video: 'on' });
for (const config of configurations) for (const size of spec.sizes) {
    test(`${config.designSystem} ${config.colorMode} ${size} switch reversal`, { tag: ['@motion', '@rc-switch', ...(size !== 'medium' ? ['@chromium-only'] : [])] }, async ({ page, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-switch', spec.demo, { ...config, size });
        const control = page.getByRole('switch', { name: 'Primary option', exact: true });
        const handle = await control.locator(':scope > span').elementHandle();
        await control.focus();
        // Observe the real transition start before activating. A driver round
        // trip can outlast a short transition, while WebKit can commit React's
        // update after the first frame callback. Neither changes the motion.
        const activation = await control.evaluate(node => new Promise(resolve => {
            const parts = [node, ...node.querySelectorAll('*')];
            for (const part of parts) part.getAnimations(); // Flush the previous visual state.
            let timer;
            const finish = record => {
                globalThis.clearTimeout(timer);
                node.removeEventListener('transitionrun', started);
                resolve(record);
            };
            const started = event => {
                if (event.propertyName !== 'translate') return;
                finish({ property: event.propertyName, elapsedTime: event.elapsedTime,
                    animations: parts.flatMap(part => part.getAnimations().map(animation => ({
                        property: animation.transitionProperty ?? animation.animationName,
                        state: animation.playState, time: Number(animation.currentTime),
                    }))) });
            };
            node.addEventListener('transitionrun', started);
            timer = globalThis.setTimeout(() => finish({ property: null, animations: [] }), 1000);
            node.click();
        }));
        await info.attach('checked-first-paint', { body: JSON.stringify(activation), contentType: 'application/json' });
        await expect(control).toHaveAttribute('aria-checked', 'true');
        expect(activation.property).toBe('translate');
        await sampleMotion(page, control, info, 'checked');
        await control.press('Space');
        await control.press('Space');
        await control.press('Space');
        await settleFiniteAnimations(page);
        await expect(control).toHaveAttribute('aria-checked', 'false');
        expect(await control.locator(':scope > span').evaluate((node, original) => node === original, handle)).toBe(true);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await control.press('Space');
        await expect(control).toHaveAttribute('aria-checked', 'true');
        expect(await control.evaluate(node => node.getAnimations({ subtree: true }).length)).toBe(0);
        await expect(control).toBeFocused();
        await handle.dispose();
    });
}
