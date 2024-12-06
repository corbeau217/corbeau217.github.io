import { Canvas_Object } from "./old_canvas_object.js";

export class Canvas_Manager {
    constructor( maximum_fps ){
        this.app_list = [];
        
        //   0.0 to 1.0:                   [   R,   G,   B,   A ]
        this.canvas_default_clear_colour = [ 0.1, 0.1, 0.1, 1.0 ];

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
    }

    prepare_new_app( canvas_element_name, Scene_Focus_Object, camera_offset_x, camera_offset_y, camera_offset_z ){
        // construct and add
        this.app_list.push( Canvas_Object.new_with_focus_object( canvas_element_name, Scene_Focus_Object, camera_offset_x, camera_offset_y, camera_offset_z ) );
    }

}