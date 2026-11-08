/**
 * Texture 片元着色器：Image（u_mode=0）、SDF Text（u_mode=1）、Bitmap Text（u_mode=2）。
 *
 * Image 模式：直接采样 RGBA 纹理，乘以 u_opacity。
 * SDF 模式：纹理 R 通道为有符号距离场（0.5=边缘，>0.5=内部）。
 * Bitmap 模式：纹理 R 通道为按 dpr 光栅化的 coverage alpha，直接调制颜色，
 *   无距离场重建——1:1 物理像素对齐时保留浏览器原生文本渲染的全部细节。
 */
export const TEXTURE_FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform float u_opacity;
uniform vec4 u_color;
uniform int u_mode;

in vec2 v_uv;
out vec4 out_color;

void main() {
    if (u_mode == 1) {
        // SDF：单通道 R
        float dist = texture(u_texture, v_uv).r;
        // Keep the original contour at 0.5: expanding it thickens small text
        // and closes counters. A nonzero interval also avoids undefined
        // smoothstep results on flat distance-field regions.
        float smoothing = max(fwidth(dist) * 0.5, 0.0001);
        float alpha = smoothstep(0.5 - smoothing, 0.5 + smoothing, dist);
        out_color = vec4(u_color.rgb, alpha * u_color.a * u_opacity);
    } else if (u_mode == 2) {
        // Bitmap 文本：R 通道即 coverage alpha
        float alpha = texture(u_texture, v_uv).r;
        out_color = vec4(u_color.rgb, alpha * u_color.a * u_opacity);
    } else {
        out_color = texture(u_texture, v_uv) * u_opacity;
    }
}
`;
