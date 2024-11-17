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
export function unit_circle_points_vector2f(){
    // const sqrt_of_2 = 1.41421356237;
    const sqrt_of_3 = 1.73205080757;
    return [
        { x: 1.0,            y: 0.0,            }, // 0
        { x: sqrt_of_3/2.0,  y: 0.5,            }, // 1
        { x: 0.5,            y: sqrt_of_3/2.0,  }, // 2
        { x: 0.0,            y: 1.0,            }, // 3
        { x: -0.5,           y: sqrt_of_3/2.0,  }, // 4
        { x: -sqrt_of_3/2.0, y: 0.5,            }, // 5
        { x: -1.0,           y: 0.0,            }, // 6
        { x: -sqrt_of_3/2.0, y: -0.5,           }, // 7
        { x: -0.5,           y: -sqrt_of_3/2.0, }, // 8
        { x: 0.0,            y: -1.0,           }, // 9
        { x: 0.5,            y: -sqrt_of_3/2.0, }, // 10
        { x: sqrt_of_3/2.0,  y: -0.5,           }, // 11
    ];
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

export function unit_sphere_points_vector4f(){
    // get the points of our main platter
    let unit_circle_vectors = unit_circle_points_vector2f();
    // then we turn them into actual points
    // as how many plates there are stacked on top of each other
    let points = [];
    // top most point first
    points.push({
        x: 0.0,
        y: 1.0,
        z: 0.0,
        w: 1.0, // always 1.0 for saying it's a point in space
    });

    // --- 2nd highest layer ---
    let platter_y = unit_circle_vectors[2].y;
    let platter_radius = unit_circle_vectors[2].x;
    for (let platter_point = 0; platter_point < unit_circle_points.length; platter_point++) {
        const current_platter_point = unit_circle_points[platter_point];
        // uses the radius of the unit circle x axis
        //  and put the platter over x and z axis so y is perpendicular
        points.push({
            x: platter_radius * current_platter_point.x,
            y: platter_y,
            z: platter_radius * current_platter_point.y,
            w: 1.0,
        });
    }
    // --- 3rd highest layer ---
    platter_y = unit_circle_vectors[1].y;
    platter_radius = unit_circle_vectors[1].x;
    for (let platter_point = 0; platter_point < unit_circle_points.length; platter_point++) {
        const current_platter_point = unit_circle_points[platter_point];
        // uses the radius of the unit circle x axis
        //  and put the platter over x and z axis so y is perpendicular
        points.push({
            x: platter_radius * current_platter_point.x,
            y: platter_y,
            z: platter_radius * current_platter_point.y,
            w: 1.0,
        });
    }
    // --- middle layer ---
    platter_y = unit_circle_vectors[0].y;
    platter_radius = unit_circle_vectors[0].x;
    for (let platter_point = 0; platter_point < unit_circle_points.length; platter_point++) {
        const current_platter_point = unit_circle_points[platter_point];
        // uses the radius of the unit circle x axis
        //  and put the platter over x and z axis so y is perpendicular
        points.push({
            x: platter_radius * current_platter_point.x,
            y: platter_y,
            z: platter_radius * current_platter_point.y,
            w: 1.0,
        });
    }
    // --- 3rd lowest layer ---
    platter_y = unit_circle_vectors[11].y;
    platter_radius = unit_circle_vectors[11].x;
    for (let platter_point = 0; platter_point < unit_circle_points.length; platter_point++) {
        const current_platter_point = unit_circle_points[platter_point];
        // uses the radius of the unit circle x axis
        //  and put the platter over x and z axis so y is perpendicular
        points.push({
            x: platter_radius * current_platter_point.x,
            y: platter_y,
            z: platter_radius * current_platter_point.y,
            w: 1.0,
        });
    }
    // --- 2nd lowest layer ---
    platter_y = unit_circle_vectors[10].y;
    platter_radius = unit_circle_vectors[10].x;
    for (let platter_point = 0; platter_point < unit_circle_points.length; platter_point++) {
        const current_platter_point = unit_circle_points[platter_point];
        // uses the radius of the unit circle x axis
        //  and put the platter over x and z axis so y is perpendicular
        points.push({
            x: platter_radius * current_platter_point.x,
            y: platter_y,
            z: platter_radius * current_platter_point.y,
            w: 1.0,
        });
    }

    // lastly add the bottom most point
    points.push({
        x: 0.0,
        y: -1.0,
        z: 0.0,
        w: 1.0, // always 1.0 for saying it's a point in space
    });
}

export function unit_sphere_float_vertices(){
    // prepare vertices array
    let vertices = [];
    // get the vertices
    let unit_circle_vertices = unit_sphere_points_vector4f();
    // then we turn them into actual points
    for (let vertex_index = 0; vertex_index < unit_circle_vertices.length; vertex_index++) {
        const current_vertex = unit_circle_vertices[vertex_index];
        vertices.push(current_vertex.x);
        vertices.push(current_vertex.y);
        vertices.push(current_vertex.z);
        vertices.push(current_vertex.w);
    }
    return vertices;
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

export function unit_sphere_bindings(is_clockwise_winding){
    let bindings = [];
    // important information about our plates
    let plate_count = 5;
    let point_count = 12;
    let number_vertices = plate_count * point_count + 2; 
    // first point is the top most
    let top_index = 0;
    // last point is the bottom most
    let bottom_index = number_vertices-1;
    // to skip the top indext
    let plate_start_offset = 1;
    // where the last plate starts
    let bottom_plate_start_offset = ((plate_count-1)*point_count) + plate_start_offset;

    // do the faces connecting first plate to the top vertex
    // each point on the plate
    for (let point_index = 0; point_index < point_count; point_index++) {
        // ---- ---- ---- ---- ---- ---- ---- ----
        // bottom left
        const top_plate_current_index = plate_start_offset + point_index;
        // bottom right
        const top_plate_next_index = plate_start_offset + ((point_index+1)%point_count);
        // ---- ---- ---- ---- ---- ---- ---- ----
        // --- clockwise ---
        if(is_clockwise_winding){
            // triangle
            bindings.push(top_plate_current_index);
            bindings.push(bottom_index);
            bindings.push(top_plate_next_index);
        }
        // --- anticlockwise ---
        else{ 
            // triangle
            bindings.push(top_plate_current_index);
            bindings.push(top_plate_next_index);
            bindings.push(bottom_index);
        }
        // ---- ---- ---- ---- ---- ---- ---- ----
    }


    // do each plate, skipping last, since edges are the number of vertices minus 1
    //  |E| = |V| - 1
    for (let plate_index = 0; plate_index < plate_count-1; plate_index++) {
        // what point we start going around a plate
        const current_plate_start_index = (plate_index * point_count) + plate_start_offset;
        const next_plate_start_index = ((plate_index+1) * point_count) + plate_start_offset;
        // each point on the plate
        for (let point_index = 0; point_index < point_count; point_index++) {
            // ---- ---- ---- ---- ---- ---- ---- ----
            // top left
            const current_plate_current_index = current_plate_start_index + point_index;
            // top right, wrapped around to 0 when we're at the last point
            const current_plate_next_index = current_plate_start_index + ((point_index+1)%point_count);
            // bottom left
            const next_plate_current_index = next_plate_start_index + point_index;
            // bottom right
            const next_plate_next_index = next_plate_start_index + ((point_index+1)%point_count);
            // ---- ---- ---- ---- ---- ---- ---- ----
            // --- clockwise ---
            if(is_clockwise_winding){
                // triangle 1
                bindings.push(current_plate_current_index);
                bindings.push(current_plate_next_index);
                bindings.push(next_plate_next_index);
                // triangle 2
                bindings.push(current_plate_current_index);
                bindings.push(next_plate_next_index);
                bindings.push(next_plate_current_index);
            }
            // --- anticlockwise ---
            else {
                // triangle 1
                bindings.push(current_plate_current_index);
                bindings.push(next_plate_next_index);
                bindings.push(current_plate_next_index);
                // triangle 2
                bindings.push(current_plate_current_index);
                bindings.push(next_plate_current_index);
                bindings.push(next_plate_next_index);
            }
            // ---- ---- ---- ---- ---- ---- ---- ----
        }
    }
    // do the faces connecting last plate to the bottom vertex
    // each point on the plate
    for (let point_index = 0; point_index < point_count; point_index++) {
        // ---- ---- ---- ---- ---- ---- ---- ----
        // top left
        const bottom_plate_current_index = (bottom_plate_start_offset) + point_index;
        // top right
        const bottom_plate_next_index = (bottom_plate_start_offset) + ((point_index+1)%point_count);
        // ---- ---- ---- ---- ---- ---- ---- ----
        // --- clockwise ---
        if(is_clockwise_winding){
            // triangle
            bindings.push(bottom_plate_current_index);
            bindings.push(bottom_plate_next_index);
            bindings.push(bottom_index);
        }
        // --- anticlockwise ---
        else {
            // triangle
            bindings.push(bottom_plate_current_index);
            bindings.push(bottom_index);
            bindings.push(bottom_plate_next_index);
        }
        // ---- ---- ---- ---- ---- ---- ---- ----
    }

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