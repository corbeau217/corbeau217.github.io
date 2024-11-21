import { Canvas_Object } from "/ogl/common/canvas_object.js";

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
                            self_reference.app_list.forEach(app_data => {
                                app_data.app_instance.frame_update( t );
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
        // --------------------------------------------
        // --------------------------------------------
        // ---- get our context
    
        let canvas_app = new Canvas_Object( canvas_element_name, this.canvas_default_clear_colour );
        let scene_graph = canvas_app.get_scene_object();
    
        // --------------------------------------------
        // --------------------------------------------
        // ---- add it to the list of apps
            
        // get the index it's going to be placed
        const app_index = this.app_list.length;
        
        // make the canvas information
        let app_data = {
            // where in the list it is
            id: app_index,
            // what the element name is
            canvas_name: canvas_element_name,
            // what the background colour is
            clear_colour: this.canvas_default_clear_colour,
            // the canvas app
            app_instance: canvas_app,
            // quick access to the scene
            scene_instance: scene_graph,
        };
    
        // add to our list
        this.app_list.push( app_data );
    
        // --------------------------------------------
        // --------------------------------------------
        // ---- make the focus instance
    
        let focus_obj = new Scene_Focus_Object( canvas_app.get_gl_context() );
    
        // --------------------------------------------
        // --------------------------------------------
        // ---- link it up
    
        // prepare the scene
        scene_graph
            .add_object( focus_obj, focus_obj.update, focus_obj.draw )
            .set_camera_offset( camera_offset_x, camera_offset_y, camera_offset_z );
    
        // --------------------------------------------
        // --------------------------------------------
    }

}