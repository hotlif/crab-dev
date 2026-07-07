import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import RcLineEdit from "@crab-dev/rc-line-edit";
import Tag from "@crab-dev/rc-tag";
import { css, cx } from "@linaria/core";
import { useCallback, useEffect, useRef, type FC, type KeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode, type Ref } from "react";

import token from "./token.js";
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
    display: inline-flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid ${token.border.color};
    border-radius: ${token.border.radius};
    background-color: transparent;
    color: ${token.text.color};
    cursor: pointer;
    user-select: none;
    outline: none;
    transition: ${token.transition};

    &:hover:not([aria-disabled="true"]) {
        border-color: ${token.border["color-hover"]};
    }

    &:hover:not([aria-disabled="true"]) [data-role="select-clear"] {
        opacity: 1;
    }

    &:hover:not([aria-disabled="true"]) [data-role="select-caret"] {
        opacity: 0;
    }

    &:focus-visible {
        border-color: ${token.border["color-focus"]};
        box-shadow: ${token.shadow.focus};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const controlFocusStyle = css`
    border-color: ${token.border["color-focus"]};
    box-shadow: ${token.shadow.focus};
`;

const controlDisabledStyle = css`
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
`;

const controlErrorStyle = css`
    border-color: ${token.border["color-error"]};

    &:hover:not([aria-disabled="true"]) {
        border-color: ${token.border["color-error"]};
    }

    &:focus-visible {
        border-color: ${token.border["color-error"]};
        box-shadow: ${token.shadow["focus-error"]};
    }
`;

const controlErrorFocusStyle = css`
    border-color: ${token.border["color-error"]};
    box-shadow: ${token.shadow["focus-error"]};
`;

const controlWarningStyle = css`
    border-color: ${token.border["color-warning"]};

    &:hover:not([aria-disabled="true"]) {
        border-color: ${token.border["color-warning"]};
    }

    &:focus-visible {
        border-color: ${token.border["color-warning"]};
        box-shadow: ${token.shadow["focus-warning"]};
    }
`;

const controlWarningFocusStyle = css`
    border-color: ${token.border["color-warning"]};
    box-shadow: ${token.shadow["focus-warning"]};
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
`;

const caretStyle = css`
    margin-left: 0;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    color: ${token.text["color-placeholder"]};
    transition: transform 200ms ease, opacity 100ms ease;

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

// 容器本身跟随图标自然尺寸(12px),不设最小尺寸——之前在这里用 min-block-size:24px
// 撑命中区域,结果把它当成 flex 子项撑高了整个 controlStyle 的实际高度:small(24px)/
// middle(32px)两档的可视高度都被拖到接近 34px,small 完全没矮下去。
// 命中区域下限改由 clearStyle 自己用 inset 负值向外扩展(见下方),
// absolute 定位不占文档流,不会影响这里的 flex 布局高度。
const suffixWrapStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-left: 8px;
`;

// inset:-6px 让 12px 图标的可点击范围向四周各扩 6px,凑够 24px 命中区域下限(§1),
// 靠 absolute 定位脱离文档流实现,不像撑大父容器 min-size 那样连带撑高整行控件。
const clearStyle = css`
    display: inline-flex;
    align-items: center;
    color: ${token.clear.color};
    cursor: pointer;
    position: absolute;
    inset: -6px;
    justify-content: center;
    opacity: 0;
    transition: opacity 100ms ease;

    &:hover {
        color: ${token.clear["color-hover"]};
    }

    /* 键盘聚焦时的持久替代路径(§2):hover 之外唯一能让清除按钮可见的意符 */
    &:focus-visible {
        opacity: 1;
        outline: none;
        box-shadow: ${token.shadow.focus};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const loadingIconStyle = css`
    display: inline-flex;
    align-items: center;
    color: ${token.loading.color};
    flex-shrink: 0;
    margin-left: 8px;
    animation: select-spin 1s linear infinite;

    @keyframes select-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    /* spinner 本身传达"进行中"是必要信息,不能移除;仅大幅放慢速度以降低前庭刺激 */
    @media (prefers-reduced-motion: reduce) {
        animation-duration: 2.5s;
    }
`;

// 度量(padding/字号/行高)与"高度策略"分开维护——原因见下方 sizeHeight*Map 的注释。
const sizeMetricsMap = {
    large: css`
        padding: ${token.size.large.padding};
        font-size: ${token.size.large.font.size};
        line-height: ${token.size.large["line-height"]};
    `,
    middle: css`
        padding: ${token.size.middle.padding};
        font-size: ${token.size.middle.font.size};
        line-height: ${token.size.middle["line-height"]};
    `,
    small: css`
        padding: ${token.size.small.padding};
        font-size: ${token.size.small.font.size};
        line-height: ${token.size.small["line-height"]};
    `,
};

// 单选:固定 height,精确对齐 RcLineEdit 的三档尺寸——line-height+padding-y+border
// 之和本就会超过 24/32/40px 这几个设计值(例如 small: 20+8+2=30px),RcLineEdit 靠固定
// height(而非 min-height)把它按设计尺寸截住,这里跟随同样的处理方式。
const sizeHeightFixedMap = {
    large: css`height: ${token.size.large.height};`,
    middle: css`height: ${token.size.middle.height};`,
    small: css`height: ${token.size.small.height};`,
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
    <svg width="12" height="12" viewBox="0 0 1024 1024" fill="currentColor">
        <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3 0.1-12.7-6.4-12.7z" />
    </svg>
);

const ClearIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6M9 9l6 6" />
    </svg>
);

const LoadingIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

// ─── Props ───────────────────────────────────────────────────────────────────

interface SelectInputProps {
    ref?: Ref<HTMLDivElement>;
    ariaLabel?: string;
    disabled: boolean;
    searchable: boolean;
    multiple: boolean;
    size: "large" | "middle" | "small";
    status?: "error" | "warning";
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
    ariaLabel,
    disabled,
    searchable,
    multiple,
    size,
    status,
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
        onClear();

        if (open) {
            dispatch({ type: "setOpen", payload: false });
        }
    };

    const handleClearClick = (e: ReactMouseEvent) => {
        e.stopPropagation();
        triggerClear();
    };

    // 清除按钮的键盘等价路径(§1/§2):没有它,role="button" 但无法用 Enter/Space 触发的
    // 元素形同虚设——键盘用户能 Tab 到它,却按不动它。
    const handleClearKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            triggerClear();
        }
    };

    const canClear = allowClear && !disabled && selectedOptions.length > 0;

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

    const getStatusStyles = () => {
        if (!status) {
            return open ? controlFocusStyle : undefined;
        }

        if (status === "error") {
            return cx(controlErrorStyle, open && controlErrorFocusStyle);
        }

        return cx(controlWarningStyle, open && controlWarningFocusStyle);
    };

    // 仅在展开时暴露 aria-controls/aria-activedescendant:浮层关闭时 SelectOverlay 未挂载,
    // 引用一个不存在的 id 对屏幕阅读器没有意义(§3 触发器与目标显式关联)。
    const activeDescendantId =
        open && highlightIndex >= 0 ? `${listboxId}-option-${highlightIndex}` : undefined;

    return (
        <div
            role="combobox"
            aria-label={ariaLabel}
            aria-expanded={open}
            aria-disabled={disabled}
            aria-haspopup="listbox"
            aria-controls={open ? listboxId : undefined}
            aria-activedescendant={activeDescendantId}
            aria-invalid={status === "error" ? true : undefined}
            tabIndex={disabled ? -1 : 0}
            ref={mergeRef}
            className={cx(
                controlStyle,
                sizeMetricsMap[size],
                multiple ? sizeHeightFlexibleMap[size] : sizeHeightFixedMap[size],
                !status && open && controlFocusStyle,
                disabled && controlDisabledStyle,
                getStatusStyles(),
            )}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
        >
            <div className={valueWrapStyle}>{renderContent()}</div>
            {loading ? (
                <span className={loadingIconStyle}>
                    <LoadingIcon />
                </span>
            ) : null}
            <span className={suffixWrapStyle}>
                <span data-role={canClear ? "select-caret" : undefined} className={cx(caretStyle, open && caretOpenStyle)}>
                    <CaretIcon />
                </span>
                {canClear ? (
                    <span
                        data-role="select-clear"
                        className={clearStyle}
                        role="button"
                        tabIndex={0}
                        aria-label="Clear"
                        onClick={handleClearClick}
                        onKeyDown={handleClearKeyDown}
                    >
                        <ClearIcon />
                    </span>
                ) : null}
            </span>
        </div>
    );
};

export default SelectInput;
