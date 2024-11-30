import { Drawable_Scene_Object } from "/ogl/core/scene_objects/drawable_scene_object.js";
// import { VERTEX_SHADER_SRC as sized_vertex_source } from "/ogl/lib/shaders/sized_wireframe_vertex_shader.js"
import { FRAGMENT_SHADER_SRC as sized_fragment_source } from "/ogl/lib/shaders/sized_wireframe_fragment_shader.js";
import { Wireframe_Shape_factory } from "/ogl/core/util/wireframe_shape_factory.js";
import { Vertex_Shader_Builder } from "/ogl/core/util/vertex_shader_builder.js";

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
        this.vertex_source_builder = Vertex_Shader_Builder.build_vertex_shader(true,true,false,false);
        // specify our shader sources
        this.shader_source_data = {
            vertex_source:      this.vertex_source_builder.get_source(),
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

        // ...
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
        this.joint_shape = Coordinate_Frame.prepare_shape();
        
        // --------------------------------------------------------
        this.vertex_positions = empty_or_defined(this.joint_shape.vertex_positions);
        // --------------------------------------------------------
        this.vertex_bindings = empty_or_defined(this.joint_shape.vertex_bindings);
        // --------------------------------------------------------
        this.vertex_colours = empty_or_defined(this.joint_shape.vertex_colours);
        // --------------------------------------------------------
        this.vertex_sizes = empty_or_defined(this.joint_shape.vertex_sizes);
        // --------------------------------------------------------
        this.vertex_normals = empty_or_defined(this.joint_shape.vertex_normals);
        // --------------------------------------------------------
        this.mesh_data = {
            vertices: zero_or_defined(this.joint_shape.vertex_count),
            edges: zero_or_defined(this.joint_shape.edge_count),
            faces: zero_or_defined(this.joint_shape.face_count),
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
        this.update_attribute_data();
        // update uniform data, incase it wasnt
        this.update_uniform_data();
        // draw call
        this.gl_context.drawElements(this.gl_context.LINES,     this.mesh_data.vertices,  this.gl_context.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.POINT,     this.mesh_data.vertices,  this.gl_context.UNSIGNED_SHORT, 0);
        // finish with drawing in our context
        this.managed_shader.disable_attributes();
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    static prepare_shape(){
        // --------------------------------------------------------
        // ---- prepare shape factory

        let shape_factory = new Wireframe_Shape_factory();

        // --------------------------------------------------------
        // ---- prepare settings

        // --- colours ---
        const origin_colour = {r: 0.7, g: 0.7, b: 0.7, a: 1.0};
        const XY_colour = {r: 0.0, g: 0.0, b: 1.0, a: 1.0};
        const YZ_colour = {r: 1.0, g: 0.0, b: 0.0, a: 1.0};
        const ZX_colour = {r: 0.0, g: 1.0, b: 0.0, a: 1.0};

        // --- sizes ---
        const origin_point_size = 6.0;
        const center_point_size = 0.0;
        const axis_point_size = 4.0;

        // --------------------------------------------------------
        // ---- create points for shape

        const axis_points = [
            { x: 0.0, y: 0.0, z: 0.0 },
            { x: 1.0, y: 0.0, z: 0.0 },
            { x: 0.0, y: 1.0, z: 0.0 },
            { x: 0.0, y: 0.0, z: 1.0 },
        ];
        
        // --------------------------------------------------------
        // ---- construct it

        // center point
        shape_factory.add_edge_with_colour_sizes(axis_points[0],axis_points[0],origin_colour,origin_point_size,origin_point_size);
        shape_factory.add_edge_with_colour_sizes(axis_points[0],axis_points[3],XY_colour,center_point_size,axis_point_size);
        shape_factory.add_edge_with_colour_sizes(axis_points[0],axis_points[1],YZ_colour,center_point_size,axis_point_size);
        shape_factory.add_edge_with_colour_sizes(axis_points[0],axis_points[2],ZX_colour,center_point_size,axis_point_size);

        
        // --------------------------------------------------------
        // ---- finished, give it back
        return shape_factory.shape_data;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}