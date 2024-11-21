import { Planar_Shape } from "../../common/obj/planar_shape.js";
import { Shader_Manager } from "/ogl/common/shaders/shader_engine.js";
import { explode_mesh_with_references, generate_normals_for_explode_vertices as generate_raw_normals_for_explode_vertices, } from "/ogl/common/util/geometry.js";
import { Perlin_Noise_Machine, generate_normals_for_explode_vertices } from "./perlin_noise_machine.js";

import { VERTEX_SHADER_SRC as water_05_vertex_shader_source } from "../shaders/water_05_vertex_shader.js";
import { FRAGMENT_SHADER_SRC as water_05_fragment_shader_source } from "../shaders/water_05_fragment_shader.js";

export class Water_05 {
    constructor( gl_context ){
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


        this.initialise_noise_handle();
        
        this.noise_1 = this.rebuild_noise_values(this.noise_1);
        this.noise_2 = this.rebuild_noise_values(this.noise_2);
        
        this.rebuild_mesh_as_exploded();

        // then regenerate normals
        this.regenerate_mesh();
        
        // deal with data
        this.prepare_mesh_shape_attributes();
        this.prepare_mesh_mapping_attribute();
        this.prepare_mesh_attribute_noises();
        this.prepare_mesh_attribute_normals();
    }
    prepare_settings(){
        this.column_count = 10;
        this.row_count = 10;

        // the shape to use
        //  we're saying false for clockwise winding
        //  we're saying true for xz axis
        this.shape = new Planar_Shape( this.column_count, this.row_count, false, true );

        // our model matrix
        this.model_matrix = mat4.create();
        this.model_view = mat4.create();
        this.model_view_projection = mat4.create();
        this.model_view_inverse = mat4.create();
        this.normal_matrix = mat3.create();

        // (static) scale(out, a, v) → {mat4}
        this.scale = vec3.fromValues(1.5, 1.0, 1.5);

        this.rotation_y = 1.0*Math.PI/12.0;

        this.light_source_vector = { x: 4.0, y: 3.0, z: -3.5 };

        this.light_ambient_intensity = { r: 0.2, g: 0.2, b: 0.2 };

        this.shape_colour = { r: 0.9, g: 0.5, b: 0.2, a: 1.0 };


        mat4.scale( this.model_matrix, this.model_matrix, this.scale);
        mat4.rotateY( this.model_matrix, this.model_matrix, this.rotation_y );
        

        this.y_rotation_radians = Math.PI / 12.0;

        
        
        this.time_interpolation_value = { x: 0.0, y: 0.0, dt: 0.0 };
        
        this.noise_1 = [];
        this.noise_2 = [];
        this.normals_1 = [];
        this.normals_2 = [];
    }
    generate_mesh(){
        // raw shape
        this.vertices = this.shape.get_vertices();
        this.indices = this.shape.get_bindings();
        this.vertex_references = this.shape.get_vertex_references();
        this.face_count = this.shape.get_face_count();
    }
    initialise_mesh_buffers(){
        this.vertex_buffer = this.gl_context.createBuffer();
        this.indices_buffer = this.gl_context.createBuffer();
        this.vertex_reference_buffer = this.gl_context.createBuffer();
        
        this.normal_1_buffer = this.gl_context.createBuffer();
        this.normal_2_buffer = this.gl_context.createBuffer();

        this.noise_1_buffer = this.gl_context.createBuffer();
        this.noise_2_buffer = this.gl_context.createBuffer();
    }
    // once on construction
    initialise_mesh_attribute_locations(){
        this.vertex_position_attribute_index = this.managed_shader.declare_managed_attribute_location("a_vertex_position");
        this.vertex_reference_attribute_index = this.managed_shader.declare_managed_attribute_location("a_vertex_reference");

        this.normal_1_attribute_index = this.managed_shader.declare_managed_attribute_location("a_normal_1");
        this.normal_2_attribute_index = this.managed_shader.declare_managed_attribute_location("a_normal_2");

        this.noise_1_attribute_index = this.managed_shader.declare_managed_attribute_location("a_noise_1");
        this.noise_2_attribute_index = this.managed_shader.declare_managed_attribute_location("a_noise_2");
    }
    // every time that we regenerate the shaders
    prepare_mesh_attribute_locations(){
        this.vertex_position_location = this.managed_shader.get_attribute_location_by_index( this.vertex_position_attribute_index );
        this.vertex_reference_location = this.managed_shader.get_attribute_location_by_index( this.vertex_reference_attribute_index );

        this.normal_1_location = this.managed_shader.get_attribute_location_by_index( this.normal_1_attribute_index );
        this.normal_2_location = this.managed_shader.get_attribute_location_by_index( this.normal_2_attribute_index );

        this.noise_1_location = this.managed_shader.get_attribute_location_by_index( this.noise_1_attribute_index );
        this.noise_2_location = this.managed_shader.get_attribute_location_by_index( this.noise_2_attribute_index );
    }
    prepare_mesh_shape_attributes(){
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
    }
    prepare_mesh_mapping_attribute(){
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
    }
    prepare_mesh_attribute_normals(){
        // select references as the one we're working with
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.normal_1_buffer);
    
        // load the reference data
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.normals_1),
          this.gl_context.STATIC_DRAW,
        );
        // map it to our attribute
        this.gl_context.vertexAttribPointer(
            this.normal_1_location,
            3,
            this.gl_context.FLOAT,
            false,
            0,
            0,
        );
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
    prepare_mesh_attribute_noises(){
        // select references as the one we're working with
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.noise_1_buffer);
        // load the reference data
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.noise_1),
          this.gl_context.STATIC_DRAW,
        );
        // map it to our attribute
        this.gl_context.vertexAttribPointer(
            this.noise_1_location,
            3,
            this.gl_context.FLOAT,
            false,
            0,
            0,
        );
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
    prepare_uniforms( camera_view_matrix, camera_projection_matrix ){
        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_mesh_quad_count") , this.column_count, this.row_count );
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_model_matrix"), false, this.model_matrix );
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_view_matrix"), false, camera_view_matrix );
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_projection_matrix"), false, camera_projection_matrix );

        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_mesh_quad_count"), this.column_count, this.row_count );
        this.gl_context.uniform4f( this.gl_context.getUniformLocation(this.shader, "u_shape_colour"), this.shape_colour.r, this.shape_colour.g, this.shape_colour.b, this.shape_colour.a );

        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_light_source_vector"), this.light_source_vector.x, this.light_source_vector.y, this.light_source_vector.z );
        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_light_ambient_intensity"), this.light_ambient_intensity.r, this.light_ambient_intensity.g, this.light_ambient_intensity.b );

        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_time_val"), this.time_interpolation_value.x, this.time_interpolation_value.y, this.time_interpolation_value.dt );
        
        // --------------------------------------------------------
        // --- build matrices

        mat4.identity(this.model_view);
        mat4.identity(this.model_view_projection);
        mat4.identity(this.model_view_inverse);
        mat3.identity(this.normal_matrix);

        // (static) multiply(out, a, b) → {mat4}
        // (static) invert(out, a) → {mat4}
        // (static) fromMat4(out, a) → {mat3}
        // (static) transpose(out, a) → {mat4}
        // (static) transpose(out, a) → {mat3}

        mat4.multiply( this.model_view, camera_view_matrix, this.model_matrix);
        mat4.multiply( this.model_view_projection, camera_projection_matrix, this.model_view);
        mat4.invert( this.model_view_inverse, this.model_view);
        mat3.fromMat4(this.normal_matrix, this.model_view_inverse);
        mat3.transpose(this.normal_matrix, this.normal_matrix);

        // --------------------------------------------------------

        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_mvp_matrix"), false, this.model_view_projection );
        this.gl_context.uniformMatrix3fv( this.gl_context.getUniformLocation(this.shader, "u_normal_matrix"), false, this.normal_matrix );

        // --------------------------------------------------------
        
    }
    update( delta_time ){
        this.update_noise( delta_time );

        let rotation_factor =  delta_time * this.y_rotation_radians;
        mat4.rotateY( this.model_matrix, this.model_matrix, rotation_factor );
    }
    draw( camera_view_matrix, camera_projection_matrix ){
        // select our shader as being used 
        this.gl_context.useProgram(this.shader);

        // load the data
        this.managed_shader.enable_attributes();
        this.prepare_uniforms( camera_view_matrix, camera_projection_matrix );

        // do the drawing
        this.gl_context.drawElements(this.gl_context.TRIANGLES, this.face_count*3, this.gl_context.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.POINT, this.face_count*3, this.gl_context.UNSIGNED_SHORT, 0);

        // cleanup
        this.managed_shader.disable_attributes();
    }

    rebuild_mesh_as_exploded(){
        // gather the data when it's by face
        this.exploded_mesh_data = explode_mesh_with_references( this.vertices, this.indices, this.vertex_references );

        // replace our vertices and bindings with the generated information
        this.vertices = this.exploded_mesh_data.vertices;
        this.indices = this.exploded_mesh_data.indices;
        this.vertex_references = this.exploded_mesh_data.references;
        this.face_count = this.exploded_mesh_data.face_count;

        // generate normal vectors
        this.raw_normals = generate_raw_normals_for_explode_vertices( this.vertices, this.face_count );
    }
    regenerate_mesh(){
        // generate normal vectors
        this.normals_1 = generate_normals_for_explode_vertices( this.vertices, this.noise_1, this.face_count );
        this.normals_2 = generate_normals_for_explode_vertices( this.vertices, this.noise_2, this.face_count );
    }
    initialise_noise_handle(){
        this.noise_1_machine = new Perlin_Noise_Machine( 3, 4 );
        this.noise_2_machine = new Perlin_Noise_Machine( 4, 3 );

        this.noise_1 = this.noise_1_machine.gather_noise_values_as_float_array( this.shape.vertex_count.x, this.shape.vertex_count.y );
        this.noise_2 = this.noise_2_machine.gather_noise_values_as_float_array( this.shape.vertex_count.x, this.shape.vertex_count.y );
    }
    
    update_noise( delta_time ){
        // increase our time
        this.time_interpolation_value.dt += delta_time;

        // get the x and y interpolation values
        let noise_cosine_value = Math.cos(this.time_interpolation_value.dt);
        this.time_interpolation_value.x = (noise_cosine_value+1.0)/2.0;
        this.time_interpolation_value.y = noise_cosine_value;
    }

    rebuild_noise_values(old_noise_data){
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
    }

    // ###########################################
    // ###########################################
}