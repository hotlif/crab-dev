import { Fragment, useEffect, useState } from 'react';
import { css, cx } from '@linaria/core';
import { Canvas, Rect, Line, Text } from '@crab-dev/rc-canvas';
import Empty from '@crab-dev/rc-empty';
import token from './token.js';
import { CATEGORICAL_PALETTE, CHART_INK, MAX_SERIES } from './palette.js';
import { computeLayout, CHART_METRICS } from './layout.js';
import type { BarChartProps } from './types.js';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 320;

/** 悬浮提示与指针的间距（px），避免提示框压住指针 */
const TOOLTIP_OFFSET = 12;

const defaultFormatValue = (value: number): string => value.toLocaleString();

const rootStyle = css`
    display: inline-flex;
    flex-direction: column;
    gap: ${token.legend.gap};
`;

const legendStyle = css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    column-gap: ${token.legend['item-gap']};
    row-gap: ${token.legend['swatch-gap']};
`;

const legendItemStyle = css`
    display: inline-flex;
    align-items: center;
    gap: ${token.legend['swatch-gap']};
    font-size: ${token.legend.label.font.size};
    color: ${token.legend.label.color};
`;

const legendSwatchStyle = css`
    inline-size: ${token.legend['swatch-size']};
    block-size: ${token.legend['swatch-size']};
    border-radius: 2px;
    flex-shrink: 0;
`;

const canvasWrapStyle = css`
    position: relative;
    line-height: 0;
`;

const tooltipStyle = css`
    position: absolute;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    row-gap: ${token.tooltip['row-gap']};
    padding: ${token.tooltip.padding};
    background: ${token.tooltip.background};
    border-radius: ${token.tooltip.radius};
    box-shadow: ${token.tooltip.shadow};
    font-size: ${token.tooltip.font.size};
    line-height: 1.4;
    white-space: nowrap;
`;

const tooltipCategoryStyle = css`
    color: ${token.tooltip.category.color};
`;

const tooltipRowStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.tooltip['key-gap']};
`;

/* 系列色键：短线而非色块，提示密度下线钥更轻 */
const tooltipKeyStyle = css`
    inline-size: 10px;
    block-size: 3px;
    border-radius: 1.5px;
    flex-shrink: 0;
`;

const tooltipNameStyle = css`
    color: ${token.tooltip.name.color};
`;

const tooltipValueStyle = css`
    margin-inline-start: auto;
    padding-inline-start: 12px;
    color: ${token.tooltip.value.color};
    font-weight: ${token.tooltip.value.font.weight};
    font-variant-numeric: tabular-nums;
`;

const emptyStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
`;

/* 数据表仅供辅助技术与选择复制，视觉上隐藏 */
const visuallyHiddenStyle = css`
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
`;

/**
 * 柱状图。基于 rc-canvas（WebGL）绘制，支持单系列、多系列分组与堆叠。
 *
 * - 绘制层（柱 / 网格 / 轴文本）渲染在 Canvas 中，对辅助技术隐藏；
 *   完整数据以视觉隐藏的 `<table>` 提供（悬浮提示只增强、不守门）。
 * - 系列颜色按分类色板顺序分配（颜色跟随系列，不随过滤重排）。
 */
function BarChart({
    categories,
    series,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    stacked = false,
    formatValue = defaultFormatValue,
    onBarClick,
    'aria-label': ariaLabel = '柱状图',
    className,
    style,
    ref,
}: BarChartProps) {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    /** 指针在画布包装层内的坐标，驱动悬浮提示跟随鼠标 */
    const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        if (series.length > MAX_SERIES) {
            console.warn(
                `[rc-bar-chart] 最多渲染 ${MAX_SERIES} 个系列（第 ${MAX_SERIES + 1} 个起忽略）；` +
                '请将长尾合并为「其他」或拆分为多张图。',
            );
        }
    }, [series.length]);

    const visibleSeries = series.length > MAX_SERIES ? series.slice(0, MAX_SERIES) : series;

    if (categories.length === 0 || visibleSeries.length === 0) {
        return (
            <div ref={ref} className={cx(rootStyle, className)} style={style}>
                <div className={emptyStyle} style={{ inlineSize: width, blockSize: height }}>
                    <Empty />
                </div>
            </div>
        );
    }

    const layout = computeLayout({ width, height, categories, series: visibleSeries, stacked, formatValue });
    const colors = visibleSeries.map((s, i) => s.color ?? CATEGORICAL_PALETTE[i]);
    const plotHeight = layout.plotBottom - layout.plotTop;
    const hoverBand = hoverIndex !== null ? layout.bands[hoverIndex] : null;

    return (
        <div ref={ref} className={cx(rootStyle, className)} style={style}>
            {visibleSeries.length >= 2 && (
                <div className={legendStyle}>
                    {visibleSeries.map((s, i) => (
                        <span key={s.name} className={legendItemStyle}>
                            {/* 系列色为数据驱动值，无法静态成 css 块，走内联传递 */}
                            <span className={legendSwatchStyle} style={{ backgroundColor: colors[i] }} />
                            {s.name}
                        </span>
                    ))}
                </div>
            )}

            <div
                className={canvasWrapStyle}
                aria-hidden="true"
                onPointerMove={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPointer({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onPointerLeave={() => setPointer(null)}
            >
                <Canvas width={width} height={height}>
                    {/* 网格线（hairline 实线）与零值基线 */}
                    {layout.ticks.map(tick => (
                        <Line
                            key={`grid-${tick.value}`}
                            x1={layout.plotLeft}
                            y1={tick.y}
                            x2={layout.plotRight}
                            y2={tick.y}
                            color={tick.value === 0 ? CHART_INK.baseline : CHART_INK.gridline}
                            lineWidth={1}
                        />
                    ))}
                    {layout.ticks.map(tick => (
                        <Text
                            key={`tick-${tick.value}`}
                            x={layout.plotLeft - CHART_METRICS.axisLabelGap}
                            y={tick.y}
                            textAlign="right"
                            textBaseline="middle"
                            fontSize={CHART_METRICS.fontSize}
                            fill={CHART_INK.axisLabel}
                        >
                            {tick.label}
                        </Text>
                    ))}
                    {categories.map((category, i) => (
                        <Text
                            key={`cat-${i}`}
                            x={layout.bands[i].centerX}
                            y={layout.plotBottom + 6}
                            textAlign="center"
                            textBaseline="top"
                            fontSize={CHART_METRICS.fontSize}
                            fill={CHART_INK.axisLabel}
                        >
                            {String(category)}
                        </Text>
                    ))}

                    {/* 悬停类目水洗背景（不改变盒尺寸的反馈） */}
                    {hoverBand && (
                        <Rect
                            x={hoverBand.x}
                            y={layout.plotTop}
                            width={hoverBand.width}
                            height={plotHeight}
                            fill={CHART_INK.hoverWash}
                            zIndex={1}
                        />
                    )}

                    {/* 类目命中区：比柱子更大的悬停目标 */}
                    {layout.bands.map((band, i) => (
                        <Rect
                            key={`band-${i}`}
                            x={band.x}
                            y={layout.plotTop}
                            width={band.width}
                            height={plotHeight}
                            fill="transparent"
                            zIndex={2}
                            onMouseEnter={() => setHoverIndex(i)}
                            onMouseLeave={() => setHoverIndex(null)}
                        />
                    ))}

                    {/* 柱：数据端 4px 圆角、基线端方角（补丁矩形盖住基线侧圆角） */}
                    {layout.bars.map(bar => {
                        const radius = bar.dataEnd === null
                            ? 0
                            : Math.min(CHART_METRICS.barRadius, bar.width / 2, bar.height / 2);
                        return (
                            <Fragment key={`bar-${bar.categoryIndex}-${bar.seriesIndex}`}>
                                <Rect
                                    x={bar.x}
                                    y={bar.y}
                                    width={bar.width}
                                    height={bar.height}
                                    radius={radius}
                                    fill={colors[bar.seriesIndex]}
                                    zIndex={3}
                                    cursor={onBarClick ? 'pointer' : undefined}
                                    onMouseEnter={() => setHoverIndex(bar.categoryIndex)}
                                    onMouseLeave={() => setHoverIndex(null)}
                                    onClick={onBarClick
                                        ? () => onBarClick({
                                            categoryIndex: bar.categoryIndex,
                                            seriesIndex: bar.seriesIndex,
                                            category: categories[bar.categoryIndex],
                                            seriesName: visibleSeries[bar.seriesIndex].name,
                                            value: bar.value,
                                        })
                                        : undefined}
                                />
                                {radius > 0 && (
                                    <Rect
                                        x={bar.x}
                                        y={bar.dataEnd === 'top' ? bar.y + bar.height - radius : bar.y}
                                        width={bar.width}
                                        height={radius}
                                        fill={colors[bar.seriesIndex]}
                                        zIndex={3.1}
                                    />
                                )}
                            </Fragment>
                        );
                    })}
                </Canvas>

                {/* 悬浮提示：跟随指针，靠近右/下缘时向反方向翻转；列出该类目下全部系列 */}
                {hoverIndex !== null && pointer !== null && (
                    <div
                        className={tooltipStyle}
                        style={{
                            left: pointer.x,
                            top: pointer.y,
                            transform: `translate(${
                                pointer.x > width * 0.6 ? `calc(-100% - ${TOOLTIP_OFFSET}px)` : `${TOOLTIP_OFFSET}px`
                            }, ${
                                pointer.y > height * 0.6 ? `calc(-100% - ${TOOLTIP_OFFSET}px)` : `${TOOLTIP_OFFSET}px`
                            })`,
                        }}
                    >
                        <div className={tooltipCategoryStyle}>{categories[hoverIndex]}</div>
                        {visibleSeries.map((s, i) => (
                            <div key={s.name} className={tooltipRowStyle}>
                                <span className={tooltipKeyStyle} style={{ backgroundColor: colors[i] }} />
                                <span className={tooltipNameStyle}>{s.name}</span>
                                <span className={tooltipValueStyle}>{formatValue(s.data[hoverIndex] ?? 0)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 表格视图：辅助技术与无悬停环境的等价数据通道 */}
            <table className={visuallyHiddenStyle}>
                <caption>{ariaLabel}</caption>
                <thead>
                    <tr>
                        <th scope="col">类目</th>
                        {visibleSeries.map(s => (
                            <th key={s.name} scope="col">{s.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, i) => (
                        <tr key={i}>
                            <th scope="row">{category}</th>
                            {visibleSeries.map(s => (
                                <td key={s.name}>{formatValue(s.data[i] ?? 0)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BarChart;
