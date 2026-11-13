import { clock, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, renderHook } from '@crab-dev/wake/test/react';
import type { Row } from '@crab-dev/rc-table';
import { useTableData } from '../hooks/useTableData.js';
import type { TableDataResult, TableQuery } from '../types.js';

describe('TablePro refresh command', () => {
    it('uses the latest loader and preserves the current query without reloading on function identity changes', async () => {
        const queries: TableQuery[] = [];
        const initialRows: Row[] = [{ id: 'old', dataRef: null }];
        const pending = Promise.withResolvers<TableDataResult<Row>>();
        const view = await renderHook(({ revision }: { revision: number }) => useTableData<Row>({
            pagination: {}, sortMode: 'server',
            defaultSortColumns: [{ columnName: 'name', direction: 'asc' }],
            request: query => {
                queries.push(query);
                return revision === 0 ? Promise.resolve({ rows: initialRows, total: 100 }) : pending.promise;
            },
        }), { initialProps: { revision: 0 } });
        const refresh = view.result.current.refresh;
        await act(() => view.result.current.handleFilterChange({ name: 'Alice' }));
        await act(() => view.result.current.handleSortChange([{ columnName: 'age', direction: 'desc' }]));
        await act(() => view.result.current.handlePageChange(3, 20));
        const count = queries.length;
        await view.rerender({ revision: 1 });
        expect(queries.length).toBe(count);
        expect(view.result.current.refresh).toBe(refresh);
        let completion!: Promise<void>;
        let completed = false;
        await act(() => { completion = refresh().then(() => { completed = true; }); });
        expect(queries.at(-1)).toEqual(expect.objectContaining({
            page: 3, pageSize: 20, filters: { name: 'Alice' }, sort: [{ columnName: 'age', direction: 'desc' }],
        }));
        expect(completed).toBe(false);
        expect(view.result.current.rows).toEqual(initialRows);
        expect(view.result.current.dataLoading).toBe(true);
        await act(async () => {
            pending.resolve({ rows: [{ id: 'new', dataRef: null }], total: 100 });
            await completion;
        });
        expect(completed).toBe(true);
        expect(view.result.current.page).toBe(3);
        expect(view.result.current.rows[0].id).toBe('new');
        expect(view.result.current.dataLoading).toBe(false);
    });

    it.each([11, 0])('waits for the corrected page after the total shrinks to %s', async (total) => {
        const queries: TableQuery[] = [];
        const corrected = Promise.withResolvers<TableDataResult<Row>>();
        let shrinking = false;
        const view = await renderHook(() => useTableData<Row>({
            pagination: {}, request: query => {
                queries.push(query);
                if (!shrinking) return Promise.resolve({ rows: [{ id: 'old', dataRef: null }], total: 30 });
                return query.page === 3 ? Promise.resolve({ rows: [], total }) : corrected.promise;
            },
        }));
        await act(() => view.result.current.handlePageChange(3, 10));
        shrinking = true;
        let completion!: Promise<void>;
        let completed = false;
        await act(() => { completion = view.result.current.refresh().then(() => { completed = true; }); });
        expect(view.result.current.page).toBe(total === 0 ? 1 : 2);
        expect(queries.at(-1)?.signal).toBe(queries.at(-2)?.signal);
        expect(view.result.current.rows[0].id).toBe('old');
        expect(view.result.current.dataLoading).toBe(true);
        expect(completed).toBe(false);
        await act(async () => { corrected.resolve({ rows: [], total }); await completion; });
        expect(completed).toBe(true);
        expect(view.result.current.total).toBe(total);
        expect(view.result.current.rows).toEqual([]);
    });

    it.each(['sync', 'async'] as const)('rejects a %s failure, reports it once, and recovers', async (kind) => {
        const error = new Error('Refresh failed');
        const onError = mock.fn();
        let failing = false;
        const view = await renderHook(() => useTableData<Row>({
            onError, request: () => {
                if (failing) {
                    if (kind === 'sync') throw error;
                    return Promise.reject(error);
                }
                return Promise.resolve({ rows: [{ id: 'retained', dataRef: null }], total: 1 });
            },
        }));
        failing = true;
        let rejected: unknown;
        await act(async () => { rejected = await view.result.current.refresh().catch(reason => reason); });
        expect(rejected).toBe(error);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(view.result.current.dataError).toBe(error);
        expect(view.result.current.rows[0].id).toBe('retained');
        expect(view.result.current.dataLoading).toBe(false);
        failing = false;
        await act(() => view.result.current.refresh());
        expect(view.result.current.dataError).toBeNull();
    });

    it.each(['refresh', 'query', 'unmount'] as const)('promptly rejects when replaced by %s even if the loader ignores cancellation', async (replacement) => {
        const requests: Array<ReturnType<typeof Promise.withResolvers<TableDataResult<Row>>>> = [];
        const onError = mock.fn();
        const view = await renderHook(() => useTableData<Row>({
            onError, request: () => {
                const pending = Promise.withResolvers<TableDataResult<Row>>();
                requests.push(pending);
                return pending.promise;
            },
        }));
        const refresh = view.result.current.refresh;
        let cancelled!: Promise<unknown>;
        await act(() => { cancelled = refresh().catch(reason => reason); });
        let next: Promise<unknown> | undefined;
        if (replacement === 'unmount') await view.unmount();
        else await act(() => {
            if (replacement === 'refresh') next = refresh().catch(reason => reason);
            else view.result.current.handleFilterChange({ name: 'new' });
        });
        expect(await cancelled).toEqual(expect.objectContaining({ name: 'AbortError' }));
        if (replacement !== 'unmount') {
            expect(view.result.current.dataLoading).toBe(true);
            await act(async () => {
                requests.at(-1)!.resolve({ rows: [{ id: 'latest', dataRef: null }], total: 1 });
                await next;
            });
            await act(async () => { requests[1].resolve({ rows: [{ id: 'stale', dataRef: null }], total: 1 }); });
            expect(view.result.current.rows[0].id).toBe('latest');
        } else {
            expect(await refresh().catch(reason => reason)).toEqual(expect.objectContaining({ name: 'AbortError' }));
        }
        expect(onError).not.toHaveBeenCalled();
    });

    it.each([false, true])('refreshes legacy fetchData with pagination=%s', async (paginated) => {
        const calls: unknown[][] = [];
        const view = await renderHook(() => useTableData<Row>(paginated ? {
            pagination: {}, fetchData: async (...args: [number, number, Record<string, string>]) => { calls.push(args); return { rows: [], total: 100 }; },
        } : {
            fetchData: async (...args: [Record<string, string>]) => { calls.push(args); return []; },
        }));
        await act(() => view.result.current.handleFilterChange({ name: 'Alice' }));
        if (paginated) await act(() => view.result.current.handlePageChange(2, 20));
        await act(() => view.result.current.refresh());
        expect(calls.at(-1)).toEqual(paginated ? [2, 20, { name: 'Alice' }] : [{ name: 'Alice' }]);
    });

    it('auto-refreshes the current query through the same request lifecycle', async () => {
        await clock.fake();
        try {
            const queries: TableQuery[] = [];
            const view = await renderHook(() => useTableData<Row>({
                autoRefreshInterval: 1000, pagination: {},
                request: async query => { queries.push(query); return { rows: [], total: 100 }; },
            }));
            await act(() => view.result.current.handleFilterChange({ status: 'open' }));
            await act(() => view.result.current.handlePageChange(2, 20));
            const count = queries.length;
            await act(async () => { await clock.advanceBy(1000); });
            expect(queries.length).toBe(count + 1);
            expect(queries.at(-1)).toEqual(expect.objectContaining({ page: 2, pageSize: 20, filters: { status: 'open' } }));
            await view.unmount();
        } finally {
            await clock.restore();
        }
    });
});
