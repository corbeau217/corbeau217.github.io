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
    // ==============================
    // ==============================

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

    // loop all and ignore illegals
    for (let update_line_index = 0; update_line_index < raw_update_lines.length; update_line_index++) {
        const raw_current_update = raw_update_lines[update_line_index];
        if(!page_update_line_is_illegal(raw_current_update)){
            const update_pages = get_update_line_page_numbers(raw_current_update);
            answer += Number(get_middle_number_from_list(update_pages));
        }
    }

    // ==============================
    return answer;
}