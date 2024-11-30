import { Shape_Factory_Scene_Object } from "/ogl/core/scene_objects/shape_factory_scene_object.js";

export class Turbofan extends Shape_Factory_Scene_Object {
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
        this.rotation_vec = vec3.fromValues( 0.0, 0.0, Math.PI/2.0 );
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
        return Turbofan.prepare_shape_mesh();
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

        let model_radius_factor = 0.75; 

        let lathe_data = {
            // front cone tip
            first_point: { radius: 0.0,  position_z:  0.87, colour: {r:0.1, g:0.1, b:0.5, a: 1.0} },
            // rear tip
            last_point: { radius: 0.0,  position_z: -1.0,  colour: {r:1.0, g:0.4, b:0.2, a: 1.0} },
            // the others
            body_points: [
                // front cone base
                { radius: 0.28, position_z:  0.7,  colour: {r:0.15, g:0.15, b:0.15, a: 1.0} },
                // end of blades
                { radius: 0.58, position_z:  0.7,  colour: {r:0.3, g:0.3, b:0.3, a: 1.0} },
                // front of shell
                { radius: 0.67, position_z:  1.0,  colour: {r:0.7, g:0.7, b:0.7, a: 1.0} },
                // widest part
                { radius: 0.73, position_z:  0.48, colour: {r:0.8, g:0.8, b:0.8, a: 1.0} },
                // past blades
                { radius: 0.7,  position_z: -0.17, colour: {r:0.78, g:0.78, b:0.78, a: 1.0} },
                // end of shell
                { radius: 0.6,  position_z: -0.62, colour: {r:0.72, g:0.72, b:0.72, a: 1.0} },
                // outer rear exhaust
                { radius: 0.62, position_z: -0.4,  colour: {r:0.05, g:0.05, b:0.05, a: 1.0} },
                { radius: 0.39, position_z: -0.86, colour: {r:0.5, g:0.2, b:0.52, a: 1.0} },
                // rear inner exhaust
                { radius: 0.52, position_z: -0.6,  colour: {r:1.0, g:0.9, b:0.8, a: 1.0} },
            ],
        };


        // --------------------------------------------------------
        // ---- prepare settings

        const clockwise_winding = false;
        
        const general_point_size = 4.0;


        // --------------------------------------------------------
        // ---- prepare point data

        const sqrt_of_3 = 1.73205080757;

        // points on a circle
        // normally we'd do these using "x: cos(angle), y: sin(angle)"
        //  but the unit circle points are fine
        let unit_circle = [
            { x: 1.0,              y: 0.0             },
            { x: sqrt_of_3/2.0,    y: 0.5             },
            { x: 0.5,              y: sqrt_of_3/2.0   },
            { x: 0.0,              y: 1.0             },
            { x: -0.5,             y: sqrt_of_3/2.0   },
            { x: -sqrt_of_3/2.0,   y: 0.5             },
            { x: -1.0,             y: 0.0             },
            { x: -sqrt_of_3/2.0,   y: -0.5            },
            { x: -0.5,             y: -sqrt_of_3/2.0  },
            { x: 0.0,              y: -1.0            },
            { x: 0.5,              y: -sqrt_of_3/2.0  },
            { x: sqrt_of_3/2.0,    y: -0.5            },
        ];
        // --------------------------------------------------------
        // ---- prepare point helpers

        /**
         * @param {*} point_on_circle given a point on the circle
         * @param {*} body_points_data corresponding body points data
         * @returns data prepared for the `Textured_Shape_Factory`
         */
        let point_data = (point_on_circle, body_points_data)=>{
            let data = {
                position: {
                    x: model_radius_factor * body_points_data.radius * point_on_circle.x,
                    y: body_points_data.position_z,
                    z: model_radius_factor * body_points_data.radius * point_on_circle.y,
                    w: 1.0
                },
                colour: body_points_data.colour,
                size: general_point_size,
            };
            return data;
        };

        // --------------------------------------------------------
        // ---- prepare point helpers

        const unit_circle_center = { x: 0.0, y: 0.0 };
        const top_center_data = point_data(unit_circle_center, lathe_data.first_point);
        const bottom_center_data = point_data(unit_circle_center, lathe_data.last_point);


        // --------------------------------------------------------
        // ---- prepare triangle/quad helpers

        /**
         * given unwrapped indices
         * @param {*} index_first 
         * @param {*} index_next 
         */
        let top_triangle = (index_first, index_next)=>{
            let first_data = point_data( unit_circle[index_first%unit_circle.length], lathe_data.body_points[0] );
            let next_data  = point_data( unit_circle[index_next%unit_circle.length], lathe_data.body_points[0] );
            shape_factory.add_triangle_with_data( first_data, top_center_data, next_data );
        }
        /**
         * given unwrapped indices
         * @param {*} index_first 
         * @param {*} index_next 
         */
        let bottom_triangle = (index_first, index_next)=>{
            let first_data = point_data( unit_circle[index_first%unit_circle.length], lathe_data.body_points[lathe_data.body_points.length-1] );
            let next_data  = point_data( unit_circle[index_next%unit_circle.length], lathe_data.body_points[lathe_data.body_points.length-1] );
            shape_factory.add_triangle_with_data( next_data, bottom_center_data, first_data );
        }

        /**
         * given indices of a unit circle
         * using overflowing indices so that the point data maker will handle the wrapping / percentage
         * @param {*} first_index 
         * @param {*} next_index 
         * @param {*} top_body_data lathe data for top points
         * @param {*} bottom_body_data lathe data for bottom points
         */
        let side_quad = (first_index, next_index, top_body_data, bottom_body_data)=>{
            let top_first_data = point_data( unit_circle[first_index%unit_circle.length], top_body_data );
            let top_next_data = point_data( unit_circle[next_index%unit_circle.length], top_body_data );
            let bottom_first_data = point_data( unit_circle[first_index%unit_circle.length], bottom_body_data );
            let bottom_next_data = point_data( unit_circle[next_index%unit_circle.length], bottom_body_data );
            shape_factory.add_quad_with_data( bottom_first_data, top_first_data, top_next_data, bottom_next_data );
        }

        // --------------------------------------------------------
        // ---- make shape

        // all points in unit circle
        for (let point_index = 0; point_index < unit_circle.length; point_index++) {
            // this would normally cause index out of bounds
            //  but our helper methods handle the wrapping by using modulo
            const next_point_index_unwrapped = point_index + 1;
            
            // add the top triangle
            top_triangle(point_index, next_point_index_unwrapped);
            // ======================================
            // add side quads
            //  each plate reaches for next data, so dont need to do the last row since
            //      that's handled by bottom_triangle
            for (let plate_index = 0; plate_index < lathe_data.body_points.length-1; plate_index++) {
                const top_plate_data = lathe_data.body_points[plate_index];
                const bottom_plate_data = lathe_data.body_points[plate_index+1];
                
                side_quad(point_index, next_point_index_unwrapped, top_plate_data, bottom_plate_data );
            }
            // ======================================
            // add the bottom triangle
            bottom_triangle(point_index, next_point_index_unwrapped);
        }

        
        // --------------------------------------------------------
        // ---- finished, give it back
        return shape_factory.shape_data;
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}