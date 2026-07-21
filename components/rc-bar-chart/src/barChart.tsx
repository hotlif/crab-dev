import { Fragment, useEffect, useState } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';
import { css, cx } from '@linaria/core';
import { Canvas, Rect, Line, Text } from '@crab-dev/rc-canvas';
import Empty from '@crab-dev/rc-empty';
import token from './token.js';
import { CATEGORICAL_PALETTE, CHART_INK, MAX_SERIES } from './palette.js';
import { computeLayout, CHART_METRICS } from './layout.js';
import { useBarTransition } from './hooks/useBarTransition.js';
import type { BarChartProps } from './types.js';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 320;

/** 悬浮提示与指针（或锚定柱缘）的间距（px），避免提示框压住目标 */
const TOOLTIP_OFFSET = 12;

const defaultFormatValue = (value: number): string => value.toLocaleString();

/**
 * 活动类目。sticky 表示由点按（触屏）或键盘聚焦固定：
 * 鼠标移出不清除，被新的 hover、点击空白或失焦覆盖时才更新。
 */
interface ActiveCategory {
    index: number;
    sticky: boolean;
}

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

/* 键盘专用层：不拦截指针，鼠标 / 触摸事件穿透到 Canvas 命中层 */
const keyboardLayerStyle = css`
    position: absolute;
    inset: 0;
    pointer-events: none;
`;

const barButtonStyle = css`
    position: absolute;
    padding: 0;
    border: 0;
    background: transparent;
    border-radius: 2px;
    pointer-events: none;
    &:focus-visible {
        outline: none;                    /* 仅因下一行立即给出替代焦点意符，方才允许 */
        box-shadow: ${token.focus.ring};
    }
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
 * - 键盘：Tab 进入图表后 ←/→（Home/End）在柱间移动，聚焦即显示该类目
 *   的悬浮提示，Enter/Space 触发 onBarClick；触屏点按柱或类目列固定提示，
 *   点击空白清除。
 * - 系列颜色按分类色板顺序分配（颜色跟随系列，不随过滤重排）。
 */
function BarChart({
    categories,
    series,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    stacked = false,
    animate = true,
    formatValue = defaultFormatValue,
    onBarClick,
    'aria-label': ariaLabel = '柱状图',
    className,
    style,
    ref,
}: BarChartProps) {
    const [active, setActive] = useState<ActiveCategory | null>(null);
    /** 指针在画布包装层内的坐标，驱动悬浮提示跟随鼠标；无指针（键盘 / 触屏）时提示锚定类目列 */
    const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
    /** roving tabindex：当前可 Tab 进入的柱按钮下标 */
    const [focusBarIndex, setFocusBarIndex] = useState(0);

    useEffect(() => {
        if (series.length > MAX_SERIES) {
            console.warn(
                `[rc-bar-chart] 最多渲染 ${MAX_SERIES} 个系列（第 ${MAX_SERIES + 1} 个起忽略）；` +
                '请将长尾合并为「其他」或拆分为多张图。',
            );
        }
    }, [series.length]);

    const visibleSeries = series.length > MAX_SERIES ? series.slice(0, MAX_SERIES) : series;

    // 空输入时 computeLayout 安全返回空 bands / bars；hook 须在 early-return 前无条件调用
    const layout = computeLayout({ width, height, categories, series: visibleSeries, stacked, formatValue });
    const displayBars = useBarTransition(layout.bars, layout.zeroY, categories.length, animate);

    if (categories.length === 0 || visibleSeries.length === 0) {
        return (
            <div ref={ref} className={cx(rootStyle, className)} style={style}>
                <div className={emptyStyle} style={{ inlineSize: width, blockSize: height }}>
                    <Empty />
                </div>
            </div>
        );
    }

    const colors = visibleSeries.map((s, i) => s.color ?? CATEGORICAL_PALETTE[i]);
    const plotHeight = layout.plotBottom - layout.plotTop;

    // 数据更新变短后，事件层可能残留旧下标；渲染前统一失效，避免读出 undefined
    const activeIndex = active !== null && active.index < categories.length ? active.index : null;
    const activeBand = activeIndex !== null ? layout.bands[activeIndex] : null;
    const focusIndex = Math.min(focusBarIndex, Math.max(0, layout.bars.length - 1));

    const hoverCategory = (index: number) => setActive({ index, sticky: false });
    const leaveCategory = () => setActive(prev => (prev !== null && prev.sticky ? prev : null));
    const pinCategory = (index: number) => setActive({ index, sticky: true });

    const onLayerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const total = layout.bars.length;
        if (total === 0) return;
        let next: number;
        switch (e.key) {
            case 'ArrowRight': next = Math.min(focusIndex + 1, total - 1); break;
            case 'ArrowLeft': next = Math.max(focusIndex - 1, 0); break;
            case 'Home': next = 0; break;
            case 'End': next = total - 1; break;
            default: return;
        }
        e.preventDefault();
        e.currentTarget.querySelectorAll('button')[next]?.focus();
    };

    const onLayerBlur = (e: FocusEvent<HTMLDivElement>) => {
        // 焦点在柱按钮间移动时 relatedTarget 仍在层内，仅整体离开图表时清除
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setActive(null);
        }
    };

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
                onPointerMove={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPointer({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onPointerLeave={() => setPointer(null)}
            >
                <div aria-hidden="true">
                    {/* tabIndex -1：绘制层在 aria-hidden 内，不得进入 Tab 流（键盘走覆盖按钮层） */}
                    <Canvas width={width} height={height} tabIndex={-1} onEmptyClick={() => setActive(null)}>
                        {/* 网格线（hairline 实线）与零值基线：中心 +0.5 使 1px 线覆盖整数物理像素行 */}
                        {layout.ticks.map(tick => (
                            <Line
                                key={`grid-${tick.value}`}
                                x1={layout.plotLeft}
                                y1={tick.y + 0.5}
                                x2={layout.plotRight}
                                y2={tick.y + 0.5}
                                color={tick.value === 0 ? CHART_INK.baseline : CHART_INK.gridline}
                                lineWidth={1}
                            />
                        ))}

                        {/*
                         * 轴文本：bitmap 模式（ECharts/zrender 同款）——按 dpr 由浏览器原生
                         * 光栅化并 1:1 物理像素对齐绘制，12px 小字号与 DOM 文本同等清晰。
                         */}
                        {layout.ticks.map(tick => (
                            <Text
                                key={`tick-${tick.value}`}
                                mode="bitmap"
                                x={layout.plotLeft - CHART_METRICS.axisLabelGap}
                                y={tick.y}
                                fontSize={CHART_METRICS.fontSize}
                                fill={CHART_INK.axisLabel}
                                textAlign="right"
                                textBaseline="middle"
                            >
                                {tick.label}
                            </Text>
                        ))}
                        {categories.map((category, i) => (
                            <Text
                                key={`cat-${i}`}
                                mode="bitmap"
                                x={layout.bands[i].centerX}
                                y={layout.plotBottom + 6}
                                fontSize={CHART_METRICS.fontSize}
                                fill={CHART_INK.axisLabel}
                                textAlign="center"
                                textBaseline="top"
                            >
                                {String(category)}
                            </Text>
                        ))}

                        {/* 活动类目水洗背景（hover / 点按固定 / 键盘聚焦共用的反馈，不改变盒尺寸） */}
                        {activeBand !== null && (
                            <Rect
                                x={activeBand.x}
                                y={layout.plotTop}
                                width={activeBand.width}
                                height={plotHeight}
                                fill={CHART_INK.hoverWash}
                                zIndex={1}
                            />
                        )}

                        {/* 类目命中区：比柱子更大的悬停目标；点按（触屏）固定该类目的提示 */}
                        {layout.bands.map((band, i) => (
                            <Rect
                                key={`band-${i}`}
                                x={band.x}
                                y={layout.plotTop}
                                width={band.width}
                                height={plotHeight}
                                fill="transparent"
                                zIndex={2}
                                onMouseEnter={() => hoverCategory(i)}
                                onMouseLeave={leaveCategory}
                                onClick={() => pinCategory(i)}
                            />
                        ))}

                        {/* 柱：数据端 4px 圆角、基线端方角（补丁矩形盖住基线侧圆角）；几何经入场 / 更新动画补间 */}
                        {displayBars.map(bar => {
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
                                        onMouseEnter={() => hoverCategory(bar.categoryIndex)}
                                        onMouseLeave={leaveCategory}
                                        onClick={() => {
                                            pinCategory(bar.categoryIndex);
                                            onBarClick?.({
                                                categoryIndex: bar.categoryIndex,
                                                seriesIndex: bar.seriesIndex,
                                                category: categories[bar.categoryIndex],
                                                seriesName: visibleSeries[bar.seriesIndex].name,
                                                value: bar.value,
                                            });
                                        }}
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
                </div>

                {/* 键盘通道：每根柱一个覆盖按钮，roving tabindex，聚焦即固定该类目的提示 */}
                <div
                    role="group"
                    aria-label={ariaLabel}
                    className={keyboardLayerStyle}
                    onKeyDown={onLayerKeyDown}
                    onBlur={onLayerBlur}
                >
                    {layout.bars.map((bar, k) => (
                        <button
                            key={`focus-${bar.categoryIndex}-${bar.seriesIndex}`}
                            type="button"
                            className={barButtonStyle}
                            /* 柱矩形为数据驱动几何，无法静态成 css 块，走内联定位 */
                            style={{ left: bar.x, top: bar.y, width: bar.width, height: bar.height }}
                            tabIndex={k === focusIndex ? 0 : -1}
                            aria-label={
                                visibleSeries.length > 1
                                    ? `${categories[bar.categoryIndex]} ${visibleSeries[bar.seriesIndex].name} ${formatValue(bar.value)}`
                                    : `${categories[bar.categoryIndex]} ${formatValue(bar.value)}`
                            }
                            onFocus={() => {
                                setFocusBarIndex(k);
                                pinCategory(bar.categoryIndex);
                            }}
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
                    ))}
                </div>

                {/*
                 * 悬浮提示：有指针时跟随（靠近右/下缘向反方向翻转）；键盘聚焦或触屏
                 * 点按固定时锚定在类目列侧边。列出该类目下全部系列。
                 */}
                {activeIndex !== null && activeBand !== null && (pointer !== null || (active?.sticky ?? false)) && (
                    <div
                        className={tooltipStyle}
                        aria-hidden="true"
                        style={pointer !== null
                            ? {
                                left: pointer.x,
                                top: pointer.y,
                                transform: `translate(${
                                    pointer.x > width * 0.6 ? `calc(-100% - ${TOOLTIP_OFFSET}px)` : `${TOOLTIP_OFFSET}px`
                                }, ${
                                    pointer.y > height * 0.6 ? `calc(-100% - ${TOOLTIP_OFFSET}px)` : `${TOOLTIP_OFFSET}px`
                                })`,
                            }
                            : {
                                left: activeBand.centerX > width * 0.6 ? activeBand.x : activeBand.x + activeBand.width,
                                top: layout.plotTop,
                                transform: activeBand.centerX > width * 0.6
                                    ? `translate(calc(-100% - ${TOOLTIP_OFFSET}px), 0)`
                                    : `translate(${TOOLTIP_OFFSET}px, 0)`,
                            }}
                    >
                        <div className={tooltipCategoryStyle}>{categories[activeIndex]}</div>
                        {visibleSeries.map((s, i) => (
                            <div key={s.name} className={tooltipRowStyle}>
                                <span className={tooltipKeyStyle} style={{ backgroundColor: colors[i] }} />
                                <span className={tooltipNameStyle}>{s.name}</span>
                                <span className={tooltipValueStyle}>{formatValue(s.data[activeIndex] ?? 0)}</span>
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
