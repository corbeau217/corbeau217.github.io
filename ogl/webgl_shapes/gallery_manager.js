// import { insert_shader_code_block } from "../common/util/source_block.js";
import { Canvas_Manager } from "../common/canvas_manager.js";
import { Shape_Wrapper } from "./objects/shape_wrapper.js";

import { Crate_Shape } from "/ogl/common/obj/crate_shape.js";

export class Gallery_Manager extends Canvas_Manager{

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    constructor( maximum_fps ){
        super(maximum_fps);
        // ------------------------------

        this.prepare_selection_mappings();

        this.prepare_default_settings();

        // ------------------------------
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    prepare_selection_mappings(){
        this.selection_type_map = [
            { index: 0, id: "crate_01", type: Crate_Shape },
            // TODO: add more
        ];
    }
    prepare_default_settings(){
        this.verbose_logging = true;
        this.type_selection_index = 0;
        this.canvas_element_id = "shape_gallery_canvas_elem";
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    page_main(){
        super.page_main();
        // ------------------------------
        
        this.prepare_gallery_item_selecting();

        // ------------------------------
    }
    app_main(){
        super.app_main();
        // ------------------------------
    
        // make the first scene
        this.prepare_new_app( this.canvas_element_id, Shape_Wrapper, 0.0, -0.75, -2.3 );
        // first app's scene is the one we're using
        this.viewer_scene = this.app_list[0].get_scene_object();
        // and the first object is our wrapper
        this.shape_wrapper = this.viewer_scene.object_list[0].instance;
        // give it our shape information
        this.provide_shape_data();

        // ------------------------------
    }
    
    get_current_shape(){
        return this.selection_type_map[this.type_selection_index].type;
    }
    provide_shape_data(){
        // TODO: tell shape wrapper about our shape
        this.shape_wrapper.replace_shape( this.get_current_shape() );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    prepare_gallery_item_selecting(){
        // so we can talk about ourself inside the closure
        let self_reference = this;
        // hook in our shape selection function
        window.handle_gallery_shape_selection = (element_object_id) => {
            self_reference.gallery_shape_selection(element_object_id)
        };
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    gallery_shape_selection(element_object_id){
        // find the selection
        for (const type_mapping in this.selection_type_map) {
            // when same id
            if(type_mapping.id == element_object_id){
                if(this.verbose_logging) console.log(`> selecting '${element_object_id}'`);

                // change our index
                this.type_selection_index = type_mapping.index;
                return this.handle_selection_change();
            }
        }
        
        // when we end up here, this means we've not found anything
        if(this.verbose_logging) console.log(`!!! unknown element id: '${element_object_id}'`);
    }
    handle_selection_change(){
        // TODO: change the focus object
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}