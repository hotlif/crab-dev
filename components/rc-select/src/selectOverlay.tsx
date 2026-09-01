import Checkbox from "@crab-dev/rc-checkbox";
import { SpinIndicator, vars as spinVars } from "@crab-dev/rc-spin";
import RcVirtual, { type VirtualHandle } from "@crab-dev/rc-virtual";
import { css, cx } from "@crab-dev/css";
import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import { useEffect, useRef, type Dispatch, type FC, type ReactNode, type SetStateAction } from "react";

import token from "./token.js";
import type { FlatOption, SelectOption } from "./types.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const hasGroups = (options: FlatOption[]): boolean => options.some((opt) => opt.isGroupLabel);

// ─── Styles ──────────────────────────────────────────────────────────────────

const overlayStyle = css`
    padding: ${token.dropdown.padding};
    overflow: hidden;
`;

const optionStyle = css`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 6px 8px;
    border-radius: 3px;
    cursor: pointer;
    user-select: none;
    height: 32px;
    box-sizing: border-box;
    font-size: 14px;
    outline: none;
    transition: ${token.transition};

    &:hover {
        background-color: ${token.option["color-hover"]};
    }

    &:active {
        background-color: ${token.option["color-hover"]};
    }

    /* 选中背景直接绑定 aria-selected(而非另开一个由 JS 条件应用的 class),
       靠 [属性选择器] 叠加 class 把 specificity 提到 (0,2,0)——正好压过
       上面的 :hover/:active(同为 (0,2,0) 但声明更早)以及下面 optionHighlightStyle
       这个纯 class 选择器 (0,1,0),确保"选中"背景不会被鼠标悬停或键盘高亮盖掉。 */
    &[aria-selected="true"] {
        background-color: ${token.option["background-selected"]};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const optionHighlightStyle = css`
    background-color: ${token.option["highlight-background"]};
`;

const optionSelectedStyle = css`
    font-weight: 500;
`;

// 单选选中态:token.option['color-selected'](品牌色)此前定义了却从未被引用,
// 选中项只靠 font-weight:500 区分——太弱,容易被忽略。多选场景的选中态已经由
// Checkbox 的勾选视觉承担,故不叠加文字变色,只强化单选这一支(§2 状态必须有意符)。
const optionSelectedSingleStyle = css`
    font-weight: 500;
    color: ${token.option["color-selected"]};
`;

const optionDisabledStyle = css`
    opacity: 0.5;
    pointer-events: none;
`;

const optionLabelStyle = css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
`;

const checkIconStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-left: 8px;
    color: ${token.option["color-selected"]};
`;

// 复选框仅作选中态的视觉指示，实际选中/取消由整行 onClick 统一触发（见下方 onClick），
// 这里用 pointer-events: none 阻止其抢占点击，避免与整行点击重复触发切换。
const checkboxIndicatorStyle = css`
    display: inline-flex;
    flex-shrink: 0;
    margin-right: 8px;
    pointer-events: none;
`;

const emptyStyle = css`
    padding: 24px 8px;
    color: ${token.text["color-placeholder"]};
    text-align: center;
    font-size: 14px;
`;

const groupLabelStyle = css`
    display: flex;
    align-items: center;
    padding: 4px 8px;
    height: 32px;
    box-sizing: border-box;
    font-size: ${token.group["font-size"]};
    color: ${token.group.color};
    font-weight: 500;
    user-select: none;
    margin-top: 4px;

    &:first-child {
        margin-top: 0;
    }
`;

const groupedOptionStyle = css`
    padding-left: 20px;
`;

// 复用 rc-spin 的纯视觉环：旋转与 reduced-motion 降级由其统一承担。
// 外层 listbox 已标注 aria-busy="true"，故此处不再嵌套 role="status"（会重复播报且破坏 listbox 结构）。
const loadingStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 8px;
    color: ${token.loading.color};
    --rc-spin-size: 20px;
    ${spinVars['ring.indicator-color']}: currentColor;
    ${spinVars['ring.track-color']}: transparent;
`;

// ─── Constants ───────────────────────────────────────────────────────────────

const DROPDOWN_PADDING = 4;
const ROW_HEIGHT = 32;
const MAX_VIEWPORT_HEIGHT = 256;

// ─── Props ───────────────────────────────────────────────────────────────────

interface SelectOverlayProps {
    multiple: boolean;
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
    onOptionSelect: (option: FlatOption) => void;
    onOpenChange: (nextOpen: boolean) => void;
    onHighlightChange: Dispatch<SetStateAction<number>>;
}

// ─── Component ───────────────────────────────────────────────────────────────

const SelectOverlay: FC<SelectOverlayProps> = ({
    multiple,
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
    onOpenChange,
    onHighlightChange,
}) => {
    const { dispatch } = useDropdownContext<HTMLDivElement>();
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
    const contentWidth = Math.max(triggerWidth - DROPDOWN_PADDING * 2, 160);
    const viewportHeight = Math.min(MAX_VIEWPORT_HEIGHT, rowCount * ROW_HEIGHT);
    // React Compiler 会按 rowCount / contentWidth 缓存这两个派生数组，保持 Virtual 前缀和缓存有效。
    const rows = Array<number>(rowCount).fill(ROW_HEIGHT);
    const columns = [contentWidth];

    if (loading) {
        return (
            <div id={listboxId} role="listbox" aria-busy="true" data-select-overlay className={cx(overlayStyle, popupClassName)}>
                <div className={loadingStyle}>
                    <SpinIndicator />
                </div>
            </div>
        );
    }

    if (filteredOptions.length === 0) {
        return (
            <div id={listboxId} role="listbox" data-select-overlay className={cx(overlayStyle, popupClassName)}>
                <div className={emptyStyle}>{notFoundContent ?? "无匹配选项"}</div>
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
                        className={css`
							display: inline-block;
							height: var(--crab-rc-virtual-top-padding-height, 0px);
							width: 100%;
						`}
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
                                        disabled={option.disabled}
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
                            aria-label={optionAriaLabel}
                            className={cx(
                                optionStyle,
                                isGrouped && groupedOptionStyle,
                                selected && (multiple ? optionSelectedStyle : optionSelectedSingleStyle),
                                highlighted && optionHighlightStyle,
                                option.disabled && optionDisabledStyle,
                            )}
                            onMouseEnter={() => onHighlightChange(i)}
                            onClick={() => {
                                onOptionSelect(option);

                                if (!multiple && !option.disabled) {
                                    dispatch({ type: "setOpen", payload: false });
                                    onOpenChange(false);
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
                        className={css`
							display: inline-block;
							height: var(--crab-rc-virtual-bottom-padding-height, 0px);
							width: 100%;
						`}
                    />
                );

                return nodes;
            }}
        />
    );

    return (
        <div
            id={listboxId}
            data-select-overlay
            className={cx(overlayStyle, popupClassName)}
            role="listbox"
            aria-multiselectable={multiple || undefined}
        >
            {dropdownRender ? dropdownRender(menu) : menu}
        </div>
    );
};

export default SelectOverlay;
