// ############################################################################################
// ############################################################################################
// ############################################################################################

const TAU = 2.0 * Math.PI;

// ############################################################################################
// ############################################################################################
// ############################################################################################

export function circle_points_radius(number_of_points, radius_of_circle){
    let resulting_points = [];
    let angle_between_points = (1.0/number_of_points)*TAU;
    // if(radius_of_circle == 0.0){
    //     // raw point
    //     return [0.0, 0.0];
    // }
    // find the points
    for (let current_index = 0; current_index < number_of_points; current_index++) {
        const theta = angle_between_points * current_index;
        // trig values
        const cos_theta = Math.cos(theta);
        const sin_theta = Math.sin(theta);
        // add them to the list
        // x first
        resulting_points.push(radius_of_circle * cos_theta);
        // y next
        resulting_points.push(radius_of_circle * sin_theta);
    }
    return resulting_points;
}

export function circle_points(number_of_points){
    let resulting_points = [];
    let angle_between_points = (1.0/number_of_points)*TAU;
    // find the points
    for (let current_index = 0; current_index < number_of_points; current_index++) {
        const theta = angle_between_points * current_index;
        // trig values
        const cos_theta = Math.cos(theta);
        const sin_theta = Math.sin(theta);
        // add them to the list
        // x first
        resulting_points.push(cos_theta);
        // y next
        resulting_points.push(sin_theta);
    }
    return resulting_points;
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

/**
 *    |     \    |
 *    |       \  |
 *  [i-1] ---- [i-1]
 *    | \        |
 *    |   \      |
 *    |     \    |
 *    |       \  |
 *  [ i ] ---- [ i ]
 *    | \        |
 *    |   \      |
 *    |     \    |
 *    |       \  |
 *  [i+1] ---- [i+1]
 *    | \        |
 *    |   \      |
 * 
 * @brief knits together the left and right vertices, where `i` is the current index
 *          assuming that both lists are the same length
 * @param {*} index_list_left  list of bindings
 * @param {*} index_list_right  list of bindings to knit together with
 */
export function tesselate_between_indices_lists(index_list_left, index_list_right){
    // index array in groups of three
    let resulting_indices_list = [];

    // all indices
    //      assume that the left and right are both the same length
    for (let current_index = 0; current_index < index_list_left.length; current_index++) {
        // prepare shorthand references, using modulo to wrap around
        const left_current = index_list_left[current_index];
        const left_next =    index_list_left[(current_index+1)%index_list_left.length];
        const right_current = index_list_right[current_index];
        const right_next =    index_list_right[(current_index+1)%index_list_right.length];
        // triangle 1 is:
        //  left[i], right[i], right[i+1] 
        resulting_indices_list.push( left_current );
        resulting_indices_list.push( right_current );
        resulting_indices_list.push( right_next );

        // triangle 2 is:
        //  left[i], right[i+1], left[i+1] 
        resulting_indices_list.push( left_current );
        resulting_indices_list.push( right_next );
        resulting_indices_list.push( left_next );
    }

    return resulting_indices_list;
}


export function tesselate_indices_list_to_index(index_list_left, index_to_fan){
    // index array in groups of three
    let resulting_indices_list = [];

    // all indices
    for (let current_index = 0; current_index < index_list_left.length; current_index++) {
        // prepare shorthand references, using modulo to wrap around
        const left_current = index_list_left[current_index];
        const left_next =    index_list_left[(current_index+1)%index_list_left.length];

        // triangle is:
        //  left[i], index_to_fan, left[i+1] 
        resulting_indices_list.push( left_current );
        resulting_indices_list.push( index_to_fan );
        resulting_indices_list.push( left_next );
    }

    return resulting_indices_list;
}

export function tesselate_indices_index_to_list(index_to_fan, index_list_right){
    // index array in groups of three
    let resulting_indices_list = [];

    // all indices
    for (let current_index = 0; current_index < index_list_right.length; current_index++) {
        // prepare shorthand references, using modulo to wrap around
        const right_current = index_list_right[current_index];
        const right_next =    index_list_right[(current_index+1)%index_list_right.length];

        // triangle is:
        //  left[i], index_to_fan, left[i+1] 
        resulting_indices_list.push( index_to_fan );
        resulting_indices_list.push( right_current );
        resulting_indices_list.push( right_next );
    }

    return resulting_indices_list;
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

// returns left array with the right array added
export function concatenate_arrays(left_array, right_array){
    for (let index = 0; index < right_array.length; index++) {
        const element = right_array[index];
        left_array.push(right_array[index]);    
    }
    return left_array;
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

// converts list of vector2f points to a float list
export function vector2f_list_to_float_list(vector2f_list){
    let result = [];
    for (let index = 0; index < vector2f_list.length; index++) {
        const current_element = vector2f_list[index];
        result.push(current_element.x);
        result.push(current_element.y);
    }
    return result;
}

// ############################################################################################
// ############################################################################################
// ############################################################################################