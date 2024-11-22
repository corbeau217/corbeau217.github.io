import { Shader_Manager } from "/ogl/common/shaders/shader_engine.js";
import { VERTEX_SHADER_SRC as shape_wrapper_default_vertex_source } from "../shaders/shape_wrapper_vertex_shader.js";
import { FRAGMENT_SHADER_SRC as shape_wrapper_default_fragment_source } from "../shaders/shape_wrapper_fragment_shader.js";
import { explode_mesh, generate_normals_for_explode_vertices,generate_normals } from "../../common/util/geometry.js";
import { Sphere_Shape } from "../../common/obj/sphere_shape.js";

export class Shape_Wrapper {
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    constructor( gl_context ){
        // gather our context
        this.gl_context = gl_context;
        // gather our shader
        this.shader_manager = new Shader_Manager(this.gl_context);
        this.managed_shader = this.shader_manager.new_shader( shape_wrapper_default_vertex_source, shape_wrapper_default_fragment_source );
        this.shader = this.managed_shader.get_shader_program();

        // settings
        this.prepare_settings();

        // initialise our attribute information
        this.initialise_mesh_attribute_locations();

        this.indices_buffer = this.gl_context.createBuffer();

        this.initialise_gl_arrays();
        this.initialise_attribute_data();
    }
    prepare_settings(){
        // our model matrix
        this.model_matrix = mat4.create();
        this.model_view = mat4.create();
        this.model_view_projection = mat4.create();
        this.model_view_inverse = mat4.create();
        this.normal_matrix = mat3.create();


        this.scale = vec3.fromValues(0.7, 0.7, 0.7);
        mat4.scale( this.model_matrix, this.model_matrix, this.scale);

        this.y_rotation_radians = Math.PI / 24.0;


        this.light_source_vector = { x: 4.0, y: 3.0, z: -3.5 };
        this.light_ambient_intensity = { r: 0.6, g: 0.6, b: 0.6 };

        this.shape = new Sphere_Shape(false);
        this.load_mesh_data();
    }
    // once on construction
    initialise_mesh_attribute_locations(){
        this.vertex_position_attribute_index = this.managed_shader.declare_managed_attribute_location("a_vertex_position");
        this.normals_attribute_index = this.managed_shader.declare_managed_attribute_location("a_normal");
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    // prepare the webgl friendly array types for all our data
    initialise_gl_arrays(){
        this.indices_int_array = new Uint16Array(this.indices);
        this.vertices_float_array = new Float32Array(this.vertices);
        this.normals_float_array = new Float32Array(this.normals);
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
        this.managed_shader.initialise_attribute_buffer_floats( this.normals_attribute_index, this.normals_float_array, 3 );
    }
    // when we load the buffers with data
    update_attribute_data(){
        this.managed_shader.load_attribute_buffer_floats( this.vertex_position_attribute_index, this.vertices_float_array );
        this.managed_shader.load_attribute_buffer_floats( this.normals_attribute_index, this.normals_float_array );
    }
    // when announcing a new shape to use
    replace_shape( replacement_shape_instance ){
        this.shape = replacement_shape_instance;
        this.load_mesh_data();
        this.update_attribute_data();
    }

    rebuild_mesh_as_exploded(){
        // gather the data when it's by face
        this.exploded_mesh_data = explode_mesh( this.vertices, this.indices, this.vertex_references );
        this.normals = generate_normals_for_explode_vertices( this.vertices, this.face_count );

        // replace our vertices and bindings with the generated information
        this.vertices = this.exploded_mesh_data.vertices;
        this.indices = this.exploded_mesh_data.indices;
        this.face_count = this.exploded_mesh_data.face_count;
    }
    load_mesh_data(){
        this.vertices = this.shape.get_vertices();
        this.indices = this.shape.get_bindings();
        this.face_count = this.shape.get_face_count();
        if(this.shape.normals != undefined){
            this.normals = this.shape.normals;
        }
        else{
            this.normals = generate_normals(this.vertices, this.indices);
            this.rebuild_mesh_as_exploded();
        }
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // before each draw
    prepare_uniforms( view_matrix, projection_matrix ){
        // --------------------------------------------------------

        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_light_source_vector"), this.light_source_vector.x, this.light_source_vector.y, this.light_source_vector.z );
        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_light_ambient_intensity"), this.light_ambient_intensity.r, this.light_ambient_intensity.g, this.light_ambient_intensity.b );

        // --------------------------------------------------------
        // --- build matrices

        mat4.identity(this.model_view);
        mat4.identity(this.model_view_projection);

        // (static) multiply(out, a, b) → {mat4}
        // (static) invert(out, a) → {mat4}
        // (static) fromMat4(out, a) → {mat3}
        // (static) transpose(out, a) → {mat4}
        // (static) transpose(out, a) → {mat3}

        mat4.multiply( this.model_view, view_matrix, this.model_matrix);
        mat4.multiply( this.model_view_projection, projection_matrix, this.model_view);
        mat4.invert( this.model_view_inverse, this.model_view);
        mat3.fromMat4(this.normal_matrix, this.model_view_inverse);
        mat3.transpose(this.normal_matrix, this.normal_matrix);

        // --------------------------------------------------------

        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_mvp_matrix"), false, this.model_view_projection );
        this.gl_context.uniformMatrix3fv( this.gl_context.getUniformLocation(this.shader, "u_normal_matrix"), false, this.normal_matrix );

        // --------------------------------------------------------
    }
    // each frame before a draw
    update( delta_time ){
        let rotation_factor =  delta_time * this.y_rotation_radians;
        mat4.rotateY( this.model_matrix, this.model_matrix, rotation_factor );
    }
    draw_self(){
        // ... override with things?
        // this.gl_context.drawElements(this.gl_context.TRIANGLES, this.face_count*3, this.gl_context.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.TRIANGLES, this.face_count*3, this.gl_context.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.POINT, this.face_count*3, this.gl_context.UNSIGNED_SHORT, 0);
    }
    draw( view_matrix, projection_matrix ){
        // test we have a shape to draw
        if(this.shape!=null){
            // select our shader as being used
            this.gl_context.useProgram(this.shader);
            // load the data
            this.managed_shader.enable_attributes();
            this.prepare_uniforms( view_matrix, projection_matrix );
    
    
            // do the drawing
            this.draw_self();
    
            // cleanup
            this.managed_shader.disable_attributes();
        }
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}