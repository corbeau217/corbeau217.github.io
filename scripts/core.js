// ################################################################
// ################################################################
// ################################################################
// ### const globals here

// moved to /data/config.js

// ################################################################
// ################################################################
// ################################################################
// ### mutable globals here

// moved to /data/config.js

// ################################################################
// ################################################################
// ################################################################
// ### env setting up

// initialise the things
function init() {
    // ...
    // get_todays_quote();
}

// ################################################################
// ################################################################
// ################################################################
// ### misc

function set_meditations_quote(){
    const meditations_quote_space = document.getElementById(MEDITATIONS_DAILY_QUOTE_DIV_ID);
    const quote = get_quote_daily(0);
    meditations_quote_space.innerHTML = `<p class="quote_reference_elem"><b>${DB.sources[0].title} - ${quote.book+1}, ${quote.quote}</b></p><p class="quote_text_italics_elem"><i>${quote.text}</i></p>`;
}
function set_taoteching_quote(){
    const taoteching_quote_space = document.getElementById(TAOTECHING_DAILY_QUOTE_DIV_ID);
    const quote = get_quote_daily(1);
    taoteching_quote_space.innerHTML = `<p class="quote_reference_elem"><b>${DB.sources[1].title} - ${quote.book+1}, ${quote.quote}</b></p><p class="quote_text_italics_elem"><i>${quote.text}</i></p>`;
}

// ################################################################
// ################################################################
// ################################################################
// ### core

// main landing point for the code
function main() {
    init();
    set_meditations_quote();
    set_taoteching_quote();
}

// ################################################################
// ################################################################
// ################################################################
// ### the end