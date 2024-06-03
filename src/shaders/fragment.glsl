uniform vec2 winResolution;
uniform sampler2D uTexture;

void main() {
  vec2 uv = gl_FragCoord.xy / winResolution.xy;
  vec4 color = texture2D(uTexture, uv);

  gl_FragColor = color;
  // needs to include the following 2 fragments such that
  // the texture applied to the cylinders have matching colors to the final rendered output
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
