export const FRAGMENT_SHADER_SRC = `
precision highp float;

uniform sampler2D u_texture;
varying highp vec2 v_texcoord;



void main() {

  // prepare the frag value as black
  vec4 frag_value = vec4(0,0,0,1);

  // get the pixel coordinate inside view space
  // vec2 pixel_coord =  vec2( floor(u_texture_size.x * v_texcoord.x), floor(u_texture_size.y * v_texcoord.y) );


  vec4 texture_value = texture2D(u_texture, v_texcoord);

  // ================================================================

  // set the fragment colour
  gl_FragColor = vec4( 0.0, texture_value.g, texture_value.b, 1.0);
}
`;