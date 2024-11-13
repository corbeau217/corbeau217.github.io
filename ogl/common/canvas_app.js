class Canvas_App {
    // ...
    constructor(canvas_name, canvas_clear_colour, fps){
        // save the name of the canvas
        this.canvas_name = canvas_name;

        // get the canvas element
        this.canvas_element = document.querySelector(`#${canvas_name}`);

        // get webgl context
        this.gl_context =  this.canvas_element.getContext("webgl");

        // save our clear colour
        this.canvas_clear_colour = canvas_clear_colour;
        
        // save our desired fps
        this.fps = fps;
        this.time_between_frames = 1000.0/this.fps;

        this.old_time = Date.now();
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
    }
    assign_scene_object(scene_obj){
        this.scene_obj = scene_obj;
    }
    frame_update( new_time ){
        // ... generate delta time
        const delta_time = (new_time - this.old_time)/1000.0;
        this.old_time = new_time;

        // have scene? 
        if(this.scene_obj!=null){
            // do update
            this.scene_obj.update(delta_time);
            // then draw
            this.scene_obj.draw();
        }
    }
}

export { Canvas_App };