// ################################################################
// ################################################################
// ################################################################
// ### randomisation

function randomness_salting(quote_number){
    return parseInt(Math.floor((Math.floor(Math.random()*quote_number)+Math.sqrt(quote_number))%quote_number));
}

// ################################################################
// ################################################################
// ################################################################
// ### date functions

function days_since_epoch(){
    var now = new Date();
    let tz_epoch_ms = now.valueOf() - now.getTimezoneOffset() * 60 * 1000 ; // getTimezoneOffset returns minutes!
    return parseInt(tz_epoch_ms / ( 24 * 60 * 60 * 1000 ));
}

// ################################################################
// ################################################################
// ################################################################
// ### date hashing

function day_of_year_hash(quote_number){
    var now = new Date();
    let day_stuff = Math.pow(parseInt(now.getDate()),3);
    let month_stuff = Math.pow(parseInt(now.getMonth()),2);
    let year_stuff = parseInt(now.getFullYear());
    // hash salt is just that randomness value, it should just be 0 if we're not including randomness
    let hash_salt = (include_randomness)? randomness_salting(quote_number) : 0;
    return (day_stuff + month_stuff + year_stuff + hash_salt) % quote_number;
}
function epoch_days_hash(quote_number){
    return days_since_epoch() % quote_number;
}

function get_todays_hash(quote_number) {
    // generate the quote hash
    let hash_salt = (include_randomness)? randomness_salting(quote_number) : 0;
    return ( parseInt(epoch_days_hash(quote_number)) * parseInt(day_of_year_hash(quote_number)) + hash_salt) % quote_number;
}

// ################################################################
// ################################################################
// ################################################################
// ### quote generation

function get_quote_daily(source_index){
    let overall_count = DB.sources[source_index].quotecount;
    let hash_val = get_todays_hash(overall_count);
    // the amount of indexing left to do
    let indexing_left = parseInt(hash_val);
    // current book index and quote
    let book_and_verse = [0,0];
    // the number of books
    const current_book_count = DB.sources[source_index].books[book_and_verse[0]];
    // keep track of if it was a real one
    //  might be a strange index if there was a bug in the hashing somewhere
    let found_real_index = false;
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
            found_real_index = true;
            break;
        }
    }
    // possibly didnt find real index if spooky things happen
    // if we didnt find one? suffer? bless them?
    if(!found_real_index) {
        // randomize the book index
        //  modulo the number of books incase someones javascript compiler wants to round up in integer parsing
        book_and_verse[0] = parseInt((Math.random*(DB.sources[source_index].books.length))%DB.sources[source_index].books.length);
        // again for the verse
        //  this is suffering to make and suffering to read, dont do this.
        book_and_verse[1] = parseInt((Math.random*(DB.sources[source_index].books[book_and_verse[0]].content.quotes.length))%DB.sources[source_index].books[book_and_verse[0]].content.quotes.length);
    }
    // console.log(`was ${book_and_verse[0]} and ${book_and_verse[1]}`);
    return {
        "book": book_and_verse[0],
        "quote": book_and_verse[1],
        "text": DB.sources[source_index].books[book_and_verse[0]].content.quotes[book_and_verse[1]],
    };
}

// ################################################################
// ################################################################
// ################################################################