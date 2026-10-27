// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type Event = DocsTypePlaceholder;
type PaginationChangeDetails = DocsTypePlaceholder;
type PaginationShowTotal = DocsTypePlaceholder;
type PaginationSize = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type SyntheticEvent = DocsTypePlaceholder;

export interface PaginationProps {
    /**
     * 暂无说明。 与 defaultValue 互斥，不能同时提供。
     */
    "value"?: number;

    /**
     * 暂无说明。 与 value 互斥，不能同时提供。
     */
    "defaultValue"?: number;

    /**
     * 暂无说明。
     */
    "onValueChange"?: ((value: number, details: PaginationChangeDetails) => void);

    /**
     * 数据总条数
     */
    "total": number;

    /**
     * 尺寸阶梯
     * @default "medium"
     */
    "size"?: PaginationSize;

    /**
     * 是否禁用整个分页器
     * @default false
     */
    "disabled"?: boolean;

    /**
     * 是否显示快速跳转到指定页
     * @default false
     */
    "showQuickJumper"?: boolean;

    /**
     * 是否显示数据总量。传入函数则可自定义渲染。
     * @default false
     */
    "showTotal"?: boolean | PaginationShowTotal;

    /**
     * 是否显示每页条数下拉选择器
     * @default false
     */
    "showSizeChanger"?: boolean;

    /**
     * 每页条数下拉选项
     * @default [10, 20, 50, 100]
     */
    "pageSizeOptions"?: number[];

    /**
     * 每页条数变更回调（下拉切换时触发；同时触发 `onValueChange`，reason 为 page-size）
     */
    "onPageSizeChange"?: (pageSize: number, details: { page: number; event?: SyntheticEvent | Event; }) => void;

    /**
     * 每页条数下拉项的文本格式化（默认 `${n} / 页`）
     */
    "pageSizeLabel"?: (pageSize: number) => ReactNode;

    /**
     * 上一页 aria-label 默认使用当前语言的“上一页”。
     */
    "prevLabel"?: string;

    /**
     * 下一页 aria-label 默认使用当前语言的“下一页”。
     */
    "nextLabel"?: string;

    /**
     * 页码按钮 aria-label 生成器
     */
    "pageLabel"?: (page: number) => string;

    /**
     * 暂无说明。 与 defaultPageSize 互斥，不能同时提供。
     */
    "pageSize"?: number;

    /**
     * 暂无说明。 与 pageSize 互斥，不能同时提供。
     */
    "defaultPageSize"?: number;
}
