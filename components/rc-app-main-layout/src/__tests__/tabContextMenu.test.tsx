import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import TabContextMenu from '../tabContextMenu.js';

describe('tab context menu presence', () => {
    it('keeps command icons outside button labels and reserves missing icon slots', async () => {
        const select = mock.fn();
        await render(<TabContextMenu x={10} y={10} onClose={mock.fn()} items={[
            { id: 'reload', label: 'Reload', icon: <svg viewBox="0 0 16 16"><path d="M2 8h12" /></svg>, onSelect: select },
            { id: 'close', label: 'Close', onSelect: select },
            { id: 'disabled', label: 'Disabled', icon: <svg viewBox="0 0 16 16" />, disabled: true, onSelect: select },
        ]} />);

        const reload = screen.getByRole('menuitem', { name: 'Reload' });
        const close = screen.getByRole('menuitem', { name: 'Close' });
        const disabled = screen.getByRole('menuitem', { name: 'Disabled' });
        // Button's icon and label are sibling slots: putting an icon inside children
        // bypasses the menu row gap and makes short labels drift toward its center.
        const iconSlot = reload.children[1];
        const labelSlot = reload.children[2];
        expect(iconSlot?.getAttribute('aria-hidden')).toBe('true');
        expect(iconSlot?.querySelector('svg')).toBeTruthy();
        expect(iconSlot?.textContent).toBe('');
        expect(labelSlot?.textContent).toBe('Reload');
        expect(labelSlot?.querySelector('svg')).toBeNull();
        expect(close.children[1]?.getAttribute('aria-hidden')).toBe('true');
        expect(close.children[1]?.textContent).toBe('');
        expect(close.children[2]?.textContent).toBe('Close');
        expect(disabled.children[1]?.querySelector('svg')).toBeTruthy();
        await fireEvent.click(disabled);
        expect(select).not.toHaveBeenCalled();
    });

    it('preserves a shadow-root anchor through navigation and focus restoration', async () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const anchor = document.createElement('button');
        root.append(anchor);
        document.body.append(host);
        const close = mock.fn();
        const props = { anchor, x: 10, y: 10, onClose: close, items: [
            { id: 'reload', label: 'Reload', onSelect: mock.fn() },
            { id: 'close', label: 'Close', onSelect: mock.fn() },
        ] };
        const view = await render(<TabContextMenu {...props} />);
        try {
            const menu = root.querySelector<HTMLElement>('[role="menu"]')!;
            const commands = menu.querySelectorAll<HTMLButtonElement>('button');
            expect(root.activeElement).toBe(commands[0]);
            await fireEvent.keyDown(commands[0], { key: 'ArrowDown' });
            expect(root.activeElement).toBe(commands[1]);
            await fireEvent.keyDown(commands[1], { key: 'Escape', composed: true });
            expect(close).toHaveBeenCalledTimes(1);
            await view.rerender(<TabContextMenu {...props} open={false} />);
            expect(root.activeElement).toBe(anchor);
        } finally {
            await view.unmount();
            host.remove();
        }
    });

    it('stays inside its anchor modal, skips disabled commands and restores focus on Escape', async () => {
        const dialog = document.createElement('dialog');
        dialog.open = true;
        const anchor = document.createElement('button');
        dialog.append(anchor);
        document.body.append(dialog);
        anchor.focus();
        const close = mock.fn();
        const props = { anchor, x: 10, y: 10, onClose: close, items: [
            { id: 'reload', label: 'Reload', onSelect: mock.fn() },
            { id: 'disabled', label: 'Disabled', disabled: true, onSelect: mock.fn() },
            { id: 'close', label: 'Close', onSelect: mock.fn() },
        ] };
        const view = await render(<TabContextMenu {...props} />);
        try {
            const menu = screen.getByRole('menu');
            expect(dialog.contains(menu)).toBe(true);
            expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Reload' }));
            await fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
            expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Close' }));
            await fireEvent.keyDown(document.activeElement!, { key: 'Home' });
            expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Reload' }));
            await fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
            expect(close).toHaveBeenCalledTimes(1);
            await view.rerender(<TabContextMenu {...props} open={false} />);
            expect(document.activeElement).toBe(anchor);
        } finally {
            await view.unmount();
            dialog.remove();
        }
    });

    it('keeps its configured design after portaling to body', async () => {
        const props = { x: 10, y: 10, onClose: mock.fn(), items: [{ id: 'close', label: 'Close tab', onSelect: mock.fn() }] };
        const view = await render(<ConfigProvider designSystem="shadcn"><TabContextMenu {...props} /></ConfigProvider>);
        const menu = screen.getByRole('menu');
        const boundary = menu.closest('[data-crab-design]');
        expect(boundary?.parentElement).toBe(document.body);
        expect(boundary?.getAttribute('data-crab-design')).toBe('shadcn');
        await view.rerender(<ConfigProvider designSystem="md3"><TabContextMenu {...props} /></ConfigProvider>);
        expect(boundary?.getAttribute('data-crab-design')).toBe('md3');
    });
    it('deactivates while closing and ignores an interrupted exit', async () => {
        const close = mock.fn();
        const complete = mock.fn();
        const select = mock.fn();
        const props = { x: 10, y: 10, onClose: close, onExitComplete: complete, items: [{ id: 'close', label: 'Close tab', onSelect: select }] };
        const view = await render(<TabContextMenu {...props} open />);
        const menu = screen.getByRole('menu');
        expect(menu.parentElement?.hasAttribute('data-theme')).toBe(false);
        expect(menu.parentElement?.hasAttribute('data-crab-design')).toBe(false);
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
