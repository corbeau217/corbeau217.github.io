export const VERTEX_SHADER_SRC = `

uniform mat4 u_model_matrix;        // model to world
uniform mat4 u_view_matrix;         // world to camera 
uniform mat4 u_projection_matrix;   // camera to NDC

attribute vec4 a_vertex_position;
attribute vec2 a_vertex_reference;

varying highp vec2 v_vertex_reference;

void main(){
    gl_PointSize = 10.0;

    // vec4 pos = u_projection_matrix * ( u_view_matrix * (u_model_matrix * a_vertex_position) );
    // gl_Position = pos;

    // build the mvp matrix
    mat4 mvp_matrix = u_projection_matrix * u_view_matrix * u_model_matrix;

    // then prepare the point location
    gl_Position = mvp_matrix * a_vertex_position;

    // raw and wriggling
    v_vertex_reference = a_vertex_reference;
}
`;