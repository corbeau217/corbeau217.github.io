export const FRAGMENT_SHADER_SRC = `
precision highp float;

// taken from vertex shader
varying highp vec2 v_uv_mapping;
varying highp vec3 v_normal;


vec3 light_source_vec = vec3( -2.0, 5.0, 4.0 );
vec3 normalized_light_direction = normalize(light_source_vec);

float ambient = 0.3;


void main() {
  float light_lambert = max( dot(v_normal, normalized_light_direction), 0.0);

  float light_intensity = min( (ambient+light_lambert), 1.0);

  float material_r = light_intensity*v_uv_mapping.x;
  float material_g = light_intensity*v_uv_mapping.y;
  float material_b = 0.0;

  vec3 material_rgb = vec3(material_r, material_g, material_b);

  gl_FragColor = vec4(material_rgb, 1.0);
}
`;