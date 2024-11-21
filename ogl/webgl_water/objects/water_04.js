import { Water_03 } from "./water_03.js";

import { VERTEX_SHADER_SRC as water_04_vertex_shader_source } from "../shaders/water_04_vertex_shader.js";
import { FRAGMENT_SHADER_SRC as water_04_fragment_shader_source } from "../shaders/water_04_fragment_shader.js";

import { Perlin_Noise_Machine, generate_normals_for_explode_vertices } from "./perlin_noise_machine.js";




export class Water_04 extends Water_03 {

    // ################################## -- WATER -- OVERRIDES
    // ###########################################
    // ###########################################

    constructor( gl_context ){
        super( gl_context );
        this.replace_shader( water_04_vertex_shader_source, water_04_fragment_shader_source );
        
        this.rebuild_mesh_as_exploded();

        this.prepare_noise_handle();
        // loads noise, then regenerate normals
        this.regenerate_mesh();
    }
    prepare_settings(){
        super.prepare_settings();

        this.time_interpolation_value = { x: 0.0, y: 0.0, dt: 0.0 };

        this.noise_2 = [];
        this.normals_2 = [];
    }

    initialise_mesh_buffers(){
        super.initialise_mesh_buffers();
        this.normal_2_buffer = this.gl_context.createBuffer();
        this.noise_2_buffer = this.gl_context.createBuffer();
    }

    prepare_mesh_attribute_locations(){
        super.prepare_mesh_attribute_locations();

        // gather the attribute shader location
        this.normal_2_location = this.gl_context.getAttribLocation(this.shader, "a_normal_2");
        this.noise_2_location = this.gl_context.getAttribLocation(this.shader, "a_noise_2");
    }

    prepare_uniforms( camera_view_matrix, camera_projection_matrix ){
        super.prepare_uniforms( camera_view_matrix, camera_projection_matrix );
        // --------------------------------------------------------
        
        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_time_val"), this.time_interpolation_value.x, this.time_interpolation_value.y, this.time_interpolation_value.dt );

        // --------------------------------------------------------
    }

    enable_attributes(){
        super.enable_attributes();
        // ...
        this.gl_context.enableVertexAttribArray(this.normal_2_location);
        this.gl_context.enableVertexAttribArray(this.noise_2_location);
    }
    disable_attributes(){
        super.disable_attributes();
        // ...
        this.gl_context.disableVertexAttribArray(this.noise_2_location);
        this.gl_context.disableVertexAttribArray(this.normal_2_location);
    }

    // ################################## -- WATER_02 -- OVERRIDES
    // ###########################################
    // ###########################################

    prepare_mesh_attribute_normals(){
        super.prepare_mesh_attribute_normals();
        // select references as the one we're working with
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.normal_2_buffer);
    
        // load the reference data
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.normals_2),
          this.gl_context.STATIC_DRAW,
        );
        // map it to our attribute
        this.gl_context.vertexAttribPointer(
            this.normal_2_location,
            3,
            this.gl_context.FLOAT,
            false,
            0,
            0,
        );
    }

    // ################################## -- WATER_03 -- OVERRIDES
    // ###########################################
    // ###########################################

    // OVERRIDE
    regenerate_mesh(){
        // load the noise information
        this.load_noise_buffer();

        // generate normal vectors
        this.normals = generate_normals_for_explode_vertices( this.vertices, this.noise, this.face_count );
        this.normals_2 = generate_normals_for_explode_vertices( this.vertices, this.noise_2, this.face_count );

        // fill the normals buffer with information
        this.prepare_mesh_attribute_normals();
    }

    prepare_noise_handle(){
        super.prepare_noise_handle();
        this.noise_2_machine = new Perlin_Noise_Machine( 3, 3 );
        this.noise_2 = this.noise_2_machine.gather_noise_values_as_float_array( this.shape.vertex_count.x, this.shape.vertex_count.y );
        this.noise_2 = this.rebuild_noise_values(this.noise_2);
        this.prepare_mesh_attribute_normals();
    }

    load_noise_buffer(){
        super.load_noise_buffer();
        // ...
        // select references as the one we're working with
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.noise_2_buffer);
    
        // load the reference data
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.noise_2),
          this.gl_context.STATIC_DRAW,
        );
        // map it to our attribute
        this.gl_context.vertexAttribPointer(
            this.noise_2_location,
            3,
            this.gl_context.FLOAT,
            false,
            0,
            0,
        );
    }

    update_noise( delta_time ){
        super.update_noise( delta_time );

        // increase our time
        this.time_interpolation_value.dt += delta_time;

        // get the x and y interpolation values
        this.time_interpolation_value.x = (Math.cos(this.time_interpolation_value.dt)+1.0)/2.0;
        // this.time_interpolation_value.y = (Math.sin(this.time_interpolation_value.dt)+1.0)/2.0;
    }

    // ###########################################
    // ###########################################

}