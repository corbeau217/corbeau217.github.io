const FRAGMENT_SHADER_SRC = `
precision highp float;

varying highp vec4 v_normal;

void main() {
  gl_FragColor = vec4(v_normal.x, v_normal.y, v_normal.z, 1);
}
`;

export { FRAGMENT_SHADER_SRC };