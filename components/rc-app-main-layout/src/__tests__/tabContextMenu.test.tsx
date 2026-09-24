import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import TabContextMenu from '../tabContextMenu.js';

describe('tab context menu presence', () => {
    it('deactivates while closing and ignores an interrupted exit', async () => {
        const close = mock.fn();
        const complete = mock.fn();
        const select = mock.fn();
        const props = { x: 10, y: 10, onClose: close, onExitComplete: complete, items: [{ id: 'close', label: 'Close tab', onSelect: select }] };
        const view = await render(<TabContextMenu {...props} open />);
        const menu = screen.getByRole('menu');
        const exit = Promise.withResolvers<void>();
        let settled = false;
        Object.defineProperty(menu, 'getAnimations', { value: () => settled ? [] : [{ playState: 'running', finished: exit.promise }] });
        await fireEvent.click(screen.getByRole('menuitem'));
        expect(close).toHaveBeenCalledTimes(1);
        expect(select).toHaveBeenCalledTimes(1);
        await view.rerender(<TabContextMenu {...props} open={false} />);
        expect(menu.hasAttribute('inert')).toBe(true);
        expect(menu.getAttribute('aria-hidden')).toBe('true');
        await view.rerender(<TabContextMenu {...props} open />);
        await act(async () => { settled = true; exit.resolve(); });
        expect(complete).not.toHaveBeenCalled();
        expect(screen.getByRole('menu')).toBe(menu);
        await view.rerender(<TabContextMenu {...props} open={false} />);
        expect(complete).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('menu', { hidden: true })).toBeNull();
    });
});
