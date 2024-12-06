import { FRAGMENT_SHADER_SRC } from "../shaders/dreenk_fragmentShader.js";
import { VERTEX_SHADER_SRC } from "../shaders/dreenk_vertexShader.js";
import { generate_shader_program } from "/ext/webgl_1_core/src/shader_util/shader_engine.js";
import { Can_Shape } from "/webgl1/old_common/obj/can_shape.js";

const TAU = 2.0*Math.PI;
const CIRCLE_POINTS = 16;

class Can {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // creates a scene object
    constructor( gl_context ){
        // local references, very cursed
        this.gl_context = gl_context;
        // make the shader for this can
        this.shader = generate_shader_program(this.gl_context, VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC);

        this.can_shape = new Can_Shape();

        // model to world matrix, just use identity for now
        this.modelMatrix = mat4.create();
        this.modelMatrix_translation = mat4.create();
        this.modelMatrix_rotation = mat4.create();
        this.modelMatrix_rotation_offKilter = mat4.create();
        this.modelMatrix_rotation_updateFactor = mat4.create();
        this.modelMatrix_scale = mat4.create();

        this.generate_rotation_matrices();
        
        // prepare shape references
        this.textureCoordinates = this.can_shape.get_uv_mappings();
        this.vertexValues = this.can_shape.get_vertices();
        this.bindings = this.can_shape.get_indices();

        this.texture_path = "/img/dreenk_texture.png";
        
        // Load texture
        this.loadTexture( gl_context );

        this.circlePoints = CIRCLE_POINTS;

        // create a buffer for the shape's positions.
        this.positionBuffer = this.gl_context.createBuffer();
    
        // selec the vertexBuffer as one to apply
        //  buffer opers to from now on
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.positionBuffer);
    
        // generateVertices();
    
    
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
        
        // indices = generateBindings();
    
        // allocate space on gpu of the number of indices
        this.gl_context.bufferData(
            this.gl_context.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.bindings),
            this.gl_context.STATIC_DRAW
        );
    
        this.textureCoordBuffer = this.gl_context.createBuffer();
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.textureCoordBuffer);
    
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.textureCoordinates),
          this.gl_context.STATIC_DRAW,
        );


        // enforce it on can building
        // Flip image pixels into the bottom-to-top order that WebGL expects.
        this.gl_context.pixelStorei(this.gl_context.UNPACK_FLIP_Y_WEBGL, true);
        
    }



    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
   
    generate_rotation_matrices(){

        // factor of TAU in radians
        //  [1.0  * TAU] == 360
        //  [0.75 * TAU] == 270
        //  [0.5  * TAU] == 180
        //  [0.25 * TAU] ==  90
        this.model_rotation_initial = [
            // Rx
            -(2.0/3.0)/4.0,
            // Ry
            0.0,
            // Rz
            0.05,
        ];
        // anything other than y rotation tends to make it spin weird bc of the way we set up axises
        this.model_rotation_per_frame_factor = [
            0.0,
            0.1,
            0.0,
        ];

        // heaper order, heading pitch roll
        mat4.rotateY(
            this.modelMatrix_rotation_offKilter,
            this.modelMatrix_rotation_offKilter,
            this.model_rotation_initial[1] * TAU,
        );
        mat4.rotateX(
            this.modelMatrix_rotation_offKilter,
            this.modelMatrix_rotation_offKilter,
            this.model_rotation_initial[0] * TAU,
        );
        mat4.rotateZ(
            this.modelMatrix_rotation_offKilter,
            this.modelMatrix_rotation_offKilter,
            this.model_rotation_initial[2] * TAU,
        );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }
    loadTexture(){
        // ...

        this.texture = this.gl_context.createTexture();
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, this.texture);
    
        // Because images have to be downloaded over the internet
        // they might take a moment until they are ready.
        // Until then put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        const level = 0;
        const internalFormat = this.gl_context.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = this.gl_context.RGBA;
        const srcType = this.gl_context.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
        this.gl_context.texImage2D(
            this.gl_context.TEXTURE_2D,
            level,
            internalFormat,
            width,
            height,
            border,
            srcFormat,
            srcType,
            pixel
        );
    
        this.texture_image = new Image();
        this.texture_image.onload = () => {
            this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, this.texture);
            this.gl_context.texImage2D(
                this.gl_context.TEXTURE_2D,
                level,
                internalFormat,
                srcFormat,
                srcType,
                this.texture_image
            );
        
            // WebGL1 has different requirements for power of 2 images
            // vs non power of 2 images so check if the image is a
            // power of 2 in both dimensions.
            if (this.isPowerOf2(this.texture_image.width) && this.isPowerOf2(this.texture_image.height)) {
                // Yes, it's a power of 2. Generate mips.
                this.gl_context.generateMipmap(this.gl_context.TEXTURE_2D);
            } else {
                // No, it's not a power of 2. Turn off mips and set
                // wrapping to clamp to edge
                this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_WRAP_S, this.gl_context.CLAMP_TO_EDGE);
                this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_WRAP_T, this.gl_context.CLAMP_TO_EDGE);
                // this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_MIN_FILTER, this.gl_context.LINEAR);
            }
        };
        this.texture_image.src = this.texture_path;
  
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    rebuild_model_matrix(){
        // incase we have existing junk in the matrix
        mat4.identity(this.modelMatrix);
      
        // ---- translate ----
        // existing translation
        mat4.multiply(
            // destination
            this.modelMatrix,
            // left matrix
            this.modelMatrix,
            // right matrix
            this.modelMatrix_translation
        );
      
        // ---- rotation ----
        // existing rotation that was then translated
        mat4.multiply(
            // destination
            this.modelMatrix,
            // left matrix
            this.modelMatrix,
            // right matrix
            this.modelMatrix_rotation,
        );
      
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    updateRotationMatrix(deltaTime){
        // wipe the rotation matrix
        this.modelMatrix_rotation = mat4.create();
      
        mat4.rotateY(
            this.modelMatrix_rotation_updateFactor,
            this.modelMatrix_rotation_updateFactor,
            this.model_rotation_per_frame_factor[1] * TAU * deltaTime,
        );
        mat4.rotateX(
            this.modelMatrix_rotation_updateFactor,
            this.modelMatrix_rotation_updateFactor,
            this.model_rotation_per_frame_factor[0] * TAU * deltaTime,
        );
        mat4.rotateZ(
            this.modelMatrix_rotation_updateFactor,
            this.modelMatrix_rotation_updateFactor,
            this.model_rotation_per_frame_factor[2] * TAU * deltaTime,
        );
      
        // merge together in the overall one
        mat4.multiply(
            // destination
            this.modelMatrix_rotation,
            // left matrix
            this.modelMatrix_rotation_updateFactor,
            // right matrix
            this.modelMatrix_rotation_offKilter,
        );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    update( deltaTime ){
        // does the rotation
        this.updateRotationMatrix(deltaTime);

        // TRS the model matrix
        this.rebuild_model_matrix(deltaTime);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(cameraViewMatrix, cameraProjectionMatrix){

        // tell webgl to use our program when drawing
        this.gl_context.useProgram(this.shader);

        // every draw to make sure it's the right direction
        // Flip image pixels into the bottom-to-top order that WebGL expects.
        this.gl_context.pixelStorei(this.gl_context.UNPACK_FLIP_Y_WEBGL, true);


        let vertexPosition_location = this.gl_context.getAttribLocation(this.shader, "aVertexPosition");
        
        
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "uModelMatrix"), false, this.modelMatrix );



        this.gl_context.bindBuffer(this.gl_context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        
        // indices = generateBindings();
    
        // allocate space on gpu of the number of indices
        this.gl_context.bufferData(
            this.gl_context.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.bindings),
            this.gl_context.STATIC_DRAW
        );


      
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.positionBuffer);
        this.gl_context.vertexAttribPointer(
            vertexPosition_location,
            4,
            this.gl_context.FLOAT,
            false,
            0,
            0
        );
        this.gl_context.enableVertexAttribArray(vertexPosition_location);
      
        
        // -----------------------------------------------------


        let textureCoords_location = this.gl_context.getAttribLocation(this.shader, "aTextureCoord");
        this.gl_context.enableVertexAttribArray(textureCoords_location);
        
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.textureCoordBuffer);
    
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.textureCoordinates),
          this.gl_context.STATIC_DRAW,
        );

        this.gl_context.vertexAttribPointer(
            textureCoords_location,
            2, // every coordinate composed of 2 values
            this.gl_context.FLOAT,
            false,
            0,
            0,
        );

        // -----------------------------------------------------

        // -----------------------------------------------------
        // -----------------------------------------------------
      
      
        // set the shader uniforms
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "uProjectionMatrix"), false, cameraProjectionMatrix );
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "uViewMatrix"), false, cameraViewMatrix );
      

        // Tell WebGL we want to affect texture unit 0
        this.gl_context.activeTexture(this.gl_context.TEXTURE0);

        // Bind the texture to texture unit 0
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, this.texture);

      
        // Tell the shader we bound the texture to texture unit 0
        this.gl_context.uniform1i(this.gl_context.getUniformLocation(this.shader, "uSampler"), 0);
      
      
        //                 ( mode, numElements, datatype, offset )
        // gl.drawElements(gl.LINE_STRIP, 60, gl.UNSIGNED_SHORT, 0);
        // gl.drawElements(gl.TRIANGLE_STRIP, (buffers.triangleCount*3), gl.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.TRIANGLES, (4*this.circlePoints)*3, this.gl_context.UNSIGNED_SHORT, 0);


        
        this.gl_context.disableVertexAttribArray(vertexPosition_location);
        this.gl_context.disableVertexAttribArray(textureCoords_location);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}

export { Can };