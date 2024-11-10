// import {
//     IMPORT_POST_TAG_CLASS,
//     IMPORT_HTML_REF_ATTRIBUTE
// } from '/scripts/dailyPosts/symbols.js';
import {
    DAILY_POST_DATA
} from '/data/daily_post_data.js';
import {
    DAILY_POST_STRUCTURE
} from '/data/daily_post_structure.js';
import { build_tree } from './stubBuilding.js';


// ############################################################################################
// ############################################################################################
// ############################################################################################

function create_daily_post_stub_elem( daily_post_metadata ){
    // prepare the structure information
    const structure_data = DAILY_POST_STRUCTURE.metadata;
    const outer_tree_data = structure_data[0];

    // create the post section object
    let post_outer = build_tree( outer_tree_data, daily_post_metadata );
    
    // provide it back
    return post_outer;
}

// TODO: change over to using the tree building
// generate the element that will be added to the section flow body of the daily posts page
function create_daily_post_stub(daily_post_index){
    const daily_post_metadata = DAILY_POST_DATA.metadata[daily_post_index];
    
    return create_daily_post_stub_elem( daily_post_metadata );

    // const daily_post_content_path = `/daily/posts/${ daily_post_stub_file }`;
    // return `<section class="sectioned_content_outer ${IMPORT_POST_TAG_CLASS}" ${IMPORT_HTML_REF_ATTRIBUTE}="${ daily_post_content_path }"></section>`;
}

// prepare all daily post stubs for importing
function generate_daily_post_stubs( flow_box_element_id ) {
    const post_flow_box = document.getElementById(flow_box_element_id);
    // all daily posts
    for (let daily_post_index = 0; daily_post_index < DAILY_POST_DATA.metadata.length; daily_post_index++) {
        const current_created_stub = create_daily_post_stub(daily_post_index);
        // check for non elements
        if(!(current_created_stub instanceof HTMLElement)){
            console.log("wanted to add an undefined post, so we stopped it");
        }
        else {
            post_flow_box.appendChild( current_created_stub );
        }
    }
}

// ############################################################################################
// ############################################################################################
// ############################################################################################


export {
    generate_daily_post_stubs,
    create_daily_post_stub
};