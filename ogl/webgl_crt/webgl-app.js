import { Canvas_App } from "/ogl/common/old_canvas_app.js";
import { Render_Space_02 } from "./objects/render_space_02.js";
import { Render_Space_03 } from "./objects/render_space_03.js";
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
    let fps = 40;
    var timeBetweenFrames = 1000.0/fps;
    //   0.0 to 1.0:     [   R,   G,   B,   A ]
    var canvasClearColour = [ 0.1, 0.1, 0.1, 1.0 ];

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== prepare the canvas 02

    let app_02 = new Canvas_App("webgl_crt_02", canvasClearColour);
    let render_space_02 = new Render_Space_02( app_02.get_gl_context() );
    let scene_02 = new Scene( app_02.get_gl_context(), render_space_02.get_render_aspect() );
    app_02.prepare_context()
        .assign_scene_object( scene_02 )
        .set_content_update_function(
            (delta_time) => {
                render_space_02.update( delta_time );
                scene_02.update( delta_time, render_space_02.get_render_aspect());
            }
        )
        .set_content_draw_function(
            () => {
                // handle switching frame buffer
                render_space_02.prepare_render_space();
                // draw the scene
                scene_02.draw();
                // draw the render space
                render_space_02.draw();
            }
        );

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== prepare the canvas 03

    let app_03 = new Canvas_App("webgl_crt_03", canvasClearColour);
    let render_space_03 = new Render_Space_03( app_03.get_gl_context() );
    let scene_03 = new Scene( app_03.get_gl_context(), render_space_03.get_render_aspect() );
    app_03.prepare_context()
        .assign_scene_object( scene_03 )
        .set_content_update_function(
            (delta_time) => {
                render_space_03.update( delta_time );
                scene_03.update( delta_time, render_space_03.get_render_aspect());
            }
        )
        .set_content_draw_function(
            () => {
                // handle switching frame buffer
                render_space_03.prepare_render_space();
                // draw the scene
                scene_03.draw();
                // draw the render space
                render_space_03.draw();
            }
        );

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== do drawing



    setInterval(
            function () {
                requestAnimationFrame(
                        (t) => {
                            app_02.frame_update( t );
                            app_03.frame_update( t );
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

