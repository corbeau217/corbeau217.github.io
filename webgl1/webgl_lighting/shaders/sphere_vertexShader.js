const VERTEX_SHADER_SRC = `
attribute vec4 a_vertex_position;
// attribute vec4 a_normal;

uniform mat4 u_normal_matrix;
uniform mat4 u_model_matrix;
uniform mat4 u_view_matrix;
uniform mat4 u_projection_matrix;

varying highp vec4 v_normal;

void main(){
    gl_PointSize=15.0;
    vec4 pos = u_projection_matrix * ( u_view_matrix * (u_model_matrix * a_vertex_position) );
    gl_Position = pos;
    
    // broken
    // vec3 normal_source = normalize(a_normal.xyz);
    // honestly just use this
    vec3 normal_source = normalize(a_vertex_position.xyz);

    // make it a vec4 for use with our matrix
    vec4 normal_vec = vec4( normal_source, 0.0 );
    v_normal = u_normal_matrix * normal_vec;
}
`;

export { VERTEX_SHADER_SRC };