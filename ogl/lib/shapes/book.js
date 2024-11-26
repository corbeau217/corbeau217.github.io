import { Drawable_Scene_Object } from "/ogl/core/scene_objects/drawable_scene_object.js";
import { VERTEX_SHADER_SRC as sized_vertex_source } from "/ogl/lib/shaders/sized_wireframe_vertex_shader.js"
import { FRAGMENT_SHADER_SRC as sized_fragment_source } from "/ogl/lib/shaders/sized_wireframe_fragment_shader.js"

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
        super.update_uniform_data();
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_model_to_ndc_matrix"), false, this.temp_model_to_ndc_matrix );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    static prepare_shape(){
        // prepare the shape information container
        /**
         * shape information container to be used by Drawable_Scene_Object
         */
        let shape_data = {
            // ------------------------
            vertex_positions: [],
            vertex_bindings: [],
            vertex_colours: [],
            vertex_sizes: [],
            vertex_normals: [],
            // ------------------------
            vertex_count: 0,
            edge_count: 0,
            face_count: 0,
            colour_count: 0,
            size_count: 0,
            normal_count: 0,
            // ------------------------
        };

        // --------------------------------------------------------
        // ------ helper methods

        /**
         * included in our data
         * @param {*} vertex_data 
         */
        let add_vertex_position = (vertex_data)=>{
            shape_data.vertex_positions.push(vertex_data.x);
            shape_data.vertex_positions.push(vertex_data.y);
            shape_data.vertex_positions.push(vertex_data.z);
            shape_data.vertex_positions.push(1.0);
            
            shape_data.vertex_count += 1;
        };
        /**
         * including it in our data
         * @param {*} first 
         * @param {*} second 
         * @param {*} third 
         */
        let add_binding_face = (first,second,third)=>{
            shape_data.vertex_bindings.push(first);
            shape_data.vertex_bindings.push(second);
            shape_data.vertex_bindings.push(third);
            shape_data.face_count += 1;
        };
        /**
         * including it in our data
         * @param {*} colour 
         * @param {*} size 
         */
        let add_colour_and_size = (colour, size)=>{
            // colour first
            shape_data.vertex_colours.push(colour.r);
            shape_data.vertex_colours.push(colour.g);
            shape_data.vertex_colours.push(colour.b);
            shape_data.vertex_colours.push(colour.a);
            shape_data.colour_count += 1;

            // then size
            shape_data.vertex_sizes.push(size);
            shape_data.size_count += 1;
        };
        /**
         * does all for a point, but concisely
         * @param {*} pos 
         * @param {*} colour 
         * @param {*} size 
         */
        let add_pos_colour_size = (pos,colour,size)=>{
            add_vertex_position(pos);
            add_colour_and_size(colour,size);
        };

        /**
         * takes vec3 and includes it as a normal for our shape
         * @param {*} normal_vec3 
         */
        let add_normal = (normal_vec3)=>{
            shape_data.vertex_normals.push(normal_vec3[0]);
            shape_data.vertex_normals.push(normal_vec3[1]);
            shape_data.vertex_normals.push(normal_vec3[2]);
            shape_data.normal_count += 1;
        };
        /**
         * converts the position data to two vec3s then does a cross product
         *  to get the perpendicular vector to the plane that all 3 vertices
         *  exist on
         * 
         * @param {*} first_pos 
         * @param {*} second_pos 
         * @param {*} third_pos 
         * @returns vec3 perpendicular vector
         */
        let normal_vec3_from_face_vertices = ( first_pos, second_pos, third_pos )=>{
            // prepare the positions as vec3
            let first_vec = vec3.fromValues( first_pos.x, first_pos.y, first_pos.z );
            let second_vec = vec3.fromValues( second_pos.x, second_pos.y, second_pos.z );
            let third_vec = vec3.fromValues( third_pos.x, third_pos.y, third_pos.z );
            // ready the vectors for the math library
            let left_vec = vec3.create();
            let right_vec = vec3.create();
            let cross_vec = vec3.create();

            // --- vector math ---

            // (static) subtract(out, a, b) → {vec3}
            // Subtracts vector b from vector a 

            // get the two vectors
            vec3.subtract(left_vec, second_vec, first_vec);
            vec3.subtract(right_vec, second_vec, third_vec);

            // (static) cross(out, a, b) → {vec3}
            // Computes the cross product of two vec3's 
            
            // CLOCKWISE / right-handed coordinate frame
            vec3.cross(cross_vec, left_vec, right_vec);

            // // ANTICLOCKWISE / left-handed coordinate frame
            // vec3.cross(cross_vec, right_vec, left_vec);

            // --- give ---
            return cross_vec;
        };
        /**
         * determine the normal, then provide it
         * @param {*} first_pos 
         * @param {*} second_pos 
         * @param {*} third_pos 
         */
        let add_normals_for_face = (first_pos, second_pos, third_pos)=>{
            // generate the normal
            let face_normal = normal_vec3_from_face_vertices(first_pos, second_pos, third_pos);

            // add as normal for each of the triangle's/face's vertices
            add_normal(face_normal);
            add_normal(face_normal);
            add_normal(face_normal);
        };
        /**
         * makes a triangle/face including the normal vector, with colour and point size for it too
         * @param {*} first_pos 
         * @param {*} second_pos 
         * @param {*} third_pos 
         * @param {*} colour 
         * @param {*} size 
         */
        let add_face_with_colour_size = ( first_pos, second_pos, third_pos, colour, size )=>{
            // keep where we're adding
            let starting_index = shape_data.vertex_count;
            // generate the vertices
            add_pos_colour_size( first_pos,  colour, size );
            add_pos_colour_size( second_pos, colour, size );
            add_pos_colour_size( third_pos,  colour, size );
            // bind it
            add_binding_face( starting_index, starting_index+1, starting_index+2);
            // add the normals for it
            add_normals_for_face( first_pos, second_pos, third_pos );
        };

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

        /**
         * build face for paper
         * @param {*} first 
         * @param {*} second 
         * @param {*} third 
         */
        let paper_face = (first,second,third)=>{ add_face_with_colour_size(first,second,third,paper_colour,paper_point_size); }
        /**
         * build face for cover outer face
         * @param {*} first 
         * @param {*} second 
         * @param {*} third 
         */
        let cover_outer_face = (first,second,third)=>{ add_face_with_colour_size(first,second,third,cover_outer_colour,cover_point_size); }
        /**
         * build face for cover inner face
         * @param {*} first 
         * @param {*} second 
         * @param {*} third 
         */
        let cover_inner_face = (first,second,third)=>{ add_face_with_colour_size(first,second,third,cover_inner_colour,cover_point_size); }

        // --------------------------------------------------------
        // ---- create points for shape

        /**
         * dimensions in model space within a unit cube
         */
        const book = {
            cover: {
                width: 0.8,
                height: 2.0,
                thickness: 0.1,
                // how much to lift the cover from spine center
                spine_lift: 0.1,
            },
            page: {
                width: 0.7,
                height: 1.8,
                // ---- page lift ----
                // how much to lift the middle page from the spine lift
                center_lift: 0.07,
                // ---- page thicknesses ----
                thickness_left: 0.3,
                thickness_center: 0.1,
                thickness_right: 0.3,
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

            // TODO: make pages

        ];

        // --------------------------------------------------------
        // ---- make cover face

        let cover_outer_face_from_indices = (first,second,third)=>{ cover_outer_face(shape_points[first], shape_points[second], shape_points[third]); };
        let cover_inner_face_from_indices = (first,second,third)=>{ cover_inner_face(shape_points[first], shape_points[second], shape_points[third]); };
        let paper_face_from_indices = (first,second,third)=>{ paper_face(shape_points[first], shape_points[second], shape_points[third]); };

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
            if(clockwise_face_winding){
                cover_outer_face_from_indices( first, second, third);
                cover_outer_face_from_indices( first, third, fourth);
            }
            else {
                cover_outer_face_from_indices( first, third, second);
                cover_outer_face_from_indices( first, fourth, third);
            }
        }
        /**
         * given 4 indices that make a quad, going around clockwise from a point on the quad,
         * constructs two faces based on currently used winding order
         * 
         * [same as for outer but making an inner faces]
         * @param {*} clockwise_face_winding if the winding order of faces is clockwise 
         * @param {*} first 
         * @param {*} second 
         * @param {*} third 
         * @param {*} fourth 
         */
        let cover_inner_quad = (clockwise_face_winding,first,second,third,fourth)=>{
            if(clockwise_face_winding){
                cover_inner_face_from_indices( first, second, third);
                cover_inner_face_from_indices( first, third, fourth);
            }
            else {
                cover_inner_face_from_indices( first, third, second);
                cover_inner_face_from_indices( first, fourth, third);
            }
        }
        /**
         * given 4 indices that make a quad, going around clockwise from a point on the quad,
         * constructs two faces based on currently used winding order
         * 
         * [same as cover but for paper faces]
         * @param {*} clockwise_face_winding if the winding order of faces is clockwise 
         * @param {*} first 
         * @param {*} second 
         * @param {*} third 
         * @param {*} fourth 
         */
        let paper_quad = (clockwise_face_winding,first,second,third,fourth)=>{
            if(clockwise_face_winding){
                paper_face_from_indices( first, second, third);
                paper_face_from_indices( first, third, fourth);
            }
            else {
                paper_face_from_indices( first, third, second);
                paper_face_from_indices( first, fourth, third);
            }
        }

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

        // TODO: do this

        // --------------------------------------------------------
        
        // --------------------------------------------------------
        // ---- finished, give it back
        return shape_data;
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}