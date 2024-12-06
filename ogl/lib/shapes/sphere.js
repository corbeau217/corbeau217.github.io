import {
    unit_sphere_float_vertices,
    unit_sphere_bindings,
    unit_sphere_face_count,
    unit_sphere_normals,
} from "/ogl/lib/util/geometry.js";
import { Drawable_Scene_Object } from "/ext/webgl_1_core/src/scene_objects/drawable_scene_object.js";
import { VERTEX_SHADER_SRC as diffuse_vertex_source } from "/ext/webgl_1_core/src/shaders/minimal_diffuse_vertex_shader.js"
import { FRAGMENT_SHADER_SRC as diffuse_fragment_source } from "/ext/webgl_1_core/src/shaders/minimal_diffuse_fragment_shader.js"

export class Sphere extends Drawable_Scene_Object {
    
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
            vertex_source:      diffuse_vertex_source,
            fragment_source:    diffuse_fragment_source,
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

        //...
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
        this.vertex_positions = unit_sphere_float_vertices();
        // --------------------------------------------------------
        this.vertex_bindings = unit_sphere_bindings(this.winding_clockwise);
        // --------------------------------------------------------
        this.mesh_data = {
            vertices: this.vertex_positions.length/4,
            edges: 0,
            faces: unit_sphere_face_count(),
        };
        // --------------------------------------------------------
        this.vertex_colours = [];
        this.vertex_normals = unit_sphere_normals();
        // --------------------------------------------------------
        let colour_orange = { r: 0.9, g: 0.5, b: 0.2 };
        for (let i = 0; i < this.mesh_data.vertices; i++) {
            this.vertex_colours.push(colour_orange.r);
            this.vertex_colours.push(colour_orange.g);
            this.vertex_colours.push(colour_orange.b);
            this.vertex_colours.push(1.0);
        }
        // --------------------------------------------------------
    }
    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * 
     * to map the location of attributes within our shader
     */
    initialise_mesh_attribute_locations(){
        super.initialise_mesh_attribute_locations();
        // then announce other data for each vertex
        this.vertex_colours_attribute_index  = this.managed_shader.declare_managed_attribute_location( "a_vertex_colour"   );
        this.vertex_normals_attribute_index  = this.managed_shader.declare_managed_attribute_location( "a_vertex_normal"   );
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
        this.vertex_colours_float_array   = new Float32Array( this.vertex_colours   );
        this.vertex_normals_float_array   = new Float32Array( this.vertex_normals   );
    }
    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * 
     * for use in the initialisation step to prepare our attribute buffers with size information
     */
    initialise_attribute_data(){
        super.initialise_attribute_data();
        
        this.managed_shader.initialise_attribute_buffer_floats( this.vertex_colours_attribute_index,  this.vertex_colours_float_array,   4 );
        this.managed_shader.initialise_attribute_buffer_floats( this.vertex_normals_attribute_index,  this.vertex_normals_float_array,   3 );
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
        this.managed_shader.load_attribute_buffer_floats( this.vertex_colours_attribute_index,  this.vertex_colours_float_array   );
        this.managed_shader.load_attribute_buffer_floats( this.vertex_normals_attribute_index,  this.vertex_normals_float_array   );
    }
    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * #### !! replacement !!
     * 
     * handles preparing all our uniforms for drawing, and is called during each draw call
     */
    update_uniform_data(){
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_model_to_ndc_matrix"), false, this.temp_model_to_ndc_matrix );
        // this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_normal_matrix"),       false, this.temp_model_to_ndc_matrix );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}