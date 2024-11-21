
import { Canvas_Object } from "../common/canvas_object.js";
import { Water } from "./objects/water.js";
import { Water_02 } from "./objects/water_02.js";

import { Water_03 } from "./objects/water_03.js";
import { VERTEX_SHADER_SRC as water_03_vertex_shader_source } from "./shaders/water_03_vertex_shader.js";
import { FRAGMENT_SHADER_SRC as water_03_fragment_shader_source } from "./shaders/water_03_fragment_shader.js";

import { Water_04 } from "./objects/water_04.js";
import { VERTEX_SHADER_SRC as water_04_vertex_shader_source } from "./shaders/water_04_vertex_shader.js";
import { FRAGMENT_SHADER_SRC as water_04_fragment_shader_source } from "./shaders/water_04_fragment_shader.js";

import { Water_05 } from "./objects/water_05.js";
import { VERTEX_SHADER_SRC as water_05_vertex_shader_source } from "./shaders/water_05_vertex_shader.js";
import { FRAGMENT_SHADER_SRC as water_05_fragment_shader_source } from "./shaders/water_05_fragment_shader.js";

import { insert_shader_code_block } from "../common/util/source_block.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################

//   0.0 to 1.0:                  [   R,   G,   B,   A ]
var canvas_default_clear_colour = [ 0.1, 0.1, 0.1, 1.0 ];

// ############################################################################################
// ############################################################################################
// ############################################################################################

window.addEventListener(
    "load",
    (event) => {
        console.log("starting webgl app");
        provide_shader_code();
        app_main();
    }
);

// ############################################################################################
// ############################################################################################
// ############################################################################################

// where to add an app once it's made
let app_list = [];

// ############################################################################################
// ############################################################################################
// ############################################################################################

function prepare_new_water_app( canvas_element_name, Water_Type, camera_offset_x, camera_offset_y, camera_offset_z ){
    // --------------------------------------------
    // --------------------------------------------
    // ---- get our context

    let canvas_app = new Canvas_Object( canvas_element_name, canvas_default_clear_colour );
    let scene_graph = canvas_app.get_scene_object();

    // --------------------------------------------
    // --------------------------------------------
    // ---- add it to the list of apps
        
    // get the index it's going to be placed
    const app_index = app_list.length;
    
    // make the canvas information
    let app_data = {
        // where in the list it is
        id: app_index,
        // what the element name is
        canvas_name: canvas_element_name,
        // what the background colour is
        clear_colour: canvas_default_clear_colour,
        // the canvas app
        app_instance: canvas_app,
        // quick access to the scene
        scene_instance: scene_graph,
    };

    // add to our list
    app_list.push( app_data );

    // --------------------------------------------
    // --------------------------------------------
    // ---- make the water instance

    let water_obj = new Water_Type( canvas_app.get_gl_context() );

    // --------------------------------------------
    // --------------------------------------------
    // ---- link it up

    // prepare the scene
    scene_graph
        .add_object( water_obj, water_obj.update, water_obj.draw )
        .set_camera_offset( camera_offset_x, camera_offset_y, camera_offset_z );

    // --------------------------------------------
    // --------------------------------------------
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

    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== build the app instances
    
    prepare_new_water_app( "webgl_water_01", Water, 0.0, -0.75, -2.3 );
    prepare_new_water_app( "webgl_water_02", Water_02, 0.0, -0.0, -3.3 );
    prepare_new_water_app( "webgl_water_03", Water_03, 0.0, -0.0, -3.3 );
    prepare_new_water_app( "webgl_water_04", Water_04, 0.0, -0.0, -3.3 );
    prepare_new_water_app( "webgl_water_05", Water_05, 0.0, -0.7, -3.3 );

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


function provide_shader_code(){
    // ======================================================================
    // ======================================================================
    // ======================================================================

    // water 03
    insert_shader_code_block( "webgl_water_03_vertex_source", water_03_vertex_shader_source );
    insert_shader_code_block( "webgl_water_03_fragment_source", water_03_fragment_shader_source );


    // water 04
    insert_shader_code_block( "webgl_water_04_vertex_source", water_04_vertex_shader_source );
    insert_shader_code_block( "webgl_water_04_fragment_source", water_04_fragment_shader_source );


    // water 05
    insert_shader_code_block( "webgl_water_05_vertex_source", water_05_vertex_shader_source );
    insert_shader_code_block( "webgl_water_05_fragment_source", water_05_fragment_shader_source );


    // ======================================================================
    // ======================================================================
    // ======================================================================
}


// ############################################################################################
// ############################################################################################
// ############################################################################################

