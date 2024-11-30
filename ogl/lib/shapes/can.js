import { Shape_Factory_Scene_Object } from "/ogl/core/scene_objects/shape_factory_scene_object.js";
import { VERTEX_SHADER_SRC as textured_vertex_source } from "/ogl/lib/shaders/textured_sized_diffuse_vertex_shader.js"
import { FRAGMENT_SHADER_SRC as textured_fragment_source } from "/ogl/lib/shaders/textured_sized_diffuse_fragment_shader.js"
import { Textured_Shape_Factory } from "/ogl/core/util/textured_shape_factory.js";

export class Can extends Shape_Factory_Scene_Object {
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
            vertex_source:      textured_vertex_source,
            fragment_source:    textured_fragment_source,
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
     * overriden in derived classes
     */
    prepare_shape(){
        return Can.prepare_shape_mesh();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    /**
     * overriding super function
     * 
     * so we dont need to import shape factory on derived classes
     * @returns 
     */
    static make_shape_factory(){
        return new Textured_Shape_Factory();
    }
    /**
     * overriding super function
     * 
     * @returns 
     */
    static prepare_shape_mesh(){
        // --------------------------------------------------------
        // ---- prepare shape factory

        let shape_factory = Can.make_shape_factory();

        // --------------------------------------------------------
        // ---- prepare settings

        const clockwise_winding = false;

        const crate_colour = {r:160.0/255.0, g:82.0/255.0, b:45.0/255.0, a:1.0};
        const crate_point_size = 4.0;

        // --------------------------------------------------------
        // ---- prepare helper
        let add_quad = ( first_index, second_index, third_index, fourth_index )=>{
            shape_factory.add_quad_with_colour_size(
                shape_points[first_index], shape_points[second_index],
                shape_points[third_index], shape_points[fourth_index],
                crate_colour, crate_point_size, clockwise_winding
            );
        }

        // --------------------------------------------------------
        // ---- prepare points


        /**
         *         [2]------[6]
         *        / |      / |             
         *      /   |    /   |             
         *   [3]------[7]    |               
         *    |    [1]-|----[5]                  
         *    |   /    |   /                 
         *    | /      | /                 
         *   [0]------[4]                       
         * 
         */


        // left handed if z comes out of screen
        let shape_points = [
            // left side
            { x:  1.00, y: -1.00, z:  1.00 }, // 0
            { x:  1.00, y: -1.00, z: -1.00 }, // 1
            { x:  1.00, y:  1.00, z: -1.00 }, // 2
            { x:  1.00, y:  1.00, z:  1.00 }, // 3
            // right side
            { x: -1.00, y: -1.00, z:  1.00 }, // 4
            { x: -1.00, y: -1.00, z: -1.00 }, // 5
            { x: -1.00, y:  1.00, z: -1.00 }, // 6
            { x: -1.00, y:  1.00, z:  1.00 }, // 7
        ];

        // --------------------------------------------------------
        // ---- make shape

        // bottom
        add_quad(5,1,0,4);
        // left
        add_quad(0,1,2,3);
        // back
        add_quad(1,5,6,2);
        // right
        add_quad(5,4,7,6);
        // front
        add_quad(4,0,3,7);
        // top
        add_quad(7,3,2,6);
        
        // --------------------------------------------------------
        // ---- finished, give it back
        return shape_factory.shape_data;
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}