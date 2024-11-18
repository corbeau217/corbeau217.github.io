import { FRAGMENT_SHADER_SRC } from "../shaders/perlin_renderer_fragment_shader.js";
import { VERTEX_SHADER_SRC } from "../shaders/perlin_renderer_vertex_shader.js";
import { generate_shader_program } from "/ogl/common/shaders/shader_engine.js";

export class Perlin_Renderer {
    constructor( gl_context, perlin_object, perlin_update_function, perlin_draw_function ){
        // ==========================================
        // ==========================================
        // ==== basic information
        this.gl_context = gl_context;
        this.shader = generate_shader_program(this.gl_context, VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC);
        
        this.render_dimensions = {
            x: 32,
            y: 24,
        };
        this.viewport_dimensions = {
            x: 640,
            y: 480,
        };

        // ==========================================
        // ==========================================
        // === prepare the perlin object data

        this.perlin_object = perlin_object;
        this.perlin_update_function = perlin_update_function;
        this.perlin_draw_function = perlin_draw_function;

        // ==========================================
        // ==========================================
        // ==== prepare shape

        this.construct_mesh();

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

    construct_mesh(){

        // ==========================================
        // ==========================================
        // ==== mesh data

        this.vertexValues = [
            // v0
            -0.5, 0.5, 0.0, 1.0,
            // v1
            -1.0, -1.0, 0.0, 1.0,
            // v2
            1.0,  -1.0, 0.0, 1.0,
            // v3
            1.0,   1.0, 0.0, 1.0,
        ];

        this.bindings = [
            // face 0
            0, 2, 1,
            // face 1
            0, 3, 2,
        ];

        this.faceCount = 2;

        // ==========================================
        // === bind the shape
    
        this.vertexPosition_location = this.gl_context.getAttribLocation(this.shader, "a_vertex_position");
        this.a_texcoord_location = this.gl_context.getAttribLocation(this.shader, "a_texcoord");

        // create a buffer for the shape's positions.
        this.positionBuffer = this.gl_context.createBuffer();
    
        // selec the vertexBuffer as one to apply
        //  buffer opers to from now on
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.positionBuffer);
        this.gl_context.vertexAttribPointer(
            this.vertexPosition_location,
            // components per vertex
            4,
            // the data in the buffer is 32bit floats
            this.gl_context.FLOAT,
            // don't normalize
            false,
            // how many bytes to get from one set of values to the next
            0,
            // how many bytes inside the buffer to start from
            0
        );
    
    
        // allocate space on gpu of the number of vertices
        this.gl_context.bufferData(
            this.gl_context.ARRAY_BUFFER,
            new Float32Array(this.vertexValues),
            this.gl_context.STATIC_DRAW
        );

        // create a buffer for the shape's indices.
        this.indexBuffer = this.gl_context.createBuffer();
    
        // select the indexBuffer as one to apply
        //  buffer opers to from now on
        this.gl_context.bindBuffer(this.gl_context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    
        // allocate space on gpu of the number of indices
        this.gl_context.bufferData(
            this.gl_context.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.bindings),
            this.gl_context.STATIC_DRAW
        );
        
        // ==========================================
        // === prepare uv mappings


        this.uv_mappings = [
            // v0
            // -1.0,  1.0, 0.0, 1.0,
            0.0, 1.0,
            // v1
            // -1.0, -1.0, 0.0, 1.0,
            0.0, 0.0,
            // v2
            // 1.0,  -1.0, 0.0, 1.0,
            1.0, 0.0,
            // v3
            // 1.0,   1.0, 0.0, 1.0,
            1.0, 1.0,
        ];


        this.uv_mappings_buffer = this.gl_context.createBuffer();
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.uv_mappings_buffer);
    
        this.gl_context.vertexAttribPointer(
            this.a_texcoord_location,
            2,
            this.gl_context.FLOAT,
            false,
            0,
            0,
        );
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.uv_mappings),
          this.gl_context.STATIC_DRAW,
        );
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
        // start up our shader
        this.gl_context.useProgram(this.shader);
        this.gl_context.clear(this.gl_context.COLOR_BUFFER_BIT | this.gl_context.DEPTH_BUFFER_BIT);

        // render to our targetTexture by binding the framebuffer
        this.gl_context.bindFramebuffer(this.gl_context.FRAMEBUFFER, this.frame_buffer);
        
        // attach the texture as the first color attachment
        this.gl_context.framebufferTexture2D( this.gl_context.FRAMEBUFFER, this.gl_context.COLOR_ATTACHMENT0,
            this.gl_context.TEXTURE_2D, this.render_target_texture, 0 );
    
        // Tell WebGL how to convert from clip space to pixels
        this.gl_context.viewport(0, 0, this.render_dimensions.x, this.render_dimensions.y);
    
    }
    prepare_canvas_space(){
        // render to the canvas
        this.gl_context.bindFramebuffer(this.gl_context.FRAMEBUFFER, null);
     
        // Tell WebGL how to convert from clip space to pixels
        this.gl_context.viewport(0, 0, this.viewport_dimensions.x, this.viewport_dimensions.y);

        this.bind_render_texture();
     
        // Clear the canvas AND the depth buffer.
        // this.gl_context.clearColor(1, 1, 1, 1);   // clear to white
        this.gl_context.clear(this.gl_context.COLOR_BUFFER_BIT | this.gl_context.DEPTH_BUFFER_BIT);
     
        this.aspect = this.gl_context.canvas.clientWidth / this.gl_context.canvas.clientHeight;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    update( delta_time ){
        this.perlin_update_function.apply( this.perlin_object, [delta_time] );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(){
        this.prepare_render_space();
        this.perlin_draw_function.apply( this.perlin_object, [] );
        this.prepare_canvas_space();

        this.prepare_uniforms();
        this.enable_vertex_attributes();
        // this.bind_render_texture();

        this.gl_context.drawElements(this.gl_context.TRIANGLES, this.faceCount*3, this.gl_context.UNSIGNED_SHORT, 0);

        this.disable_vertex_attributes();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    prepare_uniforms(){
        // ----------------------------------------------------------------------------------------

        // the size of our texture
        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_texture_size") , this.render_dimensions.x, this.render_dimensions.y );
        // the size of a pixel in our uv mapping
        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_uv_pixel_size") , 1.0/this.render_dimensions.x, 1.0/this.render_dimensions.y );

        // ----------------------------------------------------------------------------------------
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    enable_vertex_attributes(){
        this.gl_context.enableVertexAttribArray(this.a_texcoord_location);
        this.gl_context.enableVertexAttribArray(this.vertexPosition_location);
    }
    disable_vertex_attributes(){
        this.gl_context.disableVertexAttribArray(this.a_texcoord_location);
        this.gl_context.disableVertexAttribArray(this.vertexPosition_location);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    bind_render_texture(){
        // ready the texture we just rendered to
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, this.render_target_texture);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}