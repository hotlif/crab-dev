import type { DrawCommand } from './draw-command.js';

/** 字典序比较两个 zIndexPath。短路径缺失层以 -Infinity 补齐（浅层在深层之下）。 */
function compareZIndexPaths(a: number[], b: number[]): number {
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
        const av = i < a.length ? a[i] : -Infinity;
        const bv = i < b.length ? b[i] : -Infinity;
        if (av !== bv) return av - bv;
    }
    return 0;
}
import { makeOrthographicMat3, identityMat3, invertMat3, applyMat3 } from '../math/matrix.js';
import { FLAT_VERT } from '../shaders/flat.vert.js';
import { FLAT_FRAG } from '../shaders/flat.frag.js';
import { SDF_VERT } from '../shaders/sdf.vert.js';
import { SDF_FRAG } from '../shaders/sdf.frag.js';
import { LINE_VERT } from '../shaders/line.vert.js';
import { LINE_FRAG } from '../shaders/line.frag.js';
import { TEXTURE_VERT } from '../shaders/texture.vert.js';
import { TEXTURE_FRAG } from '../shaders/texture.frag.js';
import { GRID_VERT } from '../shaders/grid.vert.js';
import { GRID_FRAG } from '../shaders/grid.frag.js';
import { MARKER_VERT } from '../shaders/marker.vert.js';
import { MARKER_FRAG } from '../shaders/marker.frag.js';

// 单位四边形顶点：[position.x, position.y, uv.x, uv.y]
const QUAD_VERTICES = new Float32Array([
    0, 0, 0, 0,
    1, 0, 1, 0,
    0, 1, 0, 1,
    1, 1, 1, 1,
]);

// Line extrusion 顶点：[a_side, a_t]
// 起点左 / 起点右 / 终点左 / 终点右
const LINE_VERTICES = new Float32Array([
    -1, 0,
    1, 0,
    -1, 1,
    1, 1,
]);

const QUAD_INDICES = new Uint16Array([0, 2, 1, 1, 2, 3]);

// 全屏 quad 顶点（clip space，供 grid 着色器使用）
const FULLSCREEN_VERTICES = new Float32Array([
    -1, -1,
    1, -1,
    -1,  1,
    1,  1,
]);

interface FlatLocs {
    projection: WebGLUniformLocation | null;
    view: WebGLUniformLocation | null;
    world: WebGLUniformLocation | null;
    bounds: WebGLUniformLocation | null;
    fill: WebGLUniformLocation | null;
    stroke: WebGLUniformLocation | null;
    strokeWidth: WebGLUniformLocation | null;
    size: WebGLUniformLocation | null;
    dashLength: WebGLUniformLocation | null;
    gapLength: WebGLUniformLocation | null;
}

interface SdfLocs extends FlatLocs {
    radius: WebGLUniformLocation | null;
    mode: WebGLUniformLocation | null;
}

interface LineLocs {
    projection: WebGLUniformLocation | null;
    view: WebGLUniformLocation | null;
    world: WebGLUniformLocation | null;
    start: WebGLUniformLocation | null;
    end: WebGLUniformLocation | null;
    lineWidth: WebGLUniformLocation | null;
    color: WebGLUniformLocation | null;
    dashLength: WebGLUniformLocation | null;
    gapLength: WebGLUniformLocation | null;
    dashOffset: WebGLUniformLocation | null;
}

interface TextureLocs {
    projection: WebGLUniformLocation | null;
    view: WebGLUniformLocation | null;
    world: WebGLUniformLocation | null;
    bounds: WebGLUniformLocation | null;
    texture: WebGLUniformLocation | null;
    opacity: WebGLUniformLocation | null;
    color: WebGLUniformLocation | null;
    mode: WebGLUniformLocation | null;
}

interface GridLocs {
    canvasSize: WebGLUniformLocation | null;
    invView: WebGLUniformLocation | null;
    baseSpacing: WebGLUniformLocation | null;
    subdivisions: WebGLUniformLocation | null;
    color: WebGLUniformLocation | null;
    originColor: WebGLUniformLocation | null;
}

interface MarkerLocs {
    projection: WebGLUniformLocation | null;
    view: WebGLUniformLocation | null;
    world: WebGLUniformLocation | null;
    tip: WebGLUniformLocation | null;
    angle: WebGLUniformLocation | null;
    size: WebGLUniformLocation | null;
    color: WebGLUniformLocation | null;
}

export class WebGLRenderer {
    private readonly gl: WebGL2RenderingContext;
    private projMatrix: Float32Array;
    private viewMatrix: Float32Array = identityMat3();
    private invViewMatrix: Float32Array | null = null;
    private canvasWidth: number;
    private canvasHeight: number;

    // projection / view 变更版本号：只有版本变化时才向各 program 重传这两个 uniform
    private projVersion = 0;
    private viewVersion = 0;
    private lastUploadedProjVersion = -1;
    private lastUploadedViewVersion = -1;

    private readonly flatProg: WebGLProgram;
    private readonly sdfProg: WebGLProgram;
    private readonly lineProg: WebGLProgram;
    private readonly textureProg: WebGLProgram;
    private readonly gridProg: WebGLProgram;
    private readonly markerProg: WebGLProgram;

    private readonly flatLocs: FlatLocs;
    private readonly sdfLocs: SdfLocs;
    private readonly lineLocs: LineLocs;
    private readonly textureLocs: TextureLocs;
    private readonly gridLocs: GridLocs;
    private readonly markerLocs: MarkerLocs;

    // 可变实例状态 ref 等价：直接持有 WebGL 对象，生命周期由 dispose() 管理
    private readonly quadVAO: WebGLVertexArrayObject;
    private readonly quadVBO: WebGLBuffer;
    private readonly quadIBO: WebGLBuffer;
    private readonly lineVAO: WebGLVertexArrayObject;
    private readonly lineVBO: WebGLBuffer;
    private readonly lineIBO: WebGLBuffer;
    private readonly gridVAO: WebGLVertexArrayObject;
    private readonly gridVBO: WebGLBuffer;
    private readonly markerVAO: WebGLVertexArrayObject;

    private readonly textures = new Map<string, WebGLTexture>();

    // 排序缓存：commands 不变时（仅 viewMatrix 变化）复用，避免每帧 O(n log n) 重排
    private sortedCache: DrawCommand[] = [];
    private lastCommandsVersion = -1;

    // 流动虚线动画的时间基准：elapsed = frameTime - timeOrigin（秒）
    private readonly timeOrigin = performance.now();
    // 每帧在 render() 开头采样一次，帧内所有线共享同一时间点，保证相位一致
    private frameTime = 0;
    /** prefers-reduced-motion: reduce 时由宿主置 true，流动虚线降级为静态虚线 */
    reducedMotion = false;

    constructor(
        gl: WebGL2RenderingContext,
        width: number,
        height: number,
        dpr: number,
    ) {
        this.gl = gl;
        this.projMatrix = makeOrthographicMat3(width, height);
        this.canvasWidth = width;
        this.canvasHeight = height;

        this.flatProg = this.compileProgram(FLAT_VERT, FLAT_FRAG);
        this.sdfProg = this.compileProgram(SDF_VERT, SDF_FRAG);
        this.lineProg = this.compileProgram(LINE_VERT, LINE_FRAG);
        this.textureProg = this.compileProgram(TEXTURE_VERT, TEXTURE_FRAG);
        this.gridProg = this.compileProgram(GRID_VERT, GRID_FRAG);
        this.markerProg = this.compileProgram(MARKER_VERT, MARKER_FRAG);

        this.flatLocs = {
            projection: gl.getUniformLocation(this.flatProg, 'u_projection'),
            view: gl.getUniformLocation(this.flatProg, 'u_view'),
            world: gl.getUniformLocation(this.flatProg, 'u_world'),
            bounds: gl.getUniformLocation(this.flatProg, 'u_bounds'),
            fill: gl.getUniformLocation(this.flatProg, 'u_fill'),
            stroke: gl.getUniformLocation(this.flatProg, 'u_stroke'),
            strokeWidth: gl.getUniformLocation(this.flatProg, 'u_stroke_width'),
            size: gl.getUniformLocation(this.flatProg, 'u_size'),
            dashLength: gl.getUniformLocation(this.flatProg, 'u_dash_length'),
            gapLength: gl.getUniformLocation(this.flatProg, 'u_gap_length'),
        };
        this.sdfLocs = {
            projection: gl.getUniformLocation(this.sdfProg, 'u_projection'),
            view: gl.getUniformLocation(this.sdfProg, 'u_view'),
            world: gl.getUniformLocation(this.sdfProg, 'u_world'),
            bounds: gl.getUniformLocation(this.sdfProg, 'u_bounds'),
            fill: gl.getUniformLocation(this.sdfProg, 'u_fill'),
            stroke: gl.getUniformLocation(this.sdfProg, 'u_stroke'),
            strokeWidth: gl.getUniformLocation(this.sdfProg, 'u_stroke_width'),
            size: gl.getUniformLocation(this.sdfProg, 'u_size'),
            dashLength: gl.getUniformLocation(this.sdfProg, 'u_dash_length'),
            gapLength: gl.getUniformLocation(this.sdfProg, 'u_gap_length'),
            radius: gl.getUniformLocation(this.sdfProg, 'u_radius'),
            mode: gl.getUniformLocation(this.sdfProg, 'u_mode'),
        };
        this.lineLocs = {
            projection: gl.getUniformLocation(this.lineProg, 'u_projection'),
            view: gl.getUniformLocation(this.lineProg, 'u_view'),
            world: gl.getUniformLocation(this.lineProg, 'u_world'),
            start: gl.getUniformLocation(this.lineProg, 'u_start'),
            end: gl.getUniformLocation(this.lineProg, 'u_end'),
            lineWidth: gl.getUniformLocation(this.lineProg, 'u_line_width'),
            color: gl.getUniformLocation(this.lineProg, 'u_color'),
            dashLength: gl.getUniformLocation(this.lineProg, 'u_dash_length'),
            gapLength: gl.getUniformLocation(this.lineProg, 'u_gap_length'),
            dashOffset: gl.getUniformLocation(this.lineProg, 'u_dash_offset'),
        };
        this.textureLocs = {
            projection: gl.getUniformLocation(this.textureProg, 'u_projection'),
            view: gl.getUniformLocation(this.textureProg, 'u_view'),
            world: gl.getUniformLocation(this.textureProg, 'u_world'),
            bounds: gl.getUniformLocation(this.textureProg, 'u_bounds'),
            texture: gl.getUniformLocation(this.textureProg, 'u_texture'),
            opacity: gl.getUniformLocation(this.textureProg, 'u_opacity'),
            color: gl.getUniformLocation(this.textureProg, 'u_color'),
            mode: gl.getUniformLocation(this.textureProg, 'u_mode'),
        };
        this.gridLocs = {
            canvasSize: gl.getUniformLocation(this.gridProg, 'u_canvas_size'),
            invView: gl.getUniformLocation(this.gridProg, 'u_inv_view'),
            baseSpacing: gl.getUniformLocation(this.gridProg, 'u_base_spacing'),
            subdivisions: gl.getUniformLocation(this.gridProg, 'u_subdivisions'),
            color: gl.getUniformLocation(this.gridProg, 'u_color'),
            originColor: gl.getUniformLocation(this.gridProg, 'u_origin_color'),
        };
        this.markerLocs = {
            projection: gl.getUniformLocation(this.markerProg, 'u_projection'),
            view: gl.getUniformLocation(this.markerProg, 'u_view'),
            world: gl.getUniformLocation(this.markerProg, 'u_world'),
            tip: gl.getUniformLocation(this.markerProg, 'u_tip'),
            angle: gl.getUniformLocation(this.markerProg, 'u_angle'),
            size: gl.getUniformLocation(this.markerProg, 'u_size'),
            color: gl.getUniformLocation(this.markerProg, 'u_color'),
        };

        // 初始化通用 QUAD VAO
        const [qVAO, qVBO, qIBO] = this.createQuadVAO();
        this.quadVAO = qVAO;
        this.quadVBO = qVBO;
        this.quadIBO = qIBO;

        // 初始化 Line 专用 VAO
        const [lVAO, lVBO, lIBO] = this.createLineVAO();
        this.lineVAO = lVAO;
        this.lineVBO = lVBO;
        this.lineIBO = lIBO;

        // 初始化 Grid 全屏 quad VAO
        const [gVAO, gVBO] = this.createGridVAO();
        this.gridVAO = gVAO;
        this.gridVBO = gVBO;

        // 初始化 Marker 空 VAO（完全依赖 gl_VertexID，无 attribute）
        this.markerVAO = this.createMarkerVAO();

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0, 0, Math.round(width * dpr), Math.round(height * dpr));
    }

    resize(width: number, height: number, dpr: number): void {
        this.projMatrix = makeOrthographicMat3(width, height);
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.projVersion++;
        this.gl.viewport(0, 0, Math.round(width * dpr), Math.round(height * dpr));
    }

    setViewMatrix(mat: Float32Array): void {
        this.viewMatrix = mat;
        this.invViewMatrix = invertMat3(mat);
        this.viewVersion++;
    }

    render(commands: Map<number, DrawCommand>, commandsVersion: number): void {
        const { gl } = this;
        this.frameTime = performance.now();
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 只在 commands 本身变化时重排；viewMatrix 平移/缩放不触发重排
        if (commandsVersion !== this.lastCommandsVersion) {
            this.sortedCache = [...commands.values()].sort((a, b) => {
                const r = compareZIndexPaths(a.zIndexPath, b.zIndexPath);
                return r !== 0 ? r : a.id - b.id;
            });
            this.lastCommandsVersion = commandsVersion;
        }

        // projection / view 变化时批量上传到所有 program，避免每个 draw call 重复设置
        const needProjUpload = this.projVersion !== this.lastUploadedProjVersion;
        const needViewUpload = this.viewVersion !== this.lastUploadedViewVersion;
        if (needProjUpload || needViewUpload) {
            const entries: Array<[WebGLProgram, WebGLUniformLocation | null, WebGLUniformLocation | null]> = [
                [this.flatProg,    this.flatLocs.projection,    this.flatLocs.view],
                [this.sdfProg,     this.sdfLocs.projection,     this.sdfLocs.view],
                [this.lineProg,    this.lineLocs.projection,    this.lineLocs.view],
                [this.textureProg, this.textureLocs.projection, this.textureLocs.view],
                [this.markerProg,  this.markerLocs.projection,  this.markerLocs.view],
            ];
            for (const [prog, projLoc, viewLoc] of entries) {
                gl.useProgram(prog);
                if (needProjUpload && projLoc) gl.uniformMatrix3fv(projLoc, false, this.projMatrix);
                if (needViewUpload && viewLoc)  gl.uniformMatrix3fv(viewLoc, false, this.viewMatrix);
            }
            this.lastUploadedProjVersion = this.projVersion;
            this.lastUploadedViewVersion = this.viewVersion;
        }

        // 使用 setViewMatrix 时缓存的逆矩阵，避免每帧重算
        const invView = this.invViewMatrix;
        let viewAABB: { minX: number; minY: number; maxX: number; maxY: number } | null = null;
        if (invView) {
            const w = this.canvasWidth;
            const h = this.canvasHeight;
            const corners = [
                applyMat3(invView, 0, 0),
                applyMat3(invView, w, 0),
                applyMat3(invView, 0, h),
                applyMat3(invView, w, h),
            ];
            viewAABB = {
                minX: Math.min(...corners.map(c => c[0])),
                minY: Math.min(...corners.map(c => c[1])),
                maxX: Math.max(...corners.map(c => c[0])),
                maxY: Math.max(...corners.map(c => c[1])),
            };
        }

        for (const cmd of this.sortedCache) {
            // 视口剔除：有 aabb 且视口已知时，跳过视口外元素
            if (cmd.kind !== 'grid' && cmd.aabb && viewAABB) {
                const { minX, minY, maxX, maxY } = cmd.aabb;
                if (maxX < viewAABB.minX || minX > viewAABB.maxX ||
                    maxY < viewAABB.minY || minY > viewAABB.maxY) continue;
            }
            this.drawCommand(cmd);
        }
    }

    /** 上传图片纹理（RGBA）到 GPU 并缓存 */
    uploadTexture(key: string, source: HTMLImageElement | ImageBitmap): void {
        const { gl } = this;
        const existing = this.textures.get(key);
        if (existing) gl.deleteTexture(existing);

        const tex = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this.textures.set(key, tex);
    }

    uploadGlyph(key: string, data: Uint8Array, width: number, height: number): void {
        const { gl } = this;
        const existing = this.textures.get(key);
        if (existing) gl.deleteTexture(existing);

        const tex = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, width, height, 0, gl.RED, gl.UNSIGNED_BYTE, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this.textures.set(key, tex);
    }

    dispose(): void {
        const { gl } = this;
        gl.deleteVertexArray(this.quadVAO);
        gl.deleteBuffer(this.quadVBO);
        gl.deleteBuffer(this.quadIBO);
        gl.deleteVertexArray(this.lineVAO);
        gl.deleteBuffer(this.lineVBO);
        gl.deleteBuffer(this.lineIBO);
        gl.deleteVertexArray(this.gridVAO);
        gl.deleteBuffer(this.gridVBO);
        gl.deleteVertexArray(this.markerVAO);
        gl.deleteProgram(this.flatProg);
        gl.deleteProgram(this.sdfProg);
        gl.deleteProgram(this.lineProg);
        gl.deleteProgram(this.textureProg);
        gl.deleteProgram(this.gridProg);
        gl.deleteProgram(this.markerProg);
        for (const tex of this.textures.values()) gl.deleteTexture(tex);
        this.textures.clear();
    }

    // ─── 私有：draw call 分发 ──────────────────────────────────────────────

    private drawCommand(cmd: DrawCommand): void {
        switch (cmd.kind) {
            case 'flat-rect':      this.drawFlatRect(cmd); break;
            case 'sdf-rect':       this.drawSdfRect(cmd); break;
            case 'sdf-circle':     this.drawSdfCircle(cmd); break;
            case 'line':           this.drawLine(cmd); break;
            case 'texture-image':  this.drawTextureImage(cmd); break;
            case 'sdf-text':       this.drawSdfText(cmd); break;
            case 'grid':           this.drawGrid(cmd); break;
            case 'marker':         this.drawMarker(cmd); break;
        }
    }

    private drawFlatRect(cmd: import('./draw-command.js').FlatRectCommand): void {
        const { gl, flatProg: prog, flatLocs: L } = this;
        gl.useProgram(prog);
        gl.uniformMatrix3fv(L.world, false, cmd.worldMatrix);
        gl.uniform4f(L.bounds, cmd.x, cmd.y, cmd.width, cmd.height);
        gl.uniform4fv(L.fill, cmd.fill);
        gl.uniform4fv(L.stroke, cmd.stroke);
        gl.uniform1f(L.strokeWidth, cmd.strokeWidth);
        gl.uniform2f(L.size, cmd.width, cmd.height);
        gl.uniform1f(L.dashLength, cmd.dashLength ?? 0);
        gl.uniform1f(L.gapLength, cmd.gapLength ?? 0);
        this.drawQuad();
    }

    private drawSdfRect(cmd: import('./draw-command.js').SdfRectCommand): void {
        const { gl, sdfProg: prog, sdfLocs: L } = this;
        gl.useProgram(prog);
        gl.uniformMatrix3fv(L.world, false, cmd.worldMatrix);
        gl.uniform4f(L.bounds, cmd.x, cmd.y, cmd.width, cmd.height);
        gl.uniform4fv(L.fill, cmd.fill);
        gl.uniform4fv(L.stroke, cmd.stroke);
        gl.uniform1f(L.strokeWidth, cmd.strokeWidth);
        gl.uniform2f(L.size, cmd.width, cmd.height);
        gl.uniform1f(L.dashLength, cmd.dashLength ?? 0);
        gl.uniform1f(L.gapLength, cmd.gapLength ?? 0);
        gl.uniform1f(L.radius, cmd.radius);
        gl.uniform1i(L.mode, 0);
        this.drawQuad();
    }

    private drawSdfCircle(cmd: import('./draw-command.js').SdfCircleCommand): void {
        const { gl, sdfProg: prog, sdfLocs: L } = this;
        const size = cmd.r * 2;
        gl.useProgram(prog);
        gl.uniformMatrix3fv(L.world, false, cmd.worldMatrix);
        // bounds：以圆心为参考，左上角为 (cx-r, cy-r)，尺寸为 (2r, 2r)
        gl.uniform4f(L.bounds, cmd.cx - cmd.r, cmd.cy - cmd.r, size, size);
        gl.uniform4fv(L.fill, cmd.fill);
        gl.uniform4fv(L.stroke, cmd.stroke);
        gl.uniform1f(L.strokeWidth, cmd.strokeWidth);
        gl.uniform2f(L.size, size, size);
        gl.uniform1f(L.radius, cmd.r);
        gl.uniform1i(L.mode, 1);
        this.drawQuad();
    }

    private drawLine(cmd: import('./draw-command.js').LineCommand): void {
        const { gl, lineProg: prog, lineLocs: L } = this;

        // 流动偏移：offset = flowSpeed * elapsed - dashPhase。
        // CPU 侧先对周期取模，避免长时间运行后 offset 增大、mediump float 的 mod 精度劣化。
        const speed = this.reducedMotion ? 0 : (cmd.flowSpeed ?? 0);
        const period = (cmd.dashLength ?? 0) + (cmd.gapLength ?? 0);
        let dashOffset = speed * ((this.frameTime - this.timeOrigin) / 1000) - (cmd.dashPhase ?? 0);
        if (period > 0) dashOffset %= period;

        gl.useProgram(prog);
        gl.uniformMatrix3fv(L.world, false, cmd.worldMatrix);
        gl.uniform2f(L.start, cmd.x1, cmd.y1);
        gl.uniform2f(L.end, cmd.x2, cmd.y2);
        gl.uniform1f(L.lineWidth, cmd.lineWidth);
        gl.uniform4fv(L.color, cmd.color);
        gl.uniform1f(L.dashLength, cmd.dashLength ?? 0);
        gl.uniform1f(L.gapLength, cmd.gapLength ?? 0);
        gl.uniform1f(L.dashOffset, dashOffset);
        gl.bindVertexArray(this.lineVAO);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }

    private drawTextureImage(cmd: import('./draw-command.js').TextureImageCommand): void {
        if (!cmd.textureKey) return;
        const tex = this.textures.get(cmd.textureKey);
        if (!tex) return;

        const { gl, textureProg: prog, textureLocs: L } = this;
        gl.useProgram(prog);
        gl.uniformMatrix3fv(L.world, false, cmd.worldMatrix);
        gl.uniform4f(L.bounds, cmd.x, cmd.y, cmd.width, cmd.height);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(L.texture, 0);
        gl.uniform1f(L.opacity, cmd.opacity);
        gl.uniform4f(L.color, 1, 1, 1, 1);
        gl.uniform1i(L.mode, 0);
        this.drawQuad();
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    private drawSdfText(cmd: import('./draw-command.js').SdfTextCommand): void {
        if (!cmd.glyphKey) return;
        const tex = this.textures.get(cmd.glyphKey);
        if (!tex) return;

        const { gl, textureProg: prog, textureLocs: L } = this;
        gl.useProgram(prog);
        gl.uniformMatrix3fv(L.world, false, cmd.worldMatrix);
        gl.uniform4f(L.bounds, cmd.x, cmd.y, cmd.glyphWidth, cmd.glyphHeight);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(L.texture, 0);
        gl.uniform1f(L.opacity, 1);
        gl.uniform4fv(L.color, cmd.color);
        gl.uniform1i(L.mode, 1);
        this.drawQuad();
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    // ─── 私有：辅助方法 ────────────────────────────────────────────────────

    private drawQuad(): void {
        const { gl } = this;
        gl.bindVertexArray(this.quadVAO);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }

    private createQuadVAO(): [WebGLVertexArrayObject, WebGLBuffer, WebGLBuffer] {
        const { gl } = this;
        const vao = gl.createVertexArray()!;
        const vbo = gl.createBuffer()!;
        const ibo = gl.createBuffer()!;

        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTICES, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, QUAD_INDICES, gl.STATIC_DRAW);

        // location 0: a_position（vec2，stride=16，offset=0）
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
        // location 1: a_uv（vec2，stride=16，offset=8）
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

        gl.bindVertexArray(null);
        return [vao, vbo, ibo];
    }

    private drawGrid(cmd: import('./draw-command.js').GridCommand): void {
        const { gl, gridProg: prog, gridLocs: L } = this;
        const invView = invertMat3(this.viewMatrix);
        if (!invView) return;

        gl.useProgram(prog);
        gl.uniform2f(L.canvasSize, this.canvasWidth, this.canvasHeight);
        gl.uniformMatrix3fv(L.invView, false, invView);
        gl.uniform1f(L.baseSpacing, cmd.baseSpacing);
        gl.uniform1i(L.subdivisions, cmd.subdivisions);
        gl.uniform4fv(L.color, cmd.color);
        gl.uniform4fv(L.originColor, cmd.originColor);

        gl.bindVertexArray(this.gridVAO);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.bindVertexArray(null);
    }

    private createGridVAO(): [WebGLVertexArrayObject, WebGLBuffer] {
        const { gl } = this;
        const vao = gl.createVertexArray()!;
        const vbo = gl.createBuffer()!;

        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_VERTICES, gl.STATIC_DRAW);

        // location 0: a_clip_pos（vec2，stride=8，offset=0）
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);

        gl.bindVertexArray(null);
        return [vao, vbo];
    }

    private createLineVAO(): [WebGLVertexArrayObject, WebGLBuffer, WebGLBuffer] {
        const { gl } = this;
        const vao = gl.createVertexArray()!;
        const vbo = gl.createBuffer()!;
        const ibo = gl.createBuffer()!;

        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, LINE_VERTICES, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, QUAD_INDICES, gl.STATIC_DRAW);

        // location 0: a_side（float，stride=8，offset=0）
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 8, 0);
        // location 1: a_t（float，stride=8，offset=4）
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 8, 4);

        gl.bindVertexArray(null);
        return [vao, vbo, ibo];
    }

    private drawMarker(cmd: import('./draw-command.js').MarkerCommand): void {
        const { gl, markerProg: prog, markerLocs: L } = this;
        gl.useProgram(prog);
        gl.uniformMatrix3fv(L.world, false, cmd.worldMatrix);
        gl.uniform2f(L.tip, cmd.x, cmd.y);
        gl.uniform1f(L.angle, cmd.angle);
        gl.uniform1f(L.size, cmd.size);
        gl.uniform4fv(L.color, cmd.fill);
        gl.bindVertexArray(this.markerVAO);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindVertexArray(null);
    }

    private createMarkerVAO(): WebGLVertexArrayObject {
        const { gl } = this;
        const vao = gl.createVertexArray()!;
        // 无 attribute：完全依赖 gl_VertexID 和 uniforms
        gl.bindVertexArray(vao);
        gl.bindVertexArray(null);
        return vao;
    }

    private compileProgram(vertSrc: string, fragSrc: string): WebGLProgram {
        const { gl } = this;
        const vert = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(vert, vertSrc);
        gl.compileShader(vert);

        const frag = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(frag, fragSrc);
        gl.compileShader(frag);

        const prog = gl.createProgram()!;
        gl.attachShader(prog, vert);
        gl.attachShader(prog, frag);
        gl.linkProgram(prog);

        gl.deleteShader(vert);
        gl.deleteShader(frag);
        return prog;
    }
}
