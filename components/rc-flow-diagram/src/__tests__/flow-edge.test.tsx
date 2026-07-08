import { describe, it, expect, jest, afterEach } from '@jest/globals';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import FlowEdge from '../flow-edge.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

interface CapturedLineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    dashLength?: number;
    gapLength?: number;
    flowSpeed?: number;
    dashPhase?: number;
}

// mock rc-canvas：捕获 FlowEdge 渲染出的每条 Line 的 props，验证相位计算
const mockCapturedLines: CapturedLineProps[] = [];

jest.mock('@crab-dev/rc-canvas', () => ({
    Line: (props: CapturedLineProps) => {
        mockCapturedLines.push(props);
        return null;
    },
    Marker: () => null,
}));

afterEach(() => {
    cleanup();
    mockCapturedLines.length = 0;
});

describe('FlowEdge 流动相位（dashPhase 累计弧长）', () => {
    it('L 形折线：各段 dashPhase 为前序段绘制长度之和', () => {
        render(
            <FlowEdge
                points={[{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 50 }]}
                dashLength={6}
                gapLength={4}
                flowSpeed={24}
                arrowEnd={false}
            />,
        );
        expect(mockCapturedLines).toHaveLength(2);
        expect(mockCapturedLines[0].dashPhase).toBeCloseTo(0);
        expect(mockCapturedLines[1].dashPhase).toBeCloseTo(100);
    });

    it('flowSpeed 透传到每一段 Line', () => {
        render(
            <FlowEdge
                points={[{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 50 }, { x: 200, y: 50 }]}
                dashLength={6}
                gapLength={4}
                flowSpeed={-30}
                arrowEnd={false}
            />,
        );
        expect(mockCapturedLines).toHaveLength(3);
        for (const line of mockCapturedLines) {
            expect(line.flowSpeed).toBe(-30);
        }
        expect(mockCapturedLines[2].dashPhase).toBeCloseTo(150);
    });

    it('终点箭头缩进不影响前序段的相位起点', () => {
        render(
            <FlowEdge
                points={[{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 50 }]}
                dashLength={6}
                gapLength={4}
                flowSpeed={24}
                arrowEnd
                arrowSize={10}
            />,
        );
        expect(mockCapturedLines).toHaveLength(2);
        expect(mockCapturedLines[1].dashPhase).toBeCloseTo(100);
        // 末段因箭头缩进变短（50 - 10 * 0.62），但相位起点不变
        expect(mockCapturedLines[1].y2).toBeCloseTo(50 - 6.2);
    });

    it('交叉缺口子段：dashPhase 计入缺口前跳过的弧长，图案穿过缺口连续', () => {
        render(
            <FlowEdge
                points={[{ x: 0, y: 0 }, { x: 100, y: 0 }]}
                dashLength={6}
                gapLength={4}
                flowSpeed={24}
                arrowEnd={false}
                crossings={[{ x: 50, y: 0 }]}
                hopGap={10}
            />,
        );
        expect(mockCapturedLines).toHaveLength(2);
        // 缺口 [45, 55]：子段 1 为 0→45，子段 2 为 55→100
        expect(mockCapturedLines[0].dashPhase).toBeCloseTo(0);
        expect(mockCapturedLines[1].x1).toBeCloseTo(55);
        expect(mockCapturedLines[1].dashPhase).toBeCloseTo(55);
    });

    it('未设置 flowSpeed 时各段不带流动（静态虚线），dashPhase 仍连续', () => {
        render(
            <FlowEdge
                points={[{ x: 0, y: 0 }, { x: 60, y: 0 }, { x: 60, y: 80 }]}
                dashLength={6}
                gapLength={4}
                arrowEnd={false}
            />,
        );
        expect(mockCapturedLines).toHaveLength(2);
        expect(mockCapturedLines[0].flowSpeed).toBeUndefined();
        expect(mockCapturedLines[1].dashPhase).toBeCloseTo(60);
    });
});
