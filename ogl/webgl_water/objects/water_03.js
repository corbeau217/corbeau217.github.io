import { Water_02 } from "./water_02.js";
import { FRAGMENT_SHADER_SRC } from "../shaders/water_03_fragment_shader.js";
import { VERTEX_SHADER_SRC } from "../shaders/water_03_vertex_shader.js";
import { generate_shader_program } from "/ogl/common/shaders/shader_engine.js";
import { Perlin_Noise_Machine, generate_normals_for_explode_vertices } from "./perlin_noise_machine.js";

const SQRT_OF_3 = 1.73205080757;




export class Water_03 extends Water_02 {
    constructor( gl_context ){
        super( gl_context );


        this.replace_shader( VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC );
        


        this.y_rotation_radians = Math.PI / 12.0;



        this.noise = [];
        this.initialise_mesh_noise_data();
        this.prepare_noise_handle();
        // loads noise, then regenerate normals
        this.regenerate_mesh();
    }

    // ###########################################
    // ###########################################

    prepare_mesh_attribute_locations(){
        super.prepare_mesh_attribute_locations();

        // gather the attribute shader location
        this.noise_location = this.gl_context.getAttribLocation(this.shader, "a_noise");
    }

    
    // ###########################################
    // ###########################################

    regenerate_mesh(){
        // load the noise information
        this.load_noise_buffer();
        // generate normal vectors
        this.normals = generate_normals_for_explode_vertices( this.vertices, this.noise, this.face_count );
        // fill the normals buffer with information
        this.prepare_mesh_attribute_normals();
    }
    
    // ###########################################
    // ###########################################

    // overwriting with new function
    customise_mesh_shape(){ 
        this.z_function = (x,y)=>{return (-0.8);};
        this.remap_z_values();
        this.rebuild_mesh_as_exploded();
    }
    
    // ###########################################
    // ###########################################

    prepare_noise_handle(){
        this.noise_machine = new Perlin_Noise_Machine( 3, 3 );
        this.noise = this.noise_machine.gather_noise_values_as_float_array( this.shape.vertex_count.x, this.shape.vertex_count.y );
        this.noise = this.rebuild_noise_values( this.shape.bindings, this.noise );
        this.prepare_mesh_attribute_normals();
    }
    
    // ###########################################
    // ###########################################


    initialise_mesh_buffers(){
        super.initialise_mesh_buffers();
        this.noise_buffer = this.gl_context.createBuffer();
    }
    initialise_mesh_noise_data(){
    }
    load_noise_buffer(){
        // ...
        // select references as the one we're working with
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.noise_buffer);
    
        // load the reference data
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.noise),
          this.gl_context.STATIC_DRAW,
        );
        // map it to our attribute
        this.gl_context.vertexAttribPointer(
            this.noise_location,
            3,
            this.gl_context.FLOAT,
            false,
            0,
            0,
        );
    }
    
    // ###########################################
    // ###########################################

    
    // ###########################################
    // ###########################################

    prepare_uniforms( camera_view_matrix, camera_projection_matrix ){
        super.prepare_uniforms( camera_view_matrix, camera_projection_matrix );
        // --------------------------------------------------------
        

        // --------------------------------------------------------

        // ...

        // --------------------------------------------------------
    }
    
    // ###########################################
    // ###########################################

    enable_attributes(){
        super.enable_attributes();
        // ...
        this.gl_context.enableVertexAttribArray(this.noise_location);
    }
    disable_attributes(){
        super.disable_attributes();
        // ...
        this.gl_context.disableVertexAttribArray(this.noise_location);
    }

    // ###########################################
    // ###########################################

    update_noise( delta_time ){
        // TODO: have the noise change
        // this.load_noise_buffer();
    }

    // ###########################################
    // ###########################################

    update( delta_time ){
        super.update( delta_time );
        
        // ...
        this.update_noise( delta_time );

        // ...
        let rotation_factor =  delta_time * this.y_rotation_radians;
        mat4.rotateY( this.model_matrix, this.model_matrix, rotation_factor );
    }

    // ###########################################
    // ###########################################





    rebuild_noise_values( vertex_bindings, noise_data ){
        let new_noise_data = [];
    
        let triangle_count = vertex_bindings.length / 3;
    
        // separate out the information for all triangles
        for (let triangle_index = 0; triangle_index < triangle_count; triangle_index++) {
            // --------------------------------------------------------
            // --------------------------------------------------------
            // --- gather information about the binding
            
            const binding_start = triangle_index*3;
    
            // get the indices to use for our vertex data
            const first_old_vertex_index = vertex_bindings[binding_start+0];
            const second_old_vertex_index = vertex_bindings[binding_start+1];
            const third_old_vertex_index = vertex_bindings[binding_start+2];
    
            // --------------------------------------------------------
            // --------------------------------------------------------
    
            // get the vertices (they're in groups of 3)
            const first_vertex = {
                x: noise_data[( first_old_vertex_index*3)  ],
                y: noise_data[( first_old_vertex_index*3)+1],
                z: noise_data[( first_old_vertex_index*3)+2],
            };
            const second_vertex = {
                x: noise_data[(second_old_vertex_index*3)  ],
                y: noise_data[(second_old_vertex_index*3)+1],
                z: noise_data[(second_old_vertex_index*3)+2],
            };
            const third_vertex = {
                x: noise_data[( third_old_vertex_index*3)  ],
                y: noise_data[( third_old_vertex_index*3)+1],
                z: noise_data[( third_old_vertex_index*3)+2],
            };
    
            // --------------------------------------------------------
            // --------------------------------------------------------
            
            // add to new data
            new_noise_data.push(first_vertex.x);  new_noise_data.push(first_vertex.y);  new_noise_data.push(first_vertex.z);
            new_noise_data.push(second_vertex.x);  new_noise_data.push(second_vertex.y);  new_noise_data.push(second_vertex.z);
            new_noise_data.push(third_vertex.x);  new_noise_data.push(third_vertex.y);  new_noise_data.push(third_vertex.z);
            
            // --------------------------------------------------------
            // --------------------------------------------------------
        }
        
    
        return new_noise_data;
    }
}