import { describe, expect, it, render, screen } from "@crab-dev/wake/test/react";
import Badge from '../badge.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe('Badge', () => {
    it('renders numeric count', async () => {
        await render(<Badge count={5}/>);
        expect(screen.getByText('5')).toBeTruthy();
    });
    it('shows overflow text when count exceeds overflowCount', async () => {
        await render(<Badge count={120} overflowCount={99}/>);
        expect(screen.getByText('99+')).toBeTruthy();
    });
    it('hides zero count by default', async () => {
        const { container } = await render(<Badge count={0}/>);
        expect(container.textContent).toBe('');
    });
    it('shows zero when showZero is true', async () => {
        await render(<Badge count={0} showZero/>);
        expect(screen.getByText('0')).toBeTruthy();
    });
    it('renders dot when dot prop is true', async () => {
        const { container } = await render(<Badge dot/>);
        const dot = container.querySelector('[role="status"]') as HTMLElement;
        expect(dot).toBeTruthy();
        expect(dot.textContent).toBe('');
    });
    it('renders status mode with text', async () => {
        await render(<Badge status="success" text="运行中"/>);
        expect(screen.getByText('运行中')).toBeTruthy();
    });
    it('wraps children and shows floating indicator', async () => {
        const { container } = await render(<Badge count={3}>
            <span data-testid="wrapped">头像</span>
        </Badge>);
        expect(container.querySelector('[data-testid="wrapped"]')).toBeTruthy();
        expect(screen.getByText('3')).toBeTruthy();
    });
    it('renders children only when count is 0 and showZero is false', async () => {
        const { container } = await render(<Badge count={0}>
            <span data-testid="wrapped">头像</span>
        </Badge>);
        expect(container.querySelector('[data-testid="wrapped"]')).toBeTruthy();
        expect(container.querySelector('[role="status"]')).toBeNull();
    });
    it('accepts preset color', async () => {
        const { container } = await render(<Badge count={1} color="success"/>);
        const indicator = container.querySelector('[role="status"]') as HTMLElement;
        expect(indicator).toBeTruthy();
        // 静态 className 已合并进元素
        expect(indicator.className.length).toBeGreaterThan(0);
    });
    it('accepts custom color string via inline background', async () => {
        const { container } = await render(<Badge dot color="#ff6b00"/>);
        const indicator = container.querySelector('[role="status"]') as HTMLElement;
        expect(indicator.style.backgroundColor).toBeTruthy();
    });
    it('applies title attribute on count indicator', async () => {
        await render(<Badge count={7} title="未读消息"/>);
        const indicator = screen.getByText('7');
        expect(indicator.getAttribute('title')).toBe('未读消息');
    });
    it('supports small size', async () => {
        const { container } = await render(<Badge count={1} size="small"/>);
        expect(container.querySelector('[role="status"]')).toBeTruthy();
    });
    it('renders processing status with pulse element', async () => {
        const { container } = await render(<Badge status="processing" text="处理中"/>);
        expect(screen.getByText('处理中')).toBeTruthy();
        const dot = container.querySelector('[aria-hidden="true"]') as HTMLElement;
        expect(dot).toBeTruthy();
    });
    it('forwards offset to transform', async () => {
        const { container } = await render(<Badge count={1} offset={[10, -4]}>
            <span>子节点</span>
        </Badge>);
        const indicator = container.querySelector('[role="status"]') as HTMLElement;
        expect(indicator.style.transform).toContain('10px');
        expect(indicator.style.transform).toContain('-4px');
    });
});
