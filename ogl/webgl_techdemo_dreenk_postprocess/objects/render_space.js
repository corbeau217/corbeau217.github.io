import { FRAGMENT_SHADER_SRC } from "../shaders/render_fragmentShader.js";
import { VERTEX_SHADER_SRC } from "../shaders/render_vertexShader.js";
import { generate_shader_program } from "/ogl/common/shaders/shader_engine.js";

class Render_Space {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // creates a scene object
    constructor( gl_context ){
        // local reference to opengl context
        this.gl_context = gl_context;
        // make the shader for this can
        this.shader = generate_shader_program(this.gl_context, VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC);

        // ==========================================
        // === prepare viewport information
        this.viewport_dimensions = {
            x: this.gl_context.canvas.width,
            y: this.gl_context.canvas.height,
        };
        this.render_dimensions = {
            x: Math.floor(this.viewport_dimensions.x/4),
            y: Math.floor(this.viewport_dimensions.y/4),
        };
        

        // ==========================================
        // === generate the shape

        this.vertexValues = [
            // v0
            -1.0,  1.0, 0.0, 1.0,
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
    

        // create a buffer for the shape's positions.
        this.positionBuffer = this.gl_context.createBuffer();
    
        // selec the vertexBuffer as one to apply
        //  buffer opers to from now on
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.positionBuffer);
    
    
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
    
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.uv_mappings),
          this.gl_context.STATIC_DRAW,
        );

        // ==========================================
        // === create the texture

        this.render_target_texture = this.gl_context.createTexture();
        // bind it for modification
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, this.render_target_texture);
        const level = 0;
        const internalFormat = this.gl_context.RGBA;
        const border = 0;
        const format = this.gl_context.RGBA;
        const type = this.gl_context.UNSIGNED_BYTE;
        const data = null; // dont supply data, just allocate the texture

        // for now we use the same size as the viewport otherwise we need a camera
        this.gl_context.texImage2D(this.gl_context.TEXTURE_2D, level, internalFormat,
                            this.render_dimensions.x, this.render_dimensions.y, border,
                            format, type, data);
        
        this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_MIN_FILTER, this.gl_context.NEAREST);
        this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_MAG_FILTER, this.gl_context.NEAREST);
        this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_WRAP_S, this.gl_context.CLAMP_TO_EDGE);
        this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_WRAP_T, this.gl_context.CLAMP_TO_EDGE);

        // ==========================================
        // === build frame buffer

        // Create and bind the framebuffer
        this.fb = this.gl_context.createFramebuffer();
        this.gl_context.bindFramebuffer(this.gl_context.FRAMEBUFFER, this.fb);
        
        // attach the texture as the first color attachment
        const attachmentPoint = this.gl_context.COLOR_ATTACHMENT0;
        this.gl_context.framebufferTexture2D( this.gl_context.FRAMEBUFFER, attachmentPoint,
            this.gl_context.TEXTURE_2D, this.render_target_texture, level );


        
        // unbind the frame buffer for other operations
        this.gl_context.bindFramebuffer(this.gl_context.FRAMEBUFFER, null);
        // ==========================================
        // ==========================================
    }
    

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    prepare_render_space(){
        // render to our targetTexture by binding the framebuffer
        this.gl_context.bindFramebuffer(this.gl_context.FRAMEBUFFER, this.fb);
    
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

    get_render_aspect(){
        return this.render_dimensions.x / this.render_dimensions.y;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    update( deltaTime ){
        // ...
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(){
        this.prepare_canvas_space();

        // ----------------------------------------------------------------------------------------
        // --- prepare our shader

        // tell webgl to use our program when drawing
        this.gl_context.useProgram(this.shader);

        // ----------------------------------------------------------------------------------------

        // the size of our texture
        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_texture_size") , this.render_dimensions.x, this.render_dimensions.y );
        // the size of a pixel in our uv mapping
        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_uv_pixel_size") , 1.0/this.render_dimensions.x, 1.0/this.render_dimensions.y );

        // ----------------------------------------------------------------------------------------


    
        // select the indexBuffer as one to apply
        //  buffer opers to from now on
        this.gl_context.bindBuffer(this.gl_context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    
        // allocate space on gpu of the number of indices
        this.gl_context.bufferData(
            this.gl_context.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.bindings),
            this.gl_context.STATIC_DRAW
        );
        

        // ----------------------------------------------------------------------------------------
        // --- prepare our positions

        let vertexPosition_location = this.gl_context.getAttribLocation(this.shader, "a_vertex_position");

        // 0 = use type and numComponents above
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.positionBuffer);
        this.gl_context.vertexAttribPointer(
            vertexPosition_location,
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
        // allow the vertex position attribute to exist
        this.gl_context.enableVertexAttribArray(vertexPosition_location);
      
        // ----------------------------------------------------------------------------------------
        // --- prepare the texture data

        let a_texcoord_location = this.gl_context.getAttribLocation(this.shader, "a_texcoord");

        const num = 2; // every coordinate composed of 2 values
        const type = this.gl_context.FLOAT; // the data in the buffer is 32-bit float
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set to the next
        const offset = 0; // how many bytes inside the buffer to start from
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.uv_mappings_buffer);
        // this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.uv_mappings_buffer);
    
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.uv_mappings),
          this.gl_context.STATIC_DRAW,
        );
        this.gl_context.vertexAttribPointer(
            a_texcoord_location,
            num,
            type,
            normalize,
            stride,
            offset,
        );
        this.gl_context.enableVertexAttribArray(a_texcoord_location);

        // ----------------------------------------------------------------------------------------
        // --- do the drawing
      
        //                 ( mode, numElements, datatype, offset )
        this.gl_context.drawElements(this.gl_context.TRIANGLES, this.faceCount*3, this.gl_context.UNSIGNED_SHORT, 0);
      
        // ----------------------------------------------------------------------------------------
        // --- cleanup our shader context
        
        this.gl_context.disableVertexAttribArray(vertexPosition_location);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}

export { Render_Space };