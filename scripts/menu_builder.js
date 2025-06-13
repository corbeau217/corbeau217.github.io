import { NAV_MENU_ITEMS } from "/data/nav_menu_data.js";

/**
 * makes a nav menu element given a path and label
 * @param {*} label the label for the nav menu item
 * @param {*} path the path this nav menu item goes to
 */
function nav_menu_element(label,path){
    return `<div class="nav_link"><a href="${path}" class="nav_link_anchor">${label}</a></div>`
}

/**
 * constructs
 * @returns the constructed content to go within the nav menu
 */
function construct_nav_menu_inner_html(){
    let constructed_elements = NAV_MENU_ITEMS.map(element_data => {
        // grab only when we want it
        if(element_data.enabled){
            return nav_menu_element(element_data.label, element_data.path);
        }
    });
    return constructed_elements.join("\n");
}

/**
 * construct all the items of the nave menu
 */
function nav_menu_main(){
    // gather the nav menu object
    const body_menu_element = document.querySelector("#navMenu");

    // check real
    if(body_menu_element==null) {
        console.log("failed to add the navigation menu to our page");
    }
    else {
        // have real element
        body_menu_element.innerHTML = construct_nav_menu_inner_html();
    }
}

window.addEventListener(
    "load",
    (event) => {
        nav_menu_main();
    }
);