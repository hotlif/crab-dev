import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import type { ReactNode } from "react";

import Pagination from "../pagination.js";

// @crab-dev/rc-select 通过 CJS 产物加载时存在模块互操作性问题，
// 此处与 rc-select 自身测试对 rc-dropdown-container 的处理方式保持一致：
// 用最小 stub 替换整个包，仅保留 options / onChange / disabled / aria-label 语义。
jest.mock("@crab-dev/rc-select", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
    const mockReact = require("react") as typeof import("react");

    function MockSelect({
        options = [],
        onChange,
        disabled,
        "aria-label": ariaLabel,
    }: {
        options?: Array<{ value: string; label: ReactNode }>;
        onChange?: (v: string | undefined) => void;
        disabled?: boolean;
        "aria-label"?: string;
    }) {
        return mockReact.createElement(
            "div",
            { "aria-label": ariaLabel },
            options.map((opt) =>
                mockReact.createElement(
                    "span",
                    {
                        key: opt.value,
                        onClick: () => { if (!disabled) onChange?.(opt.value); },
                    },
                    opt.label
                )
            )
        );
    }

    return { __esModule: true, default: MockSelect };
});

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom 不提供 ResizeObserver，rc-select 会用到，补一个最小 stub。
if (typeof (globalThis as { ResizeObserver?: unknown }).ResizeObserver === "undefined") {
    class ResizeObserverStub {
        observe() { /* no-op */ }
        unobserve() { /* no-op */ }
        disconnect() { /* no-op */ }
    }
    (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverStub;
}

afterEach(() => cleanup());

describe("Pagination", () => {
    it("renders the navigation landmark with sequential pages when total is small", () => {
        render(<Pagination total={30} />);
        expect(screen.getByRole("navigation", { name: /pagination/i })).toBeTruthy();
        expect(screen.getByRole("button", { name: "Page 1" })).toBeTruthy();
        expect(screen.getByRole("button", { name: "Page 3" })).toBeTruthy();
        expect(screen.queryAllByTestId("pagination-ellipsis")).toHaveLength(0);
    });

    it("marks the current page with aria-current", () => {
        render(<Pagination defaultCurrent={2} total={30} />);
        const active = screen.getByRole("button", { name: "Page 2" });
        expect(active.getAttribute("aria-current")).toBe("page");
    });

    it("disables prev at the first page and next at the last page", () => {
        render(<Pagination defaultCurrent={1} total={30} />);
        expect((screen.getByRole("button", { name: "Previous page" }) as HTMLButtonElement).disabled).toBe(true);
        cleanup();
        render(<Pagination defaultCurrent={3} total={30} />);
        expect((screen.getByRole("button", { name: "Next page" }) as HTMLButtonElement).disabled).toBe(true);
    });

    it("fires onChange with new page and pageSize when a page is clicked (uncontrolled)", () => {
        const handleChange = jest.fn();
        render(<Pagination defaultCurrent={1} total={100} pageSize={10} onChange={handleChange} />);
        fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
        expect(handleChange).toHaveBeenCalledWith(2, 10);
        expect(screen.getByRole("button", { name: "Page 2" }).getAttribute("aria-current")).toBe("page");
    });

    it("does not advance internal state when controlled", () => {
        const handleChange = jest.fn();
        render(<Pagination current={1} total={100} onChange={handleChange} />);
        fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
        expect(handleChange).toHaveBeenCalledWith(2, 10);
        expect(screen.getByRole("button", { name: "Page 1" }).getAttribute("aria-current")).toBe("page");
    });

    it("renders ellipsis jumpers when there are many pages", () => {
        render(<Pagination defaultCurrent={10} total={500} pageSize={10} />);
        const ellipses = screen.getAllByTestId("pagination-ellipsis");
        expect(ellipses.length).toBe(2);
        fireEvent.click(ellipses[0]);
        // jumping back 5 pages from page 10 => page 5
        expect(screen.getByRole("button", { name: "Page 5" }).getAttribute("aria-current")).toBe("page");
    });

    it("supports quick jumper via Enter", () => {
        const Host = () => {
            const [current, setCurrent] = useState(1);
            return <Pagination current={current} total={200} onChange={(page) => setCurrent(page)} showQuickJumper />;
        };
        render(<Host />);
        const input = screen.getByLabelText("Jump to page") as HTMLInputElement;
        fireEvent.change(input, { target: { value: "8" } });
        fireEvent.keyDown(input, { key: "Enter" });
        expect(screen.getByRole("button", { name: "Page 8" }).getAttribute("aria-current")).toBe("page");
    });

    it("renders default total summary when showTotal is true", () => {
        render(<Pagination defaultCurrent={2} total={53} pageSize={10} showTotal />);
        expect(screen.getByText("第 11-20 条 / 共 53 条")).toBeTruthy();
    });

    it("supports a custom showTotal renderer", () => {
        render(
            <Pagination
                defaultCurrent={1}
                total={42}
                pageSize={10}
                showTotal={(total, [from, to]) => `${from}~${to} of ${total}`}
            />,
        );
        expect(screen.getByText("1~10 of 42")).toBeTruthy();
    });

    it("disables every control when disabled is true", () => {
        render(<Pagination defaultCurrent={2} total={100} disabled showQuickJumper />);
        const buttons = screen.getAllByRole("button");
        for (const btn of buttons) {
            expect((btn as HTMLButtonElement).disabled).toBe(true);
        }
        expect((screen.getByLabelText("Jump to page") as HTMLInputElement).disabled).toBe(true);
    });

    it("applies the small size data attribute", () => {
        const { container } = render(<Pagination total={30} size="small" />);
        expect(container.querySelector('nav[data-size="small"]')).not.toBeNull();
    });

    it("handles zero total gracefully (shows a single page)", () => {
        render(<Pagination total={0} />);
        expect(screen.getByRole("button", { name: "Page 1" })).toBeTruthy();
        expect((screen.getByRole("button", { name: "Previous page" }) as HTMLButtonElement).disabled).toBe(true);
        expect((screen.getByRole("button", { name: "Next page" }) as HTMLButtonElement).disabled).toBe(true);
    });

    it("renders the page-size changer when showSizeChanger is true", () => {
        const { container } = render(<Pagination total={200} showSizeChanger />);
        expect(container.textContent).toContain("10 / 页");
    });

    it("keeps the leading item visible when page size changes", () => {
        const handleChange = jest.fn();
        const handleShowSizeChange = jest.fn();
        const Host = () => {
            const [current, setCurrent] = useState(5);
            const [pageSize, setPageSize] = useState(10);
            return (
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    total={200}
                    showSizeChanger
                    pageSizeOptions={[10, 20, 50]}
                    onChange={(page, size) => {
                        handleChange(page, size);
                        setCurrent(page);
                        setPageSize(size);
                    }}
                    onShowSizeChange={handleShowSizeChange}
                />
            );
        };
        const { container } = render(<Host />);
        // current=5, pageSize=10 => 首条索引 40；切换到 pageSize=20 应落到 page 3（item 40 → page 3）
        const trigger = container.querySelector('[aria-label="Rows per page"]') as HTMLElement | null;
        expect(trigger).not.toBeNull();
        fireEvent.click(trigger as HTMLElement);
        fireEvent.click(screen.getByText("20 / 页"));
        expect(handleShowSizeChange).toHaveBeenCalledWith(3, 20);
        expect(handleChange).toHaveBeenCalledWith(3, 20);
        expect(screen.getByRole("button", { name: "Page 3" }).getAttribute("aria-current")).toBe("page");
    });
});
