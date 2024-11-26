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
        // ---- construct the shape

        // TODO: use the add_face_with_colour_size instead
        // let cover_outer_point = (pos)=>{ add_pos_colour_size( pos, cover_outer_colour, cover_point_size ); };
        // let cover_inner_point = (pos)=>{ add_pos_colour_size( pos, cover_inner_colour, cover_point_size ); };
        // let paper_inner_point = (pos)=>{ add_pos_colour_size( pos, cover_inner_colour, cover_point_size ); };

        // // TODO : construct the shape
        // // cover_outer_point( {x: 0.00, y: 0.00, z: 0.00} );

        // --------------------------------------------------------
        // ---- bind the faces

        // TODO: bind the faces

        // --------------------------------------------------------
        // ---- make the normal vectors

        // TODO: bind the faces

        // --------------------------------------------------------
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}