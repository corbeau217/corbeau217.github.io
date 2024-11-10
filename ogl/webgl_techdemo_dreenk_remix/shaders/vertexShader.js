const VERTEX_SHADER_SRC = `
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main(){
    vec4 pos = uProjectionMatrix * ( uViewMatrix * (uModelMatrix * aVertexPosition) );
    gl_Position = pos;
    vTextureCoord = aTextureCoord;
}
`;

export { VERTEX_SHADER_SRC };