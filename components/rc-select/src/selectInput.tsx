import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import { css, cx } from "@linaria/core";
import { useCallback, useEffect, useRef, type FC, type KeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";

import token from "./token.js";
import type { FlatOption, SelectOption } from "./types.js";

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

    &:hover:not([aria-disabled="true"]) {
        border-color: ${token.border["color-hover"]};
    }

    &:hover:not([aria-disabled="true"]) [data-role="select-clear"] {
        opacity: 1;
    }

    &:hover:not([aria-disabled="true"]) [data-role="select-caret"] {
        opacity: 0;
    }
`;

const controlFocusStyle = css`
    border-color: ${token.border["color-focus"]};
    box-shadow: 0 0 0 1px ${token.border["color-focus"]};
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
`;

const controlErrorFocusStyle = css`
    border-color: ${token.border["color-error"]};
    box-shadow: 0 0 0 1px ${token.border["color-error"]};
`;

const controlWarningStyle = css`
    border-color: ${token.border["color-warning"]};

    &:hover:not([aria-disabled="true"]) {
        border-color: ${token.border["color-warning"]};
    }
`;

const controlWarningFocusStyle = css`
    border-color: ${token.border["color-warning"]};
    box-shadow: 0 0 0 1px ${token.border["color-warning"]};
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

const inputStyle = css`
    border: 0;
    outline: none;
    background: transparent;
    color: inherit;
    font-size: inherit;
    line-height: inherit;
    min-width: 0;
    flex: 1;
    padding: 0;

    &::placeholder {
        color: ${token.text["color-placeholder"]};
    }
`;

const caretStyle = css`
    margin-left: 0;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    color: ${token.text["color-placeholder"]};
    transition: transform 200ms ease, opacity 100ms ease;
`;

const caretOpenStyle = css`
    transform: rotate(180deg);
`;

const tagStyle = css`
    display: inline-flex;
    align-items: center;
    background-color: ${token.tag.background};
    color: ${token.tag.color};
    border: 1px solid ${token.border.color};
    border-radius: ${token.border.radius};
    padding: 0 6px;
    height: 22px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    gap: 4px;
`;

const tagCloseStyle = css`
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    color: ${token.tag["close-hover"]};
    flex-shrink: 0;

    &:hover {
        color: ${token.text.color};
    }
`;

const suffixWrapStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: 8px;
    width: 12px;
    height: 12px;
`;

const clearStyle = css`
    display: inline-flex;
    align-items: center;
    color: ${token.clear.color};
    cursor: pointer;
    position: absolute;
    inset: 0;
    justify-content: center;
    opacity: 0;
    transition: opacity 100ms ease;

    &:hover {
        color: ${token.clear["color-hover"]};
    }
`;



const overflowTagStyle = css`
    display: inline-flex;
    align-items: center;
    background-color: ${token.tag.background};
    color: ${token.tag.color};
    border: 1px solid ${token.border.color};
    border-radius: ${token.border.radius};
    padding: 0 6px;
    height: 22px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
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
`;

const sizeStyleMap = {
    large: css`
        min-height: ${token.size.large.height};
        padding: ${token.size.large.padding};
        font-size: ${token.size.large.font.size};
    `,
    middle: css`
        min-height: ${token.size.middle.height};
        padding: ${token.size.middle.padding};
        font-size: ${token.size.middle.font.size};
    `,
    small: css`
        min-height: ${token.size.small.height};
        padding: ${token.size.small.padding};
        font-size: ${token.size.small.font.size};
    `,
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

const TagCloseIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

const LoadingIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

// ─── Props ───────────────────────────────────────────────────────────────────

interface SelectInputProps {
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
    highlightedOption: FlatOption | undefined;
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
    highlightedOption,
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

    const mergeRef = useCallback(
        (node: HTMLDivElement | null) => {
            controlRef.current = node;

            if (typeof refs.setReference === "function") {
                refs.setReference(node);
            }
        },
        [refs.setReference],
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

    // Close dropdown when clicking outside the control and overlay
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleMouseDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            if (controlRef.current?.contains(target)) {
                return;
            }

            if (target.closest("[data-select-overlay]")) {
                return;
            }

            dispatch({ type: "setOpen", payload: false });
            onOpenChangeRef.current(false);
        };

        document.addEventListener("mousedown", handleMouseDown);

        return () => document.removeEventListener("mousedown", handleMouseDown);
    }, [open, dispatch]);

    const handleClick = () => {
        if (disabled) {
            return;
        }

        dispatch({ type: "setOpen", payload: !open });
        onOpenChangeRef.current(!open);
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
                    onOpenChangeRef.current(true);
                }

                onMoveHighlight(1);
                break;

            case "ArrowUp":
                e.preventDefault();

                if (!open) {
                    dispatch({ type: "setOpen", payload: true });
                    onOpenChangeRef.current(true);
                }

                onMoveHighlight(-1);
                break;

            case "Enter":
                e.preventDefault();

                if (open && highlightedOption) {
                    onSelectHighlighted(highlightedOption);

                    if (!multiple) {
                        dispatch({ type: "setOpen", payload: false });
                        onOpenChangeRef.current(false);
                    }
                } else if (!open) {
                    dispatch({ type: "setOpen", payload: true });
                    onOpenChangeRef.current(true);
                }

                break;

            case " ":
                if (!searchable || !open) {
                    e.preventDefault();

                    if (!open) {
                        dispatch({ type: "setOpen", payload: true });
                        onOpenChangeRef.current(true);
                    }
                }

                break;

            case "Escape":
                if (open) {
                    e.preventDefault();
                    dispatch({ type: "setOpen", payload: false });
                    onOpenChangeRef.current(false);
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

    const handleClearClick = (e: ReactMouseEvent) => {
        e.stopPropagation();
        onClear();

        if (open) {
            dispatch({ type: "setOpen", payload: false });
            onOpenChangeRef.current(false);
        }
    };

    const canClear = allowClear && !disabled && selectedOptions.length > 0;

    const renderTag = (opt: SelectOption) => {
        const handleClose = () => onRemoveTag(opt.value);

        if (tagRender) {
            return <span key={opt.value}>{tagRender(opt, handleClose)}</span>;
        }

        return (
            <span key={opt.value} className={tagStyle}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{opt.label}</span>
                <span
                    className={tagCloseStyle}
                    role="button"
                    aria-label={`Remove ${typeof opt.label === "string" ? opt.label : opt.value}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                    }}
                >
                    <TagCloseIcon />
                </span>
            </span>
        );
    };

    const renderTags = () => {
        if (maxTagCount !== undefined && selectedOptions.length > maxTagCount) {
            const visible = selectedOptions.slice(0, maxTagCount);
            const overflowCount = selectedOptions.length - maxTagCount;

            return (
                <>
                    {visible.map(renderTag)}
                    <span className={overflowTagStyle}>+{overflowCount}</span>
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
                    <input
                        ref={inputRef}
                        value={searchText}
                        placeholder={multiple && selectedOptions.length > 0 ? "" : placeholder}
                        onChange={(e) => onSearchTextChange(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={inputStyle}
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

    return (
        <div
            role="combobox"
            aria-label={ariaLabel}
            aria-expanded={open}
            aria-disabled={disabled}
            aria-haspopup="listbox"
            tabIndex={disabled ? -1 : 0}
            ref={mergeRef}
            className={cx(
                controlStyle,
                sizeStyleMap[size],
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
                        aria-label="Clear"
                        onClick={handleClearClick}
                    >
                        <ClearIcon />
                    </span>
                ) : null}
            </span>
        </div>
    );
};

export default SelectInput;