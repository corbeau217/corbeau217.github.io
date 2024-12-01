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
    // ---- make hashmap of left ----
    let left_values_count_map = new Map();
    left_list_sorted.forEach(element => {
        left_values_count_map.set(element, 0);
    });
    // ---- all the right elements ----
    right_list_sorted.forEach(element => {
        // grab the element
        let element_count = left_values_count_map.get(element);
        // check exists
        if(element_count!=undefined){
            // increase the count
            left_values_count_map.set(element, element_count+1);
        }
    });
    // ---- now all the elements multiplied byt the count of them ----
    left_values_count_map.forEach((right_count,left_elem) => {
        answer += (left_elem * right_count);
    });
    
    // ==============================
    return answer;
}