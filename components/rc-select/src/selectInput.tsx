import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import RcLineEdit from "@crab-dev/rc-line-edit";
import Button, { TokenVars as buttonVars } from "@crab-dev/rc-button";
import { SpinIndicator, TokenVars as spinVars } from '@crab-dev/rc-spin';
import Tag from "@crab-dev/rc-tag";
import { css, cx } from "@crab-dev/css";
import { useCallback, useEffect, useRef, useState, type FC, type KeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode, type Ref } from "react";

import token, { vars } from "./token.js";
import type { FlatOption, SelectOption } from "./types.js";

// ref 可能是回调形式或 RefObject 形式，统一赋值以便与内部 ref 合并
const setRef = (ref: Ref<HTMLDivElement> | undefined, node: HTMLDivElement | null) => {
    if (typeof ref === "function") {
        ref(node);
    } else if (ref) {
        ref.current = node;
    }
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const controlStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    border: ${token.root['border-width']} ${token.root['border-style']} ${token.root['border-color']};
    border-radius: ${token.root['border-radius']};
    background-color: transparent;
    color: ${token.text.color};
    cursor: pointer;
    user-select: none;
    outline: none;
    transition: ${token.root.transition};

    &:hover:not([aria-disabled="true"]):not(:focus-within):not([aria-expanded="true"]):not([data-status]) {
        border-color: ${token.root["border-color-hover"]};
    }

    &:is(:focus-within, [aria-expanded="true"]) {
        border-color: ${token.root["border-color-focus"]};
        box-shadow: ${token.root['box-shadow-focus']};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
    @media (pointer: coarse) {
        && {
            min-height: calc(${token.root.touch['min-height']} + 2 * ${token.root['border-width']});
            padding-block: 0;
            ${vars['clear.width']}: ${token.clear.touch.width};
        }
    }
    @media (forced-colors: active) {
        border-color: ButtonText;
        &:is(:focus-within, [aria-expanded="true"]) {
            outline: ${token.root['outline-width-focus']} solid Highlight;
            outline-offset: ${token.root['outline-offset-focus']};
        }
        &[aria-disabled='true'] { border-color: GrayText; color: GrayText; }
    }
`;

const materialFieldStyle = css`
    &[data-appearance="filled"][data-labeled="true"] > [data-role="select-value"] {
        padding-top: ${token.field.input['padding-top']};
    }
    &[data-labeled="true"][data-floating="false"]:not(:focus-within) > [data-role="select-value"] {
        visibility: hidden;
    }
    &[data-appearance="filled"] {
        border-radius: ${token.root['border-radius']} ${token.root['border-radius']} 0 0;
        border-color: transparent;
        border-bottom-color: ${token.field.indicator['border-color']};
        background: ${token.field.filled['background-color']};
        box-shadow: none;
    }
    &[data-appearance="filled"]:hover:not([aria-disabled="true"]):not(:focus-within):not([aria-expanded="true"]) {
        background: ${token.field.filled['background-color-hover']};
        &:not([data-status]) {
            border-color: transparent;
            border-bottom-color: ${token.text.color};
        }
    }
    &[data-appearance="filled"]:is(:focus-within, [aria-expanded="true"]) {
        border-color: transparent;
        border-bottom-color: ${token.root['border-color-focus']};
        box-shadow: ${token.field.indicator['box-shadow-focus']};
    }
    &&[data-status="error"] > [data-role="select-label"] { color: ${token.field['color-error']}; }
    &&[data-status="warning"] > [data-role="select-label"] { color: ${token.field['color-warning']}; }
    &&[data-appearance="filled"][data-status="error"] {
        border-color: transparent;
        border-bottom-color: ${token.root['border-color-error']};
        &:is(:focus-within, [aria-expanded="true"]) { box-shadow: ${token.field.indicator['box-shadow-error']}; }
    }
    &&[data-appearance="filled"][data-status="warning"] {
        border-color: transparent;
        border-bottom-color: ${token.root['border-color-warning']};
        &:is(:focus-within, [aria-expanded="true"]) { box-shadow: ${token.field.indicator['box-shadow-warning']}; }
    }
    @media (forced-colors: active) {
        && { border-color: CanvasText; background: Canvas; }
        &[aria-disabled="true"] { border-color: GrayText; }
    }
`;

const fieldLabelStyle = css`
    position: absolute;
    z-index: 1;
    inset-inline-start: ${token.field['padding-inline']};
    top: 50%;
    transform: translateY(-50%);
    max-width: calc(100% - 2 * ${token.field['padding-inline']} - ${token.clear.width} - ${token.field.gap});
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
    color: ${token.field.label.color};
    font-size: ${token.size.middle['font-size']};
    line-height: ${token.field.label['line-height']};
    transition: ${token.field.transition};
    [aria-busy="true"] > & {
        max-width: calc(100% - 2 * ${token.field['padding-inline']} - ${token.icon.width} - ${token.clear.width} - 2 * ${token.field.gap});
    }
    [data-appearance="outlined"]:is(:focus-within, [data-floating="true"]) > & {
        top: 0;
        transform: translateY(-50%);
        padding-inline: ${token.field.label['padding-inline']};
        background: ${token.root['background-color']};
        font-size: ${token.field.label['font-size']};
        max-width: calc(100% - 2 * ${token.field['padding-inline']});
    }
    [data-appearance="filled"]:is(:focus-within, [data-floating="true"]) > & {
        top: calc(50% - (${token.size.middle['line-height']} + ${token.field.input['padding-top']}) / 2);
        transform: none;
        padding: 0;
        background: transparent;
        font-size: ${token.field.label['font-size']};
    }
    [data-appearance]:focus-within > &,
    [data-appearance][aria-expanded="true"] > & { color: ${token.field.label['color-focus']}; }
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) { color: CanvasText; }
`;

const controlDisabledStyle = css`
    opacity: ${token.root['opacity-disabled']};
    cursor: not-allowed;
    pointer-events: none;
`;

const controlErrorStyle = css`
    border-color: ${token.root["border-color-error"]};

    &:hover:not([aria-disabled="true"]) {
        border-color: ${token.root["border-color-error"]};
    }

    &:is(:focus-within, [aria-expanded="true"]) {
        border-color: ${token.root["border-color-error"]};
        box-shadow: ${token.root.validation['box-shadow-error']};
    }
`;

const controlWarningStyle = css`
    border-color: ${token.root["border-color-warning"]};

    &:hover:not([aria-disabled="true"]) {
        border-color: ${token.root["border-color-warning"]};
    }

    &:is(:focus-within, [aria-expanded="true"]) {
        border-color: ${token.root["border-color-warning"]};
        box-shadow: ${token.root.validation['box-shadow-warning']};
    }
`;

const valueWrapStyle = css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
`;

const singleValueStyle = css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const placeholderStyle = css`
    color: ${token.text["color-placeholder"]};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const searchInputStyle = css`
    flex: 1;
    min-width: 0;
    /* The Select field owns focus, including forced colors; avoid a second ring. */
    &&:focus-within { outline: none; }
`;

const caretStyle = css`
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.icon.width};
    height: ${token.icon.width};
    color: ${token.icon.color};
    & > svg { width: 100%; height: 100%; }
    transition: transform ${token.motion.spatial.transition};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const caretOpenStyle = css`
    transform: rotate(180deg);
`;

const tagLabelStyle = css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 120px;
`;

// 清除与箭头共用固定按钮位；加载提示保留独立位置。
const suffixWrapStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    gap: ${token.field.gap};
    margin-inline-start: ${token.field.gap};
`;

// Button 提供焦点、状态层和原生键盘行为；Select 只负责字段内部尺寸。
const actionStyle = css`
    flex-shrink: 0;
    && {
        ${buttonVars['icon.width']}: ${token.icon.width};
        padding: 0;
        width: ${token.clear.width};
        min-width: ${token.clear.width};
        height: ${token.clear.height};
        color: ${token.clear.color};
    }
    &&:hover { color: ${token.clear['color-hover']}; }
    // 字段容器已经应用禁用透明度。
    &&:disabled > span { opacity: 1; }
    @media (pointer: coarse) {
        && {
            width: ${token.clear.touch.width};
            min-width: ${token.clear.touch.width};
            height: ${token.clear.touch.width};
        }
    }
`;

// 复用 rc-spin 的纯视觉环：旋转与 reduced-motion 降级由其统一承担。
// 加载语义由 combobox 的 aria-busy 承担（展开后则是 listbox），此处仅作视觉意符，
// 故用 SpinIndicator 而非 Spin —— 后者会再嵌一层 role="status"，导致重复播报。
const loadingIconStyle = css`
    display: inline-flex;
    align-items: center;
    color: ${token.root["color-loading"]};
    flex-shrink: 0;
    --rc-spin-size: ${token.icon.width};
    ${spinVars['ring.indicator.stroke']}: currentColor;
    ${spinVars['ring.track.stroke']}: transparent;
`;

// 度量(padding/字号/行高)与"高度策略"分开维护——原因见下方 sizeHeight*Map 的注释。
const sizeMetricsMap = {
    large: css`
        padding: ${token.size.large.padding};
        ${vars['clear.width']}: ${token.size.large.action.width};
        ${vars['clear.height']}: ${token.size.large.action.width};
        font-size: ${token.size.large['font-size']};
        line-height: ${token.size.large["line-height"]};
    `,
    middle: css`
        padding: ${token.size.middle.padding};
        ${vars['clear.width']}: ${token.size.middle.action.width};
        ${vars['clear.height']}: ${token.size.middle.action.width};
        font-size: ${token.size.middle['font-size']};
        line-height: ${token.size.middle["line-height"]};
    `,
    small: css`
        padding: ${token.size.small.padding};
        ${vars['clear.width']}: ${token.size.small.action.width};
        ${vars['clear.height']}: ${token.size.small.action.width};
        font-size: ${token.size.small['font-size']};
        line-height: ${token.size.small["line-height"]};
    `,
};

// 单选按字段档位对齐；文本行高增大时允许高度随内容增长。
const sizeHeightFixedMap = {
    large: css`height: max(${token.size.large.height}, calc(1lh + 2 * ${token.root['border-width']}));`,
    middle: css`height: max(${token.size.middle.height}, calc(1lh + 2 * ${token.root['border-width']}));`,
    small: css`height: max(${token.size.small.height}, calc(1lh + 2 * ${token.root['border-width']}));`,
};

// 多选:必须用 min-height——tag 多到换行时若也用固定 height,换行的 tag 会直接
// 溢出边框外(已用真实多标签场景验证过),因此多选场景保留可被内容撑高的弹性。
const sizeHeightFlexibleMap = {
    large: css`min-height: ${token.size.large.height};`,
    middle: css`min-height: ${token.size.middle.height};`,
    small: css`min-height: ${token.size.small.height};`,
};

// ─── Icons ───────────────────────────────────────────────────────────────────

const CaretIcon = () => (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor">
        <path d="m7 10 5 5 5-5z" />
    </svg>
);

const ClearIcon = () => (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 6-12 12M6 6l12 12" />
    </svg>
);

// ─── Props ───────────────────────────────────────────────────────────────────

interface SelectInputProps {
    ref?: Ref<HTMLDivElement>;
    id: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    disabled: boolean;
    searchable: boolean;
    multiple: boolean;
    size: "large" | "middle" | "small";
    status?: "error" | "warning";
    appearance: "outlined" | "filled";
    label?: string;
    labelId: string;
    required?: boolean;
    allowClear: boolean;
    loading: boolean;
    maxTagCount?: number;
    autoFocus: boolean;
    placeholder: string;
    selectedOptions: SelectOption[];
    searchText: string;
    highlightIndex: number;
    highlightedOption: FlatOption | undefined;
    listboxId: string;
    tagRender?: (option: SelectOption, onClose: () => void) => ReactNode;
    onSearchTextChange: (value: string) => void;
    onOpenChange: (nextOpen: boolean) => void;
    onWidthChange: (width: number) => void;
    onMoveHighlight: (direction: 1 | -1) => void;
    onSelectHighlighted: (option: FlatOption) => void;
    onClear: () => void;
    onRemoveTag: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

const SelectInput: FC<SelectInputProps> = ({
    ref,
    id,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    disabled,
    searchable,
    multiple,
    size,
    status,
    appearance,
    label,
    labelId,
    required,
    allowClear,
    loading,
    maxTagCount,
    autoFocus,
    placeholder,
    selectedOptions,
    searchText,
    highlightIndex,
    highlightedOption,
    listboxId,
    tagRender,
    onSearchTextChange,
    onOpenChange,
    onWidthChange,
    onMoveHighlight,
    onSelectHighlighted,
    onClear,
    onRemoveTag,
    onFocus,
    onBlur,
}) => {
    const { state, refs, dispatch } = useDropdownContext<HTMLDivElement>();
    const controlRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const open = state.open;
    const [hovered, setHovered] = useState(false);
    const [actionFocused, setActionFocused] = useState(false);
    const [withoutHover, setWithoutHover] = useState(false);

    useEffect(() => {
        const media = window.matchMedia?.('(hover: none)');
        if (!media) return;
        const update = () => setWithoutHover(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    const onOpenChangeRef = useRef(onOpenChange);
    onOpenChangeRef.current = onOpenChange;

    // 例外 1（可变实例状态 ref）：ref callback 需要稳定，避免每次渲染都以 null 触发一轮
    // 卸载态 refs.setReference(null) / 外部 ref 清空后再重新挂载。
    const mergeRef = useCallback(
        (node: HTMLDivElement | null) => {
            controlRef.current = node;

            if (typeof refs.setReference === "function") {
                refs.setReference(node);
            }

            setRef(ref, node);
        },
        [refs.setReference, ref],
    );

    useEffect(() => {
        const el = controlRef.current;

        if (!el) {
            return;
        }

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                onWidthChange(entry.target.getBoundingClientRect().width);
            }
        });

        observer.observe(el);

        return () => observer.disconnect();
    }, [onWidthChange]);

    useEffect(() => {
        if (open && searchable) {
            queueMicrotask(() => inputRef.current?.focus());
        }
    }, [open, searchable]);

    useEffect(() => {
        if (autoFocus && controlRef.current) {
            controlRef.current.focus();
        }
    }, [autoFocus]);

    // 点击外部关闭已由 RcDropdownContainer 统一收口(基于 FloatingTree 的 useDismiss,
    // 能正确识别嵌套下拉自身浮层,不会像手写 ref.contains() 判定那样误判)。
    // 这里只需把 open 的每次变化(无论是本组件触发还是 RcDropdownContainer 外部关闭触发)
    // 都转发给外部 onOpenChange,避免在各处触发点重复调用。
    const isFirstOpenRender = useRef(true);
    useEffect(() => {
        if (isFirstOpenRender.current) {
            isFirstOpenRender.current = false;
            return;
        }

        onOpenChangeRef.current(open);
    }, [open]);

    const handleClick = () => {
        if (disabled) {
            return;
        }

        dispatch({ type: "setOpen", payload: !open });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) {
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();

                if (!open) {
                    dispatch({ type: "setOpen", payload: true });
                }

                onMoveHighlight(1);
                break;

            case "ArrowUp":
                e.preventDefault();

                if (!open) {
                    dispatch({ type: "setOpen", payload: true });
                }

                onMoveHighlight(-1);
                break;

            case "Enter":
                e.preventDefault();

                if (open && highlightedOption) {
                    onSelectHighlighted(highlightedOption);

                    if (!multiple) {
                        dispatch({ type: "setOpen", payload: false });
                    }
                } else if (!open) {
                    dispatch({ type: "setOpen", payload: true });
                }

                break;

            case " ":
                if (!searchable || !open) {
                    e.preventDefault();

                    if (!open) {
                        dispatch({ type: "setOpen", payload: true });
                    }
                }

                break;

            case "Escape":
                if (open) {
                    e.preventDefault();
                    dispatch({ type: "setOpen", payload: false });
                }

                break;

            case "Backspace":
                if (multiple && searchText === "" && selectedOptions.length > 0) {
                    const lastOption = selectedOptions[selectedOptions.length - 1];
                    onRemoveTag(lastOption.value);
                }

                break;

            default:
                break;
        }
    };

    const triggerClear = () => {
        // The clear control unmounts when the value disappears. Restore its owner
        // before notifying the caller so keyboard users can choose a new value.
        controlRef.current?.focus();
        onClear();

        if (open) {
            dispatch({ type: "setOpen", payload: false });
        }
    };

    const handleClearClick = (e: ReactMouseEvent) => {
        e.stopPropagation();
        triggerClear();
    };

    // 交给原生按钮激活，阻止父级 combobox 把同一按键解释成展开或选择。
    const handleClearKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
        }
    };

    const canClear = allowClear && !disabled && selectedOptions.length > 0;
    const showClear = canClear && (hovered || actionFocused || withoutHover);

    const renderTag = (opt: SelectOption) => {
        const handleClose = () => onRemoveTag(opt.value);

        if (tagRender) {
            return <span key={opt.value}>{tagRender(opt, handleClose)}</span>;
        }

        return (
            <Tag
                key={opt.value}
                size="small"
                closable
                closeAriaLabel={`Remove ${typeof opt.label === "string" ? opt.label : opt.value}`}
                onClose={handleClose}
            >
                <span className={tagLabelStyle}>{opt.label}</span>
            </Tag>
        );
    };

    const renderTags = () => {
        if (maxTagCount !== undefined && selectedOptions.length > maxTagCount) {
            const visible = selectedOptions.slice(0, maxTagCount);
            const overflowCount = selectedOptions.length - maxTagCount;

            return (
                <>
                    {visible.map(renderTag)}
                    <Tag size="small">+{overflowCount}</Tag>
                </>
            );
        }

        return selectedOptions.map(renderTag);
    };

    const renderContent = () => {
        if (searchable && open) {
            return (
                <>
                    {multiple && renderTags()}
                    <RcLineEdit
                        ref={inputRef}
                        bordered={false}
                        value={searchText}
                        placeholder={multiple && selectedOptions.length > 0 ? "" : placeholder}
                        onChange={(e) => onSearchTextChange(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={searchInputStyle}
                    />
                </>
            );
        }

        if (multiple) {
            if (selectedOptions.length === 0) {
                return <span className={placeholderStyle}>{placeholder}</span>;
            }

            return renderTags();
        }

        if (selectedOptions.length === 0) {
            return <span className={placeholderStyle}>{placeholder}</span>;
        }

        return <span className={singleValueStyle}>{selectedOptions[0]?.label}</span>;
    };

    // 仅在展开时暴露 aria-controls/aria-activedescendant:浮层关闭时 SelectOverlay 未挂载,
    // 引用一个不存在的 id 对屏幕阅读器没有意义(§3 触发器与目标显式关联)。
    const activeDescendantId =
        open && highlightIndex >= 0 ? `${listboxId}-option-${highlightIndex}` : undefined;

    return (
        <div
            id={id}
            role="combobox"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-required={required || undefined}
            aria-expanded={open}
            aria-disabled={disabled}
            // 未展开时并无 listbox 可承载加载语义，故由 combobox 自身标注：
            // 否则输入框里那枚 spinner 对读屏完全不可感知
            aria-busy={loading || undefined}
            aria-haspopup="listbox"
            aria-controls={open ? listboxId : undefined}
            aria-activedescendant={activeDescendantId}
            aria-invalid={status === "error" ? true : undefined}
            data-appearance={appearance}
            data-clearable={canClear}
            data-labeled={Boolean(label)}
            data-floating={Boolean(open || selectedOptions.length > 0 || searchText)}
            data-status={status}
            tabIndex={disabled ? -1 : 0}
            ref={mergeRef}
            className={cx.call(undefined, controlStyle,
                sizeMetricsMap[size],
                multiple ? sizeHeightFlexibleMap[size] : sizeHeightFixedMap[size],
                disabled && controlDisabledStyle,
                status === "error" && controlErrorStyle,
                status === "warning" && controlWarningStyle,
                materialFieldStyle,
            )}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            onPointerOver={(event) => {
                if (event.pointerType !== 'touch') setHovered(true);
            }}
            onPointerOut={(event) => {
                if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
                    setHovered(false);
                }
            }}
        >
            {label && <span id={labelId} data-role="select-label" className={fieldLabelStyle}>{label}{required ? " *" : ""}</span>}
            <div data-role="select-value" className={valueWrapStyle}>{renderContent()}</div>
            <span data-role="select-suffix" className={suffixWrapStyle}>
                {loading ? (
                    <span aria-hidden="true" className={loadingIconStyle}><SpinIndicator /></span>
                ) : null}
                <Button
                    data-role={showClear ? 'select-clear' : 'select-caret'}
                    className={actionStyle}
                    type="button"
                    appearance="text"
                    shape="circle"
                    size={size}
                    disabled={disabled}
                    aria-label={showClear ? 'Clear' : open ? 'Close options' : 'Open options'}
                    aria-expanded={showClear ? undefined : open}
                    icon={showClear ? <ClearIcon /> : <span aria-hidden="true" className={cx.call(undefined, caretStyle, open && caretOpenStyle)}><CaretIcon /></span>}
                    onFocus={() => setActionFocused(true)}
                    onBlur={() => setActionFocused(false)}
                    onClick={(event) => {
                        if (showClear) handleClearClick(event);
                        else {
                            event.stopPropagation();
                            handleClick();
                        }
                    }}
                    onKeyDown={handleClearKeyDown}
                />
            </span>
        </div>
    );
};

export default SelectInput;
