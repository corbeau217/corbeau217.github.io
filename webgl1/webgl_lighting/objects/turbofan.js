import { FRAGMENT_SHADER_SRC } from "../shaders/turbofan_fragmentShader.js";
import { VERTEX_SHADER_SRC } from "../shaders/turbofan_vertexShader.js";
import { Engine_Shape } from "/webgl1/old_common/obj/engine.js"
import { generate_shader_program } from "/ext/webgl_1_core/src/shader_util/shader_engine.js";

const TAU = 2.0*Math.PI;
export class TurboFan {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // creates a scene object
    constructor( gl_context ){
        // local reference to opengl context
        this.gl_context = gl_context;
        // make the shader for this can
        this.shader = generate_shader_program(this.gl_context, VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC);

        this.turbofan_shape = new Engine_Shape();

        // ==========================================
        // === prepare model changing variables


        // model to world matrix
        this.modelMatrix = mat4.create();

        this.y_rotation_per_second = 0.1;

        // ==========================================
        // === generate the vertices

        this.vertexValues = this.turbofan_shape.get_vertices();

        // ==========================================
        // === generate the bindings

        this.bindings = this.turbofan_shape.get_indices();

        // ==========================================
        // === prepare face count

        this.faceCount = (this.bindings.length/3);

        // ==========================================
    

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
        // ==========================================

        // mat4.scale(
        //     this.modelMatrix,
        //     this.modelMatrix,
        //     [0.3, 0.3, 0.3]
        // );

        // ==========================================
        // ==========================================
    }
    

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    update( deltaTime ){
        let y_rotation_factor = TAU * (this.y_rotation_per_second * deltaTime);
        
        mat4.rotateY(
            this.modelMatrix,
            this.modelMatrix,
            y_rotation_factor,
        );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(cameraViewMatrix, cameraProjectionMatrix){

        // ----------------------------------------------------------------------------------------
        // --- prepare our shader

        // tell webgl to use our program when drawing
        this.gl_context.useProgram(this.shader);

        // ----------------------------------------------------------------------------------------
        // --- provide model matrix

        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_model_matrix"), false, this.modelMatrix );

        // ----------------------------------------------------------------------------------------
        // --- prepare our positions

        let vertexPosition_location = this.gl_context.getAttribLocation(this.shader, "aVertexPosition");



        this.gl_context.bindBuffer(this.gl_context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        
        // indices = generateBindings();
    
        // allocate space on gpu of the number of indices
        this.gl_context.bufferData(
            this.gl_context.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.bindings),
            this.gl_context.STATIC_DRAW
        );
      
        // set the shader uniforms
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_projection_matrix"), false, cameraProjectionMatrix );
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_view_matrix"), false, cameraViewMatrix );

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
        // --- do the drawing
      
        //                 ( mode, numElements, datatype, offset )
        // this.gl_context.drawElements(this.gl_context.TRIANGLES, this.faceCount*3, this.gl_context.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.LINE_STRIP, this.faceCount*3, this.gl_context.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.POINTS, this.faceCount*3, this.gl_context.UNSIGNED_SHORT, 0);
      
        // ----------------------------------------------------------------------------------------
        // --- cleanup our shader context
        
        // this.gl_context.disableVertexAttribArray(vertexPosition_location);
        this.gl_context.disableVertexAttribArray(vertexPosition_location);  
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}