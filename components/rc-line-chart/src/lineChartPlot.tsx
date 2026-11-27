import { Fragment } from 'react';
import { Canvas, Circle, Line, Rect, Text } from '@crab-dev/rc-canvas';
import { CHART_METRICS, fitCategoryLabel } from './layout.js';
import type { LineChartLayout, LinePoint } from './layout.js';
import type { LineChartPalette } from './palette.js';
import type { LineChartReferenceLine } from './types.js';

const HIT_RADIUS = 12;

interface PlotProps {
    width: number;
    height: number;
    layout: LineChartLayout;
    colors: string[];
    palette: LineChartPalette;
    referenceLines: readonly LineChartReferenceLine[];
    formatValue: (value: number) => string;
    activeIndex: number | null;
    onHover: (categoryIndex: number) => void;
    onLeave: () => void;
    onSelect: (categoryIndex: number, point?: LinePoint) => void;
    onClear: () => void;
}

export default function LineChartPlot({
    width, height, layout, colors, palette, referenceLines, formatValue,
    activeIndex, onHover, onLeave, onSelect, onClear,
}: PlotProps) {
    const { plotLeft, plotRight, plotTop, plotBottom } = layout;
    const { fontSize, axisLabelGap } = CHART_METRICS;
    const activeBand = activeIndex === null ? undefined : layout.bands[activeIndex];
    // 边界上的点也要能从图外一侧点中，命中范围限制在画布内。
    const hitTop = Math.max(0, plotTop - HIT_RADIUS);
    const hitBottom = Math.min(height, plotBottom + HIT_RADIUS);

    return (
        <Canvas width={width} height={height} tabIndex={-1} onEmptyClick={onClear}>
            {layout.ticks.map(tick => (
                <Line key={tick.value} x1={plotLeft} x2={plotRight}
                    y1={tick.pos + 0.5} y2={tick.pos + 0.5}
                    color={tick.value === 0 ? palette.baseline : palette.gridline}
                />
            ))}
            {layout.tickLabels.map(tick => (
                <Text key={tick.value} mode="bitmap" x={plotLeft - axisLabelGap} y={tick.pos}
                    fontSize={fontSize} fill={palette.axisLabel} textAlign="right" textBaseline="middle"
                >{tick.label}</Text>
            ))}
            {layout.categoryLabels.map(({ categoryIndex, x, label }) => (
                <Text key={categoryIndex} mode="bitmap" x={x} y={plotBottom + 6}
                    fontSize={fontSize} fill={palette.axisLabel} textAlign="center" textBaseline="top"
                >{label}</Text>
            ))}
            {referenceLines.map((reference, index) => {
                const y = layout.referencePositions[index];
                if (y == null) return null;
                const color = reference.color ?? palette.axisLabel;
                const label = fitCategoryLabel(reference.label ?? formatValue(reference.value), plotRight - plotLeft);
                const above = y >= fontSize + 4;
                return (
                    <Fragment key={index}>
                        <Line x1={plotLeft} x2={plotRight} y1={y} y2={y}
                            color={color} dashLength={4} gapLength={4} zIndex={1}
                        />
                        {label && <Text mode="bitmap" x={plotRight} y={y + (above ? -3 : 3)}
                            fontSize={fontSize} fill={color} textAlign="right"
                            textBaseline={above ? 'bottom' : 'top'} zIndex={4}
                        >{label}</Text>}
                    </Fragment>
                );
            })}
            {activeBand && (
                <Line x1={activeBand.center} x2={activeBand.center} y1={plotTop} y2={plotBottom}
                    dashLength={3} gapLength={3} color={palette.axisLabel} zIndex={1}
                />
            )}
            {layout.segments.map(({ from, to }) => (
                <Line key={`${from.categoryIndex}-${from.seriesIndex}`}
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    color={colors[from.seriesIndex]} lineWidth={2} zIndex={2}
                />
            ))}
            {layout.points.map(point => (
                <Circle key={`${point.categoryIndex}-${point.seriesIndex}`}
                    cx={point.x} cy={point.y} r={point.categoryIndex === activeIndex ? 5 : 3.5}
                    fill={colors[point.seriesIndex]} stroke={palette.canvasBackground} strokeWidth={1} zIndex={3}
                />
            ))}
            {layout.bands.map((band, index) => {
                const start = index === 0 ? Math.max(0, band.start - HIT_RADIUS) : band.start;
                const end = Math.min(width, band.start + band.size + (index === layout.bands.length - 1 ? HIT_RADIUS : 0));
                return (
                    <Rect key={index} x={start} y={hitTop} width={end - start} height={hitBottom - hitTop}
                        fill="transparent" onMouseEnter={() => onHover(index)} onMouseLeave={onLeave}
                        onClick={({ canvasX, canvasY }) => {
                            let closest: LinePoint | undefined;
                            let distance = HIT_RADIUS;
                            for (const point of layout.points) {
                                if (point.categoryIndex !== index) continue;
                                const delta = Math.hypot(point.x - canvasX, point.y - canvasY);
                                if (delta <= distance) {
                                    distance = delta;
                                    closest = point;
                                }
                            }
                            onSelect(index, closest);
                        }}
                    />
                );
            })}
        </Canvas>
    );
}
