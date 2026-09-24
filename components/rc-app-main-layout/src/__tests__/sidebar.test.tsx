import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { render, screen, userEvent } from '@crab-dev/wake/test/react';
import { SidebarBody } from '../sidebar.js';

describe('Sidebar logo action', () => {
    it('provides a named native button only when there is an action', async () => {
        const user = userEvent.setup();
        const onLogoClick = mock.fn();
        const { rerender } = await render(<SidebarBody title="工作台首页" onLogoClick={onLogoClick} />);
        const button = screen.getByRole('button', { name: '工作台首页' });
        await user.tab();
        expect(document.activeElement).toBe(button);
        expect(button.tagName).toBe('BUTTON');
        await user.click(button);
        expect(onLogoClick).toHaveBeenCalledTimes(1);

        await rerender(<SidebarBody title="工作台首页" />);
        expect(screen.queryByRole('button', { name: '工作台首页' })).toBeNull();
        expect(screen.getByText('工作台首页')).toBeTruthy();
    });
});
