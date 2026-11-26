import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cx } from '@crab-dev/css';
import AutoSizer from '@crab-dev/rc-auto-sizer';
import { useLocale } from '@crab-dev/rc-config-provider';
import Empty from '@crab-dev/rc-empty';
import { computeLayout, isFinitePoint } from './layout.js';
import type { ScatterPlotPoint } from './layout.js';
import { MAX_SERIES, mergeScatterChartPalette } from './palette.js';
import ScatterChartPlot from './scatterChartPlot.js';
import type { ScatterChartProps } from './types.js';
import {
    canvasWrapStyle, emptyStyle, keyboardLayerStyle, legendItemStyle, legendStyle, pointButtonStyle,
    rootStyle, swatchStyle, tooltipNameStyle, tooltipRowStyle, tooltipStyle, tooltipTitleStyle,
    tooltipValueStyle, visuallyHiddenStyle,
} from './scatterChart.styles.js';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 320;
const TOOLTIP_OFFSET = 14;

function chartSize(value: number, fallback: number): number {
    return Number.isFinite(value) ? Math.max(0, value) : fallback;
}

type MeasuredProps = Omit<ScatterChartProps, 'width'> & { width: number };

function MeasuredScatterChart({
    width, height: inputHeight = DEFAULT_HEIGHT, series, palette: override, formatX: customX, formatY: customY,
    labels, 'aria-label': ariaLabel, onPointClick, className, style, ref,
}: MeasuredProps) {
    const { locale } = useLocale();
    const english = locale === 'en-US';
    const height = chartSize(inputHeight, DEFAULT_HEIGHT);
    const decimal = new Intl.NumberFormat(locale, { maximumSignificantDigits: 17 });
    const scientific = new Intl.NumberFormat(locale, { notation: 'scientific', maximumSignificantDigits: 17 });
    const formatValue = (value: number) => {
        const magnitude = Math.abs(value);
        return magnitude >= 1e12 || (magnitude > 0 && magnitude < 1e-6)
            ? scientific.format(value) : decimal.format(value);
    };
    const formatX = customX ?? formatValue;
    const formatY = customY ?? formatValue;
    const caption = ariaLabel ?? (english ? 'Scatter chart' : '散点图');
    const seriesLabel = labels?.series ?? (english ? 'Series' : '系列');
    const pointLabel = labels?.point ?? (english ? 'Point' : '数据点');
    const xLabel = labels?.x ?? 'X';
    const yLabel = labels?.y ?? 'Y';
    const pointName = (label: string | undefined, index: number) => label || `${pointLabel} ${index + 1}`;

    const palette = mergeScatterChartPalette(override);
    const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set());
    const [active, setActive] = useState<{ key: string; pinned: boolean } | null>(null);
    const [focusKey, setFocusKey] = useState('');
    const occurrences = new Map<string, number>();
    const entries = series.slice(0, MAX_SERIES).map((item, index) => {
        const occurrence = occurrences.get(item.name) ?? 0;
        occurrences.set(item.name, occurrence + 1);
        return { item, index, key: `${occurrence}:${item.name}`, color: item.color ?? palette.series[index]! };
    });
    const hasLegend = entries.length > 1;
    const shown = hasLegend ? entries.filter(entry => !hidden.has(entry.key)) : entries;
    const layout = computeLayout({
        width, height, series: shown.map(entry => entry.item), formatX, formatY, xTitle: labels?.x, yTitle: labels?.y,
    });
    const keyFor = (point: ScatterPlotPoint) => `${point.pointIndex}-${shown[point.seriesIndex].key}`;
    const focusIndex = Math.max(0, layout.points.findIndex(point => keyFor(point) === focusKey));
    const current = active ? layout.points.find(point => keyFor(point) === active.key) : undefined;
    const currentSeries = current && shown[current.seriesIndex];

    function toggleSeries(key: string) {
        setActive(null);
        setHidden(previous => {
            const next = new Set(previous);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }

    function hoverPoint(point: ScatterPlotPoint | null) {
        const key = point ? keyFor(point) : null;
        setActive(previous => {
            if (key === null) return previous?.pinned ? previous : null;
            return previous?.key === key ? previous : { key, pinned: false };
        });
    }

    function selectPoint(point: ScatterPlotPoint | null) {
        if (!point) {
            setActive(null);
            return;
        }
        setActive({ key: keyFor(point), pinned: true });
        const entry = shown[point.seriesIndex];
        onPointClick?.({
            seriesIndex: entry.index, pointIndex: point.pointIndex,
            seriesName: entry.item.name, point: entry.item.data[point.pointIndex],
        });
    }

    function navigate(event: KeyboardEvent<HTMLDivElement>) {
        let next: number;
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowRight': next = Math.min(layout.points.length - 1, focusIndex + 1); break;
            case 'ArrowUp':
            case 'ArrowLeft': next = Math.max(0, focusIndex - 1); break;
            case 'Home': next = 0; break;
            case 'End': next = layout.points.length - 1; break;
            case 'Escape': setActive(null); return;
            default: return;
        }
        event.preventDefault();
        event.currentTarget.querySelectorAll('button')[next]?.focus();
    }

    return (
        <div className={cx.call(undefined, rootStyle, className)} style={style} ref={ref}>
            {hasLegend && (
                <div className={legendStyle} role="group" aria-label={labels?.legend ?? (english ? 'Legend' : '图例')}>
                    {entries.map(({ key, item, color }) => (
                        <button key={key} type="button" className={legendItemStyle}
                            aria-pressed={!hidden.has(key)} onClick={() => toggleSeries(key)}
                        >
                            <span className={swatchStyle} style={{ backgroundColor: color }} />
                            {item.name}
                        </button>
                    ))}
                </div>
            )}
            {layout.points.length === 0 ? (
                <div className={emptyStyle} style={{ width, height }}><Empty /></div>
            ) : (
                <div className={canvasWrapStyle} style={{ width, height, backgroundColor: palette.canvasBackground }}>
                    <ScatterChartPlot width={width} height={height} layout={layout} palette={palette}
                        colors={shown.map(entry => entry.color)} active={current} onHover={hoverPoint} onSelect={selectPoint}
                    />
                    <div className={keyboardLayerStyle} role="group" aria-label={caption} onKeyDown={navigate}
                        onBlur={event => {
                            if (!event.currentTarget.contains(event.relatedTarget)) setActive(null);
                        }}
                    >
                        {layout.points.map((point, index) => {
                            const key = keyFor(point);
                            const entry = shown[point.seriesIndex];
                            const name = pointName(point.label, point.pointIndex);
                            return (
                                <button key={key} type="button" className={pointButtonStyle}
                                    style={{ left: point.x - 5, top: point.y - 5, width: 10, height: 10 }}
                                    aria-label={`${entry.item.name} ${name} ${xLabel} ${formatX(point.valueX)} ${yLabel} ${formatY(point.valueY)}`}
                                    tabIndex={index === focusIndex ? 0 : -1}
                                    onFocus={() => {
                                        setFocusKey(key);
                                        setActive({ key, pinned: true });
                                    }}
                                    onClick={() => selectPoint(point)}
                                />
                            );
                        })}
                    </div>
                    {current && currentSeries && (
                        <div aria-hidden="true" className={tooltipStyle} style={{
                            ...(current.x > width / 2
                                ? { right: width - current.x + TOOLTIP_OFFSET, maxWidth: Math.max(0, current.x - TOOLTIP_OFFSET) }
                                : { left: current.x + TOOLTIP_OFFSET, maxWidth: Math.max(0, width - current.x - TOOLTIP_OFFSET) }),
                            ...(current.y > height / 2 ? { bottom: height - current.y } : { top: current.y }),
                        }}>
                            <div className={tooltipTitleStyle}>{pointName(current.label, current.pointIndex)}</div>
                            <div className={tooltipRowStyle}>
                                <span className={swatchStyle} style={{ backgroundColor: currentSeries.color }} />
                                <span className={tooltipNameStyle}>{currentSeries.item.name}</span>
                            </div>
                            <div className={tooltipRowStyle}>
                                <span className={tooltipNameStyle}>{xLabel}</span>
                                <span className={tooltipValueStyle}>{formatX(current.valueX)}</span>
                            </div>
                            <div className={tooltipRowStyle}>
                                <span className={tooltipNameStyle}>{yLabel}</span>
                                <span className={tooltipValueStyle}>{formatY(current.valueY)}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {entries.length > 0 && (
                <div className={visuallyHiddenStyle}>
                    <table>
                        <caption>{caption}</caption>
                        <thead><tr>
                            <th scope="col">{seriesLabel}</th><th scope="col">{pointLabel}</th>
                            <th scope="col">{xLabel}</th><th scope="col">{yLabel}</th>
                        </tr></thead>
                        <tbody>
                            {entries.map(({ key, item }) => item.data.map((point, pointIndex) => isFinitePoint(point) && (
                                <tr key={`${pointIndex}-${key}`}>
                                    <td>{item.name}</td><th scope="row">{pointName(point.label, pointIndex)}</th>
                                    <td>{formatX(point.x)}</td><td>{formatY(point.y)}</td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

/** 在两个独立的数值轴上绘制观测点，可按系列筛选并逐点读取或激活。 */
export default function ScatterChart({ width = DEFAULT_WIDTH, ...props }: ScatterChartProps) {
    if (width === 'auto') {
        const { className, style, ...inner } = props;
        return (
            <AutoSizer disableHeight defaultWidth={DEFAULT_WIDTH} className={className}
                style={{ blockSize: 'auto', overflow: 'visible', ...style }}>
                {size => <MeasuredScatterChart {...inner} width={size.width} />}
            </AutoSizer>
        );
    }
    return <MeasuredScatterChart {...props} width={chartSize(width, DEFAULT_WIDTH)} />;
}
