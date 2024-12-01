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

    // TODO:  do the day

    // ==============================
    return answer;
}