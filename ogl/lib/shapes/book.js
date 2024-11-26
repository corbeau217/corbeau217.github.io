import { Drawable_Scene_Object } from "/ogl/core/scene_objects/drawable_scene_object.js";
import { VERTEX_SHADER_SRC as sized_vertex_source } from "/ogl/lib/shaders/sized_diffuse_vertex_shader.js"
import { FRAGMENT_SHADER_SRC as sized_fragment_source } from "/ogl/lib/shaders/sized_diffuse_fragment_shader.js"
import { Shape_Factory } from "../../core/util/shape_factory.js";

export class Book extends Drawable_Scene_Object {
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
        
        this.translation_vec = vec3.fromValues( 0, 0, 0 );
        this.rotation_vec = vec3.fromValues( 0.0, 0.0, 0.0 );
        this.scale_vec = vec3.fromValues( 2.0, 2.0, 2.0 );

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

        this.book_shape = Book.prepare_shape();
        
        // --------------------------------------------------------
        this.vertex_positions = empty_or_defined(this.book_shape.vertex_positions);
        // --------------------------------------------------------
        this.vertex_bindings = empty_or_defined(this.book_shape.vertex_bindings);
        // --------------------------------------------------------
        this.vertex_colours = empty_or_defined(this.book_shape.vertex_colours);
        // --------------------------------------------------------
        this.vertex_sizes = empty_or_defined(this.book_shape.vertex_sizes);
        // --------------------------------------------------------
        this.vertex_normals = empty_or_defined(this.book_shape.vertex_normals);
        // --------------------------------------------------------
        this.mesh_data = {
            vertices: zero_or_defined(this.book_shape.vertex_count),
            edges: zero_or_defined(this.book_shape.edge_count),
            faces: zero_or_defined(this.book_shape.face_count),
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
        this.vertex_normals_attribute_index    = this.managed_shader.declare_managed_attribute_location( "a_vertex_normal"     );
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
        this.vertex_normals_float_array   = new Float32Array( this.vertex_normals     );
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
        this.managed_shader.load_attribute_buffer_floats( this.vertex_sizes_attribute_index,    this.vertex_sizes_float_array     );
        this.managed_shader.load_attribute_buffer_floats( this.vertex_normals_attribute_index,  this.vertex_normals_float_array   );
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


    static prepare_shape(){
        // --------------------------------------------------------
        // ---- prepare shape factory

        let shape_factory = new Shape_Factory();

        // --------------------------------------------------------
        // ---- prepare settings

        // --- colours ---
        const paper_colour       = {r: 1.0, g: 0.8, b: 0.4, a: 1.0};
        const cover_outer_colour = {r: 1.0, g: 0.4, b: 0.2, a: 1.0};
        const cover_inner_colour = {r: 0.5, g: 0.2, b: 0.1, a: 1.0};

        // --- sizes ---
        const cover_point_size = 5.0;
        const paper_point_size = 2.0;

        // --------------------------------------------------------
        // ---- shape specific helper functions
        //          [these are to shorten the function call line lengths]

        /**
         * given 4 indices that make a quad, going around clockwise from a point on the quad,
         * constructs two faces based on currently used winding order
         * @param {*} clockwise_face_winding if the winding order of faces is clockwise 
         * @param {*} first 
         * @param {*} second 
         * @param {*} third 
         * @param {*} fourth 
         */
        let cover_outer_quad = (clockwise_face_winding,first,second,third,fourth)=>{
            shape_factory.add_quad_with_colour_size( shape_points[first], shape_points[second], shape_points[third], shape_points[fourth], cover_outer_colour, cover_point_size, clockwise_face_winding );
        };
        /**
         * given 4 indices that make a quad, going around clockwise from a point on the quad,
         * constructs two faces based on currently used winding order
         * @param {*} clockwise_face_winding if the winding order of faces is clockwise 
         * @param {*} first 
         * @param {*} second 
         * @param {*} third 
         * @param {*} fourth 
         */
        let cover_inner_quad = (clockwise_face_winding,first,second,third,fourth)=>{
            shape_factory.add_quad_with_colour_size( shape_points[first], shape_points[second], shape_points[third], shape_points[fourth], cover_inner_colour, cover_point_size, clockwise_face_winding );
        };
        /**
         * given 4 indices that make a quad, going around clockwise from a point on the quad,
         * constructs two faces based on currently used winding order
         * @param {*} clockwise_face_winding if the winding order of faces is clockwise 
         * @param {*} first 
         * @param {*} second 
         * @param {*} third 
         * @param {*} fourth 
         */
        let paper_quad = (clockwise_face_winding,first,second,third,fourth)=>{
            shape_factory.add_quad_with_colour_size( shape_points[first], shape_points[second], shape_points[third], shape_points[fourth], paper_colour, paper_point_size, clockwise_face_winding );
        };
        /**
         * given 3 indices that make a triangle, going around clockwise from a point on the triangle,
         * constructs a face based on currently used winding order
         * 
         * [same as quad but for triangles]
         * @param {*} clockwise_face_winding if the winding order of faces is clockwise 
         * @param {*} first 
         * @param {*} second 
         * @param {*} third 
         */
        let paper_triangle = (clockwise_face_winding,first,second,third)=>{
            shape_factory.add_triangle_with_colour_size(  shape_points[first], shape_points[second], shape_points[third], paper_colour, paper_point_size, clockwise_face_winding  )
        };


        // --------------------------------------------------------
        // ---- create points for shape

        /**
         * dimensions in model space within a unit cube
         */
        const book = {
            cover: {
                width: 0.8,
                height: 1.0,
                thickness: 0.1,
                // how much to lift the cover from spine center
                spine_lift: 0.1,
            },
            page: {
                width: 0.7,
                height: 1.8,
                spine_lift: 0.08,
                // ---- page lift ----
                // how much to lift the middle page from the spine lift
                center_lift: 0.2,
                // ---- page thicknesses ----
                thickness_left: 0.15,
                thickness_center: 0.02,
                thickness_right: 0.15,
            }
        };

        // assume right handed
        let shape_points = [
            // ############################################### COVER ###############################################
            // -------------------------------------------- top points --------------------------------------------
            // spine top middle inner
            { x:  0.000,                y:  book.cover.thickness,                       z:  book.cover.height/2.0 }, // p[ 0]
            // spine top left   inner
            //       [left most, retreat back with cover width]
            { x: -1.0+book.cover.width, y:  book.cover.thickness+book.cover.spine_lift, z:  book.cover.height/2.0 }, // p[ 1]
            // cover top left   inner
            //       [left most, no retreat]
            { x: -1.0,                  y:  book.cover.thickness+book.cover.spine_lift, z:  book.cover.height/2.0 }, // p[ 2]
            // cover top left   outer
            //       [left most, no retreat]
            { x: -1.0,                  y:                       book.cover.spine_lift, z:  book.cover.height/2.0 }, // p[ 3]
            // spine top left   outer
            //       [left most, retreat back with cover width]
            { x: -1.0+book.cover.width, y:                       book.cover.spine_lift, z:  book.cover.height/2.0 }, // p[ 4]
            // spine top middle   outer
            { x:  0.000,                y:  0.000,                                      z:  book.cover.height/2.0 }, // p[ 5]
            // spine top right   outer
            //       [right most, retreat back with cover width]
            { x:  1.0-book.cover.width, y:                       book.cover.spine_lift, z:  book.cover.height/2.0 }, // p[ 6]
            // cover top right   outer
            //       [right most, no retreat]
            { x:  1.0,                  y:                       book.cover.spine_lift, z:  book.cover.height/2.0 }, // p[ 7]
            // cover top right   inner
            //       [right most, no retreat]
            { x:  1.0,                  y:  book.cover.thickness+book.cover.spine_lift, z:  book.cover.height/2.0 }, // p[ 8]
            // spine top right   inner
            //       [right most, retreat back with cover width]
            { x:  1.0-book.cover.width, y:  book.cover.thickness+book.cover.spine_lift, z:  book.cover.height/2.0 }, // p[ 9]

            // -------------------------------------------- bottom points --------------------------------------------
            // spine bottom middle inner
            { x:  0.000,                y:  book.cover.thickness,                       z: -book.cover.height/2.0 }, // p[10]
            // spine bottom left   inner
            //       [left most, retreat back with cover width]
            { x: -1.0+book.cover.width, y:  book.cover.thickness+book.cover.spine_lift, z: -book.cover.height/2.0 }, // p[11]
            // cover bottom left   inner
            //       [left most, no retreat]
            { x: -1.0,                  y:  book.cover.thickness+book.cover.spine_lift, z: -book.cover.height/2.0 }, // p[12]
            // cover bottom left   outer
            //       [left most, no retreat]
            { x: -1.0,                  y:                       book.cover.spine_lift, z: -book.cover.height/2.0 }, // p[13]
            // spine bottom left   outer
            //       [left most, retreat back with cover width]
            { x: -1.0+book.cover.width, y:                       book.cover.spine_lift, z: -book.cover.height/2.0 }, // p[14]
            // spine bottom middle   outer
            { x:  0.000,                y:  0.000,                                      z: -book.cover.height/2.0 }, // p[15]
            // spine bottom right   outer
            //       [right most, retreat back with cover width]
            { x:  1.0-book.cover.width, y:                       book.cover.spine_lift, z: -book.cover.height/2.0 }, // p[16]
            // cover bottom right   outer
            //       [right most, no retreat]
            { x:  1.0,                  y:                       book.cover.spine_lift, z: -book.cover.height/2.0 }, // p[17]
            // cover bottom right   inner
            //       [right most, no retreat]
            { x:  1.0,                  y:  book.cover.thickness+book.cover.spine_lift, z: -book.cover.height/2.0 }, // p[18]
            // spine bottom right   inner
            //       [right most, retreat back with cover width]
            { x:  1.0-book.cover.width, y:  book.cover.thickness+book.cover.spine_lift, z: -book.cover.height/2.0 }, // p[19]

            // ############################################### PAGES ###############################################

            // ------------------------- top points -------------------------
            // spine top center
            { x:  0.000,                                                                 y:  book.cover.thickness+book.cover.spine_lift+book.page.spine_lift,                   z:  book.cover.height/2.0 }, // p[20]
            // spine top left
            //      [left most, retreat back with cover width]
            { x: -1.0+book.cover.width,                                                  y:  book.cover.thickness+book.cover.spine_lift,                                        z:  book.cover.height/2.0 }, // p[21]
            // left page top left bottom
            //      [left most, retreat back with cover width, advance page width]
            { x: -1.0+book.cover.width-book.page.width,                                  y:  book.cover.thickness+book.cover.spine_lift,                                        z:  book.cover.height/2.0 }, // p[22]
            // left page top left top
            //      [left most, retreat back with cover width, advance page width, retreat half thickness]
            { x: -1.0+book.cover.width-book.page.width+(book.page.thickness_left/2.0),   y:  book.cover.thickness+book.cover.spine_lift+book.page.thickness_left,               z:  book.cover.height/2.0 }, // p[23]
            // center page top left bottom
            //      [advance center page half thickness]
            { x: -book.page.thickness_center/2.0,                                        y:  book.cover.thickness+book.cover.spine_lift+book.page.center_lift,                  z:  book.cover.height/2.0 }, // p[24]
            // center page top left end
            //      [advance center page half thickness]
            { x: -book.page.thickness_center/2.0,                                        y:  book.cover.thickness+book.cover.spine_lift+book.page.center_lift+book.page.width,  z:  book.cover.height/2.0 }, // p[25]
            // center page top right end
            //      [advance center page half thickness]
            { x:  book.page.thickness_center/2.0,                                        y:  book.cover.thickness+book.cover.spine_lift+book.page.center_lift+book.page.width,  z:  book.cover.height/2.0 }, // p[26]
            // center page top right bottom
            //      [advance center page half thickness]
            { x:  book.page.thickness_center/2.0,                                        y:  book.cover.thickness+book.cover.spine_lift+book.page.center_lift,                  z:  book.cover.height/2.0 }, // p[27]
            // right page top right top
            //      [right most, retreat back with cover width, advance page width, retreat half thickness]
            { x:  1.0-book.cover.width+book.page.width-(book.page.thickness_right/2.0),  y:  book.cover.thickness+book.cover.spine_lift+book.page.thickness_right,              z:  book.cover.height/2.0 }, // p[28]
            // right page top right bottom
            //      [right most, retreat back with cover width, advance page width]
            { x:  1.0-book.cover.width+book.page.width,                                  y:  book.cover.thickness+book.cover.spine_lift,                                        z:  book.cover.height/2.0 }, // p[29]
            // spine top right
            //      [left most, retreat back with cover width]
            { x:  1.0-book.cover.width,                                                  y:  book.cover.thickness+book.cover.spine_lift,                                        z:  book.cover.height/2.0 }, // p[30]
            
            // ------------------------- bottom points -------------------------
            // spine bottom center
            { x:  0.000,                                                                 y:  book.cover.thickness+book.cover.spine_lift+book.page.spine_lift,                   z: -book.cover.height/2.0 }, // p[31]
            // spine bottom left
            //      [left most, retreat back with cover width]
            { x: -1.0+book.cover.width,                                                  y:  book.cover.thickness+book.cover.spine_lift,                                        z: -book.cover.height/2.0 }, // p[32]
            // left page bottom left bottom
            //      [left most, retreat back with cover width, advance page width]
            { x: -1.0+book.cover.width-book.page.width,                                  y:  book.cover.thickness+book.cover.spine_lift,                                        z: -book.cover.height/2.0 }, // p[33]
            // left page bottom left top
            //      [left most, retreat back with cover width, advance page width, retreat half thickness]
            { x: -1.0+book.cover.width-book.page.width+(book.page.thickness_left/2.0),   y:  book.cover.thickness+book.cover.spine_lift+book.page.thickness_left,               z: -book.cover.height/2.0 }, // p[34]
            // center page bottom left bottom
            //      [advance center page half thickness]
            { x: -book.page.thickness_center/2.0,                                        y:  book.cover.thickness+book.cover.spine_lift+book.page.center_lift,                  z: -book.cover.height/2.0 }, // p[35]
            // center page bottom left end
            //      [advance center page half thickness]
            { x: -book.page.thickness_center/2.0,                                        y:  book.cover.thickness+book.cover.spine_lift+book.page.center_lift+book.page.width,  z: -book.cover.height/2.0 }, // p[36]
            // center page bottom right end
            //      [advance center page half thickness]
            { x:  book.page.thickness_center/2.0,                                        y:  book.cover.thickness+book.cover.spine_lift+book.page.center_lift+book.page.width,  z: -book.cover.height/2.0 }, // p[37]
            // center page bottom right bottom
            //      [advance center page half thickness]
            { x:  book.page.thickness_center/2.0,                                        y:  book.cover.thickness+book.cover.spine_lift+book.page.center_lift,                  z: -book.cover.height/2.0 }, // p[38]
            // right page bottom right top
            //      [right most, retreat back with cover width, advance page width, retreat half thickness]
            { x:  1.0-book.cover.width+book.page.width-(book.page.thickness_right/2.0),  y:  book.cover.thickness+book.cover.spine_lift+book.page.thickness_right,              z: -book.cover.height/2.0 }, // p[39]
            // right page bottom right bottom
            //      [right most, retreat back with cover width, advance page width]
            { x:  1.0-book.cover.width+book.page.width,                                  y:  book.cover.thickness+book.cover.spine_lift,                                        z: -book.cover.height/2.0 }, // p[40]
            // spine bottom right
            //      [left most, retreat back with cover width]
            { x:  1.0-book.cover.width,                                                  y:  book.cover.thickness+book.cover.spine_lift,                                        z: -book.cover.height/2.0 }, // p[41]
        ];


        const clockwise_winding_order = false;
        // ------------ top side ------------
        cover_outer_quad(clockwise_winding_order, 1, 2, 3, 4); // left
        cover_outer_quad(clockwise_winding_order, 9, 6, 7, 8); // right
        // ------------ left side -----------
        cover_outer_quad(clockwise_winding_order, 2,12,13, 3);
        // ------------ bottom side ---------
        cover_outer_quad(clockwise_winding_order,11,14,13,12); // left
        cover_outer_quad(clockwise_winding_order,19,18,17,16); // right
        // ------------ right side ----------
        cover_outer_quad(clockwise_winding_order,18, 8, 7,17);
        // ------------ spine top ----------
        cover_outer_quad(clockwise_winding_order, 0, 1, 4, 5); // left
        cover_outer_quad(clockwise_winding_order, 0, 5, 6, 9); // right
        // ------------ spine outer ----------
        cover_outer_quad(clockwise_winding_order,15, 5, 4,14); // left
        cover_outer_quad(clockwise_winding_order,15,16, 6, 5); // right
        // ------------ spine bottom ----------
        cover_outer_quad(clockwise_winding_order,10,15,14,11); // left
        cover_outer_quad(clockwise_winding_order,10,19,16,15); // right
        // ------------ spine inner ----------
        cover_inner_quad(clockwise_winding_order, 0,10,11, 1); // left
        cover_inner_quad(clockwise_winding_order, 0, 9,19,10); // right
        // ------------ left inner ----------
        cover_inner_quad(clockwise_winding_order, 1,11,12, 2);
        // ------------ left outer ----------
        cover_outer_quad(clockwise_winding_order,14, 4, 3,13);
        // ------------ right inner ----------
        cover_inner_quad(clockwise_winding_order, 9, 8,18,19);
        // ------------ right outer ----------
        cover_outer_quad(clockwise_winding_order,16,17, 7, 6);

        // --------------------------------------------------------
        // ---- make paper faces

        // =================== left page ===================
        paper_quad(clockwise_winding_order,21,22,33,32);
        paper_quad(clockwise_winding_order,21,24,23,22);
        paper_quad(clockwise_winding_order,24,35,34,23);
        paper_quad(clockwise_winding_order,22,23,34,33);
        paper_quad(clockwise_winding_order,35,32,33,34);
        // =================== center page =================
        paper_quad(clockwise_winding_order,24,27,26,25);
        paper_quad(clockwise_winding_order,24,25,36,35);
        paper_quad(clockwise_winding_order,25,26,37,36);
        paper_quad(clockwise_winding_order,26,27,38,37);
        paper_quad(clockwise_winding_order,37,38,35,36);
        // =================== right page ==================
        paper_quad(clockwise_winding_order,27,30,29,28);
        paper_quad(clockwise_winding_order,27,28,39,38);
        paper_quad(clockwise_winding_order,28,29,40,39);
        paper_quad(clockwise_winding_order,29,30,41,40);
        paper_quad(clockwise_winding_order,39,40,41,38);
        // ===================== spine =====================
        paper_quad(clockwise_winding_order,31,20,21,32);
        paper_quad(clockwise_winding_order,31,41,30,20);
        
        // --------------------------------------------------------

        // ===================== spine top =================
        paper_triangle(clockwise_winding_order,20,30,27);
        paper_triangle(clockwise_winding_order,20,27,24);
        paper_triangle(clockwise_winding_order,20,24,21);
        // ===================== spine bottom ==============
        paper_triangle(clockwise_winding_order,31,38,41);
        paper_triangle(clockwise_winding_order,31,35,38);
        paper_triangle(clockwise_winding_order,31,32,35);
        
        // --------------------------------------------------------
        // ---- finished, give it back
        return shape_factory.shape_data;
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}