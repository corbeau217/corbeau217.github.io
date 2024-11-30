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
        
        // -----------------------------------------------
        // ------ helper method for making our attributes

        let add_attribute_to_data_list = (attribute_name)=>{
            // -----------------------------------------------------------------
            // add the id tracking information
            this.attribute_inspector_data.attribute_element_id.push(
                {
                    // attribute name
                    name: attribute_name,
                    // inspector label
                    label_id: `shape_data_attribute_name_${attribute_name}`,
                    // inspector length container
                    length_id: `shape_data_attribute_length_${attribute_name}`,
                    // inspector expected container
                    expected_id: `shape_data_attribute_expected_${attribute_name}`,
                    // inspector elements container
                    elements_id: `shape_data_attribute_elements_${attribute_name}`,
                }
            );
            // -----------------------------------------------------------------
            // add a spot within the attribute data list
            this.attribute_inspector_data.attribute_data.push(
                {
                    length: 0,
                    expected: 0,
                    elements: 0,
                }
            );
            // -----------------------------------------------------------------
        };
        
        // -----------------------------------------------
        // ------ initialise our data structure
        
        this.attribute_inspector_data = {
            // used to identify each element
            attribute_element_id: [],
            // used to keep track of our values
            attribute_data: [],
        };
        
        // -----------------------------------------------
        // ------ now include the attributes

        add_attribute_to_data_list("vertex_positions");
        add_attribute_to_data_list("vertex_bindings");
        add_attribute_to_data_list("vertex_colours");
        add_attribute_to_data_list("vertex_sizes");
        add_attribute_to_data_list("vertex_uv_mappings");

        // -----------------------------------------------
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
        return `<div class="shape_view_menu_gallery_item_wrapper_outer"><div id="${element_id}" onclick="handle_gallery_shape_selection('${element_id}')" class="shape_view_menu_gallery_item_wrapper_inner"><img class="shape_view_menu_gallery_item_thumbnail" src="${element_thumbnail}" alt="change to ${element_id} shape" /></div></div>`;
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
            add_line(`            <li><p>elements: <code id="${attribute_data.elements_id}">?</code></p></li>`);
            add_line(`        </ul>`);
            add_line(`    </li>`);
        }
        
        // -----------------------------
        // ---- first chunk
        add_line(`<hr />`);
        add_line(`<ul id="shape_data_attribute_list">`);
        add_line(`    <hr />` );
        // -----------------------------


        // for all our attributes
        for (let attribute_index = 0; attribute_index < this.attribute_inspector_data.attribute_element_id.length; attribute_index++) {
            const current_attribute_id_list = this.get_attribute_inspector_element_id_list(attribute_index);
            
            // make it
            add_attribute_block( current_attribute_id_list );
            // include breaker
            add_line(`    <hr />`);
        }
        

        // -----------------------------
        // ---- last chunk after
        add_line(`</ul>`);
        add_line(`<hr />`);


        attribute_inspector_elem.innerHTML = replacement_inner_html;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * gathers information about the object
     * @param {*} new_object the object to gather information for
     */
    prepare_shape_attribute_information( new_object ){
        // ------------------------------------------------
        // --------- prepare the data

        let mesh_data = {
            // ==========================================
            vertices: {
                length: -1,
                expected: -1,
                elements: -1,
            },
            edges: {
                length: -1,
                expected: -1,
                elements: -1,
            },
            faces: {
                length: -1,
                expected: -1,
                elements: -1,
            },
            // selected from edges/faces
            bindings: {
                length: -1,
                expected: -1,
                elements: -1,
            },
            // ==========================================
            colours: {
                length: -1,
                expected: -1,
                elements: -1,
            },
            sizes: {
                length: -1,
                expected: -1,
                elements: -1,
            },
            normals: {
                length: -1,
                expected: -1,
                elements: -1,
            },
            // ==========================================
            uv_mappings: {
                length: -1,
                expected: -1,
                elements: -1,
            },
            // ==========================================
        };

        // test we have something
        if(new_object == undefined){
            // when we dont have an object to work with
            return mesh_data;
        }

        // otherwise we continue to get the information

        // ------------------------------------------------
        // --------- helper methods to deal with undefined errors

        let get_length_if_defined = (list)=>{
            return (list!=undefined)?list.length:-1;
        }
        /**
         * should only be used when `new_object.mesh_data` is confirmed real
         * @param {*} count the count to check
         * @returns count | -1
         */
        let get_count_if_defined = (count)=>{
            return (count!=undefined)?count:-1;
        }

        // ------------------------------------------------
        // --------- handle the object information

        // ---- gather the list lengths
        mesh_data.vertices.length    = get_length_if_defined( new_object.vertex_positions   );
        mesh_data.edges.length       = get_length_if_defined( new_object.vertex_bindings    );
        mesh_data.faces.length       = get_length_if_defined( new_object.vertex_bindings    );
        mesh_data.colours.length     = get_length_if_defined( new_object.vertex_colours     );
        mesh_data.sizes.length       = get_length_if_defined( new_object.vertex_sizes       );
        mesh_data.normals.length     = get_length_if_defined( new_object.vertex_normals     );
        mesh_data.uv_mappings.length = get_length_if_defined( new_object.vertex_uv_mappings );

        // ---- can we gather the expected values?
        if(new_object.mesh_data != undefined){
            // data to be gathered for expected
            mesh_data.vertices.expected    = get_count_if_defined( new_object.mesh_data.vertices    );
            mesh_data.edges.expected       = get_count_if_defined( new_object.mesh_data.edges       );
            mesh_data.faces.expected       = get_count_if_defined( new_object.mesh_data.faces       );
            mesh_data.colours.expected     = get_count_if_defined( new_object.mesh_data.colours     );
            mesh_data.sizes.expected       = get_count_if_defined( new_object.mesh_data.sizes       );
            mesh_data.normals.expected     = get_count_if_defined( new_object.mesh_data.normals     );
            mesh_data.uv_mappings.expected = get_count_if_defined( new_object.mesh_data.uv_mappings );
        }

        // ---- prepare manually done element counts
        mesh_data.vertices.elements    = 4;
        mesh_data.edges.elements       = 3;
        mesh_data.faces.elements       = 3;
        mesh_data.colours.elements     = 4;
        mesh_data.sizes.elements       = 1;
        mesh_data.normals.elements     = 3;
        mesh_data.uv_mappings.elements = 2;

        // ---- select the largest of edges/faces
        if(this.verbose_logging) console.log(`> [edges expected: ${mesh_data.edges.expected}][faces expected: ${mesh_data.faces.expected}]`);

        // edges expected is 0, but faces isnt
        //  (we have a polygon)
        if(mesh_data.edges.expected <= 0 && mesh_data.faces.expected > 0){
            if(this.verbose_logging) console.log("> polygon mesh");
            mesh_data.bindings.length   = mesh_data.faces.length;
            mesh_data.bindings.expected = mesh_data.faces.expected;
            mesh_data.bindings.elements = mesh_data.faces.elements;
        }
        // faces expected is 0, but edges isnt
        //  (we have a wireframe)
        else if(mesh_data.faces.expected <= 0 && mesh_data.edges.expected > 0){
            if(this.verbose_logging) console.log("> wireframe mesh");
            mesh_data.bindings.length   = mesh_data.edges.length;
            mesh_data.bindings.expected = mesh_data.edges.expected;
            mesh_data.bindings.elements = mesh_data.edges.elements;
        }

        // ------------------------------------------------
        // --------- finished

        return mesh_data;
        
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
        // --------- prepare our information

        // this handles our data already so we can just use it now
        let mesh_data = this.prepare_shape_attribute_information( new_object );
        
        // ------------------------------------------------

        // vertex position
        this.attribute_inspector_data.attribute_data[0] = mesh_data.vertices;
        // bindings
        this.attribute_inspector_data.attribute_data[1] = mesh_data.bindings;
        // colours
        this.attribute_inspector_data.attribute_data[2] = mesh_data.colours;
        // sizes
        this.attribute_inspector_data.attribute_data[3] = mesh_data.sizes;
        // uv_mappings
        this.attribute_inspector_data.attribute_data[4] = mesh_data.uv_mappings;
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
            let attribute_elements_elem = document.querySelector(`#${attribute_elem_data.elements_id}`);

            // set them
            attribute_length_elem.innerHTML = attribute_values.length;
            attribute_expected_elem.innerHTML = attribute_values.expected;
            attribute_elements_elem.innerHTML = attribute_values.elements;
        }

        if(this.verbose_logging) console.log("> updated inspector attributes data");
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