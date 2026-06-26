/**
 * Line 专用顶点着色器：line extrusion。
 *
 * 顶点布局（每个顶点 2 个 float）：
 *   location 0: a_side — -1.0（左）或 +1.0（右），控制法向偏移方向
 *   location 1: a_t   —  0.0（起点）或 1.0（终点）
 *
 * 在顶点着色器中，将线段两端点沿法向各偏移 lineWidth/2，
 * 构成宽度为 lineWidth 的四边形，避免上传每帧的顶点数据。
 */
export const LINE_VERT = /* glsl */ `#version 300 es
precision mediump float;

layout(location = 0) in float a_side;
layout(location = 1) in float a_t;

uniform mat3 u_projection;
uniform mat3 u_view;
uniform mat3 u_world;
uniform vec2 u_start;
uniform vec2 u_end;
uniform float u_line_width;

out float v_line_pos;
out float v_side;

void main() {
    vec2 dir = u_end - u_start;
    float len = length(dir);
    vec2 unit_dir = len > 0.0 ? dir / len : vec2(1.0, 0.0);
    vec2 normal = vec2(-unit_dir.y, unit_dir.x);

    vec2 pos = mix(u_start, u_end, a_t) + normal * (a_side * u_line_width * 0.5);
    vec3 clip = u_projection * u_view * u_world * vec3(pos, 1.0);
    gl_Position = vec4(clip.xy, 0.0, 1.0);
    v_line_pos = a_t * len;
    v_side = a_side;
}
`;
