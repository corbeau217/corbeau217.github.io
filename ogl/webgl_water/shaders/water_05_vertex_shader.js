export const VERTEX_SHADER_SRC = `
// --- shape matrices ---
// (model -> world -> camera -> NDC) matrix
uniform mat4 u_mvp_matrix;
// transposed inverse of (model -> world -> camera) matrix
uniform mat3 u_normal_matrix;

// --- interpolation uniform ---
// x is used to interpolate our a_normal_1/a_noise_1
uniform vec3 u_time_val;

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

// what factor to speed up the colour shifting effect with
float noise_mixer_time_scale = 3.5;
float noise_usage_time_scale = 7.9;

// --- noise shifting values ---
float minimum_noise_mixing = 0.22;
float maximum_noise_mixing = 0.78;

float minimum_noise_usage = 0.01;
float maximum_noise_usage = 0.5;

void main(){
    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- general settings

    gl_PointSize = 10.0;

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- prepare height data

    float mixer_timer = (cos(u_time_val.z * noise_mixer_time_scale)+1.0)/2.0;
    float usage_timer = (cos(u_time_val.z * noise_usage_time_scale)+1.0)/2.0;

    float noise_mixer_lerp_t = (1.0-u_time_val.x) * minimum_noise_mixing  +  (u_time_val.x) * maximum_noise_mixing;
    float noise_usage_lerp_t = (1.0-usage_timer) * minimum_noise_usage  +  (usage_timer) * maximum_noise_usage;

    // make our cocktails of noise and normals
    vec3 noise_cocktail = mix(a_noise_1, a_noise_2, noise_mixer_lerp_t);
    vec3 normal_cocktail = mix(a_normal_1, a_normal_2, noise_mixer_lerp_t);

    vec3 noise_val = mix(vec3(0.0), noise_cocktail, noise_usage_lerp_t);
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