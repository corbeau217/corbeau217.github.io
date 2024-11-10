import { initBuffers } from "./init-buffers.js";
import { updateScene, drawScene } from "./draw-scene.js";
import { VERTEX_SHADER_SRC } from "./vertexShader.js";
import { FRAGMENT_SHADER_SRC } from "./fragmentShader.js";



// ############################################################################################
// ############################################################################################
// ############################################################################################

window.addEventListener(
    "load",
    (event) => {
        console.log("starting webgl app");
        startApp();
    }
);

// ############################################################################################
// ############################################################################################
// ############################################################################################

const TAU = 2.0*Math.PI;


const CIRCLE_POINTS = 16;

// ------------------------------------------------
// ------------------------------------------------
// ------- settings

// just needed to be before the main call?
let fps = 40;
var timeBetweenFrames = 1000.0/fps;
//   0.0 to 1.0:     [   R,   G,   B,   A ]
var canvasClearColour = [ 0.2, 0.2, 0.2, 1.0 ];
//    needs negative  [   -x,   -y,   -z ]
var CAMERA_OFFSET = [ -0.0, -0.0, -8.0 ];
var CAMERA_FOV = 1.2*TAU/7.0;
var CAMERA_ZNEAR = 1;
var CAMERA_ZFAR = 50.0;

// ############################################################################################
// ############################################################################################
// ############################################################################################


var texture_path = "./img/dreenk.png";

// ############################################################################################
// ############################################################################################
// ############################################################################################

var canvas;
var gl;
var shader_program;

// ############################################################################################
// ############################################################################################
// ############################################################################################

var programInfo;
var cameraViewMat;
var cameraInfo;
var oldTime;
var buffers;
var texture;

// ############################################################################################
// ############################################################################################
// ############################################################################################

// init a shader program, so WebGL knows how to draw our data
function initShaderProgram(vsSourceIn, fsSourceIn){

    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSourceIn);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSourceIn);

    // ------------------------------------------------
    // ------------------------------------------------

    // create the shader program

    // create, then attach the parts, then link it to the canvas instance
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // if creating the shader program failed tell the user about it
    if( !gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) ){
        alert(
            `unable to init the shader program: ${gl.getProgramInfoLog( // this is vry cool tbh, i likey
                shaderProgram, // another comma??? @mdn-tutorial pls why r u like this
            )}`, // why the comma @mdn-tutorial??
        );
        // give them junk
        return null;
    }

    // otherwise happy handoff
    return shaderProgram;
}

// ############################################################################################
// ############################################################################################
// ############################################################################################



//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel
    );
  
    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image
      );
  
      // WebGL1 has different requirements for power of 2 images
      // vs non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    image.src = url;
  
    return texture;
  }


  function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }


// ############################################################################################
// ############################################################################################
// ############################################################################################


// 1.  new shader is created by calling gl.createShader()
// 2. the shaders source code is sent to the shader by calling gl.shaderSource()
// 3. once the shader has the source code, it's compiled using gl.compileShader()
// 4. to check to be sure the shader successfully compiled, the shader param gl.COMPILE_STATUS is checked
//      to get its value we call gl.getShaderParameter() specifying the shader and the name of the parameter to check
//      if it's false, we know it failed to compile so show alert with log information obtained from compiler
//          using gl.getShaderInfoLog(), then delete the shader and return null to indicate failure to load shader
// 5. if shader was loaded and successfully compiled, the compiled shader is returned to caller
//.
// but also add the `const shaderProgram = initShaderProgram(vsSource, fsSource)` to main


// create a shader of the given type, uploads the source and compiles it
function loadShader(type, source){
    // ask the canvas instance for shader instance
    const shader = gl.createShader(type);

    // send the source to the shader object

    gl.shaderSource(shader, source);

    // compile the shader program

    gl.compileShader(shader);

    // see if it compiled successfully

    if( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ){ // seems we can get a lot from canvas elements
        alert(
            // very interesting that theres' an info log, does this mean we can debug webgl irl?
            //  instead of prayer-debugging
            `an error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`, //again with the comma??? @mdn-tutorial pls
        );
        // scammed, give junk
        return null;
    }

    // happy give
    return shader;
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

function getCanvasElement(){
    return document.querySelector("#webgl_canvas_primary");
}

// ############################################################################################
// ############################################################################################
// ############################################################################################


function init_webgl_context(){


    // weird way to grab the canvas element, shouldnt we getElementById?
    canvas = getCanvasElement();
    
    // init the GL context
    gl = canvas.getContext("webgl");
}

function draw( deltaTime) {

    updateScene( gl, programInfo, buffers, cameraInfo, deltaTime );
    drawScene( gl, programInfo, CIRCLE_POINTS, buffers, texture, cameraInfo, deltaTime );
}
function frameUpdate( newTime ){
    // ... generate delta time
    const deltaTime = (newTime - oldTime)/1000.0;
    oldTime = newTime;
    draw(deltaTime);
}

// entry point
function startApp() {

    // lmao woops


    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== prepare the canvas stuffs

    init_webgl_context();

    // gl.
    // aaa we need to use window.getsomething the things

    // only continue if webGL is available and working
    if( null === gl ){
        alert(
            "unable to init webGL. your device may not support it"
        );
        return;
    }

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // prepare the webGL stuffs

    // init a shader program; this is where all the lighting for the 
    //  vertices and projection/transforms etc is established.
    shader_program = initShaderProgram(VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC);


    // after we created a shader program we need to look up the locations that webgl
    //  assigned to our inputs
    //  in this case we have one attribute and two uniforms
    //.
    //  attributes - receive values from buffers. each iteration of the vertex
    //                  shader receives the next value from the buffer assigned to
    //                  that attribute
    //  uniforms - like global vars, they stay the same for all iterations of the shader
    //.
    // attributes and uniforms are specific to a single shader program, so we'll store
    //  them together to make it easy to pass them around

    // ======================================================================
    // ======================================================================
    // ======================================================================

    // collect all the info needed to use the shader program
    //  loop up which attribute our shader program is using
    //  for aVertexPosition and look up uniform locations
    //      [looks kinda json/dictionary]
    programInfo = {
        program: shader_program,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shader_program, "aVertexPosition"), // smh, you're just doing it for sillies now huh
            textureCoord: gl.getAttribLocation(shader_program, "aTextureCoord"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shader_program, "uProjectionMatrix"),
            viewMatrix: gl.getUniformLocation(shader_program, "uViewMatrix"),
            modelMatrix: gl.getUniformLocation(shader_program, "uModelMatrix"),
            uSampler: gl.getUniformLocation(shader_program, "uSampler"),
        },
    };  



    // ======================================================================
    // ======================================================================
    // ======================================================================

    // -- create the square plane --
    //.
    // before can render our square plane, we need to create the buffer that
    //  contains its vertex positions and put the values in
    //.
    // we'll do that using a function we call `initBuffers()`, which we will
    //  implement in a seperate js module. as we explore more adv, webGL
    //  concepts, this module will be augmented to create more - and more
    //  complex - 3D objs.
    //.
    // observe: init-buffers.js


    // this routine is pretty simplistic given the basic nature of the scene in this eg.
    //  it starts by calling the gl object's createBuffer() method to obtain a buffer
    //  into which we'll store the vert positiions.
    //  this is then bound to the context by calling the bindBuffer() method

    // once done, we create a js array containing the positions for each vert
    //  of the square plane. this is then converted into an array of floats
    //  and passed into the gl object's bufferData() method to establish the vertex
    //  positions for the obj

    // once shaders are est., the locations are looked up, and the square plane's
    //  vertex positions put in a buffer, we can actually render the scene. we'll
    //  do this in a drawScene() function that, againi, we'll implement in a seperate
    //  js module
    //.
    // observe: draw-scene.js
    //.
    // now import the stuffs 

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== initialise things
    

    gl.clearColor(canvasClearColour[0], canvasClearColour[1], canvasClearColour[2], canvasClearColour[3]); // clear to black
    gl.clearDepth(1.0); // clear everything

    gl.enable(gl.DEPTH_TEST); // enable depth testing
    gl.depthFunc(gl.LEQUAL); // near things obscure far things

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);

    // build camera view matrix
    cameraViewMat = mat4.create();
    
    mat4.translate(
        cameraViewMat,
        cameraViewMat,
        CAMERA_OFFSET,
        // [-0.0, 0.0, -6.0],
    );

    cameraInfo = {
        viewMatrix: cameraViewMat,
        aspect: gl.canvas.clientWidth / gl.canvas.clientHeight,
        fieldOfView: CAMERA_FOV,
        zNear: CAMERA_ZNEAR,
        zFar: CAMERA_ZFAR,
        // i'd love to hape projection matrix here but then we cant modify it??
    };


    oldTime = Date.now();

    // here's where we call the "routine" that builds all the objs we'll be drawing
    buffers = initBuffers(gl,CIRCLE_POINTS);

    // Load texture
    texture = loadTexture(texture_path);
    // Flip image pixels into the bottom-to-top order that WebGL expects.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // tell webgl to use our program when drawing
    gl.useProgram(programInfo.program);


    // allow the vertex position attribute to exist
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== do drawing



    setInterval(
            function () {
                requestAnimationFrame(
                        (t) => frameUpdate( t )
                    );
            },
            timeBetweenFrames
        );


    // ======================================================================
    // ======================================================================
    // ======================================================================
}



// ############################################################################################
// ############################################################################################
// ############################################################################################


// ############################################################################################
// ############################################################################################
// ############################################################################################