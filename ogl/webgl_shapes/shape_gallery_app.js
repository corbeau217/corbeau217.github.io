import { GALLERY_SHAPES_DB } from "./gallery_shapes_db.js"
// import { Shape_Wrapper } from "./objects/shape_wrapper.js";
// import { Canvas_Stage } from "/ogl/core/canvas_stage.js";
import { WebGL_App } from "/ogl/core/webgl_app.js";


// ############################################################################################
// ############################################################################################
// ############################################################################################

export class Shape_Gallery_App extends WebGL_App {
    constructor( maximum_fps ){
        super(maximum_fps);
        // ------------------------------

        this.initialise_selection_mappings();

        // ------------------------------

        this.initialise_attribute_inspector();

        // ------------------------------
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * preparing our attribute viewing system information
     */
    initialise_attribute_inspector(){
        this.attribute_inspector_data = {
            // used to identify each element
            attribute_element_id: [
                { name: "vertex_positions", label_id: "shape_data_attribute_name_vertex_positions", length_id: "shape_data_attribute_length_vertex_positions", expected_id: "shape_data_attribute_expected_vertex_positions" },
                { name: "vertex_bindings", label_id: "shape_data_attribute_name_vertex_bindings", length_id: "shape_data_attribute_length_vertex_bindings", expected_id: "shape_data_attribute_expected_vertex_bindings" },
                { name: "vertex_colours", label_id: "shape_data_attribute_name_vertex_colours", length_id: "shape_data_attribute_length_vertex_colours", expected_id: "shape_data_attribute_expected_vertex_colours" },
                { name: "vertex_sizes", label_id: "shape_data_attribute_name_vertex_sizes", length_id: "shape_data_attribute_length_vertex_sizes", expected_id: "shape_data_attribute_expected_vertex_sizes" },
            ],
            // used to keep track of our values
            attribute_data: [
                { length: 0, expected: 0 },
                { length: 0, expected: 0 },
                { length: 0, expected: 0 },
                { length: 0, expected: 0 },
            ]
        };
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    initialise_selection_mappings(){
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
        this.prepare_attribute_inspector_elements();

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
        let new_object = this.new_current_object();
        this.set_current_object( new_object );
        this.gather_shape_attribute_data( new_object );
        this.update_shape_attribute_data();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    get_attribute_inspector_element_id_list(attribute_index){
        return this.attribute_inspector_data.attribute_element_id[attribute_index];
    }
    prepare_attribute_inspector_elements(){
        //shape_details_inner_data_elem
        let attribute_inspector_elem = document.querySelector(`#shape_details_inner_data_elem`);
        let outer_line_white_space = "                        ";
        let replacement_inner_html = `${outer_line_white_space}<!-- attribute inspector -->`;

        let add_line = (line_to_add)=>{
            replacement_inner_html = `${replacement_inner_html}\n${outer_line_white_space}${line_to_add}`;
        };
        let add_attribute_block = (attribute_data)=>{
            add_line(`    <li class="shape_data_attribute">`);
            add_line(`        <p><code id="shape_data_attribute_name_${attribute_data.name}">${attribute_data.name}</code></p>`);
            add_line(`        <ul>`);
            add_line(`            <li><p>length: <code id="${attribute_data.length_id}">?</code></p></li>`);
            add_line(`            <li><p>expected: <code id="${attribute_data.expected_id}">?</code></p></li>`);
            add_line(`        </ul>`);
            add_line(`    </li>`);
        }
        
        add_line(`<hr />`);
        add_line(`<ul id="shape_data_attribute_list">`);
        add_line(`    <hr />` );
        add_attribute_block( this.get_attribute_inspector_element_id_list(0) );
        add_line(`    <hr />` );
        add_attribute_block( this.get_attribute_inspector_element_id_list(1) );
        add_line(`    <hr />` );
        add_attribute_block( this.get_attribute_inspector_element_id_list(2) );
        add_line(`    <hr />` );
        add_attribute_block( this.get_attribute_inspector_element_id_list(3) );
        add_line(`    <hr />` );
        add_line(`</ul>`);
        add_line(`<hr />`);


        attribute_inspector_elem.innerHTML = replacement_inner_html;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * rather manually does the updating of the data we're using
     * @param {*} new_object 
     */
    gather_shape_attribute_data( new_object ){
        // ------------------------------------------------
        // --------- helper methods to deal with undefined errors

        let get_length_if_defined = (list)=>{
            return (list!=undefined)?list.length:-1;
        }
        let get_vertex_count_if_defined = (mesh_data)=>{
            return (mesh_data!=undefined)?mesh_data.vertices*4:-1;
        }
        
        // ------------------------------------------------

        // vertex position
        this.attribute_inspector_data.attribute_data[0].length = get_length_if_defined(new_object.vertex_positions);
        this.attribute_inspector_data.attribute_data[0].expected = get_vertex_count_if_defined(new_object.mesh_data);
        // bindings
        this.attribute_inspector_data.attribute_data[1].length = get_length_if_defined(new_object.vertex_bindings);
        this.attribute_inspector_data.attribute_data[1].expected = 0;
        // colours
        this.attribute_inspector_data.attribute_data[2].length = get_length_if_defined(new_object.vertex_colours);
        this.attribute_inspector_data.attribute_data[2].expected = 0;
        // sizes
        this.attribute_inspector_data.attribute_data[3].length = get_length_if_defined(new_object.vertex_sizes);
        this.attribute_inspector_data.attribute_data[3].expected = 0;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    update_shape_attribute_data(){

        // prepare abbreviated count value
        let attribute_count = this.attribute_inspector_data.attribute_data.length;

        // for all our attributes, change their values over
        for (let attribute_index = 0; attribute_index < attribute_count; attribute_index++) {
            const attribute_elem_data = this.attribute_inspector_data.attribute_element_id[ attribute_index ];
            const attribute_values = this.attribute_inspector_data.attribute_data[ attribute_index ];
            
            // go find the elements
            let attribute_length_elem = document.querySelector(`#${attribute_elem_data.length_id}`);
            let attribute_expected_elem = document.querySelector(`#${attribute_elem_data.expected_id}`);

            // set them
            attribute_length_elem.innerHTML = attribute_values.length;
            attribute_expected_elem.innerHTML = attribute_values.expected;
        }

        if(this.verbose_logging) console.log("updated attributes data");
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