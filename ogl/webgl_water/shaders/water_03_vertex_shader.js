export const VERTEX_SHADER_SRC = `

// --- shape matrices ---

// (model -> world -> camera -> NDC) matrix
uniform mat4 u_mvp_matrix;
// transposed inverse of (model -> world -> camera) matrix
uniform mat3 u_normal_matrix;


// --- location data ---
attribute vec4 a_vertex_position;
attribute vec2 a_vertex_reference;
attribute vec3 a_normal;

// --- noise data ---
attribute vec3 a_noise;

// --- fragment variables ---
varying highp vec3 v_normal;
varying highp vec3 v_noise;

void main(){
    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- general settings

    gl_PointSize = 10.0;

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- location information

    // then prepare the point location
    gl_Position = u_mvp_matrix * vec4((a_vertex_position.xyz + a_noise), 1.0);
    // gl_Position = u_mvp_matrix * a_vertex_position;

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- varyings for fragment shader
    v_noise = a_noise;
    v_normal = u_normal_matrix * normalize(a_normal.xyz);

    // ---------------------------------------------------------
    // ---------------------------------------------------------
}
`;