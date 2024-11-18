export const FRAGMENT_SHADER_SRC = `
precision highp float;

uniform vec2 u_mesh_quad_count;

varying highp vec2 v_vertex_reference;

void main() {
  // where in the quad it is
  vec2 fragment_quad_location = vec2( mod(v_vertex_reference.x,1.0), mod(v_vertex_reference.y,1.0) );

  // assign it to the colour channel
  gl_FragColor = vec4( fragment_quad_location.x/u_mesh_quad_count.x, fragment_quad_location.y/u_mesh_quad_count.y, 0.0, 1.0);
}
`;