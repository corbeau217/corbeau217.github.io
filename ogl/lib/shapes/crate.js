import { Textured_Shape_Factory_Scene_Object } from "/ogl/core/scene_objects/textured_shape_factory_scene_object.js";

export class Crate extends Textured_Shape_Factory_Scene_Object {
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

        const clockwise_winding = true;

        const crate_colour = {r:160.0/255.0, g:82.0/255.0, b:45.0/255.0, a:1.0};
        const crate_point_size = 4.0;

        // --------------------------------------------------------
        // ---- prepare helpers

        /**
         * order is:
         * 1. (`quad_mappings[0]`) -> bottom left
         * 2. (`quad_mappings[1]`) -> top    left
         * 3. (`quad_mappings[2]`) -> top    right
         * 4. (`quad_mappings[3]`) -> bottom right
         * @param {*} point_index index of the point
         * @param {*} uv_index index of the uv mapping 
         * @returns data prepared for the `Textured_Shape_Factory`
         */
        let point_data = (point_index,uv_index)=>{
            return {
                position: shape_points[point_index],
                colour: crate_colour,
                size: crate_point_size,
                uv_mapping: quad_mappings[uv_index],
            };
        };

        /**
         * 
         * order is:
         * 1. bottom left
         * 2. top    left
         * 3. top    right
         * 4. bottom right
         * @param {*} first_index 
         * @param {*} second_index 
         * @param {*} third_index 
         * @param {*} fourth_index 
         */
        let add_quad = ( first_index, second_index, third_index, fourth_index )=>{
            shape_factory.add_quad_with_data(
                point_data(first_index,0), point_data(second_index,1),
                point_data(third_index,2), point_data(fourth_index,3), clockwise_winding
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


        // // left handed if z comes out of screen
        // let shape_points = [
        //     // left side
        //     { x:  1.00, y: -1.00, z:  1.00 }, // 0
        //     { x:  1.00, y: -1.00, z: -1.00 }, // 1
        //     { x:  1.00, y:  1.00, z: -1.00 }, // 2
        //     { x:  1.00, y:  1.00, z:  1.00 }, // 3
        //     // right side
        //     { x: -1.00, y: -1.00, z:  1.00 }, // 4
        //     { x: -1.00, y: -1.00, z: -1.00 }, // 5
        //     { x: -1.00, y:  1.00, z: -1.00 }, // 6
        //     { x: -1.00, y:  1.00, z:  1.00 }, // 7
        // ];
        // right handed if z goes in to screen
        let shape_points = [
            // left side
            { x:  1.00, y: -1.00, z: -1.00 }, // 0
            { x:  1.00, y: -1.00, z:  1.00 }, // 1
            { x:  1.00, y:  1.00, z:  1.00 }, // 2
            { x:  1.00, y:  1.00, z: -1.00 }, // 3
            // right side
            { x: -1.00, y: -1.00, z: -1.00 }, // 4
            { x: -1.00, y: -1.00, z:  1.00 }, // 5
            { x: -1.00, y:  1.00, z:  1.00 }, // 6
            { x: -1.00, y:  1.00, z: -1.00 }, // 7
        ];
        /**
         * order is:
         * 1. (`quad_mappings[0]`) -> bottom left
         * 2. (`quad_mappings[1]`) -> top    left
         * 3. (`quad_mappings[2]`) -> top    right
         * 4. (`quad_mappings[3]`) -> bottom right
         */
        let quad_mappings = [
            { u: 0.0, v: 0.0 }, // 0 - bottom left
            { u: 0.0, v: 1.0 }, // 1 - top    left
            { u: 1.0, v: 1.0 }, // 2 - top    right
            { u: 1.0, v: 0.0 }, // 3 - bottom right
        ];

        // --------------------------------------------------------
        // ---- make shape

        // bottom
        add_quad(4,5,1,0);
        // left
        add_quad(1,2,3,0);
        // back
        add_quad(5,6,2,1);
        // right
        add_quad(4,7,6,5);
        // front
        add_quad(0,3,7,4);
        // top
        add_quad(3,2,6,7);
        
        // --------------------------------------------------------
        // ---- finished, give it back
        return shape_factory.shape_data;
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}