import { Shader_Manager } from "/ogl/common/shaders/shader_engine.js";
import { VERTEX_SHADER_SOURCE as wireframe_vertex_source } from "/ogl/common/shaders/minimal_wireframe_vertex_shader.js"
import { FRAGMENT_SHADER_SOURCE as wireframe_fragment_source } from "/ogl/common/shaders/minimal_wireframe_fragment_shader.js"

export class Coordinate_Frame {
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * construct a new `Coordinate_Frame` scene object, providing it with a WebGL context to use
     * 
     * @warn avoid extending/modifying the constructor in derived objects and instead use the creation
     *      pipeline functions provided
     * 
     * @param {*} gl_context WebGL context for this object to use
     * @param {*} parent_object parent object to attach this object to, leave it as `null` if it's drawn
     *                  directly from the `Canvas_Object`
     */
    constructor( gl_context, parent_object ){
        // before creating the object
        this.fetch_shader_source_list();
        // construction event
        this.perform_construction_event( gl_context );
        // initialisation event
        this.perform_initialisation_event( parent_object );
    }
    /**
     * ### this function is to be overriden in derived objects to change which shaders to use
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
    fetch_shader_source_list(){
        this.shader_source_list = [
            wireframe_vertex_source,
            wireframe_fragment_source,
        ];
    }

    /**
     * this is called by the constructor directly
     * 
     * ### this function should not be modified to preserve intended flow of the creation pipeline
     */
    perform_construction_event( gl_context ){
        this.construction_pre_event( gl_context );
        this.construction_on_event();
    }
    /**
     * this is called by the constructor directly
     * 
     * ### this function should not be modified to preserve intended flow of the creation pipeline
     */
    perform_initialisation_event( parent_object ){
        this.initialise_pre_event( parent_object );
        this.initialise_on_event();
        this.initialise_post_event();
    }
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    /**
     * operations that happen before the construction of this object
     *      *[mostly reserved for linking this object to a webgl context]*
     * 
     * ***this should be modified very sparingly as it's before the shader is loaded***
     * 
     * @param {*} gl_context the context this object belongs to
     */
    construction_pre_event( gl_context ){
        this.gl_context = gl_context;
    }
    /**
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
     * used to prepare references and settings, ***minimal calculations*** and
     *      ***no function calls*** should be performed during this stage
     */
    initialise_pre_event( parent_object ){
        // information about location in scene graph
        this.parent = (parent_object!=undefined)?parent_object:null;
        this.children = [];

        // size settings for gl_PointSize
        this.point_data = {
            ends_size:   5.0,
            center_size: 10.0,
        };
    }
    /**
     * used for initalising matrices and large setting information
     *      function calls are fine but should be limited as
     *      bloating this could cause excessive object creation
     *      overhead if we're creating and destroying objects often
     * 
     * this is where attribute locations are determined and the model shape is made
     *      which is handled by their respective functions
     */
    initialise_on_event(){
        // our model matrix
        this.model_matrix = mat4.create();
        // how we create the model to ndc matrix when this object is
        //      is drawn by a Canvas_Object
        this.temp_model_view = mat4.create();
        this.temp_model_to_ndc_matrix = mat4.create();
        this.temp_parent_matrix = mat4.create();

        // find the location of our attributes in shader
        this.initialise_mesh_attribute_locations();

        // prepare the information about our mesh
        this.generate_mesh_data();
    }
    /**
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
        this.managed_shader.load_binding_buffer( this.vertex_bindings_int_array );
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
     * called by *parent object* in the scene graph or `Canvas_Object` responsible for this context
     * 
     * @param {*} delta_time time scale provided by the update caller (usually the web app draw loop)
     */
    update( delta_time ){
        // self then all children
        this.update_self( delta_time );
        this.update_children( delta_time );
    }
    /**
     * when this is drawn regardless of the parent object information
     * @param {*} view_matrix camera view matrix
     * @param {*} projection_matrix camera projection matrix
     */
    draw_as_scene_root( view_matrix, projection_matrix ){
        // --------------------------------------------------------
        // --- quick reference for gl min matrix

        // (static) multiply(out, a, b) → {mat4}
        // (static) invert(out, a) → {mat4}
        // (static) fromMat4(out, a) → {mat3}
        // (static) transpose(out, a) → {mat4}
        // (static) transpose(out, a) → {mat3}

        // --------------------------------------------------------
        // --- clear matrices

        mat4.identity(this.temp_parent_matrix);
        
        // --------------------------------------------------------
        // --- multiply matrices

        mat4.multiply( this.temp_parent_matrix, projection_matrix, view_matrix);

        // --------------------------------------------------------
        // --- perform standard drawing

        this.draw(this.temp_parent_matrix);
    }
    /**
     * TODO: *have a write up somewhere explaining the scene graph in greater detail than below, this is very word mouthful*
     * 
     * @param {*} model_to_parent_matrix transformations go from this model's *model-space* to the *world-space* which the
     *          provided `model_to_parent_matrix` is then applied to. it includes the *view and projection transformations*
     *          provided by the *scene root object* which this object has its transformations descendant from
     */
    draw( model_to_parent_matrix ){
        // --------------------------------------------------------
        // --- quick reference for gl min matrix

        // (static) multiply(out, a, b) → {mat4}
        // (static) invert(out, a) → {mat4}
        // (static) fromMat4(out, a) → {mat3}
        // (static) transpose(out, a) → {mat4}
        // (static) transpose(out, a) → {mat3}

        // --------------------------------------------------------
        // --- clear matrices

        mat4.identity(this.temp_model_to_ndc_matrix);
        
        // --------------------------------------------------------
        // --- multiply matrices

        mat4.multiply( this.temp_model_to_ndc_matrix, model_to_parent_matrix, this.model_matrix);

        // --------------------------------------------------------
        // --- perform standard drawing
        
        // self then all children
        this.draw_self();
        this.draw_children();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * operations performed on this object each frame with respect to the time scale provided
     *      by `delta_time` parameter
     */
    update_self( delta_time ){
        // zzz
    }

    /**
     * draw this object using the already prepared `temp_model_to_ndc_matrix`
     */
    draw_self(){
        // select shader as being used
        this.gl_context.useProgram(this.shader);
        // enable attribute data if it isnt already
        this.managed_shader.enable_attributes();
        // update uniform data, incase it wasnt
        this.update_uniform_data();
        // draw call
        this.gl_context.drawElements(this.gl_context.LINES, this.mesh_counts.edges*2,  this.gl_context.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.POINT, this.mesh_counts.vertices, this.gl_context.UNSIGNED_SHORT, 0);
        // finish with drawing in our context
        this.managed_shader.disable_attributes();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * called by `update( delta_time )` to handle deferring the update of all our child objects
     *          within our *scene graph*
     * 
     * @param {*} delta_time time scale provided by the update caller (usually the web app draw loop)
     */
    update_children( delta_time ){
        // loop through all child elements and call update
        for (let child_index = 0; child_index < this.children.length; child_index++) {
            const child_object = this.children[child_index];

            // make them do their draw
            child_object.update( delta_time );
        }
    }
    /**
     * defer drawing all the child elements for this object within the *scene graph*, and provide them with the matrix
     *          to transform them all the way to **Normalised Device Coordinates** as their model to parent matrix
     * 
     * assumes that  we've already updated the temp model to ndc matrix for them to use
     * 
     * TODO: *have NDC included in a write up about the transformation pipline*
     * 
     */
    draw_children(){
        // loop through all child elements and call draw
        for (let child_index = 0; child_index < this.children.length; child_index++) {
            const child_object = this.children[child_index];

            // make them do their draw
            child_object.draw(this.temp_model_to_ndc_matrix);
        }
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


}