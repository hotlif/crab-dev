/** Marker 片元着色器：纯色输出 */
export const MARKER_FRAG = /* glsl */ `#version 300 es
precision mediump float;

uniform vec4 u_color;

out vec4 out_color;

void main() {
    out_color = u_color;
}
`;
