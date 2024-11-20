/**
 * avoid using this, it's  being phased out
 */

export class Canvas_App {
    // ...
    constructor(canvas_name, canvas_clear_colour){
        // save the name of the canvas
        this.canvas_name = canvas_name;

        // get the canvas element
        this.canvas_element = document.querySelector(`#${canvas_name}`);

        // get webgl context
        this.gl_context =  this.canvas_element.getContext("webgl");

        // save our clear colour
        this.canvas_clear_colour = canvas_clear_colour;

        // prepare time
        this.old_time = Date.now();

        // how we determine it's safe to update
        this.safe_to_update = ()=>{ return this.scene_obj!=null; };
    }
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

        this.gl_context.clear(this.gl_context.COLOR_BUFFER_BIT | this.gl_context.DEPTH_BUFFER_BIT);

        // give back reference
        return this;
    }
    frame_update( new_time ){
        // ... generate delta time
        const delta_time = (new_time - this.old_time)/1000.0;
        this.old_time = new_time;

        // have scene? 
        if(this.safe_to_update()){
            // do update
            this.content_update(delta_time);
            // then draw
            this.content_draw();
        }
        
        // give back reference
        return this;
    }
    assign_scene_object(scene_obj){
        // save it
        this.scene_obj = scene_obj;

        // default update functional interfaces
        this.content_update = (t) => { this.scene_obj.update(t); };
        this.content_draw = () => { this.scene_obj.draw(); };
        
        // give back reference
        return this;
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
    set_safe_to_update_function(new_safety_test_function){
        // replace our functional interface
        this.safe_to_update = new_safety_test_function;
        // give back reference
        return this;
    }
}