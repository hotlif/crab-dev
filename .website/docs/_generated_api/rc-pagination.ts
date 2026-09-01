/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type PaginationChangeHandler = DocsTypePlaceholder;
type PaginationShowTotal = DocsTypePlaceholder;
type PaginationSize = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface PaginationPropsSearchIndex {
    /**
     * 当前页（受控）
     */
    "current"?: number;

    /**
     * 默认当前页（非受控）
     * @default 1
     */
    "defaultCurrent"?: number;

    /**
     * 默认每页条数（非受控）
     * @default 10
     */
    "defaultPageSize"?: number;

    /**
     * 是否禁用整个分页器
     * @default false
     */
    "disabled"?: boolean;

    /**
     * 下一页 aria-label
     * @default "Next page"
     */
    "nextLabel"?: string;

    /**
     * 页码变更回调
     */
    "onChange"?: PaginationChangeHandler;

    /**
     * 每页条数变更回调（下拉切换时触发；同时会触发 `onChange`）
     */
    "onShowSizeChange"?: (current: number, pageSize: number) => void;

    /**
     * 页码按钮 aria-label 生成器
     */
    "pageLabel"?: (page: number) => string;

    /**
     * 每页条数（受控）
     */
    "pageSize"?: number;

    /**
     * 每页条数下拉项的文本格式化（默认 `${n} / 页`）
     */
    "pageSizeLabel"?: (pageSize: number) => ReactNode;

    /**
     * 每页条数下拉选项
     * @default [10, 20, 50, 100]
     */
    "pageSizeOptions"?: number[];

    /**
     * 上一页 aria-label
     * @default "Previous page"
     */
    "prevLabel"?: string;

    /**
     * 是否显示快速跳转到指定页
     * @default false
     */
    "showQuickJumper"?: boolean;

    /**
     * 是否显示每页条数下拉选择器
     * @default false
     */
    "showSizeChanger"?: boolean;

    /**
     * 是否显示数据总量。传入函数则可自定义渲染。
     * @default false
     */
    "showTotal"?: boolean | PaginationShowTotal;

    /**
     * 尺寸阶梯
     * @default "medium"
     */
    "size"?: PaginationSize;

    /**
     * 数据总条数
     */
    "total": number;
}
