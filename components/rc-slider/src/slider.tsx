import { css, cx } from "@linaria/core";
import { type HTMLAttributes, type FC, useRef, useCallback, useState, useEffect } from "react";
import token from "./token";

export interface SliderProps extends HTMLAttributes<HTMLDivElement> {
    value: number;
    min?: number
    max?: number
    step?: number
    onValueChange?: (value: number) => void;
}

const Slider: FC<SliderProps> = ({
    className,
    min = 0,
    max = 100,
    step = 1,
    value = 0,
    onValueChange,
    ...restProps
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const percent = Number(Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)));

    const updateValue = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        let newPercent = (clientX - rect.left) / rect.width;
        newPercent = Math.max(0, Math.min(1, newPercent));
        let rawValue = newPercent * (max - min) + min;
        if (step > 0) {
            rawValue = Math.round(rawValue / step) * step;
        }
        const finalValue = Math.max(min, Math.min(max, rawValue));
        if (onValueChange && finalValue !== value) {
            onValueChange(finalValue);
        }
    }, [min, max, step, value, onValueChange]);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
        updateValue(e.clientX);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isDragging) {
            updateValue(e.clientX);
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isDragging) {
            setIsDragging(false);
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };
    
    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        const direction = e.deltaY < 0 ? 1 : -1;
        const newValue = value + direction * step;
        const finalValue = Math.max(min, Math.min(max, Number(newValue.toFixed(10))));
        if (onValueChange && finalValue !== value) {
            onValueChange(finalValue);
        }
    }, [value, min, max, step, onValueChange]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            el.removeEventListener("wheel", handleWheel);
        };
    }, [handleWheel]);

    return (
        <div
            data-slot="root"
            className={cx("slider", css`
                position: relative;
                width: 100%;
                user-select: none;
                cursor: pointer;
                touch-action: none;
                display: flex;
                align-items: center;
                height: ${token.rail.thickness};
                overscroll-behavior: contain;
            `, className)}
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            {...restProps}
        >
            <div
                data-slot="rail"
                className={css`
                    position: absolute;
                    width: 100%;
                    height: ${token.rail.thickness};
                    border-radius: calc(${token.rail.thickness} / 2);
                    background: ${token.rail.inactive.fill};
                `}
            />
            
            <div
                data-slot="track"
                className={css`
                    position: absolute;
                    height: ${token.rail.thickness};
                    border-radius: calc(${token.rail.thickness} / 2);
                    background: ${token.rail.active.fill};
                `}
                style={{ width: `${percent.toFixed(4)}%` }}
            />
        
            <div
                data-slot="handle-container"
                className={css`
                    position: absolute;
                    top: 50%;
                `}
                style={{ 
                    left: `${percent.toFixed(4)}%`,
                    transform: `translate(-50%, -50%)`
                }}
            >
                <div
                    data-slot="halo"
                    data-is-dragging={isDragging}
                    className={css`
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        border-radius: 50%;
                        background-color: ${token.thumb.halo.fill};
                        opacity: 0.2;
                        transition: width 200ms, height 200ms;
                        pointer-events: none;
                        width: 0;
                        height: 0;
                        [data-slot="handle-container"]:hover &,
                        &[data-is-dragging="true"] {
                            width: calc(${token.thumb.radius} * 2 * ${token.thumb.halo.scale.factor});
                            height: calc(${token.thumb.radius} * 2 * ${token.thumb.halo.scale.factor});
                        }
                    `}
                />
                <div
                    data-slot="handle"
                    data-is-dragging={isDragging}
                    className={css`
                        position: relative;
                        border-radius: 50%;
                        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
                        transition: transform 200ms;
                        transform: scale(1);
                        width: calc(${token.thumb.radius} * 2);
                        height: calc(${token.thumb.radius} * 2);
                        background: ${token.thumb.fill};
                        border: ${token.thumb.stroke.width} solid ${token.thumb.stroke.color};
                        &[data-is-dragging="true"] {
                            transform: scale(1.1);
                        }
                    `}
                />
            </div>
        </div>
    )
}

export default Slider;