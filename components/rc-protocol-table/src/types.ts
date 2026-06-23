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
}

export interface DataTypeLoader {
    name: string;
    render: ColumnType<Row>["render"];
    filterEditor: ColumnType<Row>["filterEditor"];
    editRender: ColumnType<Row>["editRender"];
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
