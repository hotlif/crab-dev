import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render, userEvent } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import type { CSSProperties } from 'react';
import type { AvatarGroupProps } from '../../types.js';
// Layout exception: exercise the published Avatar/Badge DOM and extracted CSS.
// A css() mock cannot detect a counter painted beneath a higher-z avatar.
import Avatar, { AvatarGroup, TokenVars } from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

type Direction = 'ltr' | 'rtl';

const variants: {
    name: string;
    total: number;
    max: number;
    expected: string;
    props: Pick<AvatarGroupProps, 'size' | 'shape' | 'spacing' | 'renderExtra'>;
}[] = [
    { name: 'count', total: 6, max: 3, expected: '+3', props: { size: 'medium' } },
    // This is the public demo's actual long counter, not a shortened text that
    // would conceal intersection with the preceding avatar's stacking context.
    { name: 'custom count', total: 4, max: 2, expected: '还有 2 位', props: {
        size: 'medium', renderExtra: hidden => `还有 ${hidden} 位`,
    } },
    { name: 'small square count', total: 4, max: 3, expected: '+1', props: {
        size: 'small', shape: 'square', spacing: -6,
    } },
    { name: 'long custom count', total: 4, max: 2, expected: '另外 2 位参与此项目的协作者', props: {
        size: 'medium', renderExtra: hidden => `另外 ${hidden} 位参与此项目的协作者`,
    } },
];

function required<T extends Element>(root: ParentNode, selector: string): T {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing AvatarGroup layout element: ${selector}`);
    return element;
}

async function settleLayout(root: HTMLElement) {
    await act(async () => {
        await document.fonts.ready;
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        const finite = root.getAnimations({ subtree: true }).filter(animation => {
            const endTime = animation.effect?.getComputedTiming().endTime;
            return typeof endTime === 'number' && Number.isFinite(endTime);
        });
        await Promise.all(finite.map(animation => animation.finished));
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    });
}

function assertCounterGeometry(group: HTMLElement, expected: string, visibleCount: number, direction: Direction) {
    const wrappers = Array.from(group.children);
    expect(wrappers.length).toBe(visibleCount);
    const lastWrapper = wrappers[visibleCount - 1];
    if (!(lastWrapper instanceof HTMLElement)) throw new Error('Last AvatarGroup wrapper is missing');
    const members = group.querySelectorAll<HTMLElement>('[data-avatar-member]');
    expect(members.length).toBe(visibleCount);
    const lastAvatar = members[visibleCount - 1]!;
    expect(lastWrapper.contains(lastAvatar)).toBe(true);
    const indicator = required<HTMLElement>(lastWrapper, '[role="status"]');
    const anchor = indicator.parentElement;
    if (!anchor) throw new Error('Badge anchor is missing');
    expect(anchor.contains(lastAvatar)).toBe(true);
    expect(indicator.textContent).toBe(expected);
    expect(getComputedStyle(group).direction).toBe(direction);
    expect(indicator.matches(`:dir(${direction})`)).toBe(true);
    // The indicator intentionally lets pointer events through. An element hit
    // test would therefore be an invalid assertion of its visibility.
    expect(getComputedStyle(indicator).pointerEvents).toBe('none');

    const bounds = indicator.getBoundingClientRect();
    const avatarBounds = lastAvatar.getBoundingClientRect();
    const groupBounds = group.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
    expect(bounds.top + bounds.height / 2).toBeCloseTo(avatarBounds.top, 1);
    if (direction === 'rtl') {
        expect(centerX).toBeLessThanOrEqual(avatarBounds.left + 0.5);
        expect(bounds.left).toBeLessThan(avatarBounds.left);
        expect(bounds.right).toBeCloseTo(avatarBounds.left, 1);
    } else {
        expect(centerX).toBeGreaterThanOrEqual(avatarBounds.right - 0.5);
        expect(bounds.right).toBeGreaterThan(avatarBounds.right);
        expect(bounds.left).toBeCloseTo(avatarBounds.right, 1);
    }
    expect(bounds.left).toBeGreaterThanOrEqual(groupBounds.left - 0.5);
    expect(bounds.right).toBeLessThanOrEqual(groupBounds.right + 0.5);
    expect(getComputedStyle(indicator).position).toBe('relative');
    expect(getComputedStyle(lastWrapper).boxShadow).toBe('none');
    expect(getComputedStyle(lastAvatar).boxShadow).toContain('0px 0px 0px 2px');
    expect(bounds.left).toBeGreaterThanOrEqual(0);
    expect(bounds.top).toBeGreaterThanOrEqual(0);
    expect(bounds.right).toBeLessThanOrEqual(window.innerWidth);
    expect(bounds.bottom).toBeLessThanOrEqual(window.innerHeight);

    const ownZ = Number.parseInt(getComputedStyle(lastWrapper).zIndex, 10);
    expect(Number.isFinite(ownZ)).toBe(true);
    for (const wrapper of wrappers.slice(0, -1)) {
        if (!(wrapper instanceof HTMLElement)) throw new Error('Avatar wrapper is not an HTML element');
        const siblingZ = Number.parseInt(getComputedStyle(wrapper).zIndex, 10);
        expect(siblingZ).toBeGreaterThan(ownZ);
        const sibling = wrapper.getBoundingClientRect();
        const intersectionWidth = Math.min(bounds.right, sibling.right) - Math.max(bounds.left, sibling.left);
        const intersectionHeight = Math.min(bounds.bottom, sibling.bottom) - Math.max(bounds.top, sibling.top);
        // The previous avatars form higher stacking contexts; even a correctly
        // positioned status child cannot paint above them by its own z-index.
        expect(intersectionWidth <= 0.5 || intersectionHeight <= 0.5).toBe(true);
    }

    expect(indicator.scrollWidth).toBeLessThanOrEqual(indicator.clientWidth + 1);
    const textRange = document.createRange();
    textRange.selectNodeContents(indicator);
    const text = textRange.getBoundingClientRect();
    expect(text.width).toBeGreaterThan(0);
    expect(text.height).toBeGreaterThan(0);
    expect(text.left).toBeGreaterThanOrEqual(bounds.left - 0.5);
    expect(text.right).toBeLessThanOrEqual(bounds.right + 0.5);
    // Glyph line boxes can exceed line-height:1 by subpixel font metrics. Their
    // visible area must still be on screen and not clipped by group ancestors.
    expect(text.top).toBeGreaterThanOrEqual(0);
    expect(text.bottom).toBeLessThanOrEqual(window.innerHeight);
    for (const element of [indicator, anchor, lastWrapper, group]) {
        const style = getComputedStyle(element);
        expect(['hidden', 'clip'].includes(style.overflowX)).toBe(false);
        expect(['hidden', 'clip'].includes(style.overflowY)).toBe(false);
    }
    return { indicator, lastAvatar };
}

describe('AvatarGroup published Badge logical-end geometry', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            for (const variant of variants) {
                it(`keeps ${variant.name} unobscured across retained LTR/RTL nodes (${designSystem}/${colorMode})`, async () => {
                    const fixture = (direction: Direction) => <>
                        <style>{compiledCss}</style>
                        <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: 1000, padding: 64, boxSizing: 'border-box' }}>
                                <AvatarGroup data-avatar-group max={variant.max} {...variant.props}>
                                    {Array.from({ length: variant.total }, (_, index) => (
                                        <Avatar key={index} data-avatar-member={index} aria-label={`Member ${index + 1}`}>
                                            {String.fromCharCode(65 + index)}
                                        </Avatar>
                                    ))}
                                </AvatarGroup>
                                <AvatarGroup data-adjacent-group size="large" spacing={-14}>
                                    <Avatar>K</Avatar><Avatar>L</Avatar><Avatar>M</Avatar>
                                </AvatarGroup>
                            </div>
                        </ConfigProvider>
                    </>;
                    const view = await render(fixture('ltr'));
                    const group = required<HTMLElement>(view.container, '[data-avatar-group]');
                    await settleLayout(group);
                    const initial = assertCounterGeometry(group, variant.expected, variant.max, 'ltr');
                    const assertAdjacent = (direction: Direction) => {
                        const groupRect = group.getBoundingClientRect();
                        const neighbor = required<HTMLElement>(view.container, '[data-adjacent-group]').getBoundingClientRect();
                        expect(direction === 'ltr' ? neighbor.left - groupRect.right : groupRect.left - neighbor.right).toBeCloseTo(16, 1);
                        const indicator = initial.indicator.getBoundingClientRect();
                        expect(indicator.right <= neighbor.left || indicator.left >= neighbor.right).toBe(true);
                    };
                    assertAdjacent('ltr');
                    for (const direction of ['rtl', 'ltr'] as const) {
                        await view.rerender(fixture(direction));
                        await settleLayout(group);
                        expect(required<HTMLElement>(view.container, '[data-avatar-group]')).toBe(group);
                        const current = assertCounterGeometry(group, variant.expected, variant.max, direction);
                        expect(current.indicator).toBe(initial.indicator);
                        expect(current.lastAvatar).toBe(initial.lastAvatar);
                        assertAdjacent(direction);
                    }
                });
            }
            it(`keeps native direction, child geometry and the ring under actual hover (${designSystem}/${colorMode})`, async () => {
                const fixture = (direction: Direction) => <>
                    <style>{compiledCss}</style>
                    <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction="ltr">
                        <div dir={direction} style={{ padding: 64, width: 900 }}>
                            <AvatarGroup data-avatar-group max={2} size="small" shape="circle" style={{ [TokenVars['group.margin']]: '-5px' } as CSSProperties}>
                                <Avatar data-avatar-member="0">A</Avatar>
                                <Avatar data-avatar-member="1" size={44} shape="square" className="consumer-avatar" style={{ borderRadius: 7 }} tabIndex={0}>B</Avatar>
                                <Avatar>C</Avatar>
                            </AvatarGroup>
                        </div>
                    </ConfigProvider>
                </>;
                const view = await render(fixture('ltr'));
                const group = required<HTMLElement>(view.container, '[data-avatar-group]');
                await settleLayout(group);
                const initial = assertCounterGeometry(group, '+1', 2, 'ltr');
                const user = userEvent.setup();
                for (const direction of ['ltr', 'rtl', 'ltr'] as const) {
                    await view.rerender(fixture(direction));
                    await settleLayout(group);
                    const current = assertCounterGeometry(group, '+1', 2, direction);
                    expect(current.lastAvatar).toBe(initial.lastAvatar);
                    expect(current.indicator).toBe(initial.indicator);
                    expect(current.lastAvatar.classList.contains('consumer-avatar')).toBe(true);
                    expect(current.lastAvatar.getBoundingClientRect().width).toBe(44);
                    expect(getComputedStyle(current.lastAvatar).borderRadius).toBe('7px');
                    expect(getComputedStyle(current.lastAvatar.parentElement!.parentElement!).marginInlineStart).toBe('-5px');
                    const ring = getComputedStyle(current.lastAvatar).boxShadow;
                    await user.hover(current.lastAvatar);
                    await settleLayout(group);
                    expect(current.lastAvatar.matches(':hover')).toBe(true);
                    expect(getComputedStyle(current.lastAvatar).boxShadow).toBe(ring);
                    assertCounterGeometry(group, '+1', 2, direction);
                    current.lastAvatar.focus({ preventScroll: true, focusVisible: true });
                    expect(current.lastAvatar.matches(':focus-visible')).toBe(true);
                    expect(getComputedStyle(current.lastAvatar).outlineStyle).toBe('solid');
                    expect(parseFloat(getComputedStyle(current.lastAvatar).outlineWidth)).toBeGreaterThan(0);
                    current.lastAvatar.blur();
                    await user.unhover(current.lastAvatar);
                    await settleLayout(group);
                    expect(current.lastAvatar.matches(':hover')).toBe(false);
                    expect(getComputedStyle(current.lastAvatar).boxShadow).toBe(ring);
                    assertCounterGeometry(group, '+1', 2, direction);
                }
            });
        }
    }
});
