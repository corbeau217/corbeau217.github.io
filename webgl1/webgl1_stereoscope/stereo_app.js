
import { WebGL_App } from "/ext/webgl_1_core/src/webgl_app.js";
import { Stereo_Stage } from "./stereo_stage.js";
import { Sphere_Cube } from "/webgl1/lib/shapes/sphere_cube.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################

export class Stereo_App extends WebGL_App {
    app_main(){
        super.app_main();
        // ------------------------------
        // to use inside closure
        let app_self = this;
        // ------------------------------
        let new_stereo_canvas = (left_element_id, right_element_id, Focus_Type ) => {
            // start it ready
            let stage_instance = app_self.create_new_stereo_stage( left_element_id, right_element_id );
            
            // add the object to both
            stage_instance.get_left_scene_graph().add_child_object( new Focus_Type( stage_instance.get_left_gl_context() ) );
            stage_instance.get_right_scene_graph().add_child_object( new Focus_Type( stage_instance.get_right_gl_context() ) );
        };
        // ------------------------------
    
        new_stereo_canvas( "webgl_stereoscope_left", "webgl_stereoscope_right", Sphere_Cube );

        // ------------------------------
    }



    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    create_new_stereo_stage( left_element_id, right_element_id ){
        if(this.verbose_logging){ console.log(`creating canvas with names '${left_element_id}', and '${right_element_id}'`); }
        // construct and add
        let new_stage = new Stereo_Stage( left_element_id, right_element_id, this );
        this.canvas_stage_list.push( new_stage );

        // give to caller 
        return new_stage;
    }
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

let stereo_app = new Stereo_App( 40 );

// ############################################################################################
// ############################################################################################
// ############################################################################################