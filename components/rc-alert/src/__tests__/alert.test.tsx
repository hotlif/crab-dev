import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';

import Alert from '../alert.js';
import type { AlertProps } from '../types.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const renderAlert = (props: Partial<AlertProps> = {}) => {
    const renderResult = render(<Alert {...props}>Alert message</Alert>);
    const alert = renderResult.container.firstElementChild as HTMLDivElement;

    return {
        ...renderResult,
        alert,
    };
};

describe('Alert', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders children correctly', () => {
        const { alert } = renderAlert();
        expect(alert).toBeTruthy();
        expect(alert.textContent).toContain('Alert message');
    });

    it('has role="alert"', () => {
        renderAlert();
        expect(screen.getByRole('alert')).toBeTruthy();
    });

    it('renders with only aria-label and no children', () => {
        const { container } = render(<Alert aria-label="alert only" />);
        const root = container.firstElementChild as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute('aria-label')).toBe('alert only');
    });

    it('renders title when provided', () => {
        const { alert } = renderAlert({ title: 'Alert Title' });
        expect(alert.textContent).toContain('Alert Title');
        expect(alert.textContent).toContain('Alert message');
    });

    it('shows icon by default', () => {
        const { alert } = renderAlert();
        const svg = alert.querySelector('svg');
        expect(svg).toBeTruthy();
    });

    it('hides icon when showIcon is false', () => {
        const { alert } = renderAlert({ showIcon: false });
        const svg = alert.querySelector('svg');
        expect(svg).toBeNull();
    });

    it('renders custom icon when provided', () => {
        const { container } = render(
            <Alert icon={<span data-testid="custom-icon">!</span>}>Message</Alert>,
        );
        expect(screen.getByTestId('custom-icon')).toBeTruthy();
        // 不应渲染默认 SVG 图标
        expect(container.querySelector('svg')).toBeNull();
    });

    it('does not render close button by default', () => {
        renderAlert();
        expect(screen.queryByRole('button', { name: 'close' })).toBeNull();
    });

    it('renders close button when closable is true', () => {
        renderAlert({ closable: true });
        expect(screen.getByRole('button', { name: 'close' })).toBeTruthy();
    });

    it('calls onClose when close button is clicked', () => {
        const onClose = jest.fn();
        renderAlert({ closable: true, onClose });

        fireEvent.click(screen.getByRole('button', { name: 'close' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('removes element from DOM after close', () => {
        const { container } = render(<Alert closable>Message</Alert>);
        expect(container.firstElementChild).toBeTruthy();

        fireEvent.click(screen.getByRole('button', { name: 'close' }));

        expect(container.firstElementChild).toBeNull();
    });

    it('hides close button when closeIcon is false', () => {
        render(
            <Alert closable closeIcon={false}>
                Message
            </Alert>,
        );
        expect(screen.queryByRole('button', { name: 'close' })).toBeNull();
    });

    it('renders custom closeIcon', () => {
        render(
            <Alert closable closeIcon={<span data-testid="custom-close">×</span>}>
                Message
            </Alert>,
        );
        expect(screen.getByTestId('custom-close')).toBeTruthy();
    });

    it('calls onClose when pressing Enter on close button', () => {
        const onClose = jest.fn();
        renderAlert({ closable: true, onClose });

        const closeButton = screen.getByRole('button', { name: 'close' });
        fireEvent.keyDown(closeButton, { key: 'Enter' });

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when pressing Space on close button', () => {
        const onClose = jest.fn();
        renderAlert({ closable: true, onClose });

        const closeButton = screen.getByRole('button', { name: 'close' });
        fireEvent.keyDown(closeButton, { key: ' ' });

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('renders all four types', () => {
        const types = ['success', 'info', 'warning', 'error'] as const;

        for (const type of types) {
            const { unmount } = render(<Alert type={type}>Message</Alert>);
            expect(screen.getByRole('alert')).toBeTruthy();
            unmount();
        }
    });

    it('defaults to info type', () => {
        const { alert } = renderAlert();
        // info 类型应渲染 info 图标（圆形带 i）
        expect(alert).toBeTruthy();
    });

    it('renders action node', () => {
        render(
            <Alert action={<button data-testid="action-btn">Undo</button>}>
                Message
            </Alert>,
        );
        expect(screen.getByTestId('action-btn')).toBeTruthy();
    });

    it('passes custom className', () => {
        const { alert } = renderAlert({ className: 'my-alert' });
        expect(alert.classList.contains('my-alert')).toBe(true);
    });

    it('spreads restProps to root element', () => {
        const { alert } = renderAlert({ 'data-testid': 'custom-alert' } as unknown as AlertProps);
        expect(alert.getAttribute('data-testid')).toBe('custom-alert');
    });
});
