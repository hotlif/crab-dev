import type { ColumnType, Row } from "@crab-dev/rc-table";
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

export interface DataTypeLoader {
    name: string;
    render: ColumnType<Row>["render"];
    filterEditor: ColumnType<Row>["filterEditor"];
    editRender: ColumnType<Row>["editRender"];
    /** 自定义该 dataType 用于关键字高亮匹配的文本（枚举值转换场景） */
    getSearchText?: ColumnType<Row>["getSearchText"];
    /** 自定义该 dataType 的底部汇总单元格内容（需 Table showSummary 开启） */
    summaryRender?: ColumnType<Row>["summaryRender"];
    /** CSV 导出时将原始值转换为字符串（不提供则 String(rawValue)） */
    exportValue?: (rawValue: unknown, row: Row) => string;
}

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
