/**
 * Marker（实心三角箭头）顶点着色器。
 * 使用 gl_VertexID 选取三角形 3 个顶点，无需 VBO。
 *
 * 对象空间中尖端朝 +X（angle=0 时向右）：
 *   0: (0.00,  0.00)  尖端
 *   1: (-1.00, -0.45) 左翼
 *   2: (-1.00, +0.45) 右翼
 *
 * 乘以 u_size 后旋转 u_angle，再平移到 u_tip（局部坐标）。
 */
export const MARKER_VERT = /* glsl */ `#version 300 es
precision mediump float;

uniform mat3 u_projection;
uniform mat3 u_view;
uniform mat3 u_world;
uniform vec2 u_tip;
uniform float u_angle;
uniform float u_size;

const vec2 LOCAL_VERTS[3] = vec2[3](
    vec2( 0.00,  0.00),
    vec2(-1.00, -0.45),
    vec2(-1.00,  0.45)
);

void main() {
    vec2 local = LOCAL_VERTS[gl_VertexID] * u_size;
    float c = cos(u_angle);
    float s = sin(u_angle);
    vec2 rotated = vec2(c * local.x - s * local.y, s * local.x + c * local.y);
    vec2 world_pos = u_tip + rotated;
    vec3 clip = u_projection * u_view * u_world * vec3(world_pos, 1.0);
    gl_Position = vec4(clip.xy, 0.0, 1.0);
}
`;
