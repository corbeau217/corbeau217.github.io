import { Water_02 } from "./water_02.js";
import { FRAGMENT_SHADER_SRC } from "../shaders/water_03_fragment_shader.js";
import { VERTEX_SHADER_SRC } from "../shaders/water_03_vertex_shader.js";
import { generate_shader_program } from "/ogl/common/shaders/shader_engine.js";
import { Perlin_Noise_Machine } from "./perlin_noise_machine.js";

const SQRT_OF_3 = 1.73205080757;

export class Water_03 extends Water_02 {
    constructor( gl_context ){
        super( gl_context );

        // replace with a better shader
        this.gl_context.deleteProgram(this.shader);
        this.shader = generate_shader_program( this.gl_context, VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC );
        
        this.noise = [];
        this.initialise_mesh_noise_data();
        this.prepare_noise_handle();
        this.load_noise_buffer();
    }

    
    // ###########################################
    // ###########################################

    // overwriting with new function
    customise_mesh_shape(){ 
        this.z_function = (x,y)=>{return (-1.0);};
        this.remap_z_values();
        this.rebuild_mesh_as_exploded();
    }
    
    // ###########################################
    // ###########################################

    prepare_noise_handle(){
        this.noise_machine = new Perlin_Noise_Machine( 3, 3 );
        this.noise = this.noise_machine.gather_noise_values_as_float_array( this.shape.vertex_count.x, this.shape.vertex_count.y );
    }
    
    // ###########################################
    // ###########################################

    initialise_mesh_noise_data(){
        this.noise_location = this.gl_context.getAttribLocation(this.shader, "a_noise");
        this.noise_buffer = this.gl_context.createBuffer();
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
    }

    // ###########################################
    // ###########################################

    update( delta_time ){
        super.update( delta_time );
        
        // ...
        // this.update_noise( delta_time );
        // this.load_noise_buffer();

        // ...
        // TODO: rotate model matrix
    }

    // ###########################################
    // ###########################################
}