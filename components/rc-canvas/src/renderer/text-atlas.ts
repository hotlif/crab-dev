/** 4x 超采样渲染，SDF/MSDF 在超采样空间中的扩展半径（px）。
 *  SDF_SPREAD 越大，fwidth(dist) 越小，边缘过渡越窄（更清晰）。
 *  16 → 世界空间 4px 扩散，fwidth ≈ 0.125，搭配着色器系数 0.5 → 约 1 物理像素过渡。 */
const OVERSAMPLE = 4;
const SDF_SPREAD = 16;

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
    /** 纹理通道数：固定为 1（R8 单通道 SDF） */
    channels: 1;
    /** 纹理数据：width×height R8 */
    data: Uint8Array;
}

// ─── Canvas 2D SDF（Felzenszwalb-Huttenlocher EDT）──────────────────────────

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

/**
 * 将一行文字拆分为换行单元：CJK 字符每字一个，英文词一个，空格序列一个。
 * CJK 范围：基本汉字 / 假名 / 谚文。
 */
function tokenizeLine(line: string): string[] {
    return line.match(
        /[一-鿿぀-ヿ가-힯]|[^一-鿿぀-ヿ가-힯\s]+|\s+/gu,
    ) ?? [];
}

/**
 * 贪心换行：超过 maxScaledWidth（超采样坐标 px）时在 token 边界处换行。
 * 支持 CJK 按字换行、英文按词换行，行首空格自动跳过。
 */
function wrapLine(
    line: string,
    ctx: OffscreenCanvasRenderingContext2D,
    maxScaledWidth: number,
): string[] {
    if (!line) return [''];
    const tokens = tokenizeLine(line);
    const result: string[] = [];
    let current = '';

    for (const token of tokens) {
        if (!current && /^\s+$/.test(token)) continue;  // 跳过行首空格

        const candidate = current + token;
        if (current && ctx.measureText(candidate.trimEnd()).width > maxScaledWidth) {
            result.push(current.trimEnd());
            current = /^\s+$/.test(token) ? '' : token;  // 换行后跳过空格 token
        } else {
            current = candidate;
        }
    }
    result.push(current.trimEnd());
    return result;
}

// ─── 公开 API：Canvas 2D SDF ──────────────────────────────────────────────

/**
 * 以 OVERSAMPLE 倍超采样渲染文字，计算 SDF 纹理，返回 R8 格式数据（channels=1）。
 * 支持 \n 显式换行与 maxWidth 自动词换行；多行共享同一张纹理。
 * SDF 保证在任意缩放级别下，配合着色器 smoothstep 都能呈现清晰边缘。
 */
export function generateGlyph(
    text: string,
    fontSize: number,
    fontFamily: string,
    lineHeight?: number,
    maxWidth?: number,
): GlyphInfo {
    const scaledSize = fontSize * OVERSAMPLE;
    const scaledLineHeight = Math.ceil((lineHeight ?? fontSize * 1.4) * OVERSAMPLE);
    const scaledMaxWidth = maxWidth !== undefined ? maxWidth * OVERSAMPLE : undefined;
    const fontStr = `${scaledSize}px ${fontFamily}`;

    const probe = new OffscreenCanvas(1, 1);
    const probeCtx = probe.getContext('2d')!;
    probeCtx.font = fontStr;

    // 按 \n 分割，再对每行做 maxWidth 词换行
    const rawLines = text.split('\n');
    const lines: string[] = [];
    for (const raw of rawLines) {
        if (scaledMaxWidth !== undefined) {
            for (const wrapped of wrapLine(raw, probeCtx, scaledMaxWidth)) {
                lines.push(wrapped);
            }
        } else {
            lines.push(raw);
        }
    }

    // 取最宽行宽，确保至少 1px
    const maxLineWidth = Math.max(1, ...lines.map(l => probeCtx.measureText(l).width));

    const key = `${text}\x00${fontSize}\x00${fontFamily}\x00${lineHeight ?? ''}\x00${maxWidth ?? ''}`;

    const w = Math.ceil(maxLineWidth) + SDF_SPREAD * 2;
    const h = lines.length * scaledLineHeight + SDF_SPREAD * 2;

    const canvas = new OffscreenCanvas(w, h);
    const ctx2d = canvas.getContext('2d')!;
    ctx2d.fillStyle = '#000';
    ctx2d.fillRect(0, 0, w, h);
    ctx2d.fillStyle = '#fff';
    ctx2d.font = fontStr;
    ctx2d.textBaseline = 'alphabetic';
    for (let i = 0; i < lines.length; i++) {
        // 测量当前行的实际字形边界框，将字形视觉中心对齐到每行几何中心，
        // 确保 textBaseline='middle' 时 worldHeight/2 精确对应字形视觉中心
        const m = ctx2d.measureText(lines[i] || ' ');
        const halfShift = (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
        const centerY = SDF_SPREAD + (i + 0.5) * scaledLineHeight;
        ctx2d.fillText(lines[i], SDF_SPREAD, centerY + halfShift);
    }

    const imageData = ctx2d.getImageData(0, 0, w, h);
    const sdfData = computeSDF(imageData.data, w, h, SDF_SPREAD);

    return {
        key,
        width: w,
        height: h,
        worldWidth: w / OVERSAMPLE,
        worldHeight: h / OVERSAMPLE,
        channels: 1,
        data: sdfData,
    };
}

