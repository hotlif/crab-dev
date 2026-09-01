import { describe, it, expect, beforeEach, afterEach, mock, render, screen, fireEvent, act } from "@crab-dev/wake/test/react";
import React from 'react';
import BarChart from '../barChart.js';
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
beforeEach(() => {
    // jsdom 不支持 OffscreenCanvas（Text 字形测量依赖），用最小 mock 代替
    const mockCtx = {
        font: '',
        fillStyle: '',
        fillRect: mock.fn(),
        fillText: mock.fn(),
        measureText: mock.fn(() => ({ width: 40 })),
        getImageData: mock.fn((_x: unknown, _y: unknown, w: number, h: number) => ({
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
    mock.spyOn(console, 'error').implement(() => { });
    mock.spyOn(globalThis, 'requestAnimationFrame').implement(() => 1);
});
afterEach(() => {
    delete (globalThis as Record<string, unknown>).OffscreenCanvas;
    mock.restoreAll();
});
const CATEGORIES = ['一月', '二月', '三月'];
const getDataTable = (container: HTMLElement) => {
    const table = container.querySelector('table');
    if (!table) {
        throw new Error('BarChart data table was not rendered');
    }
    return table;
};
const findTableEntry = (table: HTMLTableElement, selector: string, text: string) => Array.from(table.querySelectorAll(selector)).find(element => element.textContent === text);
describe('BarChart', () => {
    it('以视觉隐藏数据表提供全部数据，caption 默认为「柱状图」', async () => {
        const { container } = await render(<BarChart categories={CATEGORIES} series={[{ name: '销量', data: [10, 20, 30] }]}/>);
        const table = getDataTable(container);
        expect(table.querySelector('caption')?.textContent).toBe('柱状图');
        expect(findTableEntry(table, 'thead th', '销量')).toBeDefined();
        expect(findTableEntry(table, 'tbody th', '二月')).toBeDefined();
        expect(findTableEntry(table, 'tbody td', '30')).toBeDefined();
    });
    it('aria-label 作为数据表 caption', async () => {
        const { container } = await render(<BarChart categories={CATEGORIES} series={[{ name: '销量', data: [1, 2, 3] }]} aria-label="月度销量"/>);
        expect(getDataTable(container).querySelector('caption')?.textContent).toBe('月度销量');
    });
    it('单系列不渲染图例', async () => {
        const { container } = await render(<BarChart categories={CATEGORIES} series={[{ name: '销量', data: [1, 2, 3] }]}/>);
        expect(container.textContent).not.toContain('销量销量');
        // 图例与表格 thead 都会出现系列名；单系列时只应出现表格里那一次
        const occurrences = container.textContent!.split('销量').length - 1;
        expect(occurrences).toBe(1);
    });
    it('多系列渲染图例，系列名同时出现在图例与表头', async () => {
        const { container } = await render(<BarChart categories={CATEGORIES} series={[
            { name: '线上', data: [1, 2, 3] },
            { name: '线下', data: [4, 5, 6] },
        ]}/>);
        const occurrences = container.textContent!.split('线上').length - 1;
        expect(occurrences).toBe(2);
    });
    it('数值经 formatValue 呈现', async () => {
        const { container } = await render(<BarChart categories={['一']} series={[{ name: 's', data: [1500] }]} formatValue={v => `${v / 1000}k`}/>);
        expect(findTableEntry(getDataTable(container), 'tbody td', '1.5k')).toBeDefined();
    });
    it('空数据渲染空态，不渲染画布与数据表', async () => {
        const { container } = await render(<BarChart categories={[]} series={[]}/>);
        expect(container.querySelector('canvas')).toBeNull();
        expect(container.querySelector('table')).toBeNull();
    });
    it('超过 8 个系列时告警并截断', async () => {
        const warnSpy = mock.spyOn(console, 'warn').implement(() => { });
        const series = Array.from({ length: 10 }, (_, i) => ({ name: `系列${i}`, data: [1] }));
        await render(<BarChart categories={['一']} series={series}/>);
        expect(warnSpy).toHaveBeenCalledTimes(1);
        // 表头 = 1 个类目列 + 8 个系列列
        expect(getDataTable(document.body).querySelectorAll('thead th')).toHaveLength(9);
    });
    it('轴文本渲染于 Canvas（bitmap 文本），DOM 中类目仅出现在数据表', async () => {
        const { container } = await render(<BarChart categories={CATEGORIES} series={[{ name: '销量', data: [10, 20, 30] }]}/>);
        expect(findTableEntry(getDataTable(container), 'tbody th', '一月')).toBeDefined();
        const occurrences = container.textContent!.split('一月').length - 1;
        expect(occurrences).toBe(1);
    });
    it('键盘：聚焦柱按钮即显示该类目的提示，方向键在柱间移动', async () => {
        const { container } = await render(<BarChart categories={CATEGORIES} series={[{ name: '销量', data: [10, 20, 30] }]}/>);
        const first = screen.getByRole('button', { name: '一月 10' });
        await act(() => first.focus());
        // 聚焦固定该类目：系列名在表头之外（提示行）出现第二次
        expect(container.textContent!.split('销量').length - 1).toBe(2);
        await fireEvent.keyDown(first, { key: 'ArrowRight' });
        expect(document.activeElement).toBe(screen.getByRole('button', { name: '二月 20' }));
    });
    it('aria-hidden 的绘制层内没有 Tab 停靠点（键盘只经覆盖按钮层进入）', async () => {
        const { container } = await render(<BarChart categories={CATEGORIES} series={[{ name: '销量', data: [10, 20, 30] }]}/>);
        expect(container.querySelector('[aria-hidden="true"] [tabindex="0"]')).toBeNull();
        // roving tabindex：柱按钮中恰有一个 Tab 入口
        expect(container.querySelectorAll('button[tabindex="0"]')).toHaveLength(1);
    });
    it('键盘 Enter（原生 click）触发 onBarClick 并携带完整信息', async () => {
        const onBarClick = mock.fn();
        await render(<BarChart categories={CATEGORIES} series={[{ name: '销量', data: [10, 20, 30] }]} onBarClick={onBarClick}/>);
        await fireEvent.click(screen.getByRole('button', { name: '三月 30' }));
        expect(onBarClick).toHaveBeenCalledWith({
            categoryIndex: 2,
            seriesIndex: 0,
            category: '三月',
            seriesName: '销量',
            value: 30,
        });
    });
    it('数据变短后残留的活动下标被失效，不渲染 undefined', async () => {
        const { container, rerender } = await render(<BarChart categories={CATEGORIES} series={[{ name: '销量', data: [10, 20, 30] }]}/>);
        await act(() => screen.getByRole('button', { name: '三月 30' }).focus());
        await rerender(<BarChart categories={['一月']} series={[{ name: '销量', data: [10] }]}/>);
        expect(container.textContent).not.toContain('undefined');
        // 活动类目已失效：提示不再渲染，系列名仅剩表头一次
        expect(container.textContent!.split('销量').length - 1).toBe(1);
    });
    it('图例点击隐藏系列：布局剔除该系列，数据表保持全量', async () => {
        const { container } = await render(<BarChart categories={CATEGORIES} series={[
            { name: '线上', data: [1, 2, 3] },
            { name: '线下', data: [4, 5, 6] },
        ]}/>);
        // 隐藏前：键盘层 3 类目 × 2 系列 = 6 个柱按钮
        expect(container.querySelectorAll('button[aria-label]')).toHaveLength(6);
        await fireEvent.click(screen.getByRole('button', { name: '线下', pressed: true }));
        expect(screen.getByRole('button', { name: '线下', pressed: false })).toBeDefined();
        expect(container.querySelectorAll('button[aria-label]')).toHaveLength(3);
        // 数据表是等价数据通道，不随视觉过滤
        expect(findTableEntry(getDataTable(container), 'thead th', '线下')).toBeDefined();
    });
    it('隐藏系列后 onBarClick 仍报告原始 seriesIndex 与系列名', async () => {
        const onBarClick = mock.fn();
        await render(<BarChart categories={['一']} series={[
            { name: 'A', data: [1] },
            { name: 'B', data: [2] },
        ]} onBarClick={onBarClick}/>);
        await fireEvent.click(screen.getByRole('button', { name: 'A', pressed: true }));
        await fireEvent.click(screen.getByRole('button', { name: '一 B 2' }));
        expect(onBarClick).toHaveBeenCalledWith(expect.objectContaining({
            seriesIndex: 1,
            seriesName: 'B',
        }));
    });
    it('showValues 与 referenceLines 组合渲染不抛错（绘制层冒烟）', async () => {
        const { container } = await render(<BarChart categories={CATEGORIES} series={[{ name: '销量', data: [10, -20, 30] }]} showValues referenceLines={[{ value: 25, label: '目标' }]} animate={false}/>);
        expect(container.querySelector('canvas')).not.toBeNull();
        // 参考线标签绘制于 Canvas，不进入 DOM 文本
        expect(container.textContent).not.toContain('目标');
    });
    it('animate=false 时直接呈现终态，不依赖动画帧', async () => {
        const { container } = await render(<BarChart categories={CATEGORIES} series={[{ name: '销量', data: [10, 20, 30] }]} animate={false}/>);
        expect(findTableEntry(getDataTable(container), 'tbody td', '30')).toBeDefined();
        expect(screen.getByRole('button', { name: '三月 30' })).toBeDefined();
    });
    it('orientation=horizontal 渲染不抛错，键盘按钮仍逐条生成', async () => {
        const { container } = await render(<BarChart categories={CATEGORIES} series={[{ name: '销量', data: [10, 20, 30] }]} orientation="horizontal" animate={false}/>);
        expect(container.querySelector('canvas')).not.toBeNull();
        expect(container.querySelectorAll('button[aria-label]')).toHaveLength(3);
        expect(screen.getByRole('button', { name: '二月 20' })).toBeDefined();
    });
    it('width="auto" 经 AutoSizer 包裹渲染，首帧回退默认宽度', async () => {
        const { container } = await render(<BarChart categories={CATEGORIES} series={[{ name: '销量', data: [10, 20, 30] }]} width="auto" animate={false}/>);
        // jsdom 中 ResizeObserver 不触发，回退 DEFAULT_WIDTH 仍完整渲染
        expect(container.querySelector('canvas')).not.toBeNull();
        expect(getDataTable(container).querySelector('caption')?.textContent).toBe('柱状图');
    });
    it('width="auto"：首测后按真实宽度重排布局（柱几何跟随容器）', async () => {
        type ObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;
        const observers: ObserverCallback[] = [];
        (globalThis as Record<string, unknown>).ResizeObserver = class {
            constructor(cb: ObserverCallback) { observers.push(cb); }
            observe() { }
            unobserve() { }
            disconnect() { }
        };
        try {
            await render(<BarChart categories={CATEGORIES} series={[{ name: '销量', data: [10, 20, 30] }]} width="auto" animate={false}/>);
            const barButton = () => screen.getByRole('button', { name: '三月 30' });
            const before = barButton().style.left;
            await act(() => {
                observers[0]([{ contentRect: { width: 1200, height: 0 } } as ResizeObserverEntry], {} as ResizeObserver);
            });
            // 1200px 布局下第三类目的柱明显右移（回退宽度 600px 时约在中部）
            expect(barButton().style.left).not.toBe(before);
            expect(parseFloat(barButton().style.left)).toBeGreaterThan(parseFloat(before));
        }
        finally {
            delete (globalThis as Record<string, unknown>).ResizeObserver;
        }
    });
    it('className 透传到容器', async () => {
        const { container } = await render(<BarChart categories={['一']} series={[{ name: 's', data: [1] }]} className="custom-chart"/>);
        expect(container.querySelector('.custom-chart')).not.toBeNull();
    });
});
