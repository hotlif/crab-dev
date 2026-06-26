/**
 * Grid 顶点着色器：绘制全屏 quad，输出 canvas 坐标供片元着色器计算网格。
 * 顶点数据为 clip space 坐标（[-1,1] 范围），无需任何矩阵变换。
 */
export const GRID_VERT = /* glsl */ `#version 300 es
precision mediump float;

layout(location = 0) in vec2 a_clip_pos;

uniform vec2 u_canvas_size;

out vec2 v_canvas_pos;

void main() {
    gl_Position = vec4(a_clip_pos, 0.0, 1.0);
    // clip space → canvas 坐标（CSS px，Y 轴从顶部开始）
    v_canvas_pos = vec2(
        (a_clip_pos.x + 1.0) * u_canvas_size.x * 0.5,
        (1.0 - a_clip_pos.y) * u_canvas_size.y * 0.5
    );
}
`;
