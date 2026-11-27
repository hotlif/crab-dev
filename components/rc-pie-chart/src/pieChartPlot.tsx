import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Canvas, Circle } from '@crab-dev/rc-canvas';
import type { PieGeometry, PieSlice } from './layout.js';
import type { PieChartPalette } from './palette.js';
import type { PieChartProps } from './types.js';
import { keyboardLayerStyle, plotStyle, sliceButtonStyle, tooltipStyle, tooltipValueStyle } from './pieChartPlot.styles.js';

interface PlotProps {
    width: number;
    height: number;
    geometry: PieGeometry;
    slices: readonly PieSlice[];
    sliceKeys: readonly string[];
    colors: readonly string[];
    palette: PieChartPalette;
    caption: string;
    formatValue: (value: number) => string;
    formatPercentage: (percentage: number) => string;
    onSliceClick?: PieChartProps['onSliceClick'];
}

function sliceAnchor(slice: PieSlice, geometry: PieGeometry) {
    const angle = (slice.startAngle + slice.endAngle) / 2;
    const radius = (geometry.innerRadius + geometry.outerRadius) / 2;
    return {
        left: geometry.centerX + radius * Math.cos(angle),
        top: geometry.centerY + radius * Math.sin(angle),
    };
}

const TOOLTIP_OFFSET = 12;

export default function PieChartPlot({
    width, height, slices, sliceKeys, geometry, colors, palette, caption, formatValue, formatPercentage, onSliceClick,
}: PlotProps) {
    const plotRef = useRef<HTMLDivElement>(null);
    const [focusKey, setFocusKey] = useState<string | null>(null);
    const [pinnedKey, setPinnedKey] = useState<string | null>(null);
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const focusPosition = Math.max(0, slices.findIndex(slice => sliceKeys[slice.index] === focusKey));
    const activeSlice = slices.find(slice => sliceKeys[slice.index] === (hoveredKey ?? pinnedKey));
    const anchor = activeSlice && sliceAnchor(activeSlice, geometry);
    const tooltipOpen = !!activeSlice;

    function dismiss() {
        setHoveredKey(null);
        setPinnedKey(null);
    }

    useEffect(() => {
        const doc = plotRef.current?.ownerDocument;
        if (!tooltipOpen || !doc) return;
        // 悬停时焦点可能仍在图表外，Escape 也要能关闭提示。
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') dismiss();
        };
        doc.addEventListener('keydown', handleEscape);
        return () => doc.removeEventListener('keydown', handleEscape);
    }, [tooltipOpen]);

    function pin(key: string) {
        setHoveredKey(null);
        setPinnedKey(key);
    }

    function activate({ index, name, value, percentage }: PieSlice) {
        pin(sliceKeys[index]);
        onSliceClick?.({ index, name, value, percentage });
    }

    function navigate(event: ReactKeyboardEvent<HTMLDivElement>) {
        let next: number;
        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown': next = Math.min(focusPosition + 1, slices.length - 1); break;
            case 'ArrowLeft':
            case 'ArrowUp': next = Math.max(focusPosition - 1, 0); break;
            case 'Home': next = 0; break;
            case 'End': next = slices.length - 1; break;
            default: return;
        }
        event.preventDefault();
        event.currentTarget.querySelectorAll('button')[next]?.focus();
    }

    return (
        <div ref={plotRef} className={plotStyle} style={{ width, height, backgroundColor: palette.canvasBackground }}
            onBlur={event => {
                if (!event.currentTarget.contains(event.relatedTarget)) dismiss();
            }}
            onKeyDown={event => {
                if (event.key === 'Escape' && activeSlice) {
                    event.stopPropagation();
                    dismiss();
                }
            }}
        >
            <div aria-hidden="true">
                <Canvas width={width} height={height} tabIndex={-1} onEmptyClick={dismiss}>
                    {slices.map(slice => (
                        <Circle key={sliceKeys[slice.index]} cx={geometry.centerX} cy={geometry.centerY}
                            r={geometry.outerRadius} innerRadius={geometry.innerRadius}
                            startAngle={slice.startAngle} endAngle={slice.endAngle}
                            fill={colors[slice.index]} stroke={palette.canvasBackground}
                            strokeWidth={Math.min(
                                slice.index === activeSlice?.index ? 3 : 1,
                                (slice.endAngle - slice.startAngle) * geometry.outerRadius / 4,
                                (geometry.outerRadius - geometry.innerRadius) / 4,
                            )}
                            cursor={onSliceClick ? 'pointer' : undefined}
                            onMouseEnter={() => setHoveredKey(sliceKeys[slice.index])}
                            onMouseLeave={() => setHoveredKey(null)}
                            onClick={event => {
                                if (event.nativeEvent.button === 0) activate(slice);
                            }}
                        />
                    ))}
                </Canvas>
            </div>
            <div role="group" aria-label={caption} className={keyboardLayerStyle} onKeyDown={navigate}>
                {slices.map((slice, position) => (
                    <button key={sliceKeys[slice.index]} type="button" className={sliceButtonStyle}
                        style={sliceAnchor(slice, geometry)}
                        aria-label={`${slice.name} ${formatValue(slice.value)} ${formatPercentage(slice.percentage)}`}
                        tabIndex={position === focusPosition ? 0 : -1}
                        onFocus={() => {
                            setFocusKey(sliceKeys[slice.index]);
                            pin(sliceKeys[slice.index]);
                        }}
                        onClick={() => activate(slice)}
                    />
                ))}
            </div>
            {activeSlice && anchor && (
                <div aria-hidden="true" className={tooltipStyle} style={{
                    ...(anchor.left > width / 2
                        ? { right: width - anchor.left + TOOLTIP_OFFSET, maxWidth: Math.max(0, anchor.left - TOOLTIP_OFFSET) }
                        : { left: anchor.left + TOOLTIP_OFFSET, maxWidth: Math.max(0, width - anchor.left - TOOLTIP_OFFSET) }),
                    ...(anchor.top > height / 2 ? { bottom: height - anchor.top } : { top: anchor.top }),
                }}>
                    <span>{activeSlice.name}</span>
                    <span className={tooltipValueStyle}>{formatValue(activeSlice.value)} · {formatPercentage(activeSlice.percentage)}</span>
                </div>
            )}
        </div>
    );
}
