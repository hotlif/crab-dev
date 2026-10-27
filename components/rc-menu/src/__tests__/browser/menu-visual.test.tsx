import { describe, expect, it } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
// Geometry regressions consume the published renderer and its extracted CSS.
// A css() mock cannot reveal physical margins or split RTL pseudo-elements.
import Menu, { MenuItemType } from '../../../esm/index.mjs';
import { vars as menuVars } from '../../token.js';
import compiledCss from '../../../.cache/browser-css.json';

type Direction = 'ltr' | 'rtl';
type Point = { x: number; y: number };
type Stroke = { endpoints: [Point, Point]; thickness: number };

async function settleLayout(): Promise<void> {
    await act(async () => {
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        for (const animation of document.getAnimations()) {
            if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
        }
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    });
}

function requireElement<T extends Element>(root: ParentNode, selector: string): T {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing actual Menu element: ${selector}`);
    return element;
}

function rowWithText(root: ParentNode, text: string): HTMLElement {
    const row = [...root.querySelectorAll<HTMLElement>('[data-menu-item]')].find(element => element.textContent === text);
    if (!row) throw new Error(`Missing actual Menu row: ${text}`);
    return row;
}

function readStroke(arrow: HTMLElement, pseudo: '::before' | '::after'): Stroke {
    const style = getComputedStyle(arrow, pseudo);
    const width = Number.parseFloat(style.width);
    const height = Number.parseFloat(style.height);
    const left = Number.parseFloat(style.left);
    const top = Number.parseFloat(style.top);
    const [originX, originY] = style.transformOrigin.split(' ').map(Number.parseFloat);
    for (const length of [width, height, left, top, originX, originY]) expect(Number.isFinite(length)).toBe(true);
    expect(width).toBeGreaterThan(height);
    expect(height).toBeGreaterThan(0);
    expect(style.content).not.toBe('none');
    expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    const matrix = new globalThis.DOMMatrixReadOnly(style.transform);
    const transform = (x: number): Point => {
        const point = matrix.transformPoint(new globalThis.DOMPoint(x - originX, height / 2 - originY));
        return { x: left + originX + point.x, y: top + originY + point.y };
    };
    return { endpoints: [transform(0), transform(width)], thickness: height };
}

/** Check the visible stroke geometry, independent of CSS class names or angles. */
function assertChevron(arrow: HTMLElement, pointing: 'up' | 'down' | 'right'): number[] {
    const bounds = arrow.getBoundingClientRect();
    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
    const before = readStroke(arrow, '::before');
    const after = readStroke(arrow, '::after');
    const connections = before.endpoints.flatMap((first, beforeIndex) => after.endpoints.map((second, afterIndex) => ({
        distance: Math.hypot(first.x - second.x, first.y - second.y), beforeIndex, afterIndex,
    })));
    connections.sort((first, second) => first.distance - second.distance);
    const closest = connections[0];
    // Rounded strokes must meet at the chevron tip; two separated lines fail.
    expect(closest.distance).toBeLessThanOrEqual((before.thickness + after.thickness) / 2);
    const joinedBefore = before.endpoints[closest.beforeIndex];
    const joinedAfter = after.endpoints[closest.afterIndex];
    const tip = { x: (joinedBefore.x + joinedAfter.x) / 2, y: (joinedBefore.y + joinedAfter.y) / 2 };
    const outer = [before.endpoints[1 - closest.beforeIndex], after.endpoints[1 - closest.afterIndex]];
    for (const endpoint of outer) {
        if (pointing === 'up') expect(tip.y).toBeLessThan(endpoint.y);
        else if (pointing === 'down') expect(tip.y).toBeGreaterThan(endpoint.y);
        else expect(tip.x).toBeGreaterThan(endpoint.x);
    }
    for (const endpoint of [...before.endpoints, ...after.endpoints]) {
        expect(endpoint.x).toBeGreaterThanOrEqual(0);
        expect(endpoint.x).toBeLessThanOrEqual(bounds.width);
        expect(endpoint.y).toBeGreaterThanOrEqual(0);
        expect(endpoint.y).toBeLessThanOrEqual(bounds.height);
    }
    return [...before.endpoints, ...after.endpoints].flatMap(point => [point.x, point.y]);
}

function assertIconGap(row: HTMLElement, icon: HTMLElement, direction: Direction): number {
    const style = getComputedStyle(icon);
    const gap = Number.parseFloat(style.marginInlineEnd);
    expect(gap).toBeGreaterThan(0);
    expect(Number.parseFloat(style.marginInlineStart)).toBe(0);
    const title = icon.nextSibling;
    if (!title) throw new Error('Menu icon has no adjacent title');
    const range = document.createRange();
    range.selectNodeContents(title);
    const titleBounds = title instanceof HTMLElement ? title.getBoundingClientRect() : range.getBoundingClientRect();
    const iconBounds = icon.getBoundingClientRect();
    expect(iconBounds.width).toBeGreaterThan(0);
    expect(direction === 'rtl' ? iconBounds.left - titleBounds.right : titleBounds.left - iconBounds.right).toBeCloseTo(gap, 1);
    const rowBounds = row.getBoundingClientRect();
    const inset = direction === 'rtl' ? rowBounds.right - iconBounds.right : iconBounds.left - rowBounds.left;
    expect(inset).toBeCloseTo(Number.parseFloat(getComputedStyle(row).paddingInlineStart), 1);
    return iconBounds.width;
}

const fixtureIcon = (id: string) => <svg data-testid={id} viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z" fill="currentColor" /></svg>;

function associatedPopup(trigger: HTMLElement, attribute: 'aria-controls' | 'aria-describedby'): HTMLElement {
    const id = trigger.getAttribute(attribute);
    const popup = id ? trigger.ownerDocument.getElementById(id) : null;
    if (!popup) throw new Error(`Missing actual Menu popup referenced by ${attribute}`);
    return popup;
}

function assertInlineEndPopup(trigger: HTMLElement, popup: HTMLElement, direction: Direction): void {
    const reference = trigger.closest('li');
    if (!reference) throw new Error('Missing collapsed Menu positioning reference');
    const referenceBounds = reference.getBoundingClientRect();
    const popupBounds = popup.getBoundingClientRect();
    expect(popupBounds.width).toBeGreaterThan(0);
    expect(popupBounds.height).toBeGreaterThan(0);
    // Keep both sides clear. A viewport collision must not conceal a wrong
    // preferred placement by accidentally flipping it to the desired side.
    expect(referenceBounds.left).toBeGreaterThan(popupBounds.width + 8);
    expect(document.documentElement.clientWidth - referenceBounds.right).toBeGreaterThan(popupBounds.width + 8);
    expect(getComputedStyle(trigger).direction).toBe(direction);
    expect(getComputedStyle(popup).direction).toBe(direction);
    const gap = direction === 'rtl' ? referenceBounds.left - popupBounds.right : popupBounds.left - referenceBounds.right;
    expect(gap).toBeGreaterThan(0);
    // @floating-ui/react-dom 2.1.9 rounds the final fixed-position x/y with
    // Math.round(value * DPR) / DPR. The reference edge can remain fractional,
    // so the exact offset(8) may differ by half a device pixel in CSS pixels.
    // The 1e-6 allowance only covers decimal transform serialization, not layout.
    const dpr = popup.ownerDocument.defaultView?.devicePixelRatio || 1;
    const tolerance = 0.5 / dpr + 1e-6;
    const coordinates = [
        { name: 'inline-end gap', actual: gap, expected: 8 },
        { name: 'block-start alignment', actual: popupBounds.top, expected: referenceBounds.top },
    ];
    const failures = coordinates.filter(value => Math.abs(value.actual - value.expected) > tolerance);
    if (failures.length) {
        throw new Error(`Menu popup exceeds Floating UI pixel rounding: ${JSON.stringify({
            direction, dpr, tolerance, failures,
            reference: referenceBounds.toJSON(), popup: popupBounds.toJSON(),
            position: getComputedStyle(popup).position,
            transform: getComputedStyle(popup).transform,
        })}`);
    }
}

async function hoverCollapsedReference(trigger: HTMLElement): Promise<void> {
    const reference = trigger.closest('li');
    if (!reference) throw new Error('Missing collapsed Menu hover reference');
    const bounds = trigger.getBoundingClientRect();
    const coordinates = { clientX: bounds.left + bounds.width / 2, clientY: bounds.top + bounds.height / 2 };
    await fireEvent(reference, new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse', ...coordinates }));
    await fireEvent(reference, new MouseEvent('mouseover', { bubbles: true, ...coordinates }));
    // Floating UI also listens to native mouseenter on its actual reference.
    await fireEvent(reference, new MouseEvent('mouseenter', coordinates));
    await act(async () => { await new Promise<void>(resolve => setTimeout(resolve, 120)); });
    await settleLayout();
}

describe('Menu published CSS geometry across designs, modes and inline directions', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`contains keyboard focus inside clipped selected leaves (${designSystem}/${colorMode})`, async () => {
                const view = await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                    <style>{compiledCss}</style>
                    <Menu style={{ width: 250 }} defaultOpenKeys={['root']} defaultSelectedKeys={['leaf']} items={[
                        { type: MenuItemType.Item, key: 'root', title: 'Root', children: [
                            { type: MenuItemType.Item, key: 'leaf', title: 'Focused leaf' },
                        ] },
                    ]} />
                </ConfigProvider>);
                await settleLayout();
                const leaf = rowWithText(view.container, 'Focused leaf');
                await act(async () => { leaf.focus(); });
                expect(document.activeElement).toBe(leaf);
                expect(leaf.matches(':focus-visible')).toBe(true);
                for (const width of [2, 4]) {
                    leaf.style.setProperty(menuVars['interaction.outline-width-focus'], `${width}px`);
                    const style = getComputedStyle(leaf);
                    expect(style.outlineStyle).toBe('solid');
                    expect(Number.parseFloat(style.outlineWidth)).toBe(width);
                    const expansion = Number.parseFloat(style.outlineWidth) + Number.parseFloat(style.outlineOffset);
                    expect(expansion).toBeLessThanOrEqual(0);
                    const bounds = leaf.getBoundingClientRect();
                    let clippedAncestors = 0;
                    for (let parent = leaf.parentElement; parent && parent !== view.container; parent = parent.parentElement) {
                        const ancestorStyle = getComputedStyle(parent);
                        const clipX = /^(hidden|clip|auto|scroll)$/.test(ancestorStyle.overflowX);
                        const clipY = /^(hidden|clip|auto|scroll)$/.test(ancestorStyle.overflowY);
                        if (!clipX && !clipY) continue;
                        clippedAncestors += 1;
                        const clip = parent.getBoundingClientRect();
                        if (clipX) {
                            expect(bounds.left - expansion).toBeGreaterThanOrEqual(clip.left - 0.5);
                            expect(bounds.right + expansion).toBeLessThanOrEqual(clip.right + 0.5);
                        }
                        if (clipY) {
                            expect(bounds.top - expansion).toBeGreaterThanOrEqual(clip.top - 0.5);
                            expect(bounds.bottom + expansion).toBeLessThanOrEqual(clip.bottom + 0.5);
                        }
                    }
                    expect(clippedAncestors).toBeGreaterThan(0);
                }
            });
            it(`mirrors nested indentation and icon spacing without splitting disclosure arrows (${designSystem}/${colorMode})`, async () => {
                const fixture = (direction: Direction) => <>
                    <style>{compiledCss}</style>
                    <div data-crab-design={designSystem} data-theme={colorMode} dir={direction}>
                        <Menu style={{ width: 320 }} defaultOpenKeys={['root']} items={[
                            { type: MenuItemType.Item, key: 'root', title: 'Root', children: [
                                { type: MenuItemType.ItemGroup, key: 'group', title: 'Group', icon: fixtureIcon('group-icon'), children: [
                                    { type: MenuItemType.Item, key: 'leaf', title: 'Leaf', icon: fixtureIcon('leaf-icon') },
                                ] },
                            ] },
                        ]} />
                    </div>
                </>;
                const view = await render(fixture('ltr'));
                let baseline: { groupLeft: string; groupRight: string; leafLeft: string; leafRight: string; up: number[]; down: number[] } | undefined;
                for (const direction of ['ltr', 'rtl'] as const) {
                    await view.rerender(fixture(direction));
                    await settleLayout();
                    const root = rowWithText(view.container, 'Root');
                    const groupIcon = requireElement<SVGSVGElement>(view.container, '[data-testid="group-icon"]').parentElement!;
                    const group = groupIcon.parentElement!;
                    const leaf = rowWithText(view.container, 'Leaf');
                    const leafIcon = requireElement<SVGSVGElement>(view.container, '[data-testid="leaf-icon"]').parentElement!;
                    expect(getComputedStyle(leaf).direction).toBe(direction);
                    const groupStyle = getComputedStyle(group);
                    const leafStyle = getComputedStyle(leaf);
                    // CSSStyleDeclaration is live; retain these values while
                    // the nested rows are still mounted before closing Root.
                    const padding = {
                        groupLeft: groupStyle.paddingLeft, groupRight: groupStyle.paddingRight,
                        leafLeft: leafStyle.paddingLeft, leafRight: leafStyle.paddingRight,
                    };
                    expect(Number.parseFloat(groupStyle.paddingInlineStart)).toBeGreaterThan(Number.parseFloat(groupStyle.paddingInlineEnd));
                    expect(Number.parseFloat(leafStyle.paddingInlineStart)).toBeGreaterThan(Number.parseFloat(groupStyle.paddingInlineStart));
                    const groupWidth = assertIconGap(group, groupIcon, direction);
                    const leafWidth = assertIconGap(leaf, leafIcon, direction);
                    // Different navigation icon sizes prove that the real design
                    // styles loaded, rather than the MD3 token fallback alone.
                    expect(groupWidth).toBe(designSystem === 'md3' ? 24 : 16);
                    expect(leafWidth).toBe(groupWidth);
                    expect(root.getAttribute('aria-expanded')).toBe('true');
                    const up = assertChevron(requireElement<HTMLElement>(root, 'i'), 'up');
                    await fireEvent.click(root);
                    await settleLayout();
                    expect(root.getAttribute('aria-expanded')).toBe('false');
                    const down = assertChevron(requireElement<HTMLElement>(root, 'i'), 'down');
                    if (!baseline) baseline = { ...padding, up, down };
                    else {
                        expect(padding.groupRight).toBe(baseline.groupLeft);
                        expect(padding.groupLeft).toBe(baseline.groupRight);
                        expect(padding.leafRight).toBe(baseline.leafLeft);
                        expect(padding.leafLeft).toBe(baseline.leafRight);
                        up.forEach((position, index) => expect(position).toBeCloseTo(baseline!.up[index], 3));
                        down.forEach((position, index) => expect(position).toBeCloseTo(baseline!.down[index], 3));
                    }
                    await fireEvent.click(root);
                    await settleLayout();
                    expect(root.getAttribute('aria-expanded')).toBe('true');
                }
                await view.unmount();
                await settleLayout();
            });

            it(`keeps logical content insets around horizontal parent and leaf text (${designSystem}/${colorMode})`, async () => {
                const fixture = (direction: Direction) => <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction}>
                    <style>{compiledCss}</style>
                    <Menu data-testid="spacing-menu" mode="horizontal" style={{ width: 640 }} openKeys={['root']}
                        selectedKeys={['current', 'selected-child', 'selected-branch']} items={[
                            { type: MenuItemType.Item, key: 'current', title: 'Current' },
                            { type: MenuItemType.Item, key: 'idle', title: 'Idle' },
                            { type: MenuItemType.Item, key: 'root', title: 'Branches', children: [
                                { type: MenuItemType.Item, key: 'selected-child', title: 'Selected child' },
                                { type: MenuItemType.Item, key: 'idle-child', title: 'Idle child' },
                                { type: MenuItemType.Item, key: 'selected-branch', title: 'Selected branch', children: [
                                    { type: MenuItemType.Item, key: 'hidden-first', title: 'Hidden first' },
                                ] },
                                { type: MenuItemType.Item, key: 'idle-branch', title: 'Idle branch', children: [
                                    { type: MenuItemType.Item, key: 'hidden-second', title: 'Hidden second' },
                                ] },
                            ] },
                        ]} />
                </ConfigProvider>;
                const view = await render(fixture('ltr'));
                // Terminal published-CSS geometry only; settleLayout isolates
                // finite motion and does not prove natural animation completion.
                for (const direction of ['ltr', 'rtl'] as const) {
                    await view.rerender(fixture(direction));
                    const menu = requireElement<HTMLElement>(view.container, '[data-testid="spacing-menu"]');
                    for (const override of [null, '24px']) {
                        if (override) menu.style.setProperty(menuVars['horizontal.item.content.padding-left'], override);
                        else menu.style.removeProperty(menuVars['horizontal.item.content.padding-left']);
                        await settleLayout();
                        for (const text of ['Current', 'Idle', 'Branches', 'Selected child', 'Idle child', 'Selected branch', 'Idle branch']) {
                            const row = rowWithText(view.container, text);
                            const title = [...row.children].find(child => child.textContent === text);
                            if (!title) throw new Error(`Missing actual menu title: ${text}`);
                            const range = document.createRange();
                            range.selectNodeContents(title);
                            const textBounds = range.getBoundingClientRect(), bounds = row.getBoundingClientRect();
                            const style = getComputedStyle(row);
                            expect(style.direction).toBe(direction);
                            const start = Number.parseFloat(style.paddingInlineStart), end = Number.parseFloat(style.paddingInlineEnd);
                            expect(start).toBeGreaterThan(0);
                            expect(end).toBe(start);
                            if (override) expect(end).toBe(24);
                            const startGap = direction === 'rtl' ? bounds.right - textBounds.right : textBounds.left - bounds.left;
                            const endGap = direction === 'rtl' ? textBounds.left - bounds.left : bounds.right - textBounds.right;
                            expect(startGap).toBeGreaterThanOrEqual(start - 0.5);
                            expect(endGap).toBeGreaterThanOrEqual(end - 0.5);
                            expect(row.getAttribute('aria-current')).toBe(['Current', 'Selected child', 'Selected branch'].includes(text) ? 'page' : null);
                            const arrow = row.querySelector<HTMLElement>('i');
                            if (arrow) {
                                const slot = arrow.parentElement;
                                if (!slot) throw new Error('Missing actual arrow slot');
                                const slotBounds = slot.getBoundingClientRect();
                                const slotEnd = direction === 'rtl' ? slotBounds.left - bounds.left : bounds.right - slotBounds.right;
                                expect(slotEnd).toBeCloseTo(end, 1);
                                // A single arrow slot sits inside the end inset;
                                // adding both end padding and another slot is wrong.
                                expect(title.getBoundingClientRect().width + slotBounds.width + start + end).toBeCloseTo(bounds.width, 1);
                            } else if (row.parentElement?.parentElement === menu) {
                                // Root leaves and the root parent have intrinsic
                                // text width, so both text-range gaps are exact.
                                expect(startGap).toBeCloseTo(start, 1);
                                expect(endGap).toBeCloseTo(end, 1);
                            }
                        }
                    }
                }
                await view.unmount();
                await settleLayout();
            });

            it(`keeps the shared horizontal submenu arrow joined (${designSystem}/${colorMode})`, async () => {
                const fixture = (direction: Direction) => <>
                    <style>{compiledCss}</style>
                    <div data-crab-design={designSystem} data-theme={colorMode} dir={direction}>
                        <Menu mode="horizontal" style={{ width: 480 }} defaultOpenKeys={['horizontal-root']} items={[
                            { type: MenuItemType.Item, key: 'horizontal-root', title: 'Horizontal root', children: [
                                { type: MenuItemType.Item, key: 'branch', title: 'Branch', children: [
                                    { type: MenuItemType.Item, key: 'horizontal-leaf', title: 'Horizontal leaf' },
                                ] },
                            ] },
                        ]} />
                    </div>
                </>;
                const view = await render(fixture('ltr'));
                let baseline: number[] | undefined;
                for (const direction of ['ltr', 'rtl'] as const) {
                    await view.rerender(fixture(direction));
                    await settleLayout();
                    const branch = rowWithText(view.container, 'Branch');
                    expect(getComputedStyle(branch).direction).toBe(direction);
                    expect(branch.getBoundingClientRect().width).toBeGreaterThan(0);
                    const geometry = assertChevron(requireElement<HTMLElement>(branch, 'i'), 'right');
                    if (!baseline) baseline = geometry;
                    else geometry.forEach((position, index) => expect(position).toBeCloseTo(baseline![index], 3));
                }
                await view.unmount();
                await settleLayout();
            });
        }
    }
});

describe('Collapsed Menu published popup placement follows the nearest direction', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`repositions submenus and real hover hints across configuration and explicit dir changes (${designSystem}/${colorMode})`, async () => {
                const fixture = (outer: Direction, nearest: Direction, explicit?: Direction) => <>
                    <style>{compiledCss}</style>
                    <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={outer} data-testid="outer-direction">
                        <ConfigProvider direction={nearest} data-testid="nearest-direction" style={{ paddingBlock: 64 }}>
                            <div style={{ width: 64, marginInline: 'auto' }}>
                                <Menu inlineCollapsed dir={explicit} style={{ width: 64 }} defaultOpenKeys={['collapsed-parent']} items={[
                                    { type: MenuItemType.Item, key: 'collapsed-parent', title: 'Collapsed parent', icon: fixtureIcon('collapsed-parent-icon'), children: [
                                        { type: MenuItemType.Item, key: 'collapsed-child', title: 'Popup child' },
                                    ] },
                                    { type: MenuItemType.Item, key: 'hint', title: 'Leaf hint', icon: fixtureIcon('collapsed-hint-icon') },
                                ]} />
                            </div>
                        </ConfigProvider>
                    </ConfigProvider>
                </>;
                const scenarios: { outer: Direction; nearest: Direction; explicit?: Direction; expected: Direction }[] = [
                    { outer: 'ltr', nearest: 'rtl', expected: 'rtl' },
                    { outer: 'rtl', nearest: 'ltr', expected: 'ltr' },
                    { outer: 'rtl', nearest: 'rtl', explicit: 'ltr', expected: 'ltr' },
                    { outer: 'ltr', nearest: 'ltr', explicit: 'rtl', expected: 'rtl' },
                ];
                const view = await render(fixture('ltr', 'rtl'));
                const initialParent = requireElement<HTMLElement>(view.container, '[data-menu-item][aria-label="Collapsed parent"]');
                const initialHint = requireElement<HTMLElement>(view.container, '[data-menu-item][aria-label="Leaf hint"]');
                const initialSubmenu = associatedPopup(initialParent, 'aria-controls');
                let initialTooltip: HTMLElement | undefined;
                for (const scenario of scenarios) {
                    await view.rerender(fixture(scenario.outer, scenario.nearest, scenario.explicit));
                    await settleLayout();
                    expect(requireElement<HTMLElement>(view.container, '[data-testid="outer-direction"]').dir).toBe(scenario.outer);
                    expect(requireElement<HTMLElement>(view.container, '[data-testid="nearest-direction"]').dir).toBe(scenario.nearest);
                    const parent = requireElement<HTMLElement>(view.container, '[data-menu-item][aria-label="Collapsed parent"]');
                    const hint = requireElement<HTMLElement>(view.container, '[data-menu-item][aria-label="Leaf hint"]');
                    // The open component is updated in place, not remounted to
                    // make an initial-placement-only implementation appear correct.
                    expect(parent).toBe(initialParent);
                    expect(hint).toBe(initialHint);
                    expect(parent.getAttribute('aria-expanded')).toBe('true');
                    const submenu = associatedPopup(parent, 'aria-controls');
                    expect(submenu).toBe(initialSubmenu);
                    expect(submenu.textContent).toBe('Popup child');
                    assertInlineEndPopup(parent, submenu, scenario.expected);

                    if (!initialTooltip) {
                        expect(hint.getAttribute('aria-describedby')).toBe(null);
                        await hoverCollapsedReference(hint);
                    }
                    const tooltip = associatedPopup(hint, 'aria-describedby');
                    if (!initialTooltip) initialTooltip = tooltip;
                    else expect(tooltip).toBe(initialTooltip);
                    expect(tooltip.getAttribute('role')).toBe('tooltip');
                    expect(tooltip.textContent).toBe('Leaf hint');
                    assertInlineEndPopup(hint, tooltip, scenario.expected);
                }
                // Dismiss only the hint after both open layers have repositioned
                // in place. The independently opened submenu remains available.
                await fireEvent(initialHint, new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
                await settleLayout();
                expect(initialHint.getAttribute('aria-describedby')).toBe(null);
                expect(initialTooltip?.isConnected).toBe(false);
                expect(initialParent.getAttribute('aria-expanded')).toBe('true');
                expect(associatedPopup(initialParent, 'aria-controls')).toBe(initialSubmenu);
                await view.unmount();
                await settleLayout();
            });
        }
    }
});
