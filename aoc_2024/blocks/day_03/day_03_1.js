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
    // ==============================

    const MATCH_LITERAL_NUMBER = /[1-9][0-9]{0,2}/gm;
    const MATCH_MUL_BLOCK = /mul\([1-9][0-9]{0,2},[1-9][0-9]{0,2}\)/gm;
    
    // gather legals
    let legal_mul_blocks = raw_input_data.match(MATCH_MUL_BLOCK);


    // go through them all
    for (let legal_mul_index = 0; legal_mul_index < legal_mul_blocks.length; legal_mul_index++) {
        const current_mul_expression = legal_mul_blocks[legal_mul_index];
        // ------------------------------
        // get the numbers
        let current_nums = current_mul_expression.match(MATCH_LITERAL_NUMBER);
        // ------------------------------
        answer += Number(current_nums[0])*Number(current_nums[1]);
    }

    // do match
    // TODO:  do the day

    // ==============================
    return answer;
}