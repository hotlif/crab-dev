import type { Bounds, Transform } from './protocol.js';

export type Matrix = [number, number, number, number, number, number];
export const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0];
export function multiply(a: Matrix, b: Matrix): Matrix {
    return [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
        a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
        a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]];
}
export function inverse(m: Matrix): Matrix {
    const d = m[0] * m[3] - m[1] * m[2];
    if (Math.abs(d) < 1e-10) throw new Error('无法变换退化的 PDF 对象');
    return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d,
        (m[2] * m[5] - m[3] * m[4]) / d, (m[1] * m[4] - m[0] * m[5]) / d];
}
export function point(m: Matrix, x: number, y: number): [number, number] {
    return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}
export function pageMatrix(box: [number, number, number, number], rotation: number): Matrix {
    const [left, bottom, right, top] = box;
    switch (rotation) {
        case 1: return [0, 1, 1, 0, -bottom, -left];
        case 2: return [-1, 0, 0, 1, right, -bottom];
        case 3: return [0, -1, -1, 0, top, right];
        default: return [1, 0, 0, -1, -left, top];
    }
}
export function transformBounds(m: Matrix, left: number, bottom: number, right: number, top: number): Bounds {
    const points = [point(m, left, bottom), point(m, right, bottom), point(m, left, top), point(m, right, top)];
    const xs = points.map(p => p[0]);
    const ys = points.map(p => p[1]);
    return { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
}
/** 变换当前可见包围盒；rotation 为相对当前对象的顺时针弧度。 */
export function objectDelta(from: Bounds, to: Transform): Matrix {
    const c = Math.cos(to.rotation), s = Math.sin(to.rotation);
    const scale: Matrix = [to.width / from.width, 0, 0, to.height / from.height, 0, 0];
    return multiply([1, 0, 0, 1, to.x + to.width / 2, to.y + to.height / 2],
        multiply([c, s, -s, c, 0, 0], multiply(scale, [1, 0, 0, 1, -from.x - from.width / 2, -from.y - from.height / 2])));
}
