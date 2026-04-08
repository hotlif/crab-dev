import RcVirtual from "@crab-dev/rc-virtual";
import { css, cx } from "@linaria/core";
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
    cursor: default;
    user-select: none;
    height: 32px;
    box-sizing: border-box;
    font-size: 14px;
    outline: none;

    &:hover {
        background-color: ${token.option["color-hover"]};
    }
`;

const optionHighlightStyle = css`
    background-color: ${token.option["highlight-background"]};
`;

const optionSelectedStyle = css`
    font-weight: 500;
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

const loadingStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 8px;
    color: ${token.loading.color};

    & > svg {
        animation: overlay-spin 1s linear infinite;
    }

    @keyframes overlay-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
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
    notFoundContent,
    popupClassName,
    optionRender,
    dropdownRender,
    onOptionSelect,
    onOpenChange,
    onHighlightChange,
}) => {
    const { dispatch } = useDropdownContext<HTMLDivElement>();
    const listRef = useRef<HTMLDivElement>(null);

    // Scroll the highlighted option into view
    useEffect(() => {
        if (highlightIndex < 0 || !listRef.current) {
            return;
        }

        const container = listRef.current;
        const items = container.querySelectorAll("[role='option'], [data-group-label]");
        const target = items[highlightIndex] as HTMLElement | undefined;

        if (target && typeof target.scrollIntoView === "function") {
            target.scrollIntoView({ block: "nearest" });
        }
    }, [highlightIndex]);

    if (loading) {
        return (
            <div data-select-overlay className={cx(overlayStyle, popupClassName)}>
                <div className={loadingStyle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                </div>
            </div>
        );
    }

    if (filteredOptions.length === 0) {
        return (
            <div data-select-overlay className={cx(overlayStyle, popupClassName)}>
                <div className={emptyStyle}>{notFoundContent ?? "无匹配选项"}</div>
            </div>
        );
    }

    const rowCount = filteredOptions.length;
    const contentWidth = Math.max(triggerWidth - DROPDOWN_PADDING * 2, 160);
    const viewportHeight = Math.min(MAX_VIEWPORT_HEIGHT, rowCount * ROW_HEIGHT);
    const rows = Array<number>(rowCount).fill(ROW_HEIGHT);

    const isGrouped = hasGroups(filteredOptions);

    const menu = (
        <RcVirtual
            viewportWidth={contentWidth}
            viewportHeight={viewportHeight}
            gridTemplateColumns={[contentWidth]}
            gridTemplateRows={rows}
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
                                <span className={optionLabelStyle}>{option.label}</span>
                                {selected ? (
                                    <span className={checkIconStyle}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                    </span>
                                ) : null}
                            </>
                        );

                    nodes.push(
                        <div
                            key={option.value}
                            role="option"
                            aria-selected={selected}
                            className={cx(
                                optionStyle,
                                isGrouped && groupedOptionStyle,
                                selected && optionSelectedStyle,
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
            ref={listRef}
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