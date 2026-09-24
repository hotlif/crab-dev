import { describe, expect, it, mock } from "@crab-dev/wake/test";
import { createRef, useState, type FormEvent } from "react";
import { fireEvent, render, screen, act } from "@crab-dev/wake/test/react";
import Button from '../button.js';
import type { ButtonNativeProps } from '../types.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const renderButton = async (props: Partial<ButtonNativeProps> = {}) => {
    const renderResult = await render(<Button {...props}>Button Text</Button>);
    const button = screen.getByRole('button', { name: 'Button Text' }) as HTMLButtonElement;
    return {
        ...renderResult,
        button,
    };
};
const clickButton = async (button: HTMLButtonElement) => {
    await act(async () => {
        await fireEvent.click(button);
    });
};
describe('Button', () => {
    it('forwards anchor attributes, focus events and ref with an anchor currentTarget', async () => {
        const ref = createRef<HTMLAnchorElement>();
        const onFocus = mock.fn();
        let target: HTMLAnchorElement | undefined;
        await render(<Button href='#file' download='report.csv' hrefLang='zh' ref={ref} onFocus={onFocus}
            onClick={event => { event.preventDefault(); target = event.currentTarget; }}>Download</Button>);
        const link = screen.getByRole('link', { name: 'Download' });
        expect(ref.current).toBe(link);
        expect(link.getAttribute('download')).toBe('report.csv');
        expect(link.getAttribute('hreflang')).toBe('zh');
        await act(() => { link.focus(); });
        await fireEvent.click(link);
        expect(onFocus).toHaveBeenCalledTimes(1);
        expect(target).toBe(link);
    });
    it('keeps disabled links out of the tab order and blocks capture, bubbling, and navigation', async () => {
        const onClick = mock.fn();
        const onClickCapture = mock.fn();
        const onParentClick = mock.fn();
        const { rerender } = await render(
            <div onClick={onParentClick}>
                <Button href="#destination" disabled tabIndex={0} onClick={onClick} onClickCapture={onClickCapture}>Open</Button>
            </div>,
        );
        const link = screen.getByRole('link', { name: 'Open' });
        expect(link.getAttribute('tabindex')).toBe('-1');
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        await act(async () => { link.dispatchEvent(event); });
        expect(event.defaultPrevented).toBe(true);
        expect(onClick).not.toHaveBeenCalled();
        expect(onClickCapture).not.toHaveBeenCalled();
        expect(onParentClick).not.toHaveBeenCalled();
        await rerender(<div onClick={onParentClick}><Button href="#destination" tabIndex={0} onClick={onClick} onClickCapture={onClickCapture}>Open</Button></div>);
        expect(link.getAttribute('tabindex')).toBe('0');
        await fireEvent.click(link);
        expect(onClickCapture).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledTimes(1);
    });
    it('keeps loading links focusable while preventing activation', async () => {
        const onClick = mock.fn();
        const { rerender } = await render(<Button href="#destination" loading onClick={onClick}>Open</Button>);
        const link = screen.getByRole('link', { name: 'Open' });
        expect(link.getAttribute('tabindex')).toBeNull();
        await fireEvent.click(link);
        expect(onClick).not.toHaveBeenCalled();
        await rerender(<Button href="#destination" loading disabled onClick={onClick}>Open</Button>);
        expect(link.getAttribute('tabindex')).toBe('-1');
        expect(link.getAttribute('data-is-loading')).toBeNull();
    });
    it('keeps decorative icons and loading graphics out of the accessible name', async () => {
        const graphic = <svg role="img" aria-label="Decorative graphic" />;
        const { rerender } = await render(<Button icon={graphic} iconAfter={graphic}>Save</Button>);
        expect(screen.getByRole('button', { name: /^Save$/ })).toBeTruthy();
        for (const image of screen.getByRole('button', { name: 'Save' }).querySelectorAll('svg')) {
            expect(image.closest('[aria-hidden="true"]')).toBeTruthy();
        }
        await rerender(<Button loading loadingIcon={graphic}>Save</Button>);
        expect(screen.getByRole('button', { name: /^Save$/ })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Save' }).querySelector('svg')?.closest('[aria-hidden="true"]')).toBeTruthy();
    });
    it('lets disabled presentation take precedence over loading while keeping busy semantics', async () => {
        const { button } = await renderButton({ loading: true, disabled: true });
        expect(button.disabled).toBe(true);
        expect(button.getAttribute('aria-busy')).toBe('true');
        expect(button.getAttribute('data-is-loading')).toBeNull();
    });
    it('preserves legacy size aliases and renders all Expressive sizes', async () => {
        const { button, rerender, unmount } = await renderButton();
        for (const [legacy, current] of [['small', 'xs'], ['middle', 's'], ['large', 'm']] as const) {
            await rerender(<Button size={legacy}>Button Text</Button>);
            const legacyClasses = button.className;
            await rerender(<Button size={current}>Button Text</Button>);
            expect(button.className).toBe(legacyClasses);
        }
        for (const size of ['l', 'xl'] as const) {
            await rerender(<Button size={size}>Button Text</Button>);
            expect(button.textContent).toBe('Button Text');
        }
        await unmount();
    });
    it('defaults to outlined and preserves subtle as a compatibility alias', async () => {
        const { button, rerender, unmount } = await renderButton();
        const defaultClasses = button.className;
        await rerender(<Button appearance="outlined">Button Text</Button>);
        expect(button.className).toBe(defaultClasses);
        await rerender(<Button appearance="subtle">Button Text</Button>);
        expect(button.className).toBe(defaultClasses);
        await unmount();
    });
    it('supports danger with common appearances and preserves the legacy danger appearance', async () => {
        const { button, rerender, unmount } = await renderButton({ danger: true, appearance: 'primary' });
        const dangerClasses = button.className;
        expect(button.getAttribute('data-tone')).toBe('danger');
        expect(button.hasAttribute('danger')).toBe(false);
        await rerender(<Button appearance="danger">Button Text</Button>);
        expect(button.className).toBe(dangerClasses);
        for (const appearance of ['subtle', 'text'] as const) {
            await rerender(<Button appearance={appearance} danger>Button Text</Button>);
            expect(button.getAttribute('data-tone')).toBe('danger');
            expect(button.className).not.toBe(dangerClasses);
        }
        await rerender(<Button danger={false}>Button Text</Button>);
        expect(button.hasAttribute('data-tone')).toBe(false);
        await unmount();
    });
    it('exposes toggle state after activation without turning ordinary actions into toggles', async () => {
        function ToggleExample() {
            const [selected, setSelected] = useState(false);
            return <>
                <Button isSelected={selected} onClick={() => setSelected(value => !value)}>Filter</Button>
                <Button>Save</Button>
                <Button role="tab" isSelected aria-selected>Details</Button>
                <Button isSelected aria-pressed="mixed">Mixed</Button>
            </>;
        }
        await render(<ToggleExample />);
        await fireEvent.click(screen.getByRole('button', { name: 'Filter', pressed: false }));
        expect(screen.getByRole('button', { name: 'Filter', pressed: true })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Save' }).hasAttribute('aria-pressed')).toBe(false);
        expect(screen.getByRole('tab', { name: 'Details' }).hasAttribute('aria-pressed')).toBe(false);
        expect(screen.getByRole('button', { name: 'Mixed' }).getAttribute('aria-pressed')).toBe('mixed');
    });
    it('blocks activation and form submission while loading, then recovers', async () => {
        const onClick = mock.fn();
        const onClickCapture = mock.fn();
        const onSubmit = mock.fn((event: FormEvent) => event.preventDefault());
        const { rerender } = await render(
            <form onSubmit={onSubmit}>
                <Button type="submit" loading onClick={onClick} onClickCapture={onClickCapture}>Save</Button>
            </form>,
        );
        const button = screen.getByRole('button', { name: 'Save' });
        // Dispatch bypasses CSS pointer-events, as keyboard activation can do.
        await fireEvent.click(button);
        expect(onClick).not.toHaveBeenCalled();
        expect(onClickCapture).not.toHaveBeenCalled();
        expect(onSubmit).not.toHaveBeenCalled();
        await rerender(<form onSubmit={onSubmit}><Button type="submit" onClick={onClick}>Save</Button></form>);
        await fireEvent.click(screen.getByRole('button', { name: 'Save' }));
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    it('keeps the current-page state on navigation links and clears it when inactive', async () => {
        const { rerender, unmount } = await render(
            <Button href="/components/rc-button" aria-current="page">Button documentation</Button>,
        );
        expect(screen.getByRole('link', { name: 'Button documentation' }).getAttribute('aria-current')).toBe('page');
        await rerender(<Button href="/components/rc-button">Button documentation</Button>);
        expect(screen.getByRole('link', { name: 'Button documentation' }).getAttribute('aria-current')).toBeNull();
        await unmount();
    });
    it('renders all appearance variants without runtime error', async () => {
        const appearanceList: NonNullable<ButtonNativeProps['appearance']>[] = [
            'elevated',
            'primary',
            'subtle',
            'tonal',
            'outlined',
            'dashed',
            'text',
            'link',
        ];
        for (const appearance of appearanceList) {
            const { button, unmount } = await renderButton({ appearance });
            expect(button.className.length).toBeGreaterThan(0);
            await unmount();
        }
    });
    it('renders icon when provided', async () => {
        const TestIcon = () => <svg data-testid="test-icon"/>;
        const { button, unmount } = await renderButton({ icon: <TestIcon /> });
        expect(button.querySelector('[data-testid="test-icon"]')).toBeTruthy();
        await unmount();
    });
    it('renders with only aria-label and no children', async () => {
        const { container, unmount } = await render(<Button aria-label="aria only"/>);
        const btn = container.querySelector('button');
        expect(btn).toBeTruthy();
        expect(btn?.getAttribute('aria-label')).toBe('aria only');
        await unmount();
    });
    it('sets aria-busy and aria-disabled correctly', async () => {
        const { button, unmount } = await renderButton({ loading: true, disabled: true });
        expect(button.getAttribute('aria-busy')).toBe('true');
        expect(button.getAttribute('aria-disabled')).toBe('true');
        await unmount();
    });
    it('does not trigger onClick when disabled', async () => {
        const onClick = mock.fn() as ButtonNativeProps['onClick'];
        const { button, unmount } = await renderButton({ disabled: true, onClick });
        await clickButton(button);
        expect(onClick).not.toHaveBeenCalled();
        await unmount();
    });
    it('forwards className, style, and data-* attributes', async () => {
        const { button, unmount } = await renderButton({
            className: 'extra-class',
            style: { color: 'red' },
            'data-test-id': 'my-btn',
        } as Record<string, unknown>);
        expect(button.className).toContain('extra-class');
        expect(button.style.color).toBe('red');
        expect(button.getAttribute('data-test-id')).toBe('my-btn');
        await unmount();
    });
    it('renders with only children, no icon, no onClick', async () => {
        const { container, unmount } = await render(<Button>test</Button>);
        const btn = container.querySelector('button');
        expect(btn).toBeTruthy();
        expect(btn?.textContent).toBe('test');
        await unmount();
    });
    it('renders all size variants and fit-container option', async () => {
        const sizeList: NonNullable<ButtonNativeProps['size']>[] = ['large', 'middle', 'small'];
        for (const size of sizeList) {
            const { button, unmount } = await renderButton({ size, shouldFitContainer: true });
            expect(button.className.length).toBeGreaterThan(0);
            await unmount();
        }
    });
    it('renders children and default non-loading state', async () => {
        const { button, unmount } = await renderButton();
        expect(button.textContent).toContain('Button Text');
        expect(button.getAttribute('data-is-loading')).toBeNull();
        await unmount();
    });
    it('renders loading icon when loading is true', async () => {
        const { button, unmount } = await renderButton({ loading: true });
        expect(button.getAttribute('data-is-loading')).toBe('true');
        expect(button.querySelector('svg')).toBeTruthy();
        await unmount();
    });
    it('dedupes async onClick while pending', async () => {
        let resolveClick: (() => void) | undefined;
        const onClick = mock.fn(() => new Promise<void>((resolve) => {
            resolveClick = resolve;
        }));
        const { button, unmount } = await renderButton({ onClick: onClick as ButtonNativeProps['onClick'] });
        await clickButton(button);
        await clickButton(button);
        expect(onClick).toHaveBeenCalledTimes(1);
        await act(async () => {
            resolveClick?.();
            await Promise.resolve();
        });
        await clickButton(button);
        expect(onClick).toHaveBeenCalledTimes(2);
        await unmount();
    });
    it('does not lock sync onClick between clicks', async () => {
        const onClick = mock.fn() as ButtonNativeProps['onClick'];
        const { button, unmount } = await renderButton({ onClick });
        await clickButton(button);
        await clickButton(button);
        expect(onClick).toHaveBeenCalledTimes(2);
        await unmount();
    });
    it('releases click lock after rejected onClick', async () => {
        const onClick = mock.fn(() => Promise.reject(new Error('failed')));
        const { button, unmount } = await renderButton({ onClick });
        await clickButton(button);
        await act(async () => {
            await Promise.resolve();
        });
        await clickButton(button);
        expect(onClick).toHaveBeenCalledTimes(2);
        await unmount();
    });
    it('dedupes async onClickCapture while pending', async () => {
        let resolveCapture: (() => void) | undefined;
        const onClickCapture = mock.fn(() => new Promise<void>((resolve) => {
            resolveCapture = resolve;
        }));
        const { button, unmount } = await renderButton({ onClickCapture });
        await clickButton(button);
        await clickButton(button);
        expect(onClickCapture).toHaveBeenCalledTimes(1);
        await act(async () => {
            resolveCapture?.();
            await Promise.resolve();
        });
        await clickButton(button);
        expect(onClickCapture).toHaveBeenCalledTimes(2);
        await unmount();
    });
    it('releases click lock after rejected onClickCapture', async () => {
        const onClickCapture = mock.fn(() => Promise.reject(new Error('capture failed')));
        const { button, unmount } = await renderButton({ onClickCapture });
        await clickButton(button);
        await act(async () => {
            await Promise.resolve();
        });
        await clickButton(button);
        expect(onClickCapture).toHaveBeenCalledTimes(2);
        await unmount();
    });
    it('runs sync onClickCapture and sync onClick in one click', async () => {
        const onClickCapture = mock.fn();
        const onClick = mock.fn();
        const { button, unmount } = await renderButton({
            onClickCapture: onClickCapture as ButtonNativeProps['onClickCapture'],
            onClick: onClick as ButtonNativeProps['onClick'],
        });
        await clickButton(button);
        expect(onClickCapture).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledTimes(1);
        await unmount();
    });
    it('forwards native button attributes', async () => {
        const { container, unmount } = await render(
            <Button type="submit" disabled className="custom-btn" title="submit-button">
                Button Text
            </Button>,
        );
        const button = container.querySelector('button') as HTMLButtonElement;
        expect(button.type).toBe('submit');
        expect(button.disabled).toBe(true);
        expect(button.className).toContain('custom-btn');
        expect(button.title).toBe('submit-button');
        await unmount();
    });
    it('blocks bubble onClick while onClickCapture is pending', async () => {
        let resolveCapture: (() => void) | undefined;
        const onClickCapture = mock.fn(() => new Promise<void>((resolve) => {
            resolveCapture = resolve;
        }));
        const onClick = mock.fn();
        const { button, unmount } = await renderButton({
            onClickCapture: onClickCapture as ButtonNativeProps['onClickCapture'],
            onClick: onClick as ButtonNativeProps['onClick'],
        });
        await clickButton(button);
        expect(onClickCapture).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledTimes(0);
        await act(async () => {
            resolveCapture?.();
            await Promise.resolve();
        });
        await clickButton(button);
        expect(onClickCapture).toHaveBeenCalledTimes(2);
        expect(onClick).toHaveBeenCalledTimes(0);
        await unmount();
    });
    it('resets lock after sync throw in onClick', async () => {
        const suppressGlobalError = (event: ErrorEvent) => {
            event.preventDefault();
        };
        window.addEventListener('error', suppressGlobalError);
        const onClick = mock.fn(() => {
            throw new Error('sync click error');
        });
        const { button, unmount } = await renderButton({ onClick: onClick as ButtonNativeProps['onClick'] });
        await clickButton(button);
        await clickButton(button);
        expect(onClick).toHaveBeenCalledTimes(2);
        window.removeEventListener('error', suppressGlobalError);
        await unmount();
    });
    it('resets lock after sync throw in onClickCapture', async () => {
        const suppressGlobalError = (event: ErrorEvent) => {
            event.preventDefault();
        };
        window.addEventListener('error', suppressGlobalError);
        const onClickCapture = mock.fn(() => {
            throw new Error('sync capture error');
        });
        const { button, unmount } = await renderButton({
            onClickCapture: onClickCapture as ButtonNativeProps['onClickCapture'],
        });
        await clickButton(button);
        await clickButton(button);
        expect(onClickCapture).toHaveBeenCalledTimes(2);
        window.removeEventListener('error', suppressGlobalError);
        await unmount();
    });
});
