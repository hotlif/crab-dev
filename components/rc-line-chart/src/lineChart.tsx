import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cx } from '@crab-dev/css';
import AutoSizer from '@crab-dev/rc-auto-sizer';
import { useLocale } from '@crab-dev/rc-config-provider';
import Empty from '@crab-dev/rc-empty';
import { computeLayout } from './layout.js';
import type { LinePoint } from './layout.js';
import LineChartPlot from './lineChartPlot.js';
import { MAX_SERIES, mergeLineChartPalette } from './palette.js';
import type { LineChartProps } from './types.js';
import {
    canvasWrapStyle, emptyStyle, keyboardLayerStyle, legendItemStyle, legendStyle, pointButtonStyle,
    rootStyle, swatchStyle, tooltipCategoryStyle, tooltipNameStyle, tooltipRowStyle, tooltipStyle,
    tooltipValueStyle, visuallyHiddenStyle,
} from './lineChart.styles.js';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 320;
const TOOLTIP_OFFSET = 14;

function chartSize(value: number, fallback: number) {
    return Number.isFinite(value) ? Math.max(0, value) : fallback;
}

type MeasuredProps = Omit<LineChartProps, 'width'> & { width: number };

function MeasuredLineChart({
    categories, series, width, height: inputHeight = DEFAULT_HEIGHT, referenceLines = [], palette: override,
    formatValue: customFormat, formatAxisValue, onPointClick, labels, 'aria-label': ariaLabel,
    className, style, ref,
}: MeasuredProps) {
    const { locale } = useLocale();
    const height = chartSize(inputHeight, DEFAULT_HEIGHT);
    const format = customFormat ?? new Intl.NumberFormat(locale).format;
    const formatCell = (value: number | null | undefined) =>
        typeof value === 'number' && Number.isFinite(value) ? format(value) : '—';
    const caption = ariaLabel ?? (locale === 'en-US' ? 'Line chart' : '折线图');
    const palette = mergeLineChartPalette(override);
    const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set());
    const [active, setActive] = useState<{ index: number; pinned: boolean } | null>(null);
    const [focusKey, setFocusKey] = useState('');

    // 同名系列按出现顺序区分；重排其他系列不会改变图例选择或键盘焦点。
    const occurrences = new Map<string, number>();
    const entries = series.slice(0, MAX_SERIES).map((item, index) => {
        const occurrence = occurrences.get(item.name) ?? 0;
        occurrences.set(item.name, occurrence + 1);
        return { item, index, key: `${occurrence}:${item.name}`, color: item.color ?? palette.series[index]! };
    });
    const hasLegend = entries.length > 1 && categories.length > 0;
    const shown = hasLegend ? entries.filter(({ key }) => !hidden.has(key)) : entries;
    const layout = computeLayout({
        width, height, categories, series: shown.map(({ item }) => item),
        formatValue: formatAxisValue ?? format, referenceValues: referenceLines.map(line => line.value),
    });
    const pointKey = (point: LinePoint) => `${point.categoryIndex}-${shown[point.seriesIndex].key}`;
    const focusIndex = Math.max(0, layout.points.findIndex(point => pointKey(point) === focusKey));
    const activeIndex = active && active.index < categories.length ? active.index : null;
    const band = activeIndex === null ? undefined : layout.bands[activeIndex];

    function selectCategory(index: number, point?: LinePoint) {
        setActive({ index, pinned: true });
        if (point && onPointClick) {
            const entry = shown[point.seriesIndex];
            onPointClick({
                categoryIndex: index, category: categories[index], seriesIndex: entry.index,
                seriesName: entry.item.name, value: point.value,
            });
        }
    }

    function navigate(event: KeyboardEvent<HTMLDivElement>) {
        let next: number;
        switch (event.key) {
            case 'ArrowRight': next = Math.min(layout.points.length - 1, focusIndex + 1); break;
            case 'ArrowLeft': next = Math.max(0, focusIndex - 1); break;
            case 'Home': next = 0; break;
            case 'End': next = layout.points.length - 1; break;
            case 'Escape': setActive(null); return;
            default: return;
        }
        event.preventDefault();
        event.currentTarget.querySelectorAll('button')[next]?.focus();
    }

    function toggleSeries(key: string) {
        setActive(null);
        setHidden(previous => {
            const next = new Set(previous);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }

    return (
        <div className={cx.call(undefined, rootStyle, className)} style={style} ref={ref}>
            {hasLegend && (
                <div className={legendStyle} role="group" aria-label={labels?.legend ?? (locale === 'en-US' ? 'Legend' : '图例')}>
                    {entries.map(({ item, key, color }) => (
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
                    <div aria-hidden="true">
                        <LineChartPlot width={width} height={height} layout={layout} palette={palette}
                            colors={shown.map(entry => entry.color)} referenceLines={referenceLines}
                            formatValue={format} activeIndex={activeIndex}
                            onHover={index => setActive({ index, pinned: false })}
                            onLeave={() => setActive(previous => previous?.pinned ? previous : null)}
                            onSelect={selectCategory} onClear={() => setActive(null)}
                        />
                    </div>
                    <div className={keyboardLayerStyle} role="group" aria-label={caption}
                        onKeyDown={navigate}
                        onBlur={event => {
                            if (!event.currentTarget.contains(event.relatedTarget)) setActive(null);
                        }}
                    >
                        {layout.points.map((point, index) => {
                            const key = pointKey(point);
                            const category = categories[point.categoryIndex];
                            const name = entries.length > 1 ? `${category} ${shown[point.seriesIndex].item.name}` : category;
                            return (
                                <button key={key} type="button" className={pointButtonStyle}
                                    style={{ left: point.x - 5, top: point.y - 5, width: 10, height: 10 }}
                                    aria-label={`${name} ${format(point.value)}`} tabIndex={index === focusIndex ? 0 : -1}
                                    onFocus={() => {
                                        setFocusKey(key);
                                        setActive({ index: point.categoryIndex, pinned: true });
                                    }}
                                    onClick={() => selectCategory(point.categoryIndex, point)}
                                />
                            );
                        })}
                    </div>
                    {activeIndex !== null && band && (
                        <div aria-hidden="true" className={tooltipStyle} style={{
                            top: layout.plotTop,
                            ...(band.center > width / 2
                                ? { right: width - band.center + TOOLTIP_OFFSET, maxWidth: Math.max(0, band.center - TOOLTIP_OFFSET) }
                                : { left: band.center + TOOLTIP_OFFSET, maxWidth: Math.max(0, width - band.center - TOOLTIP_OFFSET) }),
                        }}>
                            <div className={tooltipCategoryStyle}>{categories[activeIndex]}</div>
                            {shown.map(({ item, key, color }) => (
                                <div key={key} className={tooltipRowStyle}>
                                    <span className={swatchStyle} style={{ backgroundColor: color }} />
                                    <span className={tooltipNameStyle}>{item.name}</span>
                                    <span className={tooltipValueStyle}>{formatCell(item.data[activeIndex])}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {entries.length > 0 && categories.length > 0 && (
                <div className={visuallyHiddenStyle}>
                    <table>
                        <caption>{caption}</caption>
                        <thead>
                            <tr>
                                <th scope="col">{labels?.category ?? (locale === 'en-US' ? 'Category' : '类目')}</th>
                                {entries.map(({ item, key }) => <th key={key} scope="col">{item.name}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, categoryIndex) => (
                                <tr key={categoryIndex}>
                                    <th scope="row">{category}</th>
                                    {entries.map(({ item, key }) => <td key={key}>{formatCell(item.data[categoryIndex])}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

/** 按类目顺序连接相邻有效数据点，支持图例筛选、指针与键盘交互。 */
export default function LineChart({ width = DEFAULT_WIDTH, ...props }: LineChartProps) {
    if (width === 'auto') {
        const { className, style, ...inner } = props;
        return (
            <AutoSizer disableHeight defaultWidth={DEFAULT_WIDTH} className={className}
                style={{ blockSize: 'auto', overflow: 'visible', ...style }}>
                {size => <MeasuredLineChart {...inner} width={size.width} />}
            </AutoSizer>
        );
    }
    return <MeasuredLineChart {...props} width={chartSize(width, DEFAULT_WIDTH)} />;
}
