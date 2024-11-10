
import { Camera } from "./objects/camera.js";
import { Can } from "./objects/can.js";

const TAU = 2.0*Math.PI;

class Scene {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // ...
    constructor( gl_context, programInfo ){
        // ..
        this.gl_context = gl_context;
        this.programInfo = programInfo;
        
        this.aspectRatio = gl_context.canvas.clientWidth / gl_context.canvas.clientHeight;

        // generate the camera
        this.camera = new Camera(this.aspectRatio);
        // here's where we call the "routine" that builds all the objs we'll be drawing
        // buffers = initBuffers(gl,CIRCLE_POINTS);
        this.can = new Can( this.gl_context );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    update( deltaTime ){
        this.camera.update(deltaTime);
        this.can.updateRotationMatrix(deltaTime);
        
        
        // TRS the model matrix
        this.can.rebuild_model_matrix();
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(){
      
      
        
        // clear canvas before we start drawing on it
        this.gl_context.clear(this.gl_context.COLOR_BUFFER_BIT);
        this.gl_context.clear(this.gl_context.DEPTH_BUFFER_BIT);
      
        
        this.gl_context.uniformMatrix4fv( this.programInfo.uniformLocations.modelMatrix, false, this.can.getModelMatrix() );
      
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        this.can.setPositionAttribute(this.gl_context, this.programInfo);
      
        this.can.setTextureAttribute(this.gl_context, this.programInfo);
      
      
        // set the shader uniforms
        this.gl_context.uniformMatrix4fv( this.programInfo.uniformLocations.projectionMatrix, false, this.camera.getProjectionMatrix() );
        this.gl_context.uniformMatrix4fv( this.programInfo.uniformLocations.viewMatrix, false, this.camera.getViewMatrix() );
      
        this.can.prepareTexture(this.gl_context);
      
        // Tell the shader we bound the texture to texture unit 0
        this.gl_context.uniform1i(this.programInfo.uniformLocations.uSampler, 0);
      
      
        //                 ( mode, numElements, datatype, offset )
        // gl.drawElements(gl.LINE_STRIP, 60, gl.UNSIGNED_SHORT, 0);
        // gl.drawElements(gl.TRIANGLE_STRIP, (buffers.triangleCount*3), gl.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.TRIANGLES, (4*this.can.getCirclePoints())*3, this.gl_context.UNSIGNED_SHORT, 0);
    }
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

export { Scene }; // que pasa? modules?