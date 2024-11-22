export const VERTEX_SHADER_SRC = `
// --- shape matrices ---
// (model -> world -> camera -> NDC) matrix
uniform mat4 u_mvp_matrix;
uniform mat3 u_normal_matrix;

// --- location data ---
attribute vec4 a_vertex_position;
attribute vec3 a_normal;

// --- fragment variables ---
varying highp vec3 v_normal;

void main(){
    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- general settings

    gl_PointSize = 7.0;

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- location information

    // then prepare the point location
    gl_Position = u_mvp_matrix * a_vertex_position;

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---- varyings for fragment shader
    vec3 normal_val = a_normal.xyz;

    v_normal = u_normal_matrix * normalize(normal_val);

    // ---------------------------------------------------------
    // ---------------------------------------------------------
}`;