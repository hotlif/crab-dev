import { describe, expect, it, mock, fireEvent, render, screen, act } from "@crab-dev/wake/test/react";
import Button from '../button.js';
import type { ButtonProps } from '../types.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const renderButton = async (props: Partial<ButtonProps> = {}) => {
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
    it('renders all appearance variants without runtime error', async () => {
        const appearanceList: NonNullable<ButtonProps['appearance']>[] = [
            'primary',
            'subtle',
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
        const onClick = mock.fn() as ButtonProps['onClick'];
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
        const sizeList: NonNullable<ButtonProps['size']>[] = ['large', 'middle', 'small'];
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
        const { button, unmount } = await renderButton({ onClick: onClick as ButtonProps['onClick'] });
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
        const onClick = mock.fn() as ButtonProps['onClick'];
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
            onClickCapture: onClickCapture as ButtonProps['onClickCapture'],
            onClick: onClick as ButtonProps['onClick'],
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
            onClickCapture: onClickCapture as ButtonProps['onClickCapture'],
            onClick: onClick as ButtonProps['onClick'],
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
        const { button, unmount } = await renderButton({ onClick: onClick as ButtonProps['onClick'] });
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
            onClickCapture: onClickCapture as ButtonProps['onClickCapture'],
        });
        await clickButton(button);
        await clickButton(button);
        expect(onClickCapture).toHaveBeenCalledTimes(2);
        window.removeEventListener('error', suppressGlobalError);
        await unmount();
    });
});
