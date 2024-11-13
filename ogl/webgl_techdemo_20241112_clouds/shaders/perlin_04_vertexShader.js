const VERTEX_SHADER_SRC = `
attribute vec4 a_vertex_position;
attribute vec2 a_vertex_xy_id;
attribute vec2 a_vertex_perlin_vectors;

varying highp vec2 v_vertex_xy_id;
varying highp vec2 v_vertex_perlin_vectors;

void main(){
    gl_Position = a_vertex_position;

    // raw and wriggling
    v_vertex_xy_id = a_vertex_xy_id;
    v_vertex_perlin_vectors = a_vertex_perlin_vectors;

    // get the bottom left
    vec2 quad_xy_id = vec2( floor(a_vertex_xy_id.x), floor(a_vertex_xy_id.y) );
    // ivec2 quad_xy_id_int = ivec2(floor(quad_xy_id.x), floor(quad_xy_id).y);
}
`;

export { VERTEX_SHADER_SRC };