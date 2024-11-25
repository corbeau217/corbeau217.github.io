import { Drawable_Scene_Object } from "/ogl/core/scene_objects/drawable_scene_object.js";
import { VERTEX_SHADER_SRC as sized_vertex_source } from "/ogl/lib/shaders/sized_wireframe_vertex_shader.js"
import { FRAGMENT_SHADER_SRC as sized_fragment_source } from "/ogl/lib/shaders/sized_wireframe_fragment_shader.js"

export class Coordinate_Frame extends Drawable_Scene_Object {
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
            vertex_source:      sized_vertex_source,
            fragment_source:    sized_fragment_source,
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

        // size settings for gl_PointSize
        this.point_data = {
            ends_size:   5.0,
            center_size: 10.0,
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
        // --------------------------------------------------------
        this.vertex_positions = [
            // i / x / red
            0.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,

            // j / y / green
            0.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,

            // k / z / blue
            0.0, 0.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,

            // t / origin / center
            0.0, 0.0, 0.0, 1.0,
            0.0, 0.0, 0.0, 1.0,
        ];
        // --------------------------------------------------------
        this.vertex_bindings = [
            // i / x / red
            0, 1,
            // j / y / green
            2, 3,
            // k / z / blue
            4, 5,
            // t / origin / center
            6, 7,
        ];
        // --------------------------------------------------------
        this.vertex_colours = [
            // i / x / red
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,

            // j / y / green
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,

            // k / z / blue
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,

            // t / origin / center
            0.5, 0.5, 0.5, 1.0,
            0.5, 0.5, 0.5, 1.0,
        ];
        // --------------------------------------------------------
        this.vertex_sizes = [
            // i / x / red
            0.0,
            this.point_data.ends_size,

            // j / y / green
            0.0,
            this.point_data.ends_size,

            // k / z / blue
            0.0,
            this.point_data.ends_size,

            // t / origin / center
            0.0,
            this.point_data.center_size,
        ];
        // --------------------------------------------------------
        this.mesh_data = {
            vertices: 8,
            edges: 4,
            faces: 0,
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
        this.vertex_sizes_attribute_index    = this.managed_shader.declare_managed_attribute_location( "a_vertex_size"     );
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
        this.vertex_sizes_float_array     = new Float32Array( this.vertex_sizes     );
    }
    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * 
     * for use in the initialisation step to prepare our attribute buffers with size information
     */
    initialise_attribute_data(){
        super.initialise_attribute_data();
        this.managed_shader.initialise_attribute_buffer_floats( this.vertex_colours_attribute_index,  this.vertex_colours_float_array,   4 );
        this.managed_shader.initialise_attribute_buffer_floats( this.vertex_sizes_attribute_index,    this.vertex_sizes_float_array,     1 );
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
        this.managed_shader.load_attribute_buffer_floats( this.vertex_sizes_attribute_index,    this.vertex_sizes_float_array     );
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

    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * #### !! REPLACEMENT !!
     * 
     * draw this object using the already prepared `temp_model_to_ndc_matrix`
     */
    draw_self(){
        // select shader as being used
        this.gl_context.useProgram(this.shader);
        this.managed_shader.enable_attributes();
        // enable attribute data if it isnt already
        this.update_attribute_data();
        this.update_uniform_data();
        // update uniform data, incase it wasnt
        // draw call
        // if(this.mesh_data.faces > 0)    this.gl_context.drawElements(this.gl_context.TRIANGLES, this.mesh_data.faces*3,  this.gl_context.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.LINES,     this.mesh_data.vertices,  this.gl_context.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.POINT,     this.mesh_data.vertices, this.gl_context.UNSIGNED_SHORT, 0);
        // finish with drawing in our context
        this.managed_shader.disable_attributes();
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}