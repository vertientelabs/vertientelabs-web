import { HEADER } from "./common";

// Auras: liquid blooms of the atmosphere palette. Dark mode adds caustics —
// light refracting through water — inside the ámbar pool. Light mode keeps
// the auras in the corners over Caliza, as the manual asks.
export const auraFrag = /* glsl */ `${HEADER}

uniform float uLight;
uniform vec3  uBase;

float caustic(vec2 p, float t) {
  float c = 0.0;
  vec2 q = p * 3.2;
  for (int i = 0; i < 2; i++) {
    float fi = float(i);
    vec2 w = vec2(snoise(q * 0.55 + vec2(t * 0.3, fi * 4.0)), snoise(q * 0.55 + vec2(fi * 9.0, -t * 0.25)));
    float n = snoise(q + w * 1.25 + t * 0.15);
    c += pow(1.0 - abs(n), 8.0);
    q *= 1.8;
  }
  return c * 0.65;
}

vec4 blob(vec2 p, vec2 at, float r, vec3 c, float w) {
  vec2 d = p - at;
  float k = exp(-dot(d, d) / (r * r)) * w;
  return vec4(c * k, k);
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = (fc - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.12;

  vec2 m = (uMouse - 0.5) * vec2(asp, 1.0);

  vec2 warp = vec2(fbm(p * 1.1 + vec2(t * 0.6, 0.0)), fbm(p * 1.1 + vec2(7.0, -t * 0.5))) * 0.22;
  vec2 pw = p + warp;
  float X = 0.5 * asp;

  vec4 acc = vec4(0.0);
  vec3 col;

  if (uLight < 0.5) {
    acc += blob(pw, vec2(sin(t * 0.7) * 0.22, -0.52 + 0.05 * cos(t)), 0.55, AMBAR, 1.15);
    acc += blob(pw, vec2(-X * 0.62 + 0.1 * sin(t * 0.5), -0.25 + 0.1 * cos(t * 0.6)), 0.42, MIEL, 0.75);
    acc += blob(pw, vec2(X * 0.6 + 0.1 * cos(t * 0.4), -0.32 + 0.08 * sin(t * 0.8)), 0.4, CORAL, 0.65);
    acc += blob(pw, vec2(-X * 0.5, 0.52 + 0.05 * sin(t * 0.3)), 0.35, MANANTIAL, 0.35);
    acc += blob(pw, m, 0.22, AMBAR, 0.55 * uMouseActive);

    vec3 bc = acc.rgb / max(acc.a, 1e-3);
    float inten = 1.0 - exp(-acc.a * 1.2);
    col = OBSIDIANA + bc * inten * 0.78;

    float pool = exp(-length((p - vec2(0.0, -0.55)) * vec2(0.7, 1.2)) * 2.4);
    col += MIEL * caustic(p + warp * 0.5, uTime * 0.35) * pool * 0.2;
    col *= 1.0 - 0.35 * pow(length(uv - 0.5) * 1.3, 2.0);
    col = mix(col, OBSIDIANA, smoothstep(0.88, 1.0, uv.y));
    col = mix(col, OBSIDIANA, smoothstep(0.12, 0.0, uv.y) * 0.85);
  } else {
    acc += blob(pw, vec2(X * 0.95 + 0.06 * sin(t), -0.5 + 0.05 * cos(t * 0.7)), 0.55, MIEL, 1.0);
    acc += blob(pw, vec2(X * 0.75 + 0.05 * cos(t * 0.6), -0.62), 0.45, CORAL, 0.9);
    acc += blob(pw, vec2(-X * 1.0 + 0.05 * sin(t * 0.5), 0.45 + 0.05 * sin(t)), 0.42, LIMA, 0.75);
    acc += blob(pw, vec2(-X * 0.85, 0.6), 0.36, MANANTIAL, 0.8);
    acc += blob(pw, m, 0.18, MIEL, 0.45 * uMouseActive);

    vec3 bc = acc.rgb / max(acc.a, 1e-3);
    float inten = 1.0 - exp(-acc.a * 1.4);
    col = mix(uBase, bc, inten * 0.85);
  }

  col = grain(col, fc, uTime, uLight > 0.5 ? 0.018 : 0.032);
  fragColor = vec4(col, 1.0);
}
`;
