export const FRAGMENT_SHADER_SRC = `
precision highp float;

// --- light information ---
uniform vec3 u_light_source_vector;
uniform vec3 u_light_ambient_intensity;

// --- shape material ---
uniform vec4 u_shape_colour;

// --- mesh shaping ---
varying highp vec3 v_normal;
varying highp vec3 v_noise;

// --- mesh colouring ---
varying highp vec3 v_colour_variance;

void main() {
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---- determine the lighting

  vec3 normalised_light_source = normalize(u_light_source_vector);

  // the lambert value for our light
  vec3 diffuse_intensity = vec3(max( dot(v_normal, normalised_light_source), 0.0));

  vec3 light_intensity = u_light_ambient_intensity + diffuse_intensity;


  float clamped_light_intensity_r = min( light_intensity.r, 1.0 );
  float clamped_light_intensity_g = min( light_intensity.g, 1.0 );
  float clamped_light_intensity_b = min( light_intensity.b, 1.0 );


  // the one we use later with our material
  vec3 final_light = vec3( clamped_light_intensity_r, clamped_light_intensity_g, clamped_light_intensity_b );

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---- determine final material colouring
  
  // float colour_r = min( u_shape_colour.r+v_colour_variance.r, 0.3 );
  // float colour_g = min( u_shape_colour.g+v_colour_variance.g, 0.3 );
  // float colour_b = min( u_shape_colour.b+v_colour_variance.b, 1.0 );
  // vec3 shape_colouring = vec3( colour_r, colour_g, colour_b );
  vec3 hide_warnings = vec3( 0.05*u_shape_colour.x, 0.05*u_shape_colour.y, 0.05*u_shape_colour.z );
  vec3 shape_colouring = v_colour_variance + hide_warnings;

  vec3 final_colour = final_light * shape_colouring;
  
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---- finish up
  gl_FragColor = vec4( final_colour, 1.0);
  
  // ---------------------------------------------------------
  // ---------------------------------------------------------
}
`;