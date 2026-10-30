import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import RcLineEdit from "@crab-dev/rc-line-edit";
import Button from "@crab-dev/rc-button";
import { SpinIndicator } from '@crab-dev/rc-spin';
import Tag from "@crab-dev/rc-tag";
import { css, cx } from "@crab-dev/css";
import { useLocale } from '@crab-dev/rc-config-provider';
import { useCallback, useEffect, useEffectEvent, useRef, useState, type FC, type FocusEventHandler, type KeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode, type Ref, type RefObject } from "react";
import token, { vars } from "./token.js";
import type { FlatOption, SelectChangeDetails, SelectOption } from "./types.js";
import { controlStyle, fieldControlStyle, fieldLayoutStyle, controlDisabledStyle, controlErrorStyle, controlWarningStyle, valueWrapStyle, singleValueStyle, placeholderStyle, searchInputStyle, caretStyle, caretOpenStyle, tagLabelStyle, suffixWrapStyle, actionStyle, loadingIconStyle } from "./selectInput.styles.js";
// ref 可能是回调形式或 RefObject 形式，统一赋值以便与内部 ref 合并
const setRef = (ref: Ref<HTMLDivElement> | undefined, node: HTMLDivElement | null) => {
    if (typeof ref === "function") {
        ref(node);
    } else if (ref) {
        ref.current = node;
    }
};

// 度量(padding/字号/行高)与"高度策略"分开维护——原因见下方 sizeHeight*Map 的注释。
const sizeMetricsMap = {
    large: css`
        padding: ${token.size.large.padding};
        ${vars['clear.width']}: ${token.size.large.action.width};
        ${vars['clear.height']}: ${token.size.large.action.width};
        font-size: ${token.size.large['font-size']};
        line-height: ${token.size.large["line-height"]};
    `,
    medium: css`
        padding: ${token.size.medium.padding};
        ${vars['clear.width']}: ${token.size.medium.action.width};
        ${vars['clear.height']}: ${token.size.medium.action.width};
        font-size: ${token.size.medium['font-size']};
        line-height: ${token.size.medium["line-height"]};
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
    large: css`height: max(${token.size.large.height}, ${token.field['min-height']}, calc(1lh + 2 * ${token.root['border-width']}));`,
    medium: css`height: max(${token.size.medium.height}, ${token.field['min-height']}, calc(1lh + 2 * ${token.root['border-width']}));`,
    small: css`height: max(${token.size.small.height}, ${token.field['min-height']}, calc(1lh + 2 * ${token.root['border-width']}));`,
};

// 多选:必须用 min-height——tag 多到换行时若也用固定 height,换行的 tag 会直接
// 溢出边框外(已用真实多标签场景验证过),因此多选场景保留可被内容撑高的弹性。
const sizeHeightFlexibleMap = {
    large: css`min-height: max(${token.size.large.height}, ${token.field['min-height']});`,
    medium: css`min-height: max(${token.size.medium.height}, ${token.field['min-height']});`,
    small: css`min-height: max(${token.size.small.height}, ${token.field['min-height']});`,
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
    controlRef: RefObject<HTMLDivElement | null>;
    id: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    disabled: boolean;
    searchable: boolean;
    multiple: boolean;
    size: "large" | "medium" | "small";
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
    tagRender?: (option: SelectOption, onClose: (event?: SelectChangeDetails['event']) => void) => ReactNode;
    onSearchTextChange: (value: string) => void;
    onOpenStateChange: (nextOpen: boolean) => void;
    onWidthChange: (width: number) => void;
    onMoveHighlight: (direction: 1 | -1) => void;
    onSelectHighlighted: (option: FlatOption, event: SelectChangeDetails['event']) => void;
    onClear: (event: SelectChangeDetails['event']) => void;
    onRemoveTag: (value: string, event?: SelectChangeDetails['event']) => void;
    onFocus?: FocusEventHandler<HTMLDivElement>;
    onBlur?: FocusEventHandler<HTMLDivElement>;
}

// ─── Component ───────────────────────────────────────────────────────────────

const SelectInput: FC<SelectInputProps> = ({
    ref,
    controlRef,
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
    onOpenStateChange,
    onWidthChange,
    onMoveHighlight,
    onSelectHighlighted,
    onClear,
    onRemoveTag,
    onFocus,
    onBlur,
}) => {
    const { state, refs, dispatch } = useDropdownContext<HTMLDivElement>();
    const { messages } = useLocale();
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

    const syncOpen = useEffectEvent(onOpenStateChange);

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
        [refs.setReference, ref, controlRef],
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
        if (open && searchable && !disabled) {
            queueMicrotask(() => inputRef.current?.focus());
        }
    }, [disabled, open, searchable]);

    useEffect(() => {
        if (autoFocus && !disabled && controlRef.current) {
            controlRef.current.focus();
        }
    }, [autoFocus, disabled]);

    // 仅同步容器已提交的展开状态；初始展开也需要定位当前选中项。
    // 关闭请求被受控父级拒绝时，保留搜索草稿与高亮。
    useEffect(() => {
        syncOpen(open);
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
                    onSelectHighlighted(highlightedOption, e);

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
                    controlRef.current?.focus();
                    dispatch({ type: "setOpen", payload: false, details: { reason: 'escape', event: e.nativeEvent } });
                }

                break;

            case "Backspace":
                if (multiple && searchText === "" && selectedOptions.length > 0) {
                    const lastOption = selectedOptions[selectedOptions.length - 1];
                    onRemoveTag(lastOption.value, e);
                }

                break;

            default:
                break;
        }
    };

    const triggerClear = (event: SelectChangeDetails['event']) => {
        // The clear control unmounts when the value disappears. Restore its owner
        // before notifying the caller so keyboard users can choose a new value.
        controlRef.current?.focus();
        onClear(event);

        if (open) {
            dispatch({ type: "setOpen", payload: false });
        }
    };

    const handleClearClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        triggerClear(e);
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
        const handleClose = (event?: SelectChangeDetails['event']) => { if (!disabled) onRemoveTag(opt.value, event); };

        if (tagRender) {
            return <span key={opt.value}>{tagRender(opt, handleClose)}</span>;
        }

        return (
            <Tag
                key={opt.value}
                size="small"
                closable={!disabled}
                closeAriaLabel={messages.select.removeTag(typeof opt.label === "string" ? opt.label : opt.value)}
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
                        aria-label={ariaLabel ?? label ?? placeholder}
                        bordered={false}
                        disabled={disabled}
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
                return <span data-role="select-placeholder" className={placeholderStyle}>{placeholder}</span>;
            }

            return renderTags();
        }

        if (selectedOptions.length === 0) {
            return <span data-role="select-placeholder" className={placeholderStyle}>{placeholder}</span>;
        }

        return <span className={singleValueStyle}>{selectedOptions[0]?.label}</span>;
    };

    // 仅在展开时暴露 aria-controls/aria-activedescendant:浮层关闭时 SelectOverlay 未挂载,
    // 引用一个不存在的 id 对屏幕阅读器没有意义(§3 触发器与目标显式关联)。
    const activeDescendantId =
        open && highlightIndex >= 0 ? `${listboxId}-option-${highlightIndex}` : undefined;

    return (
        <div className={fieldLayoutStyle} data-labeled={Boolean(label)} data-appearance={appearance}
            data-floating={Boolean(open || selectedOptions.length > 0 || searchText)} data-open={open}
            data-status={status} data-disabled={disabled || undefined}>
        {label && <span data-role="select-label"><span id={labelId}>{label}</span>{required && <span data-required-marker="" aria-hidden="true">*</span>}</span>}
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
                fieldControlStyle,
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
            {label && appearance === "outlined" && <fieldset aria-hidden="true"><legend>{label}{required ? " *" : ""}</legend></fieldset>}
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
                    size={size === 'small' ? 'xs' : size === 'large' ? 'm' : 's'}
                    disabled={disabled}
                    aria-label={showClear ? messages.common.clear : open ? messages.select.closeOptions : messages.select.openOptions}
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
        </div>
    );
};

export default SelectInput;
