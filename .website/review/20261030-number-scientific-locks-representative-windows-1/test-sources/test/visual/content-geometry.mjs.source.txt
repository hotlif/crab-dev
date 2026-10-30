import { expect } from '@playwright/test';

/** Measure actual content, never its demo wrapper alone. Callers own the
 * component selectors and decide which native scrolling or ellipsis is legal. */
export async function assertContentGeometry(target, container, {
    allowEllipsis = false,
    accessibleName,
    allowHorizontalScroll = false,
    allowVerticalScroll = false,
    checkText = true,
    tolerance = 1,
} = {}) {
    await expect(target).toBeVisible();
    const bounds = await target.boundingBox();
    const containerBounds = await container.boundingBox();
    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
    expect(bounds.x).toBeGreaterThanOrEqual(containerBounds.x - tolerance);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(containerBounds.x + containerBounds.width + tolerance);
    expect(bounds.y).toBeGreaterThanOrEqual(containerBounds.y - tolerance);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(containerBounds.y + containerBounds.height + tolerance);
    const content = await target.evaluate((node, includeText) => {
        const style = globalThis.getComputedStyle(node);
        const textRects = [];
        if (includeText) {
            const walker = globalThis.document.createTreeWalker(node, globalThis.NodeFilter.SHOW_TEXT);
            for (let text = walker.nextNode(); text; text = walker.nextNode()) {
                if (!text.textContent.trim()) continue;
                const range = globalThis.document.createRange();
                range.selectNodeContents(text);
                textRects.push(...[...range.getClientRects()].filter(rect => rect.width && rect.height).map(rect => ({
                    x: rect.x, y: rect.y, width: rect.width, height: rect.height,
                })));
            }
        }
        return {
            clientWidth: node.clientWidth, clientHeight: node.clientHeight,
            scrollWidth: node.scrollWidth, scrollHeight: node.scrollHeight,
            scrollLeft: node.scrollLeft, scrollTop: node.scrollTop,
            overflowX: style.overflowX, overflowY: style.overflowY,
            textOverflow: style.textOverflow, text: node.textContent,
            viewportWidth: globalThis.innerWidth, textRects,
        };
    }, checkText);
    expect(bounds.x).toBeGreaterThanOrEqual(-tolerance);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(content.viewportWidth + tolerance);
    const truncated = content.clientWidth > 0 && content.scrollWidth > content.clientWidth + tolerance;
    if (truncated && allowEllipsis) {
        expect(content.textOverflow).toBe('ellipsis');
        expect(['hidden', 'clip']).toContain(content.overflowX);
        expect(typeof accessibleName).toBe('string');
        expect(accessibleName.trim().length).toBeGreaterThan(0);
    } else if (!allowHorizontalScroll && content.clientWidth > 0) {
        expect(content.scrollWidth).toBeLessThanOrEqual(content.clientWidth + tolerance);
    }
    if (!allowVerticalScroll && content.clientHeight > 0) {
        expect(content.scrollHeight).toBeLessThanOrEqual(content.clientHeight + tolerance);
    } else if (allowVerticalScroll && content.scrollHeight > content.clientHeight + tolerance) {
        expect(['auto', 'scroll']).toContain(content.overflowY);
    }
    if (checkText && !(truncated && allowEllipsis)) for (const rect of content.textRects) {
        if (!allowHorizontalScroll) {
            expect(rect.x).toBeGreaterThanOrEqual(bounds.x - tolerance);
            expect(rect.x + rect.width).toBeLessThanOrEqual(bounds.x + bounds.width + tolerance);
        }
        if (!allowVerticalScroll) {
            expect(rect.y).toBeGreaterThanOrEqual(bounds.y - tolerance);
            expect(rect.y + rect.height).toBeLessThanOrEqual(bounds.y + bounds.height + tolerance);
        }
    }
    return { bounds, containerBounds, ...content, truncated, ...(allowEllipsis ? { accessibleName } : {}) };
}
