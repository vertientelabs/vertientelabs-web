// Shared GLSL chunks: brand palette, simplex noise, fbm and helpers.

export const HEADER = /* glsl */ `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;       // 0..1, y up
uniform float uMouseActive; // eased 0..1
uniform float uIntro;       // 0..1 over the first seconds
uniform float uScroll;      // 0..1 while the canvas scrolls out

const vec3 OBSIDIANA = vec3(14., 13., 11.) / 255.;
const vec3 GRAFITO   = vec3(43., 40., 36.) / 255.;
const vec3 NIEBLA    = vec3(138., 132., 122.) / 255.;
const vec3 CALIZA    = vec3(243., 240., 233.) / 255.;
const vec3 AMBAR     = vec3(255., 122., 31.) / 255.;
const vec3 OXIDO     = vec3(178., 74., 6.) / 255.;
const vec3 MIEL      = vec3(255., 201., 139.) / 255.;
const vec3 CORAL     = vec3(255., 180., 156.) / 255.;
const vec3 MANANTIAL = vec3(157., 232., 218.) / 255.;
const vec3 LIMA      = vec3(230., 245., 168.) / 255.;

// Simplex 2D noise — Ian McEwan, Ashima Arts (MIT)
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) { s += a * snoise(p); p = r * p * 2.03; a *= 0.5; }
  return s;
}

// Two octaves only: broad, soft liquid motion without marbled veins.
float fbmSoft(vec2 p) {
  return 0.66 * snoise(p) + 0.34 * snoise(mat2(0.8, 0.6, -0.6, 0.8) * p * 2.03);
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

float sdSeg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

// Anti-aliased iso-line for a scalar field already scaled to "one line per unit".
float isoLine(float v, float width) {
  float fw = fwidth(v);
  float d = abs(fract(v - 0.5) - 0.5);
  return 1.0 - smoothstep(0.0, fw * width, d);
}

vec3 grain(vec3 col, vec2 fc, float t, float amt) {
  return col + (hash(fc + fract(t * 7.13) * 91.7) - 0.5) * amt;
}
`;
