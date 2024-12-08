import { Shape_Factory_Scene_Object } from "/ext/webgl_1_core/src/scene_objects/shape_factory_scene_object.js";

export class Sphere_Cube extends Shape_Factory_Scene_Object {
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


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    /**
     * overriden in derived classes
     */
    prepare_shape(){
        return Sphere_Cube.prepare_shape_mesh();
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
        // ---- prepare lathe data

        let model_radius_factor = 1.0; 

        // --------------------------------------------------------
        // ---- prepare settings

        const clockwise_winding = false;
        
        const general_point_size = 4.0;
        const general_point_colour = {r: 0.8, g: 0.8, b: 0.8, a: 1.0};

        // --------------------------------------------------------
        // ---- prepare point data

        let cube_indices = { 
            left_bottom_front: 0,
            left_bottom_back: 1,
            left_top_back: 2,
            left_top_front: 3,
            right_bottom_front: 4,
            right_bottom_back: 5,
            right_top_back: 6,
            right_top_front: 7,
        };


        /**
         *                   @ ------ @                   @ ------ @ 
         *       [0] TOP   /########/ |       [1] FRONT / |      / | 
         *               /########/   |               /   |    /   | 
         *             @ ------ @     |             @ ------ @     | 
         *             |     @ -|---- @             |########|---- @ 
         *             |   /    |   /               |########|   /   
         *             | /      | /                 |########| /     
         *             @ ------ @                   @ ------ @       
         *                                                           
         *                   @ ------ @                   @ ------ @ 
         *      [2] RIGHT  / |      /#|       [3] BACK  / |######/#| 
         *               /   |    /###|               /   |####/###| 
         *             @ ------ @#####|             @ ------ @#####| 
         *             |     @ -|#####@             |     @ -|---- @ 
         *             |   /    |###/               |   /    |   /   
         *             | /      |#/                 | /      | /     
         *             @ ------ @                   @ ------ @       
         *                                                           
         *                   @ ------ @                   @ ------ @ 
         *       [4] LEFT  /#|      / |      [5] BOTTOM / |      / | 
         *               /###|    /   |               /   |    /   | 
         *             @ ------ @     |             @ ------ @     | 
         *             |#####@ -|---- @             |     @ -|---- @ 
         *             |###/    |   /               |   /####|###/   
         *             |#/      | /                 | /######|#/     
         *             @ ------ @                   @ ------ @       
         *                                                           
         */
        
        let side_indices = {
            top: [ 3, 2, 6, 7, ],
            front: [ 0, 3, 7, 4 ],
            right: [ 4, 7, 6, 5 ],
            back: [ 5, 6, 2, 1, ],
            left: [ 1, 2, 3, 0, ],
            bottom: [ 1, 0, 4, 5, ],
        };

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
        // let cube_point_information = [
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
        let cube_point_information = [
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
         * 0 - cube
         */
        const subdivisions = 0;
        

        // --------------------------------------------------------
        // ---- prepare point helpers

        /**
         * collection of the cube points as vec3 values
         */
        let cube_points_vec3 = [];
        cube_point_information.forEach(point_info=>{
            cube_points_vec3.push( vec3.fromValues(point_info.x, point_info.y, point_info.z) );
        });
        
        // --------------------------------------------------------
        // ---- prepare side point grabber helpers

        // TODO: grabs the corner points for a side of the cube
        

        // --------------------------------------------------------
        // ---- prepare point helpers

        // TODO: sub dividing the cube
        // TODO: normalizing the vec3 values so that the mesh is spherical

        // --------------------------------------------------------
        // ---- prepare triangle/quad helpers

        // TODO: making the faces for all the subdivisions
        // TODO: start with checkerboard

        // --------------------------------------------------------
        // ---- make shape

        // TODO: constructing the shape from the point information
        
        // --------------------------------------------------------
        // ---- finished, give it back
        return shape_factory.shape_data;
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}