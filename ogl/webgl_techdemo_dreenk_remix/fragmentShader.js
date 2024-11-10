const FRAGMENT_SHADER_SRC = `
precision highp float;

varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
  vec4 mapping = texture2D(uSampler, vTextureCoord);
  // vec4 mixWithGrey = mix(mapping, vec4(0.5), 0.5);
  
  // vec4 uvMapping = vec4( vTextureCoord.x, 0, vTextureCoord.y, 1 );
  // vec4 mixWithMapping = mix(mapping, uvMapping, 0.5);

  // gl_FragColor = vec4(uvMapping.xyz,1);
  // gl_FragColor = vec4(mixWithMapping.xyz,1);
  gl_FragColor = vec4(mapping.xyz,1);
}
`;

export { FRAGMENT_SHADER_SRC };