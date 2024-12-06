const FRAGMENT_SHADER_SRC = `
precision highp float;

varying highp vec4 v_normal;

float ambient = 0.1;
float percent_diffuse = (1.0-ambient);
vec3 light_source_vec = vec3( -2.0, 5.0, 4.0 );
vec4 light_direction_vec = vec4( normalize(light_source_vec), 0.0 );

vec4 shape_colour = vec4(0.9,0.5,0.2,1.0);


void main() {

  float light_lambert = max( dot(v_normal, light_direction_vec) , 0.0);

  float light_intensity = min( (ambient+light_lambert), 1.0);

  gl_FragColor = vec4(light_intensity*shape_colour.x, light_intensity*shape_colour.y, light_intensity*shape_colour.z, 1.0);
}
`;

export { FRAGMENT_SHADER_SRC };