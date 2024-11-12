const FRAGMENT_SHADER_SRC = `
precision highp float;

uniform vec2 u_vertex_xy_count;

varying highp vec2 v_vertex_xy_id;

void main() {
  // where in the quad it is
  vec2 fragment_quad_location = vec2( mod(v_vertex_xy_id.x,1.0), mod(v_vertex_xy_id.y,1.0) );

  // assign it to the colour channel
  gl_FragColor = vec4( fragment_quad_location.x, fragment_quad_location.y, 0.0, 1.0);
}
`;

export { FRAGMENT_SHADER_SRC };