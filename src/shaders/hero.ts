import { HEADER } from "./common";

// Hero: integration. Data streams leave the systems an organisation already
// has (ERP, CRM, apps…), travel down into the V and leave the vertex as a
// single stream — "una sola plataforma". Geometry lives in FLOW so the HTML
// labels (HeroSystems) sit exactly at the end of each stream.

export type Stream = { label: string; angle: number; length: number };

export const FLOW = {
  /** Vertex position on wide screens, in hero-height units from the centre (x is multiplied by aspect). */
  vertex: { x: 0.21, y: -0.2 },
  /** Vertex position on narrow screens. */
  vertexNarrow: { x: 0, y: -0.37 },
  /** Scale of the whole figure on narrow screens. */
  narrowScale: 0.62,
  /** Angle in degrees from vertical (negative = left), length in hero-height units. */
  streams: [
    { label: "ERP", angle: -16, length: 0.42 },
    { label: "CRM", angle: -52, length: 0.38 },
    { label: "App móvil", angle: -76, length: 0.3 },
    { label: "Web", angle: 16, length: 0.42 },
    { label: "IA", angle: 52, length: 0.36 },
    { label: "Cloud", angle: 78, length: 0.26 },
  ] satisfies Stream[],
  /** Distance below the vertex where the output label sits. */
  output: 0.17,
  /** Aspect ratio from which the layout is fully "wide". */
  wideAspect: 1.45,
  introSeconds: 3.6,
};

const rad = (deg: number) => (deg * Math.PI) / 180;
const f = (n: number) => n.toFixed(5);
const DIRS = FLOW.streams.map((s) => `vec2(${f(Math.sin(rad(s.angle)))}, ${f(Math.cos(rad(s.angle)))})`).join(", ");
const LENS = FLOW.streams.map((s) => f(s.length)).join(", ");
const N = FLOW.streams.length;

export const heroFrag = /* glsl */ `${HEADER}

const int N = ${N};
const vec2 DIR[N] = vec2[N](${DIRS});
const float LEN[N] = float[N](${LENS});

// Bright head travelling towards the vertex with a short tail behind it.
float packetsIn(float s, float speed, float freq, float seed, float t) {
  float ph = s * freq + t * speed + seed;
  float keep = step(0.42, hash(vec2(floor(ph), seed)));
  return pow(1.0 - fract(ph), 4.0) * keep;
}

// Same, travelling away from the vertex.
float packetsOut(float s, float speed, float freq, float t) {
  float ph = s * freq - t * speed;
  float keep = step(0.25, hash(vec2(floor(ph), 7.7)));
  return pow(fract(ph), 4.0) * keep;
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = (fc - 0.5 * uRes) / uRes.y;
  float t = uTime;
  float px = 1.0 / uRes.y;

  float wide = smoothstep(0.95, ${f(FLOW.wideAspect)}, asp);
  float sc = mix(${f(FLOW.narrowScale)}, 1.0, wide);
  vec2 c = vec2(mix(${f(FLOW.vertexNarrow.x)}, ${f(FLOW.vertex.x)} * asp, wide), mix(${f(FLOW.vertexNarrow.y)}, ${f(FLOW.vertex.y)}, wide));
  float S = 0.0105 * sc;
  vec2 v = p - c;

  vec2 m = (uMouse - 0.5) * vec2(asp, 1.0);
  vec2 dm = p - m;
  float mInfl = exp(-dot(dm, dm) * 26.0) * uMouseActive;

  float intro = smoothstep(0.0, 1.0, uIntro);
  float flowOn = smoothstep(0.55, 1.0, uIntro);

  // Atmosphere: deep obsidiana, warm light pooling in the vertex.
  vec3 col = OBSIDIANA;
  col += MIEL * 0.05 * exp(-length(p - vec2(0.55 * asp, 0.55)) * 2.0);
  col += MANANTIAL * 0.03 * exp(-length(p - vec2(-0.55 * asp, -0.6)) * 2.2);
  col += AMBAR * 0.11 * exp(-length(v * vec2(1.0, 1.25)) * 3.0 / sc);

  // Dot matrix — the technical canvas everything runs on.
  float g = 0.026;
  vec2 cid = floor(p / g);
  vec2 cf = fract(p / g) - 0.5;
  float dotMask = 1.0 - smoothstep(0.8 * px, 1.8 * px, length(cf) * g);
  vec2 cellC = (cid + 0.5) * g - c;
  float near = exp(-length(cellC) * 2.4 / sc);
  float twinkle = 0.65 + 0.35 * sin(t * 0.5 + hash(cid) * 6.2831);
  float dotB = (0.05 + 0.12 * near) * twinkle + mInfl * 0.45;
  col += mix(NIEBLA, MIEL, clamp(near * 0.7 + mInfl, 0.0, 1.0)) * dotMask * dotB * intro;

  // Input streams
  vec3 streams = vec3(0.0);
  for (int i = 0; i < N; i++) {
    vec2 d = DIR[i];
    float L = LEN[i] * sc;
    float s = dot(v, d);
    float h = abs(v.x * d.y - v.y * d.x);
    float seg = step(0.0, s) * (1.0 - smoothstep(L - 0.004, L, s));
    float edge = L * (1.0 - intro);
    float drawn = smoothstep(edge - 0.03, edge, s);

    float hair = 1.0 - smoothstep(0.4 * px, 1.4 * px, h);
    float core = exp(-h * h / (2.2 * px * 2.2 * px));
    float halo = exp(-h * h / (0.011 * 0.011));
    float fi = float(i);
    float pk = packetsIn(s, 0.42 + 0.14 * hash(vec2(fi, 3.1)), 6.5, fi * 1.37, t);
    float hot = 1.0 + mInfl * 2.0;

    streams += mix(NIEBLA, AMBAR, 0.3) * hair * 0.32 * seg * drawn * hot;
    streams += mix(AMBAR, MIEL, pk * pk) * (core * 1.1 + halo * 0.22) * pk * seg * flowOn * hot;

    // Source node
    float dn = length(v - d * L);
    float node = 1.0 - smoothstep(2.6 * px, 3.6 * px, dn);
    float ring = (1.0 - smoothstep(0.6 * px, 1.6 * px, abs(dn - 9.0 * px))) * (0.5 + 0.5 * sin(t * 1.4 + fi));
    streams += AMBAR * (node * 0.9 + ring * 0.35) * smoothstep(0.85, 1.0, uIntro);
  }
  col += streams;

  // Output: one unified stream leaving the vertex
  float sd = -v.y;
  float hO = abs(v.x);
  float segO = step(0.0, sd) * (1.0 - smoothstep(0.18, 0.55, sd));
  float hairO = 1.0 - smoothstep(0.6 * px, 1.8 * px, hO);
  float coreO = exp(-hO * hO / (3.0 * px * 3.0 * px));
  float haloO = exp(-hO * hO / (0.016 * 0.016));
  float pkO = packetsOut(sd, 0.75, 8.0, t);
  col += MIEL * hairO * 0.35 * segO * intro;
  col += mix(AMBAR, MIEL, 0.5) * (coreO * 1.2 + haloO * 0.3) * pkO * segO * flowOn;

  // Pulse where everything meets
  col += AMBAR * 0.18 * exp(-length(v) * 16.0 / sc) * (0.65 + 0.35 * sin(t * 1.6)) * flowOn;

  // The V — one solid ink, inner stroke at 42%, drawn from the tops into the vertex.
  vec2 a1 = vec2(-22.0, 30.0) * S, a2 = vec2(22.0, 30.0) * S;
  vec2 i0 = vec2(0.0, 6.0) * S, i1 = vec2(-14.0, 30.0) * S, i2 = vec2(14.0, 30.0) * S;
  float dO = min(sdSeg(v, a1, vec2(0.0)), sdSeg(v, a2, vec2(0.0))) - 2.0 * S;
  float dI = min(sdSeg(v, i1, i0), sdSeg(v, i2, i0)) - 1.25 * S;
  float aa = 1.2 * px;
  float vIntro = smoothstep(0.05, 0.7, uIntro);
  // Offset below the vertex so the rounded join is never clipped once revealed.
  float reveal = smoothstep(-0.5 * S, 0.5 * S, v.y + 3.0 * S - (1.0 - vIntro) * 37.0 * S);
  float vO = (1.0 - smoothstep(-aa, aa, dO)) * reveal;
  float vI = (1.0 - smoothstep(-aa, aa, dI)) * reveal;
  col = mix(col, AMBAR, vI * 0.42);
  col = mix(col, AMBAR, vO);

  // Finish
  float vig = 1.0 - 0.4 * pow(length((uv - 0.5) * vec2(1.0, 1.15)) * 1.25, 2.2);
  col *= vig;
  col = mix(col, OBSIDIANA, smoothstep(0.14, 0.0, uv.y) * 0.7);
  col = grain(col, fc, t, 0.03);
  fragColor = vec4(col, 1.0);
}
`;
