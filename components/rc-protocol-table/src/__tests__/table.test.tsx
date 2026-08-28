import { act, beforeAll, describe, it, expect, mock, render, waitFor, fireEvent, screen } from "@crab-dev/wake/test/react";
import type { ComponentPropsWithRef } from "react";
import type { ProtocolColumnType } from "../types.js";
import type { Row } from "@crab-dev/rc-table";
mock.module("motion/react", async () => {
    const mockReact = await mock.actual<typeof import("react")>("react");
    const MockDiv = ({ ref, ...props }: ComponentPropsWithRef<"div">) => mockReact.createElement("div", { ...props, ref });
    return {
        motion: { div: MockDiv },
        AnimatePresence: ({ children }: { children: unknown }) => children,
    };
});
let ProtocolTable: (typeof import("../table.js"))["default"];
beforeAll(async () => {
    const tableModule = await mock.import<typeof import("../table.js")>("../table.js");
    ProtocolTable = tableModule.default;
});
(globalThis as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
// jsdom 中未实现 ResizeObserver，AutoSizer 依赖它，补一个最小 stub
if (typeof (globalThis as {
    ResizeObserver?: unknown;
}).ResizeObserver === "undefined") {
    (globalThis as unknown as Record<string, unknown>).ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
}
/* ─── fixtures ─── */
const COLUMNS: ProtocolColumnType[] = [
    { name: "$.name", title: "Name", dataType: "text", width: 100 },
    { name: "$.age", title: "Age", dataType: "number", width: 80 },
];
interface PersonRow extends Row {
    dataRef: {
        name: string;
        age: number;
    };
}
const ROWS: PersonRow[] = [
    { id: "1", dataRef: { name: "Alice", age: 30 } },
    { id: "2", dataRef: { name: "Bob", age: 25 } },
];
/* ─── tests ─── */
type FetchColumnsFn = () => Promise<ProtocolColumnType[]>;
type FetchDataFn = () => Promise<PersonRow[]>;
type PaginatedFetchFn = (page: number, pageSize: number, filters: Record<string, string>) => Promise<{
    rows: PersonRow[];
    total: number;
}>;
describe("ProtocolTable", () => {
    it("calls fetchColumns and fetchData on mount", async () => {
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>().resolve(ROWS);
        await render(<ProtocolTable<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(fetchColumns).toHaveBeenCalledTimes(1);
            expect(fetchData).toHaveBeenCalledTimes(1);
        });
    });
    it("re-fetches columns when fetchColumns prop changes", async () => {
        const fetchColumns1 = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchColumns2 = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>().resolve(ROWS);
        const { rerender } = await render(<ProtocolTable<PersonRow> fetchColumns={fetchColumns1} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => expect(fetchColumns1).toHaveBeenCalledTimes(1));
        await rerender(<ProtocolTable<PersonRow> fetchColumns={fetchColumns2} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => expect(fetchColumns2).toHaveBeenCalledTimes(1));
    });
    it("calls fetchData with page / pageSize / filters in pagination mode", async () => {
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<PaginatedFetchFn>()
            .resolve({ rows: ROWS, total: ROWS.length });
        await render(<ProtocolTable<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} pagination={{ defaultPageSize: 20 }} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(fetchData).toHaveBeenCalledWith(1, 20, {});
        });
    });
    it("shows loading overlay then removes it after data loads", async () => {
        let resolveData!: (rows: PersonRow[]) => void;
        const dataPromise = new Promise<PersonRow[]>((res) => { resolveData = res; });
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>().return(dataPromise);
        const { container } = await render(<ProtocolTable<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
        // spinner 应在初始渲染后出现
        expect(container.querySelector('[data-testid="protocol-table-loading"]')).toBeTruthy();
        await act(async () => {
            resolveData(ROWS);
            await dataPromise;
        });
        await waitFor(() => {
            expect(container.querySelector('[data-testid="protocol-table-loading"]')).toBeNull();
        });
    });
    it("shows columns error overlay when fetchColumns rejects", async () => {
        const fetchColumns = mock.fn<FetchColumnsFn>().reject(new Error("网络错误"));
        const fetchData = mock.fn<FetchDataFn>().resolve(ROWS);
        const { container } = await render(<ProtocolTable<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(container.querySelector('[data-testid="protocol-table-columns-error"]')).toBeTruthy();
        });
        expect(container.querySelector('[data-testid="protocol-table-loading"]')).toBeNull();
    });
    it("shows data error overlay when fetchData rejects", async () => {
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>().reject(new Error("服务器错误"));
        const { container } = await render(<ProtocolTable<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(container.querySelector('[data-testid="protocol-table-data-error"]')).toBeTruthy();
        });
        expect(container.querySelector('[data-testid="protocol-table-loading"]')).toBeNull();
    });
    it("calls onError with source='columns' when fetchColumns rejects", async () => {
        type OnErrorFn = (error: Error, source: "columns" | "data") => void;
        const onError = mock.fn<OnErrorFn>();
        const fetchColumns = mock.fn<FetchColumnsFn>().reject(new Error("列加载失败"));
        const fetchData = mock.fn<FetchDataFn>().resolve(ROWS);
        await render(<ProtocolTable<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} onError={onError} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(expect.any(Error), "columns");
        });
    });
    it("calls onError with source='data' when fetchData rejects", async () => {
        type OnErrorFn = (error: Error, source: "columns" | "data") => void;
        const onError = mock.fn<OnErrorFn>();
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>().reject(new Error("数据加载失败"));
        await render(<ProtocolTable<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} onError={onError} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(expect.any(Error), "data");
        });
    });
    it("retries fetchColumns when retry button is clicked after columns error", async () => {
        const fetchColumns = mock.fn<FetchColumnsFn>()
            .rejectOnce(new Error("首次失败"))
            .resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>().resolve(ROWS);
        const { container } = await render(<ProtocolTable<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(container.querySelector('[data-testid="protocol-table-columns-error"]')).toBeTruthy();
        });
        await fireEvent.click(screen.getByText("重试"));
        await waitFor(() => {
            expect(container.querySelector('[data-testid="protocol-table-columns-error"]')).toBeNull();
            expect(fetchColumns).toHaveBeenCalledTimes(2);
        });
    });
    it("clears data error overlay and retries when retry button is clicked", async () => {
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>()
            .rejectOnce(new Error("首次失败"))
            .resolve(ROWS);
        const { container } = await render(<ProtocolTable<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(container.querySelector('[data-testid="protocol-table-data-error"]')).toBeTruthy();
        });
        await fireEvent.click(screen.getByText("重试"));
        await waitFor(() => {
            expect(container.querySelector('[data-testid="protocol-table-data-error"]')).toBeNull();
            expect(fetchData).toHaveBeenCalledTimes(2);
        });
    });
});
