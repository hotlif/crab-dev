import { usePickerLocale } from '../locale.js';
import type { PickerFieldProps, PickerValueChangeDetails } from '../types.js';
import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import RcLineEdit, { type LineEditProps } from '@crab-dev/rc-line-edit';
import { useEffect, useRef, useState } from "react";
import type { FC, RefObject } from "react";

import PickerInputActions, { usePickerFieldHover } from '../pickerInputActions.js';
import type { DatePickerPanelInstance } from "../panels/datePickerPanel.js";

export interface DatePickerInputProps extends PickerFieldProps {
    locale?: string;
    popupId?: string;
    
    /**
     * 改变值值触发的事件
     */
    onValueChange?: (value: Temporal.ZonedDateTime | null, event?: PickerValueChangeDetails['event']) => void;

    /**
     * 输入的值信息
     */
    value: string

    /** 内部字段状态，依据选择器的真实值，不依据显示文本。 */
    hasValue: boolean;

    /**
     * 大小
     */
    size?: LineEditProps["size"]

    /**
     * 面板实例
     */
    instance?: RefObject<DatePickerPanelInstance | null> ;
    onConfirm?: () => void;
    onOpen?: () => void;
    textEntry?: { value: string; confirm(raw: string, event: PickerValueChangeDetails['event']): string | undefined };
}


const DatePickerInput: FC<DatePickerInputProps> = ({
    locale,
    popupId,
    value = "",
    hasValue,
    onValueChange,
    instance,
    onConfirm,
    onOpen,
    textEntry,
    ref, disabled, onClick, onFocus, onBlur, onKeyDown,
    ...restProps
}) => {
    const { locale: resolvedLocale, messages } = usePickerLocale(locale);
    const {
        refs,
        state,
        dispatch
    } = useDropdownContext<HTMLDivElement>();

    const inputRef = useRef<HTMLInputElement>(null)
    const { hovered, containerRef } = usePickerFieldHover(refs.setReference);
    const [draft, setDraft] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [inputError, setInputError] = useState<string>();
    const discardDraft = () => {
        setDraft(null);
        setInputError(undefined);
    };
    const confirmText = (raw: string, event: PickerValueChangeDetails['event']) => {
        if (!textEntry || disabled || draft === null) return;
        const error = textEntry.confirm(raw, event);
        setInputError(error);
        if (!error) setDraft(null);
    };

    // 跨事件的焦点恢复标记：清除后聚焦输入框，不重新打开日历。
    const restoringFocus = useRef(false);

    const openPanel = () => {
        if (!disabled && !state.open) {
            discardDraft();
            onOpen?.();
            dispatch({ type: 'setOpen', payload: true });
        }
    };


    useEffect(() => {
        if (state.open) {
            inputRef.current?.focus();
        }
    }, [state.open]);

    return (
        <RcLineEdit
            {...restProps}
            disabled={disabled}
            containerRef={containerRef}
            ref={(node) => {
                inputRef.current = node;
                const cleanup = typeof ref === 'function' ? ref(node) : undefined;
                if (ref && typeof ref !== 'function') ref.current = node;
                return () => {
                    inputRef.current = null;
                    if (cleanup) cleanup();
                    else if (typeof ref === 'function') ref(null);
                    else if (ref) ref.current = null;
                };
            }}
            onClick={(e) => { onClick?.(e); if (!textEntry && !e.defaultPrevented) openPanel(); }}
            onFocus={(e) => {
                if (textEntry) {
                    if (draft === null && !state.open && !restoringFocus.current) e.currentTarget.value = textEntry.value;
                    setEditing(true);
                }
                onFocus?.(e);
                if (!textEntry && !e.defaultPrevented && !restoringFocus.current) openPanel();
            }}
            onBlur={(e) => {
                setEditing(false);
                if (!state.open) confirmText(e.currentTarget.value, e);
                onBlur?.(e);
            }}
            value={textEntry ? draft ?? (editing && !state.open ? textEntry.value : value) : value}
            onValueChange={textEntry ? next => {
                setDraft(next);
                setInputError(undefined);
                if (state.open) dispatch({ type: "setOpen", payload: false });
            } : undefined}
            errorText={inputError ?? restProps.errorText}
            supportingText={restProps.supportingText ?? (textEntry
                ? (resolvedLocale.toLowerCase().startsWith('zh') ? '日期格式 YYYY-MM-DD' : 'Date format YYYY-MM-DD')
                : undefined)}
            placeholder={restProps.placeholder ?? (textEntry ? "YYYY-MM-DD" : messages.chooseDate)}
            aria-haspopup="dialog"
            aria-expanded={state.open}
            aria-controls={popupId}
            readOnly={!textEntry}
            suffix={<PickerInputActions locale={locale}
                hasValue={hasValue}
                hovered={hovered}
                disabled={disabled}
                open={state.open}
                onOpen={openPanel}
                onClear={(event) => {
                    discardDraft();
                    restoringFocus.current = true;
                    inputRef.current?.focus();
                    restoringFocus.current = false;
                    dispatch({ type: 'setOpen', payload: false });
                    onValueChange?.(null, event);
                }}
            />}
            onKeyDown={(e) => {
                onKeyDown?.(e);
                if (e.defaultPrevented || disabled || e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;
                if (e.key === "Escape") {
                    if (textEntry && !state.open && draft === null) return;
                    e.preventDefault();
                    e.stopPropagation();
                    discardDraft();
                    dispatch({
                        type: "setOpen",
                        payload: false
                    });
                    return;
                }
                if (textEntry && !state.open) {
                    if (e.key === 'Enter' && draft !== null) {
                        e.preventDefault();
                        confirmText(e.currentTarget.value, e);
                    } else if (e.key === 'ArrowDown' && e.altKey) {
                        e.preventDefault();
                        openPanel();
                    }
                    return;
                }
                if (!state.open && ['Enter', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                    openPanel();
                    return;
                }
                if (instance && typeof instance.current?.keyboardNavigate === 'function') {
                    switch (e.key) {
                        case "ArrowUp":
                            instance.current?.keyboardNavigate("up");
                            break;
                        case "ArrowDown":
                            instance.current?.keyboardNavigate("down");
                            break;
                        case "ArrowLeft":
                            instance.current?.keyboardNavigate("left");
                            break;
                        case "ArrowRight":
                            instance.current?.keyboardNavigate("right");
                            break;
                        case "Enter":
                            e.preventDefault();
                            onConfirm?.();
                            dispatch({ type: "setOpen", payload: false });
                            break;
                    }
                }

                if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
                    e.preventDefault();
                }
            }}
        />
    )
}

export default DatePickerInput;
