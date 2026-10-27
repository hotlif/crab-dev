import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { fireEvent, render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider, { type ConfigLocale } from '@crab-dev/rc-config-provider';
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
        expect(screen.queryByLabelText('另外 1 个头像')).toBeNull();
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
        const indicator = screen.getByLabelText('另外 2 个头像');
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
    it('preserves the last child class and inline style when its counter appears or disappears', async () => {
        const view = (max: number | undefined) => <AvatarGroup size="small" shape="circle" max={max}>
            <Avatar data-testid="custom-avatar" size={44} shape="square" className="consumer-avatar" style={{ borderRadius: 7, boxShadow: '0 0 0 3px red' }}>A</Avatar>
            <Avatar>B</Avatar>
        </AvatarGroup>;
        const { rerender } = await render(view(1));
        const avatar = screen.getByTestId('custom-avatar');
        expect(avatar.classList.contains('consumer-avatar')).toBe(true);
        expect(avatar.style.width).toBe('44px');
        expect(avatar.style.borderRadius).toBe('7px');
        expect(avatar.style.boxShadow).toBe('0 0 0 3px red');
        const consumerStyle = avatar.getAttribute('style');
        for (const max of [undefined, 1]) {
            await rerender(view(max));
            const current = screen.getByTestId('custom-avatar');
            expect(current.classList.contains('consumer-avatar')).toBe(true);
            expect(current.getAttribute('style')).toBe(consumerStyle);
        }
    });
    it('renders no badge when max equals child count', async () => {
        await render(<AvatarGroup max={3}>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
            <Avatar>C</Avatar>
        </AvatarGroup>);
        expect(screen.queryByLabelText('另外 0 个头像')).toBeNull();
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
        expect(screen.getByLabelText('另外 1 个头像')).toBeTruthy();
    });
    it('renders overflow badge with shape="square"', async () => {
        await render(<AvatarGroup shape="square" max={1}>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
        </AvatarGroup>);
        expect(screen.getByLabelText('另外 1 个头像')).toBeTruthy();
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
    it('badge indicator carries the default Chinese overflow title', async () => {
        await render(<AvatarGroup max={1}>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
            <Avatar>C</Avatar>
        </AvatarGroup>);
        const indicator = screen.getByLabelText('另外 2 个头像');
        expect(indicator.getAttribute('title')).toBe('另外 2 个头像');
    });
    it('keeps overflow and avatar actions independent without nested buttons', async () => {
        const handleClick = mock.fn();
        const avatarClick = mock.fn();
        const { container } = await render(<AvatarGroup max={1} onExtraClick={handleClick}>
            <Avatar onClick={avatarClick}>A</Avatar>
            <Avatar>B</Avatar>
            <Avatar>C</Avatar>
        </AvatarGroup>);
        const button = screen.getByRole('button', { name: '另外 2 个头像' });
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
        // Custom visible content does not replace the localized overflow title.
        const indicator = screen.getByLabelText('另外 2 个头像');
        expect(indicator.textContent).toBe('and 2 more');
        expect(indicator.querySelector('bdi')).toBeNull();
    });
    for (const interactive of [false, true]) {
        it(`updates the ${interactive ? 'action name' : 'badge title'} when locale changes without replacing avatars or actions`, async () => {
            const avatarClick = mock.fn();
            const extraClick = mock.fn();
            const view = (locale: ConfigLocale) => <ConfigProvider locale={locale} direction="rtl">
                <AvatarGroup max={1} onExtraClick={interactive ? extraClick : undefined}>
                    <Avatar onClick={avatarClick}>A</Avatar>
                    <Avatar>B</Avatar>
                    <Avatar>C</Avatar>
                </AvatarGroup>
            </ConfigProvider>;
            const { rerender } = await render(view('zh-CN'));
            const avatar = screen.getByRole('button', { name: 'A' });
            const extra = screen.getByLabelText('另外 2 个头像');
            const count = extra.querySelector('bdi');
            expect(count?.getAttribute('dir')).toBe('ltr');
            expect(count?.textContent).toBe('+2');
            await fireEvent.click(avatar);
            if (interactive) await fireEvent.click(extra);

            await rerender(view('en-US'));
            expect(screen.getByRole('button', { name: 'A' })).toBe(avatar);
            expect(screen.getByLabelText('2 more avatars')).toBe(extra);
            expect(extra.querySelector('bdi')).toBe(count);
            if (!interactive) expect(extra.getAttribute('title')).toBe('2 more avatars');
            expect(screen.queryByText('B')).toBeNull();
            expect(screen.queryByText('C')).toBeNull();
            await fireEvent.click(avatar);
            if (interactive) await fireEvent.click(extra);
            expect(avatarClick).toHaveBeenCalledTimes(2);
            expect(extraClick).toHaveBeenCalledTimes(interactive ? 2 : 0);

            await rerender(view('zh-CN'));
            expect(screen.getByLabelText('另外 2 个头像')).toBe(extra);
            expect(screen.getByRole('button', { name: 'A' })).toBe(avatar);
        });
    }
    it('uses singular English for one hidden avatar and preserves custom RTL content', async () => {
        await render(<ConfigProvider locale="en-US" direction="rtl">
            <AvatarGroup max={1} renderExtra={() => <span dir="rtl">مزيد</span>}>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
            </AvatarGroup>
        </ConfigProvider>);
        const indicator = screen.getByLabelText('1 more avatar');
        expect(indicator.getAttribute('title')).toBe('1 more avatar');
        expect(indicator.querySelector('bdi')).toBeNull();
        expect(screen.getByText('مزيد').getAttribute('dir')).toBe('rtl');
    });
    it('keeps a standalone summary for max=0, including custom content and the full hidden list', async () => {
        const { rerender } = await render(<ConfigProvider direction="rtl">
            <AvatarGroup max={0}><Avatar>A</Avatar><Avatar>B</Avatar></AvatarGroup>
        </ConfigProvider>);
        const indicator = screen.getByRole('status', { name: '另外 2 个头像' });
        expect(indicator.getAttribute('title')).toBe('另外 2 个头像');
        expect(indicator.querySelector('bdi')?.getAttribute('dir')).toBe('ltr');
        expect(indicator.textContent).toBe('+2');
        expect(screen.queryByText('A')).toBeNull();
        expect(screen.queryByText('B')).toBeNull();
        expect(screen.queryByRole('button')).toBeNull();

        await rerender(<ConfigProvider direction="rtl">
            <AvatarGroup max={0} renderExtra={(count, hidden) => <span>{count}: {hidden.map(avatar => avatar.props.children).join(', ')}</span>}>
                <Avatar>A</Avatar><Avatar>B</Avatar>
            </AvatarGroup>
        </ConfigProvider>);
        const custom = screen.getByRole('status', { name: '另外 2 个头像' });
        expect(custom.textContent).toBe('2: A, B');
        expect(custom.querySelector('bdi')).toBeNull();
        await rerender(<AvatarGroup max={0} />);
        expect(screen.queryByRole('status')).toBeNull();
    });
    it('keeps max=0 overflow actions independent when members become visible', async () => {
        const avatarClick = mock.fn();
        const extraClick = mock.fn();
        const view = (max: number) => <AvatarGroup max={max} onExtraClick={extraClick}>
            <Avatar onClick={avatarClick}>A</Avatar><Avatar>B</Avatar>
        </AvatarGroup>;
        const { container, rerender } = await render(view(0));
        const extra = screen.getByRole('button', { name: '另外 2 个头像' });
        expect(extra.querySelector('bdi')?.textContent).toBe('+2');
        expect(screen.queryByRole('status')).toBeNull();
        expect(screen.queryByRole('button', { name: 'A' })).toBeNull();
        await fireEvent.click(extra);
        expect(extraClick).toHaveBeenCalledTimes(1);
        expect(avatarClick).not.toHaveBeenCalled();

        await rerender(view(1));
        expect(container.querySelector('button button')).toBeNull();
        await fireEvent.click(screen.getByRole('button', { name: 'A' }));
        expect(avatarClick).toHaveBeenCalledTimes(1);
        expect(extraClick).toHaveBeenCalledTimes(1);
        await fireEvent.click(screen.getByRole('button', { name: '另外 1 个头像' }));
        expect(extraClick).toHaveBeenCalledTimes(2);
        expect(avatarClick).toHaveBeenCalledTimes(1);
    });
});
