import { css, cx } from "@linaria/core";
import { type HTMLAttributes, type FC, useRef, useState } from "react";
import token from "./token";

export interface SliderProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * 值
     */
    value?: number;

    /**
     * 改变值触发的事件
     */
    onValueChange?: (value: number) => void;
}

const Slider: FC<SliderProps> = ({
    className,
    value = 0,
    onValueChange,
    ...restProps
}) => {
    const [isDragging, setIsDragging] = useState(false);

    const svgRef = useRef<SVGSVGElement>(null);
    const rectRef = useRef<DOMRect>(null);

    const updateProgress = (clientX: number) => {
        if (!rectRef.current) return;
        const rect = rectRef.current;
        let newPercent = ((clientX - rect.left) / rect.width) * 100;
        newPercent = Math.max(0, Math.min(100, newPercent));
        newPercent = Math.round(newPercent);
        onValueChange?.(newPercent);
    }

    const clampedValue = Math.max(0, Math.min(100, value));

    return (
        <div
            tabIndex={-1}
            className={cx(css`
                cursor: pointer;
                position: relative;
                display: block;
                touch-action: none; 
                user-select: none;
                overflow: visible;
                padding: 0px 1rem;
            `,className)}
            onKeyDown={(e) => {
                let newValue = clampedValue;
                if (e.key === "ArrowRight" || e.key === "ArrowUp") newValue += 1;
                if (e.key === "ArrowLeft" || e.key === "ArrowDown") newValue -= 1;
                if (e.key === "Home") newValue = 0;
                if (e.key === "End") newValue = 100;
                if (newValue !== clampedValue) {
                    onValueChange?.(Math.max(0, Math.min(100, newValue)));
                }
            }}

            {...restProps}
        >
            <svg
                className={css`
                    overflow: visible;
                    width: 100%;
                    height: calc(${token.dimension['thumb-radius']} * 2 + ${token.border['stroke-width']} * 2);
                `}
                ref={svgRef}
                onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    rectRef.current = e.currentTarget.getBoundingClientRect();
                    updateProgress(e.clientX);
                    setIsDragging(true)
                }}
                onPointerMove={(e) => {
                    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                        updateProgress(e.clientX);
                    }
                }}
                onPointerUp={(e) => {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                    rectRef.current = null;
                    setIsDragging(false);
                }}
                onPointerCancel={(e) => {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                    rectRef.current = null;
                    setIsDragging(false);
                }}
            >
                <rect
                    className={css`
                        fill: ${token.color['track-bg']};
                        width: 100%;
                        height: ${token.dimension['track-height']};
                    `}
                    x="0"
                    y={`calc(${token.dimension['thumb-radius']} - ${token.dimension['track-height']} / 2)`}
                    rx={`calc(${token.dimension['track-height']} / 2)`}
                    ry={`calc(${token.dimension['track-height']} / 2)`}
                />
                <rect
                    className={
                        cx(css`
                            fill: ${token.color['track-active-bg']};
                            height: ${token.dimension['track-height']};
                        `)
                    }
                    x="0"
                    y={`calc(${token.dimension['thumb-radius']} - ${token.dimension['track-height']} / 2)`}
                    width={`${clampedValue}%`}
                    rx={`calc(${token.dimension['track-height']} / 2)`}
                    ry={`calc(${token.dimension['track-height']} / 2)`}
                />
                <circle
                    className={cx(css`
                        fill: ${token.color['thumb-bg']};
                        filter: drop-shadow(${token.elevation['thumb-shadow']});
                        cursor: pointer;
                        stroke: ${token.color['thumb-border']};
                        stroke-width: ${token.border['stroke-width']};
                        &:hover {
                            filter: drop-shadow(${token.elevation['thumb-shadow-hover']});
                        }
                    `)}
                    x={token.dimension['thumb-radius']}
                    cx={`${clampedValue}%`}
                    cy={token.dimension['thumb-radius']}
                    r={token.dimension['thumb-radius']}
                />
            </svg>
        </div>
    )
}

export default Slider;