import { describe, expect, it, render, screen } from "@crab-dev/wake/test/react";
import Empty from '../empty.js';
import type { EmptyProps } from '../types.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe('Empty', () => {
    it('renders with default preset and displays default title', async () => {
        const { container, unmount } = await render(<Empty />);
        expect(container.querySelector('[role="status"]')).toBeTruthy();
        expect(screen.getByText('暂无数据')).toBeTruthy();
        await unmount();
    });
    it('renders search preset with correct default text', async () => {
        const { unmount } = await render(<Empty preset="search"/>);
        expect(screen.getByText('未找到匹配内容')).toBeTruthy();
        expect(screen.getByText('尝试修改关键词或调整筛选条件')).toBeTruthy();
        await unmount();
    });
    it('renders no-permission preset with correct default text', async () => {
        const { unmount } = await render(<Empty preset="no-permission"/>);
        expect(screen.getByText('暂无访问权限')).toBeTruthy();
        expect(screen.getByText('请联系管理员获取相应权限')).toBeTruthy();
        await unmount();
    });
    it('overrides title when title prop is provided', async () => {
        const { unmount } = await render(<Empty title="自定义标题"/>);
        expect(screen.getByText('自定义标题')).toBeTruthy();
        expect(screen.queryByText('暂无数据')).toBeNull();
        await unmount();
    });
    it('overrides description when description prop is provided', async () => {
        const { unmount } = await render(<Empty description="自定义描述"/>);
        expect(screen.getByText('自定义描述')).toBeTruthy();
        expect(screen.queryByText('当前还没有内容，快去添加吧')).toBeNull();
        await unmount();
    });
    it('renders action slot', async () => {
        const { unmount } = await render(<Empty action={<button type="button">立即添加</button>}/>);
        expect(screen.getByRole('button', { name: '立即添加' })).toBeTruthy();
        await unmount();
    });
    it('renders custom image node', async () => {
        const { container, unmount } = await render(<Empty image={<img alt="custom" src="test.png"/>}/>);
        expect(container.querySelector('img[alt="custom"]')).toBeTruthy();
        await unmount();
    });
    it('suppresses title when title is null', async () => {
        const { unmount } = await render(<Empty title={null}/>);
        expect(screen.queryByText('暂无数据')).toBeNull();
        await unmount();
    });
    it('suppresses description when description is null', async () => {
        const { container, unmount } = await render(<Empty title="只有标题" description={null}/>);
        expect(screen.getByText('只有标题')).toBeTruthy();
        expect(container.querySelectorAll('p').length).toBe(1);
        await unmount();
    });
    it('forwards className and data-* attributes', async () => {
        const { container, unmount } = await render(<Empty className="extra-class" {...({ 'data-testid': 'empty-root' } as EmptyProps)}/>);
        const root = container.querySelector('[role="status"]') as HTMLElement;
        expect(root.className).toContain('extra-class');
        expect(root.getAttribute('data-testid')).toBe('empty-root');
        await unmount();
    });
    it('sets aria-label from title string', async () => {
        const { container, unmount } = await render(<Empty title="无结果"/>);
        const root = container.querySelector('[role="status"]') as HTMLElement;
        expect(root.getAttribute('aria-label')).toBe('无结果');
        await unmount();
    });
    it('renders built-in illustration for each preset', async () => {
        const presets: NonNullable<EmptyProps['preset']>[] = [
            'default',
            'search',
            'no-permission',
        ];
        for (const preset of presets) {
            const { container, unmount } = await render(<Empty preset={preset}/>);
            expect(container.querySelector('svg')).toBeTruthy();
            await unmount();
        }
    });
});
