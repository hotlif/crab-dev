import type { Key } from 'react';
import type { ColumnType, Row, SortColumn, TableHandle } from "@crab-dev/rc-table";
import type { PaginationChangeDetails, PaginationChangeHandler, PaginationShowTotal, PaginationSize } from "@crab-dev/rc-pagination";

export interface ProtocolColumnType {
    align?: ColumnType<Row>["align"];
    name: ColumnType<Row>["name"];
    title: ColumnType<Row>["title"];
    hidden?: ColumnType<Row>["hidden"];
    width?: ColumnType<Row>["width"];
    fixed?: ColumnType<Row>["fixed"];
    filterable?: ColumnType<Row>["filterable"];
    children?: ProtocolColumnType[];
    dataType: string;
    filterCellClassName?: ColumnType<Row>["filterCellClassName"];
    /** 是否允许排序（仅叶子列生效） */
    sortable?: ColumnType<Row>["sortable"];
    /** 是否允许拖拽调整列宽 */
    resizable?: ColumnType<Row>["resizable"];
    /** 是否允许该列单元格被选中 */
    selectable?: ColumnType<Row>["selectable"];
}

export interface DataTypeLoader<T extends Row = Row> {
    name: string;
    render: ColumnType<T>["render"];
    filterEditor: ColumnType<T>["filterEditor"];
    editRender: ColumnType<T>["editRender"];
    parsePaste?: ColumnType<T>['parsePaste'];
    validatePaste?: ColumnType<T>['validatePaste'];
    /** 自定义该 dataType 用于关键字高亮匹配的文本（枚举值转换场景） */
    getSearchText?: ColumnType<T>["getSearchText"];
    /** 自定义该 dataType 的底部汇总单元格内容（需 Table showSummary 开启） */
    summaryRender?: ColumnType<T>["summaryRender"];
    /** CSV 导出时将原始值转换为字符串（不提供则 String(rawValue)） */
    exportValue?: (rawValue: unknown, row: T) => string;
}

export interface ResultScope {
    filters: Readonly<Record<string, string>>;
    keyword?: string;
}
export type ResultSelection =
    | { mode: 'ids'; ids: Set<Key> }
    | { mode: 'all'; scope: ResultScope; excludedIds: Set<Key> };
export interface ResultSelectionConfig<T extends Row> {
    value: ResultSelection;
    onValueChange: (selection: ResultSelection) => void;
    getDisabled?: (row: T) => boolean;
}

export interface TableQuery extends ResultScope {
    page: number;
    pageSize: number;
    sort: readonly SortColumn[];
    signal: AbortSignal;
}

/** 按当前查询结果中的绝对位置取一段连续行，endIndex 为开区间。 */
export interface TableBlockQuery extends ResultScope {
    startIndex: number;
    endIndex: number;
    sort: readonly SortColumn[];
    signal: AbortSignal;
}

export interface TableDataResult<T extends Row> {
    rows: T[];
    total: number;
    /** 服务端的全部匹配结果汇总，按叶子列 name 映射到最终展示值。 */
    summary?: Readonly<Record<string, string | number | null>>;
}
/** TablePro 的命令式数据与视图操作；请求与查询状态仍由组件管理。 */
export interface TableProHandle extends TableHandle {
    /**
     * 保留当前查询并重新加载数据。分页模式刷新当前页，分块模式刷新当前视口并淘汰旧缓存。
     * 页码越界时回退并等待有效页加载完成；失败时拒绝并触发 onError。
     * 被后续请求替代或卸载时以 AbortError 拒绝，不触发 onError。
     * 完成表示数据状态已更新，不保证浏览器已完成绘制。
     */
    refresh: () => Promise<void>;
}
export type TableDataRequest<T extends Row> = (query: TableQuery) => Promise<TableDataResult<T>>;
export type TableBlockRequest<T extends Row> = (query: TableBlockQuery) => Promise<TableDataResult<T>>;

export interface TableRemoteRows<T extends Row> {
    /** 返回请求范围内的连续行、完整匹配总数，以及可选服务端汇总。 */
    request: TableBlockRequest<T>;
    /** 每块行数。默认 100。 */
    blockSize?: number;
    /** 保留的块数。默认 8，至少保留视口当前所需的块。 */
    maxCachedBlocks?: number;
    /** 同一查询允许的并发请求数。默认 2。 */
    maxConcurrentRequests?: number;
    /** 切换数据集时更改此值，开始新的查询并回到首行。 */
    cacheKey?: string | number;
    /** 全部行的固定高度（px）。缺省时跟随表格密度。 */
    rowHeight?: number;
}

export type TablePagedDataSource<T extends Row> = { remoteRows?: never } & (
    | { searchMode?: 'loaded' | 'server'; request: TableDataRequest<T>; fetchData?: never; pagination?: PaginationConfig | false; sortMode?: 'client' | 'server' }
    | { searchMode?: 'loaded'; request?: never; fetchData: (filters: Record<string, string>) => Promise<T[]>; pagination?: false; sortMode?: 'client' }
    | { searchMode?: 'loaded'; request?: never; fetchData: (page: number, pageSize: number, filters: Record<string, string>) => Promise<TableDataResult<T>>; pagination: PaginationConfig; sortMode?: 'client' }
);
export type TableRemoteDataSource<T extends Row> = {
    remoteRows: TableRemoteRows<T>;
    request?: never;
    fetchData?: never;
    pagination?: false;
    sortMode?: 'server';
    searchMode?: 'server';
};
export type TableDataSource<T extends Row> = TablePagedDataSource<T> | TableRemoteDataSource<T>;

/** 可序列化的表格状态快照，用于持久化和恢复 */
export interface ProtocolTableState {
    /** v2 记录完整列布局，允许恢复明确取消的固定列。缺省版本继续按旧版局部覆盖读取。 */
    version?: 2;
    page?: number;
    pageSize?: number;
    sortColumns?: SortColumn[];
    keyword?: string;
    /** 各列属性（key = String(col.name)） */
    columnProps: Record<string, {
        hidden?: boolean;
        width?: number;
        fixed?: "left" | "right";
        sortable?: boolean;
    }>;
    /** 列顺序（深度优先遍历的所有列 name，包含列组） */
    columnOrder?: (string | number)[];
    /** 过滤器条件 */
    filters?: Record<string, string>;
}

export interface PaginationConfig {
    /** 初始每页条数（非受控）@default 10 */
    defaultPageSize?: number;
    /** 每页条数选项 @default [10, 20, 50, 100] */
    pageSizeOptions?: number[];
    /** 是否显示每页条数切换 @default false */
    showSizeChanger?: boolean;
    /** 是否显示快速跳转 @default false */
    showQuickJumper?: boolean;
    /** 是否显示总条数 @default false */
    showTotal?: boolean | PaginationShowTotal;
    /** 尺寸 @default "medium" */
    size?: PaginationSize;
    /** 分页栏位置 @default "bottom" */
    position?: "top" | "bottom" | "both";
    /** 页码变更回调 */
    onValueChange?: PaginationChangeHandler;
    /** 每页条数变化；页码使用同次变更解析后的值。 */
    onPageSizeChange?: (pageSize: number, details: { page: number; event?: PaginationChangeDetails['event'] }) => void;
}
