import { Planar_Shape } from "../../old_common/obj/planar_shape.js";
import { Shader_Manager } from "/ext/webgl_1_core/src/shader_util/shader_engine.js";
import { explode_mesh_with_references, generate_normals_for_explode_vertices as generate_raw_normals_for_explode_vertices, } from "/webgl1/lib/util/geometry.js";
import { Perlin_Noise_Machine, generate_normals_for_explode_vertices } from "./perlin_noise_machine.js";

import { VERTEX_SHADER_SRC as water_05_vertex_shader_source } from "../shaders/water_05_vertex_shader.js";
import { FRAGMENT_SHADER_SRC as water_05_fragment_shader_source } from "../shaders/water_05_fragment_shader.js";

export class Water_05 {
    constructor( gl_context ){
        // gather our context
        this.gl_context = gl_context;
        // gather our shader
        this.shader_manager = Shader_Manager.get_instance();
        this.managed_shader = this.shader_manager.new_shader( this.gl_context, water_05_vertex_shader_source, water_05_fragment_shader_source );
        this.shader = this.managed_shader.get_shader_program();

        // settings
        this.prepare_settings();

        // initialise our attribute information
        this.initialise_mesh_attribute_locations();

        // create our mesh
        this.generate_mesh();
        this.indices_buffer = this.gl_context.createBuffer();


        this.initialise_noise_handle();
        
        this.noise_1 = this.rebuild_noise_values(this.noise_1);
        this.noise_2 = this.rebuild_noise_values(this.noise_2);
        
        this.rebuild_mesh_as_exploded();

        // then regenerate normals
        this.regenerate_mesh();
        
        this.initialise_gl_arrays();
        // deal with data
        this.initialise_attribute_data();
    }
    prepare_settings(){
        this.column_count = 17;
        this.row_count = 17;

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

        this.light_source_vector = { x: 4.0, y: 3.0, z: -3.5 };

        this.light_ambient_intensity = { r: 0.7, g: 0.7, b: 0.7 };

        this.shape_colouring = {
            darkest:  { r: 0.055, g: 0.302, b: 0.573, a: 1.0 },
            lightest: { r: 0.788, g: 0.914, b: 1.000, a: 1.0 },
        };


        mat4.scale( this.model_matrix, this.model_matrix, this.scale);
        

        this.y_rotation_radians = Math.PI / 24.0;

        
        
        this.time_interpolation_value = { x: 0.0, y: 0.0, dt: 0.0 };
        
        this.noise_1 = [];
        this.noise_2 = [];
        this.normals_raw = [];
        this.normals_1 = [];
        this.normals_2 = [];



        this.noise_properties = {
            noise_1_size: { x: 4, y: 6, },
            noise_2_size: { x: 7, y: 4, },
            mixer_time_scale: 1.8,
            usage_time_scale: 2.2312,
            minimum_mixing: 0.25,
            maximum_mixing: 0.75,
            minimum_usage: 0.34,
            maximum_usage: 0.486,
            // start them as 0.0
            mixer_lerp_t: 0.0,
            usage_lerp_t: 0.0,
        };

    }
    generate_mesh(){
        // raw shape
        this.vertices = this.shape.get_vertices();
        this.indices = this.shape.get_bindings();
        this.vertex_references = this.shape.get_vertex_references();
        this.face_count = this.shape.get_face_count();
    }
    // once on construction
    initialise_mesh_attribute_locations(){
        this.vertex_position_attribute_index = this.managed_shader.declare_managed_attribute_location("a_vertex_position");

        this.normal_raw_attribute_index = this.managed_shader.declare_managed_attribute_location("a_normal_raw");
        this.normal_1_attribute_index = this.managed_shader.declare_managed_attribute_location("a_normal_1");
        this.normal_2_attribute_index = this.managed_shader.declare_managed_attribute_location("a_normal_2");

        this.noise_1_attribute_index = this.managed_shader.declare_managed_attribute_location("a_noise_1");
        this.noise_2_attribute_index = this.managed_shader.declare_managed_attribute_location("a_noise_2");
    }
    // prepare the webgl friendly array types for all our data
    initialise_gl_arrays(){
        this.indices_int_array = new Uint16Array(this.indices);
        this.vertices_float_array = new Float32Array(this.vertices);
        this.normals_raw_float_array = new Float32Array(this.normals_raw);
        this.normals_1_float_array = new Float32Array(this.normals_1);
        this.normals_2_float_array = new Float32Array(this.normals_2);
        this.noise_1_float_array = new Float32Array(this.noise_1);
        this.noise_2_float_array = new Float32Array(this.noise_2);
    }
    initialise_attribute_data(){

        // prepare the index buffer as the one we're working on
        this.gl_context.bindBuffer(this.gl_context.ELEMENT_ARRAY_BUFFER, this.indices_buffer);
        // announce the data as our indices/bindings data
        this.gl_context.bufferData(
            this.gl_context.ELEMENT_ARRAY_BUFFER,
            this.indices_int_array,
            this.gl_context.STATIC_DRAW
        );
        this.managed_shader.initialise_attribute_buffer_floats( this.vertex_position_attribute_index, this.vertices_float_array, 4 );
        this.managed_shader.initialise_attribute_buffer_floats( this.normal_raw_attribute_index, this.normals_raw_float_array, 3 );
        this.managed_shader.initialise_attribute_buffer_floats( this.normal_1_attribute_index, this.normals_1_float_array, 3 );
        this.managed_shader.initialise_attribute_buffer_floats( this.normal_2_attribute_index, this.normals_2_float_array, 3 );
        this.managed_shader.initialise_attribute_buffer_floats( this.noise_1_attribute_index, this.noise_1_float_array, 3 );
        this.managed_shader.initialise_attribute_buffer_floats( this.noise_2_attribute_index, this.noise_2_float_array, 3 );
    }
    update_attribute_data(){
        this.managed_shader.load_attribute_buffer_floats( this.vertex_position_attribute_index, this.vertices_float_array );
        this.managed_shader.load_attribute_buffer_floats( this.normal_raw_attribute_index, this.normals_raw_float_array );
        this.managed_shader.load_attribute_buffer_floats( this.normal_1_attribute_index, this.normals_1_float_array );
        this.managed_shader.load_attribute_buffer_floats( this.normal_2_attribute_index, this.normals_2_float_array );
        this.managed_shader.load_attribute_buffer_floats( this.noise_1_attribute_index, this.noise_1_float_array );
        this.managed_shader.load_attribute_buffer_floats( this.noise_2_attribute_index, this.noise_2_float_array );
    }
    prepare_uniforms( camera_view_matrix, camera_projection_matrix ){
        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_mesh_quad_count") , this.column_count, this.row_count );
        // this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_model_matrix"), false, this.model_matrix );
        // this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_view_matrix"), false, camera_view_matrix );
        // this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_projection_matrix"), false, camera_projection_matrix );

        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_mesh_quad_count"), this.column_count, this.row_count );
        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_shape_colour_darkest"), this.shape_colouring.darkest.r, this.shape_colouring.darkest.g, this.shape_colouring.darkest.b );
        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_shape_colour_lightest"), this.shape_colouring.lightest.r, this.shape_colouring.lightest.g, this.shape_colouring.lightest.b );

        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_light_source_vector"), this.light_source_vector.x, this.light_source_vector.y, this.light_source_vector.z );
        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_light_ambient_intensity"), this.light_ambient_intensity.r, this.light_ambient_intensity.g, this.light_ambient_intensity.b );
        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_noise_settings"), this.noise_properties.mixer_lerp_t, this.noise_properties.usage_lerp_t );
        
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
    }
    regenerate_mesh(){
        // generate normal vectors
        this.normals_raw = generate_raw_normals_for_explode_vertices( this.vertices, this.face_count );
        this.normals_1 = generate_normals_for_explode_vertices( this.vertices, this.noise_1, this.face_count );
        this.normals_2 = generate_normals_for_explode_vertices( this.vertices, this.noise_2, this.face_count );
    }
    initialise_noise_handle(){
        this.noise_1_machine = new Perlin_Noise_Machine( this.noise_properties.noise_1_size.x, this.noise_properties.noise_1_size.y );
        this.noise_2_machine = new Perlin_Noise_Machine( this.noise_properties.noise_2_size.x, this.noise_properties.noise_2_size.y );

        this.noise_1 = this.noise_1_machine.gather_noise_values_as_float_array( this.shape.vertex_count.x, this.shape.vertex_count.y );
        this.noise_2 = this.noise_2_machine.gather_noise_values_as_float_array( this.shape.vertex_count.x, this.shape.vertex_count.y );
    }
    
    update_noise( delta_time ){
        // increase our time
        this.time_interpolation_value.dt += delta_time;

        // get the x and y interpolation values
        let noise_cosine_mixer = Math.cos(this.time_interpolation_value.dt*this.noise_properties.mixer_time_scale);
        this.time_interpolation_value.x = (noise_cosine_mixer+1.0)/2.0;
        
        let noise_sine_usage = Math.sin(this.time_interpolation_value.dt*this.noise_properties.usage_time_scale);
        this.time_interpolation_value.y = (noise_sine_usage+1.0)/2.0;

        // prepare our lerp data
        this.noise_properties.mixer_lerp_t = (1.0-this.time_interpolation_value.x) * this.noise_properties.minimum_mixing  +  (this.time_interpolation_value.x) * this.noise_properties.maximum_mixing;
        this.noise_properties.usage_lerp_t = (1.0-this.time_interpolation_value.y) * this.noise_properties.minimum_mixing  +  (this.time_interpolation_value.y) * this.noise_properties.maximum_mixing;        
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