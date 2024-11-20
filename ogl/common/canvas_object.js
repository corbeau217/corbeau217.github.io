import { Scene_Graph } from "./scene_graph.js";

export class Canvas_Object {


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // ...
    constructor(canvas_name, canvas_clear_colour){
        // save the name of the canvas
        this.canvas_name = canvas_name;

        // get the canvas element
        this.canvas_element = document.querySelector(`#${canvas_name}`);

        // get webgl context
        this.gl_context =  this.canvas_element.getContext("webgl");
        this.aspect_ratio = this.canvas_element.width/this.canvas_element.height;

        // save our clear colour
        this.canvas_clear_colour = canvas_clear_colour;

        // prepare time
        this.old_time = Date.now();

        this.scene_obj = new Scene_Graph(this.gl_context, this.aspect_ratio )
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    assign_scene_object(scene_obj){
        // save it
        this.scene_obj = scene_obj;
        
        // give back reference
        return this;
    }
    get_scene_object(){
        return this.scene_obj;
    }

    get_gl_context(){
        return this.gl_context;
    }
    set_content_update_function(new_update_function){
        // replace our functional interface
        this.content_update = new_update_function;
        // give back reference
        return this;
    }
    set_content_draw_function(new_draw_function){
        // replace our functional interface
        this.content_draw = new_draw_function;
        // give back reference
        return this;
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    frame_update( new_time ){
        // ... generate delta time
        const delta_time = (new_time - this.old_time)/1000.0;
        this.old_time = new_time;

        // do update
        this.content_update(delta_time);
        // then draw
        this.content_draw();
        
        // give back reference
        return this;
    }



    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    content_update( delta_time ){
        this.scene_obj.update( delta_time, this.aspect_ratio );
        this.prepare_context();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    // prepares for drawing
    prepare_context(){
        this.gl_context.clearColor(this.canvas_clear_colour[0], this.canvas_clear_colour[1], this.canvas_clear_colour[2], this.canvas_clear_colour[3]); // clear to black
        this.gl_context.clearDepth(1.0); // clear everything
    
        this.gl_context.enable(this.gl_context.DEPTH_TEST); // enable depth testing
        this.gl_context.depthFunc(this.gl_context.LEQUAL); // near things obscure far things
        
        this.gl_context.enable(this.gl_context.CULL_FACE);
        this.gl_context.cullFace(this.gl_context.FRONT);
        
        this.gl_context.enable(this.gl_context.BLEND);
        this.gl_context.blendFunc(this.gl_context.SRC_ALPHA, this.gl_context.ONE_MINUS_SRC_ALPHA);
        // this.gl_context.blendFunc(this.gl_context.ONE, this.gl_context.ONE_MINUS_SRC_ALPHA);

        this.scene_obj.prepare_draw_context();
        // give back reference
        return this;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    content_draw(){
        // draw the scene
        this.scene_obj.draw();
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}