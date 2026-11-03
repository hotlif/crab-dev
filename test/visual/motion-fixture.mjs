/** Let an initial theme's field geometry settle before measuring a new action. */
export async function settleMotionGeometry(target) {
    await target.evaluate(async root => {
        root.getBoundingClientRect();
        await globalThis.document.fonts.ready;
        const nodes = [root, ...root.querySelectorAll('label,[data-role="select-label"],[data-field-control],[role="combobox"]')];
        let previous, stable = 0;
        const start = globalThis.performance.now();
        while (globalThis.performance.now() - start < 3000) {
            await new Promise(resolve => globalThis.requestAnimationFrame(resolve));
            const current = JSON.stringify(nodes.map(node => {
                const box = node.getBoundingClientRect();
                return [box.x, box.y, box.width, box.height];
            }));
            stable = current === previous ? stable + 1 : 0;
            if (stable >= 3) return;
            previous = current;
        }
        throw new Error('Initial theme field geometry did not settle naturally');
    });
}

/** Observe natural playback; do not seek, finish or disable animations here. */
export async function sampleMotion(page, target, info, label) {
    const observations = [];
    for (let index = 0; index < 3; index++) {
        if (index) await page.evaluate(() => new Promise(resolve => {
            const start = globalThis.performance.now();
            const frame = now => now - start >= 60 ? resolve() : globalThis.requestAnimationFrame(frame);
            globalThis.requestAnimationFrame(frame);
        }));
        observations.push(await target.evaluate(root => ({
            time: globalThis.performance.now(),
            nodes: [root, ...root.querySelectorAll('*')].flatMap(node => {
                const animations = node.getAnimations();
                if (!animations.length && node !== root) return [];
                const style = globalThis.getComputedStyle(node), rect = node.getBoundingClientRect();
                return [{ tag: node.tagName, state: node.getAttribute('data-state'), opacity: style.opacity,
                    translate: style.translate, scale: style.scale, transform: style.transform,
                    bounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
                    animations: animations.map(animation => ({ time: Number(animation.currentTime), state: animation.playState,
                        property: animation.transitionProperty ?? animation.animationName ?? 'web-animation' })) }];
            }),
        })));
        // A locator screenshot waits for its box to stop moving. Capture the
        // viewport directly so short exits and translations remain visible,
        // and every frame uses the same coordinate space.
        await info.attach(`${label}-natural-${index}`, { body: await page.screenshot({ animations: 'allow', caret: 'hide' }), contentType: 'image/png' });
    }
    await info.attach(`${label}-observations`, { body: JSON.stringify(observations), contentType: 'application/json' });
    return observations;
}
