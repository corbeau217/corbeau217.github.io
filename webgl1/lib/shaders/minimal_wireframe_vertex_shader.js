export const VERTEX_SHADER_SRC = `
// --- uniforms, for all vertices ---
// (model -> world -> camera -> NDC) matrix
uniform mat4 u_model_to_ndc_matrix;

// --- attributes, for current vertex ---
attribute vec4  a_vertex_position;
attribute vec4  a_vertex_colour;

// --- varyings, for fragment shader, interpolated ---
varying highp vec4 v_vertex_colour;

void main(){
    // prepare settings
    gl_Position = u_model_to_ndc_matrix * a_vertex_position;
    gl_PointSize = 5.0;

    // interpolate in frag shader
    v_vertex_colour = vec4(a_vertex_colour.xyz,1.0);
}
`;