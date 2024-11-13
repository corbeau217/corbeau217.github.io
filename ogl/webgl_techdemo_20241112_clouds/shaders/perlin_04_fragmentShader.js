const FRAGMENT_SHADER_SRC = `
precision highp float;

// #define VERTEX_COUNT 25

uniform vec2 u_quad_xy_count;
// uniform vec2 u_perlin_vectors[VERTEX_COUNT];

varying highp vec2 v_vertex_xy_id;
varying highp vec2 v_vertex_perlin_vectors;

void main() {
  // get the bottom left
  vec2 quad_xy_id = vec2( floor(v_vertex_xy_id.x), floor(v_vertex_xy_id.y) );

  // oh my god??
  // ivec2 quad_xy_id_int = ivec2(floor(quad_xy_id.x), floor(quad_xy_id).y);

  // where in the quad it is
  vec2 fragment_quad_location = vec2( v_vertex_xy_id.x - quad_xy_id.x, v_vertex_xy_id.y - quad_xy_id.y );

  // assign it to the colour channel
  gl_FragColor = vec4( v_vertex_perlin_vectors.x, v_vertex_perlin_vectors.y, 0.0, 1.0);
}
`;

export { FRAGMENT_SHADER_SRC };