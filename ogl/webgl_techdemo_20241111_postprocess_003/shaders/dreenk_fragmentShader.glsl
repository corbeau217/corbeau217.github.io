precision highp float;

varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
  vec4 mapping = texture2D(uSampler, vTextureCoord);
  gl_FragColor = vec4(mapping.xyz,1);
}