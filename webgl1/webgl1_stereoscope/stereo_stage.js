import { Mono_Scene } from "./mono_scene.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################


//   0.0 to 1.0:           [   R,   G,   B,   A ]
const LEFT_CLEAR_COLOUR  = [ 0.1, 0.1, 0.1, 1.0 ];
const RIGHT_CLEAR_COLOUR = [ 0.1, 0.1, 0.1, 1.0 ];

export class Stereo_Stage {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    constructor( left_canvas_name, right_canvas_name, webgl_page_manager ){
        this.construction_event( left_canvas_name, right_canvas_name, webgl_page_manager );
        this.perform_initialisation_event();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    construction_event( left_canvas_name, right_canvas_name, webgl_page_manager ){
        // save reference to our manager
        this.webgl_page_manager = webgl_page_manager;

        // save the name of the canvas
        this.left_canvas_name = left_canvas_name;
        this.right_canvas_name = right_canvas_name;

        // get the canvas element
        this.left_canvas_element = document.querySelector(`#${left_canvas_name}`);
        this.right_canvas_element = document.querySelector(`#${right_canvas_name}`);

        // get webgl context
        this.left_gl_context =  this.left_canvas_element.getContext("webgl");
        this.right_gl_context =  this.right_canvas_element.getContext("webgl");

        // prepare time
        this.old_time = Date.now();

        this.left_scene_graph = new Mono_Scene( this.left_gl_context );
        this.right_scene_graph = new Mono_Scene( this.right_gl_context );


        this.left_colour = LEFT_CLEAR_COLOUR;
        this.right_colour = RIGHT_CLEAR_COLOUR;
    }



    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * initialisation event
     */
    perform_initialisation_event(){
        this.left_scene_graph.perform_initialisation_event();
        this.right_scene_graph.perform_initialisation_event();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    get_left_scene_graph(){
        return this.left_scene_graph;
    }
    get_right_scene_graph(){
        return this.right_scene_graph;
    }
    get_left_gl_context(){
        return this.left_gl_context;
    }
    get_right_gl_context(){
        return this.right_gl_context;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    frame_update( new_time ){
        // ... generate delta time
        const delta_time = (new_time - this.old_time)/1000.0;
        this.old_time = new_time;
        
        // give back self reference after:
        // 
        // do update
        //      prepare context
        //      do draw
        
        // handle left first
        return this.content_update( this.left_scene_graph, delta_time )
                    .prepare_context(   this.left_gl_context, this.left_colour    )
                    .content_draw(      this.left_scene_graph   )
                    // repeat for the right side
                    .content_update( this.right_scene_graph, delta_time )
                    .prepare_context(   this.right_gl_context, this.right_colour   )
                    .content_draw(      this.right_scene_graph  );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    content_update( scene_graph, delta_time ){
        scene_graph.update( delta_time );

        // give back reference
        return this;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    // prepares for drawing
    prepare_context(gl_context, canvas_clear_colour){
        gl_context.clearColor(canvas_clear_colour[0], canvas_clear_colour[1], canvas_clear_colour[2], canvas_clear_colour[3]); // clear to black
        gl_context.clearDepth(1.0); // clear everything
    
        gl_context.enable(gl_context.DEPTH_TEST); // enable depth testing
        gl_context.depthFunc(gl_context.LEQUAL); // near things obscure far things
        
        gl_context.enable(gl_context.CULL_FACE);
        gl_context.cullFace(gl_context.FRONT);
        
        gl_context.enable(gl_context.BLEND);
        gl_context.blendFunc(gl_context.SRC_ALPHA, gl_context.ONE_MINUS_SRC_ALPHA);
        // gl_context.blendFunc(gl_context.ONE, gl_context.ONE_MINUS_SRC_ALPHA);

        // give back reference
        return this;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    content_draw(scene_graph){
        // draw the scene
        scene_graph.draw_from_camera();

        // give back reference
        return this;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}

// ############################################################################################
// ############################################################################################
// ############################################################################################
