
import { WebGL_App } from "/ext/webgl_1_core/src/webgl_app.js";
import { Sphere_Cube } from "/webgl1/lib/shapes/sphere_cube.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################

export class Scene_Graph_App extends WebGL_App {
    app_main(){
        super.app_main();
        // ------------------------------
        // to use inside closure
        let app_self = this;
        // ------------------------------
        let new_canvas = (element_id, Focus_Type ) => {
            // start it ready
            let stage_instance = app_self.create_new_canvas_stage( element_id );
            // learn what the gl context was
            let gl_context = stage_instance.get_gl_context();
            // find the scene root
            let scene_root = stage_instance.get_scene_graph();
            // add the object
            let focus_obj = new Focus_Type(gl_context);
            scene_root.add_child_object( focus_obj );
            // give back the information for the asker
            return {
                stage: stage_instance,
                gl: gl_context,
                scene: scene_root,
                focus: focus_obj,
            };
        };
        // ------------------------------
    
        new_canvas( "webgl_sphere_cube_01", Sphere_Cube );

        // ------------------------------
    }
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

let webgl_app = new Scene_Graph_App( 40 );

// ############################################################################################
// ############################################################################################
// ############################################################################################