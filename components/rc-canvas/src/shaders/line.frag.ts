/** Line 片元着色器：纯色输出 + 边缘 AA；u_dash_length > 0 时启用虚线（mod 分段 discard） */
export const LINE_FRAG = /* glsl */ `#version 300 es
precision mediump float;

uniform vec4 u_color;
uniform float u_dash_length;
uniform float u_gap_length;

in float v_line_pos;
in float v_side;
out vec4 out_color;

void main() {
    if (u_dash_length > 0.0) {
        float phase = mod(v_line_pos, u_dash_length + u_gap_length);
        if (phase > u_dash_length) discard;
    }
    float aa = fwidth(v_side);
    float edge_alpha = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, abs(v_side));
    out_color = vec4(u_color.rgb, u_color.a * edge_alpha);
}
`;
