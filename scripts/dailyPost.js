import { import_all_daily_posts } from "/scripts/dailyPosts/importing.js";
import { generate_daily_post_stubs } from "/scripts/dailyPosts/stubGeneration.js";

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
