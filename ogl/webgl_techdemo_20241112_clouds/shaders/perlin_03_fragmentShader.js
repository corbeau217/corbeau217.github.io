const FRAGMENT_SHADER_SRC = `
precision highp float;

uniform vec2 u_quad_xy_count;

varying highp vec2 v_vertex_xy_id;

void main() {
  // get the bottom left
  vec2 quad_xy_id = vec2( floor(v_vertex_xy_id.x), floor(v_vertex_xy_id.y) );

  // where in the quad it is
  vec2 fragment_quad_location = vec2( v_vertex_xy_id.x - quad_xy_id.x, v_vertex_xy_id.y - quad_xy_id.y );

  // assign it to the colour channel
  gl_FragColor = vec4( quad_xy_id.x/u_quad_xy_count.x, quad_xy_id.y/u_quad_xy_count.y, 0.0, 1.0);
}
`;

export { FRAGMENT_SHADER_SRC };