import Checkbox from "@crab-dev/rc-checkbox";
import { componentDensityMetrics, useConfig, useLocale, type ConfigSize } from '@crab-dev/rc-config-provider';
import { SpinIndicator } from '@crab-dev/rc-spin';
import RcVirtual, { type VirtualHandle } from "@crab-dev/rc-virtual";
import { useMediaQuery } from '@crab-dev/rc-hooks';
import { cx } from "@crab-dev/css";
import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import { useEffect, useLayoutEffect, useRef, useState, type Dispatch, type FC, type ReactNode, type SetStateAction } from "react";
import type { FlatOption, SelectChangeDetails, SelectOption } from "./types.js";
import { overlayStyle, optionStyle, optionHighlightStyle, measureStyle, optionSelectedStyle, optionSelectedSingleStyle, optionDisabledStyle, optionLabelStyle, checkIconStyle, checkboxIndicatorStyle, emptyStyle, groupLabelStyle, groupedOptionStyle, virtualTopSpacerStyle, virtualBottomSpacerStyle, loadingStyle } from "./selectOverlay.styles.js";
// ─── Helpers ─────────────────────────────────────────────────────────────────

const hasGroups = (options: FlatOption[]): boolean => options.some((opt) => opt.isGroupLabel);

// ─── Constants ───────────────────────────────────────────────────────────────

const DROPDOWN_PADDING = 4;
const MAX_VIEWPORT_HEIGHT = 256;

// ─── Props ───────────────────────────────────────────────────────────────────

interface SelectOverlayProps {
    size: ConfigSize;
    multiple: boolean;
    disabled: boolean;
    loading: boolean;
    filteredOptions: FlatOption[];
    selectedValues: string[];
    triggerWidth: number;
    highlightIndex: number;
    listboxId: string;
    notFoundContent?: ReactNode;
    popupClassName?: string;
    optionRender?: (option: SelectOption, info: { selected: boolean }) => ReactNode;
    dropdownRender?: (menu: ReactNode) => ReactNode;
    onOptionSelect: (option: FlatOption, event: SelectChangeDetails['event']) => void;
    onHighlightChange: Dispatch<SetStateAction<number>>;
}

// ─── Component ───────────────────────────────────────────────────────────────

const SelectOverlay: FC<SelectOverlayProps> = ({
    size,
    multiple,
    disabled,
    loading,
    filteredOptions,
    selectedValues,
    triggerWidth,
    highlightIndex,
    listboxId,
    notFoundContent,
    popupClassName,
    optionRender,
    dropdownRender,
    onOptionSelect,
    onHighlightChange,
}) => {
    const { dispatch } = useDropdownContext<HTMLDivElement>();
    const coarsePointer = useMediaQuery('(pointer: coarse)');
    // Mutable DOM instance: observe rendered text / token overrides without using
    // render-time layout reads. Virtual offsets must match the actual row height.
    const overlayRef = useRef<HTMLDivElement>(null);
    const [measuredRowHeight, setMeasuredRowHeight] = useState(0);
    const [measuredContentWidth, setMeasuredContentWidth] = useState(0);
    const { density } = useConfig();
    const { messages } = useLocale();
    const rowHeight = Math.max(coarsePointer ? 48 : componentDensityMetrics[density].item, measuredRowHeight);
    useLayoutEffect(() => {
        const overlay = overlayRef.current;
        const option = overlay?.querySelector<HTMLElement>('[data-select-option-measure]');
        if (!overlay || !option) return;
        const measure = () => {
            const height = option.getBoundingClientRect().height;
            if (height > 0) {
                overlayRef.current?.style.setProperty('--select-option-measured-height', `${height}px`);
                setMeasuredRowHeight(height);
            }
            // Match the actual popup content box, including its border and any
            // padding override. A fixed 160px minimum overflows narrow fields
            // and lets focus/scrolling clip both the label and selected marker.
            const style = overlay.ownerDocument.defaultView?.getComputedStyle(overlay);
            const paddingStart = Number.parseFloat(style?.paddingLeft ?? '') || 0;
            const paddingEnd = Number.parseFloat(style?.paddingRight ?? '') || 0;
            const width = overlay.clientWidth - paddingStart - paddingEnd;
            if (width > 0) setMeasuredContentWidth(width);
        };
        measure();
        if (typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(measure);
        observer.observe(option);
        observer.observe(overlay);
        return () => observer.disconnect();
    }, [coarsePointer, density, filteredOptions.length, loading, size]);
    // 例外 1(可变实例状态 ref):持有 RcVirtual 的命令式句柄,用于把高亮行滚入视口。
    const gridRef = useRef<VirtualHandle | null>(null);

    // 把高亮项滚入视口。RcVirtual 是受控虚拟列表:可见行由其内部 scrollTop state 决定,
    // 原生 scrollIntoView 无法驱动它(改 DOM scrollTop 不会同步回 state),因此必须走它
    // 暴露的命令式 scrollToCell,按【全局行索引】滚动。highlightIndex 恰好等于该行索引。
    useEffect(() => {
        if (highlightIndex < 0) {
            return;
        }

        gridRef.current?.scrollToCell({ rowIndex: highlightIndex });
    }, [highlightIndex]);

    const rowCount = filteredOptions.length;
    const contentWidth = measuredContentWidth || Math.max(triggerWidth - DROPDOWN_PADDING * 2, 160);
    const viewportHeight = Math.min(MAX_VIEWPORT_HEIGHT, rowCount * rowHeight);
    // React Compiler 会按 rowCount / contentWidth 缓存这两个派生数组，保持 Virtual 前缀和缓存有效。
    const rows = Array<number>(rowCount).fill(rowHeight);
    const columns = [contentWidth];

    if (loading) {
        return (
            <div id={listboxId} role="listbox" aria-busy="true" data-select-overlay className={cx.call(undefined, overlayStyle, popupClassName)}>
                <div className={loadingStyle}>
                    <SpinIndicator />
                </div>
            </div>
        );
    }

    if (filteredOptions.length === 0) {
        return (
            <div id={listboxId} role="listbox" data-select-overlay className={cx.call(undefined, overlayStyle, popupClassName)}>
                <div className={emptyStyle}>{notFoundContent ?? messages.select.empty}</div>
            </div>
        );
    }

    const isGrouped = hasGroups(filteredOptions);

    const menu = (
        <RcVirtual
            gridRef={gridRef}
            viewportWidth={contentWidth}
            viewportHeight={viewportHeight}
            gridTemplateColumns={columns}
            gridTemplateRows={rows}
            overscanRowCount={4}
            renderRows={(rowRange: [number, number]): ReactNode => {
                const nodes: ReactNode[] = [
                    <div
                        key="__select-top-padding__"
                        data-select-virtual-spacer="top"
                        className={virtualTopSpacerStyle}
                    />
                ];

                for (let i = rowRange[0]; i <= rowRange[1]; i += 1) {
                    const option = filteredOptions[i];

                    if (option.isGroupLabel) {
                        nodes.push(
                            <div key={option.value} data-group-label className={groupLabelStyle}>
                                {option.label}
                            </div>,
                        );
                        continue;
                    }

                    const selected = selectedValues.includes(option.value);
                    const highlighted = i === highlightIndex;

                    const content = optionRender
                        ? optionRender(option, { selected })
                        : (
                            <>
                                {multiple ? (
                                    <Checkbox
                                        className={checkboxIndicatorStyle}
                                        checked={selected}
                                        disabled={disabled || option.disabled}
                                        tabIndex={-1}
                                        aria-label={typeof option.label === "string" ? option.label : option.value}
                                    />
                                ) : null}
                                <span className={optionLabelStyle}>{option.label}</span>
                                {!multiple && selected ? (
                                    <span className={checkIconStyle}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                    </span>
                                ) : null}
                            </>
                        );

                    // 多选行内的 Checkbox 自带 aria-label,若不显式覆盖,option 的无障碍名会走
                    // name-from-content 把 checkbox 的 aria-label 与后面的文案标签拼接两遍
                    // (读作"JavaScript JavaScript")。单选没有这个子控件,保留原生 name-from-content。
                    const optionAriaLabel = multiple
                        ? (typeof option.label === "string" ? option.label : option.value)
                        : undefined;

                    nodes.push(
                        <div
                            key={option.value}
                            id={`${listboxId}-option-${i}`}
                            role="option"
                            aria-selected={selected}
                            aria-disabled={disabled || option.disabled || undefined}
                            data-highlighted={highlighted || undefined}
                            aria-label={optionAriaLabel}
                            className={cx.call(undefined, optionStyle,
                                isGrouped && groupedOptionStyle,
                                selected && (multiple ? optionSelectedStyle : optionSelectedSingleStyle),
                                highlighted && optionHighlightStyle,
                                (disabled || option.disabled) && optionDisabledStyle,
                            )}
                            onMouseEnter={() => { if (!disabled) onHighlightChange(i); }}
                            onClick={(event) => {
                                if (disabled) return;
                                onOptionSelect(option, event);

                                if (!multiple && !option.disabled) {
                                    dispatch({ type: "setOpen", payload: false });
                                }
                            }}
                        >
                            {content}
                        </div>,
                    );
                }

                nodes.push(
                    <div
                        key="__select-bottom-padding__"
                        data-select-virtual-spacer="bottom"
                        className={virtualBottomSpacerStyle}
                    />
                );

                return nodes;
            }}
        />
    );

    return (
        <div
            id={listboxId}
            ref={overlayRef}
            data-select-overlay
            className={cx.call(undefined, overlayStyle, popupClassName)}
            role="listbox"
            aria-multiselectable={multiple || undefined}
            aria-disabled={disabled || undefined}
        >
            <div aria-hidden="true" data-select-option-measure="" className={cx(optionStyle, measureStyle)}>M</div>
            {dropdownRender ? dropdownRender(menu) : menu}
        </div>
    );
};

export default SelectOverlay;
