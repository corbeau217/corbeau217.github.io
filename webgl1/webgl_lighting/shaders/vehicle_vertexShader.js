const VERTEX_SHADER_SRC = `
attribute vec4 aVertexPosition;
uniform mat4 u_model_matrix;
uniform mat4 u_view_matrix;
uniform mat4 u_projection_matrix;

void main(){
    gl_PointSize=15.0;
    vec4 pos = u_projection_matrix * ( u_view_matrix * (u_model_matrix * aVertexPosition) );
    gl_Position = pos;
}
`;

export { VERTEX_SHADER_SRC };