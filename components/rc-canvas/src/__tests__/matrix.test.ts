import { describe, it, expect } from '@jest/globals';
import {
    makeOrthographicMat3,
    multiplyMat3,
    identityMat3,
    makeTranslateMat3,
    makeRotateMat3,
    makeScaleMat3,
    applyMat3,
    applyMat3Vector,
    invertMat3,
} from '../math/matrix.js';

describe('makeOrthographicMat3', () => {
    it('将左上角 (0,0) 映射到 clip space (-1, 1)', () => {
        const mat = makeOrthographicMat3(100, 200);
        const [cx, cy] = applyMat3(mat, 0, 0);
        expect(cx).toBeCloseTo(-1);
        expect(cy).toBeCloseTo(1);
    });

    it('将右下角 (w,h) 映射到 clip space (1, -1)', () => {
        const mat = makeOrthographicMat3(100, 200);
        const [cx, cy] = applyMat3(mat, 100, 200);
        expect(cx).toBeCloseTo(1);
        expect(cy).toBeCloseTo(-1);
    });

    it('将中心点 (w/2,h/2) 映射到 clip space (0, 0)', () => {
        const mat = makeOrthographicMat3(100, 200);
        const [cx, cy] = applyMat3(mat, 50, 100);
        expect(cx).toBeCloseTo(0);
        expect(cy).toBeCloseTo(0);
    });
});

describe('makeTranslateMat3', () => {
    it('平移点 (0,0) 到 (tx,ty)', () => {
        const mat = makeTranslateMat3(30, 50);
        const [x, y] = applyMat3(mat, 0, 0);
        expect(x).toBeCloseTo(30);
        expect(y).toBeCloseTo(50);
    });

    it('不改变单位矩阵乘法结果', () => {
        const I = identityMat3();
        const T = makeTranslateMat3(10, 20);
        const result = multiplyMat3(I, T);
        expect(result[6]).toBeCloseTo(10);
        expect(result[7]).toBeCloseTo(20);
    });
});

describe('makeRotateMat3', () => {
    it('旋转 90 度：(1,0) → (0,1)', () => {
        const mat = makeRotateMat3(Math.PI / 2);
        const [x, y] = applyMat3(mat, 1, 0);
        expect(x).toBeCloseTo(0);
        expect(y).toBeCloseTo(1);
    });

    it('旋转 180 度：(1,0) → (-1,0)', () => {
        const mat = makeRotateMat3(Math.PI);
        const [x, y] = applyMat3(mat, 1, 0);
        expect(x).toBeCloseTo(-1);
        expect(y).toBeCloseTo(0);
    });
});

describe('makeScaleMat3', () => {
    it('缩放点 (1,1) 到 (sx, sy)', () => {
        const mat = makeScaleMat3(3, 5);
        const [x, y] = applyMat3(mat, 1, 1);
        expect(x).toBeCloseTo(3);
        expect(y).toBeCloseTo(5);
    });
});

describe('multiplyMat3', () => {
    it('平移 × 缩放：先缩放再平移', () => {
        const T = makeTranslateMat3(10, 20);
        const S = makeScaleMat3(2, 3);
        // T × S：先应用 S 再 T（矩阵乘法左乘）
        const mat = multiplyMat3(T, S);
        const [x, y] = applyMat3(mat, 1, 1);
        // scale: (1,1) → (2,3)，then translate: (2,3) → (12,23)
        expect(x).toBeCloseTo(12);
        expect(y).toBeCloseTo(23);
    });

    it('单位矩阵不改变结果', () => {
        const I = identityMat3();
        const T = makeTranslateMat3(5, 7);
        const r1 = multiplyMat3(I, T);
        const r2 = multiplyMat3(T, I);
        for (let i = 0; i < 9; i++) {
            expect(r1[i]).toBeCloseTo(T[i]!);
            expect(r2[i]).toBeCloseTo(T[i]!);
        }
    });
});

describe('identityMat3', () => {
    it('对任意点不做变换', () => {
        const I = identityMat3();
        const [x, y] = applyMat3(I, 42, 17);
        expect(x).toBeCloseTo(42);
        expect(y).toBeCloseTo(17);
    });
});

describe('applyMat3Vector', () => {
    it('变换向量时忽略平移分量', () => {
        const T = makeTranslateMat3(100, 200);
        // 点 (1,1) 经过平移会变为 (101,201)
        const [px, py] = applyMat3(T, 1, 1);
        expect(px).toBeCloseTo(101);
        expect(py).toBeCloseTo(201);
        // 向量 (1,1) 经过平移矩阵应保持不变（不加平移量）
        const [vx, vy] = applyMat3Vector(T, 1, 1);
        expect(vx).toBeCloseTo(1);
        expect(vy).toBeCloseTo(1);
    });

    it('旋转矩阵对向量的变换与对点一致（旋转矩阵无平移）', () => {
        const R = makeRotateMat3(Math.PI / 2);
        const [px, py] = applyMat3(R, 1, 0);
        const [vx, vy] = applyMat3Vector(R, 1, 0);
        expect(vx).toBeCloseTo(px);
        expect(vy).toBeCloseTo(py);
    });

    it('缩放矩阵正确缩放向量', () => {
        const S = makeScaleMat3(3, 2);
        const [vx, vy] = applyMat3Vector(S, 1, 1);
        expect(vx).toBeCloseTo(3);
        expect(vy).toBeCloseTo(2);
    });
});

describe('invertMat3', () => {
    it('单位矩阵的逆是单位矩阵', () => {
        const I = identityMat3();
        const inv = invertMat3(I)!;
        for (let i = 0; i < 9; i++) {
            expect(inv[i]).toBeCloseTo(I[i]!);
        }
    });

    it('平移矩阵的逆：将点映射回原位', () => {
        const T = makeTranslateMat3(30, 50);
        const inv = invertMat3(T)!;
        const [x, y] = applyMat3(inv, 30, 50);
        expect(x).toBeCloseTo(0);
        expect(y).toBeCloseTo(0);
    });

    it('旋转矩阵的逆：将点映射回原位', () => {
        const R = makeRotateMat3(Math.PI / 3);
        const inv = invertMat3(R)!;
        const M = multiplyMat3(R, inv);
        // R × R⁻¹ ≈ 单位矩阵
        const I = identityMat3();
        for (let i = 0; i < 9; i++) {
            expect(M[i]).toBeCloseTo(I[i]!);
        }
    });

    it('缩放矩阵的逆：将点映射回原位', () => {
        const S = makeScaleMat3(4, 2);
        const inv = invertMat3(S)!;
        const [x, y] = applyMat3(inv, 4, 2);
        expect(x).toBeCloseTo(1);
        expect(y).toBeCloseTo(1);
    });

    it('奇异矩阵（行列式为 0）返回 null', () => {
        // 所有元素为 0 的矩阵行列式为 0
        const singular = new Float32Array(9);
        expect(invertMat3(singular)).toBeNull();
    });
});
