import { Textured_Shape_Factory_Scene_Object } from "/ext/webgl_1_core/src/scene_objects/textured_shape_factory_scene_object.js";

export class Can extends Textured_Shape_Factory_Scene_Object {
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
     * ### OVERRIDE OF SUPER FUNCTION
     * 
     * this is use by derived classes to call `this.add_texture_source(source_of_texture)`
     */
    announce_texture_paths(){
        super.announce_texture_paths();

        this.add_texture_source("/img/textures/can.png");
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


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
     * @returns 
     */
    static prepare_shape_mesh(){
        // --------------------------------------------------------
        // ---- prepare shape factory

        let shape_factory = super.make_shape_factory();

        // --------------------------------------------------------
        // ---- prepare settings

        const clockwise_winding = true;
        
        const can_default_colour = { r:160.0/255.0, g:82.0/255.0, b:45.0/255.0, a:1.0 };
        const can_point_size = 4.0;

        const model_data = {
            scale: {
                x: 0.667,
                y: 0.667,
            },
            top: {
                y: 1.0,
            },
            bottom: {
                y: -1.0,
            },
        };
        const uv_data = {
            top: {
                center: { x: 0.23, y: 0.20},
                size: { x: 0.18, y: 0.19 },
            },
            bottom: {
                center: { x: 0.62, y: 0.20},
                size: { x: 0.18, y: 0.19 },
            },
            side: {
                top_right: { x: 1.0, y: 0.395},
                size: { x: 1.0, y: 0.605 },
            },
        };

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
         * @returns data prepared for the `Textured_Shape_Factory`
         */
        let top_ends_point_data = (point_on_circle)=>{
            return {
                position: {
                    x: model_data.scale.x * point_on_circle.x,
                    y: model_data.top.y,
                    z: model_data.scale.y * point_on_circle.y,
                    w: 1.0
                },
                colour: can_default_colour,
                size: can_point_size,
                uv_mapping: {
                    u: uv_data.top.center.x + (point_on_circle.x * uv_data.top.size.x),
                    v: uv_data.top.center.y + (point_on_circle.y * uv_data.top.size.y),
                },
            };
        };
        /**
         * @param {*} point_on_circle given a point on the circle
         * @returns data prepared for the `Textured_Shape_Factory`
         */
        let bottom_ends_point_data = (point_on_circle)=>{
            return {
                position: {
                    x: model_data.scale.x * point_on_circle.x,
                    y: model_data.bottom.y,
                    z: model_data.scale.y * point_on_circle.y,
                    w: 1.0
                },
                colour: can_default_colour,
                size: can_point_size,
                uv_mapping: {
                    u: uv_data.bottom.center.x + (point_on_circle.x * uv_data.bottom.size.x),
                    v: uv_data.bottom.center.y + (point_on_circle.y * uv_data.bottom.size.y),
                },
            };
        };
        /**
         * @param {*} index index along the side
         * @returns data prepared for the `Textured_Shape_Factory`
         */
        let top_side_point_data = (index)=>{
            let percentage_of_side = index / unit_circle.length;
            let point_on_circle = unit_circle[index % unit_circle.length];
            return {
                position: {
                    x: model_data.scale.x * point_on_circle.x,
                    y: model_data.top.y,
                    z: model_data.scale.y * point_on_circle.y,
                    w: 1.0
                },
                colour: can_default_colour,
                size: can_point_size,
                uv_mapping: {
                    u: uv_data.side.top_right.x - (percentage_of_side * uv_data.side.size.x),
                    v: uv_data.side.top_right.y,
                },
            };
        };
        /**
         * @param {*} index index along the side
         * @returns data prepared for the `Textured_Shape_Factory`
         */
        let bottom_side_point_data = (index)=>{
            let percentage_of_side = index / unit_circle.length;
            let point_on_circle = unit_circle[index % unit_circle.length];
            return {
                position: {
                    x: model_data.scale.x * point_on_circle.x,
                    y: model_data.bottom.y,
                    z: model_data.scale.y * point_on_circle.y,
                    w: 1.0
                },
                colour: can_default_colour,
                size: can_point_size,
                uv_mapping: {
                    u: uv_data.side.top_right.x - (percentage_of_side * uv_data.side.size.x),
                    v: uv_data.side.top_right.y + uv_data.side.size.y,
                },
            };
        };

        // --------------------------------------------------------
        // ---- prepare triangle/quad helpers

        const unit_circle_center = { x: 0.0, y: 0.0 };
        const top_center_data = top_ends_point_data(unit_circle_center);
        const bottom_center_data = bottom_ends_point_data(unit_circle_center);
        /**
         * given unwrapped indices
         * @param {*} index_first 
         * @param {*} index_next 
         */
        let top_triangle = (index_first, index_next)=>{
            let first_data = top_ends_point_data( unit_circle[index_first%unit_circle.length] );
            let next_data  = top_ends_point_data( unit_circle[index_next%unit_circle.length] );
            shape_factory.add_triangle_with_data( first_data, top_center_data, next_data );
        }
        /**
         * given unwrapped indices
         * @param {*} index_first 
         * @param {*} index_next 
         */
        let bottom_triangle = (index_first, index_next)=>{
            let first_data = bottom_ends_point_data( unit_circle[index_first%unit_circle.length] );
            let next_data  = bottom_ends_point_data( unit_circle[index_next%unit_circle.length] );
            shape_factory.add_triangle_with_data( next_data, bottom_center_data, first_data );
        }

        /**
         * given indices of a unit circle
         * using overflowing indices so that the point data maker will handle the wrapping / percentage
         * @param {*} first_index 
         * @param {*} next_index 
         */
        let side_quad = (first_index, next_index)=>{
            let top_first_data = top_side_point_data(first_index);
            let top_next_data = top_side_point_data(next_index);
            let bottom_first_data = bottom_side_point_data(first_index);
            let bottom_next_data = bottom_side_point_data(next_index);
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
            // add side quad
            side_quad(point_index, next_point_index_unwrapped);
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