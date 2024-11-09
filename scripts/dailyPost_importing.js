const DAILY_POST_LINKS = [
    "20241109_saturday.html",
    "20241108_friday.html",
    "20241107_thursday.html",
    "20241106_wednesday.html",
    "20241105_tuesday.html",
];

// to show which section elements need to have their content imported
const IMPORT_SECTION_CLASS_IDENTIFIER = "html_import_section";
// doing this because we can and so it's a bit more fun
const IMPORT_HTML_REF_ATTRIBUTE = "import-html";

// ############################################################################################
// ############################################################################################
// ############################################################################################

function process_daily_post_importing() {
    console.log("preparing daily post stubs");
    daily_post_flow_initialise();
    console.log("importing daily posts");
    import_all_daily_posts();
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

// generate the element that will be added to the section flow body of the daily posts page
function create_daily_post_stub(daily_post_page_link){
    return `<section class="sectioned_content_outter ${IMPORT_SECTION_CLASS_IDENTIFIER}" ${IMPORT_HTML_REF_ATTRIBUTE}="/daily/posts/${daily_post_page_link}"></section>`;
}

// prepare all daily post stubs for importing
function generate_daily_post_stubs() {
    var daily_post_stubs = [];
    // all daily posts
    for (let daily_post_index = 0; daily_post_index < DAILY_POST_LINKS.length; daily_post_index++) {
        const current_post_link = DAILY_POST_LINKS[daily_post_index];
        const current_created_stub = create_daily_post_stub(current_post_link);
        daily_post_stubs.push( current_created_stub );
    }
    // fulfull our imaginary contract
    return daily_post_stubs;
}


// ############################################################################################
// ############################################################################################
// ############################################################################################

// prepare all the stubs so our body loader knows to do the importing
function daily_post_flow_initialise() {
    var daily_post_stubs = generate_daily_post_stubs();
    // now add them all to the content body
    var daily_post_flow_box_elem = document.getElementById("daily_post_flow_box");
    // all of them
    for (let post_stub_index = 0; post_stub_index < daily_post_stubs.length; post_stub_index++) {
        const current_stub = daily_post_stubs[post_stub_index];
        // really should be adding it as html element but we have it as string right now
        daily_post_flow_box_elem.innerHTML += current_stub;        
    }
}

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

// get the page to listen for when they need to be loaded
window.addEventListener(
    "load",
    (event) => {
        process_daily_post_importing();
    }
);

// ############################################################################################
// ############################################################################################
// ############################################################################################
