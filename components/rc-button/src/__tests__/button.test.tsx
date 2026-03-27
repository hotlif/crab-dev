import { act } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';

import Button from '../button.js';
import type { ButtonProps } from '../types.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const renderButton = (props: Partial<ButtonProps> = {}) => {
    const renderResult = render(<Button {...props}>Button Text</Button>);
    const button = screen.getByRole('button', { name: 'Button Text' }) as HTMLButtonElement;

    return {
        ...renderResult,
        button,
    };
};

const clickButton = (button: HTMLButtonElement) => {
    act(() => {
        fireEvent.click(button);
    });
};

describe('Button', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders all appearance variants without runtime error', () => {
        const appearanceList: NonNullable<ButtonProps['appearance']>[] = [
            'primary',
            'subtle',
            'dashed',
            'text',
            'link',
        ];

        appearanceList.forEach((appearance) => {
            const { button, unmount } = renderButton({ appearance });
            expect(button.className.length).toBeGreaterThan(0);
            unmount();
        });
    });

    it('renders icon when provided', () => {
        const TestIcon = () => <svg data-testid="test-icon" />;
        const { button, unmount } = renderButton({ icon: <TestIcon /> });
        expect(button.querySelector('[data-testid="test-icon"]')).toBeTruthy();
        unmount();
    });

    it('renders with only aria-label and no children', () => {
        const { container, unmount } = render(<Button aria-label="aria only" />);
        const btn = container.querySelector('button');
        expect(btn).toBeTruthy();
        expect(btn?.getAttribute('aria-label')).toBe('aria only');
        unmount();
    });

    it('sets aria-busy and aria-disabled correctly', () => {
        const { button, unmount } = renderButton({ loading: true, disabled: true });
        expect(button.getAttribute('aria-busy')).toBe('true');
        expect(button.getAttribute('aria-disabled')).toBe('true');
        unmount();
    });

    it('does not trigger onClick when disabled', () => {
        const onClick = jest.fn() as ButtonProps['onClick'];
        const { button, unmount } = renderButton({ disabled: true, onClick });
        clickButton(button);
        expect(onClick).not.toHaveBeenCalled();
        unmount();
    });

    it('forwards className, style, and data-* attributes', () => {
        const { button, unmount } = renderButton({
            className: 'extra-class',
            style: { color: 'red' },
            'data-test-id': 'my-btn',
        } as any);
        expect(button.className).toContain('extra-class');
        expect(button.style.color).toBe('red');
        expect(button.getAttribute('data-test-id')).toBe('my-btn');
        unmount();
    });

    it('renders with only children, no icon, no onClick', () => {
        const { container, unmount } = render(<Button>test</Button>);
        const btn = container.querySelector('button');
        expect(btn).toBeTruthy();
        expect(btn?.textContent).toBe('test');
        unmount();
    });

    it('renders all size variants and fit-container option', () => {
        const sizeList: NonNullable<ButtonProps['size']>[] = ['large', 'middle', 'small'];

        sizeList.forEach((size) => {
            const { button, unmount } = renderButton({ size, shouldFitContainer: true });
            expect(button.className.length).toBeGreaterThan(0);
            unmount();
        });
    });

    it('renders children and default non-loading state', () => {
        const { button, unmount } = renderButton();

        expect(button.textContent).toContain('Button Text');
        expect(button.getAttribute('data-is-loading')).toBeNull();

        unmount();
    });

    it('renders loading icon when loading is true', () => {
        const { button, unmount } = renderButton({ loading: true });

        expect(button.getAttribute('data-is-loading')).toBe('true');
        expect(button.querySelector('svg')).toBeTruthy();

        unmount();
    });

    it('dedupes async onClick while pending', async () => {
        let resolveClick: (() => void) | undefined;
        const onClick = jest.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveClick = resolve;
                }),
        );

        const { button, unmount } = renderButton({ onClick: onClick as ButtonProps['onClick'] });

        clickButton(button);
        clickButton(button);

        expect(onClick).toHaveBeenCalledTimes(1);

        await act(async () => {
            resolveClick?.();
            await Promise.resolve();
        });

        clickButton(button);

        expect(onClick).toHaveBeenCalledTimes(2);

        unmount();
    });

    it('does not lock sync onClick between clicks', () => {
        const onClick = jest.fn() as ButtonProps['onClick'];

        const { button, unmount } = renderButton({ onClick });

        clickButton(button);
        clickButton(button);

        expect(onClick).toHaveBeenCalledTimes(2);

        unmount();
    });

    it('releases click lock after rejected onClick', async () => {
        const onClick = jest.fn(() => Promise.reject(new Error('failed')));

        const { button, unmount } = renderButton({ onClick });

        clickButton(button);

        await act(async () => {
            await Promise.resolve();
        });

        clickButton(button);

        expect(onClick).toHaveBeenCalledTimes(2);

        unmount();
    });

    it('dedupes async onClickCapture while pending', async () => {
        let resolveCapture: (() => void) | undefined;
        const onClickCapture = jest.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveCapture = resolve;
                }),
        );

        const { button, unmount } = renderButton({ onClickCapture });

        clickButton(button);
        clickButton(button);

        expect(onClickCapture).toHaveBeenCalledTimes(1);

        await act(async () => {
            resolveCapture?.();
            await Promise.resolve();
        });

        clickButton(button);

        expect(onClickCapture).toHaveBeenCalledTimes(2);

        unmount();
    });

    it('releases click lock after rejected onClickCapture', async () => {
        const onClickCapture = jest.fn(() => Promise.reject(new Error('capture failed')));

        const { button, unmount } = renderButton({ onClickCapture });

        clickButton(button);

        await act(async () => {
            await Promise.resolve();
        });

        clickButton(button);

        expect(onClickCapture).toHaveBeenCalledTimes(2);

        unmount();
    });

    it('runs sync onClickCapture and sync onClick in one click', () => {
        const onClickCapture = jest.fn();
        const onClick = jest.fn();

        const { button, unmount } = renderButton({
            onClickCapture: onClickCapture as ButtonProps['onClickCapture'],
            onClick: onClick as ButtonProps['onClick'],
        });

        clickButton(button);

        expect(onClickCapture).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledTimes(1);

        unmount();
    });

    it('forwards native button attributes', () => {
        const { button, unmount } = renderButton({
            type: 'submit',
            disabled: true,
            className: 'custom-btn',
            title: 'submit-button',
        });

        expect(button.type).toBe('submit');
        expect(button.disabled).toBe(true);
        expect(button.className).toContain('custom-btn');
        expect(button.title).toBe('submit-button');

        unmount();
    });

    it('blocks bubble onClick while onClickCapture is pending', async () => {
        let resolveCapture: (() => void) | undefined;
        const onClickCapture = jest.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveCapture = resolve;
                }),
        );
        const onClick = jest.fn();

        const { button, unmount } = renderButton({
            onClickCapture: onClickCapture as ButtonProps['onClickCapture'],
            onClick: onClick as ButtonProps['onClick'],
        });

        clickButton(button);
        expect(onClickCapture).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledTimes(0);

        await act(async () => {
            resolveCapture?.();
            await Promise.resolve();
        });

        clickButton(button);
        expect(onClickCapture).toHaveBeenCalledTimes(2);
        expect(onClick).toHaveBeenCalledTimes(0);

        unmount();
    });

    it('resets lock after sync throw in onClick', () => {
        const suppressGlobalError = (event: ErrorEvent) => {
            event.preventDefault();
        };
        window.addEventListener('error', suppressGlobalError);

        const onClick = jest.fn(() => {
            throw new Error('sync click error');
        });

        const { button, unmount } = renderButton({ onClick: onClick as ButtonProps['onClick'] });

        clickButton(button);
        clickButton(button);

        expect(onClick).toHaveBeenCalledTimes(2);
        window.removeEventListener('error', suppressGlobalError);
        unmount();
    });

    it('resets lock after sync throw in onClickCapture', () => {
        const suppressGlobalError = (event: ErrorEvent) => {
            event.preventDefault();
        };
        window.addEventListener('error', suppressGlobalError);

        const onClickCapture = jest.fn(() => {
            throw new Error('sync capture error');
        });

        const { button, unmount } = renderButton({
            onClickCapture: onClickCapture as ButtonProps['onClickCapture'],
        });

        clickButton(button);
        clickButton(button);

        expect(onClickCapture).toHaveBeenCalledTimes(2);
        window.removeEventListener('error', suppressGlobalError);
        unmount();
    });
});
