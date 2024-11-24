import { Drawable_Scene_Object } from "/ogl/core/scene_objects/drawable_scene_object.js";
import { VERTEX_SHADER_SRC as wireframe_vertex_source } from "/ogl/lib/shaders/minimal_wireframe_vertex_shader.js"
import { FRAGMENT_SHADER_SRC as wireframe_fragment_source } from "/ogl/lib/shaders/minimal_wireframe_fragment_shader.js"
import { Lathe } from "/ogl/core/mesh/lathe.js";

export class Turbofan extends Drawable_Scene_Object {
    
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
            vertex_source:      wireframe_vertex_source,
            fragment_source:    wireframe_fragment_source,
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

        this.lathe_data = {
            // front cone tip
            first_point: { radius: 0.0,  position_z:  0.87, colour: {r:0.1, g:0.1, b:0.5} },
            // rear tip
            last_point: { radius: 0.0,  position_z: -1.0,  colour: {r:1.0, g:0.4, b:0.2} },
            // the others
            body_points: [
                // front cone base
                { radius: 0.28, position_z:  0.7,  colour: {r:0.15, g:0.15, b:0.15} },
                // end of blades
                { radius: 0.58, position_z:  0.7,  colour: {r:0.3, g:0.3, b:0.3} },
                // front of shell
                { radius: 0.67, position_z:  1.0,  colour: {r:0.7, g:0.7, b:0.7} },
                // widest part
                { radius: 0.73, position_z:  0.48, colour: {r:0.8, g:0.8, b:0.8} },
                // past blades
                { radius: 0.7,  position_z: -0.17, colour: {r:0.78, g:0.78, b:0.78} },
                // end of shell
                { radius: 0.6,  position_z: -0.62, colour: {r:0.72, g:0.72, b:0.72} },
                // outer rear exhaust
                { radius: 0.62, position_z: -0.4,  colour: {r:0.05, g:0.05, b:0.05} },
                { radius: 0.39, position_z: -0.86, colour: {r:0.5, g:0.2, b:0.52} },
                // rear inner exhaust
                { radius: 0.52, position_z: -0.6,  colour: {r:1.0, g:0.9, b:0.8} },
            ],
            slice_count: this.circle_point_count,
        };
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
        this.lathe = new Lathe( this.lathe_data );
        // --------------------------------------------------------
        this.vertex_positions = this.lathe.vertices;
        // --------------------------------------------------------
        this.vertex_bindings = this.lathe.bindings;
        // --------------------------------------------------------
        this.vertex_colours = this.lathe.colours;
        // --------------------------------------------------------
        this.vertex_normals = this.lathe.normals;
        // --------------------------------------------------------
        this.mesh_data = {
            vertices: this.lathe.vertex_count,
            edges: 0,
            faces: this.lathe.face_count,
        };
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
    }
    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * 
     * for use in the initialisation step to prepare our attribute buffers with size information
     */
    initialise_attribute_data(){
        super.initialise_attribute_data();
        
        this.managed_shader.initialise_attribute_buffer_floats( this.vertex_colours_attribute_index,  this.vertex_colours_float_array,   4 );
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
    }
    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * #### !! replacement !!
     * 
     * handles preparing all our uniforms for drawing, and is called during each draw call
     */
    update_uniform_data(){
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_model_to_ndc_matrix"), false, this.temp_model_to_ndc_matrix );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}