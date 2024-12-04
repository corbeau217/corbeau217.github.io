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

    let all_same_length = (raw_lines)=>{
        let first_length = raw_lines[0].length;
        let so_true = true;
        for (let i = 0; i < raw_lines.length; i++) {
            if(raw_lines[i].length != first_length){
                so_true = false;
                break;
            }
        }
        return so_true;
    }

    let legal_index = (index,length_of_indexable)=>{
        return index >= 0 && index < length_of_indexable;
    };
    let string_of_dots = (count)=>{
        let result = "";
        for (let i = 0; i < count; i++) {
            result = result + ".";
        }
        return result;
    };
    let pad_line_with_dots = (raw_line, left_dot_count, right_dot_count)=>{
        return `${string_of_dots(left_dot_count)}${raw_line}${string_of_dots(right_dot_count)}`;
    };
    let reverse_all_lines = (raw_lines)=>{
        let result_lines = [];
        // --------------------------------------
        for (let line_index = 0; line_index < raw_lines.length; line_index++) {
            const current_line = raw_lines[line_index];
            let reversed_line = "";
            for (let char_index = 0; char_index < current_line.length; char_index++) {
                const curr_char = current_line.charAt(char_index);
                reversed_line = `${curr_char}${reversed_line}`;
            }
            result_lines.push(reversed_line);
        }
        // --------------------------------------
        return result_lines;
    };
    let make_n_empty_lines = (n)=>{
        let empty_lines = [];
        for (let i = 0; i < n; i++) {
            empty_lines.push("");
        }
        return empty_lines;
    };
    // ------------------------------------------------------------
    // ------------------------------------------------------------
    let get_vertical_lines = (raw_lines)=>{
        const COLUMN_COUNT = raw_lines[0].length;
        let result_lines = make_n_empty_lines(COLUMN_COUNT);
        // ------------------------------------------------------------
        for (let row_index = 0; row_index < raw_lines.length; row_index++) {
            for (let column_index = 0; column_index < COLUMN_COUNT; column_index++) {
                // add to existing
                result_lines[column_index] = `${result_lines[column_index]}${raw_lines[row_index].charAt(column_index)}`;
            }
        }
        // ------------------------------------------------------------
        return result_lines;
    };
    
    // ------------------------------------------------------------
    // ------------------------------------------------------------



    let get_left_leaning_rhombus_lines = (raw_lines)=>{
        let result_lines = [];
        // ------------------------------------------------------------
        const LINES_COUNT = raw_lines.length;
        const INITIAL_RIGHT_PADDING = LINES_COUNT-1;
        // ------------------------------------------------------------
        for (let line_index = 0; line_index < raw_lines.length; line_index++) {
            const current_line = raw_lines[line_index];
            // ----------------------------
            const LEFT_PADDING = line_index;
            // right padding is what's left
            const RIGHT_PADDING = INITIAL_RIGHT_PADDING-LEFT_PADDING;
            // ----------------------------
            // make line and add
            result_lines.push(pad_line_with_dots(current_line,LEFT_PADDING,RIGHT_PADDING));
            // ----------------------------
        }
        // ------------------------------------------------------------
        return result_lines;
    }
    let get_right_leaning_rhombus_lines = (raw_lines)=>{
        let result_lines = [];
        // ------------------------------------------------------------
        const LINES_COUNT = raw_lines.length;
        const INITIAL_LEFT_PADDING = LINES_COUNT-1;
        // ------------------------------------------------------------
        for (let line_index = 0; line_index < raw_lines.length; line_index++) {
            const current_line = raw_lines[line_index];
            // ----------------------------
            const RIGHT_PADDING = line_index;
            // left padding is what's left
            const LEFT_PADDING = INITIAL_LEFT_PADDING-RIGHT_PADDING;
            // ----------------------------
            // make line and add
            result_lines.push(pad_line_with_dots(current_line,LEFT_PADDING,RIGHT_PADDING));
            // ----------------------------
        }
        // ------------------------------------------------------------
        return result_lines;
    }
    
    // ------------------------------------------------------------
    // ------------------------------------------------------------
    let get_cardinal_lines = (raw_lines)=>{
        let result_lines = [];
        // ------------------------------------------------------------
        let stash_in_result = (lines)=>{
            lines.forEach(elem=>{result_lines.push(elem);});
        };
        // ------------------------------------------------
        const raw_lines_reversed      = reverse_all_lines(  raw_lines      );
        const vertical_lines          = get_vertical_lines( raw_lines      );
        const vertical_lines_reversed = reverse_all_lines(  vertical_lines );
        // ------------------------------------------------
        stash_in_result( raw_lines                         );
        stash_in_result( raw_lines_reversed                );
        stash_in_result( vertical_lines                    );
        stash_in_result( vertical_lines_reversed           );
        // ------------------------------------------------
        return result_lines;
    };
    // ------------------------------------------------------------
    // ------------------------------------------------------------

    let get_diagonal_lines = (raw_lines)=>{
        let result_lines = [];
        // ------------------------------------------------------------
        let stash_in_result = (lines)=>{
            lines.forEach(elem=>{result_lines.push(elem);});
        };
        // ------------------------------------------------------------
        const LEFT_LEANING_RHOMBUS_LINES = get_left_leaning_rhombus_lines(raw_lines);
        const RIGHT_LEANING_RHOMBUS_LINES = get_right_leaning_rhombus_lines(raw_lines);
        // ------------------------------------------------------------
        const VERTICAL_FROM_LEFT_LEANING = get_vertical_lines(LEFT_LEANING_RHOMBUS_LINES);
        const VERTICAL_FROM_RIGHT_LEANING = get_vertical_lines(RIGHT_LEANING_RHOMBUS_LINES);
        // ------------------------------------------------------------
        stash_in_result( VERTICAL_FROM_LEFT_LEANING                     );
        stash_in_result( VERTICAL_FROM_RIGHT_LEANING                    );
        stash_in_result( reverse_all_lines(VERTICAL_FROM_LEFT_LEANING)  );
        stash_in_result( reverse_all_lines(VERTICAL_FROM_RIGHT_LEANING) );
        // ------------------------------------------------------------
        return result_lines;
    };

    // ------------------------------------------------------------
    // ------------------------------------------------------------
    let get_all_directions = (raw_lines)=>{
        let result_lines = [];
        // ------------------------------------------------
        let stash_in_result = (lines)=>{
            lines.forEach(elem=>{result_lines.push(elem);});
        };
        // ------------------------------------------------
        const cardinal = get_cardinal_lines(raw_lines);
        const diagonal = get_diagonal_lines(raw_lines);
        // ------------------------------------------------
        stash_in_result( cardinal );
        stash_in_result( diagonal );
        // ------------------------------------------------
        return result_lines;
    };
    // ------------------------------------------------------------
    // ------------------------------------------------------------

    console.log(`are they the same length?: ${all_same_length(data_block.lines_without_empty.raw)}`);

    const XMAS_MATCHER = /XMAS/gm;
    const ALL_LINE_DIRECTIONS = get_all_directions( data_block.lines_without_empty.raw );
    // ------------------------------------------------------------
    // ------------------------------------------------------------

    const SCAN_ALL_DIRS_FOR_XMAS = ALL_LINE_DIRECTIONS.map(elem=>{
        return elem.match(XMAS_MATCHER);
    });
    SCAN_ALL_DIRS_FOR_XMAS.forEach(line_results=>{
        if(line_results!=null){
            answer += line_results.length;
        }
    });

    // ==============================
    return answer;
}