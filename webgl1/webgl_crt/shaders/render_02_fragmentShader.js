const FRAGMENT_SHADER_SRC = `
precision highp float;

varying highp vec2 v_texcoord;

uniform sampler2D u_texture;
uniform vec2 u_texture_size;
uniform vec2 u_uv_pixel_size;


void main() {

  // prepare the frag value as black
  vec4 frag_value = vec4(0,0,0,1);

  // get the pixel coordinate inside view space
  vec2 pixel_coord =  vec2( floor(u_texture_size.x * v_texcoord.x), floor(u_texture_size.y * v_texcoord.y) );

  // get the bucket uv mapping size
  // buckets are just the size of our pixelation we're doing
  vec2 bucket_uv = vec2( floor(mod(pixel_coord.x,4.0)), floor(mod(pixel_coord.y,4.0)) );


  // ================================================================
  // === do the crt effect

  // check for not the bars
  if(bucket_uv.x < 3.0 && bucket_uv.y < 3.0){
    // remove the bucket amount from the texture uv mapping
    vec2 uv_mapping = vec2(v_texcoord.x - (bucket_uv.x * u_uv_pixel_size.x), v_texcoord.y - (bucket_uv.y * u_uv_pixel_size.y));
    // get the true colour
    vec4 true_texture_colour = texture2D(u_texture, uv_mapping);
    // ------------------------
    //  when first column of a bucket
    if(bucket_uv.x < 1.0){
      // take only red channel
      frag_value = vec4( true_texture_colour.r, 0, 0, true_texture_colour.a );
    }
    // wasnt first column, might be second column
    else if(bucket_uv.x < 2.0){
      // take only green channel
      frag_value = vec4( 0, true_texture_colour.g, 0, true_texture_colour.a );
    }
    // lastly it must be the 3rd column
    else {
      // take only blue channel
      frag_value = vec4( 0, 0, true_texture_colour.b, true_texture_colour.a );
    }
    // ------------------------
  }

  // ================================================================

  // set the fragment colour
  gl_FragColor = frag_value;
}
`;

export { FRAGMENT_SHADER_SRC };