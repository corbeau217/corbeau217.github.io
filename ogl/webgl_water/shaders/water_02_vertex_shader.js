export const VERTEX_SHADER_SRC = `

uniform mat4 u_mvp_matrix;   // model to world to camera to NDC matrix

uniform mat3 u_normal_matrix;   // transposed inverse of model view matrix

attribute vec4 a_vertex_position;
attribute vec2 a_vertex_reference;
attribute vec3 a_normal;

varying highp vec2 v_vertex_reference;
varying highp vec3 v_normal;

void main(){
    gl_PointSize = 10.0;

    // then prepare the point location
    gl_Position = u_mvp_matrix * a_vertex_position;

    // raw and wriggling
    v_vertex_reference = a_vertex_reference;
    v_normal = u_normal_matrix * normalize(a_normal.xyz);
}
`;