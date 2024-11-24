
import { Canvas_Object } from "./canvas_object.js";


// ############################################################################################
// ############################################################################################
// ############################################################################################

export class Scene_Graph_Manager {
    constructor( maximum_fps ){
        this.app_list = [];

        this.verbose_logging = true;
        this.maximum_fps = maximum_fps;
        this.time_between_frames = 1000.0/this.maximum_fps;
        this.hook_load_event();
    }
    hook_load_event(){
        window.addEventListener( "load", (event)=>{
            if(this.verbose_logging){ console.log("--- preparing managed page content ---"); }
            this.page_main();
            
            if(this.verbose_logging){ console.log("--- preparing managed canvases ---"); }
            this.app_main();
    
            if(this.verbose_logging){ console.log("--- starting apps ---"); }
            this.start();
        } );
    }
    start(){
        let self_reference = this;
        setInterval(
            function () {
                requestAnimationFrame(
                        (t) => {
                            self_reference.app_list.forEach(app_instance => {
                                app_instance.frame_update( t );
                            });
                        }
                    );
            },
            this.time_between_frames
        );
    }
    page_main(){
        // override to include things
        console.log("initialising page...");
    }
    app_main(){
        // override to include things
        console.log("initialising canvases...");
    
        this.prepare_new_app( "webgl_scene_graph_01", -0.0, -0.0, -1.1 );
    }

    prepare_new_app( canvas_element_name, camera_offset_x, camera_offset_y, camera_offset_z ){
        // construct and add
        this.app_list.push( Canvas_Object.new_with_camera_offset( canvas_element_name, camera_offset_x, camera_offset_y, camera_offset_z ) );
    }

}

// ############################################################################################
// ############################################################################################
// ############################################################################################
