import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, renderHook } from '@crab-dev/wake/test/react';
import type { Row, SortColumn } from '@crab-dev/rc-table';
import { useTableData } from '../hooks/useTableData.js';
import type { TableDataResult, TableQuery } from '../types.js';

describe('TablePro request lifecycle', () => {
    it('aborts superseded requests and ignores late success and failure', async () => {
        const requests: Array<{ query: TableQuery } & ReturnType<typeof Promise.withResolvers<TableDataResult<Row>>>> = [];
        const onError = mock.fn();
        const view = await renderHook(() => useTableData<Row>({
            pagination: { defaultPageSize: 20 }, onError,
            request: (query) => {
                const pending = Promise.withResolvers<TableDataResult<Row>>();
                requests.push({ query, ...pending });
                return pending.promise;
            },
        }));
        await act(() => view.result.current.handleFilterChange({ name: 'latest' }));
        expect(requests[0].query.signal.aborted).toBe(true);
        expect(requests[1].query.filters).toEqual({ name: 'latest' });
        await act(async () => { requests[1].resolve({ rows: [{ id: 'new', dataRef: null }], total: 1 }); });
        await act(async () => { requests[0].resolve({ rows: [{ id: 'old', dataRef: null }], total: 90 }); });
        expect(view.result.current.rows).toEqual([{ id: 'new', dataRef: null }]);
        expect(view.result.current.total).toBe(1);
        await act(() => view.result.current.handlePageChange(2, 20));
        await act(() => view.result.current.handlePageChange(3, 20));
        await act(async () => { requests[2].reject(new Error('obsolete')); });
        expect(view.result.current.dataLoading).toBe(true);
        expect(view.result.current.dataError).toBeNull();
        expect(onError).not.toHaveBeenCalled();
        await view.unmount();
        expect(requests[3].query.signal.aborted).toBe(true);
        await act(async () => { requests[3].reject(new Error('unmounted')); });
        expect(onError).not.toHaveBeenCalled();
    });

    it('captures synchronous request failures and recovers on the next query', async () => {
        const error = new Error('sync failure');
        const onError = mock.fn();
        const view = await renderHook(() => useTableData<Row>({
            onError, request: (query) => {
                if (!query.filters.retry) throw error;
                return Promise.resolve({ rows: [{ id: 'recovered', dataRef: null }], total: 1 });
            },
        }));
        expect(view.result.current.dataError).toBe(error);
        expect(view.result.current.dataLoading).toBe(false);
        expect(onError).toHaveBeenCalledWith(error);
        await act(() => view.result.current.handleFilterChange({ retry: 'yes' }));
        expect(view.result.current.dataError).toBeNull();
        expect(view.result.current.rows).toEqual([{ id: 'recovered', dataRef: null }]);
    });

    it('sends server sort, resets pagination and compares controlled sort by value', async () => {
        const queries: TableQuery[] = [];
        const view = await renderHook(({ sort }: { sort: SortColumn[] }) => useTableData<Row>({
            pagination: {}, sortMode: 'server', sortColumns: sort,
            request: query => { queries.push(query); return new Promise<TableDataResult<Row>>(() => {}); },
        }), { initialProps: { sort: [] as SortColumn[] } });
        await act(() => view.result.current.handlePageChange(3, 10));
        await view.rerender({ sort: [{ columnName: 'name', direction: 'asc' }] });
        expect(queries.at(-1)?.sort).toEqual([{ columnName: 'name', direction: 'asc' }]);
        expect(queries.at(-1)?.page).toBe(1);
        expect(view.result.current.page).toBe(1);
        const count = queries.length;
        await view.rerender({ sort: [{ columnName: 'name', direction: 'asc' }] });
        expect(queries.length).toBe(count);
    });

    it('keeps legacy loaders compatible and does not reload for client sorting', async () => {
        const pending = Promise.withResolvers<Row[]>();
        const fetchData = mock.fn((_filters: Record<string, string>) => pending.promise);
        const view = await renderHook(() => useTableData({ fetchData }));
        await act(async () => { pending.resolve([{ id: 'legacy', dataRef: null }]); });
        expect(fetchData).toHaveBeenCalledWith({});
        await act(() => view.result.current.handleSortChange([{ columnName: 'name', direction: 'desc' }]));
        expect(fetchData).toHaveBeenCalledTimes(1);
        expect(view.result.current.rows).toEqual([{ id: 'legacy', dataRef: null }]);
    });
});
