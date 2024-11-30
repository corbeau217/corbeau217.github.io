import { Drawable_Scene_Object } from "/ogl/core/scene_objects/drawable_scene_object.js";
import { VERTEX_SHADER_SRC as textured_vertex_source } from "/ogl/lib/shaders/textured_sized_diffuse_vertex_shader.js"
import { FRAGMENT_SHADER_SRC as textured_fragment_source } from "/ogl/lib/shaders/textured_sized_diffuse_fragment_shader.js"
// import { Shape_Factory } from "/ogl/core/util/shape_factory.js";
import { Textured_Shape_Factory } from "/ogl/core/util/textured_shape_factory.js";

export class Textured_Shape_Factory_Scene_Object extends Drawable_Scene_Object {
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * #### !! REPLACEMENT !!
     * 
     * prepares the shader sources using: `this.shader_source_data`
     * 
     * * the structure of `this.shader_source_data` is a string list containing the shaders in order
     *   of their usage
     * * *since WebGL 1 only has the `vertex` and `fragment` shaders, it'll just be those*
     * 
     *   **Items in this list are raw string values for compilation by the shader manager**
     *                  
     *   Ordering is reserved as:
     *   * `this.shader_source_data[0]` -> *vertex shader source*
     *   * `this.shader_source_data[1]` -> *fragment shader source*
     */
    fetch_required_resources(){
        // specify our shader sources
        this.shader_source_data = {
            vertex_source:      textured_vertex_source,
            fragment_source:    textured_fragment_source,
        };
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * 
     * used to prepare references and settings, ***minimal calculations*** and
     *      ***no function calls*** should be performed during this stage
     */
    initialise_pre_event(){
        super.initialise_pre_event();
        
        this.translation_vec = vec3.fromValues( 0, 0, 0 );
        this.rotation_vec = vec3.fromValues( 0.0, 0.0, 0.0 );
        this.scale_vec = vec3.fromValues( 1.0, 1.0, 1.0 );

        this.verbose_logging = true;
    }
    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * 
     * any operation that needs to happen during initialisation
     *      but requires that the object already have information
     *      ready to be used
     * 
     * this is effectively operations which arent part of initialisation
     *      but need to happen before the object is ready to be used
     */
    initialise_post_event(){
        super.initialise_post_event();

        // oh no, double handling, what are we to do??
        this.translation_mat = mat4.create();
        this.rotation_mat = mat4.create();
        this.scale_mat = mat4.create();

        // mmmm this is hard to decide, but it seems nice now
        mat4.translate(this.translation_mat, this.translation_mat, this.translation_vec);

        mat4.rotateY(this.rotation_mat, this.rotation_mat, this.rotation_vec[1]);
        mat4.rotateX(this.rotation_mat, this.rotation_mat, this.rotation_vec[0]);
        mat4.rotateZ(this.rotation_mat, this.rotation_mat, this.rotation_vec[2]);
        
        mat4.scale(this.scale_mat, this.scale_mat, this.scale_vec);
        
        // local translation
        mat4.multiply(this.model_matrix, this.model_matrix, this.translation_mat);
        
        // local rotation
        mat4.multiply(this.model_matrix, this.model_matrix, this.rotation_mat);

        // local scale
        mat4.multiply(this.model_matrix, this.model_matrix, this.scale_mat);
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    
    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * #### !! replacement !!
     * 
     * sometimes referred to as `load_mesh_data` in other files 
     *      but we wanted a more explanatory name
     */
    generate_mesh_data(){
        // --------------------------------------------------------
        // ---- helper methods for gathering data

        let empty_or_defined = (list)=>{
            return (list!=undefined)? list : [];
        };
        let zero_or_defined = (value)=>{
            return (value!=undefined)? value : 0;
        };
        
        // --------------------------------------------------------

        this.mesh_shape = this.prepare_shape();
        
        // --------------------------------------------------------
        this.vertex_positions = empty_or_defined(this.mesh_shape.vertex_positions);
        // --------------------------------------------------------
        this.vertex_bindings = empty_or_defined(this.mesh_shape.vertex_bindings);
        // --------------------------------------------------------
        this.vertex_colours = empty_or_defined(this.mesh_shape.vertex_colours);
        // --------------------------------------------------------
        this.vertex_sizes = empty_or_defined(this.mesh_shape.vertex_sizes);
        // --------------------------------------------------------
        this.vertex_normals = empty_or_defined(this.mesh_shape.vertex_normals);
        // --------------------------------------------------------
        this.vertex_uv_mappings = empty_or_defined(this.mesh_shape.vertex_uv_mappings);
        // --------------------------------------------------------
        this.mesh_data = {
            // ==========================================
            vertices: zero_or_defined(this.mesh_shape.vertex_count),
            edges: zero_or_defined(this.mesh_shape.edge_count),
            faces: zero_or_defined(this.mesh_shape.face_count),
            // ==========================================
            colours: zero_or_defined(this.mesh_shape.colour_count),
            sizes: zero_or_defined(this.mesh_shape.size_count),
            normals: zero_or_defined(this.mesh_shape.normal_count),
            // ==========================================
            uv_mappings: zero_or_defined(this.mesh_shape.uv_mapping_count),
            // ==========================================
        };


        // --------------------------------------------------------
    }
    /**
     * overriden in derived classes
     */
    prepare_shape(){
        return Shape_Factory_Scene_Object.prepare_shape_mesh();
    }

    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * 
     * to map the location of attributes within our shader
     */
    initialise_mesh_attribute_locations(){
        super.initialise_mesh_attribute_locations();
        // then announce other data for each vertex
        this.vertex_uv_mappings_attribute_index  = this.managed_shader.declare_managed_attribute_location( "a_vertex_uv_mapping"   );
        this.vertex_sizes_attribute_index        = this.managed_shader.declare_managed_attribute_location( "a_vertex_size"         );
        this.vertex_normals_attribute_index      = this.managed_shader.declare_managed_attribute_location( "a_vertex_normal"       );
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * 
     * prepare the WebGL friendly array types for all our data
     */
    initialise_gl_arrays(){
        super.initialise_gl_arrays();
        // prepare the webgl friendly data types for all our information
        this.vertex_uv_mappings_float_array   = new Float32Array( this.vertex_uv_mappings   );
        this.vertex_sizes_float_array         = new Float32Array( this.vertex_sizes         );
        this.vertex_normals_float_array       = new Float32Array( this.vertex_normals       );
    }
    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * 
     * for use in the initialisation step to prepare our attribute buffers with size information
     */
    initialise_attribute_data(){
        super.initialise_attribute_data();
        this.managed_shader.initialise_attribute_buffer_floats( this.vertex_uv_mappings_attribute_index,  this.vertex_uv_mappings_float_array,   2 );
        this.managed_shader.initialise_attribute_buffer_floats( this.vertex_sizes_attribute_index,        this.vertex_sizes_float_array,         1 );
        this.managed_shader.initialise_attribute_buffer_floats( this.vertex_normals_attribute_index,      this.vertex_normals_float_array,       3 );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * 
     * for use by our object during run time to update the data within our buffers
     */
    update_attribute_data(){
        super.update_attribute_data();
        // and the new ones
        this.managed_shader.load_attribute_buffer_floats( this.vertex_uv_mappings_attribute_index,  this.vertex_uv_mappings_float_array   );
        this.managed_shader.load_attribute_buffer_floats( this.vertex_sizes_attribute_index,        this.vertex_sizes_float_array     );
        this.managed_shader.load_attribute_buffer_floats( this.vertex_normals_attribute_index,      this.vertex_normals_float_array   );
    }
    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * #### !! replacement !!
     * 
     * handles preparing all our uniforms for drawing, and is called during each draw call
     */
    update_uniform_data(){
        super.update_uniform_data();
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_model_to_ndc_matrix"), false, this.temp_model_to_ndc_matrix );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * so we dont need to import shape factory on derived classes
     * @returns 
     */
    static make_shape_factory(){
        return new Textured_Shape_Factory();
    }
    /**
     * overriden in derived classes with data
     * @returns 
     */
    static prepare_shape_mesh(){
        // --------------------------------------------------------
        // ---- prepare shape factory

        let shape_factory = new this.make_shape_factory();

        // --------------------------------------------------------
        // ---- finished, give it back
        return shape_factory.shape_data;
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}