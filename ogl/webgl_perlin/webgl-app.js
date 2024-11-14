
import { Canvas_App } from "/ogl/common/canvas_app.js";
import { Perlin_01 } from "./objects/perlin_01.js";
import { Perlin_02 } from "./objects/perlin_02.js";
import { Perlin_03 } from "./objects/perlin_03.js";
import { Perlin_04 } from "./objects/perlin_04.js";
import { Perlin_05 } from "./objects/perlin_05.js";
import { Perlin_06 } from "./objects/perlin_06.js";
import { Perlin_07 } from "./objects/perlin_07.js";
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

    //   0.0 to 1.0:     [   R,   G,   B,   A ]
    let canvas_clear_colour = [ 0.1, 0.1, 0.1, 1.0 ];

    // make apps

    // perlin 01
    let app_01 = new Canvas_App("webgl_canvas_perlin_01", canvas_clear_colour);
    app_01.prepare_context()
        .assign_scene_object( new Scene( app_01.get_gl_context(), new Perlin_01( app_01.get_gl_context() ) ) );

    // perlin 02
    let app_02 = new Canvas_App("webgl_canvas_perlin_02", canvas_clear_colour);
    app_02.prepare_context()
        .assign_scene_object( new Scene( app_02.get_gl_context(), new Perlin_02( app_02.get_gl_context() ) ) );

    // perlin 03
    let app_03 = new Canvas_App("webgl_canvas_perlin_03", canvas_clear_colour);
    app_03.prepare_context()
        .assign_scene_object( new Scene( app_03.get_gl_context(), new Perlin_03( app_03.get_gl_context() ) ) );

    // perlin 04
    let app_04 = new Canvas_App("webgl_canvas_perlin_04", canvas_clear_colour);
    app_04.prepare_context()
        .assign_scene_object( new Scene( app_04.get_gl_context(), new Perlin_04( app_04.get_gl_context() ) ) );

    // perlin 05
    let app_05 = new Canvas_App("webgl_canvas_perlin_05", canvas_clear_colour);
    app_05.prepare_context()
        .assign_scene_object( new Scene( app_05.get_gl_context(), new Perlin_05( app_05.get_gl_context() ) ) );

    // perlin 06
    let app_06 = new Canvas_App("webgl_canvas_perlin_06", canvas_clear_colour);
    app_06.prepare_context()
        .assign_scene_object( new Scene( app_06.get_gl_context(), new Perlin_06( app_06.get_gl_context() ) ) );
    
    // perlin 07
    let app_07 = new Canvas_App("webgl_canvas_perlin_07", canvas_clear_colour);
    app_07.prepare_context()
        .assign_scene_object( new Scene( app_07.get_gl_context(), new Perlin_07( app_07.get_gl_context() ) ) );

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== do drawing

    setInterval(
            function () {
                requestAnimationFrame(
                        (t) => {
                            app_01.frame_update( t );
                            app_02.frame_update( t );
                            app_03.frame_update( t );
                            app_04.frame_update( t );
                            app_05.frame_update( t );
                            app_06.frame_update( t );
                            app_07.frame_update( t );
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

