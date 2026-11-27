import { Canvas, Circle, Line, Rect, Text } from '@crab-dev/rc-canvas';
import { CHART_METRICS } from './layout.js';
import type { ScatterChartLayout, ScatterPlotPoint } from './layout.js';
import type { ScatterChartPalette } from './palette.js';

const HIT_RADIUS = 12;

function nearestPoint(points: readonly ScatterPlotPoint[], x: number, y: number) {
    let nearest: ScatterPlotPoint | null = null;
    let distanceSquared = HIT_RADIUS ** 2;
    for (const point of points) {
        const distance = (point.x - x) ** 2 + (point.y - y) ** 2;
        // 等距时取绘制顺序靠后的系列或观测，键盘层保留所有重叠点。
        if (distance <= distanceSquared) {
            distanceSquared = distance;
            nearest = point;
        }
    }
    return nearest;
}

interface PlotProps {
    width: number;
    height: number;
    layout: ScatterChartLayout;
    colors: readonly string[];
    palette: ScatterChartPalette;
    active: ScatterPlotPoint | undefined;
    onHover: (point: ScatterPlotPoint | null) => void;
    onSelect: (point: ScatterPlotPoint | null) => void;
}

export default function ScatterChartPlot({ width, height, layout, colors, palette, active, onHover, onSelect }: PlotProps) {
    const { plotLeft, plotRight, plotTop, plotBottom } = layout;
    const { fontSize, axisLabelGap } = CHART_METRICS;
    return (
        <div aria-hidden="true" onPointerLeave={() => onHover(null)}
            onPointerMove={event => {
                if (event.pointerType === 'touch') return;
                const rect = event.currentTarget.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) return;
                const x = (event.clientX - rect.left) * width / rect.width;
                const y = (event.clientY - rect.top) * height / rect.height;
                onHover(nearestPoint(layout.points, x, y));
            }}
        >
            <Canvas width={width} height={height} tabIndex={-1}>
                {layout.xTicks.map(tick => (
                    <Line key={tick.value} x1={tick.pos} x2={tick.pos} y1={plotTop} y2={plotBottom}
                        color={tick.value === 0 ? palette.baseline : palette.gridline}
                    />
                ))}
                {layout.yTicks.map(tick => (
                    <Line key={tick.value} x1={plotLeft} x2={plotRight} y1={tick.pos} y2={tick.pos}
                        color={tick.value === 0 ? palette.baseline : palette.gridline}
                    />
                ))}
                {layout.xTickLabels.map(tick => (
                    <Text key={tick.value} mode="bitmap" x={tick.pos} y={plotBottom + 6}
                        fontSize={fontSize} fill={palette.axisLabel} textAlign="center" textBaseline="top"
                    >{tick.label}</Text>
                ))}
                {layout.yTickLabels.map(tick => (
                    <Text key={tick.value} mode="bitmap" x={plotLeft - axisLabelGap} y={tick.pos}
                        fontSize={fontSize} fill={palette.axisLabel} textAlign="right" textBaseline="middle"
                    >{tick.label}</Text>
                ))}
                {[layout.xTitle, layout.yTitle].map((title, index) => title && (
                    <Text key={index} mode="bitmap" x={title.x} y={title.y} fontSize={fontSize}
                        fill={palette.axisLabel} textAlign="center" textBaseline="middle"
                    >{title.label}</Text>
                ))}
                {layout.points.map(point => (
                    <Circle key={`${point.seriesIndex}-${point.pointIndex}`}
                        cx={point.x} cy={point.y} r={point === active ? 6 : 4}
                        fill={colors[point.seriesIndex]} stroke={palette.canvasBackground} strokeWidth={1}
                        zIndex={point === active ? 2 : 1}
                    />
                ))}
                <Rect x={0} y={0} width={width} height={height} fill="transparent"
                    onClick={({ canvasX, canvasY }) => onSelect(nearestPoint(layout.points, canvasX, canvasY))}
                />
            </Canvas>
        </div>
    );
}
