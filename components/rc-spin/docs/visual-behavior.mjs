import { expect } from '../../../test/visual/component-fixture.mjs';

export function readSpinActivity(status) {
    return status.evaluate(async node => {
        // Await the browser's own pending start; never seek, finish or pause an animation.
        await Promise.all(node.getAnimations({ subtree: true }).map(animation => animation.ready));
        return {
            sampledAt: performance.now(),
            reducedMotion: globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches,
            animations: node.getAnimations({ subtree: true }).map(animation => {
                const effect = animation.effect;
                const timing = effect?.getTiming();
                const target = effect?.target;
                const style = target instanceof Element ? getComputedStyle(target, effect.pseudoElement || null) : null;
                return {
                    name: animation.animationName,
                    currentTime: animation.currentTime,
                    playState: animation.playState,
                    pending: animation.pending,
                    duration: timing?.duration,
                    iterations: timing?.iterations === Infinity ? 'infinite' : timing?.iterations,
                    easing: timing?.easing,
                    opacity: style?.opacity,
                    transform: style?.transform,
                    pseudoElement: effect?.pseudoElement,
                    keyframes: effect?.getKeyframes().map(frame => ({ opacity: frame.opacity, transform: frame.transform, offset: frame.offset })),
                };
            }),
        };
    });
}

export function assertNaturalActivity(sequence, { reducedMotion = false } = {}) {
    const first = sequence[0];
    const last = sequence.at(-1);
    const active = first.animations.filter(animation => animation.iterations === 'infinite');
    expect(active.length).toBeGreaterThan(0);
    if (reducedMotion) expect(sequence.every(sample => sample.reducedMotion)).toBe(true);
    expect(last.sampledAt - first.sampledAt).toBeGreaterThanOrEqual(450);
    for (const initial of active) {
        const samples = sequence.map(sample => sample.animations.find(animation => animation.name === initial.name));
        for (const animation of samples) {
            expect(animation).toBeDefined();
            expect(animation.playState).toBe('running');
            expect(animation.pending).toBe(false);
            expect(animation.iterations).toBe('infinite');
            expect(typeof animation.currentTime).toBe('number');
        }
        expect(samples.at(-1).currentTime - initial.currentTime).toBeGreaterThanOrEqual(450);
        if (reducedMotion) {
            // Crab CSS scopes keyframes with a generated suffix; inspect their actual effect too.
            expect(initial.name).toMatch(/breathe/);
            expect(initial.name).not.toMatch(/rotate|orbit|morph/);
            const opacities = [];
            for (const animation of samples) {
                expect(animation.duration).toBe(1600);
                expect(animation.keyframes.some(frame => frame.opacity !== undefined)).toBe(true);
                expect(animation.keyframes.every(frame => !frame.transform || frame.transform === 'none')).toBe(true);
                expect(animation.transform).toBe('none');
                const opacity = Number(animation.opacity);
                expect(opacity).toBeGreaterThan(0);
                expect(opacity).toBeLessThanOrEqual(1);
                opacities.push(opacity);
            }
            expect(Math.max(...opacities) - Math.min(...opacities)).toBeGreaterThan(0.01);
        }
    }
}

export async function prepareWrappedControl(frame, stateControl) {
    await stateControl.selectOption('idle');
    const control = frame.locator('[role="switch"]');
    await control.click();
    await expect(control).toHaveAttribute('aria-checked', 'true');
    return { control, original: await control.elementHandle() };
}

export async function assertOverlayIsolation(page, frame, stateControl, wrapped, info) {
    const { control, original } = wrapped;
    await expect(frame.locator('[aria-busy]')).toHaveAttribute('aria-busy', 'true');
    const inert = frame.locator('[inert]');
    await expect(inert).toHaveCount(1);
    expect(await inert.evaluate(node => node.inert)).toBe(true);
    expect(await original.evaluate(node => node.isConnected && node.closest('[inert]')?.inert)).toBe(true);
    await expect(control).toHaveAttribute('aria-checked', 'true');

    // Playwright 1.64.1's role selector does not filter inert. Test native interaction instead.
    await stateControl.focus();
    await expect(stateControl).toBeFocused();
    await page.keyboard.press('Tab');
    const keyboard = await control.evaluate(node => ({
        focused: node.ownerDocument.activeElement === node,
        activeWithinInert: Boolean(node.ownerDocument.activeElement?.closest('[inert]')),
        activeTag: node.ownerDocument.activeElement?.tagName,
    }));
    await control.scrollIntoViewIfNeeded();
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    // Coordinates deliver a real pointer event without forcing an action on inert content.
    await page.mouse.click(point.x, point.y);
    const pointer = await control.evaluate(node => ({
        checked: node.getAttribute('aria-checked'),
        focused: node.ownerDocument.activeElement === node,
        inert: node.closest('[inert]')?.inert,
    }));
    await info.attach('native-inert-isolation', { body: JSON.stringify({ keyboard, pointer, point, box }), contentType: 'application/json' });
    expect(keyboard.focused).toBe(false);
    expect(keyboard.activeWithinInert).toBe(false);
    expect(pointer.inert).toBe(true);
    expect(pointer.checked).toBe('true');
    expect(pointer.focused).toBe(false);
    await expect(control).toHaveAttribute('aria-checked', 'true');
}

export async function assertWrappedControlRestored(page, frame, stateControl, wrapped, info) {
    const { control, original } = wrapped;
    await stateControl.selectOption('idle');
    await expect(frame.locator('[aria-busy]')).toHaveAttribute('aria-busy', 'false');
    await expect(frame.locator('[inert]')).toHaveCount(0);
    expect(await original.evaluate(node => node.isConnected)).toBe(true);
    expect(await original.evaluate((node, current) => node === current, await control.elementHandle())).toBe(true);
    await expect(control).toHaveAttribute('aria-checked', 'true');
    await stateControl.focus();
    await page.keyboard.press('Tab');
    await expect(control).toBeFocused();
    await page.keyboard.press('Space');
    await expect(control).toHaveAttribute('aria-checked', 'false');
    await control.click();
    await expect(control).toHaveAttribute('aria-checked', 'true');
    await info.attach('native-inert-restored', {
        body: JSON.stringify(await control.evaluate(node => ({
            connected: node.isConnected,
            checked: node.getAttribute('aria-checked'),
            focused: node.ownerDocument.activeElement === node,
            inert: Boolean(node.closest('[inert]')),
        }))),
        contentType: 'application/json',
    });
}
