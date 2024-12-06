import { FRAGMENT_SHADER_SRC } from "../shaders/perlin_04_fragmentShader.js";
import { VERTEX_SHADER_SRC } from "../shaders/perlin_04_vertexShader.js";
import { generate_shader_program } from "/ext/webgl_1_core/src/shader_util/shader_engine.js";

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

class Perlin_04 {

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

        //       x value                                           y value
        // 
        //  [-1.0]---[-0.5]----[0.0]----[0.5]----[1.0]         [1.0]----[1.0]----[1.0]----[1.0]----[1.0]
        //     |     /  |     /  |     /  |     /  |             |     /  |     /  |     /  |     /  |  
        //     |    /   |    /   |    /   |    /   |             |    /   |    /   |    /   |    /   |  
        //     |   /    |   /    |   /    |   /    |             |   /    |   /    |   /    |   /    |  
        //  [-1.0]---[-0.5]----[0.0]----[0.5]----[1.0]         [0.5]----[0.5]----[0.5]----[0.5]----[0.5]
        //     |     /  |     /  |     /  |     /  |             |     /  |     /  |     /  |     /  |  
        //     |    /   |    /   |    /   |    /   |             |    /   |    /   |    /   |    /   |  
        //     |   /    |   /    |   /    |   /    |             |   /    |   /    |   /    |   /    |  
        //  [-1.0]---[-0.5]----[0.0]----[0.5]----[1.0]         [0.0]----[0.0]----[0.0]----[0.0]----[0.0]
        //     |     /  |     /  |     /  |     /  |             |     /  |     /  |     /  |     /  |  
        //     |    /   |    /   |    /   |    /   |             |    /   |    /   |    /   |    /   |  
        //     |   /    |   /    |   /    |   /    |             |   /    |   /    |   /    |   /    |  
        //  [-1.0]---[-0.5]----[0.0]----[0.5]----[1.0]        [-0.5]---[-0.5]---[-0.5]---[-0.5]---[-0.5]
        //     |     /  |     /  |     /  |     /  |             |     /  |     /  |     /  |     /  |  
        //     |    /   |    /   |    /   |    /   |             |    /   |    /   |    /   |    /   |  
        //     |   /    |   /    |   /    |   /    |             |   /    |   /    |   /    |   /    |  
        //  [-1.0]---[-0.5]----[0.0]----[0.5]----[1.0]        [-1.0]---[-1.0]---[-1.0]---[-1.0]---[-1.0]
        // 
        // 
        //     vertex index                             face binding
        // 
        //   [ 0]---[ 5]---[10]---[15]---[20]        *--------*--------*--------*--------*
        //     |   /  |   /  |   /  |   /  |         | [ 0] / | [ 8] / | [16] / | [24] / |
        //     |  /   |  /   |  /   |  /   |         |    /   |    /   |    /   |    /   |
        //     | /    | /    | /    | /    |         |  /[ 1] |  /[ 9] |  /[17] |  /[25] |
        //   [ 1]---[ 6]---[11]---[16]---[21]        *--------*--------*--------*--------*
        //     |   /  |   /  |   /  |   /  |         | [ 2] / | [10] / | [18] / | [26] / |
        //     |  /   |  /   |  /   |  /   |         |    /   |    /   |    /   |    /   |
        //     | /    | /    | /    | /    |         |  /[ 3] |  /[11] |  /[19] |  /[ .] |
        //   [ 2]---[ 7]---[12]---[17]---[22]        *--------*--------*--------*--------* 
        //     |   /  |   /  |   /  |   /  |         | [ 4] / | [12] / | [20] / | [28] / |
        //     |  /   |  /   |  /   |  /   |         |    /   |    /   |    /   |    /   |
        //     | /    | /    | /    | /    |         |  /[ 5] |  /[13] |  /[21] |  /[29] |
        //   [ 3]---[ 8]---[13]---[18]---[23]        *--------*--------*--------*--------* 
        //     |   /  |   /  |   /  |   /  |         | [ 6] / | [14] / | [22] / | [30] / |
        //     |  /   |  /   |  /   |  /   |         |    /   |    /   |    /   |    /   |
        //     | /    | /    | /    | /    |         |  /[ 7] |  /[15] |  /[23] |  /[31] |
        //   [ 4]---[ 9]---[14]---[19]---[24]        *--------*--------*--------*--------* 

        this.vertex_count = 25;

        this.vertex_position_data = [
            -1.0,  1.0, 0.0, 1.0,  // v0
            -1.0,  0.5, 0.0, 1.0,  // v1
            -1.0,  0.0, 0.0, 1.0,  // v2
            -1.0, -0.5, 0.0, 1.0,  // v3
            -1.0, -1.0, 0.0, 1.0,  // v4

            -0.5,  1.0, 0.0, 1.0,  // v5
            -0.5,  0.5, 0.0, 1.0,  // v6
            -0.5,  0.0, 0.0, 1.0,  // v7
            -0.5, -0.5, 0.0, 1.0,  // v8
            -0.5, -1.0, 0.0, 1.0,  // v9

             0.0,  1.0, 0.0, 1.0,  // v10
             0.0,  0.5, 0.0, 1.0,  // v11
             0.0,  0.0, 0.0, 1.0,  // v12
             0.0, -0.5, 0.0, 1.0,  // v13
             0.0, -1.0, 0.0, 1.0,  // v14

             0.5,  1.0, 0.0, 1.0,  // v15
             0.5,  0.5, 0.0, 1.0,  // v16
             0.5,  0.0, 0.0, 1.0,  // v17
             0.5, -0.5, 0.0, 1.0,  // v18
             0.5, -1.0, 0.0, 1.0,  // v19

             1.0,  1.0, 0.0, 1.0,  // v20
             1.0,  0.5, 0.0, 1.0,  // v21
             1.0,  0.0, 0.0, 1.0,  // v22
             1.0, -0.5, 0.0, 1.0,  // v23
             1.0, -1.0, 0.0, 1.0,  // v24
        ];

        this.vertex_xy_id = [
            0.0, 4.0, // v0
            0.0, 3.0, // v1
            0.0, 2.0, // v2
            0.0, 1.0, // v3
            0.0, 0.0, // v4

            1.0, 4.0, // v5
            1.0, 3.0, // v6
            1.0, 2.0, // v7
            1.0, 1.0, // v8
            1.0, 0.0, // v9

            2.0, 4.0, // v10
            2.0, 3.0, // v11
            2.0, 2.0, // v12
            2.0, 1.0, // v13
            2.0, 0.0, // v14

            3.0, 4.0, // v15
            3.0, 3.0, // v16
            3.0, 2.0, // v17
            3.0, 1.0, // v18
            3.0, 0.0, // v19

            4.0, 4.0, // v20
            4.0, 3.0, // v21
            4.0, 2.0, // v22
            4.0, 1.0, // v23
            4.0, 0.0, // v24
        ];

        this.clear_perlin_vectors();
        this.regenerate_perlin_vectors();

        

        // for some reason it's clockwise or our xy plane is reversed somehow
        //  we could do this with a loop but we're feeling lazy and it was faster with multi-cursor
        this.face_binding_data = [
            // first column of faces connecting the two columns
            5, 1, 0,    5, 6, 1,
            6, 2, 1,    6, 7, 2,
            7, 3, 2,    7, 8, 3,
            8, 4, 3,    8, 9, 4,

            // next column, which is the same but 5 indices offset
            5+5, 1+5, 0+5,    5+5, 6+5, 1+5,
            6+5, 2+5, 1+5,    6+5, 7+5, 2+5,
            7+5, 3+5, 2+5,    7+5, 8+5, 3+5,
            8+5, 4+5, 3+5,    8+5, 9+5, 4+5,
            
            // now 10 indices offset
            5+10, 1+10, 0+10,    5+10, 6+10, 1+10,
            6+10, 2+10, 1+10,    6+10, 7+10, 2+10,
            7+10, 3+10, 2+10,    7+10, 8+10, 3+10,
            8+10, 4+10, 3+10,    8+10, 9+10, 4+10,
            
            // now 15
            5+15, 1+15, 0+15,    5+15, 6+15, 1+15,
            6+15, 2+15, 1+15,    6+15, 7+15, 2+15,
            7+15, 3+15, 2+15,    7+15, 8+15, 3+15,
            8+15, 4+15, 3+15,    8+15, 9+15, 4+15,
        ];

        // 4x4 grid is 16 quads which have 2 faces each
        this.faceCount = 32;

        // ==========================================
        // === cell count

        this.cell_count = {
            x: 4.0,
            y: 4.0,
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

    clear_perlin_vectors(){
        // all unit vectors
        this.vertex_perlin_vectors = [
            1.0, 0.0, // v0
            1.0, 0.0, // v1
            1.0, 0.0, // v2
            1.0, 0.0, // v3
            1.0, 0.0, // v4

            1.0, 0.0, // v5
            1.0, 0.0, // v6
            1.0, 0.0, // v7
            1.0, 0.0, // v8
            1.0, 0.0, // v9

            1.0, 0.0, // v10
            1.0, 0.0, // v11
            1.0, 0.0, // v12
            1.0, 0.0, // v13
            1.0, 0.0, // v14

            1.0, 0.0, // v15
            1.0, 0.0, // v16
            1.0, 0.0, // v17
            1.0, 0.0, // v18
            1.0, 0.0, // v19

            1.0, 0.0, // v20
            1.0, 0.0, // v21
            1.0, 0.0, // v22
            1.0, 0.0, // v23
            1.0, 0.0, // v24
        ];
    }
    random_unit_vector(){
        // shouldnt be using trig but oh well
        const random_angle = Math.random() * Math.PI * 2.0;
        // generate it and give it
        return {
            x: Math.cos(random_angle),
            y: Math.sin(random_angle),
        };
    }
    regenerate_perlin_vectors(){
        // run through every vertex
        for (let vertex_index = 0; vertex_index < this.vertex_count; vertex_index++) {
            const double_index = vertex_index*2;
            // how to access the current vector in our overall array
            const vector_index = { x: double_index, y: double_index+1, };
            
            // roll a random vector
            const replacement_vector = this.random_unit_vector();

            // replace our vector with it
            this.vertex_perlin_vectors[vector_index.x] = replacement_vector.x;
            this.vertex_perlin_vectors[vector_index.y] = replacement_vector.y;
        }
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
        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_quad_xy_count") , this.cell_count.x, this.cell_count.y );
        
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
        // --- give vectors
        
        this.gl_context.uniform2fv( this.gl_context.getUniformLocation(this.shader, "u_perlin_vectors") , new Float32Array(this.vertex_perlin_vectors) );

        // ----------------------------------------------------------------------------------------
        // --- do the drawing
      
        //                 ( mode, numElements, datatype, offset )
        this.gl_context.drawElements(this.gl_context.TRIANGLES, this.faceCount*3, this.gl_context.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.POINT, this.faceCount*3, this.gl_context.UNSIGNED_SHORT, 0);
      
        // ----------------------------------------------------------------------------------------
        // --- cleanup our shader context
        
        this.gl_context.disableVertexAttribArray(vertex_position_gpu_location);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}

export { Perlin_04 };