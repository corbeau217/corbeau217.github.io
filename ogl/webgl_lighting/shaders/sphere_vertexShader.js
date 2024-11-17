const VERTEX_SHADER_SRC = `
attribute vec4 a_vertex_position;
attribute vec4 a_normal;

uniform mat4 u_model_matrix;
uniform mat4 u_view_matrix;
uniform mat4 u_projection_matrix;

varying highp vec4 v_normal;

void main(){
    gl_PointSize=15.0;
    vec4 pos = u_projection_matrix * ( u_view_matrix * (u_model_matrix * a_vertex_position) );
    gl_Position = pos;
    v_normal = normalize(a_normal);
}
`;

export { VERTEX_SHADER_SRC };