import { Canvas_App } from "/ogl/common/canvas_app.js";
import { Scene } from "/ogl/common/scene.js";
import { Water } from "./objects/water.js";
import { Water_02 } from "./objects/water_02.js";

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

// where to add an app once it's made
let app_list = [];

function start_canvas_instance( canvas_element_name, canvas_clear_colour, app_instance, scene_instance ){
    // get the index it's going to be placed
    const app_index = app_list.length;
    
    // make the canvas information
    let app_data = {
        // where in the list it is
        id: app_index,
        // what the element name is
        canvas_name: canvas_element_name,
        // what the background colour is
        clear_colour: canvas_clear_colour,
        // the canvas app
        app_instance: app_instance,
        // quick access to the scene
        scene_instance: scene_instance,
    };

    // add to our list
    app_list.push( app_data );

    // supply information
    return app_data;
}

function generate_app_instance( canvas_element_name, canvas_clear_colour, Scene_Type ){
    let canvas_app = new Canvas_App( canvas_element_name, canvas_clear_colour );

    let aspect_ratio = canvas_app.canvas_element.width/canvas_app.canvas_element.height;
    
    let scene_instance = new Scene_Type( canvas_app.get_gl_context(), aspect_ratio );
    
    canvas_app
        .assign_scene_object( scene_instance )
        .set_content_update_function(
            (delta_time) => {
                scene_instance.update( delta_time, aspect_ratio );
                canvas_app.prepare_context();
            }
        )
        .set_content_draw_function(
            () => {
                // Clear the canvas AND the depth buffer.
                canvas_app.get_gl_context().clear(canvas_app.get_gl_context().COLOR_BUFFER_BIT | canvas_app.get_gl_context().DEPTH_BUFFER_BIT);
                // draw the scene
                scene_instance.draw();
            }
        );
    
    return start_canvas_instance( canvas_element_name, canvas_clear_colour, canvas_app, scene_instance );
}

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
    // ======== build the app instances
    
    let app_01 = generate_app_instance( "webgl_water_01", canvasClearColour, Scene );
    let app_02 = generate_app_instance( "webgl_water_02", canvasClearColour, Scene );

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== prepare -- water -- 01

    // get our context
    let gl_01 = app_01.app_instance.get_gl_context();
    let water_01 = new Water(gl_01);
    app_01.scene_instance
        .add_object( water_01, water_01.update, water_01.draw )
        .set_camera_offset( -0.0, -0.75, -2.3);

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== prepare -- water -- 02

    // get our context
    let gl_02 = app_02.app_instance.get_gl_context();
    // make the water object
    let water_02 = new Water_02(gl_02);
    // prepare the scene
    app_02.scene_instance
        .add_object( water_02, water_02.update, water_02.draw )
        .set_camera_offset( -0.0, -0.0, -3.3);

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== do drawing



    setInterval(
            function () {
                requestAnimationFrame(
                        (t) => {
                            app_list.forEach(app_data => {
                                app_data.app_instance.frame_update( t );
                            });
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

