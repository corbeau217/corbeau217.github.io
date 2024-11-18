export const FRAGMENT_SHADER_SRC = `
precision highp float;

#define VERTEX_COUNT 36

uniform vec2 u_quad_xy_count;
uniform vec2 u_perlin_vectors[VERTEX_COUNT];

varying highp vec2 v_vertex_reference;



// suffering..
//  all because we have to index with constant values
vec2 get_perlin_vector(in ivec2 vertex_index){
  // prepare index
  int row_count = int(floor(u_quad_xy_count.y));
  int index = (vertex_index.x * row_count)+vertex_index.y;
  // do the indexing
  if(index == 0) { return u_perlin_vectors[0]; }
  else if(index == 0) { return u_perlin_vectors[0]; }
  else if(index == 1) { return u_perlin_vectors[1]; }
  else if(index == 2) { return u_perlin_vectors[2]; }
  else if(index == 3) { return u_perlin_vectors[3]; }
  else if(index == 4) { return u_perlin_vectors[4]; }
  else if(index == 5) { return u_perlin_vectors[5]; }
  else if(index == 6) { return u_perlin_vectors[6]; }
  else if(index == 7) { return u_perlin_vectors[7]; }
  else if(index == 8) { return u_perlin_vectors[8]; }
  else if(index == 9) { return u_perlin_vectors[9]; }
  // ...
  else if(index == 10) { return u_perlin_vectors[10]; }
  else if(index == 11) { return u_perlin_vectors[11]; }
  else if(index == 12) { return u_perlin_vectors[12]; }
  else if(index == 13) { return u_perlin_vectors[13]; }
  else if(index == 14) { return u_perlin_vectors[14]; }
  else if(index == 15) { return u_perlin_vectors[15]; }
  else if(index == 16) { return u_perlin_vectors[16]; }
  else if(index == 17) { return u_perlin_vectors[17]; }
  else if(index == 18) { return u_perlin_vectors[18]; }
  else if(index == 19) { return u_perlin_vectors[19]; }
  // ...
  else if(index == 20) { return u_perlin_vectors[20]; }
  else if(index == 21) { return u_perlin_vectors[21]; }
  else if(index == 22) { return u_perlin_vectors[22]; }
  else if(index == 23) { return u_perlin_vectors[23]; }
  else if(index == 24) { return u_perlin_vectors[24]; }
  else if(index == 25) { return u_perlin_vectors[25]; }
  else if(index == 26) { return u_perlin_vectors[26]; }
  else if(index == 27) { return u_perlin_vectors[27]; }
  else if(index == 28) { return u_perlin_vectors[28]; }
  else if(index == 29) { return u_perlin_vectors[29]; }
  // ...
  else if(index == 30) { return u_perlin_vectors[30]; }
  else if(index == 31) { return u_perlin_vectors[31]; }
  else if(index == 32) { return u_perlin_vectors[32]; }
  else if(index == 33) { return u_perlin_vectors[33]; }
  else if(index == 34) { return u_perlin_vectors[34]; }
  // else if(index == 35) { return u_perlin_vectors[35]; }
  // else if(index == 36) { return u_perlin_vectors[36]; }
  // else if(index == 37) { return u_perlin_vectors[37]; }
  // else if(index == 38) { return u_perlin_vectors[38]; }
  // else if(index == 39) { return u_perlin_vectors[39]; }
  // // ...
  // else if(index == 40) { return u_perlin_vectors[40]; }
  // else if(index == 41) { return u_perlin_vectors[41]; }
  // else if(index == 42) { return u_perlin_vectors[42]; }
  // else if(index == 43) { return u_perlin_vectors[43]; }
  // else if(index == 44) { return u_perlin_vectors[44]; }
  // else if(index == 45) { return u_perlin_vectors[45]; }
  // else if(index == 46) { return u_perlin_vectors[46]; }
  // else if(index == 47) { return u_perlin_vectors[47]; }
  // else if(index == 48) { return u_perlin_vectors[48]; }
  // else if(index == 49) { return u_perlin_vectors[49]; }
  // // ...
  // else if(index == 50) { return u_perlin_vectors[50]; }
  // else if(index == 51) { return u_perlin_vectors[51]; }
  // else if(index == 52) { return u_perlin_vectors[52]; }
  // else if(index == 53) { return u_perlin_vectors[53]; }
  // else if(index == 54) { return u_perlin_vectors[54]; }
  // else if(index == 55) { return u_perlin_vectors[55]; }
  // else if(index == 56) { return u_perlin_vectors[56]; }
  // else if(index == 57) { return u_perlin_vectors[57]; }
  // else if(index == 58) { return u_perlin_vectors[58]; }
  // else if(index == 59) { return u_perlin_vectors[59]; }
  // // ...
  // else if(index == 60) { return u_perlin_vectors[60]; }
  // else if(index == 61) { return u_perlin_vectors[61]; }
  // else if(index == 62) { return u_perlin_vectors[62]; }
  // else if(index == 63) { return u_perlin_vectors[63]; }
  // else if(index == 64) { return u_perlin_vectors[64]; }
  // else if(index == 65) { return u_perlin_vectors[65]; }
  // else if(index == 66) { return u_perlin_vectors[66]; }
  // else if(index == 67) { return u_perlin_vectors[67]; }
  // else if(index == 68) { return u_perlin_vectors[68]; }
  // else if(index == 69) { return u_perlin_vectors[69]; }
  // // ...
  // else if(index == 70) { return u_perlin_vectors[70]; }
  // else if(index == 71) { return u_perlin_vectors[71]; }
  // else if(index == 72) { return u_perlin_vectors[72]; }
  // else if(index == 73) { return u_perlin_vectors[73]; }
  // else if(index == 74) { return u_perlin_vectors[74]; }
  // else if(index == 75) { return u_perlin_vectors[75]; }
  // else if(index == 76) { return u_perlin_vectors[76]; }
  // else if(index == 77) { return u_perlin_vectors[77]; }
  // else if(index == 78) { return u_perlin_vectors[78]; }
  // else if(index == 79) { return u_perlin_vectors[79]; }
  // // ...
  // else if(index == 80) { return u_perlin_vectors[80]; }
  // else if(index == 81) { return u_perlin_vectors[81]; }
  // else if(index == 82) { return u_perlin_vectors[82]; }
  // else if(index == 83) { return u_perlin_vectors[83]; }
  // else if(index == 84) { return u_perlin_vectors[84]; }
  // else if(index == 85) { return u_perlin_vectors[85]; }
  // else if(index == 86) { return u_perlin_vectors[86]; }
  // else if(index == 87) { return u_perlin_vectors[87]; }
  // else if(index == 88) { return u_perlin_vectors[88]; }
  // else if(index == 89) { return u_perlin_vectors[89]; }
  // // ...
  // else if(index == 90) { return u_perlin_vectors[90]; }
  // else if(index == 91) { return u_perlin_vectors[91]; }
  // else if(index == 92) { return u_perlin_vectors[92]; }
  // else if(index == 93) { return u_perlin_vectors[93]; }
  // else if(index == 94) { return u_perlin_vectors[94]; }
  // else if(index == 95) { return u_perlin_vectors[95]; }
  // else if(index == 96) { return u_perlin_vectors[96]; }
  // else if(index == 97) { return u_perlin_vectors[97]; }
  // else if(index == 98) { return u_perlin_vectors[98]; }
  // else if(index == 99) { return u_perlin_vectors[99]; }

  // must be very last
  else { return u_perlin_vectors[VERTEX_COUNT-1]; } 
}

// smooth out our interpolation between the dot products
float fade(float t){
  return ((6.0*t - 15.0)*t + 10.0)*t*t*t;
}

// this is because we only want to normalise when the vector is too long
vec2 clamp_to_unit_length( vec2 v ){
  // float real_length = length(v);
  // length usually is sqrt(x^2+y^2)
  //   but sqrt is expensive
  float square_length = v.x*v.x + v.y*v.y;

  // 1*1 = 1,   so   length(v) <= 1.0

  if(square_length > 1.0){
    // return a normalized vector

    return normalize(v);
  }

  // otherwise just return unchanged
  return v;
}

void main() {
  // get the bottom left
  vec2 quad_xy_id = vec2( floor(v_vertex_reference.x), floor(v_vertex_reference.y) );

  // corner indexing
  ivec2 bottom_left_corner_index = ivec2( floor(v_vertex_reference.x), floor(v_vertex_reference.y) );
  ivec2 bottom_right_corner_index = ivec2( floor(v_vertex_reference.x+1.0), floor(v_vertex_reference.y) );
  ivec2 top_left_corner_index = ivec2( floor(v_vertex_reference.x), floor(v_vertex_reference.y+1.0) );
  ivec2 top_right_corner_index = ivec2( floor(v_vertex_reference.x+1.0), floor(v_vertex_reference.y+1.0) );

  // corner vectors
  vec2 bottom_left_corner_vector = normalize( get_perlin_vector( bottom_left_corner_index ) );
  vec2 bottom_right_corner_vector = normalize( get_perlin_vector( bottom_right_corner_index ) );
  vec2 top_left_corner_vector = normalize( get_perlin_vector( top_left_corner_index ) );
  vec2 top_right_corner_vector = normalize( get_perlin_vector( top_right_corner_index ) );


  // where in the quad it is
  vec2 fragment_quad_location = vec2( v_vertex_reference.x - quad_xy_id.x, v_vertex_reference.y - quad_xy_id.y );


  // positions of the corners
  vec2 bottom_left_position = vec2( quad_xy_id.x, quad_xy_id.y );
  vec2 bottom_right_position = vec2( quad_xy_id.x+1.0, quad_xy_id.y );
  vec2 top_left_position = vec2( quad_xy_id.x, quad_xy_id.y+1.0 );
  vec2 top_right_position = vec2( quad_xy_id.x+1.0, quad_xy_id.y+1.0 );

  // difference to corners
  vec2 bottom_left_to_fragment_vector = clamp_to_unit_length(v_vertex_reference - bottom_left_position);
  vec2 bottom_right_to_fragment_vector = clamp_to_unit_length(v_vertex_reference - bottom_right_position);
  vec2 top_left_to_fragment_vector = clamp_to_unit_length(v_vertex_reference - top_left_position);
  vec2 top_right_to_fragment_vector = clamp_to_unit_length(v_vertex_reference - top_right_position);

  // get the dot products
  //    probably need to clamp our vectors??
  float bottom_left_dot = dot( bottom_left_to_fragment_vector, bottom_left_corner_vector );
  float bottom_right_dot = dot( bottom_right_to_fragment_vector, bottom_right_corner_vector );
  float top_left_dot = dot( top_left_to_fragment_vector, top_left_corner_vector );
  float top_right_dot = dot( top_right_to_fragment_vector, top_right_corner_vector );

  // fades
  float x_fade = fade(fragment_quad_location.x);
  float y_fade = fade(fragment_quad_location.y);
  // interpolate top and bottom over x axis
  float bottom_dot_interpolation = mix(bottom_left_dot, bottom_right_dot, x_fade);
  float top_dot_interpolation = mix(top_left_dot, top_right_dot, x_fade);

  // interpolate the y
  float interpolated_dot = mix(bottom_dot_interpolation, top_dot_interpolation, y_fade);

  // assign something to colour channel
  //  just using bottom left to start
  gl_FragColor = vec4( interpolated_dot, interpolated_dot, interpolated_dot, 1.0);
}
`;