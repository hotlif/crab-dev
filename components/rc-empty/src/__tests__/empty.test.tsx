import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from '@jest/globals';

import Empty from '../empty.js';
import type { EmptyProps } from '../types.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('Empty', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders with default preset and displays default title', () => {
        const { container, unmount } = render(<Empty />);
        expect(container.querySelector('[role="status"]')).toBeTruthy();
        expect(screen.getByText('暂无数据')).toBeTruthy();
        unmount();
    });

    it('renders search preset with correct default text', () => {
        const { unmount } = render(<Empty preset="search" />);
        expect(screen.getByText('未找到匹配内容')).toBeTruthy();
        expect(screen.getByText('尝试修改关键词或调整筛选条件')).toBeTruthy();
        unmount();
    });

    it('renders no-permission preset with correct default text', () => {
        const { unmount } = render(<Empty preset="no-permission" />);
        expect(screen.getByText('暂无访问权限')).toBeTruthy();
        expect(screen.getByText('请联系管理员获取相应权限')).toBeTruthy();
        unmount();
    });

    it('overrides title when title prop is provided', () => {
        const { unmount } = render(<Empty title="自定义标题" />);
        expect(screen.getByText('自定义标题')).toBeTruthy();
        expect(screen.queryByText('暂无数据')).toBeNull();
        unmount();
    });

    it('overrides description when description prop is provided', () => {
        const { unmount } = render(<Empty description="自定义描述" />);
        expect(screen.getByText('自定义描述')).toBeTruthy();
        expect(screen.queryByText('当前还没有内容，快去添加吧')).toBeNull();
        unmount();
    });

    it('renders action slot', () => {
        const { unmount } = render(
            <Empty action={<button type="button">立即添加</button>} />,
        );
        expect(screen.getByRole('button', { name: '立即添加' })).toBeTruthy();
        unmount();
    });

    it('renders custom image node', () => {
        const { container, unmount } = render(
            <Empty image={<img alt="custom" src="test.png" />} />,
        );
        expect(container.querySelector('img[alt="custom"]')).toBeTruthy();
        unmount();
    });

    it('suppresses title when title is null', () => {
        const { unmount } = render(<Empty title={null} />);
        expect(screen.queryByText('暂无数据')).toBeNull();
        unmount();
    });

    it('suppresses description when description is null', () => {
        const { container, unmount } = render(
            <Empty title="只有标题" description={null} />,
        );
        expect(screen.getByText('只有标题')).toBeTruthy();
        expect(container.querySelectorAll('p').length).toBe(1);
        unmount();
    });

    it('forwards className and data-* attributes', () => {
        const { container, unmount } = render(
            <Empty
                className="extra-class"
                {...({ 'data-testid': 'empty-root' } as EmptyProps)}
            />,
        );
        const root = container.querySelector('[role="status"]') as HTMLElement;
        expect(root.className).toContain('extra-class');
        expect(root.getAttribute('data-testid')).toBe('empty-root');
        unmount();
    });

    it('sets aria-label from title string', () => {
        const { container, unmount } = render(<Empty title="无结果" />);
        const root = container.querySelector('[role="status"]') as HTMLElement;
        expect(root.getAttribute('aria-label')).toBe('无结果');
        unmount();
    });

    it('renders built-in illustration for each preset', () => {
        const presets: NonNullable<EmptyProps['preset']>[] = [
            'default',
            'search',
            'no-permission',
        ];
        presets.forEach((preset) => {
            const { container, unmount } = render(<Empty preset={preset} />);
            expect(container.querySelector('svg')).toBeTruthy();
            unmount();
        });
    });
});
