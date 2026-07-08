import {
    useMemo,
    useState,
    type ChangeEvent,
    type FC,
    type KeyboardEvent,
    type MouseEvent,
    type ReactNode,
} from "react";
import { css, cx } from "@linaria/core";
import RcSelect from "@crab-dev/rc-select";
import { useControllableValue } from "@crab-dev/rc-hooks";

import token from "./token.js";
import type { PaginationProps, PaginationShowTotal } from "./types.js";

/* ────────────────────────────────── 静态样式 ────────────────────────────────── */

const rootStyle = css`
    display: inline-flex;
    align-items: center;
    gap: ${token.group.gap};
    font-size: ${token.font.size};
    font-weight: ${token.font.weight};
    color: ${token.item.color};
    line-height: 1;
`;

const listStyle = css`
    display: inline-flex;
    align-items: center;
    gap: ${token.gap};
    list-style-type: none;
    padding: 0;
    margin: 0;
`;

const itemBaseStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: ${token.size.medium.height};
    min-width: ${token.size.medium["min-width"]};
    padding: ${token.size.medium.padding};
    font-size: ${token.size.medium.font.size};
    font-weight: inherit;
    font-variant-numeric: tabular-nums;
    color: ${token.item.color};
    background-color: ${token.item.background.color};
    border: 0;
    border-radius: ${token.item.radius};
    cursor: pointer;
    user-select: none;
    transition: ${token.transition};
    appearance: none;
    font-family: inherit;

    &:hover:not(:disabled):not([aria-disabled="true"]) {
        color: ${token.item["color-hover"]};
        background-color: ${token.item.background["color-hover"]};
    }

    &:active:not(:disabled):not([aria-disabled="true"]) {
        background-color: ${token.item.background["color-hover"]};
    }

    &:focus-visible {
        outline: ${token.focus.outline.width} solid ${token.focus.outline.color};
        outline-offset: ${token.focus.outline.offset};
    }

    &[aria-current="page"] {
        color: ${token.item["color-active"]};
        background-color: ${token.item.background["color-active"]};
    }

    &[aria-current="page"]:hover:not(:disabled) {
        color: ${token.item["color-active"]};
        background-color: ${token.item.background["color-active"]};
    }

    &:disabled,
    &[aria-disabled="true"] {
        color: ${token.item["color-disabled"]};
        background-color: transparent;
        cursor: not-allowed;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    /* Windows 高对比度模式：系统会强制覆盖背景色，需显式描边兜底激活态 */
    @media (forced-colors: active) {
        &[aria-current="page"] {
            outline: 2px solid CanvasText;
            outline-offset: -2px;
        }
    }
`;

const itemSmallStyle = css`
    height: ${token.size.small.height};
    min-width: ${token.size.small["min-width"]};
    padding: ${token.size.small.padding};
    font-size: ${token.size.small.font.size};
`;

const ellipsisStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: ${token.size.medium.height};
    min-width: ${token.size.medium["min-width"]};
    padding: 0;
    color: ${token.ellipsis.color};
    background-color: transparent;
    border: 0;
    border-radius: ${token.item.radius};
    cursor: pointer;
    user-select: none;
    transition: ${token.transition};
    appearance: none;
    font-family: inherit;
    font-size: inherit;

    /* 默认显示省略号，hover 时切换为双向箭头（语义化跳 5 页） */
    & > .rc-pagination-ellipsis-dots,
    & > .rc-pagination-ellipsis-jump {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: opacity 120ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    & > .rc-pagination-ellipsis-dots {
        letter-spacing: 0.05em;
        opacity: 1;
    }
    & > .rc-pagination-ellipsis-jump {
        position: absolute;
        inset: 0;
        opacity: 0;
    }

    &:hover:not(:disabled) {
        color: ${token.item["color-hover"]};
        background-color: ${token.item.background["color-hover"]};
    }
    &:hover:not(:disabled) > .rc-pagination-ellipsis-dots {
        opacity: 0;
    }
    &:hover:not(:disabled) > .rc-pagination-ellipsis-jump {
        opacity: 1;
    }
    &:focus-visible > .rc-pagination-ellipsis-dots {
        opacity: 0;
    }
    &:focus-visible > .rc-pagination-ellipsis-jump {
        opacity: 1;
    }

    &:focus-visible {
        outline: ${token.focus.outline.width} solid ${token.focus.outline.color};
        outline-offset: ${token.focus.outline.offset};
    }

    &:disabled {
        color: ${token.item["color-disabled"]};
        cursor: not-allowed;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
        & > .rc-pagination-ellipsis-dots,
        & > .rc-pagination-ellipsis-jump {
            transition: none;
        }
    }
`;

const ellipsisSmallStyle = css`
    height: ${token.size.small.height};
    min-width: ${token.size.small["min-width"]};
    font-size: ${token.size.small.font.size};
`;

const iconStyle = css`
    width: 1em;
    height: 1em;
    flex-shrink: 0;
`;

const totalStyle = css`
    color: ${token.total.color};
    font-weight: ${token.font.weight};
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
`;

const quickJumperStyle = css`
    display: inline-flex;
    align-items: center;
    gap: ${token["quick-jumper"].gap};
    color: ${token.total.color};
    white-space: nowrap;
`;

const quickJumperInputStyle = css`
    box-sizing: border-box;
    width: ${token["quick-jumper"].input.width};
    height: ${token.size.medium.height};
    padding: ${token["quick-jumper"].input.padding};
    font-family: inherit;
    font-size: ${token.size.medium.font.size};
    font-variant-numeric: tabular-nums;
    color: ${token.input.color};
    background-color: ${token.input.background.color};
    border: ${token.input.border.width} solid ${token.input.border.color};
    border-radius: ${token.input.border.radius};
    text-align: center;
    transition: ${token.transition};

    &:hover:not(:disabled) {
        border-color: ${token.input.border["color-hover"]};
    }

    &:focus {
        outline: none;
        border-color: ${token.input.border["color-focus"]};
    }

    &:focus-visible {
        outline: ${token.focus.outline.width} solid ${token.focus.outline.color};
        outline-offset: ${token.focus.outline.offset};
    }

    &:disabled {
        color: ${token.input["color-disabled"]};
        cursor: not-allowed;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    /* 去除数字输入框的原生步进按钮 */
    appearance: textfield;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const quickJumperInputSmallStyle = css`
    height: ${token.size.small.height};
    font-size: ${token.size.small.font.size};
`;

const sizeChangerStyle = css`
    display: inline-flex;
    align-items: center;
    color: ${token.total.color};
    white-space: nowrap;
`;

/* ────────────────────────────────── 图标 ────────────────────────────────── */

const ChevronLeftIcon = () => (
    <svg className={iconStyle} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M10 4L6 8l4 4" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg className={iconStyle} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M6 4l4 4-4 4" />
    </svg>
);

const DoubleChevronLeftIcon = () => (
    <svg className={iconStyle} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M8 4L4 8l4 4" />
        <path d="M12 4L8 8l4 4" />
    </svg>
);

const DoubleChevronRightIcon = () => (
    <svg className={iconStyle} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M4 4l4 4-4 4" />
        <path d="M8 4l4 4-4 4" />
    </svg>
);

/* ────────────────────────────────── 辅助 ────────────────────────────────── */

const clamp = (value: number, min: number, max: number): number => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
};

/**
 * 构造页码序列。当 totalPages > 7 时**必须**返回恰好 7 项，保证分页条宽度稳定、
 * 跨页切换不发生布局跳动（稳态原则）。
 */
const buildPageSequence = (current: number, totalPages: number): (number | "prev-jump" | "next-jump")[] => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    // 固定 7 项：首页 + 5 项中间窗口 + 末页
    const last = totalPages;
    if (current <= 4) {
        // [1, 2, 3, 4, 5, next-jump, last]
        return [1, 2, 3, 4, 5, "next-jump", last];
    }
    if (current >= last - 3) {
        // [1, prev-jump, last-4, last-3, last-2, last-1, last]
        return [1, "prev-jump", last - 4, last - 3, last - 2, last - 1, last];
    }
    // [1, prev-jump, current-1, current, current+1, next-jump, last]
    return [1, "prev-jump", current - 1, current, current + 1, "next-jump", last];
};

const defaultShowTotal: PaginationShowTotal = (total, [from, to]) => `第 ${from}-${to} 条 / 共 ${total} 条`;

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const defaultPageSizeLabel = (n: number): ReactNode => `${n} / 页`;

/* ────────────────────────────────── 组件 ────────────────────────────────── */

/**
 * 分页器：承载长列表的页码导航与跳转。
 *
 * 支持受控 / 非受控；可配合 `showQuickJumper`、`showTotal` 拓展辅助区域。
 */
const Pagination: FC<PaginationProps> = ({
    current: controlledCurrent,
    defaultCurrent = 1,
    total,
    pageSize: controlledPageSize,
    defaultPageSize = 10,
    onChange,
    size = "medium",
    disabled = false,
    showQuickJumper = false,
    showSizeChanger = false,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    onShowSizeChange,
    pageSizeLabel = defaultPageSizeLabel,
    showTotal = false,
    prevLabel = "Previous page",
    nextLabel = "Next page",
    pageLabel,
    className,
    ...restProps
}) => {
    // 仅用 useControllableValue 统一"受控优先 / 非受控兜底"取值；current 与 pageSize
    // 的 onChange 相互耦合（onChange(current, pageSize)），故不交给它触发，仍在下方手动派发。
    const [currentValue, setCurrentValue] = useControllableValue<number>({
        value: controlledCurrent,
        defaultValue: Math.max(1, defaultCurrent),
    });
    const [pageSizeValue, setPageSizeValue] = useControllableValue<number>({
        value: controlledPageSize,
        defaultValue: Math.max(1, defaultPageSize),
    });

    const activePageSize = Math.max(1, pageSizeValue);
    const totalPages = Math.max(1, Math.ceil(Math.max(0, total) / activePageSize));
    const activeCurrent = clamp(currentValue, 1, totalPages);

    const [quickJumperValue, setQuickJumperValue] = useState<string>("");

    const pageSequence = useMemo(() => buildPageSequence(activeCurrent, totalPages), [activeCurrent, totalPages]);

    const isSmall = size === "small";
    const itemSizeClass = isSmall ? itemSmallStyle : "";
    const ellipsisSizeClass = isSmall ? ellipsisSmallStyle : "";
    const inputSizeClass = isSmall ? quickJumperInputSmallStyle : "";

    const sizeChangerOptions = useMemo(
        () => pageSizeOptions.map((value) => ({ value: String(value), label: pageSizeLabel(value) })),
        [pageSizeOptions, pageSizeLabel],
    );

    const commitChange = (nextPage: number) => {
        const clamped = clamp(Math.floor(nextPage), 1, totalPages);
        if (clamped === activeCurrent) return;
        setCurrentValue(clamped);
        onChange?.(clamped, activePageSize);
    };

    const handlePageSizeChange = (nextValue: string | undefined) => {
        if (nextValue === undefined) return;
        const nextSize = Number.parseInt(nextValue, 10);
        if (!Number.isFinite(nextSize) || nextSize <= 0 || nextSize === activePageSize) return;

        // 保持当前首条可见：按新 pageSize 重新计算 current
        const firstItemIndex = (activeCurrent - 1) * activePageSize;
        const nextTotalPages = Math.max(1, Math.ceil(Math.max(0, total) / nextSize));
        const nextCurrent = clamp(Math.floor(firstItemIndex / nextSize) + 1, 1, nextTotalPages);

        setPageSizeValue(nextSize);
        if (nextCurrent !== activeCurrent) {
            setCurrentValue(nextCurrent);
        }
        onShowSizeChange?.(nextCurrent, nextSize);
        onChange?.(nextCurrent, nextSize);
    };

    const handlePageClick = (nextPage: number) => (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (disabled) return;
        commitChange(nextPage);
    };

    const handleJumperChange = (event: ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value.replace(/[^0-9]/g, "");
        setQuickJumperValue(raw);
    };

    const commitQuickJumper = () => {
        if (quickJumperValue === "") return;
        const parsed = Number.parseInt(quickJumperValue, 10);
        if (!Number.isFinite(parsed)) {
            setQuickJumperValue("");
            return;
        }
        commitChange(parsed);
        setQuickJumperValue("");
    };

    const handleJumperKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            commitQuickJumper();
        }
    };

    const buildPageAriaLabel = (page: number): string => {
        if (pageLabel) return pageLabel(page);
        return `Page ${page}`;
    };

    const renderTotal = (): ReactNode => {
        if (!showTotal) return null;
        const renderer: PaginationShowTotal = typeof showTotal === "function" ? showTotal : defaultShowTotal;
        const from = total === 0 ? 0 : (activeCurrent - 1) * activePageSize + 1;
        const to = Math.min(total, activeCurrent * activePageSize);
        return <span className={totalStyle}>{renderer(total, [from, to])}</span>;
    };

    return (
        <nav
            {...restProps}
            className={cx(rootStyle, className)}
            role="navigation"
            aria-label="Pagination"
            data-size={size}
            data-disabled={disabled ? "true" : undefined}
        >
            {renderTotal()}
            <ul className={listStyle}>
                <li>
                    <button
                        type="button"
                        className={cx(itemBaseStyle, itemSizeClass)}
                        onClick={handlePageClick(activeCurrent - 1)}
                        disabled={disabled || activeCurrent <= 1}
                        aria-label={prevLabel}
                    >
                        <ChevronLeftIcon />
                    </button>
                </li>
                {pageSequence.map((entry, index) => {
                    if (entry === "prev-jump" || entry === "next-jump") {
                        const isPrev = entry === "prev-jump";
                        const jumpTarget = isPrev
                            ? Math.max(1, activeCurrent - 5)
                            : Math.min(totalPages, activeCurrent + 5);
                        return (
                            <li key={`${entry}-${index}`}>
                                <button
                                    type="button"
                                    className={cx(ellipsisStyle, ellipsisSizeClass)}
                                    onClick={handlePageClick(jumpTarget)}
                                    disabled={disabled}
                                    aria-label={isPrev ? "Jump backward 5 pages" : "Jump forward 5 pages"}
                                    data-testid="pagination-ellipsis"
                                >
                                    <span className="rc-pagination-ellipsis-dots" aria-hidden="true">…</span>
                                    <span className="rc-pagination-ellipsis-jump" aria-hidden="true">
                                        {isPrev ? <DoubleChevronLeftIcon /> : <DoubleChevronRightIcon />}
                                    </span>
                                </button>
                            </li>
                        );
                    }
                    const isActive = entry === activeCurrent;
                    return (
                        <li key={entry}>
                            <button
                                type="button"
                                className={cx(itemBaseStyle, itemSizeClass)}
                                onClick={handlePageClick(entry)}
                                disabled={disabled}
                                aria-current={isActive ? "page" : undefined}
                                aria-label={buildPageAriaLabel(entry)}
                            >
                                {entry}
                            </button>
                        </li>
                    );
                })}
                <li>
                    <button
                        type="button"
                        className={cx(itemBaseStyle, itemSizeClass)}
                        onClick={handlePageClick(activeCurrent + 1)}
                        disabled={disabled || activeCurrent >= totalPages}
                        aria-label={nextLabel}
                    >
                        <ChevronRightIcon />
                    </button>
                </li>
            </ul>
            {showQuickJumper && (
                <span className={quickJumperStyle}>
                    跳至
                    <input
                        className={cx(quickJumperInputStyle, inputSizeClass)}
                        value={quickJumperValue}
                        onChange={handleJumperChange}
                        onKeyDown={handleJumperKeyDown}
                        onBlur={commitQuickJumper}
                        disabled={disabled}
                        inputMode="numeric"
                        aria-label="Jump to page"
                    />
                    页
                </span>
            )}
            {showSizeChanger && (
                <span className={sizeChangerStyle}>
                    <RcSelect
                        options={sizeChangerOptions}
                        value={String(activePageSize)}
                        onChange={handlePageSizeChange}
                        size={isSmall ? "small" : "middle"}
                        disabled={disabled}
                        aria-label="Rows per page"
                        popupMatchSelectWidth={false}
                    />
                </span>
            )}
        </nav>
    );
};

export default Pagination;
