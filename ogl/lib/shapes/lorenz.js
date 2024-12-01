import { Drawable_Scene_Object } from "/ogl/core/scene_objects/drawable_scene_object.js";
// import { VERTEX_SHADER_SRC as sized_vertex_source } from "/ogl/lib/shaders/sized_wireframe_vertex_shader.js"
import { FRAGMENT_SHADER_SRC as sized_fragment_source } from "/ogl/lib/shaders/sized_wireframe_fragment_shader.js";
import { Vertex_Shader_Builder } from "/ogl/core/util/vertex_shader_builder.js";

export class Lorenz extends Drawable_Scene_Object {

    constructor( gl_context, lorenz_settings ){
        super(gl_context); // normally make the object

        // stash the settings if given
        this.lorenz_settings = lorenz_settings;
    }


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
     * 
     * @param {*} time_scale [dt] - [delta time] inverse time value
     * @param {*} points [n] - number of points
     * @param {*} prandtl [σ] - [sigma] - [prandtl number](https://en.wikipedia.org/wiki/Prandtl_number)
     * @param {*} rayleigh [ρ] - [rho] - [scaled rayleigh number](https://en.wikipedia.org/wiki/Rayleigh_number)
     * @param {*} aspect [β] - [beta] - [geometry aspect ratio](https://en.wikipedia.org/wiki/Aspect_ratio)
     * @returns 
     */
    static lorenz_settings_from( time_scale, points, prandtl, rayleigh, aspect ){
        return {
            time_step: 1.0/time_scale,
            number_of_points: points,
       
            sigma: prandtl,
            rho: rayleigh,
            beta: aspect,

            point_size_origin: 10.0,
            point_size: 2.0,
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

        const half_sqrt_2 = 0.70710678118;
        const half_sqrt_3 = 0.86602540378;

        const sqrt_2  = 1.41421356237;
        const half_pi = 1.57079632679;
        const sqrt_3  = 1.73205080757;
        const sqrt_pi = 1.772453851;
        const sqrt_7  = 2.64575131106;
        
        const pi = 3.141592654;

        const tau = pi*2.0;


        // when not given them, make our own
        if(this.lorenz_settings==undefined){
            // dt -> 54
            // n  -> 500
            // sigma -> 11
            // rho   -> 17
            // beta  -> 11.0/3.0
            this.lorenz_settings = Lorenz.lorenz_settings_from( 53, 500, 11.0, 17, 11.0/3.0 );
        }

        
        this.translation_vec = vec3.fromValues( 0, 0, 0 );
        this.rotation_vec = vec3.fromValues( -half_pi, 0.0, 0.0 );
        this.scale_vec = vec3.fromValues( 0.1, 0.1, 0.1 );

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
        // prepare the data to use
        this.lorenz_point_data = Lorenz.get_lorenz_points(this.lorenz_settings);


        if(this.verbose_logging){
            console.log(`--- lorenz data ---`);
            console.log(`point_count: ${this.lorenz_point_data.point_count}`);
            console.log(`points: ${this.lorenz_point_data.point_list.length}`);
        }

        // gather it
        this.lorenz_mesh = Lorenz.get_mesh_data_from_lorenz_data( this.lorenz_point_data );

        if(this.verbose_logging){
            console.log(`--- lorenz data ---`);
            console.log(`vertex_count: ${this.lorenz_mesh.vertex_count} -- vertex values: ${this.lorenz_mesh.vertex_positions.length}`);
            console.log(`edge_count: ${this.lorenz_mesh.edge_count} -- binding values: ${this.lorenz_mesh.vertex_bindings.length}`);
            console.log(`colour_count: ${this.lorenz_mesh.colour_count} -- binding values: ${this.lorenz_mesh.vertex_colours.length}`);
        }

        // --------------------------------------------------------
        this.vertex_positions = this.lorenz_mesh.vertex_positions;
        // --------------------------------------------------------
        this.vertex_bindings = this.lorenz_mesh.vertex_bindings;
        // --------------------------------------------------------
        this.vertex_colours = this.lorenz_mesh.vertex_colours;
        // --------------------------------------------------------
        this.vertex_sizes = this.lorenz_mesh.vertex_sizes;
        // --------------------------------------------------------
        this.vertex_normals = [];
        // --------------------------------------------------------
        this.mesh_data = {
            vertices: this.lorenz_mesh.vertex_count,
            edges: this.lorenz_mesh.edge_count,
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
        super.update_uniform_data();
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
        this.gl_context.drawElements(this.gl_context.POINT,     this.mesh_data.vertices,  this.gl_context.UNSIGNED_SHORT, 0);
        // finish with drawing in our context
        this.managed_shader.disable_attributes();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * hot from the press of [wikipedia](https://en.wikipedia.org/wiki/Lorenz_system#Python_simulation)
     * 
     * another useful is [this paper](https://web.math.ucsb.edu/~jhateley/paper/lorenz.pdf)
     * 
     * @param {*} point 
     * @param {*} sigma prandtl number
     * @param {*} rho scaled rayleigh number 
     * @param {*} beta geometry aspect ratio
     * @returns 
     */
    static get_lorenz_point(point, sigma,rho,beta){

        // why dot????
        let x_dot = (sigma*(point.y - point.x));
        let y_dot = (rho*point.x) - (point.y) - (point.x*point.z);
        let z_dot = (point.x*point.y) - (beta*point.z);

        return { x: x_dot, y: y_dot, z:z_dot };
    }

    /**
     * handles creating our lorenz attractor points
     * @param {*} lorenz_settings settings made in initialisation
     * @returns 
     */
    static get_lorenz_points(lorenz_settings){
        // --------------------------------------------------------

        let lorenz_data = {
            point_count: 0,
            point_list: [],

            // for use in mesh making
            point_size_origin: lorenz_settings.point_size_origin,
            point_size: lorenz_settings.point_size,
        };


        // --------------------------------------------------------

        // to simplify our lines
        let add_point = (point_data) => {
            lorenz_data.point_list.push(point_data);
            lorenz_data.point_count += 1;
        };

        // --------------------------------------------------------

        // make initial point
        add_point({x: 0.0, y: 1.0, z: 1.05 });

        // loop for all points we want
        for (let point_index = 0; point_index < lorenz_settings.number_of_points; point_index++) {

            // current point to work on, first iteration uses that intial point we made
            let current_point = lorenz_data.point_list[point_index];

            // gather the lorenz value for current point
            let lorenz_of_current = Lorenz.get_lorenz_point( current_point, lorenz_settings.sigma, lorenz_settings.rho, lorenz_settings.beta );
            
            // scale by time interval
            let time_scaled_lorenz = {
                x: lorenz_of_current.x * lorenz_settings.time_step,
                y: lorenz_of_current.y * lorenz_settings.time_step,
                z: lorenz_of_current.z * lorenz_settings.time_step,
            };

            // add the current including the scaled lorenz value
            add_point({
                x: current_point.x + time_scaled_lorenz.x,
                y: current_point.y + time_scaled_lorenz.y,
                z: current_point.z + time_scaled_lorenz.z,
            });
        }

        // --------------------------------------------------------
        return lorenz_data;
    }
    

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * converts our data into geometric data we can use
     * #### results in double the vertices as points we requested to handle our lines
     * @param {*} lorenz_data the lorenz data created by `get_lorenz_points`
     */
    static get_mesh_data_from_lorenz_data(lorenz_data){
        const colour_data_origin = {r: 0.5, g: 0.5, b: 0.5, a: 1.0};

        let colour_data_from_points = (first, second) =>{
            let first_vec = vec3.fromValues(first.x,first.y,first.z);
            let second_vec = vec3.fromValues(second.x,second.y,second.z);
            let diff_vec = vec3.create();
            // (static) subtract(out, a, b) → {vec3}
            // Subtracts vector b from vector a 
            vec3.subtract(diff_vec, second_vec, first_vec);
            vec3.normalize(diff_vec,diff_vec);
            // bring into 0.0-1.0 as colours
            let difference_vector = {
                x: (diff_vec[0]+1.0)/2.0,
                y: (diff_vec[1]+1.0)/2.0,
                z: (diff_vec[2]+1.0)/2.0,
            };

            return {r: difference_vector.x, g: difference_vector.y, b: difference_vector.z, a: 1.0};
        }
        // --------------------------------------------------------
        // --------------------------------------------------------
        // ------- prepare our mesh data structure

        //  (values are as float arrays ready for the shader)
        let mesh_data = {
            // ----------- attributes -----------
            // 4 floats per vertex
            vertex_positions: [],
            // 4 floats per vertex
            vertex_colours: [],
            // 2 ints per edge
            vertex_bindings: [],
            // 1 float per vertex
            vertex_sizes: [],
            
            // ----------- counts -----------
            vertex_count: 0,
            edge_count: 0,
            face_count: 0,

            // ----------- debugging counts -----------
            colour_count: 0,
            size_count: 0,
        };
        
        // --------------------------------------------------------
        // --------------------------------------------------------
        // ------- define some helper methods to use

        let add_vertex = (vertex_data) => {
            mesh_data.vertex_positions.push(vertex_data.x);
            mesh_data.vertex_positions.push(vertex_data.y);
            mesh_data.vertex_positions.push(vertex_data.z);
            mesh_data.vertex_positions.push(1.0);
            mesh_data.vertex_count += 1;
        };

        let add_colour = (colour_data) => {
            mesh_data.vertex_colours.push(colour_data.r);
            mesh_data.vertex_colours.push(colour_data.g);
            mesh_data.vertex_colours.push(colour_data.b);
            mesh_data.vertex_colours.push(colour_data.a);
            mesh_data.colour_count += 1;
        }

        let add_size = (size_val) => {
            mesh_data.vertex_sizes.push(size_val);
            mesh_data.size_count += 1;
        };

        let add_edge_binding = (start_index, stop_index) => {
            mesh_data.vertex_bindings.push(start_index);
            mesh_data.vertex_bindings.push(stop_index);
            mesh_data.edge_count += 1;
        };
        

        // --------------------------------------------------------
        // --------------------------------------------------------
        // ------- and a helper for making a point in the system


        let prepare_edge = (first_data_index, first_colour, first_size, second_data_index, second_colour, second_size) => {
            // save the current count of vertices
            let adding_to_index = mesh_data.vertex_count;

            // ------ first ------
            add_vertex(lorenz_data.point_list[first_data_index]);
            add_colour(first_colour);
            add_size(first_size);

            // ------ second ------
            add_vertex(lorenz_data.point_list[second_data_index]);
            add_colour(second_colour);
            add_size(second_size);
            
            add_edge_binding( adding_to_index, adding_to_index+1);
        };
        // --------------------------------------------------------
        // --------------------------------------------------------

        // prepare the first point information as an edge that binds to itself
        //  to allow for a larger point size

        prepare_edge(
            0, colour_data_origin, lorenz_data.point_size_origin,
            0, colour_data_origin, 0.0
        );
        
        // --------------------------------------------------------
        // --------------------------------------------------------
        // ------- construct mesh data from point information


        // using the rule:
        // |V| = |E| + 1
        // means that we dont need to make an edge from the last vertex to anything
        //  and since chaos theory is that there's no loop, there's no point
        //  returning to the start, so start with 1, and just go till `i < point_count`
        for (let i = 0; i < lorenz_data.point_count-1; i++) {
            const current_point_data = lorenz_data.point_list[i];
            const next_point_data = lorenz_data.point_list[i+1];
            // directional colouring
            const vector_direction_colour = colour_data_from_points(current_point_data, next_point_data);
            
            // now defer for preparing the edge
            prepare_edge(
                i, vector_direction_colour, lorenz_data.point_size,
                i+1, vector_direction_colour, 0.0
            );
            
        }
        
        // --------------------------------------------------------
        // --------------------------------------------------------

        // cave johnson, we're done here
        return mesh_data;

        // --------------------------------------------------------
        // --------------------------------------------------------
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}