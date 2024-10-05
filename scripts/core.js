// ################################################################
// ################################################################
// ################################################################
// ### const globals here

// they should be in a config javascript file though?
const MEDITATIONS_DAILY_QUOTE_DIV_ID = "meditations_daily_quote";
const TAOTECHING_DAILY_QUOTE_DIV_ID = "taoteching_daily_quote";

// ################################################################
// ################################################################
// ################################################################
// ### mutable globals here

let include_randomness = false;

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

function randomness_salting(quote_number){
    return parseInt(Math.floor((Math.floor(Math.random()*quote_number)+Math.sqrt(quote_number))%quote_number));
}
function days_since_epoch(){
    var now = new Date();
    let tz_epoch_ms = now.valueOf() - now.getTimezoneOffset() * 60 * 1000 ; // getTimezoneOffset returns minutes!
    return tz_epoch_ms / ( 24 * 60 * 60 * 1000 );
}
function day_of_year_hash(quote_number){
    var now = new Date();
    let day_stuff = Math.pow(now.getDate(),3);
    let month_stuff = Math.pow(now.getMonth(),2);
    let year_stuff = now.getFullYear();
    let hash_salt = (include_randomness)? randomness_salting(quote_number) : 0;
    return (day_stuff + month_stuff + year_stuff + hash_salt) % quote_number;
}
function epoch_days_hash(quote_number){
    return days_since_epoch() % quote_number;
}

function get_todays_hash(quote_number) {
    // generate the quote hash
    let hash_salt = (include_randomness)? randomness_salting(quote_number) : 0;
    return ( epoch_days_hash(quote_number) * day_of_year_hash(quote_number) + hash_salt) % quote_number;
}

function get_quote_daily(source_index){
    let overall_count = DB.sources[source_index].quotecount;
    let hash_val = get_todays_hash(overall_count);
    // the amount of indexing left to do
    let indexing_left = parseInt(hash_val);
    // current book index
    let book_index = 0;
    let book_and_verse = [0,0];
    // the number of books
    const current_book_count = DB.sources[source_index].books[book_and_verse[0]];
    // try find the book and use it
    while(book_and_verse[0] < DB.sources[source_index].books.length){
        // shorter names
        //.. indexing_left
        const current_quote_count = (DB.sources[source_index].books[book_and_verse[0]].content.annotated)?DB.sources[source_index].books[book_and_verse[0]].content.quotes.length-1:DB.sources[source_index].books[book_and_verse[0]].content.quotes.length;
        // need to go further
        if(indexing_left >= current_quote_count){
            indexing_left -= current_quote_count;
            book_and_verse[0] += 1;
        }
        // actually found?
        else {
            book_and_verse[1] = indexing_left;
            break;
        }
    }
    // if we didnt find one? suffer?
    // console.log(`was ${book_and_verse[0]} and ${book_and_verse[1]}`);
    return {
        "book": book_and_verse[0],
        "quote": book_and_verse[1],
        "text": DB.sources[source_index].books[book_and_verse[0]].content.quotes[book_and_verse[1]],
    };
}
function set_meditations_quote(){
    const meditations_quote_space = document.getElementById(MEDITATIONS_DAILY_QUOTE_DIV_ID);
    const quote = get_quote_daily(0);
    meditations_quote_space.innerHTML = `<b>[${DB.sources[0].title} - ${quote.book}, ${quote.quote}]</b>:<br><br><i class=\"quote_text_italics_elem\">${quote.text}</i>`
}
function set_taoteching_quote(){
    const taoteching_quote_space = document.getElementById(TAOTECHING_DAILY_QUOTE_DIV_ID);
    const quote = get_quote_daily(1);
    taoteching_quote_space.innerHTML = `<b>[${DB.sources[1].title} - ${quote.book}, ${quote.quote}]</b>:<br><br><i class=\"quote_text_italics_elem\">${quote.text}</i>`
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