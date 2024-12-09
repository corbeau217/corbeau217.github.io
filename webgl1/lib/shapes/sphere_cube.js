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
        
        let side_indices = [
            // clockwise
            [ 3, 2, 6, 7, ], // top
            [ 0, 3, 7, 4, ], // front
            [ 4, 7, 6, 5, ], // right
            [ 5, 6, 2, 1, ], // back
            [ 1, 2, 3, 0, ], // left
            [ 1, 0, 4, 5, ], // bottom
        ];

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
        const subdivisions = 5;
        
        /**
         * collection of the cube points as vec3 values
         */
        let cube_points_vec3 = [];
        cube_point_information.forEach(point_info=>{
            cube_points_vec3.push( vec3.fromValues(point_info.x, point_info.y, point_info.z) );
        });

        // --------------------------------------------------------
        // ---- prepare point helpers

        /**
         * convert vec3 to point data for our shape factory
         * @param {*} vec3_input 
         * @returns 
         */
        let vec3_as_point_data = (vec3_input)=>{
            return {
                position: {
                    x: vec3_input[0],
                    y: vec3_input[1],
                    z: vec3_input[2],
                    w: 1.0
                },
                colour: general_point_colour,
                size: general_point_size,
            };
        };

        /**
         * convert vec3 list to point data list
         * @param {*} vec3_list 
         * @returns 
         */
        let vec3_list_as_point_data_list = (vec3_list)=>{
            let result_list = [];

            for (let index = 0; index < vec3_list.length; index++) {
                const current_vec3 = vec3_list[index];
                result_list.push( vec3_as_point_data(current_vec3) );
            }

            return result_list;
        }

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
        let get_list_of_side_corner_lists_vec3 = ()=>{
            let result_list = [];

            for (let side_index = 0; side_index < 6; side_index++) {
                const current_side_corners = get_side_corners_vec3(side_index);
                result_list.push(current_side_corners);
            }

            return result_list;
        }

        // --------------------------------------------------------
        // ---- prepare difference vector helpers

        let side_difference_vec_i = (side_corners)=>{
            let result_vec = vec3.create();
            return vec3.subtract(result_vec, side_corners[3], side_corners[0]);
        };
        let side_difference_vec_j = (side_corners)=>{
            let result_vec = vec3.create();
            return vec3.subtract(result_vec, side_corners[1], side_corners[0]);
        };

        // --------------------------------------------------------
        // ---- prepare subdividing helpers

        /**
         * sub dividing the cube
         * @param {*} side_points_vec3_list side points of the quad
         * @returns 
         */
        let subdivide_points_for_side = (side_points_vec3_list)=>{
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

        /**
         * does subdivision for a side
         * @param {*} list_of_side_points_vec3_lists 
         */
        let get_all_sides_as_subdivided = (list_of_side_points_vec3_lists)=>{
            let result_list = [];
            for (let index = 0; index < list_of_side_points_vec3_lists.length; index++) {
                const current_side_points = list_of_side_points_vec3_lists[index];

                result_list.push( subdivide_points_for_side(current_side_points) );
            }
            return result_list;
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
            return result_vec_list;
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

        /**
         * making the faces for all the subdivisions
         * TODO: do as checker board?
         * @param {*} side_point_data 
         */
        let add_side_quads_to_shape = (side_point_data)=>{
            // not +2 because it's one less than the vertex count
            const axis_quad_count = subdivisions + 1;

            for (let quad_i_index = 0; quad_i_index < axis_quad_count; quad_i_index++) {
                for (let quad_j_index = 0; quad_j_index < axis_quad_count; quad_j_index++) {
                    const quad_points = get_points_of_subdivision_quad(side_point_data, quad_i_index, quad_j_index);

                    // // apparently this has it inside out
                    // shape_factory.add_quad_with_data( quad_points[0], quad_points[1], quad_points[2], quad_points[3] );
                    
                    // honestly just flip the order so it works for now
                    shape_factory.add_quad_with_data( quad_points[3], quad_points[2], quad_points[1], quad_points[0] );
                }
            }
        };

        // --------------------------------------------------------
        // ---- make shape

        // prepare side corner groups
        const side_corner_list_of_lists = get_list_of_side_corner_lists_vec3();

        // subdivide all our sides
        const list_of_subdivided_side_lists = get_all_sides_as_subdivided(side_corner_list_of_lists);

        // for all sides
        for (let side_index = 0; side_index < list_of_subdivided_side_lists.length; side_index++) {
            // our vec3s to use
            const current_side_vec3_list = list_of_subdivided_side_lists[side_index];
            // normalize them so it's spherical (dont do this if you wanna stay as a cube);
            const normalized_current_side_vec3_list = normalize_all_vec3s(current_side_vec3_list);
            // convert to point data that shape factory expects
            const current_side_point_data = vec3_list_as_point_data_list(normalized_current_side_vec3_list);

            // add to shape
            add_side_quads_to_shape(current_side_point_data);
        }
        
        // --------------------------------------------------------
        // ---- finished, give it back
        return shape_factory.shape_data;
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}