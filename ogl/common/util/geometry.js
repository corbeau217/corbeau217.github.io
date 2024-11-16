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

export function unit_circle_points(){
    // const sqrt_of_2 = 1.41421356237;
    const sqrt_of_3 = 1.73205080757;
    return [
        1.0, 0.0,
        sqrt_of_3/2.0, 0.5,
        0.5, sqrt_of_3/2.0,
        0.0, 1.0,
        -0.5, sqrt_of_3/2.0,
        -sqrt_of_3/2.0, 0.5,
        -1.0, 0.0,
        -sqrt_of_3/2.0, -0.5,
        -0.5, -sqrt_of_3/2.0,
        0.0, -1.0,
        0.5, -sqrt_of_3/2.0,
        sqrt_of_3/2.0, -0.5,
    ];
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
        //  index_to_fan, right[i], right[i+1] 
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

export function cross_product(vector_a, vector_b){
    return {
        x: ((vector_a.y*vector_b.z)-(vector_a.z*vector_b.y)),
        y: ((vector_a.z*vector_b.x)-(vector_a.x*vector_b.z)),
        z: ((vector_a.x*vector_b.y)-(vector_a.y*vector_b.x)),
    };
}

// generate a normal for the face
export function get_face_normal(first_vertex, second_vertex, third_vertex){
    // get difference vectors
    const vector_a = {
        x: second_vertex.x - first_vertex.x,
        y: second_vertex.y - first_vertex.y,
        z: second_vertex.z - first_vertex.z,
    };
    const vector_b = {
        x: third_vertex.x - second_vertex.x,
        y: third_vertex.y - second_vertex.y,
        z: third_vertex.z - second_vertex.z,
    };
    // do cross product
    const cross = cross_product(vector_a, vector_b);
    // make a vector from the result
    return {
        x: cross.x,
        y: cross.y,
        z: cross.z,
        w: 0.0, // vector not point
    };
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

// assumes that we're using array of floats and bindings with 4 values per vertex, and 3 bindings per triangle
export function generate_normals(vertex_list, binding_list){
    let normals = [];
    // all bindings are grouped in 3s for a triangle, so jump 3 at a time
    for (let binding_index = 0; binding_index < binding_list.length; binding_index += 3) {
        // gather the face bindings
        const face_bindings = [
            binding_list[binding_index],
            binding_list[binding_index+1],
            binding_list[binding_index+2],
        ];
        // since we're dealing with values per vertex
        const vertex_indices = [
            face_bindings[0]*4,
            face_bindings[1]*4,
            face_bindings[2]*4,
        ];
        // now get the vertex data
        const face_vertices = [
            { x:vertex_list[vertex_indices[0]], y:vertex_list[vertex_indices[0]+1], z:vertex_list[vertex_indices[0]+2], w:vertex_list[vertex_indices[0]+3] },
            { x:vertex_list[vertex_indices[1]], y:vertex_list[vertex_indices[1]+1], z:vertex_list[vertex_indices[1]+2], w:vertex_list[vertex_indices[1]+3] },
            { x:vertex_list[vertex_indices[2]], y:vertex_list[vertex_indices[2]+1], z:vertex_list[vertex_indices[2]+2], w:vertex_list[vertex_indices[2]+3] },
        ];
        // now get the normal for the face
        const face_normal = get_face_normal(face_vertices[0], face_vertices[1], face_vertices[2]);

        // do it 3 times for each of the bindings of the face
        normals.push(face_normal.x); normals.push(face_normal.y); normals.push(face_normal.z); normals.push(face_normal.w);
        normals.push(face_normal.x); normals.push(face_normal.y); normals.push(face_normal.z); normals.push(face_normal.w);
        normals.push(face_normal.x); normals.push(face_normal.y); normals.push(face_normal.z); normals.push(face_normal.w);
    }
}


// ############################################################################################
// ############################################################################################
// ############################################################################################