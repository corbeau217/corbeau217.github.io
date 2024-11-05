
const nav_menu_inner = '<div class="nav_link"><a href="/" class="nav_link_anchor">HOME</a></div>'+
'<div class="nav_link"><a href="/info/" class="nav_link_anchor">INFO</a></div>'+
'<div class="nav_link"><a href="/ogl/" class="nav_link_anchor">GRAPHICS</a></div>'+
'<div class="nav_link"><a href="/daily/" class="nav_link_anchor">DAILY</a></div>';


function construct_pageNavigation_menu(){
    // ...
    const body_menu_element = document.querySelector("#navMenu");
    if(body_menu_element==null) {
        console.log("failed to add the navigation menu to our page");
    }
    else {
        body_menu_element.innerHTML = nav_menu_inner;
    }
}

window.addEventListener(
    "load",
    (event) => {
        construct_pageNavigation_menu();
    }
);