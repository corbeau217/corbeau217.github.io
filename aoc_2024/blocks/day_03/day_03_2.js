import {
    split_on_line_break,
    split_on_spaces,
    prep_data,
} from "/aoc_2024/util.js";


/**
 * given raw input file
 * @param {*} raw_input_data input data block
 * @returns 
 */
export function code_block( raw_input_data ){
    // prepare answer reference
    let answer = 0;


    // ======= pt 2 code down here
    // ==============================


    // not necessary my friend, but we do it anyway, why not
    const STARTING_SOUP = "do()" +raw_input_data.split('\n').join() + "do()";

    // ------------------------------------------------------


    // happy super safe stuff
    let stash_of_safe_bits = [];

    
    // ------------------------------------------------------


    // rip it apart on the dead bits and join it back up
    let strip_dont_before_a_do = (current_soup)=>{
        return current_soup.split(/don't\(\).*?do\(\)/).join("do()");
    }

    
    
    // ------------------------------------------------------
    

    let get_do_do_blocks_and_stash_them = (current_soup)=>{
        const MATCH_DO_DO_BLOCK = /do\(\)(?:.(?!don't\(\)))*?do\(\)/gm;
        let found_do_do_blocks = current_soup.match(MATCH_DO_DO_BLOCK);
        // add them all to the do_do_blocks
        if(found_do_do_blocks!=null){
            found_do_do_blocks.forEach(element=>{stash_of_safe_bits.push(element);});
        }

        // get the left over stuff after collapsing consecutive do()
        let left_overs = current_soup.split(/do\(\)(?:.(?!don't\(\)))*?do\(\)/).join("do()");

        // lol enjoy
        return left_overs;
    }

    // ------------------------------------------------------

    let eat_a_helping_of_soup = (current_soup)=>{
        let combed = strip_dont_before_a_do(current_soup);
        let leftovers = get_do_do_blocks_and_stash_them(combed);
        return leftovers;
    }

    // ------------------------------------------------------
    // ------------------------------------------------------
    

    let soup_serving = STARTING_SOUP;
    while (soup_serving!=undefined && soup_serving!="do()") {
        // we pocket some of the soup, and eat the bits we like
        soup_serving = eat_a_helping_of_soup(soup_serving);
    }


    
    // ------------------------------------------------------
    // ------------------------------------------------------
    // ------ hobbits emptying the pockets

    const MERGED_SEMI_UNCORRUPTED = stash_of_safe_bits.join();
    
    // ------------------------------------------------------

    // ======= pt 1 code down here
    // ==============================

    const MATCH_LITERAL_NUMBER = /[1-9][0-9]{0,2}/gm;
    const MATCH_MUL_BLOCK = /mul\([1-9][0-9]{0,2},[1-9][0-9]{0,2}\)/gm;

    // gather legals
    let legal_mul_blocks = MERGED_SEMI_UNCORRUPTED.match(MATCH_MUL_BLOCK);


    // go through them all
    for (let legal_mul_index = 0; legal_mul_index < legal_mul_blocks.length; legal_mul_index++) {
        const current_mul_expression = legal_mul_blocks[legal_mul_index];
        // ------------------------------
        // get the numbers
        let current_nums = current_mul_expression.match(MATCH_LITERAL_NUMBER);
        // ------------------------------
        answer += Number(current_nums[0])*Number(current_nums[1]);
    }

    // ==============================
    return answer;
}





/**
 * suffering
 * mdo\(\)ul([1-9][0-9]{0,2},[1-9][0-9]{0,2})|mudo\(\)l([1-9][0-9]{0,2},[1-9][0-9]{0,2})|muldo\(\)([1-9][0-9]{0,2},[1-9][0-9]{0,2})|mul(do\(\)[1-9][0-9]{0,2},[1-9][0-9]{0,2})|mul([1-9]do\(\)[0-9]{0,2},[1-9][0-9]{0,2})|mul([1-9][0-9]{0,2}do\(\),[1-9][0-9]{0,2})|mul([1-9][0-9]{0,2},do\(\)[1-9][0-9]{0,2})|mul([1-9][0-9]{0,2},[1-9]do\(\)[0-9]{0,2})|mul([1-9][0-9]{0,2},[1-9][0-9]{0,2}do\(\))
 */