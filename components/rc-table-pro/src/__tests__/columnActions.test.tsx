import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import { createPortal } from 'react-dom';
import { useRef, type ReactNode } from 'react';

// DOM has no layout engine. Preserve the real dropdown state/portal while
// replacing only Floating UI positioning and observer scheduling.
mock.module('@floating-ui/react', () => ({
    useFloating: () => {
        const reference = useRef<HTMLElement | null>(null);
        const floating = useRef<HTMLElement | null>(null);
        return {
            elements: {
                get domReference() { return reference.current; },
                get floating() { return floating.current; },
            },
            refs: {
                reference, domReference: reference, floating,
                setReference: (node: HTMLElement | null) => { reference.current = node; },
                setFloating: (node: HTMLElement | null) => { floating.current = node; },
            },
            floatingStyles: {}, context: {},
        };
    },
    autoUpdate: mock.fn(), offset: mock.fn(), flip: mock.fn(), shift: mock.fn(), size: mock.fn(),
    useDismiss: () => ({}),
    useInteractions: () => ({ getReferenceProps: (props: object) => props, getFloatingProps: (props: object) => props }),
    useFloatingNodeId: () => undefined,
    useFloatingParentNodeId: () => null,
    // This isolated column-command fixture has no nested floating descendants.
    // The real nested branch/Tab behavior is covered by Dropdown's browser suite.
    useFloatingTree: () => null,
    FloatingTree: ({ children }: { children: ReactNode }) => children,
    FloatingNode: ({ children }: { children: ReactNode }) => children,
    FloatingPortal: ({ children, root }: { children: ReactNode; root?: HTMLElement | ShadowRoot | null }) => root === null ? null : createPortal(children, root ?? document.body),
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
    it('keeps keyboard navigation and command focus inside an open shadow root', async () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const container = document.createElement('div');
        root.append(container);
        document.body.append(host);
        const pin = mock.fn();
        const view = await render(<ColumnActions name="customer" label="客户" sortable={false} onPinChange={pin} onSortableChange={mock.fn()} />, { container });
        try {
            const trigger = root.querySelector<HTMLButtonElement>('button')!;
            await fireEvent.click(trigger);
            const panel = root.querySelector<HTMLElement>('[role="group"]')!;
            const buttons = panel.querySelectorAll<HTMLButtonElement>('button');
            expect(root.activeElement).toBe(buttons[0]);
            await fireEvent.keyDown(buttons[0], { key: 'ArrowDown' });
            expect(root.activeElement).toBe(buttons[1]);
            await fireEvent.click(buttons[1]);
            expect(pin).toHaveBeenCalledWith('customer', 'left');
            expect(root.activeElement).toBe(trigger);
            await fireEvent.click(trigger);
            await fireEvent.keyDown(root.activeElement!, { key: 'Escape', composed: true });
            expect(trigger.getAttribute('aria-expanded')).toBe('false');
            expect(root.activeElement).toBe(trigger);
        } finally {
            await view.unmount();
            host.remove();
        }
    });

    it('preserves native trigger activation inside Tree without intercepting tree navigation', async () => {
        const { default: Tree, NodeType, LoadStateType } = treeModule;
        const select = mock.fn();
        await render(<Tree width={320} height={200} selectedKeys={['customer']} onSelectedKeysChange={select} onTreeNodeChange={mock.fn()} treeData={[
            { id: 'customer', title: <ColumnActions name="customer" label="客户" sortable={false} onSortableChange={mock.fn()} />,
                type: NodeType.FILE, loadState: LoadStateType.LOADING_COMPLETED, parent: null, priority: 0 },
            { id: 'next', title: '下一列', type: NodeType.FILE, loadState: LoadStateType.LOADING_COMPLETED, parent: null, priority: 1 },
        ]} />);
        const trigger = screen.getByRole('button', { name: '客户 列操作' });
        for (const key of ['Enter', ' ']) {
            const event = new globalThis.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
            await fireEvent(trigger, event);
            expect(event.defaultPrevented).toBe(false);
        }
        expect(select).not.toHaveBeenCalled();
        await fireEvent.keyDown(trigger, { key: 'ArrowDown' });
        expect(select).toHaveBeenCalledWith(['next'], expect.objectContaining({ reason: 'select' }));
    });

    it('opens a portalled command group, supports arrows and restores focus after selecting or escaping', async () => {
        const pin = mock.fn(), sort = mock.fn();
        await render(<ColumnActions name="customer" label="客户" sortable={false} onPinChange={pin} onSortableChange={sort} />);
        const trigger = screen.getByRole('button', { name: '客户 列操作' });
        await act(async () => { await fireEvent.click(trigger); });
        expect(document.activeElement).toBe(screen.getByRole('button', { name: '启用排序' }));
        expect(trigger.parentElement?.contains(screen.getByRole('group', { name: '客户 列操作' }))).toBe(false);
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
