/**
 * SDF 片元着色器：圆角矩形（u_mode=0）和圆形（u_mode=1）。
 *
 * 使用 Signed Distance Field 实现亚像素抗锯齿边缘：
 * smoothstep(-0.5, 0.5, dist) 将 ±0.5px 范围内的像素渐变为透明，
 * 消除锯齿而无需 MSAA。
 */
export const SDF_FRAG = /* glsl */ `#version 300 es
precision mediump float;

uniform vec4 u_fill;
uniform vec4 u_stroke;
uniform float u_stroke_width;
uniform vec2 u_size;
uniform float u_radius;
uniform int u_mode;

in vec2 v_uv;
out vec4 out_color;

float sdRoundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

void main() {
    vec2 half_size = u_size * 0.5;
    vec2 p = (v_uv - 0.5) * u_size;

    float dist;
    if (u_mode == 1) {
        dist = sdCircle(p, half_size.x);
    } else {
        dist = sdRoundedBox(p, half_size, u_radius);
    }

    float fill_alpha = 1.0 - smoothstep(-0.5, 0.5, dist);

    vec4 color;
    if (u_stroke_width > 0.0) {
        float in_stroke = 1.0 - smoothstep(-0.5, 0.5, dist + u_stroke_width);
        color = mix(u_fill, u_stroke, in_stroke * fill_alpha);
        color.a = fill_alpha;
    } else {
        color = u_fill;
        color.a *= fill_alpha;
    }

    out_color = color;
}
`;
