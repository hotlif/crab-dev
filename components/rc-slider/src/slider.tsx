import { useConfig } from '@crab-dev/rc-config-provider';
import { css, cx } from "@crab-dev/css";
import { type HTMLAttributes, type FC, type PointerEvent, useRef, useState, useEffect, useEffectEvent, useLayoutEffect } from "react";
import token, { vars } from "./token.js";

export interface SliderProps extends HTMLAttributes<HTMLDivElement> {
    value: number;
    /** Expressive 轨道尺寸，默认 xs。 */
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    min?: number
    max?: number
    step?: number
    disabled?: boolean;
    onValueChange?: (value: number) => void;
}

// 获取最大精度
function getPrecision(num: number): number {
    if (!isFinite(num)) return 0;
    const s = num.toString();
    if (s.indexOf('.') === -1) return 0;
    return s.split('.')[1].length;
}

const xsStyle = css`
    ${vars['rail.height']}: ${token.size.xs.track.height};
    ${vars['thumb.height']}: ${token.size.xs.thumb.height};
    ${vars['rail.border-radius']}: ${token.size.xs.track['border-radius']};
`;
const sStyle = css`
    ${vars['rail.height']}: ${token.size.s.track.height};
    ${vars['thumb.height']}: ${token.size.s.thumb.height};
    ${vars['rail.border-radius']}: ${token.size.s.track['border-radius']};
`;
const mStyle = css`
    ${vars['rail.height']}: ${token.size.m.track.height};
    ${vars['thumb.height']}: ${token.size.m.thumb.height};
    ${vars['rail.border-radius']}: ${token.size.m.track['border-radius']};
`;
const lStyle = css`
    ${vars['rail.height']}: ${token.size.l.track.height};
    ${vars['thumb.height']}: ${token.size.l.thumb.height};
    ${vars['rail.border-radius']}: ${token.size.l.track['border-radius']};
`;
const xlStyle = css`
    ${vars['rail.height']}: ${token.size.xl.track.height};
    ${vars['thumb.height']}: ${token.size.xl.thumb.height};
    ${vars['rail.border-radius']}: ${token.size.xl.track['border-radius']};
`;
const sizeStyles = { xs: xsStyle, s: sStyle, m: mStyle, l: lStyle, xl: xlStyle };

const Slider: FC<SliderProps> = ({
    className,
    min = 0,
    max = 100,
    step = 1,
    value = 0,
    size: sizeProp,
    onValueChange,
    disabled = false,
    onKeyDown,
    tabIndex,
    ...restProps
}) => {
    const config = useConfig();
    const size = sizeProp ?? (config.size === 'large' ? 's' : 'xs');
    // Mutable instance state: DOM geometry and CSS variables are updated after commit.
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const precision = Math.max(getPrecision(step), getPrecision(min), getPrecision(max));
    const factor = Math.pow(10, precision);
    const unavailable = disabled || restProps['aria-disabled'] === true || restProps['aria-disabled'] === 'true' || max <= min;
    const boundedValue = Math.max(min, Math.min(max, value));
    const percent = max > min ? ((boundedValue - min) / (max - min)) * 100 : 0;
    useLayoutEffect(() => {
        containerRef.current?.style.setProperty('--slider-position', `${percent.toFixed(4)}%`);
    }, [percent]);

    const updateValue = (clientX: number) => {
        if (unavailable || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width <= 0) return;
        let newPercent = (clientX - rect.left) / rect.width;
        newPercent = Math.max(0, Math.min(1, newPercent));
        let intMin = Math.round(min * factor);
        let intMax = Math.round(max * factor);
        let intStep = Math.round(step * factor);
        let intRawValue = Math.round((newPercent * (max - min) + min) * factor);
        if (step > 0) {
            intRawValue = intMin + Math.round((intRawValue - intMin) / intStep) * intStep;
        }
        let intFinalValue = Math.max(intMin, Math.min(intMax, intRawValue));
        const finalValue = intFinalValue / factor;
        if (onValueChange && finalValue !== value) {
            onValueChange(finalValue);
        }
    };

    const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (unavailable) return;
        e.preventDefault();
        e.currentTarget.focus();
        setIsDragging(true);
        updateValue(e.clientX);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (isDragging) {
            updateValue(e.clientX);
        }
    };

    const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
        if (isDragging) {
            setIsDragging(false);
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };
    
    const handleWheel = useEffectEvent((e: WheelEvent) => {
        if (unavailable) return;
        e.preventDefault();
        const direction = e.deltaY < 0 ? 1 : -1;
        let intValue = Math.round(value * factor);
        let intStep = Math.round(step * factor);
        let intMin = Math.round(min * factor);
        let intMax = Math.round(max * factor);
        const newIntValue = intValue + direction * intStep;
        const intFinalValue = Math.max(intMin, Math.min(intMax, newIntValue));
        const finalValue = intFinalValue / factor;
        if (onValueChange && finalValue !== value) {
            onValueChange(finalValue);
        }
    });

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            el.removeEventListener("wheel", handleWheel);
        };
    }, []);

    return (
        <div
            {...restProps}
            data-slot="slider-root"
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={boundedValue}
            aria-orientation="horizontal"
            aria-disabled={unavailable || undefined}
            tabIndex={unavailable ? -1 : tabIndex ?? 0}
            onKeyDown={event => {
                onKeyDown?.(event);
                if (event.defaultPrevented || unavailable) return;
                const increment = step > 0 ? step : 1;
                const targets: Readonly<Record<string, number>> = {
                    ArrowRight: boundedValue + increment, ArrowUp: boundedValue + increment,
                    ArrowLeft: boundedValue - increment, ArrowDown: boundedValue - increment,
                    Home: min, End: max, PageUp: boundedValue + increment * 10, PageDown: boundedValue - increment * 10,
                };
                const target = targets[event.key];
                if (target === undefined) return;
                event.preventDefault();
                const next = Math.max(min, Math.min(max, Math.round(target * factor) / factor));
                if (next !== value) onValueChange?.(next);
            }}
            className={cx("slider", css`
                position: relative;
                width: 100%;
                user-select: none;
                cursor: pointer;
                touch-action: none;
                display: flex;
                align-items: center;
                min-height: max(${token.rail.interact.height}, calc(${token.thumb.height} + 2 * ${token.rail.gap}));
                overscroll-behavior: contain;
                &:focus-visible {
                    outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
                    outline-offset: ${token.root['outline-offset-focus']};
                }
                &[aria-disabled='true'] { opacity: ${token.root['opacity-disabled']}; cursor: not-allowed; }
                @media (pointer: coarse) { min-height: max(${token.root.touch['min-height']}, calc(${token.thumb.height} + 2 * ${token.rail.gap})); }
                @media (forced-colors: active) {
                    [data-slot='slider-rail'] { background: CanvasText; }
                    [data-slot='slider-track'] { background: Highlight; }
                    [data-slot='slider-handle'] { background: Highlight; border-color: Highlight; box-shadow: none; }
                    [data-slot='slider-halo'] { display: none; }
                    &[aria-disabled='true'] { outline-color: GrayText; }
                }
            `, sizeStyles[size], className)}
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            <div
                data-slot="slider-rail"
                className={css`
                    position: absolute;
                    left: min(100%, calc(var(--slider-position, 0%) + ${token.rail.gap} + ${token.thumb.width} / 2));
                    right: 0;
                    height: ${token.rail.height};
                    border-radius: ${token.rail.inner['border-radius']} ${token.rail['border-radius']} ${token.rail['border-radius']} ${token.rail.inner['border-radius']};
                    background: ${token.rail['fill-inactive']};
                `}
            />
            
            <div
                data-slot="slider-track"
                className={css`
                    position: absolute;
                    height: ${token.rail.height};
                    border-radius: ${token.rail['border-radius']} ${token.rail.inner['border-radius']} ${token.rail.inner['border-radius']} ${token.rail['border-radius']};
                    background: ${token.rail['fill-active']};
                    width: max(0px, calc(var(--slider-position, 0%) - ${token.rail.gap} - ${token.thumb.width} / 2));
                `}
            />
        
            {boundedValue < max && <span aria-hidden="true" data-slot="slider-stop" className={css`
                position: absolute;
                right: 0;
                width: ${token.stop.width};
                height: ${token.stop.width};
                border-radius: ${token.thumb['border-radius']};
                background: ${token.stop['background-color']};
            `} />}
            <div
                data-slot="slider-handle-container"
                className={css`
                    position: absolute;
                    top: 50%;
                    left: var(--slider-position, 0%);
                    transform: translate(-50%, -50%);
                `}
            >
                <div
                    data-slot="slider-halo"
                    data-is-dragging={isDragging}
                    className={css`
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        border-radius: 50%;
                        background-color: ${token.thumb.halo.fill};
                        opacity: ${token.thumb.halo['opacity-hover']};
                        transition: width ${token.root.transition}, height ${token.root.transition}, opacity ${token.root.transition};
                        @media (prefers-reduced-motion: reduce) { transition: none; }
                        pointer-events: none;
                        width: 0;
                        height: 0;
                        [data-slot="slider-handle-container"]:hover &,
                        [data-slot="slider-root"]:focus-visible &,
                        &[data-is-dragging="true"] {
                            width: ${token.thumb.halo.width};
                            height: ${token.thumb.halo.width};
                        }
                        [data-slot="slider-root"]:focus-visible & { opacity: ${token.thumb.halo['opacity-focus']}; }
                        &[data-is-dragging="true"] { opacity: ${token.thumb.halo['opacity-dragging']}; }
                        [data-slot="slider-root"][aria-disabled='true'] & { display: none; }
                    `}
                />
                <div
                    data-slot="slider-handle"
                    data-is-dragging={isDragging}
                    className={css`
                        position: relative;
                        border-radius: ${token.thumb['border-radius']};
                        box-shadow: ${token.thumb["box-shadow"]};
                        transition: ${token.thumb.transition};
                        @media (prefers-reduced-motion: reduce) { transition: none; }
                        transform: scale(1);
                        width: ${token.thumb.width};
                        height: ${token.thumb.height};
                        background: ${token.thumb.fill};
                        border: ${token.thumb['stroke-width']} solid ${token.thumb['stroke-color']};
                        &[data-is-dragging="true"] {
                            width: ${token.thumb['width-active']};
                        }
                    `}
                />
            </div>
        </div>
    )
}

export default Slider;
