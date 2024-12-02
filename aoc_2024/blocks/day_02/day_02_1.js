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


    for (let report_index = 0; report_index < report_map.length; report_index++) {
        const current_report = report_map[report_index];

        const first = current_report[0];
        const second = current_report[1];
        const first_second_diff = second-first;

        // test direction
        const increasing = first_second_diff>0;

        if(!safe_difference(increasing, first, second)){
            // go next, bad
            continue;
        }

        // whether to count
        let count_report = true;

        // start second
        for (let level_index = 1; level_index < current_report.length-1; level_index++) {
            const current = current_report[level_index];
            const next = current_report[level_index+1];

            if(!safe_difference(increasing, current, next)){
                count_report=false;
                // go next, bad
                break;
            }
        }
        
        // count if good
        if(count_report) answer++;
    }

    // ==============================
    return answer;
}