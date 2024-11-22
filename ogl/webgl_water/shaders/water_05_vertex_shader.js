export const VERTEX_SHADER_SRC = `
// --- shape matrices ---
// (model -> world -> camera -> NDC) matrix
uniform mat4 u_mvp_matrix;
// transposed inverse of (model -> world -> camera) matrix
uniform mat3 u_normal_matrix;

// --- interpolation uniform ---
uniform vec2 u_noise_settings;

// --- location data ---
attribute vec4 a_vertex_position;

// interpolate between for the normal
attribute vec3 a_normal_raw;
attribute vec3 a_normal_1;
attribute vec3 a_normal_2;

// --- noise data ---
// interpolate between for the noise
attribute vec3 a_noise_1;
attribute vec3 a_noise_2;

// --- fragment variables ---
varying highp vec3 v_normal;
varying highp vec3 v_noise;
varying highp vec3 v_colour_variance;


// --- colour factors ---
uniform vec3 u_shape_colour_darkest;
uniform vec3 u_shape_colour_lightest;

// --- noise shifting values ---

// used to interpolate between normal/noise pairs
float noise_mixer_lerp_t = u_noise_settings.x;

// used to interpolate between none or full noise
float noise_usage_lerp_t = u_noise_settings.y;

// when not using noise
vec3 no_noise_vector = vec3(0.0);

void main(){
    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- general settings

    gl_PointSize = 10.0;

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- prepare height data

    // make our cocktails of noise and normals
    vec3 noise_cocktail = mix(a_noise_1, a_noise_2, noise_mixer_lerp_t);
    vec3 normal_cocktail = mix(a_normal_1, a_normal_2, noise_mixer_lerp_t);

    vec3 noise_val = mix(no_noise_vector, noise_cocktail, noise_usage_lerp_t);
    vec3 normal_val = mix(a_normal_raw, normal_cocktail, noise_usage_lerp_t);

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- location information

    vec3 position_with_noise = a_vertex_position.xyz + noise_val;

    // then prepare the point location
    gl_Position = u_mvp_matrix * vec4( position_with_noise, 1.0);

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- process the colour
    
    // now in 0.0-1.0 range
    float colour_lerp_t = position_with_noise.y;

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- varyings for fragment shader

    v_noise = noise_val;
    v_normal = u_normal_matrix * normalize(normal_val);
    v_colour_variance = mix(u_shape_colour_darkest, u_shape_colour_lightest, colour_lerp_t);

    // ---------------------------------------------------------
    // ---------------------------------------------------------
}

`;