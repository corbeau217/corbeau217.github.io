const TAU = 2.0*Math.PI;



// function drawScene( gl, programInfo, can, cameraObject ){
function updateScene( gl, programInfo, can, cameraObject, deltaTime ){

  cameraObject.update(deltaTime);
  can.updateRotationMatrix(deltaTime);


  // TRS the model matrix
  can.rebuild_model_matrix();
}


  




// updateScene( gl, programInfo, can, camera, deltaTime );
// drawScene( gl, programInfo, can, camera, deltaTime );

// TODO: have it not rebuild the matrices every frame tbh omg 
// function drawScene( gl, programInfo, circlePoints, buffers, texture, cameraObject, deltaTime ){
function drawScene( gl, programInfo, can, cameraObject ){
  // // prepare globals
  // vertexNumber = (circlePoints+1)*2 + (circlePoints)*2;
  // triangleNumber = circlePoints*2 + circlePoints + circlePoints;


  
  // clear canvase before we start drawing on it
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.DEPTH_BUFFER_BIT);

  
  gl.uniformMatrix4fv( programInfo.uniformLocations.modelMatrix, false, can.getModelMatrix() );

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  can.setPositionAttribute(gl, programInfo);

  can.setTextureAttribute(gl, programInfo);


  // set the shader uniforms
  gl.uniformMatrix4fv( programInfo.uniformLocations.projectionMatrix, false, cameraObject.getProjectionMatrix() );
  gl.uniformMatrix4fv( programInfo.uniformLocations.viewMatrix, false, cameraObject.getViewMatrix() );

  can.prepareTexture(gl);

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);


  //                 ( mode, numElements, datatype, offset )
  // gl.drawElements(gl.LINE_STRIP, 60, gl.UNSIGNED_SHORT, 0);
  // gl.drawElements(gl.TRIANGLE_STRIP, (buffers.triangleCount*3), gl.UNSIGNED_SHORT, 0);
  gl.drawElements(gl.TRIANGLES, (4*can.getCirclePoints())*3, gl.UNSIGNED_SHORT, 0);

}

export { updateScene, drawScene }; // que pasa? modules?