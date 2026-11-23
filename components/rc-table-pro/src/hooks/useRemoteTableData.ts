import { useCallback, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { Row, SortColumn, TableIndexedRows } from '@crab-dev/rc-table';
import { createBlockCache, type BlockCache } from '../blockCache.js';
import type { ProtocolTableState, TableRemoteRows } from '../types.js';
import { positiveInteger } from '../util.js';
import type { UseTableDataReturn } from './useTableData.js';

interface RemoteTableDataOptions<T extends Row> {
    remoteRows: TableRemoteRows<T>;
    initialState?: ProtocolTableState;
    autoRefreshInterval?: number;
    sortColumns?: SortColumn[];
    defaultSortColumns?: SortColumn[];
    onSortColumnsChange?: (columns: SortColumn[]) => void;
    onError?: (error: Error, source: 'data' | 'columns') => void;
}

export interface RemoteTableData<T extends Row> extends Omit<UseTableDataReturn<T>, 'rows' | 'page' | 'pageSize' | 'handlePageChange'> {
    indexedRows: TableIndexedRows<T>;
    blockSize: number;
    blockErrors: ReadonlyMap<number, Error>;
    retryBlock: (block: number) => void;
}

export function useRemoteTableData<T extends Row>(options: RemoteTableDataOptions<T>): RemoteTableData<T> {
    const { remoteRows, initialState, autoRefreshInterval, onError } = options;
    const [filters, setFilters] = useState(() => initialState?.filters ?? {});
    const [keyword, setKeyword] = useState(() => initialState?.keyword ?? '');
    const [innerSort, setInnerSort] = useState(() => initialState?.sortColumns ?? options.defaultSortColumns ?? []);
    const sortColumns = options.sortColumns ?? innerSort;
    const blockSize = positiveInteger(remoteRows.blockSize, 100);
    const maxCachedBlocks = positiveInteger(remoteRows.maxCachedBlocks, 8);
    const maxConcurrentRequests = positiveInteger(remoteRows.maxConcurrentRequests, 2);
    const filtersKey = JSON.stringify(filters, Object.keys(filters).sort());
    const sortKey = JSON.stringify(sortColumns);
    const { cacheKey, request } = remoteRows;

    // Inline request functions are common. Read the committed callback without discarding the cache on re-render.
    const latest = useRef({ request, onError });
    useLayoutEffect(() => { latest.current = { request, onError }; });
    // Value-based dependencies keep equivalent filters and controlled sorts in the same query generation.
    const cache = useMemo(() => createBlockCache<T>({
        blockSize, maxCachedBlocks, maxConcurrentRequests,
        query: { filters: JSON.parse(filtersKey) as Record<string, string>, keyword, sort: JSON.parse(sortKey) as SortColumn[] },
        request: query => latest.current.request(query),
        onError: error => latest.current.onError?.(error, 'data'),
    }), [blockSize, maxCachedBlocks, maxConcurrentRequests, filtersKey, keyword, sortKey, cacheKey]);
    const activeCache = useRef<BlockCache<T> | null>(null);
    useLayoutEffect(() => {
        activeCache.current = cache;
        cache.start();
        return () => {
            activeCache.current = null;
            cache.stop();
        };
    }, [cache]);
    const snapshot = useSyncExternalStore(cache.subscribe, cache.getSnapshot, cache.getSnapshot);
    // A saved handle always refreshes the active query.
    const refresh = useCallback(() => activeCache.current?.refresh()
        ?? Promise.reject(new globalThis.DOMException('The table is unmounted', 'AbortError')), []);

    useLayoutEffect(() => {
        if (!autoRefreshInterval || autoRefreshInterval <= 0) return;
        const timer = setInterval(() => {
            const current = cache.getSnapshot();
            if (current.refreshing || (current.total === undefined && !current.error)) return;
            void refresh().catch(() => {});
        }, autoRefreshInterval);
        return () => clearInterval(timer);
    }, [autoRefreshInterval, cache, refresh]);

    return {
        indexedRows: {
            count: snapshot.total ?? 0,
            rowHeight: remoteRows.rowHeight,
            rows: snapshot.rows,
            onRangeChange: cache.setRange,
        },
        blockSize,
        blockErrors: snapshot.errors,
        retryBlock: cache.retry,
        total: snapshot.total ?? 0,
        summary: snapshot.summary,
        dataLoading: snapshot.refreshing || (snapshot.total === undefined && !snapshot.error),
        dataError: snapshot.error,
        keyword,
        filters,
        sortColumns,
        refresh,
        handleKeywordChange: setKeyword,
        handleFilterChange: setFilters,
        handleSortChange: columns => {
            if (options.sortColumns === undefined) setInnerSort(columns);
            options.onSortColumnsChange?.(columns);
        },
    };
}
