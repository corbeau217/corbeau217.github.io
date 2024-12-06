export const VERTEX_SHADER_SRC = `
attribute vec4 a_vertex_position;

void main(){
    gl_Position = a_vertex_position;
    gl_PointSize = 10.0;
}
`;