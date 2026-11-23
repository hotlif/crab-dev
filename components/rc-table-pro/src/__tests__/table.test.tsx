import { act, beforeAll, describe, it, expect, mock, render, waitFor, fireEvent, screen } from "@crab-dev/wake/test/react";

import type { ProtocolColumnType, ProtocolTableState, ResultSelection, TableQuery, TableProHandle } from "../types.js";
import type { Row, RowSelection } from "@crab-dev/rc-table";
import type { PaginationChangeHandler } from '@crab-dev/rc-pagination';
import { applyInitialState, buildCurrentState } from '../columnUtils.js';
import { createRef, StrictMode, useState, type ReactElement } from 'react';
import LineEdit from '@crab-dev/rc-line-edit';
import ConfigProvider, { localeMessages } from '@crab-dev/rc-config-provider';

async function renderTable(element: ReactElement) {
    let view!: Awaited<ReturnType<typeof render>>;
    // 等待加载 Promise 和随后的表格派生 effect 在同一 act 中完成。
    await act(async () => { view = await render(element); });
    return view;
}
async function enterText(input: HTMLInputElement, value: string) {
    // A browser edit changes the native value before React receives input;
    // assigning through React's tracked property only changes the DOM witness.
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, value);
    await fireEvent.input(input);
}
let TablePro: (typeof import("../table.js"))["default"];
beforeAll(async () => {
    const tableModule = await mock.import<typeof import("../table.js")>("../table.js");
    TablePro = tableModule.default;
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

function deferred<T>() {
    let resolve!: (value: T) => void;
    let reject!: (reason: Error) => void;
    const promise = new Promise<T>((resolvePromise, rejectPromise) => {
        resolve = resolvePromise;
        reject = rejectPromise;
    });
    return { promise, resolve, reject };
}

describe("TablePro", () => {
    it('round-trips an unpinned column through JSON and preserves legacy partial overrides', () => {
        const original = [{ ...COLUMNS[0], fixed: 'left' as const }, COLUMNS[1]];
        const saved = buildCurrentState([COLUMNS[1], COLUMNS[0]], {});
        const restored = applyInitialState(original, JSON.parse(JSON.stringify(saved)) as ProtocolTableState);
        expect(restored.map(col => [col.name, col.fixed])).toEqual([['$.age', undefined], ['$.name', undefined]]);
        const legacy = applyInitialState(original, { columnProps: { '$.name': { width: 210 } } });
        expect(legacy[0]).toEqual(expect.objectContaining({ fixed: 'left', width: 210 }));
    });
    it('restores the first request, snapshots query changes, and forwards row actions', async () => {
        const queries: TableQuery[] = [];
        const views: ProtocolTableState[] = [];
        const single = mock.fn();
        const double = mock.fn();
        const sort = [{ columnName: '$.age', direction: 'desc' as const }];
        const view = await renderTable(<TablePro<PersonRow> fetchColumns={async () => COLUMNS} sortMode="server"
            request={async query => { queries.push(query); return { rows: ROWS, total: 90 }; }}
            pagination={{}} searchMode="server" showSearchBar onStateChange={state => views.push(state)}
            initialState={{ columnProps: {}, filters: { '$.name': 'a' }, page: 3, pageSize: 20, sortColumns: sort, keyword: 'one' }}
            onRowClick={single} onRowDoubleClick={double} />);
        expect(queries).toHaveLength(1);
        expect(queries[0]).toEqual(expect.objectContaining({ page: 3, pageSize: 20, sort, keyword: 'one', filters: { '$.name': 'a' } }));
        const cell = view.container.querySelector('[data-row-index="0"] [data-col-index]')!;
        await fireEvent.click(cell);
        await fireEvent(cell, new MouseEvent('dblclick', { bubbles: true }));
        expect(single.calls.calls[0]?.[0]).toEqual(ROWS[0]);
        expect(double.calls.calls[0]?.[0]).toEqual(ROWS[0]);
        await enterText(screen.getByRole('textbox', { name: '搜索全部记录' }) as HTMLInputElement, 'two');
        expect(queries.at(-1)).toEqual(expect.objectContaining({ page: 1, keyword: 'two' }));
        expect(views.at(-1)).toEqual(expect.objectContaining({ page: 1, pageSize: 20, sortColumns: sort, keyword: 'two' }));
    });

    it('selects matching results with cross-page exclusions and exports the server query', async () => {
        const exported = mock.fn();
        let selection: ResultSelection = { mode: 'ids', ids: new Set() };
        // DOM has no layout viewport. Pin the summary column so virtualization keeps it mounted.
        const fetchColumns = async () => COLUMNS.map(col => col.name === '$.age' ? { ...col, fixed: 'right' as const } : col);
        function App() {
            const [value, setValue] = useState<ResultSelection>(selection);
            return <TablePro<PersonRow> fetchColumns={fetchColumns} pagination={{}} searchMode="server" showSearchBar showSummary
                request={async query => ({ rows: [ROWS[query.page - 1]], total: 20, summary: { '$.age': 'All ages: 55' } })}
                resultSelection={{ value, onValueChange: next => { selection = next; setValue(next); } }} onExportAll={exported} />;
        }
        await renderTable(<App />);
        expect(screen.getByText('All ages: 55')).toBeTruthy();
        await fireEvent.click(screen.getByRole('button', { name: '选择全部匹配记录' }));
        await fireEvent.click(screen.getByRole('button', { name: '页码 2' }));
        const box = screen.getByRole('checkbox', { name: '选择行' }) as HTMLInputElement;
        expect(box.checked).toBe(true);
        await fireEvent.click(box);
        expect(selection).toEqual({ mode: 'all', scope: { filters: {}, keyword: '' }, excludedIds: new Set(['2']) });
        await enterText(screen.getByRole('textbox', { name: '搜索全部记录' }) as HTMLInputElement, 'Alice');
        expect(selection).toEqual({ mode: 'ids', ids: new Set() });
        await fireEvent.click(screen.getByRole('button', { name: '导出全部匹配记录' }));
        expect(exported.calls.calls[0]?.[0]).toEqual(expect.objectContaining({ filters: {}, keyword: 'Alice', sort: [] }));
    });
    it('exposes refresh through a stable ref, retains search and selection, and clears the ref on unmount', async () => {
        const ref = createRef<TableProHandle>();
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const request = mock.fn(async () => ({ rows: ROWS.map(row => ({ ...row })), total: 80 }));
        const onError = mock.fn();
        const view = await renderTable(<StrictMode><TablePro<PersonRow> ref={ref} fetchColumns={fetchColumns} request={request}
            onError={onError} pagination={{}} showSearchBar rowSelection={{ type: 'checkbox' }} style={{ width: 700, height: 400 }} /></StrictMode>);
        const handle = ref.current!;
        expect(typeof handle.refresh).toBe('function');
        const search = screen.getByRole('textbox', { name: '搜索表格' }) as HTMLInputElement;
        await enterText(search, 'Alice');
        await act(async () => { await fireEvent.click(screen.getAllByRole('checkbox', { name: localeMessages['zh-CN'].table.selectRow })[0]); });
        await act(async () => { await fireEvent.click(screen.getByRole('button', { name: '页码 2' })); });
        const columnCount = fetchColumns.calls.calls.length;
        const requestCount = request.calls.calls.length;
        await act(() => handle.refresh());
        expect(request).toHaveBeenCalledTimes(requestCount + 1);
        expect(fetchColumns).toHaveBeenCalledTimes(columnCount);
        expect(ref.current).toBe(handle);
        expect(screen.getByRole('textbox', { name: '搜索表格' })).toBe(search);
        expect(search.value).toBe('Alice');
        expect((screen.getAllByRole('checkbox', { name: localeMessages['zh-CN'].table.selectRow })[0] as HTMLInputElement).checked).toBe(true);
        expect(view.container.querySelector('[aria-current="page"]')?.textContent).toBe('2');
        expect(onError).not.toHaveBeenCalled();
        await view.unmount();
        expect(ref.current).toBeNull();
    });
    it.each(['top', 'bottom', 'both'] as const)('keeps search available with %s pagination', async (position) => {
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<PaginatedFetchFn>().resolve({ rows: ROWS, total: ROWS.length });
        const view = await renderTable(<ConfigProvider designSystem="md3" colorMode="light" locale="zh-CN"><TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} showSearchBar pagination={{ position }} style={{ width: 700, height: 400 }} /></ConfigProvider>);
        const search = screen.getByRole('textbox', { name: '搜索表格' }) as HTMLInputElement;
        await enterText(search, 'Alice');
        expect(search.value).toBe('Alice');
        await view.rerender(<ConfigProvider designSystem="macos" colorMode="dark" locale="en-US"><TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} showSearchBar pagination={{ position }} style={{ width: 700, height: 400 }} /></ConfigProvider>);
        const configuredSearch = screen.getByRole('textbox', { name: 'Search table' }) as HTMLInputElement;
        expect(configuredSearch === search).toBe(true);
        expect(configuredSearch.value).toBe('Alice');
        await enterText(configuredSearch, 'Bob');
        await view.rerender(<ConfigProvider designSystem="shadcn" colorMode="light" locale="zh-CN"><TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} showSearchBar pagination={{ position }} style={{ width: 700, height: 400 }} /></ConfigProvider>);
        expect(screen.getByRole('textbox', { name: '搜索表格' }) === configuredSearch).toBe(true);
        expect(configuredSearch.value).toBe('Bob');
    });
    it.each([false, true])('shows empty content only after a successful empty response (custom=%s)', async (custom) => {
        const result = deferred<PersonRow[]>();
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>().return(result.promise);
        const emptyText = custom ? 'Custom empty result' : localeMessages['zh-CN'].empty.default.title;
        const { container } = await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData}
            empty={custom ? <span>{emptyText}</span> : undefined} style={{ width: 400, height: 300 }} />);
        expect(container.querySelector('[data-testid="protocol-table-loading"]')).toBeTruthy();
        expect(screen.queryByText(emptyText)).toBeNull();
        await act(async () => { result.resolve([]); await result.promise; });
        await waitFor(() => expect(container.querySelector('[data-testid="protocol-table-loading"]')).toBeNull());
        expect(screen.getByText(emptyText)).toBeTruthy();
        expect(fetchData).toHaveBeenCalledTimes(1);
    });

    it.each(['columns', 'data'] as const)('keeps empty content absent through a %s error and pending retry', async (source) => {
        const retriedColumns = deferred<ProtocolColumnType[]>();
        const retriedRows = deferred<PersonRow[]>();
        let columnRequests = 0;
        let dataRequests = 0;
        const fetchColumns = async () => {
            columnRequests++;
            if (source !== 'columns') return COLUMNS;
            if (columnRequests === 1) throw new Error('Columns unavailable');
            return retriedColumns.promise;
        };
        const fetchData = async () => {
            dataRequests++;
            if (source !== 'data') return [];
            if (dataRequests === 1) throw new Error('Data unavailable');
            return retriedRows.promise;
        };
        const { container } = await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData}
            empty={<span>Custom empty result</span>} style={{ width: 400, height: 300 }} />);
        const errorSelector = `[data-testid="protocol-table-${source}-error"]`;
        await waitFor(() => expect(container.querySelector(errorSelector)).toBeTruthy());
        expect(screen.queryByText('Custom empty result')).toBeNull();
        expect(screen.queryByText(localeMessages['zh-CN'].empty.default.title)).toBeNull();
        await act(async () => { await fireEvent.click(screen.getByRole('button', { name: localeMessages['zh-CN'].tablePro.retry })); });
        expect(container.querySelector(errorSelector)).toBeNull();
        expect(container.querySelector('[data-testid="protocol-table-loading"]')).toBeTruthy();
        expect(screen.queryByText('Custom empty result')).toBeNull();
        await act(async () => {
            retriedColumns.resolve(COLUMNS);
            retriedRows.resolve([]);
            await Promise.all([retriedColumns.promise, retriedRows.promise]);
        });
        await waitFor(() => expect(screen.getByText('Custom empty result')).toBeTruthy());
        expect(columnRequests).toBe(source === 'columns' ? 2 : 1);
        expect(dataRequests).toBe(source === 'data' ? 2 : 1);
    });

    it('retains loaded rows during refresh and a failed refresh, then shows a successful empty retry', async () => {
        const refresh = deferred<{ rows: PersonRow[]; total: number }>();
        let requests = 0;
        const request = async () => {
            requests++;
            if (requests === 1) return { rows: ROWS, total: ROWS.length };
            if (requests === 2) return refresh.promise;
            return { rows: [], total: 0 };
        };
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const { container } = await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns} request={request}
            pagination={{}} empty={<span>Custom empty result</span>} style={{ width: 400, height: 300 }} />);
        await waitFor(() => expect(screen.getByText('Alice')).toBeTruthy());
        await act(async () => { await fireEvent.click(screen.getByRole('button', { name: localeMessages['zh-CN'].tablePro.refresh })); });
        expect(container.querySelector('[data-testid="protocol-table-loading"]')).toBeTruthy();
        expect(screen.getByText('Alice')).toBeTruthy();
        expect(screen.getByText('Bob')).toBeTruthy();
        expect(screen.queryByText('Custom empty result')).toBeNull();
        await act(async () => { refresh.reject(new Error('Refresh failed')); await refresh.promise.catch(() => undefined); });
        await waitFor(() => expect(container.querySelector('[data-testid="protocol-table-data-error"]')).toBeTruthy());
        expect(screen.getByText('Alice')).toBeTruthy();
        expect(screen.queryByText('Custom empty result')).toBeNull();
        await act(async () => { await fireEvent.click(screen.getByRole('button', { name: localeMessages['zh-CN'].tablePro.retry })); });
        await waitFor(() => expect(screen.getByText('Custom empty result')).toBeTruthy());
        expect(screen.queryByText('Alice')).toBeNull();
        expect(requests).toBe(3);
    });

    it('preserves the original pagination click event through its request adapter', async () => {
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<PaginatedFetchFn>().resolve({ rows: ROWS, total: 80 });
        const changed = mock.fn<PaginationChangeHandler>();
        await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData}
            pagination={{ onValueChange: changed }} style={{ width: 700, height: 400 }} />);
        await waitFor(() => expect(screen.getByRole('button', { name: '页码 2' })).toBeTruthy());
        const button = screen.getByRole('button', { name: '页码 2' });
        await act(async () => { await fireEvent.click(button); });
        expect(changed).toHaveBeenCalledTimes(1);
        expect(changed.calls.calls[0][0]).toBe(2);
        const details = changed.calls.calls[0][1];
        expect(details).toEqual(expect.objectContaining({ pageSize: 10, reason: 'page' }));
        expect(details.event?.type).toBe('click');
        expect(details.event?.target).toBe(button);
        expect(fetchData).toHaveBeenCalledWith(2, 10, {});
    });
    it('forwards the original row-selection event with the loaded row model', async () => {
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>().resolve(ROWS);
        const changed = mock.fn<NonNullable<RowSelection<PersonRow>['onSelectedRowIdsChange']>>();
        await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData}
            rowSelection={{ type: 'checkbox', onSelectedRowIdsChange: changed }} style={{ width: 700, height: 400 }} />);
        await waitFor(() => expect(screen.getAllByRole('checkbox', { name: localeMessages['zh-CN'].table.selectRow })).toHaveLength(2));
        const checkbox = screen.getAllByRole('checkbox', { name: localeMessages['zh-CN'].table.selectRow })[0];
        await act(async () => { await fireEvent.click(checkbox); });
        expect(changed).toHaveBeenCalledTimes(1);
        expect(changed.calls.calls[0][0]).toEqual(new Set(['1']));
        const details = changed.calls.calls[0][1];
        expect(details).toEqual(expect.objectContaining({ reason: 'row', rows: [ROWS[0]] }));
        expect(details.event?.type).toBe('change');
        expect(details.event?.target).toBe(checkbox);
        expect(details.event?.nativeEvent.target).toBe(checkbox);
    });
    it('inherits toolbar and column-panel language while retaining business titles', async () => {
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>().resolve(ROWS);
        const view = await renderTable(<ConfigProvider locale="en-US"><TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} sideBar showSearchBar style={{ width: 700, height: 400 }} /></ConfigProvider>);
        await waitFor(() => expect(fetchColumns).toHaveBeenCalledTimes(1));
        expect(screen.getByRole('textbox', { name: localeMessages['en-US'].tablePro.searchTable })).toBeTruthy();
        await act(async () => { await fireEvent.click(screen.getByRole('button', { name: localeMessages['en-US'].tablePro.columns })); });
        expect(screen.getByRole('textbox', { name: localeMessages['en-US'].tablePro.searchColumns })).toBeTruthy();
        await view.rerender(<ConfigProvider locale="zh-CN"><TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} sideBar showSearchBar style={{ width: 700, height: 400 }} /></ConfigProvider>);
        expect(screen.getByRole('textbox', { name: localeMessages['zh-CN'].tablePro.searchColumns })).toBeTruthy();
    });
    it("keeps labeled filter controls usable when opening and closing the sidebar", async () => {
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve([COLUMNS[0]]);
        const fetchData = mock.fn<FetchDataFn>().resolve(ROWS);
        await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} sideBar
            renderDefaultFilterEditor={({ value, onValueChange }) => <LineEdit label="筛选值" supportingText="输入名称" value={value} onChange={event => onValueChange(event.target.value)} />}
            style={{ width: 700, height: 400 }} />);
        await waitFor(() => expect(fetchColumns).toHaveBeenCalledTimes(1));
        const filters = screen.getByRole('button', { name: '筛选' });
        expect(filters.getAttribute('aria-expanded')).toBe('false');
        await act(async () => { await fireEvent.click(filters); });
        expect(filters.getAttribute('aria-expanded')).toBe('true');
        const input = screen.getByRole('textbox', { name: '筛选值' });
        expect(document.getElementById(input.getAttribute('aria-describedby')!)?.textContent).toBe('输入名称');
        await act(async () => {
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, 'Alice');
            await fireEvent(input, new Event('input', { bubbles: true }));
        });
        await waitFor(() => expect(fetchData).toHaveBeenCalledWith({ '$.name': 'Alice' }));
        await act(async () => { await fireEvent.click(filters); });
        expect(filters.getAttribute('aria-expanded')).toBe('false');
        await act(async () => { await fireEvent.click(filters); });
        expect((screen.getByRole('textbox', { name: '筛选值' }) as HTMLInputElement).value).toBe('Alice');
    });

    it("calls fetchColumns and fetchData on mount", async () => {
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>().resolve(ROWS);
        await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(fetchColumns).toHaveBeenCalledTimes(1);
            expect(fetchData).toHaveBeenCalledTimes(1);
        });
    });
    it("re-fetches columns when fetchColumns prop changes", async () => {
        const fetchColumns1 = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchColumns2 = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>().resolve(ROWS);
        const { rerender } = await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns1} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => expect(fetchColumns1).toHaveBeenCalledTimes(1));
        await rerender(<TablePro<PersonRow> fetchColumns={fetchColumns2} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => expect(fetchColumns2).toHaveBeenCalledTimes(1));
    });
    it("calls fetchData with page / pageSize / filters in pagination mode", async () => {
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<PaginatedFetchFn>()
            .resolve({ rows: ROWS, total: ROWS.length });
        await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} pagination={{ defaultPageSize: 20 }} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(fetchData).toHaveBeenCalledWith(1, 20, {});
        });
    });
    it("shows loading overlay then removes it after data loads", async () => {
        let resolveData!: (rows: PersonRow[]) => void;
        const dataPromise = new Promise<PersonRow[]>((res) => { resolveData = res; });
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>().return(dataPromise);
        const { container } = await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
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
        const { container } = await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(container.querySelector('[data-testid="protocol-table-columns-error"]')).toBeTruthy();
        });
        expect(container.querySelector('[data-testid="protocol-table-loading"]')).toBeNull();
        expect(container.querySelector('[role="alert"]')?.textContent).toContain('网络错误');
    });
    it("shows data error overlay when fetchData rejects", async () => {
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>().reject(new Error("服务器错误"));
        const { container } = await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(container.querySelector('[data-testid="protocol-table-data-error"]')).toBeTruthy();
        });
        expect(container.querySelector('[data-testid="protocol-table-loading"]')).toBeNull();
        expect(container.querySelector('[role="alert"]')?.textContent).toContain('服务器错误');
    });
    it("calls onError with source='columns' when fetchColumns rejects", async () => {
        type OnErrorFn = (error: Error, source: "columns" | "data") => void;
        const onError = mock.fn<OnErrorFn>();
        const fetchColumns = mock.fn<FetchColumnsFn>().reject(new Error("列加载失败"));
        const fetchData = mock.fn<FetchDataFn>().resolve(ROWS);
        await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} onError={onError} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(expect.any(Error), "columns");
        });
    });
    it("calls onError with source='data' when fetchData rejects", async () => {
        type OnErrorFn = (error: Error, source: "columns" | "data") => void;
        const onError = mock.fn<OnErrorFn>();
        const fetchColumns = mock.fn<FetchColumnsFn>().resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>().reject(new Error("数据加载失败"));
        await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} onError={onError} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(expect.any(Error), "data");
        });
    });
    it("retries fetchColumns when retry button is clicked after columns error", async () => {
        const fetchColumns = mock.fn<FetchColumnsFn>()
            .rejectOnce(new Error("首次失败"))
            .resolve(COLUMNS);
        const fetchData = mock.fn<FetchDataFn>().resolve(ROWS);
        const { container } = await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(container.querySelector('[data-testid="protocol-table-columns-error"]')).toBeTruthy();
        });
        await act(async () => { await fireEvent.click(screen.getByText("重试")); });
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
        const { container } = await renderTable(<TablePro<PersonRow> fetchColumns={fetchColumns} fetchData={fetchData} style={{ width: 400, height: 300 }}/>);
        await waitFor(() => {
            expect(container.querySelector('[data-testid="protocol-table-data-error"]')).toBeTruthy();
        });
        await act(async () => { await fireEvent.click(screen.getByText("重试")); });
        await waitFor(() => {
            expect(container.querySelector('[data-testid="protocol-table-data-error"]')).toBeNull();
            expect(fetchData).toHaveBeenCalledTimes(2);
        });
    });
});
