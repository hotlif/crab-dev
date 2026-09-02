import { describe, it, expect } from "@crab-dev/wake/test";
import {
    CATEGORICAL_PALETTE,
    DEFAULT_BAR_CHART_PALETTE,
    MAX_SERIES,
    dimColor,
    mergeBarChartPalette,
    resolveDimmedBarColor,
    resolveReferenceLineColor,
    resolveSeriesColor,
} from '../palette.js';
describe('dimColor', () => {
    it('keep=1 返回原色（不做任何转换）', () => {
        expect(dimColor('#3366ff', 1)).toBe('#3366ff');
    });
    it('向白背景混合为不透明色：keep=0.5 时通道折半靠白', () => {
        expect(dimColor('#0000ff', 0.5)).toBe('rgb(128, 128, 255)');
    });
    it('keep 越小越接近背景白', () => {
        expect(dimColor('#000000', 0.25)).toBe('rgb(191, 191, 191)');
    });
    it('oklch 系列色可解析混合（输出为合法 rgb() 字面量）', () => {
        const out = dimColor(CATEGORICAL_PALETTE[0], 0.45);
        expect(out).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    });
    it('把 canvasBackground 纳入混色与缓存键', () => {
        expect(dimColor('#000000', 0.5, '#ffffff')).toBe('rgb(128, 128, 128)');
        expect(dimColor('#000000', 0.5, '#000000')).toBe('rgb(0, 0, 0)');
    });
    it('CSS 表达式交给 Canvas DOM 桥以 color-mix 解析', () => {
        expect(dimColor('var(--series)', 0.5, 'Canvas')).toBe(
            'color-mix(in oklch, var(--series) 50%, Canvas)',
        );
    });
    it('柱淡化使用 palette.canvasBackground 且背景参与缓存键', () => {
        const light = mergeBarChartPalette({ canvasBackground: '#ffffff' });
        const dark = mergeBarChartPalette({ canvasBackground: '#000000' });
        expect(resolveDimmedBarColor('#ff0000', 0.45, light)).toBe(
            'rgb(255, 139, 139)',
        );
        expect(resolveDimmedBarColor('#ff0000', 0.45, dark)).toBe(
            'rgb(116, 0, 0)',
        );
    });
});
describe('CATEGORICAL_PALETTE', () => {
    it('MAX_SERIES 与色板长度一致', () => {
        expect(MAX_SERIES).toBe(CATEGORICAL_PALETTE.length);
    });
    it('局部 palette 覆盖角色且短 series 自动回退旧色板', () => {
        const palette = mergeBarChartPalette({
            series: ['hotpink'],
            axisLabel: 'CanvasText',
        });
        expect(palette.series[0]).toBe('hotpink');
        expect(palette.series[1]).toBe(CATEGORICAL_PALETTE[1]);
        expect(palette.axisLabel).toBe('CanvasText');
        expect(palette.gridline).toBe(DEFAULT_BAR_CHART_PALETTE.gridline);
    });
    it('显式系列色和参考线色优先于 palette 默认', () => {
        const palette = mergeBarChartPalette({
            series: ['palette-series'],
            axisLabel: 'palette-axis',
        });
        expect(resolveSeriesColor('explicit-series', 0, palette)).toBe(
            'explicit-series',
        );
        expect(resolveSeriesColor(undefined, 0, palette)).toBe('palette-series');
        expect(resolveReferenceLineColor('explicit-line', palette)).toBe(
            'explicit-line',
        );
        expect(resolveReferenceLineColor(undefined, palette)).toBe('palette-axis');
    });
});
