import { type HTMLAttributes, type ReactNode, useState, useEffect, useCallback, type Key } from "react";
import Table, { type ColumnType, type Row, type FilterEditorParam } from "@crab-dev/rc-table";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Pagination from "@crab-dev/rc-pagination";
import { css, cx } from "@linaria/core";
import type { ProtocolColumnType, DataTypeLoader, PaginationConfig } from "./types.js";
import { transformColumns } from "./util.js";

/* ───────────────────────────── 样式 ───────────────────────────── */

const flexColumnStyle = css`
    display: flex;
    flex-direction: column;
`;

const tableFlexStyle = css`
    flex: 1;
    min-height: 0;
`;

const paginationBarStyle = css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 6px 12px;
    flex-shrink: 0;
    background-color: var(--crab-rc-table-header-bg-color, hsl(0deg 0% 97.5%));
    border-left: 1px solid var(--crab-rc-table-border-color, #ddd);
    border-right: 1px solid var(--crab-rc-table-border-color, #ddd);
    border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
`;

/* ───────────────────────────── Props ───────────────────────────── */

/** 公共基础属性（不依赖 T） */
interface BaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    filterBar?: boolean;
    typeLoaders?: DataTypeLoader[];
    fetchColumns: () => Promise<ProtocolColumnType[]>;
    expandedGroupIds?: Set<Key>;
    onExpandedGroupIdsChange?: (ids: Set<Key>) => void;
    /** 当列的 DataTypeLoader 未提供 filterEditor 时的兜底编辑器 */
    renderDefaultFilterEditor?: (param: FilterEditorParam<Row>) => ReactNode;
}

/** 无分页：fetchData 接收筛选条件，直接返回全量数据 */
interface NoPaginationProps<T extends Row> extends BaseProps {
    fetchData: (filters: Record<string, string>) => Promise<T[]>;
    pagination?: false;
}

/** 服务端分页：fetchData 接收 page/pageSize/filters，返回当前页数据和总条数 */
interface WithPaginationProps<T extends Row> extends BaseProps {
    fetchData: (page: number, pageSize: number, filters: Record<string, string>) => Promise<{ rows: T[]; total: number }>;
    pagination: PaginationConfig;
}

type ProtocolTableProps<T extends Row> = NoPaginationProps<T> | WithPaginationProps<T>;

/* ───────────────────────────── 组件 ───────────────────────────── */

function ProtocolTable<T extends Row>(props: ProtocolTableProps<T>) {
    const {
        fetchColumns,
        typeLoaders,
        expandedGroupIds,
        onExpandedGroupIdsChange,
        renderDefaultFilterEditor,
        pagination,
        className,
        filterBar,
        ...rest
    } = props;

    const [columns, setColumns] = useState<ColumnType<T>[]>([]);
    const [rows, setRows] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(
        pagination ? (pagination.defaultPageSize ?? 10) : 10
    );
    const [filters, setFilters] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchColumns().then((resp: ProtocolColumnType[]) =>
            setColumns(transformColumns(resp, typeLoaders) as unknown as ColumnType<T>[])
        );
    }, []);

    const loadData = useCallback((nextPage: number, nextPageSize: number, nextFilters: Record<string, string>) => {
        if (pagination) {
            (props as WithPaginationProps<T>).fetchData(nextPage, nextPageSize, nextFilters).then(({ rows: r, total: t }) => {
                setRows(r);
                setTotal(t);
            });
        } else {
            (props as NoPaginationProps<T>).fetchData(nextFilters).then((r) => {
                setRows(r);
                setTotal(r.length);
            });
        }
    }, []);

    useEffect(() => {
        loadData(page, pageSize, filters);
    }, []);

    const handlePageChange = (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
        loadData(newPage, newPageSize, filters);
        if (pagination) {
            pagination.onChange?.(newPage, newPageSize);
        }
    };

    const handleFilterChange = (nextFilters: Record<string, string>) => {
        setFilters(nextFilters);
        setPage(1);
        loadData(1, pageSize, nextFilters);
    };

    /* ─── 渲染 ─── */

    const tableContent = (
        <AutoSizer>
            {({ width, height }) => (
                <Table
                    width={width}
                    height={height}
                    rows={rows}
                    columns={columns}
                    expandedGroupIds={expandedGroupIds}
                    onExpandedGroupIdsChange={onExpandedGroupIdsChange}
                    filterBar={filterBar}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    renderDefaultFilterEditor={renderDefaultFilterEditor as ((param: FilterEditorParam<T>) => ReactNode) | undefined}
                />
            )}
        </AutoSizer>
    );

    if (!pagination) {
        return (
            <div {...rest} className={className}>
                {tableContent}
            </div>
        );
    }

    const { position = "bottom", showSizeChanger, showQuickJumper, showTotal, pageSizeOptions, size } = pagination;

    const paginationBar = (
        <div className={paginationBarStyle}>
            <Pagination
                total={total}
                current={page}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={showSizeChanger}
                showQuickJumper={showQuickJumper}
                showTotal={showTotal}
                pageSizeOptions={pageSizeOptions}
                size={size}
            />
        </div>
    );

    return (
        <div {...rest} className={cx(flexColumnStyle, className)}>
            {position !== "bottom" && paginationBar}
            <div className={tableFlexStyle}>
                {tableContent}
            </div>
            {position !== "top" && paginationBar}
        </div>
    );
}


export default ProtocolTable;
