attribute vec4 aVertexPosition;
uniform mat4 u_model_matrix;

void main(){
    gl_Position = u_model_matrix * aVertexPosition;
}