import { Canvas_App } from "/ogl/common/old_canvas_app.js";
import { Scene } from "./scene.js";
import { Scene_Car } from "./scene_car.js";
import { Scene_Sphere } from "./scene_sphere.js";
import { Scene_Sphere_02 } from "./scene_sphere_02.js";

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
    let aspectRatio = 640.0/480.0;

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== prepare the canvas 01
    let app_01 = new Canvas_App("webgl_engine_01", canvasClearColour);
    let scene_01 = new Scene( app_01.get_gl_context(), aspectRatio );
    app_01
        .assign_scene_object( scene_01 )
        .set_content_update_function(
            (delta_time) => {
                scene_01.update( delta_time, aspectRatio );
                app_01.prepare_context();
            }
        )
        .set_content_draw_function(
            () => {
                // Clear the canvas AND the depth buffer.
                app_01.get_gl_context().clear(app_01.get_gl_context().COLOR_BUFFER_BIT | app_01.get_gl_context().DEPTH_BUFFER_BIT);
                // draw the scene
                scene_01.draw();
            }
        );

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== prepare the canvas 02
    let app_02 = new Canvas_App("webgl_vehicle_01", canvasClearColour);
    let scene_02 = new Scene_Car( app_02.get_gl_context(), aspectRatio );
    app_02
        .assign_scene_object( scene_02 )
        .set_content_update_function(
            (delta_time) => {
                scene_02.update( delta_time, aspectRatio );
                app_02.prepare_context();
            }
        )
        .set_content_draw_function(
            () => {
                // Clear the canvas AND the depth buffer.
                app_02.get_gl_context().clear(app_02.get_gl_context().COLOR_BUFFER_BIT | app_02.get_gl_context().DEPTH_BUFFER_BIT);
                // draw the scene
                scene_02.draw();
            }
        );

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== prepare the canvas 03
    let app_03 = new Canvas_App("webgl_sphere_01", canvasClearColour);
    let scene_03 = new Scene_Sphere( app_03.get_gl_context(), aspectRatio );
    app_03
        .assign_scene_object( scene_03 )
        .set_content_update_function(
            (delta_time) => {
                scene_03.update( delta_time, aspectRatio );
                app_03.prepare_context();
            }
        )
        .set_content_draw_function(
            () => {
                // Clear the canvas AND the depth buffer.
                app_03.get_gl_context().clear(app_03.get_gl_context().COLOR_BUFFER_BIT | app_03.get_gl_context().DEPTH_BUFFER_BIT);
                // draw the scene
                scene_03.draw();
            }
        );

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== prepare the canvas 04
    let app_04 = new Canvas_App("webgl_sphere_02", canvasClearColour);
    let scene_04 = new Scene_Sphere_02( app_04.get_gl_context(), aspectRatio );
    app_04
        .assign_scene_object( scene_04 )
        .set_content_update_function(
            (delta_time) => {
                scene_04.update( delta_time, aspectRatio );
                app_04.prepare_context();
            }
        )
        .set_content_draw_function(
            () => {
                // Clear the canvas AND the depth buffer.
                app_04.get_gl_context().clear(app_04.get_gl_context().COLOR_BUFFER_BIT | app_04.get_gl_context().DEPTH_BUFFER_BIT);
                // draw the scene
                scene_04.draw();
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
                            app_01.frame_update( t );
                            app_02.frame_update( t );
                            app_03.frame_update( t );
                            app_04.frame_update( t );
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

