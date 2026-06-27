/**
 * Marker（实心箭头）顶点着色器。
 * 使用 gl_VertexID 选取 2 个三角形（6 顶点）拼出带凹口的经典箭头，无需 VBO。
 *
 * 对象空间中尖端朝 +X（angle=0 时向右），尾部带凹口（更像箭头、不臃肿）：
 *   尖端  TIP   = ( 0.00,  0.00)
 *   上翼  TOP   = (-1.00,  0.42)
 *   凹口  NOTCH = (-0.62,  0.00)
 *   下翼  BOT   = (-1.00, -0.42)
 * 两三角：(TIP, TOP, NOTCH) 与 (TIP, NOTCH, BOT)。
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

const vec2 TIP   = vec2( 0.00,  0.00);
const vec2 TOP   = vec2(-1.00,  0.42);
const vec2 NOTCH = vec2(-0.62,  0.00);
const vec2 BOT   = vec2(-1.00, -0.42);

const vec2 LOCAL_VERTS[6] = vec2[6](
    TIP, TOP, NOTCH,
    TIP, NOTCH, BOT
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
