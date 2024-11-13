
import { Canvas_App } from "/ogl/common/canvas_app.js";
import { Perlin_01 } from "./objects/perlin_01.js";
import { Perlin_02 } from "./objects/perlin_02.js";
import { Perlin_03 } from "./objects/perlin_03.js";
import { Perlin_04 } from "./objects/perlin_04.js";
import { Perlin_05 } from "./objects/perlin_05.js";
import { Perlin_06 } from "./objects/perlin_06.js";
import { Scene } from "./scene.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################

window.addEventListener(
    "load",
    (event) => {
        console.log("starting webgl app");
        app_main();
    }
);

// ############################################################################################
// ############################################################################################
// ############################################################################################

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

function gl_context_init(canvas_id){
    // weird way to grab the canvas element, shouldnt we getElementById?
    let canvas_obj = getCanvasElement(canvas_id);
    
    // init the GL context
    let gl_context_obj = canvas_obj.getContext("webgl");
    // giv it
    return gl_context_obj;
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

// so we can just use this function to ready up each context
function prepare_context(gl_current_context, canvas_clear_colour){
    gl_current_context.clearColor(canvas_clear_colour[0], canvas_clear_colour[1], canvas_clear_colour[2], canvas_clear_colour[3]); // clear to black
    gl_current_context.clearDepth(1.0); // clear everything

    gl_current_context.enable(gl_current_context.DEPTH_TEST); // enable depth testing
    gl_current_context.depthFunc(gl_current_context.LEQUAL); // near things obscure far things
    
    gl_current_context.enable(gl_current_context.CULL_FACE);
    gl_current_context.cullFace(gl_current_context.FRONT);
    
    gl_current_context.enable(gl_current_context.BLEND);
    gl_current_context.blendFunc(gl_current_context.SRC_ALPHA, gl_current_context.ONE_MINUS_SRC_ALPHA);
    // gl_current_context.blendFunc(gl_current_context.ONE, gl_current_context.ONE_MINUS_SRC_ALPHA);
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

function frameUpdate( current_scene, newTime ){
    // ... generate delta time
    const deltaTime = (newTime - oldTime)/1000.0;
    oldTime = newTime;
    // do update
    current_scene.update(deltaTime);
    // then draw
    current_scene.draw();
}

// ############################################################################################
// ############################################################################################
// ############################################################################################


function canvas_init(gl_current_context, perlin_obj){
    //   0.0 to 1.0:     [   R,   G,   B,   A ]
    let canvas_clear_colour = [ 0.1, 0.1, 0.1, 1.0 ];
    prepare_context(gl_current_context, canvas_clear_colour);

    let scene_obj = new Scene( gl_current_context, perlin_obj );

    oldTime = Date.now();

    return scene_obj
}

function prepare_context_updater(gl_canvas_id, perlin_constructor){

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== prepare the canvas stuffs

    let current_gl_context = gl_context_init(gl_canvas_id);

    // only continue if webGL is available and working
    if( null === current_gl_context ){ alert( `unable to init webGL for #${gl_canvas_id}. your device may not support it` ); }
    // if( null === gl_context_03 ){ alert( "unable to init webGL for perlin 03. your device may not support it" ); }

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== initialise things
    let perlin_obj = perlin_constructor(current_gl_context);
    let scene_obj = canvas_init(current_gl_context, perlin_obj );

    return (t) => frameUpdate( scene_obj, t );
}

// entry point
function app_main() {

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== prepare settings

    // just needed to be before the main call?
    let fps = 30;
    var timeBetweenFrames = 1000.0/fps;

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== prepare the canvas stuffs

    // so cursed, but it's perlin objects passed by need
    let context_updater_01 = prepare_context_updater("webgl_canvas_perlin_01", (gl)=>{let perlin_obj = new Perlin_01(gl); return perlin_obj;});
    let context_updater_02 = prepare_context_updater("webgl_canvas_perlin_02", (gl)=>{let perlin_obj = new Perlin_02(gl); return perlin_obj;});
    let context_updater_03 = prepare_context_updater("webgl_canvas_perlin_03", (gl)=>{let perlin_obj = new Perlin_03(gl); return perlin_obj;});
    let context_updater_04 = prepare_context_updater("webgl_canvas_perlin_04", (gl)=>{let perlin_obj = new Perlin_04(gl); return perlin_obj;});
    let context_updater_05 = prepare_context_updater("webgl_canvas_perlin_05", (gl)=>{let perlin_obj = new Perlin_05(gl); return perlin_obj;});
    // let context_updater_06 = prepare_context_updater("webgl_canvas_perlin_06", (gl)=>{let perlin_obj = new Perlin_06(gl); return perlin_obj;});

    //   0.0 to 1.0:     [   R,   G,   B,   A ]
    let canvas_clear_colour = [ 0.1, 0.1, 0.1, 1.0 ];

    // make app
    let app_06 = new Canvas_App("webgl_canvas_perlin_06", canvas_clear_colour, fps);
    let perlin_06 = new Perlin_06( app_06.get_gl_context() );
    let scene_06 = new Scene( app_06.get_gl_context(), perlin_06 );
    app_06.assign_scene_object( scene_06 );

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== do drawing

    setInterval(
            function () {
                requestAnimationFrame(
                        (t) => {
                            context_updater_01( t );
                            context_updater_02( t );
                            context_updater_03( t );
                            context_updater_04( t );
                            context_updater_05( t );
                            // context_updater_06( t );
                            app_06.frame_update( t );
                        }
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

