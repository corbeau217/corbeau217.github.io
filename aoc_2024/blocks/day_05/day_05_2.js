import {
    split_on_line_break,
    split_on_spaces,
    prep_data,
    clone_list,
    list_without_index,
} from "/aoc_2024/util.js";


/**
 * given raw input file
 * @param {*} raw_input_data input data block
 * @returns 
 */
export function code_block( raw_input_data ){
    // prepare answer reference
    let answer = 0;
    const raw_lines = raw_input_data.split("\n");
    // ==============================
    // ==============================
    const MATCH_ORDERING_RULE = /\d\d\|\d\d/;
    const MATCH_PAGE_UPDATE_RULE = /\d\d(?:,\d\d)+/;
    // ==============================
    // ==============================
    let raw_ordering_rule_lines = [];
    let raw_update_lines = [];
    // ==============================
    // ==============================
    let ordering_graph = new Map();
    // ==============================
    // ==============================
    let get_list_without_index = (list_to_copy, index_to_skip)=>{
        let result_list = [];
        for (let index = 0; index < list_to_copy.length; index++) {
            if(index!=index_to_skip){
                result_list.push( list_to_copy[index] );
            }
        }
        return result_list;
    }
    let get_list_without_items = (list_to_copy, items_to_ignore)=>{
        if(items_to_ignore==undefined){
            return list_to_copy;
        }
        let result_list = [];
        for (let index = 0; index < list_to_copy.length; index++) {
            const current_item = list_to_copy[index];
            // not in ignore list
            if(!items_to_ignore.includes(current_item)){
                result_list.push( current_item );
            }
        }
        return result_list;
    }
    // ==============================
    // ==============================
    /**
     * stash it where it goes
     * @param {*} single_line 
     */
    let categorise_line = (single_line)=>{
        if(MATCH_ORDERING_RULE.test(single_line)){
            raw_ordering_rule_lines.push(single_line);
        }
        else if(MATCH_PAGE_UPDATE_RULE.test(single_line)){
            raw_update_lines.push(single_line);
        }
    };
    let get_update_line_page_numbers = (update_line)=>{
        return update_line.split(",");
    };
    // ==============================
    // ==============================
    let get_order_rule_data = (order_line)=>{
        let numbers = order_line.split("|");
        return {
            page_number: numbers[0],
            require_next: numbers[1],
        };
    };
    let add_next_to_page_number = (page_number, new_next) => {
        let existing_node_data = ordering_graph.get(page_number);
        if(existing_node_data==undefined){
            // make a new node with next in the list
            ordering_graph.set(page_number, [new_next]);
        }
        else {
            // add the key
            existing_node_data.push(new_next);
            // replace the next list with what we made
            ordering_graph.set(page_number, existing_node_data);
        }
    };
    // ==============================
    // ==============================
    /**
     * test this number on all the other numbers before it, other number handle themself
     * @param {*} page_number 
     * @param {*} numbers_before_page 
     * @returns 
     */
    let any_illegal_numbers_before_page_number = (page_number, numbers_before_page)=>{
        let is_illegal = false;
        const page_order_rule_next_list = ordering_graph.get(page_number);
        // no rules, we bluff then
        if(page_order_rule_next_list==undefined){
            return false;
        }
        // all previous
        for (let before_index = 0; before_index < numbers_before_page.length; before_index++) {
            const previous_number = numbers_before_page[before_index];
            // what if illegal???
            if(page_order_rule_next_list.includes(previous_number)){
                // erm ackshuwally, i think you'll find that
                is_illegal = true;
                break;
            }
        }
        return is_illegal;
    }
    // ==============================
    // ==============================
    let page_update_line_is_illegal = (update_line)=>{
        let is_illegal = false;
        const update_line_numbers = get_update_line_page_numbers(update_line);

        // ----------------------------------------
        let index_has_illegals_before = ( index_to_check )=>{
            // checking first, has none before
            if(index_to_check == 0){
                return false;
            }
            // get the numbers before our location
            let numbers_before = update_line_numbers.slice(0,index_to_check);
            // test it's legal
            return any_illegal_numbers_before_page_number( update_line_numbers[index_to_check], numbers_before );
        }
        // ----------------------------------------

        for (let page_index = 0; page_index < update_line_numbers.length; page_index++) {
            if( index_has_illegals_before(page_index) ){
                is_illegal = true;
                break;
            }
        }

        return is_illegal;
    }
    // ==============================
    // ==============================
    let get_middle_number_from_list = (number_list)=>{
        const middle_index = Math.floor(number_list.length/2);
        return number_list[middle_index]; 
    }
    let add_middle_numbers_of_lines = (list_of_number_lists)=>{
        let sum_of_middles = 0;
        // loop all and add middle
        for (let line_index = 0; line_index < list_of_number_lists.length; line_index++) {
            const current_sub_list = list_of_number_lists[line_index];
            sum_of_middles += Number(get_middle_number_from_list(current_sub_list));
        }
        return sum_of_middles;
    }
    // ==============================
    // ==============================
    let initialise_ordering_graph = ()=>{
        // sort our raw lines
        for (let line_index = 0; line_index < raw_lines.length; line_index++) {
            const line_to_categorise = raw_lines[line_index];
            categorise_line(line_to_categorise);
        }
    
        // fill graph
        for (let order_line_index = 0; order_line_index < raw_ordering_rule_lines.length; order_line_index++) {
            const current_rule_data = get_order_rule_data(raw_ordering_rule_lines[order_line_index]);
            add_next_to_page_number( current_rule_data.page_number, current_rule_data.require_next );
        }
    }
    // ==============================
    // ==============================
    let get_incorrect_lines_as_list_of_lists = ()=>{
        let result_lines = [];
        for (let line_index = 0; line_index < raw_lines.length; line_index++) {
            const current_line_to_check = raw_lines[line_index];
            if(page_update_line_is_illegal(current_line_to_check)){
                result_lines.push( get_update_line_page_numbers(current_line_to_check) );
            }
        }
        return result_lines;
    }
    // ==============================
    // ==============================
    let fix_ordering_of_sublists = (list_of_number_lists)=>{
        let result_list_of_lists = [];
        for (let list_index = 0; list_index < list_of_number_lists.length; list_index++) {
            const sublist_to_fix = list_of_number_lists[list_index];
            result_list_of_lists.push( fix_ordering_of_number_list(sublist_to_fix) );
        }
        return result_list_of_lists;
    }
    // ==============================
    // ==============================
    let fix_ordering_of_number_list = (number_list)=>{
        let result_list = [];

        let working_list = clone_list(number_list);
        let list_of_chill_lists = [];

        let add_list_to_result = (list_to_add)=>{
            list_to_add.forEach(element => {
                result_list.push(element);
            });
        }

        // keep dividing while numbers exist
        while(working_list.length > 0){
            if(working_list.length == 1){
                list_of_chill_lists.push(working_list);
                break;
            }
            // split them
            const current_iteration_split = divide_numbers_by_fussy_or_chill(working_list);
            // replace working list with fussy
            working_list = current_iteration_split.fussy;
            // stash the chill
            list_of_chill_lists.push(current_iteration_split.chill);
        }
        // go back through the chill items, and take them in reverse order
        for (let index = list_of_chill_lists.length-1; index >= 0; index--) {
            const currently_most_fussy = list_of_chill_lists[index];
            add_list_to_result( currently_most_fussy );
        }

        return result_list;
    };
    let divide_numbers_by_fussy_or_chill = (list_of_numbers)=>{
        const chill_numbers = get_numbers_that_have_no_rules_in_list(list_of_numbers);
        const fussy_numbers = get_list_without_items(list_of_numbers,chill_numbers);
        return {
            fussy: fussy_numbers,
            chill: chill_numbers,
        };
    };
    let get_numbers_that_have_no_rules_in_list = (list_of_numbers)=>{
        if (list_of_numbers.length==1) {
            return list_of_numbers;
        }
        let non_fussy_numbers = [];
        for (let index = 0; index < list_of_numbers.length; index++) {
            const current_item = list_of_numbers[index];
            const list_without = get_list_without_index(list_of_numbers, index);
            if(!any_illegal_numbers_before_page_number(current_item,list_without)){
                non_fussy_numbers.push( current_item );
            }
        }
        return non_fussy_numbers;
    }
    // ==============================
    // ==============================

    initialise_ordering_graph();
    
    // get the incorrect lines
    const list_of_incorrect_lists = get_incorrect_lines_as_list_of_lists();
    const fixed_lists = fix_ordering_of_sublists(list_of_incorrect_lists);

    answer = add_middle_numbers_of_lines(fixed_lists);

    // ==============================
    return answer;
}