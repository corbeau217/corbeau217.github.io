
import { IMPORT_POST_TAG_CLASS } from './symbols.js'

// ############################################################################################
// ############################################################################################
// ############################################################################################

function process_post_import_name(post_metadata){
    const post_date_cleaned = process_date_flatten(post_metadata.date);
    const post_year_month_cleaned = get_date_year_month_flattened(post_metadata.date);
    const post_day = post_metadata.day;
    return `${post_year_month_cleaned}/${post_date_cleaned}_${post_day}`;
}
/**
 * break into elements using the slash then keep the first two
 * @param {*} date_string formated as `YYYY/MM/DD`
 * @returns `YYYYMM`
 */
function get_date_year_month_flattened(date_string){
    const date_elements = date_string.split("\/");
    return `${date_elements[0]}${date_elements[1]}`;
}
/**
 * strips slashes from a date
 * @param {*} date_string any date with slashes, `YYYY/MM/DD` or `DD/MM/YYYY`
 * @returns `YYYYMMDD` or `DDMMYYYY`
 */
function process_date_flatten(date_string){
    return date_string.replaceAll("\/","");
}

function process_class_list(class_list, post_metadata){
    // join the array together into one string using spaces
    const class_joining = class_list.join(" ");
    return process_stub_text_content(class_joining,post_metadata);
}

function process_image_source( image_source_tag, post_metadata ){
    if(image_source_tag == "%POST_THUMBNAIL_SOURCE%"){
        return post_metadata.thumbnail;
    }
    else {
        // junk return?
        return "";
    }
}
function process_image_alt_text( image_alt_tag, post_metadata ){
    if(image_alt_tag == "%POST_THUMBNAIL_ALT_TEXT%"){
        return post_metadata.thumbnail_alt_text;
    }
    else {
        // junk return?
        return "[...]";
    }
}

function process_stub_text_content( text_content, post_metadata ){
    let processed_text = text_content;
    processed_text = processed_text.replace("%POST_DATE%", post_metadata.date);
    processed_text = processed_text.replace("%POST_DAY%", post_metadata.day);
    processed_text = processed_text.replace("%POST_THEME%", post_metadata.theme);
    processed_text = processed_text.replace("%POST_TITLE%", post_metadata.title);
    processed_text = processed_text.replace("%SITE_BLOG_POSTS_PATH_TOKEN%", SITE_BLOG_POSTS_PATH);
    // %SITE_BLOG_POSTS_PATH_TOKEN%
    processed_text = processed_text.replace("%IMPORT_POST_CONTENT%", "html_import_element");
    // ...
    return processed_text;
}

// ############################################################################################
// ############################################################################################
// ############################################################################################


// recursively building an element tree based on provided data
function build_tree( root_node_structure, post_metadata ){
    // check for bad
    if(root_node_structure == null){
        console.log("got bad data");
        return null;
    }

    const current_tag = root_node_structure.tag;
    // empty tag?
    if(current_tag.length == 0){
        // .. just plain text
        return root_node_structure.plaintext;
    }
    
    
    // prepare the object to share
    var current_element = document.createElement( current_tag );
    // generate the class data
    const class_name_string = process_class_list(root_node_structure.class, post_metadata);
    current_element.className = class_name_string;
    // setting the id of the element
    current_element.id = process_stub_text_content(root_node_structure.id, post_metadata);
    // test for if it's the import element
    if(class_name_string.includes( IMPORT_POST_TAG_CLASS )){
        const post_import_path = process_post_import_name(post_metadata);
        current_element.setAttribute("import-html", `${ SITE_BLOG_POSTS_PATH }/posts/${ post_import_path }.html`);
    }

    // handle the other situations
    switch (current_tag) {
        // do all the stuff the they share
        case "div":
        case "section":
            // build the sub elements
            for (let inner_index = 0; inner_index < root_node_structure.inner.length; inner_index++) {
                // prepare the child item
                const tree_of_inner_element = build_tree(root_node_structure.inner[inner_index], post_metadata);
                // check for bad sub element building
                if(!(tree_of_inner_element instanceof HTMLElement)) { 
                    console.log("tried to add a spooky sub element");
                }
                else{
                    // add it to our element
                    current_element.appendChild(tree_of_inner_element);
                }
            }
            break;
        // images is a bit different
        case "img":
            const image_source = process_image_source( root_node_structure.src, post_metadata );
            const image_alt_text = process_image_alt_text( root_node_structure.alt, post_metadata );
            current_element.setAttribute("src", image_source);
            current_element.setAttribute("alt", image_alt_text);
            break;
        // headings and  paragraphs are different
        case "h3":
        case "p":
            const inside_data = root_node_structure.inner;
            // it's gonna be plaintext inside hopefully
            if(inside_data.length > 0){
                current_element.innerHTML = process_stub_text_content(inside_data[0].plaintext, post_metadata);
            }
            break;
        default:
            // this is just to stop it being used weirdly
            console.log("unrecognised/unsupported tag used in structure");
            return null;
    }
    return current_element;
}

export { build_tree };