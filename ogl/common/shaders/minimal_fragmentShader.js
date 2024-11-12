const FRAGMENT_SHADER_SRC = `
precision highp float;

uniform vec4 u_colour;

void main() {
  gl_FragColor = u_colour;
}
`;

export { FRAGMENT_SHADER_SRC };