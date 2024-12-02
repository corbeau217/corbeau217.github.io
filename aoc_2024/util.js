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