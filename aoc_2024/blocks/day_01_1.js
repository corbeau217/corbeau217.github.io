import {
    split_on_line_break,
    split_on_spaces,
} from "/aoc_2024/util.js";


/**
 * given raw input file
 * @param {*} raw_input_data input data block
 * @returns 
 */
export function code_block( raw_input_data ){
    // prepare answer reference
    let answer = 0;
    // break each 
    const lines = split_on_line_break(raw_input_data);
    // break each line on the spaces
    const lined_token_lists = lines.map((current_line)=>{return split_on_spaces(current_line);});
    // ==============================

    // ---- get lists ----
    const left_list_sorted = lined_token_lists.map( (line_tokens)=>{ return Number(line_tokens[0]); } ).sort();
    const right_list_sorted = lined_token_lists.map( (line_tokens)=>{ return Number(line_tokens[3]); } ).sort();
    // ---- make differences ----
    let difference_list = [];
    for (let index = 0; index < left_list_sorted.length; index++) {
        const left = left_list_sorted[index];
        const right = right_list_sorted[index];
        // difference values
        difference_list.push( Math.abs(left-right) );
    }
    // ---- make total difference ----
    difference_list.forEach( (difference_value)=>{ answer += difference_value; } );
    
    // ==============================
    return answer;
}