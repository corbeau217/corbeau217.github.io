const FRAGMENT_SHADER_SRC = `
precision highp float;

varying highp float v_light_intensity;


vec4 shape_colour = vec4(0.9,0.5,0.2,1.0);

void main() {

  gl_FragColor = vec4(v_light_intensity*shape_colour.x, v_light_intensity*shape_colour.y, v_light_intensity*shape_colour.z, 1.0);
}
`;

export { FRAGMENT_SHADER_SRC };