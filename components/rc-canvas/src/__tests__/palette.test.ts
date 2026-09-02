import { afterEach, describe, expect, it, mock } from '@crab-dev/wake/test';
import {
    DEFAULT_CANVAS_PALETTE,
    SEMANTIC_CANVAS_PALETTE,
    mergeCanvasPalette,
    resolveCanvasColor,
} from '../palette.js';

afterEach(() => {
    mock.restoreAll();
});

describe('Canvas palette', () => {
    it('默认色板逐字保留既有绘制视觉', () => {
        expect(DEFAULT_CANVAS_PALETTE).toEqual({
            foreground: '#000000',
            grid: '#b0b0b0',
            selectionStroke: '#4a9eff',
            selectionFill: 'rgba(74,158,255,0.08)',
            editorBackground: 'white',
            editorBorder: '#4a9eff',
            transformerHandleFill: '#ffffff',
            transformerHandleStroke: '#4a90e2',
            transformerSelectionStroke: '#4a90e2',
            minimapBackground: 'rgba(240,242,245,0.92)',
            minimapViewportStroke: 'rgba(59,130,246,0.8)',
            minimapViewportFill: 'rgba(59,130,246,0.08)',
            minimapBorder: 'rgba(0,0,0,0.08)',
            minimapShadow: '0 2px 10px rgba(0,0,0,0.14)',
            minimapImageFallback: 'rgba(160,160,160,0.7)',
        });
    });

    it('局部覆盖不改变其余旧默认值', () => {
        const palette = mergeCanvasPalette({ foreground: 'CanvasText' });
        expect(palette.foreground).toBe('CanvasText');
        expect(palette.grid).toBe(DEFAULT_CANVAS_PALETTE.grid);
        expect(palette.minimapBorder).toBe(DEFAULT_CANVAS_PALETTE.minimapBorder);
    });

    it('语义色板只暴露 Canvas L3 变量，minimap 边框保留 8% 透明度', () => {
        for (const value of Object.values(SEMANTIC_CANVAS_PALETTE)) {
            expect(value).toContain('var(--canvas-');
        }
        expect(SEMANTIC_CANVAS_PALETTE.minimapBorder).toContain('8%');
    });

    it('选区 chrome 消费 selection 语义角色，不借用 focus 边框', () => {
        expect(SEMANTIC_CANVAS_PALETTE.selectionStroke).toContain(
            '--token-semantic-color-selection-border',
        );
        expect(SEMANTIC_CANVAS_PALETTE.selectionFill).toContain(
            '--token-semantic-color-selection-background',
        );
        expect(SEMANTIC_CANVAS_PALETTE.transformerSelectionStroke).toContain(
            '--token-semantic-color-selection-border',
        );
        expect(SEMANTIC_CANVAS_PALETTE.minimapViewportStroke).toContain(
            '--token-semantic-color-selection-border',
        );
        expect(SEMANTIC_CANVAS_PALETTE.minimapViewportFill).toContain(
            '--token-semantic-color-selection-background',
        );
    });

    it('DOM 不可用时保留 CSS 表达式，供 SSR 安全透传', () => {
        expect(resolveCanvasColor('var(--ink)', null)).toBe('var(--ink)');
    });

    it('普通十六进制输入也规范为 WebGL 可消费的 rgb/rgba', () => {
        const probe = document.createElement('span');
        document.body.appendChild(probe);
        expect(resolveCanvasColor('#123456', probe)).toMatch(/^rgba?\(/);
        probe.remove();
    });

    it('OKLCh 字面量直接归一化，不进入 DOM style/computed-style 桥', () => {
        const style = {
            get color(): string {
                return '';
            },
            set color(_value: string) {
                throw new Error('OKLCh literal should not enter the DOM style bridge');
            },
        };
        const probe = { style } as unknown as HTMLElement;
        const computedStyle = mock.spyOn(globalThis, 'getComputedStyle').implement(() => {
            throw new Error('OKLCh literal should not request computed style');
        });

        expect(resolveCanvasColor('oklch(0.5753 0.1626 255.53)', probe)).toMatch(/^rgba\(/);
        expect(computedStyle).not.toHaveBeenCalled();
    });

    it('在 probe 的 DOM 继承上下文中解析 CSS var 为 rgb/rgba', () => {
        const host = document.createElement('div');
        const probe = document.createElement('span');
        host.style.setProperty('--ink', 'rgb(12, 34, 56)');
        host.appendChild(probe);
        document.body.appendChild(host);
        const computedStyle = mock.spyOn(globalThis, 'getComputedStyle').implement(((element: Element) => ({
            color: (element as HTMLElement).style.color,
            getPropertyValue: (name: string) =>
                element.parentElement?.style.getPropertyValue(name) ?? '',
        })) as unknown as typeof getComputedStyle);

        expect(resolveCanvasColor('var(--ink)', probe)).toMatch(
            /^rgba?\(12,\s*34,\s*56(?:,\s*1)?\)$/,
        );
        const callsAfterFirstResolution = computedStyle.calls.calls.length;
        expect(resolveCanvasColor('var(--ink)', probe)).toMatch(
            /^rgba?\(12,\s*34,\s*56(?:,\s*1)?\)$/,
        );
        expect(computedStyle.calls.calls.length).toBe(callsAfterFirstResolution);
        host.remove();
    });

    it('CSS 变量在 computed-value 阶段缺失时告警并使用字段 fallback', () => {
        const warn = mock.spyOn(console, 'warn').implement(() => { });
        const host = document.createElement('div');
        const probe = document.createElement('span');
        host.style.color = 'rgb(1, 2, 3)';
        host.appendChild(probe);
        document.body.appendChild(host);

        expect(resolveCanvasColor(
            'var(--missing-palette-color)',
            probe,
            '#123456',
            'grid',
        )).toBe('rgba(18, 52, 86, 1)');
        expect(warn).toHaveBeenCalledTimes(1);
        host.remove();
    });

    it('style 赋值失败时开发期告警并使用字段明确 fallback', () => {
        const warn = mock.spyOn(console, 'warn').implement(() => { });
        const probe = document.createElement('span');
        document.body.appendChild(probe);

        const resolved = resolveCanvasColor(
            'definitely-not-a-css-color',
            probe,
            '#123456',
            'grid',
        );
        expect(resolved).toBe('rgba(18, 52, 86, 1)');
        expect(probe.style.color).toBe('');
        expect(warn).toHaveBeenCalledTimes(1);
        probe.remove();
    });

    it('computed style 保留系统色关键字时用 Canvas2D 归一化为 RGBA', () => {
        const pixel = new Uint8ClampedArray([12, 34, 56, 128]);
        const context = {
            clearRect: mock.fn(),
            fillRect: mock.fn(),
            getImageData: mock.fn(() => ({ data: pixel })),
            fillStyle: '',
        };
        const probe = {
            style: { color: '' },
            ownerDocument: {
                createElement: () => ({
                    width: 0,
                    height: 0,
                    getContext: () => context,
                }),
            },
        } as unknown as HTMLElement;
        mock.spyOn(globalThis, 'getComputedStyle').implement(((element: Element) => ({
            color: (element as HTMLElement).style.color.toLowerCase() === 'canvastext'
                ? 'CanvasText'
                : (element as HTMLElement).style.color,
        })) as unknown as typeof getComputedStyle);

        expect(resolveCanvasColor('CanvasText', probe)).toBe(
            `rgba(12, 34, 56, ${128 / 255})`,
        );
    });

    it('Canvas2D 拒绝 computed color 时告警并回退，不把默认黑误判为解析结果', () => {
        const warn = mock.spyOn(console, 'warn').implement(() => { });
        let fillStyle = '';
        const context = {
            clearRect: mock.fn(),
            fillRect: mock.fn(),
            getImageData: mock.fn(() => ({ data: new Uint8ClampedArray([0, 0, 0, 255]) })),
            get fillStyle() {
                return fillStyle;
            },
            set fillStyle(value: string) {
                if (value === DEFAULT_CANVAS_PALETTE.foreground
                    || value === DEFAULT_CANVAS_PALETTE.grid) {
                    fillStyle = value;
                }
            },
        };
        const probe = {
            style: { color: '' },
            ownerDocument: {
                createElement: () => ({
                    width: 0,
                    height: 0,
                    getContext: () => context,
                }),
            },
        } as unknown as HTMLElement;
        mock.spyOn(globalThis, 'getComputedStyle').implement(((element: Element) => ({
            color: (element as HTMLElement).style.color.includes('123456')
                || (element as HTMLElement).style.color.includes('18, 52, 86')
                ? 'rgb(18, 52, 86)'
                : 'CanvasText',
        })) as unknown as typeof getComputedStyle);

        expect(resolveCanvasColor('CanvasText', probe, '#123456', 'foreground')).toBe(
            'rgba(18, 52, 86, 1)',
        );
        expect(context.getImageData).not.toHaveBeenCalled();
        expect(warn).toHaveBeenCalledTimes(1);
    });

    it('测试环境无 Canvas2D 时对现代 computed color 明确告警并回退字段默认', () => {
        const warn = mock.spyOn(console, 'warn').implement(() => { });
        const probe = {
            style: { color: '' },
            ownerDocument: {
                createElement: () => ({
                    width: 0,
                    height: 0,
                    getContext: () => null,
                }),
            },
        } as unknown as HTMLElement;
        mock.spyOn(globalThis, 'getComputedStyle').implement(((element: Element) => ({
            color: (element as HTMLElement).style.color.includes('123456')
                || (element as HTMLElement).style.color.includes('18, 52, 86')
                ? 'rgb(18, 52, 86)'
                : 'color(display-p3 0.5 0.2 0.1)',
        })) as unknown as typeof getComputedStyle);

        expect(resolveCanvasColor(
            'color(display-p3 0.5 0.2 0.1)',
            probe,
            '#123456',
            'grid',
        )).toBe('rgba(18, 52, 86, 1)');
        expect(warn).toHaveBeenCalledTimes(1);
    });
});
