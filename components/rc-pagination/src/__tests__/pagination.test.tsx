import { beforeAll, describe, expect, it, mock, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import { useState } from "react";
import type { ReactNode } from "react";
// @crab-dev/rc-select 通过 CJS 产物加载时存在模块互操作性问题，
// 此处与 rc-select 自身测试对 rc-dropdown-container 的处理方式保持一致：
// 用最小 stub 替换整个包，仅保留 options / onChange / disabled / aria-label 语义。
mock.module("@crab-dev/rc-select", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
    const mockReact = require("react") as typeof import("react");
    function MockSelect({ options = [], onChange, disabled, "aria-label": ariaLabel, }: {
        options?: Array<{
            value: string;
            label: ReactNode;
        }>;
        onChange?: (v: string | undefined) => void;
        disabled?: boolean;
        "aria-label"?: string;
    }) {
        return mockReact.createElement("div", { "aria-label": ariaLabel }, options.map((opt) => mockReact.createElement("span", {
            key: opt.value,
            onClick: () => {
                if (!disabled)
                    onChange?.(opt.value);
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
    it("renders the navigation landmark with sequential pages when total is small", async () => {
        await render(<Pagination total={30}/>);
        expect(screen.getByRole("navigation", { name: /pagination/i })).toBeTruthy();
        expect(screen.getByRole("button", { name: "Page 1" })).toBeTruthy();
        expect(screen.getByRole("button", { name: "Page 3" })).toBeTruthy();
        expect(screen.queryAllByTestId("pagination-ellipsis")).toHaveLength(0);
    });
    it("marks the current page with aria-current", async () => {
        await render(<Pagination defaultCurrent={2} total={30}/>);
        const active = screen.getByRole("button", { name: "Page 2" });
        expect(active.getAttribute("aria-current")).toBe("page");
    });
    it("disables prev at the first page and next at the last page", async () => {
        const { rerender } = await render(<Pagination current={1} total={30}/>);
        expect((screen.getByRole("button", { name: "Previous page" }) as HTMLButtonElement).disabled).toBe(true);
        await rerender(<Pagination current={3} total={30}/>);
        expect((screen.getByRole("button", { name: "Next page" }) as HTMLButtonElement).disabled).toBe(true);
    });
    it("fires onChange with new page and pageSize when a page is clicked (uncontrolled)", async () => {
        const handleChange = mock.fn();
        await render(<Pagination defaultCurrent={1} total={100} pageSize={10} onChange={handleChange}/>);
        await fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
        expect(handleChange).toHaveBeenCalledWith(2, 10);
        expect(screen.getByRole("button", { name: "Page 2" }).getAttribute("aria-current")).toBe("page");
    });
    it("does not advance internal state when controlled", async () => {
        const handleChange = mock.fn();
        await render(<Pagination current={1} total={100} onChange={handleChange}/>);
        await fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
        expect(handleChange).toHaveBeenCalledWith(2, 10);
        expect(screen.getByRole("button", { name: "Page 1" }).getAttribute("aria-current")).toBe("page");
    });
    it("renders ellipsis jumpers when there are many pages", async () => {
        await render(<Pagination defaultCurrent={10} total={500} pageSize={10}/>);
        const ellipses = screen.getAllByTestId("pagination-ellipsis");
        expect(ellipses.length).toBe(2);
        await fireEvent.click(ellipses[0]);
        // jumping back 5 pages from page 10 => page 5
        expect(screen.getByRole("button", { name: "Page 5" }).getAttribute("aria-current")).toBe("page");
    });
    it("supports quick jumper via Enter", async () => {
        const Host = () => {
            const [current, setCurrent] = useState(1);
            return <Pagination current={current} total={200} onChange={(page) => setCurrent(page)} showQuickJumper/>;
        };
        await render(<Host />);
        const input = screen.getByLabelText("Jump to page") as HTMLInputElement;
        const inputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
        if (!inputValueSetter) {
            throw new Error("HTMLInputElement.value setter is unavailable");
        }
        inputValueSetter.call(input, "8");
        await fireEvent.input(input);
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(screen.getByRole("button", { name: "Page 8" }).getAttribute("aria-current")).toBe("page");
    });
    it("renders default total summary when showTotal is true", async () => {
        await render(<Pagination defaultCurrent={2} total={53} pageSize={10} showTotal/>);
        expect(screen.getByText("第 11-20 条 / 共 53 条")).toBeTruthy();
    });
    it("supports a custom showTotal renderer", async () => {
        await render(<Pagination defaultCurrent={1} total={42} pageSize={10} showTotal={(total, [from, to]) => `${from}~${to} of ${total}`}/>);
        expect(screen.getByText("1~10 of 42")).toBeTruthy();
    });
    it("disables every control when disabled is true", async () => {
        await render(<Pagination defaultCurrent={2} total={100} disabled showQuickJumper/>);
        const buttons = screen.getAllByRole("button");
        for (const btn of buttons) {
            expect((btn as HTMLButtonElement).disabled).toBe(true);
        }
        expect((screen.getByLabelText("Jump to page") as HTMLInputElement).disabled).toBe(true);
    });
    it("applies the small size data attribute", async () => {
        const { container } = await render(<Pagination total={30} size="small"/>);
        expect(container.querySelector('nav[data-size="small"]')).not.toBeNull();
    });
    it("handles zero total gracefully (shows a single page)", async () => {
        await render(<Pagination total={0}/>);
        expect(screen.getByRole("button", { name: "Page 1" })).toBeTruthy();
        expect((screen.getByRole("button", { name: "Previous page" }) as HTMLButtonElement).disabled).toBe(true);
        expect((screen.getByRole("button", { name: "Next page" }) as HTMLButtonElement).disabled).toBe(true);
    });
    it("renders the page-size changer when showSizeChanger is true", async () => {
        const { container } = await render(<Pagination total={200} showSizeChanger/>);
        expect(container.textContent).toContain("10 / 页");
    });
    it("keeps the leading item visible when page size changes", async () => {
        const handleChange = mock.fn();
        const handleShowSizeChange = mock.fn();
        const Host = () => {
            const [current, setCurrent] = useState(5);
            const [pageSize, setPageSize] = useState(10);
            return (<Pagination current={current} pageSize={pageSize} total={200} showSizeChanger pageSizeOptions={[10, 20, 50]} onChange={(page, size) => {
                handleChange(page, size);
                setCurrent(page);
                setPageSize(size);
            }} onShowSizeChange={handleShowSizeChange}/>);
        };
        const { container } = await render(<Host />);
        // current=5, pageSize=10 => 首条索引 40；切换到 pageSize=20 应落到 page 3（item 40 → page 3）
        const trigger = container.querySelector('[aria-label="Rows per page"]') as HTMLElement | null;
        expect(trigger).not.toBeNull();
        await fireEvent.click(trigger as HTMLElement);
        await fireEvent.click(screen.getByText("20 / 页"));
        expect(handleShowSizeChange).toHaveBeenCalledWith(3, 20);
        expect(handleChange).toHaveBeenCalledWith(3, 20);
        expect(screen.getByRole("button", { name: "Page 3" }).getAttribute("aria-current")).toBe("page");
    });
});
