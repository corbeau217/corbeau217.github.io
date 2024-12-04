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
    const ROW_COUNT = data_block.lines_without_empty.raw.length;
    const COLUMN_COUNT = data_block.lines_without_empty.raw[0].length;
    
    let is_legal_x = (x)=>{ return x >= 0 && x < COLUMN_COUNT; };
    let is_legal_y = (y)=>{ return y >= 0 && y < COLUMN_COUNT; };
    let is_legal_location = (x,y)=>{ return is_legal_x(x)&&is_legal_y(y); };
    /**
     * doesnt handle out of bounds
     */
    let get_location = (x,y)=>{ return data_block.lines_without_empty.character_grid[y][x]; };
    /**
     * handles errors and converts to string
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    let get_location_or_dot = (x,y)=>{ return (is_legal_location(x,y))?`${get_location(x,y)}`:"."; }
    let get_cross_for_location = (x,y)=>{
        return {
            top_left:     get_location_or_dot( x-1, y-1 ),
            top_right:    get_location_or_dot( x+1, y-1 ),
            center:       get_location_or_dot( x+0, y+0 ),
            bottom_right: get_location_or_dot( x+1, y+1 ),
            bottom_left:  get_location_or_dot( x-1, y+1 ),
        };
    };
    /**
     * symmetrical
     * @param {*} cross_data 
     */
    let cross_is_MAS_MAS = (cross_data)=>{
        return (
            // fail early if center isn't A
            cross_data.center === "A" &&
            // fail early when any are not M or S
            (cross_data.top_left === "M" || cross_data.top_left === "S") &&
            (cross_data.top_right === "M" || cross_data.top_right === "S") &&
            (cross_data.bottom_left === "M" || cross_data.bottom_left === "S") &&
            (cross_data.bottom_right === "M" || cross_data.bottom_right === "S")
        ) && ( // diagonal corners are different
            (cross_data.top_left === "M" && cross_data.bottom_right === "S") ||
            (cross_data.top_left === "S" && cross_data.bottom_right === "M") 
        ) && ( // single line of symmetrical (diagonals different means only 1 possible)
            // test vertical symmetry
            ( cross_data.top_left === cross_data.top_right && cross_data.bottom_left === cross_data.bottom_right ) ||
            // test horizontal symmetry
            ( cross_data.top_left === cross_data.bottom_left && cross_data.top_right === cross_data.bottom_right )
        );
    };

    for (let current_row_index = 0; current_row_index < ROW_COUNT; current_row_index++) {
        for (let current_column_index = 0; current_column_index < COLUMN_COUNT; current_column_index++) {
            if( cross_is_MAS_MAS( get_cross_for_location( current_column_index, current_row_index ) ) ){
                answer+=1;
            }
        }
    }

    // ==============================
    return answer;
}