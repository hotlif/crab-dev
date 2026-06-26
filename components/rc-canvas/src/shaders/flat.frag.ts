/**
 * Flat 片元着色器：无圆角矩形的填充与描边，支持虚线边框。
 * 通过 v_uv 计算像素到各边的距离，在描边带内切换颜色。
 * 虚线：计算 stroke 像素在矩形周长上的累积偏移量，对 dash+gap 取模判断显隐。
 */
export const FLAT_FRAG = /* glsl */ `#version 300 es
precision mediump float;

uniform vec4 u_fill;
uniform vec4 u_stroke;
uniform float u_stroke_width;
uniform vec2 u_size;
/** 虚线实段长度（world px）；0 表示实线 */
uniform float u_dash_length;
/** 虚线空隙长度（world px）；u_dash_length > 0 时生效 */
uniform float u_gap_length;

in vec2 v_uv;
out vec4 out_color;

void main() {
    float px = v_uv.x * u_size.x;
    float py = v_uv.y * u_size.y;

    float dist_to_edge = min(
        min(px, u_size.x - px),
        min(py, u_size.y - py)
    );

    if (u_stroke_width > 0.0) {
        if (dist_to_edge < u_stroke_width && u_dash_length > 0.0 && u_gap_length > 0.0) {
            // 计算当前像素在矩形周长上的顺时针累积偏移量 s（从左上角出发）
            float W = u_size.x;
            float H = u_size.y;
            float d_top    = py;
            float d_right  = W - px;
            float d_bottom = H - py;
            float d_left   = px;
            float s;
            if (d_top <= d_right && d_top <= d_bottom && d_top <= d_left) {
                s = px;                         // 上边：0 → W
            } else if (d_right <= d_bottom && d_right <= d_left) {
                s = W + py;                     // 右边：W → W+H
            } else if (d_bottom <= d_left) {
                s = W + H + (W - px);           // 下边：W+H → 2W+H
            } else {
                s = 2.0 * W + H + (H - py);    // 左边：2W+H → 2W+2H
            }
            if (mod(s, u_dash_length + u_gap_length) >= u_dash_length) {
                discard;
            }
        }
        float aa = fwidth(dist_to_edge);
        float in_stroke = 1.0 - smoothstep(u_stroke_width - aa, u_stroke_width + aa, dist_to_edge);
        out_color = mix(u_fill, u_stroke, in_stroke);
    } else {
        out_color = u_fill;
    }
}
`;
