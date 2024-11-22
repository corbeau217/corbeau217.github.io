// import { insert_shader_code_block } from "../common/util/source_block.js";
import { Canvas_Manager } from "../common/canvas_manager.js";

export class Gallery_Manager extends Canvas_Manager{
    page_main(){
        super.page_main();
        // ------------------------------

        this.prepare_gallery_item_selecting();

        // ------------------------------
    }
    app_main(){
        super.app_main();
        // ------------------------------
    
        // this.prepare_new_app( "webgl_water_01", Water, 0.0, -0.75, -2.3 );

        // ------------------------------
    }

    gallery_shape_selection(element_object_id){
        console.log(`selection made: ${element_object_id}`);
    }

    prepare_gallery_item_selecting(){
        // so we can talk about ourself inside the closure
        let self_reference = this;
        // hook in our shape selection function
        window.handle_gallery_shape_selection = (element_object_id) => {
            self_reference.gallery_shape_selection(element_object_id)
        };
    }
}