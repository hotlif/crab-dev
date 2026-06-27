import type { ColorRGBA } from '../math/color.js';

/**
 * DrawCommand：描述一次 WebGL draw call 所需的全部信息。
 * 使用可辨识联合（kind 字段），使渲染器可在运行时类型安全地切换着色器。
 *
 * worldMatrix：mat3 列主序 Float32Array，由 Group 层叠加后传入，
 * 最终由顶点着色器与正交投影矩阵相乘得到 clip space 坐标。
 */

export interface BaseDrawCommand {
    /** 由 CanvasContext 分配的稳定 ID，用于在队列中定位/更新/删除 */
    id: number;
    /** 世界变换矩阵（mat3 列主序，来自 Group 层叠加） */
    worldMatrix: Float32Array;
    /**
     * 层叠路径（Stacking Context）：从根到当前元素经过的各层 zIndex 组成的数组。
     * 渲染器按字典序排序，路径越大越后绘制（在上方）。
     * Group 将自身 zIndex 追加到路径末尾并传递给子树，实现与 HTML 一致的层叠上下文隔离。
     */
    zIndexPath: number[];
    /**
     * 轴对齐包围盒（世界坐标系），用于视口剔除。
     * 图元组件在 buildCmd 时附加，renderer 在 render 时跳过视口外元素。
     * undefined 表示跳过剔除（如 InfiniteGrid，始终渲染）。
     */
    aabb?: { minX: number; minY: number; maxX: number; maxY: number };
}

export interface FlatRectCommand extends BaseDrawCommand {
    kind: 'flat-rect';
    x: number;
    y: number;
    width: number;
    height: number;
    fill: ColorRGBA;
    stroke: ColorRGBA;
    strokeWidth: number;
    /** 虚线实段长度（world px）；0 或未设置为实线 */
    dashLength?: number;
    /** 虚线空隙长度（world px）；dashLength > 0 时生效 */
    gapLength?: number;
}

export interface SdfRectCommand extends BaseDrawCommand {
    kind: 'sdf-rect';
    x: number;
    y: number;
    width: number;
    height: number;
    /** 圆角半径（px），> 0 时启用 SDF 着色器 */
    radius: number;
    fill: ColorRGBA;
    stroke: ColorRGBA;
    strokeWidth: number;
    /** 虚线实段长度（world px）；0 或未设置为实线 */
    dashLength?: number;
    /** 虚线空隙长度（world px）；dashLength > 0 时生效 */
    gapLength?: number;
}

export interface SdfCircleCommand extends BaseDrawCommand {
    kind: 'sdf-circle';
    /** 圆心 x（px） */
    cx: number;
    /** 圆心 y（px） */
    cy: number;
    /** 半径（px） */
    r: number;
    fill: ColorRGBA;
    stroke: ColorRGBA;
    strokeWidth: number;
}

export interface LineCommand extends BaseDrawCommand {
    kind: 'line';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: ColorRGBA;
    lineWidth: number;
    /** 虚线实线段长度（world px）；0 或未设置表示实线 */
    dashLength?: number;
    /** 虚线空隙长度（world px）；dashLength > 0 时生效 */
    gapLength?: number;
}

export interface TextureImageCommand extends BaseDrawCommand {
    kind: 'texture-image';
    x: number;
    y: number;
    width: number;
    height: number;
    /** TextureCache 中的 key；undefined 表示图片尚未加载完成 */
    textureKey: string | undefined;
    opacity: number;
}

export interface SdfTextCommand extends BaseDrawCommand {
    kind: 'sdf-text';
    x: number;
    y: number;
    /** TextAtlas 中的字形纹理 key */
    glyphKey: string | undefined;
    glyphWidth: number;
    glyphHeight: number;
    color: ColorRGBA;
}

/**
 * 无限网格命令：覆盖整个 viewport，由专用 grid 着色器渲染。
 * worldMatrix 为 identity（着色器内部不使用，grid 通过 u_inv_view 计算世界坐标）。
 * zIndexPath 应设为 [Number.MIN_SAFE_INTEGER]，确保始终在最底层渲染。
 */
export interface GridCommand extends BaseDrawCommand {
    kind: 'grid';
    /** 基础网格间距（world 坐标 px） */
    baseSpacing: number;
    /** 细分数，每个大格内的细线数量（默认 5） */
    subdivisions: number;
    /** 网格颜色 */
    color: ColorRGBA;
    /** 原点标记颜色；alpha=0 时不渲染原点 */
    originColor: ColorRGBA;
}

export interface MarkerCommand extends BaseDrawCommand {
    kind: 'marker';
    /** 箭头尖端位置（局部坐标，在 worldMatrix 坐标系中） */
    x: number;
    y: number;
    /** 箭头指向角度（弧度，0 = 向右） */
    angle: number;
    /** 箭头大小（px） */
    size: number;
    fill: ColorRGBA;
}

export type DrawCommand =
    | FlatRectCommand
    | SdfRectCommand
    | SdfCircleCommand
    | LineCommand
    | TextureImageCommand
    | SdfTextCommand
    | GridCommand
    | MarkerCommand;
