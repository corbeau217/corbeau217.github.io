const VERTEX_SHADER_SRC = `
attribute vec4 aVertexPosition;
uniform mat4 u_model_matrix;

void main(){
    gl_Position = u_model_matrix * aVertexPosition;
}
`;

export { VERTEX_SHADER_SRC };