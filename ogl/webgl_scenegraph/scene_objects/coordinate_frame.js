import { Scene_Object } from "./scene_object.js";
import { Shader_Manager } from "/ogl/common/shaders/shader_engine.js";
import { VERTEX_SHADER_SRC as wireframe_vertex_source } from "../shaders/minimal_wireframe_vertex_shader.js"
import { FRAGMENT_SHADER_SRC as wireframe_fragment_source } from "../shaders/minimal_wireframe_fragment_shader.js"

export class Coordinate_Frame extends Scene_Object {
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    /**
     * ### OVERRIDE OF PARENT FUNCTION
     * #### !! REPLACEMENT !!
     * 
     * prepares the shader sources using: `this.shader_source_list`
     * 
     * * the structure of `this.shader_source_list` is a string list containing the shaders in order
     *   of their usage
     * * *since WebGL 1 only has the `vertex` and `fragment` shaders, it'll just be those*
     * 
     *   **Items in this list are raw string values for compilation by the shader manager**
     *                  
     *   Ordering is reserved as:
     *   * `this.shader_source_list[0]` -> *vertex shader source*
     *   * `this.shader_source_list[1]` -> *fragment shader source*
     */
    fetch_required_resources(){
        this.shader_source_list = [
            wireframe_vertex_source,
            wireframe_fragment_source,
        ];
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    /**
     * ### OVERRIDE OF PARENT FUNCTION
     * #### !! REPLACEMENT !!
     * 
     * operations that happen during the construction of this object
     *      this is mostly reserved for preparing our shader code to use
     *      in our shader program
     * 
     * at this stage the shader program is not yet setup, and any mesh information
     *      has been deferred to the initialisation event
     */
    construction_on_event(){
        // gather our shader
        this.shader_manager = new Shader_Manager(this.gl_context);
        this.managed_shader = this.shader_manager.new_shader( this.shader_source_list[0], this.shader_source_list[1] );
        this.shader = this.managed_shader.get_shader_program();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    /**
     * ### OVERRIDE OF PARENT FUNCTION
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
    /**
     * ### OVERRIDE OF PARENT FUNCTION
     * 
     * used for initalising matrices and large setting information
     *      function calls are fine but should be limited as
     *      bloating this could cause excessive object creation
     *      overhead if we're creating and destroying objects often
     * 
     * this is where attribute locations are determined and the model shape is made
     *      which is handled by their respective functions
     */
    initialise_on_event(){
        super.initialise_on_event();

        // find the location of our attributes in shader
        this.initialise_mesh_attribute_locations();

        // prepare the information about our mesh
        this.generate_mesh_data();
    }
    /**
     * ### OVERRIDE OF PARENT FUNCTION
     * #### !! REPLACEMENT !!
     * 
     * any operation that needs to happen during initialisation
     *      but requires that the object already have information
     *      ready to be used
     * 
     * this is effectively operations which arent part of initialisation
     *      but need to happen before the object is ready to be used
     */
    initialise_post_event(){
        // puts our mesh data in the form of WebGL arrays
        this.initialise_gl_arrays();
        // loads the initial mesh data into the buffers they belong and readies them
        //  to be used
        this.initialise_attribute_data();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
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
            6,
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
            this.point_data.center_size,
        ];
        // --------------------------------------------------------
        this.mesh_counts = {
            vertices: 7,
            edges: 3,
            faces: 0,
        };
        // --------------------------------------------------------
    }
    /**
     * to map the location of attributes within our shader
     */
    initialise_mesh_attribute_locations(){
        // announce they're managing our bindings
        this.managed_shader.declare_managed_bindings();
        // then announce the data for each vertex 
        this.vertex_position_attribute_index = this.managed_shader.declare_managed_attribute_location( "a_vertex_position" );
        this.vertex_colours_attribute_index  = this.managed_shader.declare_managed_attribute_location( "a_vertex_colour"   );
        this.vertex_sizes_attribute_index    = this.managed_shader.declare_managed_attribute_location( "a_vertex_size"     );
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    /**
     * prepare the WebGL friendly array types for all our data
     */
    initialise_gl_arrays(){
        // prepare the webgl friendly data types for all our information
        this.vertex_bindings_int_array    = new Uint16Array(  this.vertex_bindings  );
        this.vertex_positions_float_array = new Float32Array( this.vertex_positions );
        this.vertex_colours_float_array   = new Float32Array( this.vertex_colours   );
        this.vertex_sizes_float_array     = new Float32Array( this.vertex_sizes     );
    }
    /**
     * for use in the initialisation step to prepare our attribute buffers with size information
     */
    initialise_attribute_data(){
        this.managed_shader.load_binding_buffer( this.vertex_bindings_int_array );
        this.managed_shader.initialise_attribute_buffer_floats( this.vertex_position_attribute_index, this.vertex_positions_float_array, 4 );
        this.managed_shader.initialise_attribute_buffer_floats( this.vertex_colours_attribute_index,  this.vertex_colours_float_array,   4 );
        this.managed_shader.initialise_attribute_buffer_floats( this.vertex_sizes_attribute_index,    this.vertex_sizes_float_array,     1 );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * for use by our object during run time to update the data within our buffers
     */
    update_attribute_data(){
        // this.managed_shader.load_binding_buffer( this.vertex_bindings_int_array );
        this.managed_shader.load_attribute_buffer_floats( this.vertex_position_attribute_index, this.vertex_positions_float_array );
        this.managed_shader.load_attribute_buffer_floats( this.vertex_colours_attribute_index,  this.vertex_colours_float_array   );
        this.managed_shader.load_attribute_buffer_floats( this.vertex_sizes_attribute_index,    this.vertex_sizes_float_array     );
    }
    /**
     * handles preparing all our uniforms for drawing, and is called during each draw call
     */
    update_uniform_data(){
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_model_to_ndc_matrix"), false, this.temp_model_to_ndc_matrix );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * ### OVERRIDE OF PARENT FUNCTION
     * #### !! REPLACEMENT !!
     * 
     * draw this object using the already prepared `temp_model_to_ndc_matrix`
     */
    draw_self(){
        // select shader as being used
        this.gl_context.useProgram(this.shader);
        // enable attribute data if it isnt already
        this.update_attribute_data();
        this.update_uniform_data();
        this.managed_shader.enable_attributes();
        // update uniform data, incase it wasnt
        // draw call
        this.gl_context.drawElements(this.gl_context.LINES, this.mesh_counts.edges*2,  this.gl_context.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.POINT, this.mesh_counts.vertices, this.gl_context.UNSIGNED_SHORT, 0);
        // finish with drawing in our context
        this.managed_shader.disable_attributes();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}