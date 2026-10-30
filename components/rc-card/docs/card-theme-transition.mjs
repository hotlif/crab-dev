import { expect } from '../../../test/visual/component-fixture.mjs';

/** Observe the real preview protocol without pausing or seeking product motion. */
export async function assertCardThemeTransition(frame, next, variant, info) {
    const result = await frame.evaluate(async (container, configuration) => {
        const required = selector => {
            const node = container.querySelector(selector);
            if (!node) throw new Error('Missing Card theme fixture: ' + selector);
            return node;
        };
        const selectors = {
            root: '[data-visual-target]',
            title: '[data-theme-title]',
            body: '[data-theme-body]',
            metaTitle: '[data-theme-meta-title]',
            metaDescription: '[data-theme-meta-description]',
        };
        const nodes = Object.fromEntries(Object.entries(selectors).map(([role, selector]) => [role, required(selector)]));
        const boundary = container.closest('.demo-default-preview');
        const draft = container.ownerDocument.querySelector('[data-theme-draft]');
        if (!boundary || !draft) throw new Error('Missing Card configuration boundary or draft');
        const configOf = node => ({ designSystem: node?.getAttribute('data-crab-design'), colorMode: node?.getAttribute('data-theme') });
        const read = time => ({
            time,
            boundary: configOf(boundary),
            effective: configOf(nodes.root.closest('[data-crab-design][data-theme]')),
            palette: {
                background: getComputedStyle(nodes.root).backgroundColor,
                ...Object.fromEntries(Object.entries(nodes).map(([role, node]) => [role, getComputedStyle(node).color])),
            },
            nodesRetained: Object.entries(selectors).every(([role, selector]) => nodes[role].isConnected && container.querySelector(selector) === nodes[role]),
            draftRetained: draft.isConnected && container.ownerDocument.querySelector('[data-theme-draft]') === draft,
            draft: draft.value,
            finite: nodes.root.getAnimations({ subtree: true })
                .filter(animation => (animation.playState === 'running' || animation.pending) && Number.isFinite(animation.effect?.getComputedTiming().endTime))
                .map(animation => ({ property: animation.transitionProperty ?? null, time: animation.currentTime, endTime: animation.effect.getComputedTiming().endTime })),
        });
        const before = read(performance.now());
        const samples = [];
        const started = performance.now();
        // The sampler is armed before postMessage. Its reads happen on natural
        // frames, including the first frame bearing the new configuration.
        return new Promise(resolve => {
            let settled = 0;
            const sample = time => {
                const current = read(time);
                samples.push(current);
                const committed = current.boundary.designSystem === configuration.designSystem && current.boundary.colorMode === configuration.colorMode;
                settled = committed && current.finite.length === 0 ? settled + 1 : 0;
                if (settled >= 3 || performance.now() - started > 4_000) {
                    resolve({ before, samples, complete: settled >= 3 });
                } else requestAnimationFrame(sample);
            };
            requestAnimationFrame(sample);
            globalThis.postMessage({ type: 'crab:preview-config', ...configuration }, globalThis.location.origin);
        });
    }, next);
    // Retain the failing trajectory before any assertion can end the test.
    await info.attach('theme-transition-' + variant, {
        body: JSON.stringify({ variant, next, scope: 'Natural browser rAF timestamps and computed palette; no synthetic state or static motion golden', ...result }),
        contentType: 'application/json',
    });
    expect(result.complete, variant + ' configuration and finite motion settle').toBe(true);
    const final = result.samples.at(-1);
    expect(final.boundary).toEqual(next);
    expect(final.effective).toEqual(next);
    for (const [role, color] of Object.entries(final.palette)) {
        expect(color, variant + ' actually changes ' + role).not.toBe(result.before.palette[role]);
    }
    const committed = result.samples.filter(sample => sample.boundary.designSystem === next.designSystem && sample.boundary.colorMode === next.colorMode);
    expect(committed.length).toBeGreaterThanOrEqual(3);
    for (let index = 1; index < result.samples.length; index++) {
        expect(result.samples[index].time, variant + ' natural rAF advances').toBeGreaterThan(result.samples[index - 1].time);
    }
    for (const sample of result.samples) {
        expect(sample.nodesRetained, variant + ' retains Card text nodes').toBe(true);
        expect(sample.draftRetained, variant + ' retains the draft node').toBe(true);
        expect(sample.draft).toBe(result.before.draft);
    }
    for (const sample of committed) {
        expect(sample.effective, variant + ' nearest boundary at ' + sample.time).toEqual(next);
        expect(sample.palette, variant + ' coherent content palette at ' + sample.time).toEqual(final.palette);
    }
}
