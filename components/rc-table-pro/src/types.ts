import type { ColumnType, Row, SortColumn } from "@crab-dev/rc-table";
import type { PaginationShowTotal, PaginationSize } from "@crab-dev/rc-pagination";

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
    /** 自定义该 dataType 用于关键字高亮匹配的文本（枚举值转换场景） */
    getSearchText?: ColumnType<T>["getSearchText"];
    /** 自定义该 dataType 的底部汇总单元格内容（需 Table showSummary 开启） */
    summaryRender?: ColumnType<T>["summaryRender"];
    /** CSV 导出时将原始值转换为字符串（不提供则 String(rawValue)） */
    exportValue?: (rawValue: unknown, row: T) => string;
}

export interface TableQuery {
    page: number;
    pageSize: number;
    filters: Readonly<Record<string, string>>;
    sort: readonly SortColumn[];
    signal: AbortSignal;
}

export interface TableDataResult<T extends Row> { rows: T[]; total: number }
export type TableDataRequest<T extends Row> = (query: TableQuery) => Promise<TableDataResult<T>>;
export type TableDataSource<T extends Row> =
    | { request: TableDataRequest<T>; fetchData?: never; pagination?: PaginationConfig | false; sortMode?: 'client' | 'server' }
    | { request?: never; fetchData: (filters: Record<string, string>) => Promise<T[]>; pagination?: false; sortMode?: 'client' }
    | { request?: never; fetchData: (page: number, pageSize: number, filters: Record<string, string>) => Promise<TableDataResult<T>>; pagination: PaginationConfig; sortMode?: 'client' };

/** 可序列化的表格状态快照，用于持久化和恢复 */
export interface ProtocolTableState {
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
    onChange?: (page: number, pageSize: number) => void;
}
