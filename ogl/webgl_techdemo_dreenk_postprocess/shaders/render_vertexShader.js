const VERTEX_SHADER_SRC = `
attribute vec4 aVertexPosition;

void main(){
    gl_Position = aVertexPosition;
}
`;

export { VERTEX_SHADER_SRC };