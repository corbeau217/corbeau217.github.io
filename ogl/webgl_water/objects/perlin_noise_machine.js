
function get_corner_difference_vectors( quad_pos ){
    return {
        top_left:     vec2.fromValues( quad_pos.x,     quad_pos.y-1.0 ),
        bottom_left:  vec2.fromValues( quad_pos.x,     quad_pos.y     ),
        top_right:    vec2.fromValues( quad_pos.x-1.0, quad_pos.y-1.0 ),
        bottom_right: vec2.fromValues( quad_pos.x-1.0, quad_pos.y     ),
    }
}
function get_clamped_vectors( corner_difference_vectors ){
    // (static) min(out, a, b) → {vec2}
    // Returns the minimum of two vec2's 
    // .. 
    // (static) normalize(out, a) → {vec2}
    // Normalize a vec2 
    // ..

    // ---- get the normalized vectors ----
    let normalized_vectors = {
        top_left:     vec2.create(),
        bottom_left:  vec2.create(),
        top_right:    vec2.create(),
        bottom_right: vec2.create(),
    };
    vec2.normalize( normalized_vectors.top_left, corner_difference_vectors.top_left );
    vec2.normalize( normalized_vectors.bottom_left, corner_difference_vectors.bottom_left );
    vec2.normalize( normalized_vectors.top_right, corner_difference_vectors.top_right );
    vec2.normalize( normalized_vectors.bottom_right, corner_difference_vectors.bottom_right );

    // ---- keep the smallest in length ----
    let result = {
        top_left:     vec2.create(),
        bottom_left:  vec2.create(),
        top_right:    vec2.create(),
        bottom_right: vec2.create(),
    };
    vec2.min( result.top_left, corner_difference_vectors.top_left, normalized_vectors.top_left );
    vec2.min( result.bottom_left, corner_difference_vectors.bottom_left, normalized_vectors.bottom_left );
    vec2.min( result.top_right, corner_difference_vectors.top_right, normalized_vectors.top_right );
    vec2.min( result.bottom_right, corner_difference_vectors.bottom_right, normalized_vectors.bottom_right );

    return result;
}
function get_dot_products( corner_gradients, corner_difference_vectors ){
    // (static) dot(a, b) → {Number}
    // Calculates the dot product of two vec2's 
    // ...
    return {
        top_left:     vec2.dot( corner_gradients.top_left, corner_difference_vectors.top_left ),
        bottom_left:  vec2.dot( corner_gradients.bottom_left, corner_difference_vectors.bottom_left ),
        top_right:    vec2.dot( corner_gradients.top_right, corner_difference_vectors.top_right ),
        bottom_right: vec2.dot( corner_gradients.bottom_right, corner_difference_vectors.bottom_right ),
    };
}
function get_interpolation_of_dots( dot_products, quad_location ){
    let top_interpolation = (1.0-quad_location.x)*dot_products.top_left + (quad_location.x)*dot_products.top_right;
    let bottom_interpolation = (1.0-quad_location.x)*dot_products.bottom_left + (quad_location.x)*dot_products.bottom_right;
    return (1.0-quad_location.y)*bottom_interpolation + (quad_location.y)*top_interpolation;
}


export class Perlin_Noise_Machine {
    constructor( cell_count_x, cell_count_y ){
        this.cell_count = {
            x: cell_count_x,
            y: cell_count_y,
        };
        this.corner_count = {
            x: cell_count_x+1,
            y: cell_count_y+1,
        };
        
        this.initialise_data();
    }

    // ###########################################
    // ###########################################

    initialise_data(){
        this.gradients = [];

        // all columns
        for (let x_index = 0; x_index < this.corner_count.x; x_index++) {
            // prepare the current column
            let gradients_column = [];
            // fill it with all our rows
            for (let y_index = 0; y_index < this.corner_count.y; y_index++) {
                // using the vec2 so we can do some nice tricks
                gradients_column.push( vec2.fromValues( 1.0, 0.0 ) );
            }
            // add the column
            this.gradients.push(gradients_column);
        }
        
    }

    // ###########################################
    // ###########################################

    corner_gradients( quad_reference ){
        return {
            top_left:     this.gradients[quad_reference.x  ][quad_reference.y+1],
            bottom_left:  this.gradients[quad_reference.x  ][quad_reference.y  ],
            top_right:    this.gradients[quad_reference.x+1][quad_reference.y+1],
            bottom_right: this.gradients[quad_reference.x+1][quad_reference.y  ],
        };
    }

    // ###########################################
    // ###########################################

    /**
     * 
     * @param {*} point_x_mapping float version of an index over x axis
     * @param {*} point_y_mapping float version of an index over y axis
     */
    fetch_point_value( point_x_mapping, point_y_mapping ){
        // get the quad index
        let quad_reference = {
            x: Math.floor(point_x_mapping),
            y: Math.floor(point_y_mapping),
        };
        let quad_position = vec2.fromValues( point_x_mapping - quad_reference.x, point_y_mapping - quad_reference.y );
        // ...
        let corner_gradients = this.corner_gradients( quad_reference );
        // ...
        let corner_difference_vectors = get_clamped_vectors( get_corner_difference_vectors( quad_position ) );
        // ...
        let dot_products = get_dot_products( corner_gradients, corner_difference_vectors );
        // ...
        return get_interpolation_of_dots( dot_products, quad_position );
    }

    // ###########################################
    // ###########################################

    gather_noise_values_as_float_array( point_count_x, point_count_y ){
        // TODO: implement
    }

    // ###########################################
    // ###########################################

}