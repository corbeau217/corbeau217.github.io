import { FRAGMENT_SHADER_SRC } from "../shaders/perlin_08_fragmentShader.js";
import { VERTEX_SHADER_SRC } from "../shaders/perlin_08_vertexShader.js";
import { generate_shader_program } from "/ogl/common/shaders/shader_engine.js";

export class Perlin_08 {

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
        // === build it

        this.build_mesh();

        // ==========================================
        // === bind the shape
    
        
        this.gather_attribute_locations();
        this.enable_attributes();
        this.create_buffers();
        this.initialise_shape_data();
        this.disable_attributes();
        

        // ==========================================
        // ==========================================
        // === prepare other data

        this.clear_perlin_vectors();
        this.regenerate_perlin_vectors();

        // ==========================================
        // ==========================================
    }
    
    build_mesh(){

        // ==========================================
        // === generate the shape

        // sizing of the grid
        this.grid_size = {
            x: 9.0,
            y: 9.0,
        }

        // how many vectors
        this.corner_count = this.grid_size.x * this.grid_size.y;

        // ==========================================
        // === cell count

        this.cell_count = {
            x: this.grid_size.x-1.0,
            y: this.grid_size.y-1.0,
        };

        this.vertices = [
            -1.0,  1.0, 0.0, 1.0,  // v0
            -1.0, -1.0, 0.0, 1.0,  // v1
             1.0, -1.0, 0.0, 1.0,  // v2
             1.0,  1.0, 0.0, 1.0,  // v3
        ];

        this.vertex_references = [
            0.0,               this.cell_count.y, // v0
            0.0,               0.0,               // v1
            this.cell_count.x, 0.0,               // v2
            this.cell_count.x, this.cell_count.y, // v3
        ];

        // for some reason it's clockwise or our xy plane is reversed somehow
        //  we could do this with a loop but we're feeling lazy and it was faster with multi-cursor
        this.indices = [
            0, 2, 1,
            0, 3, 2,
        ];

        // 4x4 grid is 16 quads which have 2 faces each
        this.face_count = 2;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    gather_attribute_locations(){
        this.vertex_position_location = this.gl_context.getAttribLocation(this.shader, "a_vertex_position");
        this.vertex_reference_location = this.gl_context.getAttribLocation(this.shader, "a_vertex_reference");
    }
    create_buffers(){
        this.indices_buffer = this.gl_context.createBuffer();
        this.vertex_buffer = this.gl_context.createBuffer();
        this.vertex_reference_buffer = this.gl_context.createBuffer();
    }
    initialise_shape_data(){


        // ---------------------------------------------
        // ---------------------------------------------
    

        // prepare the vertex position buffer as the one to work on
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.vertex_buffer);
        // load the positions into the buffer
        this.gl_context.bufferData(
            this.gl_context.ARRAY_BUFFER,
            new Float32Array(this.vertices),
            this.gl_context.STATIC_DRAW
        );
        // link it to our attribute for usage in the shader
        this.gl_context.vertexAttribPointer(
            this.vertex_position_location,
            4,
            this.gl_context.FLOAT,
            false,
            0,
            0
        );
        
        // ---------------------------------------------
        // ---------------------------------------------

        // prepare the index buffer as the one we're working on
        this.gl_context.bindBuffer(this.gl_context.ELEMENT_ARRAY_BUFFER, this.indices_buffer);
        // announce the data as our indices/bindings data
        this.gl_context.bufferData(
            this.gl_context.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indices),
            this.gl_context.STATIC_DRAW
        );

        // ---------------------------------------------
        // ---------------------------------------------

        // select references as the one we're working with
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.vertex_reference_buffer);
    
        // load the reference data
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.vertex_references),
          this.gl_context.STATIC_DRAW,
        );
        // map it to our attribute
        this.gl_context.vertexAttribPointer(
            this.vertex_reference_location,
            2,
            this.gl_context.FLOAT,
            false,
            0,
            0,
        );
        
        // ---------------------------------------------
        // ---------------------------------------------
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    prepare_uniforms(){

        // the size of our space
        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_quad_xy_count") , this.cell_count.x, this.cell_count.y );
        this.gl_context.uniform2fv( this.gl_context.getUniformLocation(this.shader, "u_perlin_vectors") , new Float32Array(this.vertex_perlin_vectors) );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    enable_attributes(){
        this.gl_context.enableVertexAttribArray(this.vertex_position_location);
        this.gl_context.enableVertexAttribArray(this.vertex_reference_location);

        // // prepare the index buffer as the one we're working on
        // this.gl_context.bindBuffer(this.gl_context.ELEMENT_ARRAY_BUFFER, this.indices_buffer);
        // // announce the data as our indices/bindings data
        // this.gl_context.bufferData(
        //     this.gl_context.ELEMENT_ARRAY_BUFFER,
        //     new Uint16Array(this.indices),
        //     this.gl_context.STATIC_DRAW
        // );
    }
    disable_attributes(){
        this.gl_context.disableVertexAttribArray(this.vertex_reference_location);
        this.gl_context.disableVertexAttribArray(this.vertex_position_location);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    prepare_drawing_environment(){
        // Clear the canvas AND the depth buffer.
        // this.gl_context.clearColor(1, 1, 1, 1);   // clear to white
        this.gl_context.clear(this.gl_context.COLOR_BUFFER_BIT | this.gl_context.DEPTH_BUFFER_BIT);

        // ----------------------------------------------------------------------------------------
        // --- prepare our shader

        // tell webgl to use our program when drawing
        this.gl_context.useProgram(this.shader);
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    update(t){
        // zzz
    }
    draw(){
        // setup shader etc
        this.prepare_drawing_environment();

        this.enable_attributes();
        this.prepare_uniforms();
        

        // ----------------------------------------------------------------------------------------
        // --- do the drawing
      
        //                 ( mode, numElements, datatype, offset )
        this.gl_context.drawElements(this.gl_context.TRIANGLES, this.face_count*3, this.gl_context.UNSIGNED_SHORT, 0);
        
        this.disable_attributes();
        
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################



    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    


    clear_perlin_vectors(){
        // all unit vectors
        this.vertex_perlin_vectors = [];
        for (let index = 0; index < this.corner_count; index++) {
            // X
            this.vertex_perlin_vectors.push(1.0);
            // Y
            this.vertex_perlin_vectors.push(0.0);
        }
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
        for (let vertex_index = 0; vertex_index < this.corner_count; vertex_index++) {
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
    

}