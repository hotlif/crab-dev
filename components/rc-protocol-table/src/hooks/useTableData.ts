import { useState, useCallback, useEffect, useRef } from "react";
import type { Row } from "@crab-dev/rc-table";
import type { PaginationConfig } from "../types.js";

type NoPaginationFetch<T extends Row> = (filters: Record<string, string>) => Promise<T[]>;
type WithPaginationFetch<T extends Row> = (
    page: number,
    pageSize: number,
    filters: Record<string, string>
) => Promise<{ rows: T[]; total: number }>;

export interface UseTableDataOptions<T extends Row> {
    fetchData: NoPaginationFetch<T> | WithPaginationFetch<T>;
    pagination?: PaginationConfig | false;
    autoRefreshInterval?: number;
    onError?: (error: Error) => void;
}

export interface UseTableDataReturn<T extends Row> {
    rows: T[];
    total: number;
    page: number;
    pageSize: number;
    filters: Record<string, string>;
    dataLoading: boolean;
    dataError: Error | null;
    loadData: (page: number, pageSize: number, filters: Record<string, string>) => void;
    handlePageChange: (newPage: number, newPageSize: number) => void;
    handleFilterChange: (nextFilters: Record<string, string>) => void;
    /** 供 useColumnManagement fetchColumns 完成后恢复过滤器并触发首次拉数据 */
    restoreFilters: (restoredFilters: Record<string, string>) => void;
}

export function useTableData<T extends Row>(
    options: UseTableDataOptions<T>
): UseTableDataReturn<T> {
    const { fetchData, pagination, autoRefreshInterval } = options;

    const [rows, setRows] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(
        pagination ? (pagination.defaultPageSize ?? 10) : 10
    );
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [dataLoading, setDataLoading] = useState(true);
    const [dataError, setDataError] = useState<Error | null>(null);

    // latest-ref 模式（例外 §4.1-2）：loadData useCallback 通过 ref 读取最新值，
    // 不把 fetchData/pagination 加入 deps 以避免 mount 后重复拉数据
    const latestFetchData = useRef(fetchData);
    latestFetchData.current = fetchData;
    const latestPagination = useRef(pagination);
    latestPagination.current = pagination;
    const latestOnError = useRef(options.onError);
    latestOnError.current = options.onError;
    // latest-ref 模式（例外 §4.1-2）：autoRefresh interval 读取最新分页参数
    const latestFilters = useRef(filters);
    latestFilters.current = filters;
    // 可变实例状态 ref（例外 §4.1-1）：供 interval 读取最新参数，不触发渲染
    const latestLoadParams = useRef({ page, pageSize, filters });
    latestLoadParams.current = { page, pageSize, filters };
    const loadData = useCallback((nextPage: number, nextPageSize: number, nextFilters: Record<string, string>) => {
        setDataLoading(true);
        setDataError(null);
        if (latestPagination.current) {
            const paginatedFetch = latestFetchData.current as unknown as WithPaginationFetch<T>;
            paginatedFetch(nextPage, nextPageSize, nextFilters).then(({ rows: r, total: t }) => {
                setRows(r);
                setTotal(t);
                setDataLoading(false);
            }).catch((err: unknown) => {
                const error = err instanceof Error ? err : new Error(String(err));
                setDataError(error);
                setDataLoading(false);
                latestOnError.current?.(error);
            });
        } else {
            const simpleFetch = latestFetchData.current as unknown as NoPaginationFetch<T>;
            simpleFetch(nextFilters).then((r) => {
                setRows(r);
                setTotal(r.length);
                setDataLoading(false);
            }).catch((err: unknown) => {
                const error = err instanceof Error ? err : new Error(String(err));
                setDataError(error);
                setDataLoading(false);
                latestOnError.current?.(error);
            });
        }
    }, []); // 稳定引用：通过 ref 读取最新 fetchData/pagination

    useEffect(() => {
        loadData(page, pageSize, filters);
    }, [loadData]); // loadData 稳定（deps []），实际仅 mount 时运行一次

    // 自动刷新（例外 §4.1-1）：interval 内通过 latestLoadParams ref 读取最新分页参数
    useEffect(() => {
        if (!autoRefreshInterval) return;
        const id = setInterval(() => {
            const { page: p, pageSize: ps, filters: f } = latestLoadParams.current;
            loadData(p, ps, f);
        }, autoRefreshInterval);
        return () => clearInterval(id);
    }, [autoRefreshInterval, loadData]);

    const handlePageChange = (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
        loadData(newPage, newPageSize, latestFilters.current);
        if (latestPagination.current) {
            latestPagination.current.onChange?.(newPage, newPageSize);
        }
    };

    const handleFilterChange = (nextFilters: Record<string, string>) => {
        setFilters(nextFilters);
        latestFilters.current = nextFilters;
        setPage(1);
        loadData(1, pageSize, nextFilters);
    };

    const restoreFilters = (restoredFilters: Record<string, string>) => {
        setFilters(restoredFilters);
        latestFilters.current = restoredFilters;
        loadData(1, pageSize, restoredFilters);
    };

    return {
        rows,
        total,
        page,
        pageSize,
        filters,
        dataLoading,
        dataError,
        loadData,
        handlePageChange,
        handleFilterChange,
        restoreFilters,
    };
}
