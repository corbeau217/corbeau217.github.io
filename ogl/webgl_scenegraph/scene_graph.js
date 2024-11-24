
import { Coordinate_Frame } from "/ogl/common/obj/scene_objects/coordinate_frame.js";
import { Camera } from "./camera.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################


export class Scene_Graph {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // ...
    constructor( gl_context, aspectRatio ){
        // .. local references to gl and program info
        this.gl_context = gl_context;
        
        this.camera = new Camera( this.gl_context,aspectRatio );
        
        this.camera.set_offset([ -0.0, -0.0, -4.3 ]);

        this.coordinate_frame = new Coordinate_Frame( this.gl_context, null );

        // empty list
        this.object_list = [];
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * @brief provide an object and the relevant functions used during updates/draws for the object
     * 
     * @param {*} object_to_add scene object to add
     * @param {*} update_function the relevant update function with 1 parameter for delta_time
     * @param {*} draw_function  the draw function for the object, 2 parameters of camera_view, and camera_projection matrices
     */
    add_object( object_to_add, update_function, draw_function ){
        // prepare
        let object_list_addition = {
            // this is the object itself
            instance: object_to_add,
            // how we update the object
            update: update_function,
            // how we draw it
            draw: draw_function,
        };
        // put it in our list
        this.object_list.push( object_list_addition );
        // give back self reference
        return this;
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    set_camera_offset( x, y, z ){
        // tell camera to change
        this.camera.set_offset([ x, y, z ]);

        // give back self reference
        return this;
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    update( delta_time, aspectRatio ){
        this.coordinate_frame.update(delta_time);

        // this.triangle.update(delta_time);
        this.camera.update(delta_time, aspectRatio);

        // handle updating all our objects
        this.object_list.forEach(object_to_update => {
            // this is like we're saying 
            //  obj.update_function_name( delta_time )
            object_to_update.update.apply( object_to_update.instance, [delta_time] );
        });
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    prepare_draw_context(){
        // clear the screen
        this.gl_context.clear(this.gl_context.COLOR_BUFFER_BIT | this.gl_context.DEPTH_BUFFER_BIT);
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(){
        let world_to_ndc_matrix = this.camera.get_view_projection_matrix();

        this.coordinate_frame.draw( world_to_ndc_matrix );

        // // handle drawing all our objects
        // this.object_list.forEach(
        //     object_to_draw => {
        //         // this is like we're saying 
        //         //  obj.draw_function_name( camera_view_mat4, camera_projection_mat4 )
        //         object_to_draw.draw.apply( object_to_draw.instance, [ camera_view_mat4, camera_projection_mat4 ] );
        //     }
        // );
    }
}

// ############################################################################################
// ############################################################################################
// ############################################################################################
