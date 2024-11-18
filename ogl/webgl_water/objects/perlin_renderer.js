export class Perlin_Renderer {
    constructor( gl_context, perlin_object, perlin_update_function, perlin_draw_function ){
        // ==========================================
        // ==========================================
        // ==== basic information

        this.gl_context = gl_context;
        
        this.render_dimensions = {
            x: 128,
            y: 128,
        };
        this.viewport_dimensions = {
            x: gl_context.canvas.width,
            y: gl_context.canvas.height,
        };

        // ==========================================
        // ==========================================
        // === prepare the perlin object data

        this.perlin_object = perlin_object;
        this.perlin_update = perlin_update_function;
        this.perlin_draw = perlin_draw_function;

        // ==========================================
        // ==========================================
        // ==== prepare texture space

        this.initialise_render_texture_data();
        this.build_frame_buffer();

        // ==========================================
        // ==========================================
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    initialise_render_texture_data(){

        this.render_target_texture = this.gl_context.createTexture();
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, this.render_target_texture);

        // for now we use the same size as the viewport otherwise we need a camera
        this.gl_context.texImage2D(this.gl_context.TEXTURE_2D, 0, this.gl_context.RGBA,
                            this.render_dimensions.x, this.render_dimensions.y, 0,
                            this.gl_context.RGBA, this.gl_context.UNSIGNED_BYTE, null);

        this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_MIN_FILTER, this.gl_context.NEAREST);
        this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_MAG_FILTER, this.gl_context.NEAREST);
        this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_WRAP_S, this.gl_context.CLAMP_TO_EDGE);
        this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_WRAP_T, this.gl_context.CLAMP_TO_EDGE);
                            
    }
    build_frame_buffer(){

        // Create and bind the framebuffer
        this.frame_buffer = this.gl_context.createFramebuffer();
        this.gl_context.bindFramebuffer(this.gl_context.FRAMEBUFFER, this.frame_buffer);
        
        // attach the texture as the first color attachment
        this.gl_context.framebufferTexture2D( this.gl_context.FRAMEBUFFER, this.gl_context.COLOR_ATTACHMENT0,
            this.gl_context.TEXTURE_2D, this.render_target_texture, 0 );


        
        // unbind the frame buffer for other operations
        this.gl_context.bindFramebuffer(this.gl_context.FRAMEBUFFER, null);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    prepare_render_space(){
        // render to our targetTexture by binding the framebuffer
        this.gl_context.bindFramebuffer(this.gl_context.FRAMEBUFFER, this.frame_buffer);
    
        // Tell WebGL how to convert from clip space to pixels
        this.gl_context.viewport(0, 0, this.render_dimensions.x, this.render_dimensions.y);
    
        // Clear the canvas AND the depth buffer.
        // this.gl_context.clearColor(0, 0, 1, 1);   // clear to blue
        this.gl_context.clear(this.gl_context.COLOR_BUFFER_BIT | this.gl_context.DEPTH_BUFFER_BIT);
    }
    prepare_canvas_space(){
        // render to the canvas
        this.gl_context.bindFramebuffer(this.gl_context.FRAMEBUFFER, null);

        // ready the texture we just rendered to
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, this.render_target_texture);
     
        // Tell WebGL how to convert from clip space to pixels
        this.gl_context.viewport(0, 0, this.viewport_dimensions.x, this.viewport_dimensions.y);
     
        // Clear the canvas AND the depth buffer.
        // this.gl_context.clearColor(1, 1, 1, 1);   // clear to white
        this.gl_context.clear(this.gl_context.COLOR_BUFFER_BIT | this.gl_context.DEPTH_BUFFER_BIT);
     
        this.aspect = this.gl_context.canvas.clientWidth / this.gl_context.canvas.clientHeight;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    update( delta_time ){
        this.perlin_update.apply( this.perlin_object, [delta_time] );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(){
        this.prepare_render_space();
        this.perlin_draw.apply( this.perlin_object, [] );
        this.prepare_canvas_space();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}