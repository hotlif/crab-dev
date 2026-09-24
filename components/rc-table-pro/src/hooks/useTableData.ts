import { useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { Row, SortColumn } from "@crab-dev/rc-table";
import type { TableDataSource } from "../types.js";

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
    loadData: (page: number, pageSize: number, filters: Record<string, string>) => void;
    handlePageChange: (page: number, pageSize: number) => void;
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
    const loadData = useCallback((nextPage: number, nextPageSize: number, nextFilters: Record<string, string>) => {
        if (!mounted.current) return;
        activeRequest.current?.abort();
        const controller = new AbortController();
        activeRequest.current = controller;
        params.current = { page: nextPage, pageSize: nextPageSize, filters: nextFilters };
        setDataLoading(true);
        setDataError(null);
        const { options: current, sortColumns: sort } = latest.current;
        const succeed = (nextRows: T[], nextTotal: number) => {
            if (controller.signal.aborted || !mounted.current) return;
            setRows(nextRows);
            setTotal(nextTotal);
            setDataLoading(false);
        };
        const fail = (reason: unknown) => {
            if (controller.signal.aborted || !mounted.current) return;
            const error = reason instanceof Error ? reason : new Error(String(reason));
            setDataError(error);
            setDataLoading(false);
            latest.current.options.onError?.(error);
        };
        try {
            if (current.request) {
                void current.request({
                    page: nextPage, pageSize: nextPageSize, filters: { ...nextFilters },
                    sort: current.sortMode === 'server' ? sort.map(column => ({ ...column })) : [],
                    signal: controller.signal,
                }).then(result => succeed(result.rows, result.total), fail);
            } else if (current.pagination) {
                void current.fetchData(nextPage, nextPageSize, nextFilters)
                    .then(result => succeed(result.rows, result.total), fail);
            } else {
                void current.fetchData(nextFilters).then(result => succeed(result, result.length), fail);
            }
        } catch (error) {
            fail(error);
        }
    }, []);

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; activeRequest.current?.abort(); };
    }, []);

    // 排序按值比较；父组件重建相同数组不会重复拉取。客户端排序无需请求。
    const sortKey = sortMode === 'server' ? JSON.stringify(sortColumns) : '';
    useEffect(() => {
        setPage(1);
        const current = params.current;
        loadData(1, current.pageSize, current.filters);
    }, [loadData, sortKey, sortMode]);

    useEffect(() => {
        if (!autoRefreshInterval || autoRefreshInterval <= 0) return;
        const timer = setInterval(() => {
            const current = params.current;
            loadData(current.page, current.pageSize, current.filters);
        }, autoRefreshInterval);
        return () => clearInterval(timer);
    }, [autoRefreshInterval, loadData]);

    const handlePageChange = (nextPage: number, nextPageSize: number) => {
        setPage(nextPage);
        setPageSize(nextPageSize);
        loadData(nextPage, nextPageSize, params.current.filters);
        if (pagination) pagination.onChange?.(nextPage, nextPageSize);
    };
    const handleFilterChange = (nextFilters: Record<string, string>) => {
        setFilters(nextFilters);
        setPage(1);
        loadData(1, params.current.pageSize, nextFilters);
    };
    const handleSortChange = (columns: SortColumn[]) => {
        if (options.sortColumns === undefined) setInnerSort(columns);
        options.onSortColumnsChange?.(columns);
    };
    return {
        rows, total, page, pageSize, filters, sortColumns, dataLoading, dataError, loadData,
        handlePageChange, handleFilterChange, handleSortChange, restoreFilters: handleFilterChange,
    };
}
