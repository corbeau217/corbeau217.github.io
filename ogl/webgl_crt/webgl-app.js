import { Scene } from "./scene.js";
import { Render_Space } from "./objects/render_space.js";

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

const TAU = 2.0*Math.PI;

// ------------------------------------------------
// ------------------------------------------------
// ------- settings

// just needed to be before the main call?
let fps = 40;
var timeBetweenFrames = 1000.0/fps;
//   0.0 to 1.0:     [   R,   G,   B,   A ]
var canvasClearColour = [ 0.1, 0.1, 0.1, 1.0 ];


// ------------------------------------------------
// ------------------------------------------------

var canvas;
var gl_context;

// ------------------------------------------------
// ------------------------------------------------

var scene;
var render_space;

// ------------------------------------------------
// ------------------------------------------------

var oldTime;

// ------------------------------------------------
// ------------------------------------------------

// ############################################################################################
// ############################################################################################
// ############################################################################################

function getCanvasElement(){
    return document.querySelector("#webgl_crt_03");
}

function gl_context_init(){

    // weird way to grab the canvas element, shouldnt we getElementById?
    canvas = getCanvasElement();
    
    // init the GL context
    gl_context = canvas.getContext("webgl");
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

function canvas_init(){
    gl_context.clearColor(canvasClearColour[0], canvasClearColour[1], canvasClearColour[2], canvasClearColour[3]); // clear to black
    gl_context.clearDepth(1.0); // clear everything

    gl_context.enable(gl_context.DEPTH_TEST); // enable depth testing
    gl_context.depthFunc(gl_context.LEQUAL); // near things obscure far things
    
    gl_context.enable(gl_context.CULL_FACE);
    gl_context.cullFace(gl_context.FRONT);
    
    gl_context.enable(gl_context.BLEND);
    gl_context.blendFunc(gl_context.SRC_ALPHA, gl_context.ONE_MINUS_SRC_ALPHA);
    // gl_context.blendFunc(gl_context.ONE, gl_context.ONE_MINUS_SRC_ALPHA);


    render_space = new Render_Space( gl_context );

    scene = new Scene( gl_context, render_space.get_render_aspect() );

    oldTime = Date.now();
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

function canvas_update(deltaTime){
    // do update
    render_space.update(deltaTime);
    scene.update(deltaTime, render_space.get_render_aspect());
}

function canvas_draw() {
    // // clear canvas before we start drawing on it
    // gl_context.clear(gl_context.COLOR_BUFFER_BIT | gl_context.DEPTH_BUFFER_BIT);
    // handle switching frame buffer
    render_space.prepare_render_space();
    // draw the scene
    scene.draw();
    // draw the render space
    render_space.draw();
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
    if( null === gl_context ){
        alert(
            "unable to init webGL. your device may not support it"
        );
        return;
    }

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

