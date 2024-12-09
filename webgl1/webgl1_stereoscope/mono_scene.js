import { Scene_Graph } from "/ext/webgl_1_core/src/scene_graph.js";
// import { Orbital_Perspective_Camera } from "/ext/webgl_1_core/src/cameras/orbital_perspective_camera.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################

/**
 * amount of delta time to feed into a camera update to put the sides out of sync
 */
const CAMERA_ORBIT_TIME_DIFFERENCE = 0.1;

export class Mono_Scene extends Scene_Graph {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    constructor(gl_context, is_left_scene){
        super(gl_context);
        this.is_left_scene = is_left_scene;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * ### OVERRIDE OF SUPER FUNCTION
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

        // rotating anyway, just get it to rotate a lil bit to start off
        if(this.is_left_scene){
            this.camera.update_self( (CAMERA_ORBIT_TIME_DIFFERENCE/2.0));
        }
        else {
            // cursed, but we slightly "un rotate"
            this.camera.update_self(-(CAMERA_ORBIT_TIME_DIFFERENCE/2.0));
        }
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}

// ############################################################################################
// ############################################################################################
// ############################################################################################
