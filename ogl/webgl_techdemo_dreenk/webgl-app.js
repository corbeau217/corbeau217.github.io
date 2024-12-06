import { initBuffers } from "./init-buffers.js";
import { updateScene, drawScene } from "./draw-scene.js";
import { generate_shader_program } from "/ext/webgl_1_core/src/shader_util/shader_engine.js";
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
const canvasClearColour = [ 0.2, 0.2, 0.2, 1.0 ];
//    needs negative  [   -x,   -y,   -z ]
const CAMERA_OFFSET = [ -0.0, -0.0, -8.0 ];
const CAMERA_FOV = 1.2*TAU/7.0;
const CAMERA_ZNEAR = 1;
const CAMERA_ZFAR = 50.0;

// ############################################################################################
// ############################################################################################
// ############################################################################################


const texture_path = "/img/dreenk_texture.png";


// ############################################################################################
// ############################################################################################
// ############################################################################################



//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
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


// entry point
function startApp() {

    // lmao woops


    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== prepare the canvas stuffs

    // weird way to grab the canvas element, shouldnt we getElementById?
    const canvas = document.querySelector("#webgl_canvas_primary");
    // init the GL context
    const gl = canvas.getContext("webgl");

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
    const shaderProgram = generate_shader_program(gl, VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC);


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
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"), // smh, you're just doing it for sillies now huh
            textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            viewMatrix: gl.getUniformLocation(shaderProgram, "uViewMatrix"),
            modelMatrix: gl.getUniformLocation(shaderProgram, "uModelMatrix"),
            uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
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
    const cameraViewMat = mat4.create();
    
    mat4.translate(
        cameraViewMat,
        cameraViewMat,
        CAMERA_OFFSET,
        // [-0.0, 0.0, -6.0],
    );

    var cameraInfo = {
        viewMatrix: cameraViewMat,
        aspect: gl.canvas.clientWidth / gl.canvas.clientHeight,
        fieldOfView: CAMERA_FOV,
        zNear: CAMERA_ZNEAR,
        zFar: CAMERA_ZFAR,
        // i'd love to hape projection matrix here but then we cant modify it??
    };


    let oldTime = Date.now();

    // here's where we call the "routine" that builds all the objs we'll be drawing
    const buffers = initBuffers(gl,CIRCLE_POINTS);

    // Load texture
    const texture = loadTexture(gl, texture_path);
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


    function draw( gl, programInfo, buffers, texture, cameraInfo, newTime) {
        const deltaTime = (newTime - oldTime)/1000.0;
        oldTime = newTime;

        updateScene( gl, programInfo, buffers, cameraInfo, deltaTime );
        drawScene( gl, programInfo, CIRCLE_POINTS, buffers, texture, cameraInfo, deltaTime );
    }
    setInterval(
            function () {
                requestAnimationFrame(
                        (t) => draw( gl, programInfo, buffers, texture, cameraInfo,t)
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