export const VERTEX_SHADER_SRC = `
// --- shape matrices ---
// (model -> world -> camera -> NDC) matrix
uniform mat4 u_mvp_matrix;
// transposed inverse of (model -> world -> camera) matrix
uniform mat3 u_normal_matrix;

// --- interpolation uniform ---
// x is used to interpolate our a_normal/a_noise
uniform vec3 u_time_val;

// --- location data ---
attribute vec4 a_vertex_position;
attribute vec2 a_vertex_reference;

// interpolate between for the normal
attribute vec3 a_normal;
attribute vec3 a_normal_2;

// --- noise data ---
// interpolate between for the noise
attribute vec3 a_noise;
attribute vec3 a_noise_2;

// --- fragment variables ---
varying highp vec3 v_normal;
varying highp vec3 v_noise;
varying highp vec3 v_colour_variance;


// --- colour factors ---
vec3 colour_element_1 = vec3( 0.055, 0.302, 0.573 );
vec3 colour_element_2 = vec3( 0.788, 0.914, 1.000 );

// what factor to speed up the colour shifting effect with
float colour_lerp_time_scale = 7.0;

// --- noise shifting values ---
float minimum_t = 0.3;
float maximum_t = 0.7;

void main(){
    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- general settings

    gl_PointSize = 10.0;

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- prepare height data
    
    float height_lerp_t = (1.0-u_time_val.x) * minimum_t  +  (u_time_val.x) * maximum_t;

    vec3 noise_val = mix(a_noise, a_noise_2, height_lerp_t);
    vec3 normal_val = mix(a_normal, a_normal_2, height_lerp_t);

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- process the colour

    // get it as a smooth function
    float colour_time_val = sin( colour_lerp_time_scale * u_time_val.z );
    
    // now in 0.0-1.0 range
    float colour_lerp_t = (colour_time_val+1.0)/2.0;

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- location information

    // then prepare the point location
    gl_Position = u_mvp_matrix * vec4((a_vertex_position.xyz + noise_val), 1.0);

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- varyings for fragment shader

    v_noise = noise_val;
    v_normal = u_normal_matrix * normalize(normal_val);
    v_colour_variance = mix(colour_element_1, colour_element_2, colour_lerp_t);

    // ---------------------------------------------------------
    // ---------------------------------------------------------
}

`;