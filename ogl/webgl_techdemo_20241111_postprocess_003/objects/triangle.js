import { FRAGMENT_SHADER_SRC } from "../shaders/triangle_fragmentShader.js";
import { VERTEX_SHADER_SRC } from "../shaders/triangle_vertexShader.js";
import { generate_shader_program } from "../shaders.js";

const TAU = 2.0*Math.PI;
class Triangle {

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
        // === prepare model changing variables

        // model to world matrix
        this.modelMatrix = mat4.create();

        this.z_rotation_per_second = 0.1;

        // ==========================================
        // === generate the vertices

        this.vertexValues = [
            // v0
            0.0,   0.5, 0.0, 1.0,
            // v1
            0.5,  -0.5, 0.0, 1.0,
            // v2
            -0.5, -0.5, 0.0, 1.0,
        ];

        // ==========================================
        // === generate the bindings

        this.bindings = [
            // face 0
            0, 1, 2,
        ];

        // ==========================================
        // === prepare face count

        this.faceCount = 1;

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
    }
    

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    update( deltaTime ){
        let z_rotation_factor = TAU * (this.z_rotation_per_second * deltaTime);
        
        mat4.rotateZ(
            this.modelMatrix,
            this.modelMatrix,
            z_rotation_factor,
        );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(){

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
        this.gl_context.drawElements(this.gl_context.TRIANGLES, 3, this.gl_context.UNSIGNED_SHORT, 0);
      
        // ----------------------------------------------------------------------------------------
        // --- cleanup our shader context
        
        // this.gl_context.disableVertexAttribArray(vertexPosition_location);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}

export { Triangle };