
import { Camera } from "./objects/camera.js";
import { Can } from "./objects/can.js";

const TAU = 2.0*Math.PI;

var aspectRatio;

var camera;
var can;


function initScene( gl_context ){


  aspectRatio = gl_context.canvas.clientWidth / gl_context.canvas.clientHeight;

  // generate the camera
  camera = new Camera(aspectRatio);
  // here's where we call the "routine" that builds all the objs we'll be drawing
  // buffers = initBuffers(gl,CIRCLE_POINTS);
  can = new Can( gl_context );
}


// function drawScene( gl, programInfo, can, cameraObject ){
function updateScene( gl, programInfo, deltaTime ){

  camera.update(deltaTime);
  can.updateRotationMatrix(deltaTime);


  // TRS the model matrix
  can.rebuild_model_matrix();
}


  




// updateScene( gl, programInfo, can, camera, deltaTime );
// drawScene( gl, programInfo, can, camera, deltaTime );

// TODO: have it not rebuild the matrices every frame tbh omg 
// function drawScene( gl, programInfo, circlePoints, buffers, texture, cameraObject, deltaTime ){
function drawScene( gl, programInfo ){
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
  gl.uniformMatrix4fv( programInfo.uniformLocations.projectionMatrix, false, camera.getProjectionMatrix() );
  gl.uniformMatrix4fv( programInfo.uniformLocations.viewMatrix, false, camera.getViewMatrix() );

  can.prepareTexture(gl);

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);


  //                 ( mode, numElements, datatype, offset )
  // gl.drawElements(gl.LINE_STRIP, 60, gl.UNSIGNED_SHORT, 0);
  // gl.drawElements(gl.TRIANGLE_STRIP, (buffers.triangleCount*3), gl.UNSIGNED_SHORT, 0);
  gl.drawElements(gl.TRIANGLES, (4*can.getCirclePoints())*3, gl.UNSIGNED_SHORT, 0);

}

export { initScene, updateScene, drawScene }; // que pasa? modules?