
import { cross_product } from "/ogl/lib/util/geometry.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################


export function generate_normals_for_explode_vertices( vertices, noise, number_of_triangles ){
    // prepare array
    let vertex_normals = [];

    // every triangle
    for (let triangle_index = 0; triangle_index < number_of_triangles; triangle_index++) {
        // --------------------------------------------------------
        // --------------------------------------------------------
        const triangle_offset = triangle_index*3;
        // --------------------------------

        const  first_vertices_start = ((triangle_offset+0)*4);
        const second_vertices_start = ((triangle_offset+1)*4);
        const  third_vertices_start = ((triangle_offset+2)*4);

        const  first_noise_start = ((triangle_offset+0)*3);
        const second_noise_start = ((triangle_offset+1)*3);
        const  third_noise_start = ((triangle_offset+2)*3);
        
        // --------------------------------

        const first_vertex_vec3 =  { x: vertices[first_vertices_start],  y: vertices[first_vertices_start+1],  z: vertices[first_vertices_start+2]  };
        const first_noise_vec3 =  { x: noise[first_noise_start],  y: noise[first_noise_start+1],  z: noise[first_noise_start+2]  };
        const first_vec3 =  { x: first_vertex_vec3.x + first_noise_vec3.x,  y: first_vertex_vec3.y + first_noise_vec3.y,  z: first_vertex_vec3.z + first_noise_vec3.z  };

        const second_vertex_vec3 =  { x: vertices[second_vertices_start],  y: vertices[second_vertices_start+1],  z: vertices[second_vertices_start+2]  };
        const second_noise_vec3 =  { x: noise[second_noise_start],  y: noise[second_noise_start+1],  z: noise[second_noise_start+2]  };
        const second_vec3 =  { x: second_vertex_vec3.x + second_noise_vec3.x,  y: second_vertex_vec3.y + second_noise_vec3.y,  z: second_vertex_vec3.z + second_noise_vec3.z  };

        const third_vertex_vec3 =  { x: vertices[third_vertices_start],  y: vertices[third_vertices_start+1],  z: vertices[third_vertices_start+2]  };
        const third_noise_vec3 =  { x: noise[third_noise_start],  y: noise[third_noise_start+1],  z: noise[third_noise_start+2]  };
        const third_vec3 =  { x: third_vertex_vec3.x + third_noise_vec3.x,  y: third_vertex_vec3.y + third_noise_vec3.y,  z: third_vertex_vec3.z + third_noise_vec3.z  };
        
        // --------------------------------
        // --------------------------------------------------------
        // --------------------------------------------------------
        // --------------------------------
        
        // get difference vectors
        let vector_a = vec3.fromValues(
            second_vec3.x - first_vec3.x,
            second_vec3.y - first_vec3.y,
            second_vec3.z - first_vec3.z,
        );
        let vector_b = vec3.fromValues(
            third_vec3.x - second_vec3.x,
            third_vec3.y - second_vec3.y,
            third_vec3.z - second_vec3.z,
        );

        // (static) normalize(out, a) → {vec3}
        // Normalize a vec3 
        // ...
        vec3.normalize( vector_a, vector_a );
        vec3.normalize( vector_b, vector_b );
        
        // --------------------------------
        // (static) cross(out, a, b) → {vec3}
        // Computes the cross product of two vec3's 
        // ...
        let cross_vec3 = vec3.create();
        vec3.cross( cross_vec3, vector_b, vector_a );

        // (static) normalize(out, a) → {vec3}
        // Normalize a vec3 
        // ...
        vec3.normalize( cross_vec3, cross_vec3 );

        // --------------------------------
        // --------------------------------------------------------
        // --------------------------------------------------------
        // fill the normals using this


        // 3 times to do all vertices of the current face
        vertex_normals.push(cross_vec3[0]);  vertex_normals.push(cross_vec3[1]);  vertex_normals.push(cross_vec3[2]);
        vertex_normals.push(cross_vec3[0]);  vertex_normals.push(cross_vec3[1]);  vertex_normals.push(cross_vec3[2]);
        vertex_normals.push(cross_vec3[0]);  vertex_normals.push(cross_vec3[1]);  vertex_normals.push(cross_vec3[2]);
        
        // --------------------------------------------------------
        // --------------------------------------------------------
    }


    // return it
    return vertex_normals;
}

// ############################################################################################
// ############################################################################################
// ############################################################################################


function get_corner_difference_vectors( quad_pos ){
    return {
        top_left:     vec2.fromValues( quad_pos[0],     quad_pos[1]-1.0 ),
        bottom_left:  vec2.fromValues( quad_pos[0],     quad_pos[1]     ),
        top_right:    vec2.fromValues( quad_pos[0]-1.0, quad_pos[1]-1.0 ),
        bottom_right: vec2.fromValues( quad_pos[0]-1.0, quad_pos[1]     ),
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

    let top_interpolation = (1.0-quad_location[0])*dot_products.top_left + (quad_location[0])*dot_products.top_right;
    let bottom_interpolation = (1.0-quad_location[0])*dot_products.bottom_left + (quad_location[0])*dot_products.bottom_right;

    return (1.0-quad_location[1])*bottom_interpolation + (quad_location[1])*top_interpolation;
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
        this.generate_new_data();
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
        let top_left_x_index     = Math.floor(quad_reference.x  ); let top_left_y_index     = Math.floor(quad_reference.y+1);
        let bottom_left_x_index  = Math.floor(quad_reference.x  ); let bottom_left_y_index  = Math.floor(quad_reference.y  );
        let top_right_x_index    = Math.floor(quad_reference.x+1); let top_right_y_index    = Math.floor(quad_reference.y+1);
        let bottom_right_x_index = Math.floor(quad_reference.x+1); let bottom_right_y_index = Math.floor(quad_reference.y  );

        return {
            top_left:     this.gradients[ top_left_x_index     ][ top_left_y_index     ],
            bottom_left:  this.gradients[ bottom_left_x_index  ][ bottom_left_y_index  ],
            top_right:    this.gradients[ top_right_x_index    ][ top_right_y_index    ],
            bottom_right: this.gradients[ bottom_right_x_index ][ bottom_right_y_index ],
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
        // let corner_difference_vectors = get_clamped_vectors( get_corner_difference_vectors( quad_position ) );
        let corner_difference_vectors = get_corner_difference_vectors( quad_position );
        // ...
        let dot_products = get_dot_products( corner_gradients, corner_difference_vectors );
        // ...
        return get_interpolation_of_dots( dot_products, quad_position );
    }

    // ###########################################
    // ###########################################

    gather_noise_values_as_float_array( point_count_x, point_count_y ){

        let total_number_of_points = point_count_x * point_count_y;
        let quad_size = vec2.fromValues(
            this.cell_count.x/(point_count_x),
            this.cell_count.y/(point_count_y),
        );

        // the data we send back
        //  noise will just replace the y value of the vectors
        let resulting_point_values = [];

        // all columns
        for (let point_x_index = 0; point_x_index < point_count_x; point_x_index++) {
            const point_x_value = point_x_index * quad_size[0];
            // all positions in a column
            for (let point_y_index = 0; point_y_index < point_count_y; point_y_index++) {
                const point_y_value = point_y_index * quad_size[1];

                // ---- ends up with the noise value on y axis ----
                resulting_point_values.push( 0.0 );
                resulting_point_values.push( this.fetch_point_value( point_x_value, point_y_value ) );
                resulting_point_values.push( 0.0 );
                // ------------------------------------------------
            }
        }
        
        return resulting_point_values;
    }

    // ###########################################
    // ###########################################

    random_unit_vector(){
        // shouldnt be using trig but oh well
        const random_angle = Math.random() * Math.PI * 2.0;
        // generate it and give it
        return vec2.fromValues( Math.cos(random_angle), Math.sin(random_angle) );
    }

    generate_new_data(){
        for (let vertex_x_index = 0; vertex_x_index < this.gradients.length; vertex_x_index++) {
            for (let vertex_y_index = 0; vertex_y_index < this.gradients[vertex_x_index].length; vertex_y_index++) {
                this.gradients[vertex_x_index][vertex_y_index] = this.random_unit_vector();
            }
        }
    }

    // ###########################################
    // ###########################################

}
