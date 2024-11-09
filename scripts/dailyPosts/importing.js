import {
    IMPORT_SECTION_CLASS_IDENTIFIER,
    IMPORT_HTML_REF_ATTRIBUTE
} from '/scripts/dailyPosts/symbols.js';

// ############################################################################################
// ############################################################################################
// ############################################################################################

function daily_post_flow_get_all_stubs(){
    return document.getElementsByClassName( IMPORT_SECTION_CLASS_IDENTIFIER );
}

// handles a section element that needs to have its inner content imported
//  used by import all daily posts but can be used for other things too
function process_html_importing_section_element( html_importing_stub_section ){
    // get the importing attribute
    let html_file = html_importing_stub_section.getAttribute( IMPORT_HTML_REF_ATTRIBUTE );
    // when we've provided a file to get
    if (html_file) {
        // create the http request for it
        let xhttp = new XMLHttpRequest();
        // change the behaviour for when it's successful
        xhttp.onreadystatechange = function() {
            // xml http request is done state
            if (this.readyState == 4) {
                // check for page done
                if (this.status == 200) { html_importing_stub_section.innerHTML = this.responseText; }
                // when spooky 404 for the stub
                //  should have a thing for failed stubs?
                if (this.status == 404) { html_importing_stub_section.innerHTML = "Page not found."; }
                /* Remove the attribute, and call this function once more: */
                html_importing_stub_section.removeAttribute( IMPORT_HTML_REF_ATTRIBUTE );
                // also remove the class that says it needs an import
                html_importing_stub_section.classList.remove( IMPORT_SECTION_CLASS_IDENTIFIER );
            }
        };
        // set as a get request
        xhttp.open("GET", html_file, true);
        // full send the request
        xhttp.send();
    }
}

// this was largely reinterpreted from the way that w3 schools tutorial did it
//  but we've reformatted the structure to show what's happening and to understand it
// 
// we also intentionally flattened it out and made it not recursive so will only do
//  top level imports
function import_all_daily_posts() {
    // prepare the list
    let post_flow_stub_list = daily_post_flow_get_all_stubs();
    // access all the items in the list
    for (let post_flow_stub_index = 0; post_flow_stub_index < post_flow_stub_list.length; post_flow_stub_index++) {
        // prepare the current stub
        let current_stub = post_flow_stub_list[post_flow_stub_index];
        // delegate for dealing with the import
        process_html_importing_section_element(current_stub);
    }
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

export {
    import_all_daily_posts,
    process_html_importing_section_element,
    daily_post_flow_get_all_stubs
};