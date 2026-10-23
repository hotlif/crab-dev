import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

// DOM has no layout engine. Preserve the real dropdown state/portal while
// replacing only Floating UI positioning and observer scheduling.
mock.module('@floating-ui/react', () => ({
    useFloating: () => ({ refs: { setReference: mock.fn(), setFloating: mock.fn() }, floatingStyles: {}, context: {} }),
    autoUpdate: mock.fn(), offset: mock.fn(), flip: mock.fn(), shift: mock.fn(), size: mock.fn(),
    useDismiss: () => ({}),
    useInteractions: () => ({ getReferenceProps: (props: object) => props, getFloatingProps: (props: object) => props }),
    useFloatingNodeId: () => undefined,
    useFloatingParentNodeId: () => null,
    FloatingTree: ({ children }: { children: ReactNode }) => children,
    FloatingNode: ({ children }: { children: ReactNode }) => children,
    FloatingPortal: ({ children, root }: { children: ReactNode; root?: HTMLElement | null }) => root === null ? null : createPortal(children, root ?? document.body),
}));

let ColumnActions: (typeof import('../columnActions.js'))['default'];
let treeModule: typeof import('@crab-dev/rc-tree');
beforeAll(async () => {
    ColumnActions = (await mock.import<typeof import('../columnActions.js')>('../columnActions.js')).default;
    treeModule = await mock.import<typeof import('@crab-dev/rc-tree')>('@crab-dev/rc-tree');
    if (typeof globalThis.ResizeObserver === 'undefined') globalThis.ResizeObserver = class {
        observe() {} unobserve() {} disconnect() {}
    };
});

describe('Column commands', () => {
    it('preserves native trigger activation inside Tree without intercepting tree navigation', async () => {
        const { default: Tree, NodeType, LoadStateType } = treeModule;
        const select = mock.fn();
        await render(<Tree width={320} height={200} selectKeys={['customer']} onSelect={select} onTreeNodeChange={mock.fn()} treeData={[
            { id: 'customer', title: <ColumnActions name="customer" label="客户" sortable={false} onSortableChange={mock.fn()} />,
                type: NodeType.FILE, loadState: LoadStateType.LOADING_COMPLETED, parent: null, priority: 0 },
            { id: 'next', title: '下一列', type: NodeType.FILE, loadState: LoadStateType.LOADING_COMPLETED, parent: null, priority: 1 },
        ]} />);
        const trigger = screen.getByRole('button', { name: '客户列操作' });
        for (const key of ['Enter', ' ']) {
            const event = new globalThis.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
            await fireEvent(trigger, event);
            expect(event.defaultPrevented).toBe(false);
        }
        expect(select).not.toHaveBeenCalled();
        await fireEvent.keyDown(trigger, { key: 'ArrowDown' });
        expect(select).toHaveBeenCalledWith(expect.objectContaining({ selectKeys: ['next'] }));
    });

    it('opens a portalled command group, supports arrows and restores focus after selecting or escaping', async () => {
        const pin = mock.fn(), sort = mock.fn();
        await render(<ColumnActions name="customer" label="客户" sortable={false} onPinChange={pin} onSortableChange={sort} />);
        const trigger = screen.getByRole('button', { name: '客户列操作' });
        await act(async () => { await fireEvent.click(trigger); });
        expect(document.activeElement).toBe(screen.getByRole('button', { name: '启用排序' }));
        expect(trigger.parentElement?.contains(screen.getByRole('group', { name: '客户列操作' }))).toBe(false);
        await fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
        expect(document.activeElement).toBe(screen.getByRole('button', { name: '固定到左侧' }));
        await act(async () => { await fireEvent.click(document.activeElement!); });
        expect(pin).toHaveBeenCalledWith('customer', 'left');
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(trigger);
        await act(async () => { await fireEvent.click(trigger); });
        await fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(trigger);
        expect(sort).not.toHaveBeenCalled();
    });
});
