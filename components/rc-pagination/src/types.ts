import type { HTMLAttributes, ReactNode } from "react";

/**
 * 尺寸阶梯。
 * - `medium`：默认桌面密度（32px）
 * - `small`：紧凑模式（24px），用于表格内联、抽屉底部等密集场景
 */
export type PaginationSize = "small" | "medium";

/**
 * 页码变更事件。
 * @param page 新的当前页（1-based）
 * @param pageSize 当前每页条数
 */
export type PaginationChangeHandler = (page: number, pageSize: number) => void;

/**
 * `showTotal` 的渲染回调。
 * @param total 数据总条数
 * @param range 当前页对应的起止条目（1-based，闭区间）
 */
export type PaginationShowTotal = (total: number, range: [number, number]) => ReactNode;

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
    /**
     * 当前页（受控）
     */
    current?: number;

    /**
     * 默认当前页（非受控）
     * @default 1
     */
    defaultCurrent?: number;

    /**
     * 数据总条数
     */
    total: number;

    /**
     * 每页条数（受控）
     */
    pageSize?: number;

    /**
     * 默认每页条数（非受控）
     * @default 10
     */
    defaultPageSize?: number;

    /**
     * 页码变更回调
     */
    onChange?: PaginationChangeHandler;

    /**
     * 尺寸阶梯
     * @default "medium"
     */
    size?: PaginationSize;

    /**
     * 是否禁用整个分页器
     * @default false
     */
    disabled?: boolean;

    /**
     * 是否显示快速跳转到指定页
     * @default false
     */
    showQuickJumper?: boolean;

    /**
     * 是否显示数据总量。传入函数则可自定义渲染。
     * @default false
     */
    showTotal?: boolean | PaginationShowTotal;

    /**
     * 是否显示每页条数下拉选择器
     * @default false
     */
    showSizeChanger?: boolean;

    /**
     * 每页条数下拉选项
     * @default [10, 20, 50, 100]
     */
    pageSizeOptions?: number[];

    /**
     * 每页条数变更回调（下拉切换时触发；同时会触发 `onChange`）
     */
    onShowSizeChange?: (current: number, pageSize: number) => void;

    /**
     * 每页条数下拉项的文本格式化（默认 `${n} / 页`）
     */
    pageSizeLabel?: (pageSize: number) => ReactNode;

    /**
     * 上一页 aria-label
     * @default "Previous page"
     */
    prevLabel?: string;

    /**
     * 下一页 aria-label
     * @default "Next page"
     */
    nextLabel?: string;

    /**
     * 页码按钮 aria-label 生成器
     */
    pageLabel?: (page: number) => string;
}
