/**
 * SDF 片元着色器：圆角矩形（u_mode=0）和圆形（u_mode=1）。
 *
 * - fwidth(dist) 计算屏幕空间导数，smoothstep 在 ±1px 内渐变，AA 随缩放自适应。
 * - 虚线（仅 sdf-rect）：在 stroke 带内以周长累积偏移 s 对 dash+gap 取模判断显隐。
 */
export const SDF_FRAG = /* glsl */ `#version 300 es
precision mediump float;

uniform vec4 u_fill;
uniform vec4 u_stroke;
uniform float u_stroke_width;
uniform vec2 u_size;
uniform float u_radius;
uniform int u_mode;
uniform float u_dash_length;
uniform float u_gap_length;

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

    float aa = fwidth(dist);
    float fill_alpha = 1.0 - smoothstep(-aa, aa, dist);

    vec4 color;
    if (u_stroke_width > 0.0) {
        float in_stroke = 1.0 - smoothstep(-aa, aa, dist + u_stroke_width);

        // 虚线（sdf-rect 专用，圆形跳过）：在 stroke 区域按周长取模判断 discard
        if (u_mode == 0 && in_stroke > 0.01 && u_dash_length > 0.0 && u_gap_length > 0.0) {
            float W = u_size.x;
            float H = u_size.y;
            float px_local = p.x + half_size.x;
            float py_local = p.y + half_size.y;
            float d_top    = py_local;
            float d_right  = W - px_local;
            float d_bottom = H - py_local;
            float d_left   = px_local;
            float s;
            if (d_top <= d_right && d_top <= d_bottom && d_top <= d_left) {
                s = px_local;
            } else if (d_right <= d_bottom && d_right <= d_left) {
                s = W + py_local;
            } else if (d_bottom <= d_left) {
                s = W + H + (W - px_local);
            } else {
                s = 2.0 * W + H + (H - py_local);
            }
            if (mod(s, u_dash_length + u_gap_length) >= u_dash_length) {
                discard;
            }
        }

        vec3 rgb = mix(u_fill.rgb, u_stroke.rgb, in_stroke);
        float a = mix(u_fill.a, u_stroke.a, in_stroke) * fill_alpha;
        color = vec4(rgb, a);
    } else {
        color = u_fill;
        color.a *= fill_alpha;
    }

    out_color = color;
}
`;
