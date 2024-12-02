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
    /**
     * with the structure of:
     * ```
     * {
     *     raw: raw_input_data,
     *     lines: {
     *         raw: lines,
     *         broken_by_spaces: lines_split_on_space,
     *         character_grid: lines_broken_into_characters,
     *     },
     *     lines_without_empty: {
     *         raw: lines_without_empty,
     *         broken_by_spaces: lines_without_empty_split_on_space,
     *         character_grid: lines_without_empty_broken_into_characters,
     *     },
     * }
     * ```
     */
    const data_block = prep_data(raw_input_data);
    // break each line on the spaces
    const lined_token_lists = data_block.lines_without_empty.broken_by_spaces;
    // ==============================

    // ---- get lists ----
    const left_list_sorted = data_block.lines_without_empty.broken_by_spaces.map( (line_tokens)=>{ return Number(line_tokens[0]); } ).sort();
    const right_list_sorted = data_block.lines_without_empty.broken_by_spaces.map( (line_tokens)=>{ return Number(line_tokens[3]); } ).sort();
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