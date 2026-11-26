import type { PieChartDatum } from './types.js';

const START_ANGLE = -Math.PI / 2;
const FULL_CIRCLE = 2 * Math.PI;
const PLOT_PADDING = 8;

export interface PieSlice extends PieChartDatum {
    index: number;
    percentage: number;
    startAngle: number;
    endAngle: number;
}

export interface PieGeometry {
    centerX: number;
    centerY: number;
    outerRadius: number;
    innerRadius: number;
}

export function isPlottableValue(value: number): boolean {
    return Number.isFinite(value) && value > 0;
}

/** 从十二点顺时针分配扇区，保留原始下标供图例、色板与事件使用。 */
export function buildPieSlices(data: readonly PieChartDatum[], hidden?: ReadonlySet<number>): PieSlice[] {
    const visible = data.flatMap((datum, index) =>
        isPlottableValue(datum.value) && !hidden?.has(index) ? [{ ...datum, index }] : [],
    );
    // 先除以最大值，再求和。即使多个有限值相加超过 Number.MAX_VALUE，比重仍可计算。
    const maximum = visible.reduce((largest, item) => Math.max(largest, item.value), 0);
    const total = visible.reduce((sum, item) => sum + item.value / maximum, 0);
    let cumulative = 0;
    let angle = START_ANGLE;
    return visible.map(item => {
        const weight = item.value / maximum;
        const startAngle = angle;
        cumulative += weight;
        angle = START_ANGLE + FULL_CIRCLE * (cumulative / total);
        return { ...item, percentage: 100 * (weight / total), startAngle, endAngle: angle };
    });
}

export function getPieGeometry(width: number, height: number, innerRadiusRatio = 0): PieGeometry {
    const centerX = Number.isFinite(width) ? Math.max(0, width) / 2 : 0;
    const centerY = Number.isFinite(height) ? Math.max(0, height) / 2 : 0;
    const outerRadius = Math.max(0, Math.min(centerX, centerY) - PLOT_PADDING);
    const ratio = Number.isFinite(innerRadiusRatio) ? Math.max(0, Math.min(0.9, innerRadiusRatio)) : 0;
    return { centerX, centerY, outerRadius, innerRadius: outerRadius * ratio };
}
