import { useState } from 'react';
import { cx } from '@crab-dev/css';
import AutoSizer from '@crab-dev/rc-auto-sizer';
import { useLocale } from '@crab-dev/rc-config-provider';
import Empty from '@crab-dev/rc-empty';
import { buildPieSlices, getPieGeometry, isPlottableValue } from './layout.js';
import { mergePieChartPalette, resolveSliceColor } from './palette.js';
import PieChartPlot from './pieChartPlot.js';
import type { PieChartProps } from './types.js';
import { emptyStyle, legendItemStyle, legendStyle, rootStyle, swatchStyle, visuallyHiddenStyle } from './pieChart.styles.js';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 320;

function chartSize(value: number, fallback: number) {
    return Number.isFinite(value) ? Math.max(0, value) : fallback;
}

/** 用扇区呈现各类目占可见总量的比例，支持图例筛选、键盘浏览及环形布局。 */
export default function PieChart({
    data, width = DEFAULT_WIDTH, height: inputHeight = DEFAULT_HEIGHT, innerRadiusRatio,
    palette: override, 'aria-label': ariaLabel, labels, formatValue: customFormat, onSliceClick,
    className, style, ref,
}: PieChartProps) {
    const { locale } = useLocale();
    const english = locale === 'en-US';
    const caption = ariaLabel ?? (english ? 'Pie chart' : '饼图');
    const formatValue = customFormat ?? new Intl.NumberFormat(locale).format;
    const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 });
    const formatPercentage = (percentage: number) => percent.format(percentage / 100);
    const palette = mergePieChartPalette(override);
    const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set());
    const height = chartSize(inputHeight, DEFAULT_HEIGHT);
    const chartWidth = width === 'auto' ? 'auto' : chartSize(width, DEFAULT_WIDTH);

    // 筛选跟随类目名称；同名类目按出现次序区分。颜色和回调仍使用当前数据下标。
    const occurrences = new Map<string, number>();
    const entries = data.map((item, index) => {
        const ordinal = occurrences.get(item.name) ?? 0;
        occurrences.set(item.name, ordinal + 1);
        return { item, index, key: `${ordinal}/${item.name}` };
    });
    const legend = entries.filter(({ item }) => isPlottableValue(item.value));
    const hiddenIndices = new Set(legend.filter(entry => hidden.has(entry.key)).map(entry => entry.index));
    const slices = buildPieSlices(data, hiddenIndices);
    const percentages = new Map(slices.map(slice => [slice.index, slice.percentage]));
    const colors = data.map((item, index) => resolveSliceColor(item.color, index, palette));

    function toggle(key: string) {
        setHidden(previous => {
            const next = new Set(previous);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }

    function renderPlot(measured: number) {
        return (
            <PieChartPlot width={measured} height={height} geometry={getPieGeometry(measured, height, innerRadiusRatio)}
                slices={slices} sliceKeys={entries.map(entry => entry.key)} colors={colors} palette={palette} caption={caption}
                formatValue={formatValue} formatPercentage={formatPercentage} onSliceClick={onSliceClick}
            />
        );
    }

    return (
        <div ref={ref} className={cx.call(undefined, rootStyle, className)}
            style={{ width: chartWidth === 'auto' ? '100%' : chartWidth, ...style }}>
            {legend.length > 0 && (
                <div role="group" aria-label={labels?.legend ?? (english ? 'Legend' : '图例')} className={legendStyle}>
                    {legend.map(({ item, index, key }) => (
                        <button type="button" key={key} className={legendItemStyle}
                            aria-pressed={!hidden.has(key)} onClick={() => toggle(key)}>
                            <span aria-hidden="true" className={swatchStyle} style={{ backgroundColor: colors[index] }} />
                            {item.name}
                        </button>
                    ))}
                </div>
            )}
            {slices.length === 0 ? (
                <div className={emptyStyle} style={{ height }}>
                    {legend.length > 0 ? (
                        <Empty title={english ? 'All categories are hidden' : '所有类目均已隐藏'}
                            description={english ? 'Choose a category in the legend to show it.' : '在图例中选择要显示的类目。'} />
                    ) : (
                        <Empty description={english ? 'Add a category with a positive value.' : '请添加数值大于零的类目。'} />
                    )}
                </div>
            ) : chartWidth === 'auto' ? (
                <AutoSizer disableHeight style={{ height }}>
                    {({ width: measured }) => renderPlot(measured)}
                </AutoSizer>
            ) : renderPlot(chartWidth)}
            {entries.length > 0 && (
                <div className={visuallyHiddenStyle}>
                    <table>
                        <caption>{caption}</caption>
                        <thead>
                            <tr>
                                <th scope="col">{labels?.category ?? (english ? 'Category' : '类目')}</th>
                                <th scope="col">{labels?.value ?? (english ? 'Value' : '数值')}</th>
                                <th scope="col">{labels?.percentage ?? (english ? 'Share' : '占比')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map(({ item, index, key }) => {
                                const percentage = percentages.get(index);
                                return (
                                    <tr key={key}>
                                        <th scope="row">{item.name}</th>
                                        <td>{Number.isFinite(item.value) ? formatValue(item.value) : '—'}</td>
                                        <td>{percentage === undefined ? '—' : formatPercentage(percentage)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
