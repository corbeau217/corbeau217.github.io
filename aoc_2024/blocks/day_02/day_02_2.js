import {
    split_on_line_break,
    split_on_spaces,
    prep_data,
    clone_list,
    unique_sorted,
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

    const report_map = data_block.lines_without_empty.broken_by_spaces;

    let safe_difference = (is_increasing, first, second)=>{
        const difference = second - first;
        if(difference==0){
            return false;
        }
        if(is_increasing){
            if(difference <= 3 && difference > 0){
                return true;
            }
            return false;
        }
        if(difference >= -3 && difference < 0){
            return true;
        }
        return false;
    }
    let is_safe_report = (is_ascending, level_list)=>{
        for (let level_index = 0; level_index < level_list.length-1; level_index++) {
            const current_level = level_list[level_index];
            const next_level = level_list[level_index+1];
            // wasnt safe
            if(!safe_difference(is_ascending, current_level, next_level)){
                return false;
            }
        }
        return true;
    }

    
    // ================================================
    let direction_counts = [];
    for (let report_index = 0; report_index < report_map.length; report_index++) {
        const current_report = report_map[report_index];
        
        let current_direction_counts = {
            ascending: 0,
            descending: 0,
            equality: 0,
        };
        // count how many of each
        for (let level_index = 1; level_index < current_report.length; level_index++) {
            const previous_level = current_report[level_index-1];
            const current_level = current_report[level_index];
            const level_difference = current_level-previous_level;
            if(level_difference < 0){
                current_direction_counts.descending += 1;
            }
            else if(level_difference > 0){
                current_direction_counts.ascending += 1;
            }
            else {
                current_direction_counts.equality += 1;
            }
        }
        direction_counts.push(current_direction_counts);
    }
    // ================================================

    // ================================================
    // ==== check majority ascending
    let ascending_check_list = [];
    for (let report_index = 0; report_index < direction_counts.length; report_index++) {
        const current_report_counts = direction_counts[report_index];

        // .............................

        ascending_check_list.push( current_report_counts.ascending > current_report_counts.descending );
    }
    // ================================================



    // ================================================

    for (let report_index = 0; report_index < report_map.length; report_index++) {
        const current_report = report_map[report_index];
        const is_ascending = ascending_check_list[report_index];
        // .............................

        let found_safe_removal = false;
        for (let level_index = 0; level_index < current_report.length; level_index++) {
            const without_current = list_without_index(current_report,level_index);
            // good enough, move along
            if(is_safe_report(is_ascending, without_current)){
                found_safe_removal = true;
                break;
            }
        }
        // when it was safe, count
        if(found_safe_removal){
            answer++;
        }

        // .............................
    }
    
    // ================================================
    // ================================================
    
    
    
    
    
    
    
    // ==============================
    return answer;
}





    // // ================================================
    // // ==== copy all the reports as sorted
    // let unique_sorted_reports = [];
    // for (let report_index = 0; report_index < report_map.length; report_index++) {
    //     const current_report = report_map[report_index];
    //     unique_sorted_reports.push(unique_sorted(current_report));
    // }
    // // ================================================
    // // ==== only keep the items that are the same as they were
    // let no_duplicates_report_map = [];
    // for (let report_index = 0; report_index < unique_sorted_reports.length; report_index++) {
    //     const current_unique_report = unique_sorted_reports[report_index];
    //     const current_standard_report = unique_sorted_reports[report_index];
    //     // same length without duplicates
    //     if(current_standard_report.length == current_unique_report.length){

    //         // include it
    //         no_duplicates_report_map.push({
    //             raw: clone_list(current_standard_report),
    //             sorted: clone_list(current_unique_report),
    //         });
    //     }
    // }
    // console.log( `[lines: ${report_map.length}]\n[all unique: ${no_duplicates_report_map.length}]`);
    // // ================================================