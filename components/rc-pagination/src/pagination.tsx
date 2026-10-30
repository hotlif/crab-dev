import { useComponentSize, useConfig, useLocale } from '@crab-dev/rc-config-provider';
import Button from '@crab-dev/rc-button';
import LineEdit from '@crab-dev/rc-line-edit';
import { useState } from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent, ReactNode } from "react";
import { cx } from "@crab-dev/css";
import RcSelect from "@crab-dev/rc-select";
import { useControllableValue } from "@crab-dev/rc-hooks";
import type { PaginationChangeDetails, PaginationProps, PaginationShowTotal } from "./types.js";
import { rootStyle, listStyle, itemBaseStyle, largeSizeStyle, itemSmallStyle, ellipsisStyle, ellipsisSmallStyle, iconStyle, totalStyle, quickJumperStyle, quickJumperInputStyle, quickJumperInputSmallStyle, sizeChangerStyle } from "./pagination.styles.js";
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

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/* ────────────────────────────────── 组件 ────────────────────────────────── */

/**
 * 分页器：承载长列表的页码导航与跳转。
 *
 * 支持受控 / 非受控；可配合 `showQuickJumper`、`showTotal` 拓展辅助区域。
 */
function Pagination({
    value: controlledCurrent,
    defaultValue = 1,
    total,
    pageSize: controlledPageSize,
    defaultPageSize = 10,
    onValueChange,
    size: sizeProp,
    disabled = false,
    showQuickJumper = false,
    showSizeChanger = false,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    onPageSizeChange,
    pageSizeLabel,
    showTotal = false,
    prevLabel,
    nextLabel,
    pageLabel,
    className,
    ...restProps
}: PaginationProps) {
    const configuredSize = useComponentSize(sizeProp);
    const size = configuredSize;
    const { messages, locale } = useLocale();
    const { direction } = useConfig();
    const isRtl = (restProps.dir ?? direction) === 'rtl';
    const numberFormat = new Intl.NumberFormat(locale);
    // 页码与每页条数需要一起计算；状态同步与下方用户语义通知分别处理。
    const [currentValue, setCurrentValue] = useControllableValue<number>({
        value: controlledCurrent,
        defaultValue: Math.max(1, defaultValue),
    });
    const [pageSizeValue, setPageSizeValue] = useControllableValue<number>({
        value: controlledPageSize,
        defaultValue: Math.max(1, defaultPageSize),
    });

    const activePageSize = Math.max(1, pageSizeValue);
    const totalPages = Math.max(1, Math.ceil(Math.max(0, total) / activePageSize));
    const activeCurrent = clamp(currentValue, 1, totalPages);

    const [quickJumperValue, setQuickJumperValue] = useState<string>("");

    const pageSequence = buildPageSequence(activeCurrent, totalPages);

    const isSmall = size === "small";
    const itemSizeClass = isSmall ? itemSmallStyle : size === "large" ? largeSizeStyle : "";
    const ellipsisSizeClass = isSmall ? ellipsisSmallStyle : size === "large" ? largeSizeStyle : "";
    const inputSizeClass = isSmall ? quickJumperInputSmallStyle : size === "large" ? largeSizeStyle : "";

    const sizeChangerOptions = pageSizeOptions.map((value) => ({ value: String(value), label: (pageSizeLabel ?? messages.pagination.pageSizeLabel)(value) }));

    const commitChange = (nextPage: number, reason: 'page' | 'jump', event: PaginationChangeDetails['event']) => {
        const clamped = clamp(Math.floor(nextPage), 1, totalPages);
        if (clamped === activeCurrent) return;
        setCurrentValue(clamped);
        onValueChange?.(clamped, { pageSize: activePageSize, reason, event });
    };

    const handlePageSizeChange = (nextValue: string | null, details: { event?: PaginationChangeDetails['event'] }) => {
        if (nextValue == null) return;
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
        onPageSizeChange?.(nextSize, { page: nextCurrent, event: details.event });
        onValueChange?.(nextCurrent, { pageSize: nextSize, reason: 'page-size', event: details.event });
    };

    const handlePageClick = (nextPage: number) => (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (disabled) return;
        commitChange(nextPage, 'page', event);
    };

    const handleJumperChange = (event: ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value.replace(/[^0-9]/g, "");
        setQuickJumperValue(raw);
    };

    const commitQuickJumper = (event: PaginationChangeDetails['event']) => {
        if (quickJumperValue === "") return;
        const parsed = Number.parseInt(quickJumperValue, 10);
        if (!Number.isFinite(parsed)) {
            setQuickJumperValue("");
            return;
        }
        commitChange(parsed, 'jump', event);
        setQuickJumperValue("");
    };

    const handleJumperKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            commitQuickJumper(event);
        }
    };

    const buildPageAriaLabel = (page: number): string => {
        if (pageLabel) return pageLabel(page);
        return `${messages.pagination.page} ${numberFormat.format(page)}`;
    };

    const renderTotal = (): ReactNode => {
        if (!showTotal) return null;
        const renderer: PaginationShowTotal = typeof showTotal === "function" ? showTotal : (count, [first, last]) => messages.pagination.totalLabel(first, last, count);
        const from = total === 0 ? 0 : (activeCurrent - 1) * activePageSize + 1;
        const to = Math.min(total, activeCurrent * activePageSize);
        return <span className={totalStyle}>{renderer(total, [from, to])}</span>;
    };

    return (
        <nav
            {...restProps}
            className={cx(rootStyle, className)}
            role="navigation"
            aria-label={messages.pagination.label}
            data-size={size}
            data-disabled={disabled ? "true" : undefined}
        >
            {renderTotal()}
            <ul className={listStyle}>
                <li>
                    <Button appearance="text" size="s"
                        type="button"
                        className={cx(itemBaseStyle, itemSizeClass)}
                        onClick={handlePageClick(activeCurrent - 1)}
                        disabled={disabled || activeCurrent <= 1}
                        aria-label={prevLabel ?? messages.pagination.previous}
                    >
                        {isRtl ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </Button>
                </li>
                {pageSequence.map((entry, index) => {
                    if (entry === "prev-jump" || entry === "next-jump") {
                        const isPrev = entry === "prev-jump";
                        const jumpTarget = isPrev
                            ? Math.max(1, activeCurrent - 5)
                            : Math.min(totalPages, activeCurrent + 5);
                        return (
                            <li key={`${entry}-${index}`}>
                                <Button appearance="text" size="s"
                                    type="button"
                                    className={cx(ellipsisStyle, ellipsisSizeClass)}
                                    onClick={handlePageClick(jumpTarget)}
                                    disabled={disabled}
                                    aria-label={isPrev ? messages.pagination.jumpBackward : messages.pagination.jumpForward}
                                    data-testid="pagination-ellipsis"
                                >
                                    <span className="rc-pagination-ellipsis-dots" aria-hidden="true">…</span>
                                    <span className="rc-pagination-ellipsis-jump" aria-hidden="true">
                                        {isPrev !== isRtl ? <DoubleChevronLeftIcon /> : <DoubleChevronRightIcon />}
                                    </span>
                                </Button>
                            </li>
                        );
                    }
                    const isActive = entry === activeCurrent;
                    return (
                        <li key={entry}>
                            <Button appearance="text" size="s"
                                type="button"
                                className={cx(itemBaseStyle, itemSizeClass)}
                                onClick={handlePageClick(entry)}
                                disabled={disabled}
                                aria-current={isActive ? "page" : undefined}
                                aria-label={buildPageAriaLabel(entry)}
                            >
                                {entry}
                            </Button>
                        </li>
                    );
                })}
                <li>
                    <Button appearance="text" size="s"
                        type="button"
                        className={cx(itemBaseStyle, itemSizeClass)}
                        onClick={handlePageClick(activeCurrent + 1)}
                        disabled={disabled || activeCurrent >= totalPages}
                        aria-label={nextLabel ?? messages.pagination.next}
                    >
                        {isRtl ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </Button>
                </li>
            </ul>
            {showQuickJumper && (
                <span className={quickJumperStyle}>
                    {messages.pagination.jump}
                    <LineEdit size={size}
                        className={cx(quickJumperInputStyle, inputSizeClass)}
                        value={quickJumperValue}
                        onChange={handleJumperChange}
                        onKeyDown={handleJumperKeyDown}
                        onBlur={commitQuickJumper}
                        disabled={disabled}
                        inputMode="numeric"
                        aria-label={messages.pagination.jump}
                    />
                    {messages.pagination.page}
                </span>
            )}
            {showSizeChanger && (
                <span className={sizeChangerStyle}>
                    <RcSelect
                        options={sizeChangerOptions}
                        value={String(activePageSize)}
                        onValueChange={handlePageSizeChange}
                        size={isSmall ? "small" : size === "large" ? "large" : "medium"}
                        disabled={disabled}
                        aria-label={messages.pagination.pageSize}
                        popupMatchSelectWidth={false}
                    />
                </span>
            )}
        </nav>
    );
};

export default Pagination;
