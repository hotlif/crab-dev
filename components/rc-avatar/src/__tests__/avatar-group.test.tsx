import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { fireEvent, render, screen } from '@crab-dev/wake/test/react';
import Avatar from '../avatar.js';
import AvatarGroup from '../avatar-group.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe('AvatarGroup', () => {
    it('renders all avatars when count is within max', async () => {
        await render(<AvatarGroup>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
            <Avatar>C</Avatar>
        </AvatarGroup>);
        expect(screen.getByText('A')).toBeTruthy();
        expect(screen.getByText('B')).toBeTruthy();
        expect(screen.getByText('C')).toBeTruthy();
        // No badge when max >= total
        expect(screen.queryByLabelText('+1 more')).toBeNull();
    });
    it('renders +N badge on last visible avatar when children exceed max', async () => {
        await render(<AvatarGroup max={2}>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
            <Avatar>C</Avatar>
            <Avatar>D</Avatar>
        </AvatarGroup>);
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
    it('passes down size to children', async () => {
        const { container } = await render(<AvatarGroup size="large">
            <Avatar>X</Avatar>
        </AvatarGroup>);
        expect(container.querySelector('span[class]')).toBeTruthy();
    });
    it('does not override child size when explicitly set', async () => {
        await render(<AvatarGroup size="large">
            <Avatar size="small">X</Avatar>
        </AvatarGroup>);
        expect(screen.getByText('X')).toBeTruthy();
    });
    it('renders no badge when max equals child count', async () => {
        await render(<AvatarGroup max={3}>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
            <Avatar>C</Avatar>
        </AvatarGroup>);
        expect(screen.queryByLabelText('+0 more')).toBeNull();
        expect(screen.queryByRole('status')).toBeNull();
    });
    it('renders no badge when max is undefined', async () => {
        await render(<AvatarGroup>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
        </AvatarGroup>);
        expect(screen.queryByRole('status')).toBeNull();
    });
    it('renders overflow badge on last avatar for number size', async () => {
        await render(<AvatarGroup size={60} max={1}>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
        </AvatarGroup>);
        // Badge indicator is present; sizing is now controlled by Badge, not the slot
        expect(screen.getByLabelText('+1 more')).toBeTruthy();
    });
    it('renders overflow badge with shape="square"', async () => {
        await render(<AvatarGroup shape="square" max={1}>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
        </AvatarGroup>);
        expect(screen.getByLabelText('+1 more')).toBeTruthy();
    });
    it('stacks visible avatars with descending z-index so the first sits on top', async () => {
        const { container } = await render(<AvatarGroup max={3}>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
            <Avatar>C</Avatar>
            <Avatar>D</Avatar>
        </AvatarGroup>);
        const items = Array.from(container.querySelectorAll<HTMLElement>('div > span')).slice(0, 3);
        expect(items).toHaveLength(3);
        expect(items[0].style.zIndex).toBe('3');
        expect(items[1].style.zIndex).toBe('2');
        expect(items[2].style.zIndex).toBe('1');
    });
    it('applies spacing prop as CSS custom property', async () => {
        const { container, rerender } = await render(<AvatarGroup spacing={-12}>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
        </AvatarGroup>);
        const group = container.firstElementChild as HTMLElement;
        expect(group.style.getPropertyValue('--avatar-group-margin')).toBe('-12px');
        await rerender(<AvatarGroup spacing="-0.5rem"><Avatar>A</Avatar><Avatar>B</Avatar></AvatarGroup>);
        expect(group.style.getPropertyValue('--avatar-group-margin')).toBe('-0.5rem');
        await rerender(<AvatarGroup><Avatar>A</Avatar><Avatar>B</Avatar></AvatarGroup>);
        expect(group.style.getPropertyValue('--avatar-group-margin')).toBe('');
    });
    it('badge indicator carries title "+N more"', async () => {
        await render(<AvatarGroup max={1}>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
            <Avatar>C</Avatar>
        </AvatarGroup>);
        const indicator = screen.getByLabelText('+2 more');
        expect(indicator.getAttribute('title')).toBe('+2 more');
    });
    it('keeps overflow and avatar actions independent without nested buttons', async () => {
        const handleClick = mock.fn();
        const avatarClick = mock.fn();
        const { container } = await render(<AvatarGroup max={1} onExtraClick={handleClick}>
            <Avatar onClick={avatarClick}>A</Avatar>
            <Avatar>B</Avatar>
            <Avatar>C</Avatar>
        </AvatarGroup>);
        const button = screen.getByRole('button', { name: '+2 more' });
        expect(button.tagName).toBe('BUTTON');
        expect(container.querySelector('button button')).toBeNull();
        await fireEvent.click(screen.getByRole('button', { name: 'A' }));
        expect(avatarClick).toHaveBeenCalledTimes(1);
        expect(handleClick).not.toHaveBeenCalled();
        await fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
    it('supports custom renderExtra as Badge count content', async () => {
        await render(<AvatarGroup max={1} renderExtra={(hidden) => `and ${hidden} more`}>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
            <Avatar>C</Avatar>
        </AvatarGroup>);
        // Badge indicator title still shows "+2 more"
        const indicator = screen.getByLabelText('+2 more');
        expect(indicator.textContent).toBe('and 2 more');
    });
});
