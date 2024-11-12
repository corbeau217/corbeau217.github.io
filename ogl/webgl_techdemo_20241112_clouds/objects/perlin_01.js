import { FRAGMENT_SHADER_SRC } from "../shaders/perlin_01_fragmentShader.js";
import { VERTEX_SHADER_SRC } from "../shaders/perlin_01_vertexShader.js";
import { generate_shader_program } from "/ogl/common/shaders/shader_engine.js";

const POSITION_MINIMUMS = {
    x: -1.0,
    y: -1.0,
};
const POSITION_MAXIMUMS = {
    x: 1.0,
    y: 1.0,
};
const MODEL_SPACE_DIMENSIONS = {
    x: POSITION_MAXIMUMS.x - POSITION_MINIMUMS.x,
    y: POSITION_MAXIMUMS.y - POSITION_MINIMUMS.y,
};

class Perlin_01 {

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
        // === generate the shape

        // vertex index         x value              y value            face binding
        // 
        //   [0]---[3]---[6]    [-1]---[0]---[1]    [1]---[1]---[1]    *-----*-----*
        //    |   / |   / |       |   / |   / |      |   / |   / |     |[0]/ |[4]/ |
        //    |  /  |  /  |       |  /  |  /  |      |  /  |  /  |     |  /  |  /  |
        //    | /   | /   |       | /   | /   |      | /   | /   |     | /[1]| /[5]|
        //   [1]---[4]---[7]    [-1]---[0]---[1]    [0]---[0]---[0]    *-----*-----*
        //    |   / |   / |       |   / |   / |      |   / |   / |     |[2]/ |[6]/ |
        //    |  /  |  /  |       |  /  |  /  |      |  /  |  /  |     |  /  |  /  |
        //    | /   | /   |       | /   | /   |      | /   | /   |     | /[3]| /[7]|
        //   [2]---[5]---[8]    [-1]---[0]---[1]    [-1]--[-1]--[-1]   *-----*-----* 

        this.vertex_position_data = [
            -1.0,  1.0, 0.0, 1.0,  // v0
            -1.0,  0.0, 0.0, 1.0,  // v1
            -1.0, -1.0, 0.0, 1.0,  // v2

             0.0,  1.0, 0.0, 1.0,  // v3
             0.0,  0.0, 0.0, 1.0,  // v4
             0.0, -1.0, 0.0, 1.0,  // v5
            
             1.0,  1.0, 0.0, 1.0,  // v6
             1.0,  0.0, 0.0, 1.0,  // v7
             1.0, -1.0, 0.0, 1.0,  // v8
        ];

        this.vertex_xy_id = [
            0.0, 2.0, // v0
            0.0, 1.0, // v1
            0.0, 0.0, // v2

            1.0, 2.0, // v3
            1.0, 1.0, // v4
            1.0, 0.0, // v5

            2.0, 2.0, // v6
            2.0, 1.0, // v7
            2.0, 0.0, // v8
        ];

        // for some reason it's clockwise or our xy plane is reversed somehow
        this.face_binding_data = [
            3, 1, 0, // f0
            3, 4, 1, // f1

            4, 2, 1, // f2
            4, 5, 2, // f3

            6, 4, 3, // f4
            6, 7, 4, // f5

            7, 5, 4, // f6
            7, 8, 5, // f7
        ];

        this.faceCount = 8;

        // ==========================================
        // === cell count

        this.cell_count = {
            x: 2.0,
            y: 2.0,
        };

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
            new Float32Array(this.vertex_position_data),
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
            new Uint16Array(this.face_binding_data),
            this.gl_context.STATIC_DRAW
        );
        
        // ==========================================
        // === prepare id mappings

        this.vertex_xy_id_buffer = this.gl_context.createBuffer();
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.vertex_xy_id_buffer);
    
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.vertex_xy_id),
          this.gl_context.STATIC_DRAW,
        );

        // ==========================================
        // ==========================================
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
        // Clear the canvas AND the depth buffer.
        // this.gl_context.clearColor(1, 1, 1, 1);   // clear to white
        this.gl_context.clear(this.gl_context.COLOR_BUFFER_BIT | this.gl_context.DEPTH_BUFFER_BIT);

        // ----------------------------------------------------------------------------------------
        // --- prepare our shader

        // tell webgl to use our program when drawing
        this.gl_context.useProgram(this.shader);

        // ----------------------------------------------------------------------------------------

        // the size of our space
        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_vertex_xy_count") , this.cell_count.x, this.cell_count.y );

        // ----------------------------------------------------------------------------------------


    
        // select the indexBuffer as one to apply
        //  buffer opers to from now on
        this.gl_context.bindBuffer(this.gl_context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    
        // allocate space on gpu of the number of indices
        this.gl_context.bufferData(
            this.gl_context.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.face_binding_data),
            this.gl_context.STATIC_DRAW
        );
        

        // ----------------------------------------------------------------------------------------
        // --- prepare our positions

        let vertex_position_gpu_location = this.gl_context.getAttribLocation(this.shader, "a_vertex_position");

        // 0 = use type and numComponents above
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.positionBuffer);
        this.gl_context.vertexAttribPointer(
            vertex_position_gpu_location,
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
        this.gl_context.enableVertexAttribArray(vertex_position_gpu_location);
      
        // ----------------------------------------------------------------------------------------
        // --- prepare the texture data

        let a_vertex_xy_id_location = this.gl_context.getAttribLocation(this.shader, "a_vertex_xy_id");
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.vertex_xy_id_buffer);
    
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.vertex_xy_id),
          this.gl_context.STATIC_DRAW,
        );
        this.gl_context.vertexAttribPointer(
            a_vertex_xy_id_location,
            2,
            this.gl_context.FLOAT,
            false, // TODO: try this with true to see the result
            0,
            0,
        );
        this.gl_context.enableVertexAttribArray(a_vertex_xy_id_location);

        // ----------------------------------------------------------------------------------------
        // --- do the drawing
      
        //                 ( mode, numElements, datatype, offset )
        this.gl_context.drawElements(this.gl_context.TRIANGLES, this.faceCount*3, this.gl_context.UNSIGNED_SHORT, 0);
      
        // ----------------------------------------------------------------------------------------
        // --- cleanup our shader context
        
        this.gl_context.disableVertexAttribArray(vertex_position_gpu_location);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}

export { Perlin_01 };