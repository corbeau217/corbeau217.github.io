import { Scene } from "./scene.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################

window.addEventListener(
    "load",
    (event) => {
        console.log("starting webgl app");
        app_maim();
    }
);

// ############################################################################################
// ############################################################################################
// ############################################################################################

// ------------------------------------------------
// ------------------------------------------------
// ------- settings

// just needed to be before the main call?
let fps = 30;
var timeBetweenFrames = 1000.0/fps;
//   0.0 to 1.0:     [   R,   G,   B,   A ]
var canvasClearColour = [ 0.1, 0.1, 0.1, 1.0 ];


// ------------------------------------------------
// ------------------------------------------------

var canvas_01;
var canvas_02;
var gl_context_01;
var gl_context_02;

// ------------------------------------------------
// ------------------------------------------------

var scene;

// ------------------------------------------------
// ------------------------------------------------

var oldTime;

// ------------------------------------------------
// ------------------------------------------------

// ############################################################################################
// ############################################################################################
// ############################################################################################

function getCanvasElement(canvas_name){
    return document.querySelector(`#${canvas_name}`);
}

function gl_context_init(){

    // weird way to grab the canvas element, shouldnt we getElementById?
    canvas_01 = getCanvasElement("webgl_canvas_perlin_01");
    canvas_02 = getCanvasElement("webgl_canvas_perlin_02");
    
    // init the GL context
    gl_context_01 = canvas_01.getContext("webgl");
    gl_context_02 = canvas_02.getContext("webgl");
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

// so we can just use this function to ready up each context
function prepare_context(gl_current_context){
    gl_current_context.clearColor(canvasClearColour[0], canvasClearColour[1], canvasClearColour[2], canvasClearColour[3]); // clear to black
    gl_current_context.clearDepth(1.0); // clear everything

    gl_current_context.enable(gl_current_context.DEPTH_TEST); // enable depth testing
    gl_current_context.depthFunc(gl_current_context.LEQUAL); // near things obscure far things
    
    gl_current_context.enable(gl_current_context.CULL_FACE);
    gl_current_context.cullFace(gl_current_context.FRONT);
    
    gl_current_context.enable(gl_current_context.BLEND);
    gl_current_context.blendFunc(gl_current_context.SRC_ALPHA, gl_current_context.ONE_MINUS_SRC_ALPHA);
    // gl_current_context.blendFunc(gl_current_context.ONE, gl_current_context.ONE_MINUS_SRC_ALPHA);
}

function canvas_init(){
    prepare_context(gl_context_01);
    prepare_context(gl_context_02);

    scene = new Scene( gl_context_01, gl_context_02 );

    oldTime = Date.now();
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

function canvas_update(deltaTime){
    // do update
    scene.update(deltaTime);
}

function canvas_draw() {
    // draw the scene
    scene.draw();
}

function frameUpdate( newTime ){
    // ... generate delta time
    const deltaTime = (newTime - oldTime)/1000.0;
    oldTime = newTime;
    // do update
    canvas_update(deltaTime);
    // then draw
    canvas_draw();
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

// entry point
function app_maim() {

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== prepare the canvas stuffs

    gl_context_init();

    // only continue if webGL is available and working
    if( null === gl_context_01 ){ alert( "unable to init webGL for perlin 01. your device may not support it" ); }
    if( null === gl_context_02 ){ alert( "unable to init webGL for perlin 02. your device may not support it" ); }

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== initialise things
    
    canvas_init();

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

