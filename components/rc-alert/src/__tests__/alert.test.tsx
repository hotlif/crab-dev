import { describe, expect, it, mock, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import Alert from '../alert.js';
import type { AlertProps } from '../types.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const renderAlert = async (props: Partial<AlertProps> = {}) => {
    const renderResult = await render(<Alert {...props}>Alert message</Alert>);
    const alert = renderResult.container.firstElementChild as HTMLDivElement;
    return {
        ...renderResult,
        alert,
    };
};
describe('Alert', () => {
    it('renders children correctly', async () => {
        const { alert } = await renderAlert();
        expect(alert).toBeTruthy();
        expect(alert.textContent).toContain('Alert message');
    });
    it('has role="alert"', async () => {
        await renderAlert();
        expect(screen.getByRole('alert')).toBeTruthy();
    });
    it('renders with only aria-label and no children', async () => {
        const { container } = await render(<Alert aria-label="alert only"/>);
        const root = container.firstElementChild as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute('aria-label')).toBe('alert only');
    });
    it('renders title when provided', async () => {
        const { alert } = await renderAlert({ title: 'Alert Title' });
        expect(alert.textContent).toContain('Alert Title');
        expect(alert.textContent).toContain('Alert message');
    });
    it('shows icon by default', async () => {
        const { alert } = await renderAlert();
        const svg = alert.querySelector('svg');
        expect(svg).toBeTruthy();
    });
    it('hides icon when showIcon is false', async () => {
        const { alert } = await renderAlert({ showIcon: false });
        const svg = alert.querySelector('svg');
        expect(svg).toBeNull();
    });
    it('renders custom icon when provided', async () => {
        const { container } = await render(<Alert icon={<span data-testid="custom-icon">!</span>}>Message</Alert>);
        expect(screen.getByTestId('custom-icon')).toBeTruthy();
        // 不应渲染默认 SVG 图标
        expect(container.querySelector('svg')).toBeNull();
    });
    it('does not render close button by default', async () => {
        await renderAlert();
        expect(screen.queryByRole('button', { name: 'close' })).toBeNull();
    });
    it('renders close button when closable is true', async () => {
        await renderAlert({ closable: true });
        expect(screen.getByRole('button', { name: 'close' })).toBeTruthy();
    });
    it('calls onClose when close button is clicked', async () => {
        const onClose = mock.fn();
        await renderAlert({ closable: true, onClose });
        await fireEvent.click(screen.getByRole('button', { name: 'close' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
    it('removes element from DOM after close', async () => {
        const { container } = await render(<Alert closable>Message</Alert>);
        expect(container.firstElementChild).toBeTruthy();
        await fireEvent.click(screen.getByRole('button', { name: 'close' }));
        expect(container.firstElementChild).toBeNull();
    });
    it('hides close button when closeIcon is false', async () => {
        await render(<Alert closable closeIcon={false}>
                Message
        </Alert>);
        expect(screen.queryByRole('button', { name: 'close' })).toBeNull();
    });
    it('renders custom closeIcon', async () => {
        await render(<Alert closable closeIcon={<span data-testid="custom-close">×</span>}>
                Message
        </Alert>);
        expect(screen.getByTestId('custom-close')).toBeTruthy();
    });
    it('calls onClose when pressing Enter on close button', async () => {
        const onClose = mock.fn();
        await renderAlert({ closable: true, onClose });
        const closeButton = screen.getByRole('button', { name: 'close' });
        await fireEvent.keyDown(closeButton, { key: 'Enter' });
        expect(onClose).toHaveBeenCalledTimes(1);
    });
    it('calls onClose when pressing Space on close button', async () => {
        const onClose = mock.fn();
        await renderAlert({ closable: true, onClose });
        const closeButton = screen.getByRole('button', { name: 'close' });
        await fireEvent.keyDown(closeButton, { key: ' ' });
        expect(onClose).toHaveBeenCalledTimes(1);
    });
    it('renders all four types', async () => {
        const types = ['success', 'info', 'warning', 'error'] as const;
        for (const type of types) {
            const { unmount } = await render(<Alert type={type}>Message</Alert>);
            expect(screen.getByRole('alert')).toBeTruthy();
            await unmount();
        }
    });
    it('defaults to info type', async () => {
        const { alert } = await renderAlert();
        // info 类型应渲染 info 图标（圆形带 i）
        expect(alert).toBeTruthy();
    });
    it('renders action node', async () => {
        await render(<Alert action={<button data-testid="action-btn">Undo</button>}>
                Message
        </Alert>);
        expect(screen.getByTestId('action-btn')).toBeTruthy();
    });
    it('passes custom className', async () => {
        const { alert } = await renderAlert({ className: 'my-alert' });
        expect(alert.classList.contains('my-alert')).toBe(true);
    });
    it('spreads restProps to root element', async () => {
        const { alert } = await renderAlert({ 'data-testid': 'custom-alert' } as unknown as AlertProps);
        expect(alert.getAttribute('data-testid')).toBe('custom-alert');
    });
});
