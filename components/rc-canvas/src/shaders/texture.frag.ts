/**
 * Texture 片元着色器：Image（u_mode=0）和 Text glyph（u_mode=1）。
 *
 * Image 模式：直接采样 RGBA 纹理，乘以 u_opacity。
 * Text 模式（SDF）：纹理 R 通道为有符号距离场（0.5=边缘，>0.5=内部，<0.5=外部）。
 *   用 fwidth 计算当前屏幕像素对应的 SDF 变化率，动态调整 smoothstep 宽度，
 *   在任意缩放级别下都能保持清晰边缘（放大时锐利，缩小时适度抗锯齿）。
 */
export const TEXTURE_FRAG = /* glsl */ `#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform float u_opacity;
uniform vec4 u_color;
uniform int u_mode;

in vec2 v_uv;
out vec4 out_color;

void main() {
    if (u_mode == 1) {
        float dist = texture(u_texture, v_uv).r;
        // fwidth 给出相邻屏幕像素间 dist 的变化量，据此自适应 smoothstep 宽度：
        //   缩放大时 fwidth 小 → 边缘锐利；缩放小时 fwidth 大 → 边缘平滑（抗锯齿）
        float smoothing = fwidth(dist) * 0.7;
        float alpha = smoothstep(0.5 - smoothing, 0.5 + smoothing, dist);
        out_color = vec4(u_color.rgb, alpha * u_color.a * u_opacity);
    } else {
        out_color = texture(u_texture, v_uv) * u_opacity;
    }
}
`;
