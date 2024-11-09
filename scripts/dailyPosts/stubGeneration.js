import {
    IMPORT_SECTION_CLASS_IDENTIFIER,
    IMPORT_HTML_REF_ATTRIBUTE
} from '/scripts/dailyPosts/symbols.js';

// ############################################################################################
// ############################################################################################
// ############################################################################################

const DAILY_POST_LINKS = [
    "20241109_saturday.html",
    "20241108_friday.html",
    "20241107_thursday.html",
    "20241106_wednesday.html",
    "20241105_tuesday.html",
];

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


export {
    generate_daily_post_stubs,
    create_daily_post_stub
};