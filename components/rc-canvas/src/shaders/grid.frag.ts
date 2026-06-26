/**
 * Grid 片元着色器：将 canvas 坐标反变换到世界坐标，在网格交叉点处绘制圆形点阵。
 * 点半径以世界坐标固定（随缩放自然变大/小），从 u_inv_view 提取缩放比用于抗锯齿，
 * 避免 dFdx/dFdy 在全屏 quad 上的精度问题。
 * highp float 精度用于缓解大坐标时的浮点精度问题。
 */
export const GRID_FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform mat3 u_inv_view;
uniform float u_base_spacing;
uniform int u_subdivisions;
uniform vec4 u_color;
uniform vec4 u_origin_color;

in vec2 v_canvas_pos;
out vec4 out_color;

void main() {
    // canvas 坐标 → 世界坐标
    vec2 world = (u_inv_view * vec3(v_canvas_pos, 1.0)).xy;

    // 从 inv_view 第一列提取缩放比：1 屏幕像素 = px 世界单位（支持带旋转的变换）
    float px = length(u_inv_view[0].xy);
    float feather = px * 0.6;

    // ── 主网格点（固定世界坐标半径，放大后点随之变大）──
    vec2 mainCell = (fract(world / u_base_spacing + 0.5) - 0.5) * u_base_spacing;
    float distMain = length(mainCell);
    float mainR = u_base_spacing * 0.045;
    // 点的屏幕半径 < 0.5px 时淡出，避免锯齿噪点
    float mainFade = smoothstep(0.5, 1.5, mainR / px);
    float alphaMain = (1.0 - smoothstep(mainR - feather, mainR + feather, distMain)) * u_color.a * mainFade;

    // ── 细分网格点 ──
    float subSpacing = u_base_spacing / float(u_subdivisions);
    // 细分点间距在屏幕上 < 8px 时淡出
    float subFade = smoothstep(8.0, 16.0, subSpacing / px);

    vec2 subCell = (fract(world / subSpacing + 0.5) - 0.5) * subSpacing;
    float distSub = length(subCell);
    float subR = subSpacing * 0.07;
    float alphaSub = (1.0 - smoothstep(subR - feather, subR + feather, distSub)) * u_color.a * 0.45 * subFade;

    // ── 原点标记（世界坐标 (0,0) 处的高亮圆点）──
    float originR = u_base_spacing * 0.12;
    float originFade = smoothstep(1.0, 2.0, originR / px);
    float alphaOrigin = (1.0 - smoothstep(originR - feather, originR + feather, length(world))) * u_origin_color.a * originFade;

    float alphaGrid = max(alphaMain, alphaSub);
    float totalAlpha = max(alphaGrid, alphaOrigin);
    if (totalAlpha < 0.01) discard;

    // origin 覆盖 grid：按各自 alpha 占比插值颜色
    vec3 rgb = mix(u_color.rgb, u_origin_color.rgb, alphaOrigin / max(totalAlpha, 0.0001));
    out_color = vec4(rgb, totalAlpha);
}
`;
