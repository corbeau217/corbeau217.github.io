export const ADVENT_CALENDER_DAYS = 25;

/**
 * break into lines
 * @param {*} data_block 
 * @returns list of lines
 */
export function split_on_line_break(data_block){
    return data_block.split("\n");
} 

/**
 * break into tokens using space as delimiter
 * @param {*} data_block probably a line of an input file
 * @returns list of tokens
 */
export function split_on_spaces(data_block){
    return data_block.split(" ");
}

/**
 * gather the specific index from each of the sublists and make a new list from them
 * @param {*} list_of_lists 
 * @param {*} sublist_index 
 * @returns 
 */
export function instance_copy_index_from_all_sublists(list_of_lists, sublist_index){
    let result_list = [];
    for (let list_index = 0; list_index < list_of_lists.length; list_index++) {
        const current_list = list_of_lists[list_index];
        result_list.push(current_list[sublist_index]);
    }
    return result_list;
}

/**
 * formats the number to start with 0 if it's less than 2 digits
 * @param {*} number 
 * @returns 
 */
export function pad_number(number){
    return `${(number<10)?"0":""}${number}`;
}


export function clone_list(list_input){
    let result = [];
    list_input.forEach(value => {
        result.push(value);
    });
    return result;
}

export function last_item_in_list(list_input){
    return list_input[list_input.length-1];
}

/**
 * @param {*} list_input list of something we can use length on
 */
export function non_empty_items_from_list(list_input){
    let result = [];
    list_input.forEach(item => {
        if(item.length > 0){
            result.push(item);
        }
    });
    return result;
}

export function break_lines_into_character_grid( lines_list ){
    // all lines, break into sublist of characters
    return lines_list.map( (current_line)=>{
        let line_chars = [];
        // each character in the line, add to line character list
        for (let char_index = 0; char_index < current_line.length; char_index++) {
            line_chars.push( current_line.charAt(char_index) );
        }
        // done current line character list
        return line_chars;
    });
}

export function split_string_list_on_spaces( string_list_input ){
    let result = [];
    string_list_input.forEach(line_data => {
        result.push(line_data.split(' '));
    });
    return result;
}

/**
 * break the raw data into usable information
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
 * @param {*} raw_input_data 
 */
export function prep_data( raw_input_data ){
    // -----------------------------------
    const lines_split = raw_input_data.split("\n");
    const lines_split_on_space = split_string_list_on_spaces(lines_split);
    // breaking into grid of characters
    const lines_broken_into_characters = break_lines_into_character_grid(lines_split);
    // -----------------------------------
    const lines_without_empty = non_empty_items_from_list(lines_split);
    const lines_without_empty_split_on_space = split_string_list_on_spaces(lines_without_empty);
    const lines_without_empty_broken_into_characters = break_lines_into_character_grid(lines_without_empty);
    // -----------------------------------
    return {
        raw: raw_input_data,
        lines: {
            raw: lines_split,
            broken_by_spaces: lines_split_on_space,
            character_grid: lines_broken_into_characters,
        },
        lines_without_empty: {
            raw: lines_without_empty,
            broken_by_spaces: lines_without_empty_split_on_space,
            character_grid: lines_without_empty_broken_into_characters,
        },
    };
    // -----------------------------------

}