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
  vec2 bucket_uv = vec2( floor(mod(pixel_coord.x,3.0)), floor(mod(pixel_coord.y,3.0)) );

  vec2 channel_uv = vec2( mod(u_texture_size.x * v_texcoord.x,1.0), mod(u_texture_size.y * v_texcoord.y,3.0) );

  // uv correction
  vec2 uv_correction = vec2(0.0, bucket_uv.y * u_uv_pixel_size.y);


  // ================================================================
  // === do the crt effect

  if(channel_uv.x < 0.3 || channel_uv.y < 0.6){
    frag_value = vec4(0.05, 0.05, 0.05, 1.0);
  }
  // check for not the bars
  else {
    // remove the bucket amount from the texture uv mapping
    vec2 channel_uv = vec2(v_texcoord.x - uv_correction.x, v_texcoord.y - uv_correction.y);
    vec2 uv_mapping_0 = vec2( channel_uv.x, channel_uv.y );
    vec2 uv_mapping_1 = vec2( channel_uv.x, channel_uv.y+u_uv_pixel_size.y );
    vec2 uv_mapping_2 = vec2( channel_uv.x, channel_uv.y+(2.0*u_uv_pixel_size.y) );
    // get the true colours
    vec4 true_texture_colour_0 = texture2D(u_texture, uv_mapping_0);
    vec4 true_texture_colour_1 = texture2D(u_texture, uv_mapping_1);
    vec4 true_texture_colour_2 = texture2D(u_texture, uv_mapping_2);
    // then average the channel
    float red_avg = ( true_texture_colour_0.r + true_texture_colour_1.r + true_texture_colour_2.r )/3.0;
    float green_avg = ( true_texture_colour_0.g + true_texture_colour_1.g + true_texture_colour_2.g )/3.0;
    float blue_avg = ( true_texture_colour_0.b + true_texture_colour_1.b + true_texture_colour_2.b )/3.0;
    vec4 true_texture_colour_avg = vec4( red_avg, green_avg, blue_avg, 1.0);
    // ------------------------
    //  when first column of a bucket
    if(bucket_uv.x < 1.0){
      // take only red channel
      frag_value = vec4( true_texture_colour_avg.r, 0, 0, true_texture_colour_avg.a );
    }
    // wasnt first column, might be second column
    else if(bucket_uv.x < 2.0){
      // take only green channel
      frag_value = vec4( 0, true_texture_colour_avg.g, 0, true_texture_colour_avg.a );
    }
    // lastly it must be the 3rd column
    else {
      // take only blue channel
      frag_value = vec4( 0, 0, true_texture_colour_avg.b, true_texture_colour_avg.a );
    }
    // ------------------------
  }

  // ================================================================

  // set the fragment colour
  gl_FragColor = frag_value;
}
`;

export { FRAGMENT_SHADER_SRC };