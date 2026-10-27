import { act, beforeAll, describe, expect, it, mock, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import { useState } from "react";
import type { ReactNode, MouseEvent, SyntheticEvent } from "react";
import type { PaginationChangeDetails } from '../types.js';
import ConfigProvider from '@crab-dev/rc-config-provider';
// @crab-dev/rc-select 通过 CJS 产物加载时存在模块互操作性问题，
// 此处与 rc-select 自身测试对 rc-dropdown-container 的处理方式保持一致：
// 用最小 stub 替换整个包，仅保留 options / onValueChange / disabled / aria-label 语义。
mock.module("@crab-dev/rc-select", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
    const mockReact = require("react") as typeof import("react");
    function MockSelect({ options = [], onValueChange, disabled, "aria-label": ariaLabel, }: {
        options?: Array<{
            value: string;
            label: ReactNode;
        }>;
        onValueChange?: (v: string | undefined, details: { event: SyntheticEvent }) => void;
        disabled?: boolean;
        "aria-label"?: string;
    }) {
        return mockReact.createElement("div", { "aria-label": ariaLabel }, options.map((opt) => mockReact.createElement("span", {
            key: opt.value,
            onClick: (event: MouseEvent<HTMLSpanElement>) => {
                if (!disabled)
                    onValueChange?.(opt.value, { event });
            },
        }, opt.label)));
    }
    return { __esModule: true, default: MockSelect };
});
let Pagination: (typeof import("../pagination.js"))["default"];
beforeAll(async () => {
    const paginationModule = await mock.import<typeof import("../pagination.js")>("../pagination.js");
    Pagination = paginationModule.default;
});
(globalThis as unknown as {
    IS_REACT_ACT_ENVIRONMENT: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
// jsdom 不提供 ResizeObserver，rc-select 会用到，补一个最小 stub。
if (typeof (globalThis as {
    ResizeObserver?: unknown;
}).ResizeObserver === "undefined") {
    class ResizeObserverStub {
        observe() { }
        unobserve() { }
        disconnect() { }
    }
    (globalThis as unknown as {
        ResizeObserver: unknown;
    }).ResizeObserver = ResizeObserverStub;
}
describe("Pagination", () => {
    it('retains one current page when disabling and ignores disabled navigation', async () => {
        const onValueChange = mock.fn();
        const view = await render(<Pagination defaultValue={3} total={80} onValueChange={onValueChange} />);
        const current = screen.getByRole('button', { name: '页码 3' });
        await view.rerender(<Pagination defaultValue={1} total={80} disabled onValueChange={onValueChange} />);
        expect(screen.getByRole('button', { name: '页码 3' })).toBe(current);
        expect(view.container.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
        expect(current.getAttribute('aria-current')).toBe('page');
        expect((current as HTMLButtonElement).disabled).toBe(true);
        await fireEvent.click(screen.getByRole('button', { name: '页码 2' }));
        await fireEvent.click(screen.getByRole('button', { name: '下一页' }));
        expect(onValueChange).not.toHaveBeenCalled();
        expect(current.getAttribute('aria-current')).toBe('page');
        await view.rerender(<Pagination defaultValue={1} total={80} onValueChange={onValueChange} />);
        expect(current.getAttribute('aria-current')).toBe('page');
        expect((current as HTMLButtonElement).disabled).toBe(false);
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('mirrors navigation icons in RTL while preserving previous and next page actions', async () => {
        const onValueChange = mock.fn();
        const view = await render(<ConfigProvider direction="ltr"><Pagination defaultValue={23} total={980} onValueChange={onValueChange} /></ConfigProvider>);
        const paths = (name: string) => Array.from(screen.getByRole('button', { name }).querySelectorAll('path'), path => path.getAttribute('d')).join('|');
        const previous = paths('上一页');
        const next = paths('下一页');
        const backward = paths('向前跳转');
        const forward = paths('向后跳转');
        await view.rerender(<ConfigProvider direction="rtl"><Pagination defaultValue={23} total={980} onValueChange={onValueChange} /></ConfigProvider>);
        expect(paths('上一页')).toBe(next);
        expect(paths('下一页')).toBe(previous);
        expect(paths('向前跳转')).toBe(forward);
        expect(paths('向后跳转')).toBe(backward);
        await fireEvent.click(screen.getByRole('button', { name: '上一页' }));
        expect(onValueChange).toHaveBeenCalledWith(22, expect.objectContaining({ reason: 'page', pageSize: 10 }));
        await fireEvent.click(screen.getByRole('button', { name: '下一页' }));
        expect(onValueChange).toHaveBeenCalledWith(23, expect.objectContaining({ reason: 'page', pageSize: 10 }));
        expect(onValueChange).toHaveBeenCalledTimes(2);
    });
    it('localizes navigation and totals without changing the current page', async () => {
        const view = await render(<ConfigProvider locale="en-US"><Pagination defaultValue={2} total={53} showTotal /></ConfigProvider>);
        const page = screen.getByRole('button', { name: 'Page 2' });
        expect(screen.getByText('11–20 of 53')).toBeTruthy();
        await view.rerender(<ConfigProvider locale="zh-CN"><Pagination defaultValue={1} total={53} showTotal /></ConfigProvider>);
        expect(screen.getByRole('button', { name: '页码 2' })).toBe(page);
        expect(page.getAttribute('aria-current')).toBe('page');
        expect(screen.getByText('第 11–20 条，共 53 条')).toBeTruthy();
    });
    it("renders the navigation landmark with sequential pages when total is small", async () => {
        await render(<Pagination total={30}/>);
        expect(screen.getByRole("navigation", { name: /分页/ })).toBeTruthy();
        expect(screen.getByRole("button", { name: "页码 1" })).toBeTruthy();
        expect(screen.getByRole("button", { name: "页码 3" })).toBeTruthy();
        expect(screen.queryAllByTestId("pagination-ellipsis")).toHaveLength(0);
    });
    it("marks the current page with aria-current", async () => {
        await render(<Pagination defaultValue={2} total={30}/>);
        const active = screen.getByRole("button", { name: "页码 2" });
        expect(active.getAttribute("aria-current")).toBe("page");
    });
    it("disables prev at the first page and next at the last page", async () => {
        const { rerender } = await render(<Pagination value={1} total={30}/>);
        expect((screen.getByRole("button", { name: "上一页" }) as HTMLButtonElement).disabled).toBe(true);
        await rerender(<Pagination value={3} total={30}/>);
        expect((screen.getByRole("button", { name: "下一页" }) as HTMLButtonElement).disabled).toBe(true);
    });
    it("fires onChange with new page and pageSize when a page is clicked (uncontrolled)", async () => {
        const handleChange = mock.fn();
        await render(<Pagination defaultValue={1} total={100} pageSize={10} onValueChange={handleChange}/>);
        await fireEvent.click(screen.getByRole("button", { name: "页码 2" }));
        expect(handleChange).toHaveBeenCalledWith(2, expect.objectContaining({ pageSize: 10, reason: 'page' }));
        expect(screen.getByRole("button", { name: "页码 2" }).getAttribute("aria-current")).toBe("page");
    });
    it("does not advance internal state when controlled", async () => {
        const handleChange = mock.fn();
        await render(<Pagination value={1} total={100} onValueChange={handleChange}/>);
        await fireEvent.click(screen.getByRole("button", { name: "页码 2" }));
        expect(handleChange).toHaveBeenCalledWith(2, expect.objectContaining({ pageSize: 10, reason: 'page' }));
        expect(screen.getByRole("button", { name: "页码 1" }).getAttribute("aria-current")).toBe("page");
    });
    it("renders ellipsis jumpers when there are many pages", async () => {
        await render(<Pagination defaultValue={10} total={500} pageSize={10}/>);
        const ellipses = screen.getAllByTestId("pagination-ellipsis");
        expect(ellipses.length).toBe(2);
        await fireEvent.click(ellipses[0]);
        // jumping back 5 pages from page 10 => page 5
        expect(screen.getByRole("button", { name: "页码 5" }).getAttribute("aria-current")).toBe("page");
    });
    it("supports quick jumper via Enter", async () => {
        const Host = () => {
            const [current, setCurrent] = useState(1);
            return <Pagination value={current} total={200} onValueChange={(page) => setCurrent(page)} showQuickJumper/>;
        };
        await render(<Host />);
        const input = screen.getByLabelText("跳转页码") as HTMLInputElement;
        const inputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
        if (!inputValueSetter) {
            throw new Error("HTMLInputElement.value setter is unavailable");
        }
        inputValueSetter.call(input, "8");
        await fireEvent.input(input);
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(screen.getByRole("button", { name: "页码 8" }).getAttribute("aria-current")).toBe("page");
    });
    it("renders default total summary when showTotal is true", async () => {
        await render(<Pagination defaultValue={2} total={53} pageSize={10} showTotal/>);
        expect(screen.getByText("第 11–20 条，共 53 条")).toBeTruthy();
    });
    it("supports a custom showTotal renderer", async () => {
        await render(<Pagination defaultValue={1} total={42} pageSize={10} showTotal={(total, [from, to]) => `${from}~${to} of ${total}`}/>);
        expect(screen.getByText("1~10 of 42")).toBeTruthy();
    });
    it("disables every control when disabled is true", async () => {
        await render(<Pagination defaultValue={2} total={100} disabled showQuickJumper/>);
        const buttons = screen.getAllByRole("button");
        for (const btn of buttons) {
            expect((btn as HTMLButtonElement).disabled).toBe(true);
        }
        expect((screen.getByLabelText("跳转页码") as HTMLInputElement).disabled).toBe(true);
    });
    it("applies the small size data attribute", async () => {
        const { container } = await render(<Pagination total={30} size="small"/>);
        expect(container.querySelector('nav[data-size="small"]')).not.toBeNull();
    });
    it("handles zero total gracefully (shows a single page)", async () => {
        await render(<Pagination total={0}/>);
        expect(screen.getByRole("button", { name: "页码 1" })).toBeTruthy();
        expect((screen.getByRole("button", { name: "上一页" }) as HTMLButtonElement).disabled).toBe(true);
        expect((screen.getByRole("button", { name: "下一页" }) as HTMLButtonElement).disabled).toBe(true);
    });
    it("renders the page-size changer when showSizeChanger is true", async () => {
        const { container } = await render(<Pagination total={200} showSizeChanger/>);
        expect(container.textContent).toContain("10 条/页");
    });
    it("keeps the leading item visible when page size changes", async () => {
        const handleChange = mock.fn();
        const handleShowSizeChange = mock.fn();
        const Host = () => {
            const [current, setCurrent] = useState(5);
            const [pageSize, setPageSize] = useState(10);
            return (<Pagination value={current} pageSize={pageSize} total={200} showSizeChanger pageSizeOptions={[10, 20, 50]} onValueChange={(page, details) => {
                handleChange(page, details);
                setCurrent(page);
                setPageSize(details.pageSize);
            }} onPageSizeChange={handleShowSizeChange}/>);
        };
        const { container } = await render(<Host />);
        // current=5, pageSize=10 => 首条索引 40；切换到 pageSize=20 应落到 page 3（item 40 → page 3）
        const trigger = container.querySelector('[aria-label="每页条数"]') as HTMLElement | null;
        expect(trigger).not.toBeNull();
        await fireEvent.click(trigger as HTMLElement);
        await fireEvent.click(screen.getByText("20 条/页"));
        expect(handleShowSizeChange).toHaveBeenCalledWith(20, expect.objectContaining({ page: 3 }));
        expect(handleChange).toHaveBeenCalledWith(3, expect.objectContaining({ pageSize: 20, reason: 'page-size' }));
        expect(screen.getByRole("button", { name: "页码 3" }).getAttribute("aria-current")).toBe("page");
    });
    it('preserves real click, keyboard and blur events and notifies once per page action', async () => {
        const changes: PaginationChangeDetails[] = [];
        const nativeEvents: Event[] = [];
        await render(<Pagination total={200} showQuickJumper
            onValueChange={(_, details) => changes.push(details)}
            onClick={event => nativeEvents.push(event.nativeEvent)}
            onKeyDown={event => nativeEvents.push(event.nativeEvent)}
            onBlur={event => nativeEvents.push(event.nativeEvent)} />);
        await fireEvent.click(screen.getByRole('button', { name: '页码 2' }));
        expect(changes).toHaveLength(1);
        expect((changes[0].event as SyntheticEvent).nativeEvent).toBe(nativeEvents[0]);
        const input = screen.getByLabelText('跳转页码') as HTMLInputElement;
        await act(() => input.focus());
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
        if (!setter) throw new Error('Missing input value setter');
        setter.call(input, '8');
        await fireEvent.input(input);
        await fireEvent.keyDown(input, { key: 'Enter' });
        expect(changes).toHaveLength(2);
        expect(changes[1].reason).toBe('jump');
        expect((changes[1].event as SyntheticEvent).nativeEvent).toBe(nativeEvents[1]);
        setter.call(input, '9');
        await fireEvent.input(input);
        await act(() => input.blur());
        expect(changes).toHaveLength(3);
        expect((changes[2].event as SyntheticEvent).nativeEvent).toBe(nativeEvents[2]);
    });
    it('passes the same size selection event to both semantic callbacks', async () => {
        const changes: PaginationChangeDetails[] = [];
        const sizeEvents: Array<SyntheticEvent | Event | undefined> = [];
        const clickEvents: Event[] = [];
        await render(<Pagination total={200} showSizeChanger
            onValueChange={(_, details) => changes.push(details)}
            onPageSizeChange={(_, details) => sizeEvents.push(details.event)}
            onClick={event => clickEvents.push(event.nativeEvent)} />);
        await fireEvent.click(screen.getByText('20 条/页'));
        expect(changes).toHaveLength(1);
        expect(sizeEvents).toHaveLength(1);
        expect(changes[0].event).toBe(sizeEvents[0]);
        expect((changes[0].event as SyntheticEvent).nativeEvent).toBe(clickEvents[0]);
    });
});
