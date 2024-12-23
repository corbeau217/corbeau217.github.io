const TAU = 2.0*Math.PI;


const INITIAL_SCALE_VECTOR = [
  1.0, // i
  1.0, // j
  1.0, // k
];

var projectionMatrix = mat4.create();

// model to world matrix, just use identity for now
var modelMatrix = mat4.create();
var modelMatrix_translation = mat4.create();
var modelMatrix_rotation = mat4.create();
var modelMatrix_rotation_offKilter = mat4.create();
var modelMatrix_rotation_updateFactor = mat4.create();

// factor of TAU in radians
//  [1.0  * TAU] == 360
//  [0.75 * TAU] == 270
//  [0.5  * TAU] == 180
//  [0.25 * TAU] ==  90
var model_rotation_initial = [
  // Rx
  -(2.0/3.0)/4.0,
  // Ry
  0.0,
  // Rz
  0.05,
];
// anything other than y rotation tends to make it spin weird bc of the way we set up axises
const model_rotation_per_frame_factor = [
  0.0,
  0.1,
  0.0,
];




function initialise(){
  // heaper order, heading pitch roll
  mat4.rotateY(
    modelMatrix_rotation_offKilter,
    modelMatrix_rotation_offKilter,
    model_rotation_initial[1] * TAU,
  );
  mat4.rotateX(
    modelMatrix_rotation_offKilter,
    modelMatrix_rotation_offKilter,
    model_rotation_initial[0] * TAU,
  );
  mat4.rotateZ(
    modelMatrix_rotation_offKilter,
    modelMatrix_rotation_offKilter,
    model_rotation_initial[2] * TAU,
  );
}
initialise();

// where we build the model matrix
function rebuild_model_matrix(){
  // incase we have existing junk in the matrix
  mat4.identity(modelMatrix);

  // ---- translate ----
  // existing translation
  mat4.multiply(
    // destination
    modelMatrix,
    // left matrix
    modelMatrix,
    // right matrix
    modelMatrix_translation
  );

  // ---- rotation ----
  // existing rotation that was then translated
  mat4.multiply(
    // destination
    modelMatrix,
    // left matrix
    modelMatrix,
    // right matrix
    modelMatrix_rotation,
  );
  

}


function updateRotationMatrix(deltaTime){
  // wipe the rotation matrix
  modelMatrix_rotation = mat4.create();
  // rotate the update matrix

  mat4.rotateY(
    modelMatrix_rotation_updateFactor,
    modelMatrix_rotation_updateFactor,
    model_rotation_per_frame_factor[1] * TAU * deltaTime,
  );
  mat4.rotateX(
    modelMatrix_rotation_updateFactor,
    modelMatrix_rotation_updateFactor,
    model_rotation_per_frame_factor[0] * TAU * deltaTime,
  );
  mat4.rotateZ(
    modelMatrix_rotation_updateFactor,
    modelMatrix_rotation_updateFactor,
    model_rotation_per_frame_factor[2] * TAU * deltaTime,
  );

  // merge together in the overall one
  mat4.multiply(
    // destination
    modelMatrix_rotation,
    // left matrix
    modelMatrix_rotation_updateFactor,
    // right matrix
    modelMatrix_rotation_offKilter,
  );
}


function updateScene( gl, programInfo, buffers, cameraInfo, deltaTime ){

  // first arg as the destination to receive result
  mat4.perspective(projectionMatrix, cameraInfo.fieldOfView, cameraInfo.aspect, cameraInfo.zNear, cameraInfo.zFar);

  updateRotationMatrix(deltaTime);


  // TRS the model matrix
  rebuild_model_matrix();
}


// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 4;
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}


// tell webgl how to pull out the texture coordinates from buffer
function setTextureAttribute(gl, buffers, programInfo) {
  const num = 2; // every coordinate composed of 2 values
  const type = gl.FLOAT; // the data in the buffer is 32-bit float
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set to the next
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
  gl.vertexAttribPointer(
    programInfo.attribLocations.textureCoord,
    num,
    type,
    normalize,
    stride,
    offset,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}
  

function drawScene( gl, programInfo, circlePoints, buffers, texture, cameraInfo, deltaTime ){


  
  // clear canvase before we start drawing on it
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.DEPTH_BUFFER_BIT);

  
  gl.uniformMatrix4fv( programInfo.uniformLocations.modelMatrix, false, modelMatrix );

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  setPositionAttribute(gl, buffers, programInfo);

  setTextureAttribute(gl, buffers, programInfo);


  // set the shader uniforms
  gl.uniformMatrix4fv( programInfo.uniformLocations.projectionMatrix, false, projectionMatrix );
  gl.uniformMatrix4fv( programInfo.uniformLocations.viewMatrix, false, cameraInfo.viewMatrix );

  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);


  //                 ( mode, numElements, datatype, offset )
  // gl.drawElements(gl.LINE_STRIP, 60, gl.UNSIGNED_SHORT, 0);
  // gl.drawElements(gl.TRIANGLE_STRIP, (buffers.triangleCount*3), gl.UNSIGNED_SHORT, 0);
  gl.drawElements(gl.TRIANGLES, (4*circlePoints)*3, gl.UNSIGNED_SHORT, 0);

}

export { updateScene, drawScene };