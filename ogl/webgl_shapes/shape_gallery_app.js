import { GALLERY_SHAPES_DB } from "./gallery_shapes_db.js"
// import { Shape_Wrapper } from "./objects/shape_wrapper.js";
import { Canvas_Stage } from "/ogl/core/canvas_stage.js";
import { WebGL_App } from "/ogl/core/webgl_app.js";


// ############################################################################################
// ############################################################################################
// ############################################################################################

export class Shape_Gallery_App extends WebGL_App {
    constructor( maximum_fps ){
        super(maximum_fps);
        // ------------------------------

        this.prepare_selection_mappings();

        // ------------------------------
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    prepare_selection_mappings(){
        this.selection_type_map = GALLERY_SHAPES_DB;
    }
    prepare_default_settings(){
        super.prepare_default_settings();
        // ------------------------------

        this.verbose_logging = true;
        this.is_clockwise_winding_order = true;
        this.type_selection_index = 0;
        this.canvas_element_id = "shape_gallery_canvas_elem";

        // ------------------------------
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    page_main(){
        super.page_main();
        // ------------------------------
        
        this.connect_gallery_selection_function_to_page();
        this.prepare_gallery_selection_options();

        // ------------------------------

    }
    app_main(){
        super.app_main();
        // ------------------------------
    
        this.main_stage = this.create_new_canvas_stage( this.canvas_element_id );
        this.main_scene_graph = this.main_stage.get_scene_graph();

        // ------------------------------
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    connect_gallery_selection_function_to_page(){
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
        for (let index = 0; index < this.selection_type_map.length; index++) {
            const type_mapping = this.selection_type_map[index];
            // when same id
            if(type_mapping.id === element_object_id){
                if(this.verbose_logging) console.log(`> selecting '${element_object_id}'`);

                // change our index
                this.type_selection_index = type_mapping.index;
                return this.provide_shape_data();
            }
        }
        
        // when we end up here, this means we've not found anything
        if(this.verbose_logging) console.log(`!!! unknown element id: '${element_object_id}'`);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // shape_view_menu_gallery_flow_elem
    prepare_gallery_selection_options(){
        let gallery_flow_elem = document.querySelector(`#shape_view_menu_gallery_flow_elem`);
        let line_white_space = "                    ";
        let replacement_inner_html = `${line_white_space}<!-- selection items -->`;

        for (let option_index = 0; option_index < this.selection_type_map.length; option_index++) {
            const current_selection_option = this.selection_type_map[option_index];
            const current_item_html = this.build_gallery_selection_item( current_selection_option.id, current_selection_option.thumbnail );
            replacement_inner_html = `${replacement_inner_html}\n${line_white_space}${current_item_html}`;
        }

        // then just directly replace the body
        gallery_flow_elem.innerHTML = replacement_inner_html;
    }
    build_gallery_selection_item(element_id, element_thumbnail){
        return `<div id="${element_id}" onclick="handle_gallery_shape_selection('${element_id}')" class="shape_view_menu_gallery_item"><img class="shape_view_menu_gallery_item_thumbnail" src="${element_thumbnail}" alt="change to ${element_id} shape" /></div>`;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    get_current_type(){
        return this.selection_type_map[this.type_selection_index].type;
    }
    new_current_object(){
        let Current_Type = this.get_current_type();
        return new Current_Type(this.main_scene_graph.gl_context);
    }
    set_current_object( new_object_instance ){
        this.main_scene_graph.remove_child( this.currently_shown_id );
        this.currently_shown_id = this.main_scene_graph.add_child_object( new_object_instance );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    provide_shape_data(){
        this.set_current_object( this.new_current_object() );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

let webgl_app = new Shape_Gallery_App( 40 );

// ############################################################################################
// ############################################################################################
// ############################################################################################