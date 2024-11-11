const VERTEX_SHADER_SRC = `
attribute vec4 a_vertex_position;
attribute vec2 a_texcoord;

// a varying to pass the texture coordinates to the fragment shader
varying highp vec2 v_texcoord;

// uniform vec2 u_screen_size;

void main(){
    gl_Position = a_vertex_position;
    // Pass the texcoord to the fragment shader.
    v_texcoord = a_texcoord;
}
`;

export { VERTEX_SHADER_SRC };