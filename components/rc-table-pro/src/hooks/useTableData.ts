import { useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { Row, SortColumn } from "@crab-dev/rc-table";
import type { TableDataSource } from "../types.js";
import type { PaginationChangeDetails } from '@crab-dev/rc-pagination';

export type UseTableDataOptions<T extends Row> = TableDataSource<T> & {
    autoRefreshInterval?: number;
    onError?: (error: Error) => void;
    sortMode?: 'client' | 'server';
    sortColumns?: SortColumn[];
    defaultSortColumns?: SortColumn[];
    onSortColumnsChange?: (columns: SortColumn[]) => void;
};

export interface UseTableDataReturn<T extends Row> {
    rows: T[];
    total: number;
    page: number;
    pageSize: number;
    filters: Record<string, string>;
    sortColumns: SortColumn[];
    dataLoading: boolean;
    dataError: Error | null;
    refresh: () => Promise<void>;
    handlePageChange: (page: number, pageSize: number, reason?: PaginationChangeDetails['reason'], event?: PaginationChangeDetails['event']) => void;
    handleFilterChange: (filters: Record<string, string>) => void;
    handleSortChange: (columns: SortColumn[]) => void;
    restoreFilters: (filters: Record<string, string>) => void;
}

export function useTableData<T extends Row>(options: UseTableDataOptions<T>): UseTableDataReturn<T> {
    const { pagination, autoRefreshInterval, sortMode = 'client' } = options;
    const [rows, setRows] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(pagination ? pagination.defaultPageSize ?? 10 : 10);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [innerSort, setInnerSort] = useState<SortColumn[]>(options.defaultSortColumns ?? []);
    const sortColumns = options.sortColumns ?? innerSort;
    // 只表示最新有效请求的状态；已取消但尚未 settle 的旧请求不应延长 loading。
    const [dataLoading, setDataLoading] = useState(true);
    const [dataError, setDataError] = useState<Error | null>(null);
    // latest-ref 例外：稳定命令读取最近提交的配置，避免内联 request 引用触发重复加载。
    const latest = useRef({ options, sortColumns });
    useLayoutEffect(() => { latest.current = { options, sortColumns }; });
    // 可变实例状态：请求取消和当前查询参数在事件之间同步，避免快速连续交互读到旧状态。
    const activeRequest = useRef<AbortController | null>(null);
    const params = useRef({ page, pageSize, filters });
    const mounted = useRef(false);

    // 稳定引用供 effect 和调用者依赖；latest-ref 避免绑定某次渲染的请求函数。
    const loadData = useCallback((nextPage: number, nextPageSize: number, nextFilters: Record<string, string>): Promise<void> => {
        if (!mounted.current) return Promise.reject(new globalThis.DOMException('TablePro is unmounted', 'AbortError'));
        activeRequest.current?.abort();
        const controller = new AbortController();
        activeRequest.current = controller;
        params.current = { page: nextPage, pageSize: nextPageSize, filters: nextFilters };
        setDataLoading(true);
        setDataError(null);
        const { options: current, sortColumns: sort } = latest.current;
        // 取消必须立即结束公开 Promise，兼容不消费 signal 的 request 和旧 fetchData。
        return new Promise<void>((resolve, reject) => {
            const cleanup = () => {
                controller.signal.removeEventListener('abort', onAbort);
                if (activeRequest.current === controller) activeRequest.current = null;
            };
            const onAbort = () => { cleanup(); reject(controller.signal.reason); };
            controller.signal.addEventListener('abort', onAbort, { once: true });
            const succeed = (requestedPage: number, nextRows: T[], nextTotal: number) => {
                if (controller.signal.aborted || !mounted.current) return;
                // 同一次刷新内回退到有效页，调用方等待的 Promise 包含回退请求。
                const lastPage = Math.max(1, Math.ceil(nextTotal / nextPageSize));
                if (current.pagination && Number.isFinite(lastPage) && nextPageSize > 0 && requestedPage > lastPage) {
                    params.current = { page: lastPage, pageSize: nextPageSize, filters: nextFilters };
                    setPage(lastPage);
                    requestPage(lastPage);
                    return;
                }
                setRows(nextRows);
                setTotal(nextTotal);
                setDataLoading(false);
                cleanup();
                resolve();
            };
            const fail = (reason: unknown) => {
                if (controller.signal.aborted || !mounted.current) return;
                const error = reason instanceof Error ? reason : new Error(String(reason));
                setDataError(error);
                setDataLoading(false);
                cleanup();
                reject(error);
                latest.current.options.onError?.(error);
            };
            const requestPage = (requestedPage: number) => {
                try {
                    if (current.request) {
                        void current.request({
                            page: requestedPage, pageSize: nextPageSize, filters: { ...nextFilters },
                            sort: current.sortMode === 'server' ? sort.map(column => ({ ...column })) : [],
                            signal: controller.signal,
                        }).then(result => succeed(requestedPage, result.rows, result.total), fail);
                    } else if (current.pagination) {
                        void current.fetchData(requestedPage, nextPageSize, { ...nextFilters })
                            .then(result => succeed(requestedPage, result.rows, result.total), fail);
                    } else {
                        void current.fetchData({ ...nextFilters }).then(rows => succeed(requestedPage, rows, rows.length), fail);
                    }
                } catch (error) {
                    fail(error);
                }
            };
            requestPage(nextPage);
        });
    }, []);

    useLayoutEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; activeRequest.current?.abort(); };
    }, []);

    // 稳定公开命令：读取同步查询快照，不捕获某次渲染的页码或筛选。
    const refresh = useCallback(() => {
        const current = params.current;
        return loadData(current.page, current.pageSize, current.filters);
    }, [loadData]);

    // 排序按值比较；父组件重建相同数组不会重复拉取。客户端排序无需请求。
    const sortKey = sortMode === 'server' ? JSON.stringify(sortColumns) : '';
    useEffect(() => {
        setPage(1);
        const current = params.current;
        void loadData(1, current.pageSize, current.filters).catch(() => {});
    }, [loadData, sortKey, sortMode]);

    useEffect(() => {
        if (!autoRefreshInterval || autoRefreshInterval <= 0) return;
        const timer = setInterval(() => {
            void refresh().catch(() => {});
        }, autoRefreshInterval);
        return () => clearInterval(timer);
    }, [autoRefreshInterval, refresh]);

    const handlePageChange = (nextPage: number, nextPageSize: number, reason: PaginationChangeDetails['reason'] = 'page', event?: PaginationChangeDetails['event']) => {
        setPage(nextPage);
        setPageSize(nextPageSize);
        void loadData(nextPage, nextPageSize, params.current.filters).catch(() => {});
        if (pagination) pagination.onValueChange?.(nextPage, { pageSize: nextPageSize, reason, ...(event ? { event } : {}) });
    };
    const handleFilterChange = (nextFilters: Record<string, string>) => {
        setFilters(nextFilters);
        setPage(1);
        void loadData(1, params.current.pageSize, nextFilters).catch(() => {});
    };
    const handleSortChange = (columns: SortColumn[]) => {
        if (options.sortColumns === undefined) setInnerSort(columns);
        options.onSortColumnsChange?.(columns);
    };
    return {
        rows, total, page, pageSize, filters, sortColumns, dataLoading, dataError, refresh,
        handlePageChange, handleFilterChange, handleSortChange, restoreFilters: handleFilterChange,
    };
}
