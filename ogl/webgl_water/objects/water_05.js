import { Planar_Shape } from "../../common/obj/planar_shape.js";
import { generate_shader_program, Shader_Manager } from "/ogl/common/shaders/shader_engine.js";
import { explode_mesh_with_references, generate_normals_for_explode_vertices as generate_raw_normals_for_explode_vertices, } from "/ogl/common/util/geometry.js";

import { VERTEX_SHADER_SRC as vertex_source_01 } from "../shaders/water_vertex_shader.js";
import { VERTEX_SHADER_SRC as vertex_source_02 } from "../shaders/water_02_vertex_shader.js";
import { VERTEX_SHADER_SRC as vertex_source_03 } from "../shaders/water_03_vertex_shader.js";
import { VERTEX_SHADER_SRC as vertex_source_04 } from "../shaders/water_04_vertex_shader.js";
import { FRAGMENT_SHADER_SRC as fragment_source_01 } from "../shaders/water_fragment_shader.js";
import { FRAGMENT_SHADER_SRC as fragment_source_02 } from "../shaders/water_02_fragment_shader.js";
import { FRAGMENT_SHADER_SRC as fragment_source_03 } from "../shaders/water_03_fragment_shader.js";
import { FRAGMENT_SHADER_SRC as fragment_source_04 } from "../shaders/water_04_fragment_shader.js";

import { VERTEX_SHADER_SRC as water_05_vertex_shader_source } from "../shaders/water_05_vertex_shader.js";
import { FRAGMENT_SHADER_SRC as water_05_fragment_shader_source } from "../shaders/water_05_fragment_shader.js";

import { Perlin_Noise_Machine, generate_normals_for_explode_vertices } from "./perlin_noise_machine.js";


const SQRT_OF_3 = 1.73205080757;


export class Water_05 {

    // ################################## -- WATER -- OVERRIDES
    // ###########################################
    // ###########################################

    constructor( gl_context ){
        // -------------------_ 01
        // gather our context
        this.gl_context = gl_context;
        // gather our shader
        this.shader_manager = new Shader_Manager(this.gl_context);
        this.managed_shader = this.shader_manager.new_shader( water_05_vertex_shader_source, water_05_fragment_shader_source );
        this.shader = this.managed_shader.get_shader_program();
        // settings
        this.prepare_settings();

        // initialise our attribute information
        this.initialise_mesh_attribute_locations();
        this.prepare_mesh_attribute_locations();

        // create our mesh
        this.generate_mesh();
        this.initialise_mesh_buffers();

        // // deal with data
        // this.prepare_mesh_shape_attributes();
        // this.prepare_mesh_mapping_attribute();
        // -------------------_ 02

        // this.replace_shader( vertex_source_02, fragment_source_02 );

        // // defer so we can overwrite
        // this.customise_mesh_shape();
        // -------------------_ 03


        // this.replace_shader( vertex_source_03, fragment_source_03 );
        

        this.initialise_noise_handle();
        // this.prepare_noise_data();
        this.noise = this.rebuild_noise_values(this.noise);
        this.noise_2 = this.rebuild_noise_values(this.noise_2);

        // loads noise, then regenerate normals
        // this.regenerate_mesh();
        // -------------------_ 04
        // this.replace_shader( vertex_source_04, fragment_source_04 );
        
        this.rebuild_mesh_as_exploded();

        // this.clone_raw_normals();

        // // deal with data
        // this.prepare_mesh_shape_attributes();
        // this.prepare_mesh_mapping_attribute();

        // // this.prepare_noise_data();
        // this.prepare_mesh_attribute_noises();
        // loads noise, then regenerate normals
        this.regenerate_mesh();
        // -------------------_ 05
        // deal with data
        this.prepare_mesh_shape_attributes();
        this.prepare_mesh_mapping_attribute();

        // this.prepare_noise_data();
        this.prepare_mesh_attribute_noises();
        // this.replace_shader( water_05_vertex_shader_source, water_05_fragment_shader_source );
        this.prepare_mesh_attribute_normals();
    }
    prepare_settings(){
        // -------------------_ 01

        this.column_count = 10;
        this.row_count = 10;

        // the shape to use
        //  we're saying false for clockwise winding
        //  we're saying true for xz axis
        this.shape = new Planar_Shape( this.column_count, this.row_count, false, true );

        // our model matrix
        this.model_matrix = mat4.create();
        // -------------------_ 02

        this.model_matrix = mat4.create();

        // (static) scale(out, a, v) → {mat4}
        this.scale = vec3.fromValues(1.5, 1.0, 1.5);

        this.rotation_y = 1.0*Math.PI/12.0;

        this.light_source_vector = { x: 4.0, y: 3.0, z: -3.5 };

        this.light_ambient_intensity = { r: 0.2, g: 0.2, b: 0.2 };

        this.shape_colour = { r: 0.9, g: 0.5, b: 0.2, a: 1.0 };


        mat4.scale( this.model_matrix, this.model_matrix, this.scale);
        mat4.rotateY( this.model_matrix, this.model_matrix, this.rotation_y );
        // -------------------_ 03

        this.y_rotation_radians = Math.PI / 12.0;

        // -------------------_ 04
        
        this.time_interpolation_value = { x: 0.0, y: 0.0, dt: 0.0 };
        
        this.noise = [];
        this.noise_2 = [];
        this.normals_1 = [];
        this.normals_2 = [];
        // -------------------_ 05
    }
    generate_mesh(){
        // -------------------_ 01
        // raw shape
        this.vertices = this.shape.get_vertices();
        this.indices = this.shape.get_bindings();
        this.vertex_references = this.shape.get_vertex_references();
        this.face_count = this.shape.get_face_count();
        // -------------------_ 02
        // -------------------_ 03
        // -------------------_ 04
        // -------------------_ 05
    }
    initialise_mesh_buffers(){
        // -------------------_ 01
        this.vertex_buffer = this.gl_context.createBuffer();
        this.indices_buffer = this.gl_context.createBuffer();
        this.vertex_reference_buffer = this.gl_context.createBuffer();
        // -------------------_ 02

        // generate a buffer for the normals
        this.normal_buffer = this.gl_context.createBuffer();
        // -------------------_ 03
        this.noise_buffer = this.gl_context.createBuffer();
        // -------------------_ 04
        this.normal_2_buffer = this.gl_context.createBuffer();
        this.noise_2_buffer = this.gl_context.createBuffer();
        // -------------------_ 05
    }
    // once on construction
    initialise_mesh_attribute_locations(){
        // -------------------_ 01
        // this.vertex_position_location = this.gl_context.getAttribLocation(this.shader, "a_vertex_position");
        // this.vertex_reference_location = this.gl_context.getAttribLocation(this.shader, "a_vertex_reference");
        // -------------------_ 02
        this.normal_attribute_index = this.managed_shader.declare_managed_attribute_location("a_normal");
        // -------------------_ 03
        // -------------------_ 04
        // -------------------_ 05
        // ... for refetching them
        this.vertex_position_location = this.gl_context.getAttribLocation(this.shader, "a_vertex_position");
        this.vertex_reference_location = this.gl_context.getAttribLocation(this.shader, "a_vertex_reference");
        // gather the attribute shader location
        this.normal_2_location = this.gl_context.getAttribLocation(this.shader, "a_normal_2");
        this.noise_2_location = this.gl_context.getAttribLocation(this.shader, "a_noise_2");
    }
    // every time that we regenerate the shaders
    prepare_mesh_attribute_locations(){
        // -------------------_ 01
        // // ... for refetching them
        // this.vertex_position_location = this.gl_context.getAttribLocation(this.shader, "a_vertex_position");
        // this.vertex_reference_location = this.gl_context.getAttribLocation(this.shader, "a_vertex_reference");
        // -------------------_ 02

        // gather the attribute shader location
        // this.normal_location = this.managed_shader.get_attribute_location("a_normal");
        this.normal_location = this.managed_shader.get_attribute_location_by_index( this.normal_attribute_index );
        // -------------------_ 03

        // gather the attribute shader location
        this.noise_location = this.managed_shader.get_attribute_location("a_noise");
        // -------------------_ 04

        // // gather the attribute shader location
        // this.normal_2_location = this.gl_context.getAttribLocation(this.shader, "a_normal_2");
        // this.noise_2_location = this.gl_context.getAttribLocation(this.shader, "a_noise_2");
        // -------------------_ 05
    }
    prepare_mesh_shape_attributes(){
        // -------------------_ 01
        // prepare the index buffer as the one we're working on
        this.gl_context.bindBuffer(this.gl_context.ELEMENT_ARRAY_BUFFER, this.indices_buffer);
        // announce the data as our indices/bindings data
        this.gl_context.bufferData(
            this.gl_context.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indices),
            this.gl_context.STATIC_DRAW
        );

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
        // -------------------_ 02
        // -------------------_ 03
        // -------------------_ 04
        // -------------------_ 05
    }
    prepare_mesh_mapping_attribute(){
        // -------------------_ 01
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
        // -------------------_ 02
        // -------------------_ 03
        // -------------------_ 04
        // -------------------_ 05
    }
    prepare_uniforms( camera_view_matrix, camera_projection_matrix ){
        // -------------------_ 01
        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_mesh_quad_count") , this.column_count, this.row_count );
        
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_model_matrix"), false, this.model_matrix );
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_view_matrix"), false, camera_view_matrix );
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_projection_matrix"), false, camera_projection_matrix );
        // -------------------_ 02
        // --- directly replace super
        // --------------------------------------------------------

        let model_view = mat4.create();
        let model_view_projection = mat4.create();
        let model_view_inverse = mat4.create();
        let normal_matrix = mat3.create();

        // --------------------------------------------------------
        
        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_mesh_quad_count"), this.column_count, this.row_count );
        this.gl_context.uniform4f( this.gl_context.getUniformLocation(this.shader, "u_shape_colour"), this.shape_colour.r, this.shape_colour.g, this.shape_colour.b, this.shape_colour.a );

        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_light_source_vector"), this.light_source_vector.x, this.light_source_vector.y, this.light_source_vector.z );
        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_light_ambient_intensity"), this.light_ambient_intensity.r, this.light_ambient_intensity.g, this.light_ambient_intensity.b );
        
        // --------------------------------------------------------
        // --- build matrices

        // (static) multiply(out, a, b) → {mat4}
        mat4.multiply( model_view, camera_view_matrix, this.model_matrix);

        // (static) multiply(out, a, b) → {mat4}
        mat4.multiply( model_view_projection, camera_projection_matrix, model_view);

        // (static) invert(out, a) → {mat4}
        mat4.invert( model_view_inverse, model_view);

        // (static) fromMat4(out, a) → {mat3}
        mat3.fromMat4(normal_matrix, model_view_inverse);

        // (static) transpose(out, a) → {mat4}
        // (static) transpose(out, a) → {mat3}
        mat3.transpose(normal_matrix, normal_matrix);

        // --------------------------------------------------------

        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_mvp_matrix"), false, model_view_projection );
        this.gl_context.uniformMatrix3fv( this.gl_context.getUniformLocation(this.shader, "u_normal_matrix"), false, normal_matrix );

        // --------------------------------------------------------
        // -------------------_ 03
        // -------------------_ 04
        // --------------------------------------------------------
        
        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_time_val"), this.time_interpolation_value.x, this.time_interpolation_value.y, this.time_interpolation_value.dt );

        // --------------------------------------------------------
        // -------------------_ 05
    }

    enable_attributes(){
        // -------------------_ 01
        this.gl_context.enableVertexAttribArray(this.vertex_position_location);
        this.gl_context.enableVertexAttribArray(this.vertex_reference_location);
        // -------------------_ 02
        // ...
        this.managed_shader.enable_attributes();
        // this.gl_context.enableVertexAttribArray(this.normal_location);
        // -------------------_ 03
        // -------------------_ 04
        // ...
        this.gl_context.enableVertexAttribArray(this.normal_2_location);
        this.gl_context.enableVertexAttribArray(this.noise_2_location);
        // -------------------_ 05
    }
    disable_attributes(){
        // -------------------_ 01
        this.gl_context.disableVertexAttribArray(this.vertex_reference_location);
        this.gl_context.disableVertexAttribArray(this.vertex_position_location);
        // -------------------_ 02
        // ...
        this.managed_shader.disable_attributes();
        // this.gl_context.disableVertexAttribArray(this.normal_location);
        // -------------------_ 03
        // -------------------_ 04
        // ...
        this.gl_context.disableVertexAttribArray(this.noise_2_location);
        this.gl_context.disableVertexAttribArray(this.normal_2_location);
        // -------------------_ 05
    }
    
    prepare_drawing_environment(){
        // -------------------_ 01
        // start up our shader
        this.gl_context.useProgram(this.shader);
        // -------------------_ 02
        // -------------------_ 03
        // -------------------_ 04
        // -------------------_ 05
    }
    update( delta_time ){
        // -------------------_ 01
        // zzzz
        // -------------------_ 02
        // -------------------_ 03
        
        // ...
        this.update_noise( delta_time );

        // ...
        let rotation_factor =  delta_time * this.y_rotation_radians;
        mat4.rotateY( this.model_matrix, this.model_matrix, rotation_factor );
        // -------------------_ 04
        // -------------------_ 05
    }
    draw( camera_view_matrix, camera_projection_matrix ){
        // -------------------_ 01
        // setup our shader etc
        this.prepare_drawing_environment();

        // load the data
        this.enable_attributes();
        this.prepare_uniforms( camera_view_matrix, camera_projection_matrix );

        // do the drawing
        this.gl_context.drawElements(this.gl_context.TRIANGLES, this.face_count*3, this.gl_context.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.POINT, this.face_count*3, this.gl_context.UNSIGNED_SHORT, 0);

        // cleanup
        this.disable_attributes();
        // -------------------_ 02
        // -------------------_ 03
        // -------------------_ 04
        // -------------------_ 05
    }

    // ################################## -- WATER_02 -- OVERRIDES
    // ###########################################
    // ###########################################

    // replace_shader( vertex_source, fragment_source ){
    //     // -------------------_ 02
    //     // out with the old
    //     this.managed_shader.replace_shader_code(vertex_source, fragment_source);
        
    //     // in with the new
    //     this.shader = this.managed_shader.get_shader_program();

    //     // // relocated the things
    //     // this.prepare_mesh_attribute_locations();
    //     // -------------------_ 03
    //     // -------------------_ 04
    //     // -------------------_ 05
    // }
    // customise_mesh_shape(){
    //     // -------------------_ 02
    //     // this.z_function = (x,y)=>{return (-Math.cos(x) * Math.sin(y));};
    //     // this.remap_z_values();

    //     // this.rebuild_mesh_as_exploded();
    //     // -------------------_ 03
    //     this.z_function = (x,y)=>{return (-0.8);};
    //     this.remap_z_values();
    //     // this.rebuild_mesh_as_exploded();
    //     // -------------------_ 04
    //     // -------------------_ 05
    // }
    remap_z_values(){
        // -------------------_ 02
        // total number
        let vertex_count = (this.column_count+1)*(this.row_count+1);

        // to handle when it's actually y we're modifying
        let x_index = 0;
        let y_index = (this.shape.use_xz_axis)? 2 : 1;
        let z_index = (this.shape.use_xz_axis)? 1 : 2;

        // every vertex
        for (let vertex_index = 0; vertex_index < vertex_count; vertex_index++) {
            const vertices_offset = (vertex_index*4);
            // the element to change
            const value_to_change = vertices_offset+z_index;
            
            // set the value
            this.vertices[value_to_change] = this.z_function(
                this.vertices[vertices_offset+x_index],
                this.vertices[vertices_offset+y_index],
            );
            
        }
        // -------------------_ 03
        // -------------------_ 04
        // -------------------_ 05
    }
    rebuild_mesh_as_exploded(){
        // -------------------_ 02
        // gather the data when it's by face
        this.exploded_mesh_data = explode_mesh_with_references( this.vertices, this.indices, this.vertex_references );

        // replace our vertices and bindings with the generated information
        this.vertices = this.exploded_mesh_data.vertices;
        this.indices = this.exploded_mesh_data.indices;
        this.vertex_references = this.exploded_mesh_data.references;
        this.face_count = this.exploded_mesh_data.face_count;


        
        // // rebuild our mesh bindings
        // this.prepare_mesh_shape_attributes();
        // // rebuild our referencing information
        // this.prepare_mesh_mapping_attribute();


        
        // generate normal vectors
        this.raw_normals = generate_raw_normals_for_explode_vertices( this.vertices, this.face_count );

        // // generate a buffer for the normals
        // this.normal_buffer = this.gl_context.createBuffer();
        
        // fill the buffer with information
        // this.prepare_mesh_attribute_normals();
        // -------------------_ 03
        // -------------------_ 04
        // -------------------_ 05
    }
    prepare_mesh_attribute_normals(){
        // -------------------_ 02
        // select references as the one we're working with
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.normal_buffer);
    
        // load the reference data
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.normals_1),
          this.gl_context.STATIC_DRAW,
        );
        // map it to our attribute
        this.gl_context.vertexAttribPointer(
            this.normal_location,
            3,
            this.gl_context.FLOAT,
            false,
            0,
            0,
        );
        // -------------------_ 03
        // -------------------_ 04
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
        // -------------------_ 05
    }

    // ################################## -- WATER_03 -- OVERRIDES
    // ###########################################
    // ###########################################

    regenerate_mesh(){
        // -------------------_ 03
        // // load the noise information
        // this.prepare_mesh_attribute_noises();
        // // generate normal vectors
        // this.normals = generate_normals_for_explode_vertices( this.vertices, this.noise, this.face_count );
        // // fill the normals buffer with information
        // this.prepare_mesh_attribute_normals();
        // -------------------_ 04
        // // load the noise information
        // this.prepare_mesh_attribute_noises();

        // generate normal vectors
        this.normals_1 = generate_normals_for_explode_vertices( this.vertices, this.noise, this.face_count );
        this.normals_2 = generate_normals_for_explode_vertices( this.vertices, this.noise_2, this.face_count );

        // fill the normals buffer with information
        // this.prepare_mesh_attribute_normals();
        // -------------------_ 05
    }
    
    initialise_noise_handle(){
        // ...
        this.noise_machine = new Perlin_Noise_Machine( 3, 3 );
        this.noise_2_machine = new Perlin_Noise_Machine( 3, 3 );
        this.noise = this.noise_machine.gather_noise_values_as_float_array( this.shape.vertex_count.x, this.shape.vertex_count.y );
        this.noise_2 = this.noise_2_machine.gather_noise_values_as_float_array( this.shape.vertex_count.x, this.shape.vertex_count.y );
    }
    // prepare_noise_data(){
    //     // -------------------_ 03
    //     // this.noise_machine = new Perlin_Noise_Machine( 3, 3 );
    //     this.noise = this.rebuild_noise_values(this.noise);
    //     // this.prepare_mesh_attribute_normals();
    //     // -------------------_ 04
    //     // this.noise_2_machine = new Perlin_Noise_Machine( 3, 3 );
    //     this.noise_2 = this.rebuild_noise_values(this.noise_2);
    //     // this.prepare_mesh_attribute_normals();
    //     // -------------------_ 05
    // }
    
    prepare_mesh_attribute_noises(){
        // -------------------_ 03
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
        // -------------------_ 04
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
        // -------------------_ 05
    }
    
    update_noise( delta_time ){
        // -------------------_ 03
        // TODO: have the noise change
        // this.prepare_mesh_attribute_noises();
        // -------------------_ 04

        // increase our time
        this.time_interpolation_value.dt += delta_time;

        // get the x and y interpolation values
        this.time_interpolation_value.x = (Math.cos(this.time_interpolation_value.dt)+1.0)/2.0;
        // this.time_interpolation_value.y = (Math.sin(this.time_interpolation_value.dt)+1.0)/2.0;
        // -------------------_ 05
    }

    rebuild_noise_values(old_noise_data){
        // -------------------_ 03
        let new_noise_data = [];
    
        let triangle_count = this.shape.bindings.length / 3;
    
        // separate out the information for all triangles
        for (let triangle_index = 0; triangle_index < triangle_count; triangle_index++) {
            // --------------------------------------------------------
            // --------------------------------------------------------
            // --- gather information about the binding
            
            const binding_start = triangle_index*3;
    
            // get the indices to use for our vertex data
            const first_old_vertex_index = this.shape.bindings[binding_start+0];
            const second_old_vertex_index = this.shape.bindings[binding_start+1];
            const third_old_vertex_index = this.shape.bindings[binding_start+2];
    
            // --------------------------------------------------------
            // --------------------------------------------------------
    
            // get the vertices (they're in groups of 3)
            const first_vertex = {
                x: old_noise_data[( first_old_vertex_index*3)  ],
                y: old_noise_data[( first_old_vertex_index*3)+1],
                z: old_noise_data[( first_old_vertex_index*3)+2],
            };
            const second_vertex = {
                x: old_noise_data[(second_old_vertex_index*3)  ],
                y: old_noise_data[(second_old_vertex_index*3)+1],
                z: old_noise_data[(second_old_vertex_index*3)+2],
            };
            const third_vertex = {
                x: old_noise_data[( third_old_vertex_index*3)  ],
                y: old_noise_data[( third_old_vertex_index*3)+1],
                z: old_noise_data[( third_old_vertex_index*3)+2],
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
        // -------------------_ 04
        // -------------------_ 05
    }

    // ###########################################
    // ###########################################
}