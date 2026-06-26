/**
 * Flat 顶点着色器：用于无圆角 Rect。
 * 将单位四边形 [0,0]~[1,1] 映射到 u_bounds 指定的像素空间矩形，
 * 再经世界矩阵和正交投影矩阵变换到 clip space。
 */
export const FLAT_VERT = /* glsl */ `#version 300 es
precision mediump float;

layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_uv;

uniform mat3 u_projection;
uniform mat3 u_view;
uniform mat3 u_world;
uniform vec4 u_bounds;

out vec2 v_uv;

void main() {
    vec2 local = vec2(
        u_bounds.x + a_position.x * u_bounds.z,
        u_bounds.y + a_position.y * u_bounds.w
    );
    vec3 clip = u_projection * u_view * u_world * vec3(local, 1.0);
    gl_Position = vec4(clip.xy, 0.0, 1.0);
    v_uv = a_uv;
}
`;
