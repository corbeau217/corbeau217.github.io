// import { initBuffers } from "./init-buffers.js";
import { Scene } from "./scene.js";
import { VERTEX_SHADER_SRC } from "./shaders/vertexShader.js";
import { FRAGMENT_SHADER_SRC } from "./shaders/fragmentShader.js";
import { generate_shader_program } from "./shaders.js";


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

// ------------------------------------------------
// ------------------------------------------------
// ------- settings

// just needed to be before the main call?
let fps = 40;
var timeBetweenFrames = 1000.0/fps;
//   0.0 to 1.0:     [   R,   G,   B,   A ]
var canvasClearColour = [ 0.2, 0.2, 0.2, 1.0 ];


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
var oldTime;
// var buffers;

var scene;


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

function draw( deltaTime ) {


    // function updateScene( gl, programInfo, deltaTime ){
    scene.update( deltaTime );
        
    // function drawScene( gl, programInfo ){
    scene.draw();
}
function frameUpdate( newTime ){
    // ... generate delta time
    const deltaTime = (newTime - oldTime)/1000.0;
    oldTime = newTime;
    draw( deltaTime );
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

    // // collect all the info needed to use the shader program
    // //  loop up which attribute our shader program is using
    // //  for aVertexPosition and look up uniform locations
    // //      [looks kinda json/dictionary]
    // programInfo = {
    //     attribLocations: {
    //         vertexPosition: gl.getAttribLocation(shader_program, "aVertexPosition"), // smh, you're just doing it for sillies now huh
    //         textureCoord: gl.getAttribLocation(shader_program, "aTextureCoord"),
    //     },
    //     uniformLocations: {
    //         projectionMatrix: gl.getUniformLocation(shader_program, "uProjectionMatrix"),
    //         viewMatrix: gl.getUniformLocation(shader_program, "uViewMatrix"),
    //         modelMatrix: gl.getUniformLocation(shader_program, "uModelMatrix"),
    //         uSampler: gl.getUniformLocation(shader_program, "uSampler"),
    //     },
    // };  



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

    scene = new Scene( gl );

    oldTime = Date.now();


    // Load texture
    // texture = loadTexture(texture_path);
    // Flip image pixels into the bottom-to-top order that WebGL expects.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);


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