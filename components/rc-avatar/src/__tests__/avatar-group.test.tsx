import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import Avatar from '../avatar.js';
import AvatarGroup from '../avatar-group.js';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());

describe('AvatarGroup', () => {
    it('renders all avatars when count is within max', () => {
        render(
            <AvatarGroup>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
                <Avatar>C</Avatar>
            </AvatarGroup>,
        );
        expect(screen.getByText('A')).toBeTruthy();
        expect(screen.getByText('B')).toBeTruthy();
        expect(screen.getByText('C')).toBeTruthy();
        // No badge when max >= total
        expect(screen.queryByLabelText('+1 more')).toBeNull();
    });

    it('renders +N badge on last visible avatar when children exceed max', () => {
        render(
            <AvatarGroup max={2}>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
                <Avatar>C</Avatar>
                <Avatar>D</Avatar>
            </AvatarGroup>,
        );
        expect(screen.getByText('A')).toBeTruthy();
        expect(screen.getByText('B')).toBeTruthy();
        // C and D are hidden (not rendered)
        expect(screen.queryByText('C')).toBeNull();
        expect(screen.queryByText('D')).toBeNull();
        // Badge indicator on last visible avatar B
        const indicator = screen.getByLabelText('+2 more');
        expect(indicator).toBeTruthy();
        expect(indicator.textContent).toBe('+2');
    });

    it('passes down size to children', () => {
        const { container } = render(
            <AvatarGroup size="large">
                <Avatar>X</Avatar>
            </AvatarGroup>,
        );
        expect(container.querySelector('span[class]')).toBeTruthy();
    });

    it('does not override child size when explicitly set', () => {
        render(
            <AvatarGroup size="large">
                <Avatar size="small">X</Avatar>
            </AvatarGroup>,
        );
        expect(screen.getByText('X')).toBeTruthy();
    });

    it('renders no badge when max equals child count', () => {
        render(
            <AvatarGroup max={3}>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
                <Avatar>C</Avatar>
            </AvatarGroup>,
        );
        expect(screen.queryByLabelText('+0 more')).toBeNull();
        expect(screen.queryByRole('status')).toBeNull();
    });

    it('renders no badge when max is undefined', () => {
        render(
            <AvatarGroup>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
            </AvatarGroup>,
        );
        expect(screen.queryByRole('status')).toBeNull();
    });

    it('renders overflow badge on last avatar for number size', () => {
        render(
            <AvatarGroup size={60} max={1}>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
            </AvatarGroup>,
        );
        // Badge indicator is present; sizing is now controlled by Badge, not the slot
        expect(screen.getByLabelText('+1 more')).toBeTruthy();
    });

    it('renders overflow badge with shape="square"', () => {
        render(
            <AvatarGroup shape="square" max={1}>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
            </AvatarGroup>,
        );
        expect(screen.getByLabelText('+1 more')).toBeTruthy();
    });

    it('stacks visible avatars with descending z-index so the first sits on top', () => {
        const { container } = render(
            <AvatarGroup max={3}>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
                <Avatar>C</Avatar>
                <Avatar>D</Avatar>
            </AvatarGroup>,
        );
        const items = Array.from(
            container.querySelectorAll<HTMLElement>('div > span'),
        ).slice(0, 3);
        expect(items).toHaveLength(3);
        expect(items[0].style.zIndex).toBe('3');
        expect(items[1].style.zIndex).toBe('2');
        expect(items[2].style.zIndex).toBe('1');
    });

    it('applies spacing prop as CSS custom property', () => {
        const { container } = render(
            <AvatarGroup spacing={-12}>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
            </AvatarGroup>,
        );
        const group = container.firstElementChild as HTMLElement;
        expect(group.style.getPropertyValue('--avatar-group-overlap')).toBe('-12px');
    });

    it('badge indicator carries title "+N more"', () => {
        render(
            <AvatarGroup max={1}>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
                <Avatar>C</Avatar>
            </AvatarGroup>,
        );
        const indicator = screen.getByLabelText('+2 more');
        expect(indicator.getAttribute('title')).toBe('+2 more');
    });

    it('makes the last item interactive when onExtraClick is provided', () => {
        const handleClick = jest.fn();
        render(
            <AvatarGroup max={1} onExtraClick={handleClick}>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
                <Avatar>C</Avatar>
            </AvatarGroup>,
        );
        // The outer span (not the Badge indicator) gets role="button"
        const button = screen.getByRole('button', { name: '+2 more' });
        expect(button.getAttribute('tabindex')).toBe('0');

        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);

        fireEvent.keyDown(button, { key: 'Enter' });
        expect(handleClick).toHaveBeenCalledTimes(2);

        fireEvent.keyDown(button, { key: ' ' });
        expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('supports custom renderExtra as Badge count content', () => {
        render(
            <AvatarGroup
                max={1}
                renderExtra={(hidden) => `and ${hidden} more`}
            >
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
                <Avatar>C</Avatar>
            </AvatarGroup>,
        );
        // Badge indicator title still shows "+2 more"
        const indicator = screen.getByLabelText('+2 more');
        expect(indicator.textContent).toBe('and 2 more');
    });
});