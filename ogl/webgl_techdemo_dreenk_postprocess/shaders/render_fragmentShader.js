const FRAGMENT_SHADER_SRC = `
precision mediump float;

varying mediump vec2 v_texcoord;

uniform sampler2D u_texture;

void main() {
  vec4 frag_value = texture2D(u_texture, v_texcoord);
  gl_FragColor = vec4(frag_value.xyz,1);
}
`;

export { FRAGMENT_SHADER_SRC };