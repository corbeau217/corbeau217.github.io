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

        let get_side_corners_vec3 = (side_index)=>{
            const point_index_list = side_indices[side_index];
            return [
                cube_points_vec3[point_index_list[0]],
                cube_points_vec3[point_index_list[1]],
                cube_points_vec3[point_index_list[2]],
                cube_points_vec3[point_index_list[3]],
            ];
        };

        // --------------------------------------------------------
        // ---- prepare difference vector helpers

        let side_difference_vec_i = (side_corners)=>{
            let result_vec = vec3.create();
            return vec3.subtract(result_vec, side_corners[0], side_corners[3]);
        };
        let side_difference_vec_j = (side_corners)=>{
            let result_vec = vec3.create();
            return vec3.subtract(result_vec, side_corners[0], side_corners[1]);
        };

        // --------------------------------------------------------
        // ---- prepare subdividing helpers

        /**
         * sub dividing the cube
         * @param {*} side_points_vec3_list side points of the quad
         * @returns 
         */
        let gather_points_for_side = (side_points_vec3_list)=>{
            const bottom_left = side_points_vec3_list[0];
            const top_left = side_points_vec3_list[1];
            const top_right = side_points_vec3_list[2];
            const bottom_right = side_points_vec3_list[3];

            const difference_vectors = {
                i: side_difference_vec_i(side_points_vec3_list),
                j: side_difference_vec_j(side_points_vec3_list),
            };

            /** add 2 to account for the corners */
            let axis_subdivisions = {
                i: subdivisions + 2,
                j: subdivisions + 2,
            };

            let result_vec_list = [];

            for (let i_index = 0; i_index < axis_subdivisions.i; i_index++) {
                const i_percentage = i_index / (axis_subdivisions.i - 1.0);
                for (let j_index = 0; j_index < axis_subdivisions.j; j_index++) {
                    const j_percentage = j_index / (axis_subdivisions.j - 1.0);

                    // init
                    let current_i = vec3.create();
                    let current_j = vec3.create();
                    let current_vec = vec3.create();

                    // scale the vectors by the percentage of that axis we've moved
                    vec3.scale(current_i, difference_vectors.i, i_percentage);
                    vec3.scale(current_j, difference_vectors.j, j_percentage);

                    // add together
                    vec3.add(current_vec, current_i, current_j);
                    vec3.add(current_vec, current_vec, bottom_left);

                    // send to list
                    result_vec_list.push(current_vec);
                }
                
            }

            return result_vec_list;
        };

        // --------------------------------------------------------
        // ---- prepare spherical functions

        /**
         * clones all the vectors as normalized
         * @param {*} vec3_list 
         */
        let normalize_all_vec3s = (vec3_list)=>{
            let result_vec_list = [];
            vec3_list.forEach( current_vec =>{
                let new_vec = vec3.create();
                vec3.normalize(new_vec, current_vec);
                result_vec_list.push( new_vec );
            } );
        };

        // --------------------------------------------------------
        // ---- prepare quad point grab

        /**
         * retrieves the vertices from the list of subdivided points
         * @param {*} side_subdivision_point_list list of vertices
         * @param {*} i_index the quad index along i axis for this side 
         * @param {*} j_index the quad index along j axis for this side 
         * @returns clockwise starting bottom left
         */
        let get_points_of_subdivision_quad = (side_subdivision_point_list, i_index, j_index)=>{
            // assume good indices, edges/quads are 1 less than the number of vertices
            const vertex_count_on_axis = 2+subdivisions;
            // prepare the indices
            const bottom_left_index = i_index*vertex_count_on_axis + j_index;
            const top_left_index = i_index*vertex_count_on_axis + (j_index + 1);
            const bottom_right_index = (i_index+1)*vertex_count_on_axis + j_index;
            const top_right_index = (i_index+1)*vertex_count_on_axis + (j_index + 1);
            // clockwise starting bottom left
            return [
                side_subdivision_point_list[bottom_left_index],
                side_subdivision_point_list[top_left_index],
                side_subdivision_point_list[top_right_index],
                side_subdivision_point_list[bottom_right_index],
            ];
        };

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