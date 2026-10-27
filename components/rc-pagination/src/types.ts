import type { HTMLAttributes, ReactNode, SyntheticEvent } from "react";
import type { ControlledValueProps } from '@crab-dev/rc-hooks';

/**
 * 尺寸阶梯。
 * 通用三档控件尺寸；数据与内容间距由独立 density 配置管理。
 */
export type PaginationSize = "small" | "medium" | "large";

/**
 * 页码变更事件。
 * @param page 新的当前页（1-based）
 * @param pageSize 当前每页条数
 */
export interface PaginationChangeDetails {
    pageSize: number;
    reason: 'page' | 'page-size' | 'jump';
    event?: SyntheticEvent | Event;
}
export type PaginationChangeHandler = (page: number, details: PaginationChangeDetails) => void;

/**
 * `showTotal` 的渲染回调。
 * @param total 数据总条数
 * @param range 当前页对应的起止条目（1-based，闭区间）
 */
export type PaginationShowTotal = (total: number, range: [number, number]) => ReactNode;

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, 'defaultValue'> & ControlledValueProps<number, PaginationChangeDetails> & {
    /**
     * 数据总条数
     */
    total: number;

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
     * 每页条数变更回调（下拉切换时触发；同时触发 `onValueChange`，reason 为 page-size）
     */
    onPageSizeChange?: (pageSize: number, details: { page: number; event?: SyntheticEvent | Event }) => void;

    /**
     * 每页条数下拉项的文本格式化（默认 `${n} / 页`）
     */
    pageSizeLabel?: (pageSize: number) => ReactNode;

    /**
     * 上一页 aria-label
     * 默认使用当前语言的“上一页”。
     */
    prevLabel?: string;

    /**
     * 下一页 aria-label
     * 默认使用当前语言的“下一页”。
     */
    nextLabel?: string;

    /**
     * 页码按钮 aria-label 生成器
     */
    pageLabel?: (page: number) => string;
} & (
    | { pageSize?: number; defaultPageSize?: never }
    | { pageSize?: never; defaultPageSize?: number }
);
