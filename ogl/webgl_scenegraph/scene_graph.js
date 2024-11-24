
import { Scene_Object } from "./scene_objects/scene_object.js";

import { Coordinate_Frame } from "/ogl/common/obj/scene_objects/coordinate_frame.js";
import { Camera } from "./scene_objects/camera.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################


export class Scene_Graph extends Scene_Object {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * ### OVERRIDE OF PARENT FUNCTION
     * 
     * used to prepare references and settings, ***minimal calculations*** and
     *      ***no function calls*** should be performed during this stage
     */
    initialise_pre_event(){
        super.initialise_pre_event();

        this.aspect_ratio = 640.0/480.0;
    }
    /**
     * ### OVERRIDE OF PARENT FUNCTION
     * 
     * used for initalising matrices and large setting information
     *      function calls are fine but should be limited as
     *      bloating this could cause excessive object creation
     *      overhead if we're creating and destroying objects often
     * 
     * this is where attribute locations are determined and the model shape is made
     *      which is handled by their respective functions
     */
    initialise_on_event(){
        super.initialise_on_event();

        this.camera = new Camera( this.gl_context, this.aspect_ratio );
        this.camera.set_offset([ -0.0, -0.0, -4.3 ]);

        this.coordinate_frame = new Coordinate_Frame( this.gl_context );
    }
    /**
     * ### OVERRIDE OF PARENT FUNCTION
     * #### !! REPLACEMENT !!
     * 
     * any operation that needs to happen during initialisation
     *      but requires that the object already have information
     *      ready to be used
     * 
     * this is effectively operations which arent part of initialisation
     *      but need to happen before the object is ready to be used
     */
    initialise_post_event(){
        this.add_child_object(this.camera);
    }
    
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    /**
     * change the camera offset for this scene instance
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     * @returns self reference
     */
    set_camera_offset( x, y, z ){
        // tell camera to change
        this.camera.set_offset([ x, y, z ]);

        // give back self reference
        return this;
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    /**
     * ### OVERRIDE OF PARENT FUNCTION
     * #### !! REPLACEMENT !!
     * 
     * operations performed on this object each frame with respect to the time scale provided
     *      by `delta_time` parameter
     */
    update_self( delta_time ){
        // TODO: gather the aspect ratio
    }

    /**
     * ### OVERRIDE OF PARENT FUNCTION
     * #### !! REPLACEMENT !!
     * 
     * draw this object using the already prepared `temp_model_to_ndc_matrix`
     */
    draw_self(){
        // clear the screen
        this.gl_context.clear(this.gl_context.COLOR_BUFFER_BIT | this.gl_context.DEPTH_BUFFER_BIT);
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}

// ############################################################################################
// ############################################################################################
// ############################################################################################
