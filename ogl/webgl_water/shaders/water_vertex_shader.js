export const VERTEX_SHADER_SRC = `
attribute vec4 a_vertex_position;
attribute vec2 a_vertex_reference;

varying highp vec2 v_vertex_reference;

void main(){
    gl_PointSize = 10.0;
    gl_Position = a_vertex_position;

    // raw and wriggling
    v_vertex_reference = a_vertex_reference;
}
`;