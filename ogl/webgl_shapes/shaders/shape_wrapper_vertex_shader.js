export const VERTEX_SHADER_SRC = `
// --- shape matrices ---
// (model -> world -> camera -> NDC) matrix
uniform mat4 u_mvp_matrix;

// --- location data ---
attribute vec4 a_vertex_position;

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

    // ...

    // ---------------------------------------------------------
    // ---------------------------------------------------------
}`;