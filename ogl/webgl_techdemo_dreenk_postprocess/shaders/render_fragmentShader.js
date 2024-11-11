const FRAGMENT_SHADER_SRC = `
precision highp float;

void main() {
  // blue
  gl_FragColor = vec4(0, 0, 1, 1);
}
`;

export { FRAGMENT_SHADER_SRC };