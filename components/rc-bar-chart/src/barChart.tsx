import { Fragment, useEffect, useState } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';
import { css, cx } from '@linaria/core';
import { Canvas, Rect, Line, Text } from '@crab-dev/rc-canvas';
import AutoSizer from '@crab-dev/rc-auto-sizer';
import Empty from '@crab-dev/rc-empty';
import token from './token.js';
import { CATEGORICAL_PALETTE, CHART_INK, MAX_SERIES, dimColor } from './palette.js';
import { computeLayout, measureLabelWidth, CHART_METRICS } from './layout.js';
import { useBarTransition } from './hooks/useBarTransition.js';
import { useCategoryDim } from './hooks/useCategoryDim.js';
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

/* 图例项是切换系列显隐的按钮：光标 / hover 背景 / 焦点环齐备 */
const legendItemStyle = css`
    display: inline-flex;
    align-items: center;
    gap: ${token.legend['swatch-gap']};
    padding: 2px 8px;
    border: 0;
    background: transparent;
    border-radius: ${token.legend.item.radius};
    font-size: ${token.legend.label.font.size};
    color: ${token.legend.label.color};
    cursor: pointer;
    transition: ${token.legend.item.transition};
    &:hover {
        background-color: ${token.legend.item['color-hover']};
    }
    &:focus-visible {
        outline: none;                    /* 仅因下一行立即给出替代焦点意符，方才允许 */
        box-shadow: ${token.focus.ring};
    }
    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

/* 隐藏中的系列：整体减淡，保留位置与可点性（禁用而非消失） */
const legendItemHiddenStyle = css`
    opacity: ${token.legend.item['opacity-hidden']};
`;

const legendSwatchStyle = css`
    inline-size: ${token.legend['swatch-size']};
    block-size: ${token.legend['swatch-size']};
    border-radius: 2px;
    flex-shrink: 0;
`;

const legendSwatchHiddenStyle = css`
    filter: grayscale(1);
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

type InnerProps = Omit<BarChartProps, 'width'> & {
    width: number;
    /** width="auto" 首测完成前为 false：入场动画待命，测定后以真实宽度启动 */
    widthReady?: boolean;
};

/** 图表主体：width 已解析为确定像素值（'auto' 由外壳经 AutoSizer 解析） */
function BarChartInner({
    categories,
    series,
    width,
    height = DEFAULT_HEIGHT,
    stacked = false,
    orientation = 'vertical',
    animate = true,
    showValues = false,
    referenceLines,
    formatValue = defaultFormatValue,
    onBarClick,
    'aria-label': ariaLabel = '柱状图',
    className,
    style,
    ref,
    widthReady = true,
}: InnerProps) {
    const [active, setActive] = useState<ActiveCategory | null>(null);
    /** 指针在画布包装层内的坐标，驱动悬浮提示跟随鼠标；无指针（键盘 / 触屏）时提示锚定类目列 */
    const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
    /** roving tabindex：当前可 Tab 进入的柱按钮下标 */
    const [focusBarIndex, setFocusBarIndex] = useState(0);
    /** 图例点击隐藏的系列（visibleSeries 下标）；隐藏系列不参与布局与提示，数据表保持全量 */
    const [hiddenSeries, setHiddenSeries] = useState<ReadonlySet<number>>(new Set());

    useEffect(() => {
        if (series.length > MAX_SERIES) {
            console.warn(
                `[rc-bar-chart] 最多渲染 ${MAX_SERIES} 个系列（第 ${MAX_SERIES + 1} 个起忽略）；` +
                '请将长尾合并为「其他」或拆分为多张图。',
            );
        }
    }, [series.length]);

    const visibleSeries = series.length > MAX_SERIES ? series.slice(0, MAX_SERIES) : series;
    const horizontal = orientation === 'horizontal';

    // 图例过滤后的系列；bars 的 seriesIndex 是 shown 下标，经 shownIndices 映射回原始下标
    const shownIndices = visibleSeries.map((_, i) => i).filter(i => !hiddenSeries.has(i));
    const shownSeries = shownIndices.map(i => visibleSeries[i]);

    // 空输入时 computeLayout 安全返回空 bands / bars；hook 须在 early-return 前无条件调用
    const layout = computeLayout({
        width,
        height,
        categories,
        series: shownSeries,
        stacked,
        formatValue,
        orientation,
        referenceValues: referenceLines?.map(r => r.value) ?? [],
    });
    const displayBars = useBarTransition(layout.bars, {
        zeroPos: layout.zeroPos,
        orientation,
        categoryCount: categories.length,
        animate,
        width,
        height,
        ready: widthReady,
    });

    // 数据更新变短后，事件层可能残留旧下标；渲染前统一失效，避免读出 undefined
    const activeIndex = active !== null && active.index < categories.length ? active.index : null;
    const dims = useCategoryDim(activeIndex, categories.length, animate);

    if (categories.length === 0 || visibleSeries.length === 0) {
        return (
            <div ref={ref} className={cx(rootStyle, className)} style={style}>
                <div className={emptyStyle} style={{ inlineSize: width, blockSize: height }}>
                    <Empty />
                </div>
            </div>
        );
    }

    // 颜色按原始系列下标分配：隐藏系列不引起其余系列换色（颜色跟随系列）
    const colors = visibleSeries.map((s, i) => s.color ?? CATEGORICAL_PALETTE[i]);
    const plotHeight = layout.plotBottom - layout.plotTop;
    const plotWidth = layout.plotRight - layout.plotLeft;

    const activeBand = activeIndex !== null ? layout.bands[activeIndex] : null;
    const focusIndex = Math.min(focusBarIndex, Math.max(0, layout.bars.length - 1));

    const hoverCategory = (index: number) => setActive({ index, sticky: false });
    const leaveCategory = () => setActive(prev => (prev !== null && prev.sticky ? prev : null));
    const pinCategory = (index: number) => setActive({ index, sticky: true });

    const barClickInfo = (bar: { categoryIndex: number; seriesIndex: number; value: number }) => ({
        categoryIndex: bar.categoryIndex,
        seriesIndex: shownIndices[bar.seriesIndex],
        category: categories[bar.categoryIndex],
        seriesName: visibleSeries[shownIndices[bar.seriesIndex]].name,
        value: bar.value,
    });

    const onLayerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const total = layout.bars.length;
        if (total === 0) return;
        // 方向键沿类目轴推进：vertical 主用 ←/→，horizontal 主用 ↑/↓（与视觉布局一致）
        const forward = horizontal ? 'ArrowDown' : 'ArrowRight';
        const backward = horizontal ? 'ArrowUp' : 'ArrowLeft';
        let next: number;
        switch (e.key) {
            case forward: next = Math.min(focusIndex + 1, total - 1); break;
            case backward: next = Math.max(focusIndex - 1, 0); break;
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
                <div className={legendStyle} role="group" aria-label="图例">
                    {visibleSeries.map((s, i) => {
                        const hidden = hiddenSeries.has(i);
                        return (
                            <button
                                key={s.name}
                                type="button"
                                className={cx(legendItemStyle, hidden && legendItemHiddenStyle)}
                                aria-pressed={!hidden}
                                onClick={() => setHiddenSeries(prev => {
                                    const next = new Set(prev);
                                    if (next.has(i)) next.delete(i);
                                    else next.add(i);
                                    return next;
                                })}
                            >
                                {/* 系列色为数据驱动值，无法静态成 css 块，走内联传递 */}
                                <span
                                    className={cx(legendSwatchStyle, hidden && legendSwatchHiddenStyle)}
                                    style={{ backgroundColor: colors[i] }}
                                />
                                {s.name}
                            </button>
                        );
                    })}
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
                                x1={horizontal ? tick.pos + 0.5 : layout.plotLeft}
                                y1={horizontal ? layout.plotTop : tick.pos + 0.5}
                                x2={horizontal ? tick.pos + 0.5 : layout.plotRight}
                                y2={horizontal ? layout.plotBottom : tick.pos + 0.5}
                                color={tick.value === 0 ? CHART_INK.baseline : CHART_INK.gridline}
                                lineWidth={1}
                            />
                        ))}

                        {/*
                         * 轴文本：bitmap 模式（ECharts/zrender 同款）——按 dpr 由浏览器原生
                         * 光栅化并 1:1 物理像素对齐绘制，12px 小字号与 DOM 文本同等清晰。
                         * 值轴刻度：vertical 在左缘，horizontal 在底缘。
                         */}
                        {layout.ticks.map(tick => (
                            <Text
                                key={`tick-${tick.value}`}
                                mode="bitmap"
                                x={horizontal ? tick.pos : layout.plotLeft - CHART_METRICS.axisLabelGap}
                                y={horizontal ? layout.plotBottom + 6 : tick.pos}
                                fontSize={CHART_METRICS.fontSize}
                                fill={CHART_INK.axisLabel}
                                textAlign={horizontal ? 'center' : 'right'}
                                textBaseline={horizontal ? 'top' : 'middle'}
                            >
                                {tick.label}
                            </Text>
                        ))}
                        {/* 类目标签：vertical 在底缘，horizontal 在左缘 */}
                        {categories.map((category, i) => (
                            <Text
                                key={`cat-${i}`}
                                mode="bitmap"
                                x={horizontal ? layout.plotLeft - CHART_METRICS.axisLabelGap : layout.bands[i].center}
                                y={horizontal ? layout.bands[i].center : layout.plotBottom + 6}
                                fontSize={CHART_METRICS.fontSize}
                                fill={CHART_INK.axisLabel}
                                textAlign={horizontal ? 'right' : 'center'}
                                textBaseline={horizontal ? 'middle' : 'top'}
                            >
                                {String(category)}
                            </Text>
                        ))}

                        {/* 类目命中区：比柱子更大的悬停目标；点按（触屏）固定该类目的提示 */}
                        {layout.bands.map((band, i) => (
                            <Rect
                                key={`band-${i}`}
                                x={horizontal ? layout.plotLeft : band.start}
                                y={horizontal ? band.start : layout.plotTop}
                                width={horizontal ? plotWidth : band.size}
                                height={horizontal ? band.size : plotHeight}
                                fill="transparent"
                                zIndex={2}
                                onMouseEnter={() => hoverCategory(i)}
                                onMouseLeave={leaveCategory}
                                onClick={() => pinCategory(i)}
                            />
                        ))}

                        {/*
                         * 柱：数据端 4px 圆角、基线端方角（补丁矩形盖住基线侧圆角）。
                         * 几何经入场 / 更新动画补间；非活动类目经 dims 淡化形成聚焦层次。
                         */}
                        {displayBars.map(bar => {
                            const radius = bar.dataEnd === null
                                ? 0
                                : Math.min(CHART_METRICS.barRadius, bar.width / 2, bar.height / 2);
                            const dim = dims[bar.categoryIndex] ?? 1;
                            // 淡化走不透明混色而非 opacity：柱与圆角补丁的重叠区不会叠出深色条带
                            const color = dimColor(colors[shownIndices[bar.seriesIndex]], dim);
                            // 基线端补丁矩形的位置：盖住与数据端相对一侧的圆角
                            const patch = radius <= 0
                                ? null
                                : bar.dataEnd === 'top' || bar.dataEnd === 'bottom'
                                    ? {
                                        x: bar.x,
                                        y: bar.dataEnd === 'top' ? bar.y + bar.height - radius : bar.y,
                                        width: bar.width,
                                        height: radius,
                                    }
                                    : {
                                        x: bar.dataEnd === 'right' ? bar.x : bar.x + bar.width - radius,
                                        y: bar.y,
                                        width: radius,
                                        height: bar.height,
                                    };
                            return (
                                <Fragment key={`bar-${bar.categoryIndex}-${bar.seriesIndex}`}>
                                    <Rect
                                        x={bar.x}
                                        y={bar.y}
                                        width={bar.width}
                                        height={bar.height}
                                        radius={radius}
                                        fill={color}
                                        zIndex={3}
                                        cursor={onBarClick ? 'pointer' : undefined}
                                        onMouseEnter={() => hoverCategory(bar.categoryIndex)}
                                        onMouseLeave={leaveCategory}
                                        onClick={() => {
                                            pinCategory(bar.categoryIndex);
                                            onBarClick?.(barClickInfo(bar));
                                        }}
                                    />
                                    {patch !== null && (
                                        <Rect
                                            x={patch.x}
                                            y={patch.y}
                                            width={patch.width}
                                            height={patch.height}
                                            fill={color}
                                            zIndex={3.1}
                                        />
                                    )}
                                </Fragment>
                            );
                        })}

                        {/* 数值标签（分组）：柱数据端外侧；放不下会叠压 / 溢出的自动省略 */}
                        {showValues && !stacked && displayBars.map(bar => {
                            const text = formatValue(bar.value);
                            const labelW = measureLabelWidth(text, CHART_METRICS.valueLabelSize);
                            if (horizontal) {
                                const atRight = bar.dataEnd !== 'left';
                                // 预算 = 条端到画布边缘的空间，溢出画布则省略
                                const budget = atRight
                                    ? width - (bar.x + bar.width) - CHART_METRICS.valueLabelGap
                                    : bar.x - CHART_METRICS.valueLabelGap;
                                if (labelW > budget) return null;
                                return (
                                    <Text
                                        key={`val-${bar.categoryIndex}-${bar.seriesIndex}`}
                                        mode="bitmap"
                                        x={atRight
                                            ? bar.x + bar.width + CHART_METRICS.valueLabelGap
                                            : bar.x - CHART_METRICS.valueLabelGap}
                                        y={bar.y + bar.height / 2}
                                        fontSize={CHART_METRICS.valueLabelSize}
                                        fill={CHART_INK.axisLabel}
                                        opacity={dims[bar.categoryIndex] ?? 1}
                                        textAlign={atRight ? 'left' : 'right'}
                                        textBaseline="middle"
                                        zIndex={4}
                                    >
                                        {text}
                                    </Text>
                                );
                            }
                            const budget = shownSeries.length > 1
                                ? bar.width + CHART_METRICS.barGap
                                : layout.bands[bar.categoryIndex].size;
                            if (labelW > budget) return null;
                            const atTop = bar.dataEnd !== 'bottom';
                            return (
                                <Text
                                    key={`val-${bar.categoryIndex}-${bar.seriesIndex}`}
                                    mode="bitmap"
                                    x={bar.x + bar.width / 2}
                                    y={atTop
                                        ? bar.y - CHART_METRICS.valueLabelGap
                                        : bar.y + bar.height + CHART_METRICS.valueLabelGap}
                                    fontSize={CHART_METRICS.valueLabelSize}
                                    fill={CHART_INK.axisLabel}
                                    opacity={dims[bar.categoryIndex] ?? 1}
                                    textAlign="center"
                                    textBaseline={atTop ? 'bottom' : 'top'}
                                    zIndex={4}
                                >
                                    {text}
                                </Text>
                            );
                        })}

                        {/* 数值标签（堆叠）：逐段标注会叠压，改标各类目的正 / 负向合计 */}
                        {showValues && stacked && categories.map((_, i) => {
                            const segs = displayBars.filter(b => b.categoryIndex === i);
                            if (segs.length === 0) return null;
                            let posSum = 0;
                            let negSum = 0;
                            for (const s of shownSeries) {
                                const v = s.data[i] ?? 0;
                                if (v > 0) posSum += v;
                                else negSum += v;
                            }
                            // 值增长方向的最外端：vertical 为最小 y / horizontal 为最大 x+width
                            const posEdge = horizontal
                                ? Math.max(...segs.map(b => b.x + b.width))
                                : Math.min(...segs.map(b => b.y));
                            const negEdge = horizontal
                                ? Math.min(...segs.map(b => b.x))
                                : Math.max(...segs.map(b => b.y + b.height));
                            const gap = CHART_METRICS.valueLabelGap;
                            const entries: { key: string; text: string; positive: boolean }[] = [];
                            if (posSum > 0) entries.push({ key: `sum-pos-${i}`, text: formatValue(posSum), positive: true });
                            if (negSum < 0) entries.push({ key: `sum-neg-${i}`, text: formatValue(negSum), positive: false });
                            return entries
                                .filter(l => {
                                    const labelW = measureLabelWidth(l.text, CHART_METRICS.valueLabelSize);
                                    if (!horizontal) return labelW <= layout.bands[i].size;
                                    return l.positive ? labelW <= width - posEdge - gap : labelW <= negEdge - gap;
                                })
                                .map(l => (
                                    <Text
                                        key={l.key}
                                        mode="bitmap"
                                        x={horizontal
                                            ? (l.positive ? posEdge + gap : negEdge - gap)
                                            : layout.bands[i].center}
                                        y={horizontal
                                            ? layout.bands[i].center
                                            : (l.positive ? posEdge - gap : negEdge + gap)}
                                        fontSize={CHART_METRICS.valueLabelSize}
                                        fill={CHART_INK.axisLabel}
                                        opacity={dims[i] ?? 1}
                                        textAlign={horizontal ? (l.positive ? 'left' : 'right') : 'center'}
                                        textBaseline={horizontal ? 'middle' : (l.positive ? 'bottom' : 'top')}
                                        zIndex={4}
                                    >
                                        {l.text}
                                    </Text>
                                ));
                        })}

                        {/* 参考线：虚线 + 标签，值域已并入刻度计算，保证始终落在图内 */}
                        {referenceLines?.map((refLine, i) => {
                            const pos = layout.referencePositions[i];
                            const color = refLine.color ?? CHART_INK.axisLabel;
                            const text = refLine.label ?? formatValue(refLine.value);
                            // 标签位置：vertical 在线右端上方；horizontal 在线顶端侧旁（靠右缘时翻到左侧）
                            const flip = horizontal && pos > width * 0.6;
                            return (
                                <Fragment key={`ref-${i}`}>
                                    <Line
                                        x1={horizontal ? pos + 0.5 : layout.plotLeft}
                                        y1={horizontal ? layout.plotTop : pos + 0.5}
                                        x2={horizontal ? pos + 0.5 : layout.plotRight}
                                        y2={horizontal ? layout.plotBottom : pos + 0.5}
                                        color={color}
                                        lineWidth={1}
                                        dashLength={4}
                                        gapLength={4}
                                        zIndex={4}
                                    />
                                    <Text
                                        mode="bitmap"
                                        x={horizontal
                                            ? (flip ? pos - CHART_METRICS.valueLabelGap : pos + CHART_METRICS.valueLabelGap)
                                            : layout.plotRight}
                                        y={horizontal ? layout.plotTop : pos - CHART_METRICS.valueLabelGap}
                                        fontSize={CHART_METRICS.valueLabelSize}
                                        fill={color}
                                        textAlign={horizontal ? (flip ? 'right' : 'left') : 'right'}
                                        textBaseline={horizontal ? 'top' : 'bottom'}
                                        zIndex={4}
                                    >
                                        {text}
                                    </Text>
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
                                    ? `${categories[bar.categoryIndex]} ${visibleSeries[shownIndices[bar.seriesIndex]].name} ${formatValue(bar.value)}`
                                    : `${categories[bar.categoryIndex]} ${formatValue(bar.value)}`
                            }
                            onFocus={() => {
                                setFocusBarIndex(k);
                                pinCategory(bar.categoryIndex);
                            }}
                            onClick={onBarClick ? () => onBarClick(barClickInfo(bar)) : undefined}
                        />
                    ))}
                </div>

                {/*
                 * 悬浮提示：有指针时跟随（靠近右/下缘向反方向翻转）；键盘聚焦或触屏
                 * 点按固定时锚定在类目列侧边。列出该类目下全部显示中的系列。
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
                            : horizontal
                                ? {
                                    left: layout.plotLeft + TOOLTIP_OFFSET,
                                    top: activeBand.center > height * 0.6
                                        ? activeBand.start
                                        : activeBand.start + activeBand.size,
                                    transform: activeBand.center > height * 0.6
                                        ? `translate(0, calc(-100% - ${TOOLTIP_OFFSET}px))`
                                        : `translate(0, ${TOOLTIP_OFFSET}px)`,
                                }
                                : {
                                    left: activeBand.center > width * 0.6
                                        ? activeBand.start
                                        : activeBand.start + activeBand.size,
                                    top: layout.plotTop,
                                    transform: activeBand.center > width * 0.6
                                        ? `translate(calc(-100% - ${TOOLTIP_OFFSET}px), 0)`
                                        : `translate(${TOOLTIP_OFFSET}px, 0)`,
                                }}
                    >
                        <div className={tooltipCategoryStyle}>{categories[activeIndex]}</div>
                        {/* 只列当前显示中的系列，与画面所见一致 */}
                        {shownIndices.map(si => (
                            <div key={visibleSeries[si].name} className={tooltipRowStyle}>
                                <span className={tooltipKeyStyle} style={{ backgroundColor: colors[si] }} />
                                <span className={tooltipNameStyle}>{visibleSeries[si].name}</span>
                                <span className={tooltipValueStyle}>
                                    {formatValue(visibleSeries[si].data[activeIndex] ?? 0)}
                                </span>
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

/**
 * 柱状图。基于 rc-canvas（WebGL）绘制，支持单系列、多系列分组与堆叠，
 * 纵向柱状与横向条形两种轴向，入场 / 更新动画，数值标签与参考线。
 *
 * - 绘制层（柱 / 网格 / 轴文本）渲染在 Canvas 中，对辅助技术隐藏；
 *   完整数据以视觉隐藏的 `<table>` 提供（悬浮提示只增强、不守门）。
 * - 键盘：Tab 进入图表后方向键（Home/End）在柱间移动，聚焦即显示该类目
 *   的悬浮提示，Enter/Space 触发 onBarClick；触屏点按柱或类目列固定提示，
 *   点击空白清除。
 * - `width="auto"` 时经 `rc-auto-sizer` 跟随父容器宽度：容器尺寸变化即时
 *   同步布局（不触发补间动画），入场动画在首次测量后以真实宽度启动。
 * - 系列颜色按分类色板顺序分配（颜色跟随系列，不随过滤重排）。
 */
function BarChart(props: BarChartProps) {
    const { width = DEFAULT_WIDTH, ...rest } = props;
    if (width === 'auto') {
        const { className, style, ...inner } = rest;
        return (
            <AutoSizer
                disableHeight
                className={className}
                /* 覆盖 AutoSizer 的 height:100% / overflow:hidden：高度由图表内容撑开，悬浮提示不被裁剪 */
                style={{ blockSize: 'auto', overflow: 'visible', ...style }}
            >
                {/* 不传 defaultWidth（保持 0）以识别「尚未测量」：首测前 widthReady=false，
                    入场动画待命，避免在回退宽度下启动后被真实宽度打断而横向漂移 */}
                {({ width: measured }) => (
                    <BarChartInner
                        {...inner}
                        width={measured > 0 ? measured : DEFAULT_WIDTH}
                        widthReady={measured > 0}
                    />
                )}
            </AutoSizer>
        );
    }
    return <BarChartInner {...rest} width={width} />;
}

export default BarChart;
