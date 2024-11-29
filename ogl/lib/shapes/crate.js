import { Shape_Factory_Scene_Object } from "/ogl/core/scene_objects/shape_factory_scene_object.js";

export class Crate extends Shape_Factory_Scene_Object {
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
        return Crate.prepare_shape_mesh();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    /**
     * overriding super function
     * 
     * @returns 
     */
    static prepare_shape_mesh(){
        // --------------------------------------------------------
        // ---- prepare shape factory

        let shape_factory = super.make_shape_factory();

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