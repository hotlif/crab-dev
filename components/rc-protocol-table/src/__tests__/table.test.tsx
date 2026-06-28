import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { render, cleanup, waitFor } from "@testing-library/react";
import ProtocolTable from "../table.js";
import type { ProtocolColumnType } from "../types.js";
import type { Row } from "@crab-dev/rc-table";

(globalThis as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom 中未实现 ResizeObserver，AutoSizer 依赖它，补一个最小 stub
if (typeof (globalThis as { ResizeObserver?: unknown }).ResizeObserver === "undefined") {
    (globalThis as unknown as Record<string, unknown>).ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}

afterEach(() => cleanup());

/* ─── fixtures ─── */

const COLUMNS: ProtocolColumnType[] = [
    { name: "$.name", title: "Name", dataType: "text", width: 100 },
    { name: "$.age",  title: "Age",  dataType: "number", width: 80 },
];

interface PersonRow extends Row {
    dataRef: { name: string; age: number };
}

const ROWS: PersonRow[] = [
    { id: "1", dataRef: { name: "Alice", age: 30 } },
    { id: "2", dataRef: { name: "Bob",   age: 25 } },
];

/* ─── tests ─── */

type FetchColumnsFn = () => Promise<ProtocolColumnType[]>;
type FetchDataFn = () => Promise<PersonRow[]>;
type PaginatedFetchFn = (page: number, pageSize: number, filters: Record<string, string>) => Promise<{ rows: PersonRow[]; total: number }>;

describe("ProtocolTable", () => {
    it("calls fetchColumns and fetchData on mount", async () => {
        const fetchColumns = jest.fn<FetchColumnsFn>().mockResolvedValue(COLUMNS);
        const fetchData    = jest.fn<FetchDataFn>().mockResolvedValue(ROWS);

        render(
            <ProtocolTable<PersonRow>
                fetchColumns={fetchColumns}
                fetchData={fetchData}
                style={{ width: 400, height: 300 }}
            />
        );

        await waitFor(() => {
            expect(fetchColumns).toHaveBeenCalledTimes(1);
            expect(fetchData).toHaveBeenCalledTimes(1);
        });
    });

    it("re-fetches columns when fetchColumns prop changes", async () => {
        const fetchColumns1 = jest.fn<FetchColumnsFn>().mockResolvedValue(COLUMNS);
        const fetchColumns2 = jest.fn<FetchColumnsFn>().mockResolvedValue(COLUMNS);
        const fetchData     = jest.fn<FetchDataFn>().mockResolvedValue(ROWS);

        const { rerender } = render(
            <ProtocolTable<PersonRow>
                fetchColumns={fetchColumns1}
                fetchData={fetchData}
                style={{ width: 400, height: 300 }}
            />
        );

        await waitFor(() => expect(fetchColumns1).toHaveBeenCalledTimes(1));

        rerender(
            <ProtocolTable<PersonRow>
                fetchColumns={fetchColumns2}
                fetchData={fetchData}
                style={{ width: 400, height: 300 }}
            />
        );

        await waitFor(() => expect(fetchColumns2).toHaveBeenCalledTimes(1));
    });

    it("calls fetchData with page / pageSize / filters in pagination mode", async () => {
        const fetchColumns = jest.fn<FetchColumnsFn>().mockResolvedValue(COLUMNS);
        const fetchData = jest
            .fn<PaginatedFetchFn>()
            .mockResolvedValue({ rows: ROWS, total: ROWS.length });

        render(
            <ProtocolTable<PersonRow>
                fetchColumns={fetchColumns}
                fetchData={fetchData}
                pagination={{ defaultPageSize: 20 }}
                style={{ width: 400, height: 300 }}
            />
        );

        await waitFor(() => {
            expect(fetchData).toHaveBeenCalledWith(1, 20, {});
        });
    });

    it("shows loading overlay then removes it after data loads", async () => {
        let resolveData!: (rows: PersonRow[]) => void;
        const dataPromise = new Promise<PersonRow[]>((res) => { resolveData = res; });

        const fetchColumns = jest.fn<FetchColumnsFn>().mockResolvedValue(COLUMNS);
        const fetchData    = jest.fn<FetchDataFn>().mockReturnValue(dataPromise);

        const { container } = render(
            <ProtocolTable<PersonRow>
                fetchColumns={fetchColumns}
                fetchData={fetchData}
                style={{ width: 400, height: 300 }}
            />
        );

        // spinner 应在初始渲染后出现
        expect(container.querySelector('[data-testid="protocol-table-loading"]')).toBeTruthy();

        resolveData(ROWS);

        await waitFor(() => {
            expect(container.querySelector('[data-testid="protocol-table-loading"]')).toBeNull();
        });
    });
});
