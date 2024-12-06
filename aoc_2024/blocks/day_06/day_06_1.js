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
    const DIRECTION_COUNT = 4;
    const HASH_CHAR = '#';
    const COLUMN_COUNT = data_block.lines_without_empty.character_grid[0].length;
    const ROW_COUNT = data_block.lines_without_empty.character_grid.length;
    // ==============================
    let end_lists = {
        column: {
            left: [],
            right: [],
        },
        row: {
            top: [],
            bottom: [],
        }
    }
    // ==============================
    /**
     * make end lists 
     */
    let initialise_end_lists = ()=>{
        // all rows
        for (let y_index = 0; y_index < ROW_COUNT; y_index++) {
            end_lists.row.top.push(new Map());
            end_lists.row.bottom.push(new Map());
        }
        // all columns
        for (let x_index = 0; x_index < COLUMN_COUNT; x_index++) {
            end_lists.row.top.push(new Map());
            end_lists.row.bottom.push(new Map());
        }
    };
    /**
     * make end lists and then add to them
     * @param {*} character_grid 
     */
    let fill_end_lists = (character_grid)=>{
        // all rows
        for (let y_index = 0; y_index < ROW_COUNT; y_index++) {
            const grid_row = character_grid[y_index];
            // all columns in row
            for (let x_index = 0; x_index < COLUMN_COUNT; x_index++) {
                const current_character = grid_row[x_index];
                // found hash
                if (current_character === HASH_CHAR) {
                    // add it in all directions
                    for (let direction = 0; direction < DIRECTION_COUNT; direction++) {
                        add_hash_to_list(x_index,y_index,direction);
                    }
                }
            }
        }
    };
    initialise_end_lists();
    fill_end_lists(data_block.lines_without_empty.character_grid);
    // ==============================
    /**
     * given a location of a hash, it gets added to the list at the end of the rows/columns
     * @param {*} hash_x_index 
     * @param {*} hash_y_index 
     * @param {*} direction 
     */
    let add_hash_to_list = (hash_x_index, hash_y_index, direction)=>{
        // TODO: add to list
    };
    // ==============================
    /**
     * test location for legality
     * @param {*} x_index 
     * @param {*} y_index 
     * @returns 
     */
    let is_legal_indices=(x_index,y_index)=>{
        return (x_index >= 0 && x_index < COLUMN_COUNT) && (y_index >= 0 && y_index < ROW_COUNT);
    };
    // ==============================
    let is_direction_vertical=(direction)=>{ return direction%2==0; };
    let is_direction_horizontal=(direction)=>{ return direction%2!=0; };
    /**
     * get the end list by direction
     * * `0` - UP
     * * `1` - RIGHT
     * * `2` - DOWN
     * * `3` - LEFT
     * @param {*} direction in range: [0,1,2,3]
     * @returns 
     */
    let get_end_list_by_direction=(direction)=>{
        switch (direction) {
            default:
            case 0: return end_lists.row.top;
            case 1: return end_lists.column.right;
            case 2: return end_lists.row.bottom;
            case 3: return end_lists.column.left;
        }
    };
    // ==============================
    /**
     * test if already handled all the collisions
     * @param {*} x_index 
     * @param {*} y_index 
     * @param {*} direction 
     * @param {*} end_list 
     */
    let has_more_collisions=(x_index,y_index,direction,end_list)=>{
        // TODO: ...
    }
    let has_more_collisions_up=(x_index,y_index,end_list)=>{
        // TODO: ...
    }
    let has_more_collisions_right=(x_index,y_index,end_list)=>{
        // TODO: ...
    }
    let has_more_collisions_down=(x_index,y_index,end_list)=>{
        // TODO: ...
    }
    let has_more_collisions_left=(x_index,y_index,end_list)=>{
        // TODO: ...
    }
    // ==============================
    /**
     * gather the location it will collide with a hash
     * @param {*} x_index 
     * @param {*} y_index 
     * @param {*} direction 
     */
    let get_collision_location_by_indices_and_direction = (x_index, y_index, direction)=>{
        // TODO: 
    };
    // ==============================

    // TODO:  do the day
    answer = "in-progress";

    // ==============================
    return answer;
}