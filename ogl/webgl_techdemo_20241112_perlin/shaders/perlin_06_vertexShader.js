const VERTEX_SHADER_SRC = `
attribute vec4 a_vertex_position;
attribute vec2 a_vertex_xy_id;

varying highp vec2 v_vertex_xy_id;

void main(){
    gl_Position = a_vertex_position;

    // raw and wriggling
    v_vertex_xy_id = a_vertex_xy_id;
}
`;

export { VERTEX_SHADER_SRC };