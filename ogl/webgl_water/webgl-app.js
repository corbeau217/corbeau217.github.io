import { Canvas_App } from "/ogl/common/canvas_app.js";
import { Scene } from "/ogl/common/scene.js";
import { Water } from "./objects/water.js";
import { Water_02 } from "./objects/water_02.js";
import { Water_03 } from "./objects/water_03.js";

import { VERTEX_SHADER_SRC } from "./shaders/water_03_vertex_shader.js";
import { FRAGMENT_SHADER_SRC } from "./shaders/water_03_fragment_shader.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################

const type_matching_expression = /\b(?:i?(?:vec|mat)[234])|void|float|bool/g;
const comment_matching_expression = /\s*?\/\//g;
const uniform_declaration_matching_expression = /\s*?uniform/g;
const varying_declaration_matching_expression = /\s*?varying/g;
const function_header_matching_expression = /\w+\s+\w+\((?:\s*?\w+\s*?,?)*?\){?/g;
function determine_source_line_class( source_line_text ){
    let class_tags = [`shader_source_line`];

    // when it's a comment line starting with any length of whitespace
    if( source_line_text.match(comment_matching_expression) ) class_tags.push( `shader_source_comment_line` );
    if( source_line_text.match(uniform_declaration_matching_expression) ) class_tags.push( `shader_source_uniform_line` );
    if( source_line_text.match(varying_declaration_matching_expression) ) class_tags.push( `shader_source_varying_line` );
    if( source_line_text.match(function_header_matching_expression) ) class_tags.push( `shader_source_function_header_line` );

    return class_tags.join(' ');
}
function prepare_shader_source_block( shader_source_data ){
    // split up whenever there's a new line element
    let shader_source_block_inner = [];
    shader_source_data.split('\n').forEach(
            source_line => {
                let line_class = determine_source_line_class( source_line );
                shader_source_block_inner.push(`<code class="${line_class}">` + source_line + `</code>`);
            }
        );
    
    // merge with line breaks
    return shader_source_block_inner.join(`<br />`);

    // array.forEach(element => {
        
    // });
}
function provide_shader_code(){
    // ======================================================================
    // ======================================================================
    // ======================================================================
    // ======== water 03

    // get source ready (renaming to make nice)
    let water_03_vertex_source = prepare_shader_source_block(VERTEX_SHADER_SRC);
    let water_03_fragment_source = prepare_shader_source_block(FRAGMENT_SHADER_SRC);

    // get elements ready
    let water_03_vertex_code_block = document.querySelector(`#webgl_water_03_vertex_source`);
    let water_03_fragment_code_block = document.querySelector(`#webgl_water_03_fragment_source`);

    water_03_vertex_code_block.innerHTML = water_03_vertex_source;
    water_03_fragment_code_block.innerHTML = water_03_fragment_source;

    // ======================================================================
    // ======================================================================
    // ======================================================================
}

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
    let app_03 = generate_app_instance( "webgl_water_03", canvasClearColour, Scene );

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
    // ======== prepare -- water -- 03

    // get our context
    let gl_03 = app_03.app_instance.get_gl_context();
    // make the water object
    let water_03 = new Water_03(gl_03);
    // prepare the scene
    app_03.scene_instance
        .add_object( water_03, water_03.update, water_03.draw )
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

