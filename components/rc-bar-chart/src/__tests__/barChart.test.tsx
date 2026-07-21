import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { render, cleanup, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import BarChart from '../barChart.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(() => {
    // jsdom 不支持 OffscreenCanvas（Text 字形测量依赖），用最小 mock 代替
    const mockCtx = {
        font: '',
        fillStyle: '',
        fillRect: jest.fn(),
        fillText: jest.fn(),
        measureText: jest.fn(() => ({ width: 40 })),
        getImageData: jest.fn((_x: unknown, _y: unknown, w: number, h: number) => ({
            data: new Uint8Array(w * h * 4).fill(200),
        })),
    };
    (globalThis as Record<string, unknown>).OffscreenCanvas = class {
        width: number;
        height: number;
        constructor(w: number, h: number) { this.width = w; this.height = h; }
        getContext() { return mockCtx; }
    };
    // jsdom 无 WebGL：Canvas 内部对 gl 缺失做优雅降级，仅打印 error，这里静音
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(() => 1);
});

afterEach(() => {
    cleanup();
    delete (globalThis as Record<string, unknown>).OffscreenCanvas;
    jest.restoreAllMocks();
});

const CATEGORIES = ['一月', '二月', '三月'];

describe('BarChart', () => {
    it('以视觉隐藏数据表提供全部数据，caption 默认为「柱状图」', () => {
        render(
            <BarChart
                categories={CATEGORIES}
                series={[{ name: '销量', data: [10, 20, 30] }]}
            />,
        );
        expect(screen.getByRole('table', { name: '柱状图' })).toBeDefined();
        expect(screen.getByRole('columnheader', { name: '销量' })).toBeDefined();
        expect(screen.getByRole('rowheader', { name: '二月' })).toBeDefined();
        expect(screen.getByRole('cell', { name: '30' })).toBeDefined();
    });

    it('aria-label 作为数据表 caption', () => {
        render(
            <BarChart
                categories={CATEGORIES}
                series={[{ name: '销量', data: [1, 2, 3] }]}
                aria-label="月度销量"
            />,
        );
        expect(screen.getByRole('table', { name: '月度销量' })).toBeDefined();
    });

    it('单系列不渲染图例', () => {
        const { container } = render(
            <BarChart
                categories={CATEGORIES}
                series={[{ name: '销量', data: [1, 2, 3] }]}
            />,
        );
        expect(container.textContent).not.toContain('销量销量');
        // 图例与表格 thead 都会出现系列名；单系列时只应出现表格里那一次
        const occurrences = container.textContent!.split('销量').length - 1;
        expect(occurrences).toBe(1);
    });

    it('多系列渲染图例，系列名同时出现在图例与表头', () => {
        const { container } = render(
            <BarChart
                categories={CATEGORIES}
                series={[
                    { name: '线上', data: [1, 2, 3] },
                    { name: '线下', data: [4, 5, 6] },
                ]}
            />,
        );
        const occurrences = container.textContent!.split('线上').length - 1;
        expect(occurrences).toBe(2);
    });

    it('数值经 formatValue 呈现', () => {
        render(
            <BarChart
                categories={['一']}
                series={[{ name: 's', data: [1500] }]}
                formatValue={v => `${v / 1000}k`}
            />,
        );
        expect(screen.getByRole('cell', { name: '1.5k' })).toBeDefined();
    });

    it('空数据渲染空态，不渲染画布与数据表', () => {
        const { container } = render(<BarChart categories={[]} series={[]} />);
        expect(container.querySelector('canvas')).toBeNull();
        expect(container.querySelector('table')).toBeNull();
    });

    it('超过 8 个系列时告警并截断', () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const series = Array.from({ length: 10 }, (_, i) => ({ name: `系列${i}`, data: [1] }));
        render(<BarChart categories={['一']} series={series} />);
        expect(warnSpy).toHaveBeenCalledTimes(1);
        // 表头 = 1 个类目列 + 8 个系列列
        expect(screen.getAllByRole('columnheader')).toHaveLength(9);
    });

    it('轴文本渲染于 Canvas（bitmap 文本），DOM 中类目仅出现在数据表', () => {
        const { container } = render(
            <BarChart
                categories={CATEGORIES}
                series={[{ name: '销量', data: [10, 20, 30] }]}
            />,
        );
        expect(screen.getByRole('rowheader', { name: '一月' })).toBeDefined();
        const occurrences = container.textContent!.split('一月').length - 1;
        expect(occurrences).toBe(1);
    });

    it('键盘：聚焦柱按钮即显示该类目的提示，方向键在柱间移动', () => {
        const { container } = render(
            <BarChart
                categories={CATEGORIES}
                series={[{ name: '销量', data: [10, 20, 30] }]}
            />,
        );
        const first = screen.getByRole('button', { name: '一月 10' });
        act(() => first.focus());
        // 聚焦固定该类目：系列名在表头之外（提示行）出现第二次
        expect(container.textContent!.split('销量').length - 1).toBe(2);

        fireEvent.keyDown(first, { key: 'ArrowRight' });
        expect(document.activeElement).toBe(screen.getByRole('button', { name: '二月 20' }));
    });

    it('aria-hidden 的绘制层内没有 Tab 停靠点（键盘只经覆盖按钮层进入）', () => {
        const { container } = render(
            <BarChart
                categories={CATEGORIES}
                series={[{ name: '销量', data: [10, 20, 30] }]}
            />,
        );
        expect(container.querySelector('[aria-hidden="true"] [tabindex="0"]')).toBeNull();
        // roving tabindex：柱按钮中恰有一个 Tab 入口
        expect(container.querySelectorAll('button[tabindex="0"]')).toHaveLength(1);
    });

    it('键盘 Enter（原生 click）触发 onBarClick 并携带完整信息', () => {
        const onBarClick = jest.fn();
        render(
            <BarChart
                categories={CATEGORIES}
                series={[{ name: '销量', data: [10, 20, 30] }]}
                onBarClick={onBarClick}
            />,
        );
        fireEvent.click(screen.getByRole('button', { name: '三月 30' }));
        expect(onBarClick).toHaveBeenCalledWith({
            categoryIndex: 2,
            seriesIndex: 0,
            category: '三月',
            seriesName: '销量',
            value: 30,
        });
    });

    it('数据变短后残留的活动下标被失效，不渲染 undefined', () => {
        const { container, rerender } = render(
            <BarChart
                categories={CATEGORIES}
                series={[{ name: '销量', data: [10, 20, 30] }]}
            />,
        );
        act(() => screen.getByRole('button', { name: '三月 30' }).focus());
        rerender(<BarChart categories={['一月']} series={[{ name: '销量', data: [10] }]} />);
        expect(container.textContent).not.toContain('undefined');
        // 活动类目已失效：提示不再渲染，系列名仅剩表头一次
        expect(container.textContent!.split('销量').length - 1).toBe(1);
    });

    it('animate=false 时直接呈现终态，不依赖动画帧', () => {
        render(
            <BarChart
                categories={CATEGORIES}
                series={[{ name: '销量', data: [10, 20, 30] }]}
                animate={false}
            />,
        );
        expect(screen.getByRole('cell', { name: '30' })).toBeDefined();
        expect(screen.getByRole('button', { name: '三月 30' })).toBeDefined();
    });

    it('className 透传到容器', () => {
        const { container } = render(
            <BarChart
                categories={['一']}
                series={[{ name: 's', data: [1] }]}
                className="custom-chart"
            />,
        );
        expect(container.querySelector('.custom-chart')).not.toBeNull();
    });
});
