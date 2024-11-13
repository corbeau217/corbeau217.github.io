const FRAGMENT_SHADER_SRC = `
precision highp float;

#define VERTEX_COUNT 25

uniform vec2 u_quad_xy_count;
uniform vec2 u_perlin_vectors[25];

varying highp vec2 v_vertex_xy_id;

// suffering..
//  all because we have to index with constant values
vec2 get_perlin_vector(in ivec2 vertex_index){
  // first column
  if(vertex_index.x == 0 && vertex_index.y == 0) { return u_perlin_vectors[0]; }
  else if(vertex_index.x == 1 && vertex_index.y == 0) { return u_perlin_vectors[1]; }
  else if(vertex_index.x == 2 && vertex_index.y == 0) { return u_perlin_vectors[2]; }
  else if(vertex_index.x == 3 && vertex_index.y == 0) { return u_perlin_vectors[3]; }
  else if(vertex_index.x == 4 && vertex_index.y == 0) { return u_perlin_vectors[4]; }
  // second column
  else if(vertex_index.x == 0 && vertex_index.y == 1) { return u_perlin_vectors[5]; }
  else if(vertex_index.x == 1 && vertex_index.y == 1) { return u_perlin_vectors[6]; }
  else if(vertex_index.x == 2 && vertex_index.y == 1) { return u_perlin_vectors[7]; }
  else if(vertex_index.x == 3 && vertex_index.y == 1) { return u_perlin_vectors[8]; }
  else if(vertex_index.x == 4 && vertex_index.y == 1) { return u_perlin_vectors[9]; }
  // third column
  else if(vertex_index.x == 0 && vertex_index.y == 2) { return u_perlin_vectors[10]; }
  else if(vertex_index.x == 1 && vertex_index.y == 2) { return u_perlin_vectors[11]; }
  else if(vertex_index.x == 2 && vertex_index.y == 2) { return u_perlin_vectors[12]; }
  else if(vertex_index.x == 3 && vertex_index.y == 2) { return u_perlin_vectors[13]; }
  else if(vertex_index.x == 4 && vertex_index.y == 2) { return u_perlin_vectors[14]; }
  // fourth column
  else if(vertex_index.x == 0 && vertex_index.y == 3) { return u_perlin_vectors[15]; }
  else if(vertex_index.x == 1 && vertex_index.y == 3) { return u_perlin_vectors[16]; }
  else if(vertex_index.x == 2 && vertex_index.y == 3) { return u_perlin_vectors[17]; }
  else if(vertex_index.x == 3 && vertex_index.y == 3) { return u_perlin_vectors[18]; }
  else if(vertex_index.x == 4 && vertex_index.y == 3) { return u_perlin_vectors[19]; }
  // fifth column
  else if(vertex_index.x == 0 && vertex_index.y == 4) { return u_perlin_vectors[20]; }
  else if(vertex_index.x == 1 && vertex_index.y == 4) { return u_perlin_vectors[21]; }
  else if(vertex_index.x == 2 && vertex_index.y == 4) { return u_perlin_vectors[22]; }
  else if(vertex_index.x == 3 && vertex_index.y == 4) { return u_perlin_vectors[23]; }
  // must be very last
  else { return u_perlin_vectors[24]; } 
}

void main() {
  // get the bottom left
  vec2 quad_xy_id = vec2( floor(v_vertex_xy_id.x), floor(v_vertex_xy_id.y) );

  // oh my god??
  ivec2 bottom_left_corner_index = ivec2( floor(v_vertex_xy_id.x), floor(v_vertex_xy_id.y) );
  ivec2 bottom_right_corner_index = ivec2( floor(v_vertex_xy_id.x+1.0), floor(v_vertex_xy_id.y) );
  ivec2 top_left_corner_index = ivec2( floor(v_vertex_xy_id.x), floor(v_vertex_xy_id.y+1.0) );
  ivec2 top_right_corner_index = ivec2( floor(v_vertex_xy_id.x+1.0), floor(v_vertex_xy_id.y+1.0) );

  // get the index from 0-24
  // then get the vectors
  vec2 bottom_left_corner_vector = get_perlin_vector( bottom_left_corner_index );
  vec2 bottom_right_corner_vector = get_perlin_vector( bottom_right_corner_index );
  vec2 top_left_corner_vector = get_perlin_vector( top_left_corner_index );
  vec2 top_right_corner_vector = get_perlin_vector( top_right_corner_index );


  // where in the quad it is
  // vec2 fragment_quad_location = vec2( v_vertex_xy_id.x - quad_xy_id.x, v_vertex_xy_id.y - quad_xy_id.y );

  // assign it to the colour channel
  //   but have it from 0.0 to 1.0 instead of -1.0 to 1.0
  gl_FragColor = vec4( (bottom_left_corner_vector.x+1.0)/2.0, (bottom_left_corner_vector.y+1.0)/2.0, 0.0, 1.0);
}
`;

export { FRAGMENT_SHADER_SRC };