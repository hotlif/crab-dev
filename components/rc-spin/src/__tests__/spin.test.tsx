import { act, afterEach, beforeEach, describe, expect, it, clock, render } from "@crab-dev/wake/test/react";
import { createRef } from 'react';
import Spin from '../spin.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe('Spin', () => {
    describe('standalone', () => {
        it('renders a live status region while spinning', async () => {
            const { container } = await render(<Spin />);
            const status = container.querySelector('[role="status"]');
            expect(status).toBeTruthy();
            expect(status?.getAttribute('aria-live')).toBe('polite');
        });
        it('names the indicator so screen readers announce more than a bare spinner', async () => {
            const { container } = await render(<Spin />);
            expect(container.querySelector('[role="status"]')?.getAttribute('aria-label')).toBe('加载中');
        });
        it('accepts a custom accessible name', async () => {
            const { container } = await render(<Spin label="正在同步"/>);
            expect(container.querySelector('[role="status"]')?.getAttribute('aria-label')).toBe('正在同步');
        });
        it('lets a visible tip serve as the accessible name instead of aria-label', async () => {
            const { container } = await render(<Spin tip="正在加载数据"/>);
            const status = container.querySelector('[role="status"]');
            expect(container.textContent).toContain('正在加载数据');
            expect(status?.getAttribute('aria-label')).toBeNull();
        });
        it('renders nothing when not spinning', async () => {
            const { container } = await render(<Spin spinning={false}/>);
            expect(container.querySelector('[role="status"]')).toBeNull();
            expect(container.firstChild).toBeNull();
        });
        it('renders a custom indicator in place of the default ring', async () => {
            const { container } = await render(<Spin indicator={<i data-testid="custom"/>}/>);
            expect(container.querySelector('[data-testid="custom"]')).toBeTruthy();
            expect(container.querySelector('svg')).toBeNull();
        });
        it('hides the default ring from assistive tech', async () => {
            const { container } = await render(<Spin />);
            expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
        });
        it('forwards ref and native props', async () => {
            const ref = createRef<HTMLDivElement>();
            const { container } = await render(<Spin ref={ref} className="custom" data-testid="spin"/>);
            expect(ref.current).toBeInstanceOf(HTMLDivElement);
            expect(container.querySelector('[data-testid="spin"]')?.classList.contains('custom')).toBe(true);
        });
    });
    describe('delay', () => {
        beforeEach(async () => {
            await clock.fake();
        });
        afterEach(async () => {
            await clock.restore();
        });
        it('stays hidden until the delay elapses', async () => {
            const { container } = await render(<Spin delay={300}/>);
            expect(container.querySelector('[role="status"]')).toBeNull();
            await act(async () => {
                await clock.advanceBy(299);
            });
            expect(container.querySelector('[role="status"]')).toBeNull();
            await act(async () => {
                await clock.advanceBy(1);
            });
            expect(container.querySelector('[role="status"]')).toBeTruthy();
        });
        it('never shows a spinner for work that finishes inside the delay window', async () => {
            const { container, rerender } = await render(<Spin delay={300}/>);
            await act(async () => {
                await clock.advanceBy(200);
            });
            await rerender(<Spin delay={300} spinning={false}/>);
            await act(async () => {
                await clock.advanceBy(500);
            });
            expect(container.querySelector('[role="status"]')).toBeNull();
        });
        it('hides immediately once spinning stops, without waiting out the delay', async () => {
            const { container, rerender } = await render(<Spin delay={300}/>);
            await act(async () => {
                await clock.advanceBy(300);
            });
            expect(container.querySelector('[role="status"]')).toBeTruthy();
            await rerender(<Spin delay={300} spinning={false}/>);
            expect(container.querySelector('[role="status"]')).toBeNull();
        });
        it('restarts the delay when spinning resumes', async () => {
            const { container, rerender } = await render(<Spin delay={300} spinning={false}/>);
            await rerender(<Spin delay={300} spinning/>);
            expect(container.querySelector('[role="status"]')).toBeNull();
            await act(async () => {
                await clock.advanceBy(300);
            });
            expect(container.querySelector('[role="status"]')).toBeTruthy();
        });
    });
    describe('wrapper mode', () => {
        it('keeps children mounted and marks the region busy', async () => {
            const { container } = await render(<Spin>
                <button type="button">保存</button>
            </Spin>);
            expect(container.textContent).toContain('保存');
            expect(container.querySelector('[aria-busy="true"]')).toBeTruthy();
            expect(container.querySelector('[role="status"]')).toBeTruthy();
        });
        it('blocks pointer and keyboard access to the masked content via inert', async () => {
            const { container } = await render(<Spin>
                <button type="button">保存</button>
            </Spin>);
            const inertRegion = container.querySelector('[inert]');
            expect(inertRegion).toBeTruthy();
            expect(inertRegion?.contains(container.querySelector('button'))).toBe(true);
        });
        it('restores interactivity when spinning stops', async () => {
            const { container } = await render(<Spin spinning={false}>
                <button type="button">保存</button>
            </Spin>);
            expect(container.querySelector('[inert]')).toBeNull();
            expect(container.querySelector('[role="status"]')).toBeNull();
            expect(container.querySelector('[aria-busy="false"]')).toBeTruthy();
            expect(container.textContent).toContain('保存');
        });
        it('shows the tip above the masked content', async () => {
            const { container } = await render(<Spin tip="正在保存">
                <button type="button">保存</button>
            </Spin>);
            expect(container.textContent).toContain('正在保存');
            expect(container.textContent).toContain('保存');
        });
    });
});
