import { css } from "@linaria/core";
import LineEdit from "@crab-dev/rc-line-edit";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent, Ref } from "react";

import token from "./token.js";
import Stepper from "./stepper.js";
import Superscript from "./superscript.js";
import { useSpinner } from "./hooks/useSpinner.js";
import {
    applyPrecision,
    clamp,
    countDecimalPlaces,
    formatEditing,
    formatPlain,
    parseNumber,
    shouldUseScientific,
    toScientificParts,
    toScientificString,
} from "./format.js";
import type { NumberEditProps } from "./types.js";

// 合并多个 ref（用户外部 ref + 组件内部 ref）到单一 callback ref。
// 模块级纯函数，稳定引用由 React Compiler 记忆化。
function setRefs<T>(...refs: (Ref<T> | undefined)[]) {
    return (node: T | null) => {
        for (const r of refs) {
            if (typeof r === "function") {
                r(node);
            } else if (r != null) {
                (r as { current: T | null }).current = node;
            }
        }
    };
}

interface OverlayRect {
    left: number;
    top: number;
    width: number;
    height: number;
    /** 从 input 复制的 computed font 简写，保证上标层字号与输入框一致 */
    font: string;
}

// 外层包裹：相对定位，供科学计数法上标覆盖层绝对定位对齐 input 文本区
const rootStyle = css`
    position: relative;
    display: inline-block;
`;

// 上标覆盖层：失焦科学计数法态盖在 input 之上，背景与输入框表面同色以完全遮盖
const overlayStyle = css`
    position: absolute;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;
    cursor: text;
    background-color: ${token.display.background};
    color: ${token.display.color};
    &[data-disabled="true"] {
        opacity: ${token.disabled.opacity};
        cursor: not-allowed;
    }
`;

function NumberEdit(props: NumberEditProps) {
    const {
        value,
        defaultValue,
        onChange,
        min = -Infinity,
        max = Infinity,
        step = 1,
        largeStep,
        precision,
        scientific = "auto",
        scientificThreshold = 15,
        thousandSeparator = false,
        decimalSeparator = ".",
        formatter,
        parser,
        controls = true,
        // stringMode 为预留 API，第一版按 number 处理，此处解构以免透传到 DOM
        stringMode: _stringMode,
        size = "middle",
        disabled,
        readOnly,
        prefix,
        suffix,
        allowClear,
        onClear,
        onFocus,
        onBlur,
        onKeyDown,
        ref,
        containerRef,
        ...rest
    } = props;

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<number | null>(defaultValue ?? null);
    const numeric = isControlled ? (value ?? null) : internalValue;

    const [focused, setFocused] = useState(false);
    const [inputText, setInputText] = useState("");
    const [overlayRect, setOverlayRect] = useState<OverlayRect | null>(null);

    // 例外①（可变实例状态 ref）：DOM 引用用于测量覆盖层与聚焦，不触发渲染
    const inputRef = useRef<HTMLInputElement | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const containerElRef = useRef<HTMLDivElement | null>(null);

    const effLargeStep = largeStep ?? step * 10;
    const sepNorm: string | false = thousandSeparator === true ? "," : thousandSeparator;
    // 步进精度：优先用户 precision，否则取 step / largeStep 的小数位以消除浮点噪声
    const stepPrecision = precision ?? Math.max(countDecimalPlaces(step), countDecimalPlaces(effLargeStep));

    const useSci = numeric != null && shouldUseScientific(numeric, scientific, scientificThreshold);
    const showOverlay = !focused && !formatter && numeric != null && useSci;
    const sciParts = showOverlay && numeric != null ? toScientificParts(numeric, precision) : null;
    const ariaValueText = sciParts
        ? `${sciParts.mantissa} 乘以 10 的 ${sciParts.exponent} 次方`
        : undefined;

    // 失焦态：formatter > 空 > 科学计数法(e记法，被覆盖层遮盖) > 普通十进制(可千分位)
    // 聚焦态：始终显示可编辑的 inputText
    const displayValue = focused
        ? inputText
        : formatter
            ? formatter(numeric ?? null)
            : numeric == null
                ? ""
                : useSci
                    ? toScientificString(numeric, precision)
                    : formatPlain(numeric, { precision, thousandSeparator: sepNorm, decimalSeparator });

    const commit = (next: number | null): void => {
        if (!isControlled) {
            setInternalValue(next);
        }
        if (!Object.is(next, numeric)) {
            onChange?.(next);
        }
    };

    const doStep = (direction: 1 | -1, large: boolean): void => {
        if (disabled || readOnly) {
            return;
        }
        const delta = (large ? effLargeStep : step) * direction;
        const next = clamp(applyPrecision((numeric ?? 0) + delta, stepPrecision), min, max);
        commit(next);
        if (focused) {
            const nextSci = shouldUseScientific(next, scientific, scientificThreshold);
            setInputText(formatEditing(next, { useScientific: nextSci, precision, decimalSeparator }));
        }
    };

    const spinner = useSpinner({ onStep: doStep, disabled: disabled || readOnly });

    const handleFocus = (e: FocusEvent<HTMLInputElement>): void => {
        setFocused(true);
        setInputText(
            numeric == null
                ? ""
                : formatEditing(numeric, { useScientific: useSci, precision, decimalSeparator }),
        );
        onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
        setFocused(false);
        const parsed = parseNumber(inputText, { decimalSeparator, thousandSeparator: sepNorm, parser });
        if (parsed == null) {
            commit(null);
        } else {
            commit(applyPrecision(clamp(parsed, min, max), precision));
        }
        onBlur?.(e);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setInputText(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (!disabled && !readOnly) {
            switch (e.key) {
                case "ArrowUp":
                    e.preventDefault();
                    doStep(1, e.shiftKey);
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    doStep(-1, e.shiftKey);
                    break;
                case "PageUp":
                    e.preventDefault();
                    doStep(1, true);
                    break;
                case "PageDown":
                    e.preventDefault();
                    doStep(-1, true);
                    break;
                default:
                    break;
            }
        }
        onKeyDown?.(e);
    };

    const handleClear = (): void => {
        commit(null);
        setInputText("");
        onClear?.();
    };

    const focusInput = (): void => {
        if (!disabled) {
            inputRef.current?.focus();
        }
    };

    // 例外②（latest-ref 模式）：wheel 原生监听只绑定一次，回调内读取最新状态与 doStep
    const wheelStateRef = useRef({ focused, disabled, readOnly, doStep });
    wheelStateRef.current = { focused, disabled, readOnly, doStep };

    // 滚轮步进：仅聚焦时响应，避免滚动页面时误改值。
    // 必须原生 non-passive 监听才能 preventDefault（React onWheel 是 passive，无法阻止页面滚动）。
    useEffect(() => {
        const input = inputRef.current;
        if (!input) {
            return;
        }
        const onWheel = (e: WheelEvent): void => {
            const s = wheelStateRef.current;
            if (!s.focused || s.disabled || s.readOnly) {
                return;
            }
            e.preventDefault();
            s.doStep(e.deltaY < 0 ? 1 : -1, e.shiftKey);
        };
        input.addEventListener("wheel", onWheel, { passive: false });
        return () => input.removeEventListener("wheel", onWheel);
    }, []);

    // 覆盖层测量：把上标层精确对齐到 input 文本区（位置 + 字号）。
    // 属 DOM 测量缓存，随显示内容 / 尺寸 / 容器 resize 重新测量。
    useLayoutEffect(() => {
        if (!showOverlay) {
            return;
        }
        const measure = (): void => {
            const input = inputRef.current;
            const root = rootRef.current;
            if (!input || !root) {
                return;
            }
            const ir = input.getBoundingClientRect();
            const rr = root.getBoundingClientRect();
            setOverlayRect({
                left: ir.left - rr.left,
                top: ir.top - rr.top,
                width: ir.width,
                height: ir.height,
                font: getComputedStyle(input).font,
            });
        };
        measure();
        const observer = new ResizeObserver(measure);
        if (containerElRef.current) {
            observer.observe(containerElRef.current);
        }
        return () => observer.disconnect();
    }, [showOverlay, displayValue, size, controls]);

    const upDisabled = Number.isFinite(max) && numeric != null && numeric >= max;
    const downDisabled = Number.isFinite(min) && numeric != null && numeric <= min;

    // 步进器待在输入框内右侧（rc-line-edit 的 suffix 槽），随输入框走
    const composedSuffix = controls ? (
        <>
            {suffix}
            <Stepper
                onStart={spinner.start}
                onStop={spinner.stop}
                upDisabled={upDisabled}
                downDisabled={downDisabled}
                disabled={!!disabled || !!readOnly}
            />
        </>
    ) : (
        suffix
    );

    return (
        <div ref={rootRef} className={rootStyle}>
            <LineEdit
                {...rest}
                ref={setRefs<HTMLInputElement>(ref, inputRef)}
                containerRef={setRefs<HTMLDivElement>(containerRef, containerElRef)}
                size={size}
                disabled={disabled}
                readOnly={readOnly}
                prefix={prefix}
                suffix={composedSuffix}
                allowClear={allowClear}
                onClear={handleClear}
                value={displayValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                role="spinbutton"
                inputMode="decimal"
                autoComplete="off"
                aria-valuenow={numeric ?? undefined}
                aria-valuemin={Number.isFinite(min) ? min : undefined}
                aria-valuemax={Number.isFinite(max) ? max : undefined}
                aria-valuetext={ariaValueText}
            />
            {showOverlay && sciParts && (
                <div
                    className={overlayStyle}
                    data-disabled={disabled ? "true" : undefined}
                    aria-hidden
                    onMouseDown={(e: MouseEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        focusInput();
                    }}
                    style={
                        overlayRect
                            ? {
                                left: overlayRect.left,
                                top: overlayRect.top,
                                width: overlayRect.width,
                                height: overlayRect.height,
                                font: overlayRect.font,
                            }
                            : { left: 0, top: 0, width: 0, height: 0 }
                    }
                >
                    <Superscript mantissa={sciParts.mantissa} exponent={sciParts.exponent} />
                </div>
            )}
        </div>
    );
}

export default NumberEdit;
