export const FRAGMENT_SHADER_SRC = `
precision highp float;

uniform vec3 u_light_source_vector;
uniform vec2 u_mesh_quad_count;

varying highp vec2 v_vertex_reference;
varying highp vec3 v_normal;



void main() {
  // where in the quad it is
  vec2 fragment_quad_location = vec2( mod(v_vertex_reference.x,1.0), mod(v_vertex_reference.y,1.0) );

  // assign it to the colour channel
  gl_FragColor = vec4( v_normal.xyz, 1.0);
}
`;