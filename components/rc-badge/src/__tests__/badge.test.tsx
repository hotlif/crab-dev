import { describe, expect, it } from "@crab-dev/wake/test";
import { render, screen } from "@crab-dev/wake/test/react";
import ConfigProvider from '@crab-dev/rc-config-provider';
import Badge from '../badge.js';
import { vars } from '../token.js';
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
    it('updates the default dot name in place when the locale changes', async () => {
        const view = await render(<ConfigProvider locale="zh-CN"><Badge dot /></ConfigProvider>);
        const indicator = screen.getByRole('status', { name: '状态标记' });
        await view.rerender(<ConfigProvider locale="en-US"><Badge dot /></ConfigProvider>);
        expect(screen.getByRole('status', { name: 'Status indicator' })).toBe(indicator);
        expect(indicator.textContent).toBe('');
    });
    it('preserves caller dot names over the localized fallback', async () => {
        const view = await render(<ConfigProvider locale="zh-CN"><Badge dot text="Background sync" /></ConfigProvider>);
        const indicator = screen.getByRole('status', { name: 'Background sync' });
        await view.rerender(<ConfigProvider locale="en-US"><Badge dot text="Background sync" title="New messages" /></ConfigProvider>);
        expect(screen.getByRole('status', { name: 'New messages' })).toBe(indicator);
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
        const indicator = screen.getByRole('status', { name: '未读消息' });
        expect(indicator.getAttribute('title')).toBe('未读消息');
    });

    it('isolates built-in numeric expressions and retains caller content direction', async () => {
        const view = await render(<Badge dir="rtl" count={120} />);
        const indicator = screen.getByRole('status', { name: '120' });
        const number = indicator.querySelector('bdi');
        expect(number?.getAttribute('dir')).toBe('ltr');
        expect(number?.textContent).toBe('99+');
        await view.rerender(<Badge dir="ltr" count={120} />);
        expect(screen.getByRole('status', { name: '120' }).querySelector('bdi')).toBe(number);
        await view.rerender(<Badge dir="ltr" count={<span data-custom-count="" dir="rtl">عد 12</span>} />);
        const custom = view.container.querySelector('[data-custom-count]');
        expect(custom?.getAttribute('dir')).toBe('rtl');
        expect(custom?.textContent).toBe('عد 12');
        expect(view.container.querySelector('bdi')).toBeNull();
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
    it('preserves physical offsets without replacing direction-aware CSS', async () => {
        const { container } = await render(<Badge count={1} offset={[10, -4]}>
            <span>子节点</span>
        </Badge>);
        const indicator = container.querySelector('[role="status"]') as HTMLElement;
        expect(indicator.style.getPropertyValue(vars['indicator.offset.left'])).toBe('10px');
        expect(indicator.style.getPropertyValue(vars['indicator.offset.top'])).toBe('-4px');
        expect(indicator.style.transform).toBe('');
    });
    it('keeps calc offsets and explicit indicator style when native dir changes in place', async () => {
        const fixture = (dir: 'ltr' | 'rtl') => <ConfigProvider direction="ltr">
            <Badge dir={dir} count={3} offset={['calc(1rem + 2px)', '-0.25rem']}
                indicatorStyle={{ transform: 'translate(3px, 4px)', color: 'blue' }}>
                <span>头像</span>
            </Badge>
        </ConfigProvider>;
        const view = await render(fixture('ltr'));
        const indicator = screen.getByRole('status', { name: '3' });
        await view.rerender(fixture('rtl'));
        expect(screen.getByRole('status', { name: '3' })).toBe(indicator);
        expect(indicator.parentElement?.getAttribute('dir')).toBe('rtl');
        expect(indicator.style.getPropertyValue(vars['indicator.offset.left'])).toBe('calc(1rem + 2px)');
        expect(indicator.style.getPropertyValue(vars['indicator.offset.top'])).toBe('-0.25rem');
        expect(indicator.style.transform).toBe('translate(3px, 4px)');
        expect(indicator.style.color).toBe('blue');
    });
    it('does not position standalone counts or status text with offsets', async () => {
        const view = await render(<Badge count={3} offset={[8, 4]} />);
        const indicator = screen.getByRole('status', { name: '3' });
        expect(indicator.style.getPropertyValue(vars['indicator.offset.left'])).toBe('');
        await view.rerender(<Badge status="success" text="Ready" offset={[8, 4]} />);
        expect(screen.getByText('Ready')).toBeTruthy();
        expect(view.container.querySelector('[style*="--badge-indicator-offset"]')).toBeNull();
    });
});
