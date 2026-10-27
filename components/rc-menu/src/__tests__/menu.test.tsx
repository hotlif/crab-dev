import { afterEach, beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import { type ReactNode, type Key, type MouseEvent as ReactMouseEvent, useRef } from "react";
import type { MenuOpenKeysChangeDetails, MenuSelectionChangeDetails } from '../menu.js';
import { registerOverlayLayer } from '@crab-dev/rc-hooks/internal';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
let mockFloatingCloseHandler: (() => void) | undefined;
let mockFloatingEmit = mock.fn();
let mockFloatingParentId: string | null = null;
let mockFloatingForceOpen = false;
let mockFloatingOnOpenChange: ((value: boolean) => void) | undefined;
const floatingRequests = new Map<HTMLElement, (value: boolean, event?: Event, reason?: string) => void>();
mock.module("@floating-ui/react", () => ({
    FloatingTree: ({ children }: {
        children?: ReactNode;
    }) => <>{children}</>,
    FloatingNode: ({ children }: {
        children?: ReactNode;
    }) => <>{children}</>,
    useFloatingNodeId: () => "node-id",
    useFloatingTree: () => ({
        events: {
            emit: mockFloatingEmit,
            on: mock.fn((event: string, handler: () => void) => {
                if (event === "close") {
                    mockFloatingCloseHandler = handler;
                }
            }),
            off: mock.fn(),
        },
    }),
    useFloatingParentNodeId: () => mockFloatingParentId,
    useFloating: (options: {
        open?: boolean;
        onOpenChange?: (value: boolean, event?: Event, reason?: string) => void;
    }) => {
        const reference = useRef<HTMLElement | null>(null);
        const floating = useRef<HTMLElement | null>(null);
        mockFloatingOnOpenChange = options.onOpenChange;
        if (mockFloatingForceOpen) {
            // Do not call onOpenChange asynchronously here;
            // tests trigger it within act to avoid React warnings.
        }
        return {
            refs: {
                setReference: (node: HTMLElement | null) => {
                    if (reference.current) floatingRequests.delete(reference.current);
                    reference.current = node;
                    if (node && options.onOpenChange) floatingRequests.set(node, options.onOpenChange);
                },
                setFloating: (node: HTMLElement | null) => { floating.current = node; },
                domReference: reference,
                floating,
            },
            floatingStyles: {},
            context: options,
        };
    },
    useHover: (context: { onOpenChange?: (value: boolean, event?: Event, reason?: string) => void }) => ({
        onMouseEnter: (event: ReactMouseEvent<HTMLElement>) => context.onOpenChange?.(true, event.nativeEvent, 'hover'),
        onMouseLeave: (event: ReactMouseEvent<HTMLElement>) => context.onOpenChange?.(false, event.nativeEvent, 'hover'),
    }),
    useDismiss: () => ({}),
    useInteractions: (interactions: Record<string, unknown>[]) => ({
        getReferenceProps: (props = {}) => Object.assign({}, ...interactions, props),
        getFloatingProps: (props = {}) => props,
    }),
    offset: mock.fn(() => ({})),
    flip: mock.fn(() => ({})),
    shift: mock.fn(() => ({})),
    safePolygon: mock.fn(() => mock.fn()),
    autoUpdate: mock.fn(),
}));
let Menu: (typeof import("../menu.js"))["default"];
let ItemType: (typeof import("../type.js"))["ItemType"];
beforeAll(async () => {
    const menuModule = await mock.import<typeof import("../menu.js")>("../menu.js");
    const typeModule = await mock.import<typeof import("../type.js")>("../type.js");
    Menu = menuModule.default;
    ItemType = typeModule.ItemType;
});
afterEach(() => {
    mockFloatingCloseHandler = undefined;
    mockFloatingEmit = mock.fn();
    mockFloatingParentId = null;
    mockFloatingForceOpen = false;
    mockFloatingOnOpenChange = undefined;
    floatingRequests.clear();
});
describe("Menu", () => {
    it('preserves the actual click event in expansion and collapse details', async () => {
        const requests: { keys: Key[]; details: MenuOpenKeysChangeDetails }[] = [];
        const onOpenKeysChange = mock.fn((keys: Key[], details: MenuOpenKeysChangeDetails) => { requests.push({ keys, details }); });
        await render(<Menu onOpenKeysChange={onOpenKeysChange} items={[
            { type: ItemType.Item, key: 'parent', title: 'Event parent', children: [{ type: ItemType.Item, key: 'child', title: 'Event child' }] },
        ]} />);
        const parent = screen.getByRole('button', { name: 'Event parent' });
        for (const reason of ['expand', 'collapse'] as const) {
            const event = new MouseEvent('click', { bubbles: true, cancelable: true });
            await fireEvent(parent, event);
            const request = requests.at(-1)!;
            expect(request.keys).toEqual(reason === 'expand' ? ['parent'] : []);
            expect(request.details.reason).toBe(reason);
            expect(request.details.item.key).toBe('parent');
            const actual = request.details.event;
            expect(actual && 'nativeEvent' in actual ? actual.nativeEvent : actual).toBe(event);
        }
        expect(onOpenKeysChange).toHaveBeenCalledTimes(2);
    });

    it('mirrors the horizontal menu arrow keys in right-to-left direction', async () => {
        await render(<Menu mode="horizontal" dir="rtl" items={[{ type: ItemType.Item, key: 'a', title: 'First RTL' }, { type: ItemType.Item, key: 'b', title: 'Second RTL' }]} />);
        const first = screen.getByText('First RTL').closest<HTMLElement>('[data-menu-item]')!;
        const second = screen.getByText('Second RTL').closest<HTMLElement>('[data-menu-item]')!;
        first.focus();
        await fireEvent.keyDown(first, { key: 'ArrowLeft' });
        expect(document.activeElement).toBe(second);
        await fireEvent.keyDown(second, { key: 'ArrowRight' });
        expect(document.activeElement).toBe(first);
    });
    it('preserves supplied key arrays and reports the requested next expansion', async () => {
        const openKeys: Key[] = [];
        Object.freeze(openKeys);
        const onOpenKeysChange = mock.fn();
        await render(<Menu openKeys={openKeys} onOpenKeysChange={onOpenKeysChange} items={[{ type: ItemType.Item, key: 'parent', title: 'Immutable parent', children: [{ type: ItemType.Item, key: 'child', title: 'Child' }] }]} />);
        await fireEvent.click(screen.getByText('Immutable parent'));
        expect(openKeys).toEqual([]);
        expect(onOpenKeysChange).toHaveBeenCalledWith(['parent'], expect.objectContaining({ reason: 'expand' }));
    });
    it("renders vertical menu and triggers callbacks on item click", async () => {
        const onClick = mock.fn();
        const onSelectedKeysChange = mock.fn();
        const onOpenKeysChange = mock.fn();
        const openKeys: Key[] = [];
        await render(<Menu mode="vertical" items={[
            {
                type: ItemType.Item,
                key: "parent",
                title: "Parent",
                children: [
                    {
                        type: ItemType.Item,
                        key: "child",
                        title: "Child",
                    },
                ],
            },
        ]} openKeys={openKeys} onClick={onClick} onSelectedKeysChange={onSelectedKeysChange} onOpenKeysChange={onOpenKeysChange}/>);
        const parentTitle = screen.getByText("Parent");
        await act(async () => {
            await fireEvent.click(parentTitle);
        });
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith(expect.objectContaining({
            item: expect.objectContaining({ key: "parent", title: "Parent" }),
        }));
        expect(onSelectedKeysChange).toHaveBeenCalledTimes(1);
        expect(onSelectedKeysChange).toHaveBeenCalledWith(["parent"], expect.objectContaining({ item: expect.objectContaining({ key: "parent" }) }));
        expect(onOpenKeysChange).toHaveBeenCalledTimes(1);
        expect(onOpenKeysChange).toHaveBeenCalledWith(["parent"], expect.objectContaining({ reason: expect.any(String) }));
    });
    it("renders horizontal menu items", async () => {
        await render(<Menu mode="horizontal" items={[
            {
                type: ItemType.Item,
                key: "home",
                title: "Home",
            },
            {
                type: ItemType.ItemGroup,
                key: "group-no-icon",
                title: "Group No Icon",
            },
            {
                type: ItemType.ItemGroup,
                key: "group",
                title: "Group",
                icon: <span data-testid="group-icon"/>,
                children: [
                    {
                        type: ItemType.Item,
                        key: "about",
                        title: "About",
                    },
                ],
            },
        ]}/>);
        expect(screen.getByText("Home")).toBeTruthy();
        expect(screen.getByText("Group No Icon")).toBeTruthy();
        expect(screen.getByText("Group")).toBeTruthy();
        expect(screen.getByText("About")).toBeTruthy();
        expect(screen.getByTestId("group-icon")).toBeTruthy();
    });
    it("renders horizontal menu with default props", async () => {
        await render(<Menu mode="horizontal"/>);
        expect(screen.getByRole("list")).toBeTruthy();
    });
    it("uses vertical mode by default when mode is omitted", async () => {
        await render(<Menu items={[
            {
                type: ItemType.Item,
                key: "default-mode-item",
                title: "Default Mode Item",
            },
        ]}/>);
        expect(screen.getByText("Default Mode Item")).toBeTruthy();
    });
    it("renders vertical menu with default empty items", async () => {
        await render(<Menu mode="vertical"/>);
        expect(screen.getByRole("list")).toBeTruthy();
    });
    it("throws when mode is unsupported", async () => {
        const renderInvalidMode = async () => {
            await render(<Menu mode={"invalid" as unknown as "vertical"} items={[]}/>);
        };
        await expect(renderInvalidMode()).rejects.toThrow("The parameter `mode` is incorrect");
    });
    it("throws when item type is invalid", async () => {
        const renderInvalidType = async () => {
            await render(<Menu mode="vertical" items={[
                {
                    type: 999 as never,
                    key: "invalid",
                    title: "Invalid",
                },
            ]}/>);
        };
        await expect(renderInvalidType()).rejects.toThrow("The parameter `type` is incorrect");
    });
    it("throws in horizontal mode when item type is invalid", async () => {
        const renderInvalidType = async () => {
            await render(<Menu mode="horizontal" items={[
                {
                    type: 999 as never,
                    key: "invalid-horizontal",
                    title: "Invalid Horizontal",
                },
            ]}/>);
        };
        await expect(renderInvalidType()).rejects.toThrow("The parameter `type` is incorrect");
    });
    it("covers vertical item group branch and open icon state", async () => {
        const onSelectedKeysChange = mock.fn();
        const onOpenKeysChange = mock.fn();
        const openKeys: Key[] = ["open-parent", "toggle-item", "group-parent"];
        await render(<Menu mode="vertical" openKeys={openKeys} selectedKeys={["toggle-item"]} onSelectedKeysChange={onSelectedKeysChange} onOpenKeysChange={onOpenKeysChange} items={[
            {
                type: ItemType.Item,
                key: "open-parent",
                title: "Open Parent",
                icon: <span data-testid="open-parent-icon"/>,
                children: [
                    {
                        type: ItemType.Item,
                        key: "open-child",
                        title: "Open Child",
                    },
                ],
            },
            {
                type: ItemType.Item,
                key: "toggle-item",
                title: "Toggle Item",
            },
            {
                type: ItemType.ItemGroup,
                key: "group-empty",
                title: "Group Empty",
            },
            {
                type: ItemType.ItemGroup,
                key: "group-parent",
                title: "Group Parent",
                icon: <span data-testid="group-parent-icon"/>,
                children: [
                    {
                        type: ItemType.Item,
                        key: "group-child",
                        title: "Group Child",
                    },
                ],
            },
        ]}/>);
        await act(async () => {
            await fireEvent.click(screen.getByText("Group Parent"));
        });
        await act(async () => {
            await fireEvent.click(screen.getByText("Toggle Item"));
        });
        expect(onSelectedKeysChange).toHaveBeenCalledWith(["group-parent"], expect.objectContaining({ item: expect.objectContaining({ key: "group-parent" }) }));
        expect(onOpenKeysChange).not.toHaveBeenCalled();
        expect(screen.getByText("Group Empty")).toBeTruthy();
        expect(screen.getByText("Group Child")).toBeTruthy();
        expect(screen.getByTestId("open-parent-icon")).toBeTruthy();
        expect(screen.getByTestId("group-parent-icon")).toBeTruthy();
    });
    it('keeps horizontal expansion controlled and does not notify on external synchronization', async () => {
        const changes: { keys: Key[]; details: MenuOpenKeysChangeDetails }[] = [];
        const onOpenKeysChange = mock.fn((keys: Key[], details: MenuOpenKeysChangeDetails) => { changes.push({ keys, details }); });
        const items = [{ type: ItemType.Item, key: 'parent', title: 'Controlled parent', children: [{ type: ItemType.Item, key: 'child', title: 'Controlled child' }] }];
        const keys: Key[] = [];
        Object.freeze(keys);
        const view = await render(<Menu mode="horizontal" openKeys={keys} onOpenKeysChange={onOpenKeysChange} items={items} />);
        const parent = screen.getByRole('button', { name: 'Controlled parent' });
        const event = new MouseEvent('click', { bubbles: true });
        await fireEvent(parent, event);
        expect(parent.getAttribute('aria-expanded')).toBe('false');
        expect(screen.queryByRole('button', { name: 'Controlled child' })).toBe(null);
        expect(changes[0].keys).toEqual(['parent']);
        const detailEvent = changes[0].details.event;
        expect(detailEvent && 'nativeEvent' in detailEvent ? detailEvent.nativeEvent : detailEvent).toBe(event);
        expect(keys).toEqual([]);
        await view.rerender(<Menu mode="horizontal" openKeys={['parent']} onOpenKeysChange={onOpenKeysChange} items={items} />);
        expect(parent.getAttribute('aria-expanded')).toBe('true');
        expect(screen.getByRole('button', { name: 'Controlled child' })).toBeTruthy();
        await view.rerender(<Menu mode="horizontal" openKeys={[]} onOpenKeysChange={onOpenKeysChange} items={items} />);
        expect(parent.getAttribute('aria-expanded')).toBe('false');
        expect(onOpenKeysChange).toHaveBeenCalledTimes(1);
    });

    it('initializes horizontal defaultOpenKeys once and preserves long accessible names', async () => {
        let collapseEvent: MenuOpenKeysChangeDetails['event'];
        const onOpenKeysChange = mock.fn((_keys: Key[], details: MenuOpenKeysChangeDetails) => { collapseEvent = details.event; });
        const title = '需要完整可访问名称并在窄屏收缩的很长中文导航标题';
        const items = [{ type: ItemType.Item, key: 'parent', title, children: [{ type: ItemType.Item, key: 'child', title: 'Default child' }] }];
        const view = await render(<Menu mode="horizontal" defaultOpenKeys={['parent']} onOpenKeysChange={onOpenKeysChange} items={items} />);
        expect(screen.getByRole('button', { name: title }).getAttribute('aria-expanded')).toBe('true');
        expect(screen.getByText(title).getAttribute('title')).toBe(title);
        await view.rerender(<Menu mode="horizontal" defaultOpenKeys={[]} onOpenKeysChange={onOpenKeysChange} items={items} />);
        expect(screen.getByRole('button', { name: title }).getAttribute('aria-expanded')).toBe('true');
        expect(onOpenKeysChange).not.toHaveBeenCalled();
        const event = new MouseEvent('click', { bubbles: true });
        await fireEvent(screen.getByRole('button', { name: title }), event);
        expect(screen.queryByRole('button', { name: 'Default child' })).toBe(null);
        expect(onOpenKeysChange).toHaveBeenCalledWith([], expect.objectContaining({ reason: 'collapse' }));
        expect(collapseEvent && 'nativeEvent' in collapseEvent ? collapseEvent.nativeEvent : collapseEvent).toBe(event);
    });

    it('collapses only the top nested horizontal layer per Escape and restores its trigger', async () => {
        const events: MenuOpenKeysChangeDetails[] = [];
        const onOpenKeysChange = mock.fn((_keys: Key[], details: MenuOpenKeysChangeDetails) => { events.push(details); });
        await render(<Menu mode="horizontal" defaultOpenKeys={['parent', 'nested']} onOpenKeysChange={onOpenKeysChange} items={[
            { type: ItemType.Item, key: 'parent', title: 'Nested parent', children: [
                { type: ItemType.Item, key: 'nested', title: 'Nested trigger', children: [{ type: ItemType.Item, key: 'leaf', title: 'Nested leaf' }] },
            ] },
        ]} />);
        const parent = screen.getByRole('button', { name: 'Nested parent' });
        const nested = screen.getByRole('button', { name: 'Nested trigger' });
        const leaf = screen.getByRole('button', { name: 'Nested leaf' });
        leaf.focus();
        const first = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
        await fireEvent(leaf, first);
        expect(parent.getAttribute('aria-expanded')).toBe('true');
        expect(nested.getAttribute('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(nested);
        expect(events[0].event).toBe(first);
        const second = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
        await fireEvent(nested, second);
        expect(parent.getAttribute('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(parent);
        expect(events[1].event).toBe(second);
        expect(onOpenKeysChange).toHaveBeenCalledTimes(2);
    });

    it('merges native sibling dismissals into one collection request with the original event', async () => {
        const onOpenKeysChange = mock.fn();
        await render(<Menu mode="horizontal" defaultOpenKeys={['a', 'b']} onOpenKeysChange={onOpenKeysChange} items={['a', 'b'].map(key => ({
            type: ItemType.Item, key, title: key, children: [{ type: ItemType.Item, key: key + '-leaf', title: key + ' leaf' }],
        }))} />);
        const event = new MouseEvent('pointerdown', { bubbles: true });
        const requests = [...floatingRequests.values()];
        await act(async () => {
            requests.forEach(request => request(false, event, 'outside-press'));
            await new Promise<void>(resolve => setTimeout(resolve, 0));
        });
        expect(onOpenKeysChange).toHaveBeenCalledTimes(1);
        expect(onOpenKeysChange).toHaveBeenCalledWith([], expect.objectContaining({ reason: 'collapse', event }));
        expect(screen.getByRole('button', { name: 'a' }).getAttribute('aria-expanded')).toBe('false');
        expect(screen.getByRole('button', { name: 'b' }).getAttribute('aria-expanded')).toBe('false');
    });

    it('merges nested hover removals without reopening keys from an earlier render', async () => {
        const onOpenKeysChange = mock.fn();
        await render(<Menu mode="horizontal" defaultOpenKeys={['parent', 'nested']} onOpenKeysChange={onOpenKeysChange} items={[
            { type: ItemType.Item, key: 'parent', title: 'Hover parent', children: [
                { type: ItemType.Item, key: 'nested', title: 'Hover nested', children: [{ type: ItemType.Item, key: 'leaf', title: 'Hover leaf' }] },
            ] },
        ]} />);
        const parent = screen.getByRole('button', { name: 'Hover parent' }).closest('li')!;
        const nested = screen.getByRole('button', { name: 'Hover nested' }).closest('li')!;
        const event = new MouseEvent('mouseleave', { bubbles: true });
        const parentRequest = floatingRequests.get(parent)!;
        const childRequest = floatingRequests.get(nested)!;
        await act(async () => {
            parentRequest(false, event, 'hover');
            childRequest(false, event, 'hover');
            await new Promise<void>(resolve => setTimeout(resolve, 0));
        });
        expect(onOpenKeysChange).toHaveBeenCalledTimes(1);
        expect(onOpenKeysChange).toHaveBeenCalledWith([], expect.objectContaining({ reason: 'collapse', event }));
        expect(screen.queryByRole('button', { name: 'Hover nested' })).toBe(null);
    });

    it('notifies once when a refused native dismissal is forwarded across microtasks and later callbacks', async () => {
        for (const mode of ['horizontal', 'inline'] as const) {
            const changes: { keys: Key[]; details: MenuOpenKeysChangeDetails }[] = [];
            const view = await render(<Menu mode={mode} inlineCollapsed={mode === 'inline'} openKeys={['parent', 'sibling']} onOpenKeysChange={(keys, details) => { changes.push({ keys, details }); }} items={[
                { type: ItemType.Item, key: 'parent', title: 'Repeated parent', children: [{ type: ItemType.Item, key: 'child', title: 'Repeated child' }] },
                { type: ItemType.Item, key: 'sibling', title: 'Repeated sibling', children: [{ type: ItemType.Item, key: 'other', title: 'Repeated other' }] },
            ]} />);
            const parent = screen.getByRole(mode === 'horizontal' ? 'button' : 'menuitem', { name: 'Repeated parent' });
            const request = floatingRequests.get(parent.closest('li')!)!;
            const event = new MouseEvent('mouseleave', { bubbles: true });
            await act(async () => {
                request(false, event, 'hover');
                await Promise.resolve();
                request(false, event, 'hover');
                await new Promise<void>(resolve => setTimeout(resolve, 0));
            });
            expect(changes).toHaveLength(1);
            expect(changes[0].keys).toEqual(['sibling']);
            expect(changes[0].details.event).toBe(event);
            expect(parent.getAttribute('aria-expanded')).toBe('true');
            await act(async () => {
                request(false, event, 'hover');
                await new Promise<void>(resolve => setTimeout(resolve, 0));
            });
            expect(changes).toHaveLength(1);
            const nextEvent = new MouseEvent('mouseleave', { bubbles: true });
            await act(async () => {
                request(false, nextEvent, 'hover');
                await new Promise<void>(resolve => setTimeout(resolve, 0));
            });
            expect(changes).toHaveLength(2);
            expect(changes[1].details.event).toBe(nextEvent);
            expect(changes[1].keys).toEqual(['sibling']);
            await view.unmount();
        }
    });

    it('merges different branches forwarded by one native event in later microtasks before notifying', async () => {
        for (const mode of ['horizontal', 'inline'] as const) {
            const onOpenKeysChange = mock.fn();
            const view = await render(<Menu mode={mode} inlineCollapsed={mode === 'inline'} openKeys={['parent', 'nested', 'sibling']} onOpenKeysChange={onOpenKeysChange} items={[
                { type: ItemType.Item, key: 'parent', title: 'Delayed parent', children: [
                    { type: ItemType.Item, key: 'nested', title: 'Delayed nested', children: [{ type: ItemType.Item, key: 'child', title: 'Delayed child' }] },
                ] },
                { type: ItemType.Item, key: 'sibling', title: 'Delayed sibling', children: [{ type: ItemType.Item, key: 'other', title: 'Delayed other' }] },
            ]} />);
            const role = mode === 'horizontal' ? 'button' : 'menuitem';
            const parentRequest = floatingRequests.get(screen.getByRole(role, { name: 'Delayed parent' }).closest('li')!)!;
            const siblingRequest = floatingRequests.get(screen.getByRole(role, { name: 'Delayed sibling' }).closest('li')!)!;
            const event = new MouseEvent('mouseleave', { bubbles: true });
            await act(async () => {
                if (mode === 'horizontal') {
                    floatingRequests.get(screen.getByRole('button', { name: 'Delayed nested' }).closest('li')!)!(false, event, 'hover');
                    await Promise.resolve();
                }
                parentRequest(false, event, 'hover');
                await Promise.resolve();
                siblingRequest(false, event, 'hover');
                await new Promise<void>(resolve => setTimeout(resolve, 0));
            });
            expect(onOpenKeysChange).toHaveBeenCalledTimes(1);
            expect(onOpenKeysChange).toHaveBeenCalledWith([], expect.objectContaining({ reason: 'collapse', event }));
            expect(screen.getByRole(role, { name: 'Delayed parent' }).getAttribute('aria-expanded')).toBe('true');
            await view.unmount();
        }
    });

    it('cancels pending native dismissals when the menu is unmounted', async () => {
        const onOpenKeysChange = mock.fn();
        const view = await render(<Menu mode="horizontal" openKeys={['parent']} onOpenKeysChange={onOpenKeysChange} items={[
            { type: ItemType.Item, key: 'parent', title: 'Unmount parent', children: [{ type: ItemType.Item, key: 'child', title: 'Unmount child' }] },
        ]} />);
        const request = floatingRequests.get(screen.getByRole('button', { name: 'Unmount parent' }).closest('li')!)!;
        await act(async () => { request(false, new MouseEvent('mouseleave'), 'hover'); });
        await view.unmount();
        await new Promise<void>(resolve => setTimeout(resolve, 0));
        expect(onOpenKeysChange).not.toHaveBeenCalled();
    });

    it('closes all horizontal branches once after leaf selection and preserves focus', async () => {
        const onOpenKeysChange = mock.fn();
        const onClick = mock.fn();
        await render(<Menu mode="horizontal" defaultOpenKeys={['parent', 'nested']} onOpenKeysChange={onOpenKeysChange} onClick={onClick} items={[
            { type: ItemType.Item, key: 'parent', title: 'Selection parent', icon: <span data-testid="selection-icon" />, children: [
                { type: ItemType.Item, key: 'nested', title: 'Selection nested', children: [{ type: ItemType.Item, key: 'leaf', title: 'Selection leaf' }] },
            ] },
        ]} />);
        const parent = screen.getByRole('button', { name: 'Selection parent' });
        const leaf = screen.getByRole('button', { name: 'Selection leaf' });
        leaf.focus();
        await fireEvent.click(leaf);
        expect(screen.getByTestId('selection-icon')).toBeTruthy();
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onOpenKeysChange).toHaveBeenCalledTimes(1);
        expect(onOpenKeysChange).toHaveBeenCalledWith([], expect.objectContaining({ reason: 'collapse', item: expect.objectContaining({ key: 'leaf' }) }));
        expect(document.activeElement).toBe(parent);
    });
    it('preserves the real activation key in horizontal semantic details and honors cancellation', async () => {
        let cancel = true;
        const openEvents: MenuOpenKeysChangeDetails[] = [];
        const selectionEvents: MenuSelectionChangeDetails[] = [];
        const onClick = mock.fn();
        await render(<Menu mode="horizontal" onClick={onClick}
            onKeyDown={event => { if (cancel) event.preventDefault(); }}
            onOpenKeysChange={(_keys, details) => { openEvents.push(details); }}
            onSelectedKeysChange={(_keys, details) => { selectionEvents.push(details); }}
            items={[{ type: ItemType.Item, key: 'parent', title: 'Key parent', children: [{ type: ItemType.Item, key: 'child', title: 'Key child' }] }]} />);
        const parent = screen.getByRole('button', { name: 'Key parent' });
        await fireEvent.keyDown(parent, { key: 'Enter' });
        expect(openEvents).toHaveLength(0);
        expect(onClick).not.toHaveBeenCalled();
        cancel = false;
        for (const key of ['Enter', ' ']) {
            const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
            await fireEvent(parent, event);
            const detailEvent = openEvents.at(-1)!.event;
            expect(detailEvent?.type).toBe('keydown');
            expect(detailEvent && 'nativeEvent' in detailEvent ? detailEvent.nativeEvent : detailEvent).toBe(event);
            expect(selectionEvents.at(-1)?.event?.nativeEvent).toBe(event);
        }
        expect(openEvents).toHaveLength(2);
        expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('restores an accepted horizontal Escape inside an open ShadowRoot', async () => {
        const host = document.createElement('div');
        const shadow = host.attachShadow({ mode: 'open' });
        const container = document.createElement('div');
        shadow.append(container);
        document.body.append(host);
        try {
            await render(<Menu mode="horizontal" defaultOpenKeys={['parent']} items={[
                { type: ItemType.Item, key: 'parent', title: 'Shadow parent', children: [{ type: ItemType.Item, key: 'child', title: 'Shadow child' }] },
            ]} />, { container });
            const [parent, child] = [...container.querySelectorAll<HTMLElement>('[data-menu-item]')];
            child.focus();
            await fireEvent(child, new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true, composed: true }));
            expect(parent.getAttribute('aria-expanded')).toBe('false');
            expect(shadow.activeElement).toBe(parent);
        } finally { host.remove(); }
    });

    it('keeps ShadowRoot leaf focus on a refused close and restores it only after acceptance', async () => {
        const host = document.createElement('div');
        const shadow = host.attachShadow({ mode: 'open' });
        const container = document.createElement('div');
        shadow.append(container);
        document.body.append(host);
        const onOpenKeysChange = mock.fn();
        const items = [{ type: ItemType.Item, key: 'parent', title: 'Shadow selection parent', children: [{ type: ItemType.Item, key: 'child', title: 'Shadow selection child' }] }];
        try {
            const view = await render(<Menu mode="horizontal" openKeys={['parent']} onOpenKeysChange={onOpenKeysChange} items={items} />, { container });
            const [parent, child] = [...container.querySelectorAll<HTMLElement>('[data-menu-item]')];
            child.focus();
            await fireEvent.click(child);
            expect(shadow.activeElement).toBe(child);
            expect(onOpenKeysChange).toHaveBeenCalledTimes(1);
            await view.rerender(<Menu mode="horizontal" openKeys={[]} onOpenKeysChange={onOpenKeysChange} items={items} />);
            expect(shadow.activeElement).toBe(parent);
            expect(onOpenKeysChange).toHaveBeenCalledTimes(1);
        } finally { host.remove(); }
    });

    it('keeps an inside sibling leaf mounted until its actual selection click', async () => {
        const onSelectedKeysChange = mock.fn();
        const onOpenKeysChange = mock.fn();
        await render(<Menu mode="horizontal" defaultOpenKeys={['a', 'b']} onOpenKeysChange={onOpenKeysChange} onSelectedKeysChange={onSelectedKeysChange} items={['a', 'b'].map(key => ({
            type: ItemType.Item, key, title: key + ' sibling', children: [{ type: ItemType.Item, key: key + '-leaf', title: key + ' sibling leaf' }],
        }))} />);
        const first = screen.getByRole('button', { name: 'a sibling' }).closest('li')!;
        const leaf = screen.getByRole('button', { name: 'b sibling leaf' });
        const dismissFirst = floatingRequests.get(first)!;
        const listener = (event: Event) => dismissFirst(false, event, 'outside-press');
        document.addEventListener('pointerdown', listener);
        try { await fireEvent(leaf, new MouseEvent('pointerdown', { bubbles: true, composed: true })); }
        finally { document.removeEventListener('pointerdown', listener); }
        await act(async () => { await new Promise<void>(resolve => setTimeout(resolve, 0)); });
        expect(leaf.isConnected).toBe(true);
        expect(screen.getByRole('button', { name: 'b sibling' }).getAttribute('aria-expanded')).toBe('true');
        expect(onOpenKeysChange).toHaveBeenCalledWith(['b'], expect.objectContaining({ reason: 'collapse' }));
        await fireEvent.click(leaf);
        expect(onSelectedKeysChange).toHaveBeenCalledWith(['b-leaf'], expect.objectContaining({ reason: 'select' }));
    });

    it('does not reclaim external focus after a horizontal leaf callback moves it', async () => {
        const external = document.createElement('button');
        external.textContent = 'External action';
        document.body.append(external);
        try {
            await render(<Menu mode="horizontal" defaultOpenKeys={['parent']} onClick={() => external.focus()} items={[
                { type: ItemType.Item, key: 'parent', title: 'Focus parent', children: [{ type: ItemType.Item, key: 'child', title: 'Focus child' }] },
            ]} />);
            const child = screen.getByRole('button', { name: 'Focus child' });
            child.focus();
            await fireEvent.click(child);
            expect(document.activeElement).toBe(external);
        } finally { external.remove(); }
    });

    it("supports layout-matched keyboard navigation and activation", async () => {
        const onClick = mock.fn();
        const items = ['One', 'Two', 'Three'].map(title => ({ type: ItemType.Item, key: title, title }));
        const view = await render(<Menu items={items} onClick={onClick} selectedKeys={['Two']}/>);
        const one = screen.getByRole('button', { name: 'One' });
        const two = screen.getByRole('button', { name: 'Two' });
        await fireEvent.keyDown(one, { key: 'ArrowDown' });
        expect(document.activeElement).toBe(two);
        expect(two.getAttribute('aria-current')).toBe('page');
        await fireEvent.keyDown(two, { key: ' ' });
        expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ item: expect.objectContaining({ key: 'Two' }) }));
        await view.rerender(<Menu mode="horizontal" items={items} onClick={onClick}/>);
        await fireEvent.keyDown(screen.getByRole('button', { name: 'One' }), { key: 'ArrowRight' });
        expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Two' }));
        await fireEvent.keyDown(document.activeElement!, { key: 'End' });
        expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Three' }));
        await fireEvent.keyDown(document.activeElement!, { key: 'Enter' });
        expect(onClick).toHaveBeenCalledTimes(2);
    });
    it("opens a horizontal disclosure with the keyboard and restores focus on Escape", async () => {
        await render(<Menu mode="horizontal" items={[{ type: ItemType.Item, key: 'parent', title: 'Parent', children: [{ type: ItemType.Item, key: 'child', title: 'Child' }] }]}/>);
        const parent = screen.getByRole('button', { name: 'Parent' });
        await fireEvent.keyDown(parent, { key: 'Enter' });
        expect(parent.getAttribute('aria-expanded')).toBe('true');
        const child = screen.getByRole('button', { name: 'Child' });
        expect(document.getElementById(parent.getAttribute('aria-controls')!)).toBeTruthy();
        await fireEvent.keyDown(child, { key: 'Escape' });
        expect(parent.getAttribute('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(parent);
    });
    it('controls collapsed submenu requests and keeps external updates silent', async () => {
        const changes: { keys: Key[]; details: MenuOpenKeysChangeDetails }[] = [];
        const onOpenKeysChange = mock.fn((keys: Key[], details: MenuOpenKeysChangeDetails) => { changes.push({ keys, details }); });
        const items = [{ type: ItemType.Item, key: 'parent', title: 'Controlled collapsed parent', children: [{ type: ItemType.Item, key: 'child', title: 'Controlled collapsed child' }] }];
        const view = await render(<Menu mode="inline" inlineCollapsed openKeys={[]} onOpenKeysChange={onOpenKeysChange} items={items} />);
        const parent = screen.getByRole('menuitem', { name: 'Controlled collapsed parent' });
        await fireEvent.click(parent);
        expect(parent.getAttribute('aria-expanded')).toBe('false');
        expect(changes[0].keys).toEqual(['parent']);
        await view.rerender(<Menu mode="inline" inlineCollapsed openKeys={['parent']} onOpenKeysChange={onOpenKeysChange} items={items} />);
        const child = screen.getByRole('button', { name: 'Controlled collapsed child' });
        child.focus();
        const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
        await fireEvent(child, escape);
        expect(parent.getAttribute('aria-expanded')).toBe('true');
        expect(document.activeElement).toBe(child);
        expect(changes[1].keys).toEqual([]);
        expect(changes[1].details.event).toBe(escape);
        await view.rerender(<Menu mode="inline" inlineCollapsed openKeys={[]} onOpenKeysChange={onOpenKeysChange} items={items} />);
        expect(document.activeElement).toBe(parent);
        expect(onOpenKeysChange).toHaveBeenCalledTimes(2);
    });

    it('initializes collapsed default keys once and closes a selected leaf only once', async () => {
        const onOpenKeysChange = mock.fn();
        const selections: MenuSelectionChangeDetails[] = [];
        const items = [{ type: ItemType.Item, key: 'parent', title: 'Default collapsed parent', children: [
            { type: ItemType.Item, key: 'nested', title: 'Collapsed nested', children: [{ type: ItemType.Item, key: 'leaf', title: 'Collapsed selected leaf' }] },
        ] }];
        const view = await render(<Menu mode="inline" inlineCollapsed defaultOpenKeys={['parent']} items={items} onOpenKeysChange={onOpenKeysChange} onSelectedKeysChange={(_keys, details) => { selections.push(details); }} />);
        await view.rerender(<Menu mode="inline" inlineCollapsed defaultOpenKeys={[]} items={items} onOpenKeysChange={onOpenKeysChange} onSelectedKeysChange={(_keys, details) => { selections.push(details); }} />);
        expect(screen.getByRole('menuitem', { name: 'Default collapsed parent' }).getAttribute('aria-expanded')).toBe('true');
        expect(onOpenKeysChange).not.toHaveBeenCalled();
        await fireEvent.click(screen.getByRole('button', { name: 'Collapsed nested' }));
        expect(onOpenKeysChange).toHaveBeenCalledTimes(1);
        const leaf = screen.getByRole('button', { name: 'Collapsed selected leaf' });
        leaf.focus();
        const key = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
        await fireEvent(leaf, key);
        expect(onOpenKeysChange).toHaveBeenCalledTimes(2);
        expect(onOpenKeysChange).toHaveBeenCalledWith([], expect.objectContaining({ reason: 'collapse', item: expect.objectContaining({ key: 'leaf' }) }));
        expect(selections.at(-1)?.event?.nativeEvent).toBe(key);
        expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Default collapsed parent' }));
    });

    it('retains actual keyboard events in ordinary and collapsed vertical expansion', async () => {
        for (const inlineCollapsed of [false, true]) {
            const openEvents: MenuOpenKeysChangeDetails[] = [];
            const view = await render(<Menu mode="inline" inlineCollapsed={inlineCollapsed} onOpenKeysChange={(_keys, details) => { openEvents.push(details); }} items={[
                { type: ItemType.Item, key: 'parent', title: 'Vertical keyboard parent', children: [{ type: ItemType.Item, key: 'child', title: 'Vertical keyboard child' }] },
            ]} />);
            const parent = screen.getByRole(inlineCollapsed ? 'menuitem' : 'button', { name: 'Vertical keyboard parent' });
            const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
            await fireEvent(parent, event);
            const detailEvent = openEvents[0].event;
            expect(detailEvent && 'nativeEvent' in detailEvent ? detailEvent.nativeEvent : detailEvent).toBe(event);
            expect(parent.getAttribute('aria-expanded')).toBe('true');
            await view.unmount();
        }
    });

    it('closes only the collapsed tooltip layer on Escape without changing controlled open keys or focus', async () => {
        const onOpenKeysChange = mock.fn();
        const background = document.createElement('div');
        const outside = document.createElement('button');
        outside.textContent = 'Background action';
        background.append(outside);
        document.body.append(background);
        outside.focus();
        const onBackgroundEscape = mock.fn();
        const layer = registerOverlayLayer(background, onBackgroundEscape);
        try {
            await render(<Menu mode="inline" inlineCollapsed openKeys={[]} onOpenKeysChange={onOpenKeysChange} items={[
                { type: ItemType.Item, key: 'leaf', title: 'Independent tooltip' },
            ]} />);
            const leaf = screen.getByRole('menuitem', { name: 'Independent tooltip' });
            await fireEvent(leaf.closest('li')!, new MouseEvent('mouseover', { bubbles: true }));
            expect(screen.getByRole('tooltip').textContent).toBe('Independent tooltip');
            await fireEvent(leaf, new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
            expect(screen.queryByRole('tooltip')).toBe(null);
            expect(document.activeElement).toBe(outside);
            expect(onOpenKeysChange).not.toHaveBeenCalled();
            expect(onBackgroundEscape).not.toHaveBeenCalled();
            await fireEvent(leaf, new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
            expect(onBackgroundEscape).toHaveBeenCalledTimes(1);
        } finally { layer.release({ restoreFocus: false }); background.remove(); }
    });

    it('merges a collapsed outside dismissal across siblings into one actual-event request', async () => {
        const onOpenKeysChange = mock.fn();
        await render(<Menu mode="inline" inlineCollapsed defaultOpenKeys={['a', 'b']} onOpenKeysChange={onOpenKeysChange} items={['a', 'b'].map(key => ({
            type: ItemType.Item, key, title: key + ' collapsed', children: [{ type: ItemType.Item, key: key + '-child', title: key + ' collapsed child' }],
        }))} />);
        const event = new MouseEvent('pointerdown', { bubbles: true });
        const requests = [...floatingRequests.values()];
        await act(async () => { requests.forEach(request => request(false, event, 'outside-press')); await new Promise<void>(resolve => setTimeout(resolve, 0)); });
        expect(onOpenKeysChange).toHaveBeenCalledTimes(1);
        expect(onOpenKeysChange).toHaveBeenCalledWith([], expect.objectContaining({ reason: 'collapse', event }));
    });

    it("renders inline-collapsed vertical menu with icons only and opens floating submenu on hover", async () => {
        mockFloatingForceOpen = true;
        const onSelectedKeysChange = mock.fn();
        const onClick = mock.fn();
        await render(<Menu mode="inline" inlineCollapsed selectedKeys={["dashboard"]} onSelectedKeysChange={onSelectedKeysChange} onClick={onClick} items={[
            {
                type: ItemType.Item,
                key: "dashboard",
                title: "仪表盘",
                icon: <span data-testid="dashboard-icon"/>,
            },
            {
                type: ItemType.Item,
                key: "system",
                title: "系统管理",
                icon: <span data-testid="system-icon"/>,
                children: [
                    {
                        type: ItemType.Item,
                        key: "system-menu",
                        title: "菜单维护",
                    },
                ],
            },
            {
                type: ItemType.ItemGroup,
                key: "tools-group",
                title: "工具",
                children: [
                    {
                        type: ItemType.Item,
                        key: "tools-logs",
                        title: "日志",
                        icon: <span data-testid="tools-logs-icon"/>,
                    },
                ],
            },
        ]}/>);
        expect(screen.getByTestId("dashboard-icon")).toBeTruthy();
        expect(screen.getByTestId("system-icon")).toBeTruthy();
        expect(screen.getByTestId("tools-logs-icon")).toBeTruthy();
        await act(() => {
            mockFloatingOnOpenChange?.(true);
        });
        await act(async () => {
            await fireEvent.click(screen.getByLabelText("系统管理"));
        });
        await act(async () => {
            await fireEvent.click(screen.getByLabelText("仪表盘"));
        });
        expect(onSelectedKeysChange).toHaveBeenCalled();
        expect(onClick).toHaveBeenCalledWith(expect.objectContaining({
            item: expect.objectContaining({ key: "dashboard" }),
        }));
        await act(async () => {
            await fireEvent.keyDown(screen.getByLabelText("仪表盘"), { key: "Enter" });
        });
        expect(screen.getByRole("tooltip")).toBeTruthy();
        await act(() => {
            mockFloatingCloseHandler?.();
        });
    });
});
