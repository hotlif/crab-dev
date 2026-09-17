import { describe, expect, it } from '@crab-dev/wake/test';
import { render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Empty from '../empty.js';

describe('Empty global locale', () => {
    it('translates all presets and updates when locale changes', async () => {
        const { rerender } = await render(
            <ConfigProvider locale="en-US">
                <Empty /><Empty preset="search" /><Empty preset="no-permission" />
            </ConfigProvider>,
        );
        expect(screen.getByRole('status', { name: 'No data' })).toBeTruthy();
        expect(screen.getByText('Try different keywords or filters.')).toBeTruthy();
        expect(screen.getByRole('status', { name: 'Access denied' })).toBeTruthy();
        await rerender(<ConfigProvider locale="zh-CN"><Empty /></ConfigProvider>);
        expect(screen.getByRole('status', { name: '暂无数据' })).toBeTruthy();
    });

    it('preserves explicit content and null suppression', async () => {
        await render(<ConfigProvider locale="en-US"><Empty title="自定义" description={null} /></ConfigProvider>);
        expect(screen.getByRole('status', { name: '自定义' })).toBeTruthy();
        expect(screen.queryByText('No data')).toBeNull();
        expect(screen.queryByText('There is no content yet. Add some to get started.')).toBeNull();
    });
});
