const TAU = 2.0*Math.PI;
// var rotationFactorZ = 0.0;

const perVertexFloats = 3;
// const circlePoints = 12;
//          (bottom+bottomCenter) + (top+topCenter) + (sideBottoms+sideTops)
let vertexNumber;
//                      side triangles  +   bottom  +  top
let triangleNumber;



const projectionMatrix = mat4.create();

// model to world matrix, just use identity for now
var modelMatrix = mat4.create();

// mat4.translate(
//   modelMatrix,
//   modelMatrix,
//   [0,0,0]
// );

mat4.rotateX(
  modelMatrix,
  modelMatrix,
  -TAU/4
);

mat4.scale(
  modelMatrix,
  modelMatrix,
  [ 1.8, 1.8, 1.8 ]
);


var rotationFactorX = 0;
var rotationFactorY = 0;
var rotationFactorZ = 0;

const ROTATION_FACTOR = 1/15.0;



function updateScene( gl, programInfo, buffers, cameraInfo, deltaTime ){
    rotationFactorX = deltaTime*0.1*ROTATION_FACTOR*(TAU);
    rotationFactorY = -deltaTime*0.1*ROTATION_FACTOR*(TAU);
    rotationFactorZ = deltaTime*ROTATION_FACTOR*(TAU);


    // first arg as the destination to receive result
    mat4.perspective(projectionMatrix, cameraInfo.fieldOfView, cameraInfo.aspect, cameraInfo.zNear, cameraInfo.zFar);

    // TRS the model matrix
    // ---- rotation ----
    mat4.rotateY(
        modelMatrix,//dest
        modelMatrix,//source
        rotationFactorY,// angle
    );
    mat4.rotateX(
        modelMatrix,//dest
        modelMatrix,//source
        rotationFactorX,// angle
    );
    mat4.rotateZ(
        modelMatrix,//dest
        modelMatrix,//source
        rotationFactorZ,// angle
    );
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
  




// TODO: have it not rebuild the matrices every frame tbh omg 
function drawScene( gl, programInfo, circlePoints, buffers, texture, cameraInfo, deltaTime ){
    // prepare globals
    vertexNumber = (circlePoints+1)*2 + (circlePoints)*2;
    triangleNumber = circlePoints*2 + circlePoints + circlePoints;


    
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

export { updateScene, drawScene }; // que pasa? modules?