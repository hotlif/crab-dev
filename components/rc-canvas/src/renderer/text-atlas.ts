/** 4x 超采样渲染，SDF 在超采样空间中的扩展半径（px） */
const OVERSAMPLE = 4;
const SDF_SPREAD = 8;

export interface GlyphInfo {
    /** TextureCache 中的唯一 key */
    key: string;
    /** 纹理实际像素宽度（传给 uploadGlyph / texImage2D） */
    width: number;
    /** 纹理实际像素高度（传给 uploadGlyph / texImage2D） */
    height: number;
    /** 在世界坐标中的显示宽度（world px，传给 DrawCommand.glyphWidth） */
    worldWidth: number;
    /** 在世界坐标中的显示高度（world px，传给 DrawCommand.glyphHeight） */
    worldHeight: number;
    /** R8 单通道 SDF 数据：0.5(128)=边缘，>0.5=内部，<0.5=外部 */
    data: Uint8Array;
}

// ─── EDT（欧几里得距离变换，Felzenszwalb-Huttenlocher 算法）────────────────

const INF = 1e20;

/** 1D 欧几里得距离变换：将 f[i] 替换为 min_j(f[j] + (i-j)²) */
function edt1d(
    f: Float64Array,   // 输入，长度 n
    d: Float64Array,   // 输出，长度 n
    v: Int32Array,     // 工作数组，长度 n
    z: Float64Array,   // 工作数组，长度 n+1
    n: number,
): void {
    v[0] = 0;
    z[0] = -INF;
    z[1] = INF;
    for (let q = 1, k = 0; q < n; q++) {
        const fq = f[q];
        let s: number;
        do {
            const r = v[k];
            s = (fq + q * q - f[r] - r * r) / (2 * (q - r));
        } while (s <= z[k--]);
        k += 2;
        v[k] = q;
        z[k] = s;
        z[k + 1] = INF;
    }
    for (let q = 0, k = 0; q < n; q++) {
        while (z[k + 1] < q) k++;
        const r = v[k];
        const qr = q - r;
        d[q] = qr * qr + f[r];
    }
}

/** 2D 欧几里得距离变换，原地修改 grid（值为距离平方） */
function edt2d(
    grid: Float64Array,
    width: number,
    height: number,
): void {
    const maxDim = Math.max(width, height);
    const f = new Float64Array(maxDim);
    const d = new Float64Array(maxDim);
    const v = new Int32Array(maxDim);
    const z = new Float64Array(maxDim + 1);

    for (let y = 0; y < height; y++) {
        const off = y * width;
        for (let x = 0; x < width; x++) f[x] = grid[off + x];
        edt1d(f, d, v, z, width);
        for (let x = 0; x < width; x++) grid[off + x] = d[x];
    }
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) f[y] = grid[y * width + x];
        edt1d(f, d, v, z, height);
        for (let y = 0; y < height; y++) grid[y * width + x] = d[y];
    }
}

/**
 * 从超采样 alpha 图计算 SDF，结果归一化为 R8 [0, 255]。
 * 128 = 边缘，> 128 = 内部，< 128 = 外部。
 * spread: SDF 扩展半径（超采样空间 px），超出范围的值 clamp 到 0/255。
 */
function computeSDF(
    alpha: Uint8ClampedArray,
    width: number,
    height: number,
    spread: number,
): Uint8Array {
    const n = width * height;
    const inside = new Float64Array(n);
    const outside = new Float64Array(n);

    for (let i = 0; i < n; i++) {
        const a = alpha[i * 4];  // RGBA，取 R 通道（Canvas 2D 灰度输出 R=G=B）
        inside[i]  = a > 127 ? 0   : INF;
        outside[i] = a > 127 ? INF : 0;
    }

    edt2d(inside, width, height);
    edt2d(outside, width, height);

    const output = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
        const dIn  = Math.sqrt(inside[i]);
        const dOut = Math.sqrt(outside[i]);
        const sdf  = dOut - dIn;  // 正=内部，负=外部
        const normalized = Math.max(0, Math.min(1, 0.5 + 0.5 * sdf / spread));
        output[i] = Math.round(normalized * 255);
    }
    return output;
}

// ─── 公开 API ─────────────────────────────────────────────────────────────────

/**
 * 以 OVERSAMPLE 倍超采样渲染文字，计算 SDF 纹理，返回 R8 格式数据。
 * SDF 保证在任意缩放级别下，配合着色器 smoothstep 都能呈现清晰边缘。
 */
export function generateGlyph(
    text: string,
    fontSize: number,
    fontFamily: string,
): GlyphInfo {
    const key = `${text}\x00${fontSize}\x00${fontFamily}`;

    const scaledSize = fontSize * OVERSAMPLE;
    const fontStr = `${scaledSize}px ${fontFamily}`;

    // 测量超采样尺寸的字形宽度
    const probe = new OffscreenCanvas(1, 1);
    const probeCtx = probe.getContext('2d')!;
    probeCtx.font = fontStr;
    const metrics = probeCtx.measureText(text);

    // 纹理尺寸：文字区域 + 四周 SDF_SPREAD 边距（供 SDF 衰减区域使用）
    const w = Math.ceil(metrics.width) + SDF_SPREAD * 2;
    const h = Math.ceil(scaledSize * 1.4) + SDF_SPREAD * 2;

    const canvas = new OffscreenCanvas(w, h);
    const ctx2d = canvas.getContext('2d')!;
    ctx2d.fillStyle = '#000';
    ctx2d.fillRect(0, 0, w, h);
    ctx2d.fillStyle = '#fff';
    ctx2d.font = fontStr;
    ctx2d.fillText(text, SDF_SPREAD, scaledSize + SDF_SPREAD / 2);

    const imageData = ctx2d.getImageData(0, 0, w, h);
    const sdfData = computeSDF(imageData.data, w, h, SDF_SPREAD);

    return {
        key,
        width: w,
        height: h,
        // 世界空间显示尺寸：纹理尺寸 / 超采样倍数
        worldWidth: w / OVERSAMPLE,
        worldHeight: h / OVERSAMPLE,
        data: sdfData,
    };
}
