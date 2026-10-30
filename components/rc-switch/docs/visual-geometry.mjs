import { expect } from '../../../test/visual/component-fixture.mjs';
import { assertContentGeometry } from '../../../test/visual/content-geometry.mjs';

const tolerance = 1;
function bounds(quad) {
    const xs = [quad[0], quad[2], quad[4], quad[6]], ys = [quad[1], quad[3], quad[5], quad[7]];
    return { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
}
function contained(inner, outer, description) {
    expect(inner.x, description).toBeGreaterThanOrEqual(outer.x - tolerance);
    expect(inner.y, description).toBeGreaterThanOrEqual(outer.y - tolerance);
    expect(inner.x + inner.width, description).toBeLessThanOrEqual(outer.x + outer.width + tolerance);
    expect(inner.y + inner.height, description).toBeLessThanOrEqual(outer.y + outer.height + tolerance);
}
function edgePoints(quad) {
    const corners = Array.from({ length: 4 }, (_, index) => ({ x: quad[index * 2], y: quad[index * 2 + 1] }));
    const center = { x: corners.reduce((sum, point) => sum + point.x, 0) / 4, y: corners.reduce((sum, point) => sum + point.y, 0) / 4 };
    return corners.map((corner, index) => {
        const next = corners[(index + 1) % 4];
        const middle = { x: (corner.x + next.x) / 2, y: (corner.y + next.y) / 2 };
        const distance = Math.hypot(center.x - middle.x, center.y - middle.y);
        return { x: middle.x + (center.x - middle.x) / distance, y: middle.y + (center.y - middle.y) / distance };
    });
}

export async function assertSwitchGeometry(frame) {
    const page = frame.page();
    const selector = '[data-visual-frame] [role="switch"][aria-label="Primary option"]';
    const control = frame.getByRole('switch', { name: 'Primary option', exact: true });
    const label = control.locator('..');
    const frameBounds = await frame.boundingBox();
    const labelContent = await assertContentGeometry(label, frame, { checkText: false });
    const text = await assertContentGeometry(label.locator(':scope > span'), label);
    const output = await assertContentGeometry(frame.locator('output'), frame);
    await expect(page.locator(selector)).toHaveCount(1);
    expect(await control.evaluate((node, matched) => node === matched, await page.locator(selector).elementHandle())).toBe(true);
    await expect(control.locator(':scope > span')).toHaveCount(1);
    const metrics = await control.evaluate(node => {
        const style = getComputedStyle(node);
        return { clientWidth: node.clientWidth, clientHeight: node.clientHeight, scrollWidth: node.scrollWidth, scrollHeight: node.scrollHeight,
            direction: style.direction, writingMode: style.writingMode, overflowX: style.overflowX, overflowY: style.overflowY,
            boxSizing: style.boxSizing, width: Number.parseFloat(style.width), height: Number.parseFloat(style.height),
            text: node.textContent, focusVisible: node.matches(':focus-visible'), outlineStyle: style.outlineStyle,
            outlineWidth: Number.parseFloat(style.outlineWidth), outlineOffset: Number.parseFloat(style.outlineOffset) };
    });
    // Only Chromium environment/real-zoom scenes call this helper. Pseudo-elements
    // have no standard DOM rect API; native CDP box models avoid copying CSS halo,
    // RTL, static-position or transform layout rules. Cross-engine core scenes
    // retain public layout assertions. Replace this read-only measurement when
    // standard pseudo-element quads are available; no product styles are changed.
    const session = await page.context().newCDPSession(page);
    try {
        const { root } = await session.send('DOM.getDocument', { depth: -1, pierce: true });
        const { nodeId } = await session.send('DOM.querySelector', { nodeId: root.nodeId, selector });
        const { node } = await session.send('DOM.describeNode', { nodeId, depth: 1, pierce: true });
        const { model: track } = await session.send('DOM.getBoxModel', { nodeId });
        const { nodeId: handleId } = await session.send('DOM.querySelector', { nodeId, selector: 'span' });
        const { model: handle } = await session.send('DOM.getBoxModel', { nodeId: handleId });
        const pseudo = [];
        for (const type of ['before', 'after']) {
            const style = await control.evaluate((node, type) => {
                const value = getComputedStyle(node, `::${type}`);
                return { display: value.display, content: value.content, pointerEvents: value.pointerEvents };
            }, type);
            const rendered = style.display !== 'none' && !['none', 'normal'].includes(style.content);
            if (!rendered) { pseudo.push({ type, style, rendered: false }); continue; }
            const entry = node.pseudoElements?.find(entry => entry.pseudoType === type);
            expect(entry, `Rendered ::${type} must have a native box`).toBeTruthy();
            const { model } = await session.send('DOM.getBoxModel', { nodeId: entry.nodeId });
            pseudo.push({ type, style, rendered: true, model, bounds: bounds(model.border) });
        }
        const trackBounds = bounds(track.border), handleBounds = bounds(handle.border), padding = bounds(track.padding);
        contained(trackBounds, labelContent.bounds, 'Track inside its label');
        contained(handleBounds, trackBounds, 'Thumb inside the actual track');
        expect(metrics.boxSizing).toBe('border-box');
        expect(track.width).toBeCloseTo(metrics.width, 1); expect(track.height).toBeCloseTo(metrics.height, 1);
        expect(metrics.text.trim()).toBe('');
        expect(metrics.overflowX).toBe('visible'); expect(metrics.overflowY).toBe('visible');
        const hit = pseudo.find(entry => entry.type === 'before');
        expect(hit.rendered).toBe(true); expect(hit.style.pointerEvents).toBe('auto');
        expect(hit.bounds.width).toBeGreaterThanOrEqual(48);
        expect(hit.bounds.height).toBeGreaterThanOrEqual(48);
        for (const entry of pseudo.filter(entry => entry.rendered)) contained(entry.bounds, frameBounds, `Actual ::${entry.type} inside frame`);
        expect(pseudo.find(entry => entry.type === 'after').style.pointerEvents).toBe('none');
        if (metrics.focusVisible) {
            expect(metrics.outlineStyle).not.toBe('none'); expect(metrics.outlineWidth).toBeGreaterThan(0);
            const reach = Math.max(0, metrics.outlineWidth + metrics.outlineOffset);
            contained({ x: trackBounds.x - reach, y: trackBounds.y - reach, width: trackBounds.width + reach * 2, height: trackBounds.height + reach * 2 }, frameBounds, 'Actual focus outline inside frame');
        }
        // Project actual browser boxes from its native inline-start edge. CSSOM
        // excludes negative overflow there; no theme/token placement is recreated.
        expect(metrics.writingMode).toBe('horizontal-tb');
        const extents = [trackBounds, handleBounds, ...pseudo.filter(entry => entry.rendered).map(entry => entry.bounds)];
        const scaleX = padding.width / metrics.clientWidth, scaleY = padding.height / metrics.clientHeight;
        const inlineExtent = metrics.direction === 'rtl'
            ? padding.x + padding.width - Math.min(...extents.map(rect => rect.x))
            : Math.max(...extents.map(rect => rect.x + rect.width)) - padding.x;
        const blockExtent = Math.max(...extents.map(rect => rect.y + rect.height)) - padding.y;
        const expectedScroll = { width: Math.max(metrics.clientWidth, inlineExtent / scaleX), height: Math.max(metrics.clientHeight, blockExtent / scaleY) };
        expect(Math.abs(metrics.scrollWidth - expectedScroll.width), 'Scroll width equals known native paint/hit union').toBeLessThanOrEqual(tolerance);
        expect(Math.abs(metrics.scrollHeight - expectedScroll.height), 'Scroll height equals known native paint/hit union').toBeLessThanOrEqual(tolerance);
        const points = edgePoints(hit.model.border);
        await expect(control).toBeEnabled();
        for (const point of points) expect(await control.evaluate((node, point) => node.contains(node.ownerDocument.elementFromPoint(point.x, point.y)), point), 'Every native hit edge belongs to the switch').toBe(true);
        return { label: labelContent, text, output, track, handle, pseudo, metrics, expectedScroll, hit: { points } };
    } finally { await session.detach(); }
}
