/**
 * mat3 工具：全部使用列主序（column-major）Float32Array，
 * 与 GLSL uniformMatrix3fv 期望的内存布局一致。
 *
 * 索引约定：mat[col * 3 + row]
 *   mat[0..2] = 第 0 列，mat[3..5] = 第 1 列，mat[6..8] = 第 2 列
 */

/**
 * 生成像素坐标系 → WebGL clip space 的正交投影矩阵（mat3 列主序）。
 * 像素坐标：左上角 (0,0)，x 向右，y 向下，单位 px。
 * clip space：左下角 (-1,-1)，x 向右，y 向上。
 *
 * 变换：clip_x = 2/w * px - 1，clip_y = -2/h * py + 1（Y 轴翻转）
 */
export function makeOrthographicMat3(width: number, height: number): Float32Array {
    return new Float32Array([
        2 / width,  0,          0,   // 列 0
        0,         -2 / height, 0,   // 列 1
        -1,         1,          1,   // 列 2
    ]);
}

/** mat3 × mat3（列主序），返回新矩阵 */
export function multiplyMat3(a: Float32Array, b: Float32Array): Float32Array {
    const out = new Float32Array(9);
    for (let col = 0; col < 3; col++) {
        for (let row = 0; row < 3; row++) {
            out[col * 3 + row] =
                a[0 * 3 + row] * b[col * 3 + 0] +
                a[1 * 3 + row] * b[col * 3 + 1] +
                a[2 * 3 + row] * b[col * 3 + 2];
        }
    }
    return out;
}

/** 单位矩阵 mat3 */
export function identityMat3(): Float32Array {
    return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
}

/** 平移矩阵 mat3（列主序） */
export function makeTranslateMat3(tx: number, ty: number): Float32Array {
    return new Float32Array([1, 0, 0, 0, 1, 0, tx, ty, 1]);
}

/** 旋转矩阵 mat3（angle 单位：弧度，逆时针为正，列主序） */
export function makeRotateMat3(angle: number): Float32Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Float32Array([c, s, 0, -s, c, 0, 0, 0, 1]);
}

/** 缩放矩阵 mat3（列主序） */
export function makeScaleMat3(sx: number, sy: number): Float32Array {
    return new Float32Array([sx, 0, 0, 0, sy, 0, 0, 0, 1]);
}

/**
 * 将 mat3 应用到 2D 齐次点 (x, y, 1)，返回变换后的 [x, y]。
 * 用于着色器外的坐标变换（如测试验证、CPU 侧碰撞检测等）。
 */
export function applyMat3(mat: Float32Array, x: number, y: number): [number, number] {
    return [
        mat[0] * x + mat[3] * y + mat[6],
        mat[1] * x + mat[4] * y + mat[7],
    ];
}

/**
 * 将 mat3 应用到 2D 向量 (dx, dy)，忽略平移列，只取旋转/缩放部分。
 * 用于坐标系间的位移变换（dx/dy）：点用 applyMat3，向量用此函数。
 */
export function applyMat3Vector(mat: Float32Array, dx: number, dy: number): [number, number] {
    return [
        mat[0] * dx + mat[3] * dy,
        mat[1] * dx + mat[4] * dy,
    ];
}

/**
 * 计算矩形（局部坐标）经 worldMatrix 变换后的世界坐标轴对齐包围盒（AABB）。
 * 将 4 个角点变换到世界坐标后取 min/max，对旋转/缩放情形也正确。
 */
export function computeRectAABB(
    x: number, y: number, w: number, h: number,
    worldMatrix: Float32Array,
): { minX: number; minY: number; maxX: number; maxY: number } {
    const [x0, y0] = applyMat3(worldMatrix, x, y);
    const [x1, y1] = applyMat3(worldMatrix, x + w, y);
    const [x2, y2] = applyMat3(worldMatrix, x, y + h);
    const [x3, y3] = applyMat3(worldMatrix, x + w, y + h);
    return {
        minX: Math.min(x0, x1, x2, x3),
        minY: Math.min(y0, y1, y2, y3),
        maxX: Math.max(x0, x1, x2, x3),
        maxY: Math.max(y0, y1, y2, y3),
    };
}

/**
 * 计算圆（局部坐标）经 worldMatrix 变换后的世界坐标保守 AABB。
 * 以圆心 ± 半径作为保守矩形，再取 4 角变换后的 min/max。
 */
export function computeCircleAABB(
    cx: number, cy: number, r: number,
    worldMatrix: Float32Array,
): { minX: number; minY: number; maxX: number; maxY: number } {
    return computeRectAABB(cx - r, cy - r, r * 2, r * 2, worldMatrix);
}

/**
 * 求 mat3 的逆矩阵（列主序）。行列式为 0（奇异矩阵）时返回 null。
 * 用于 hit-test 坐标逆变换：将 canvas 坐标映射回形状局部坐标系。
 */
export function invertMat3(m: Float32Array): Float32Array | null {
    const a00 = m[0], a10 = m[1], a20 = m[2];
    const a01 = m[3], a11 = m[4], a21 = m[5];
    const a02 = m[6], a12 = m[7], a22 = m[8];

    const det =
        a00 * (a11 * a22 - a21 * a12) -
        a01 * (a10 * a22 - a20 * a12) +
        a02 * (a10 * a21 - a20 * a11);

    if (Math.abs(det) < 1e-10) return null;

    const invDet = 1 / det;
    const out = new Float32Array(9);
    out[0] = (a11 * a22 - a21 * a12) * invDet;
    out[1] = (a20 * a12 - a10 * a22) * invDet;
    out[2] = (a10 * a21 - a20 * a11) * invDet;
    out[3] = (a21 * a02 - a01 * a22) * invDet;
    out[4] = (a00 * a22 - a20 * a02) * invDet;
    out[5] = (a20 * a01 - a00 * a21) * invDet;
    out[6] = (a01 * a12 - a11 * a02) * invDet;
    out[7] = (a10 * a02 - a00 * a12) * invDet;
    out[8] = (a00 * a11 - a10 * a01) * invDet;
    return out;
}
