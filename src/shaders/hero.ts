import { HEADER } from "./common";

// Hero: the V as a valley. Nested Vs ("curvas de nivel" from the manual) flow
// down into the vertex, warped by a slow liquid field. Light falls into the
// cauce from above; the cursor bends the water.
export const heroFrag = /* glsl */ `${HEADER}

void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = (fc - 0.5 * uRes) / uRes.y;
  float t = uTime;

  // Layout: V on the right on wide screens, low and centered on narrow ones.
  float wide = smoothstep(0.95, 1.45, asp);
  vec2 c = vec2(mix(0.0, 0.24 * asp, wide), mix(-0.37, -0.2, wide));
  c.y += uScroll * 0.18;
  float S = mix(0.0066, 0.0105, wide); // manual units -> screen units

  vec2 m = (uMouse - 0.5) * vec2(asp, 1.0);
  vec2 dm = p - m;
  float mInfl = exp(-dot(dm, dm) * 16.0) * uMouseActive;

  // Liquid field (domain-warped fbm)
  float tt = t * 0.05;
  vec2 q = vec2(fbmSoft(p * 0.9 + vec2(0.0, tt)), fbmSoft(p * 0.9 + vec2(5.2, 1.3) - tt));
  vec2 r = vec2(fbmSoft(p * 1.1 + 1.2 * q + vec2(1.7, 9.2) + tt * 0.7),
                fbmSoft(p * 1.1 + 1.2 * q + vec2(8.3, 2.8) - tt * 0.5));
  float f = fbmSoft(p * 0.9 + 1.4 * r) * 0.5 + 0.5;

  // Valley field: g = const describes a V with the brand's angle (22:30).
  vec2 v = p - c;
  vec2 vw = v + q * vec2(0.035, 0.02) - dm * mInfl * 0.14;
  const float K = 30.0 / 22.0;
  float g = vw.y - abs(vw.x) * K;

  float flow = t * 0.32;
  float minor = isoLine(g * 11.0 + flow, 1.1);
  float major = isoLine(g * 11.0 / 4.0 + flow / 4.0, 1.5);

  float reach = exp(-length(v * vec2(0.6, 0.9)) * 1.45);
  float above = smoothstep(-0.25, 0.08, v.y);
  float lineMask = reach * mix(0.35, 1.0, above);

  // Line colour follows the Vertiente gradient: ámbar -> miel -> manantial.
  float hgt = clamp(g * 1.35 + 0.05, 0.0, 1.0);
  vec3 lineCol = mix(AMBAR, MIEL, smoothstep(0.0, 0.45, hgt));
  lineCol = mix(lineCol, MANANTIAL, smoothstep(0.45, 1.0, hgt));

  // Keep the copy column calm on wide screens.
  float copyCalm = mix(1.0, smoothstep(-0.55 * asp, 0.05 * asp, p.x), wide);

  vec3 col = OBSIDIANA;

  // Liquid light
  float pool = exp(-length((p - c - vec2(0.0, 0.22)) * vec2(0.8, 1.1)) * 2.2);
  col += OXIDO * pow(f, 2.2) * 0.3 * (0.25 + pool) * copyCalm;
  col += AMBAR * pow(f, 4.0) * 0.5 * pool * copyCalm;

  // Beam falling into the vertex
  float beamW = 0.05 + max(v.y, 0.0) * 0.55;
  float beam = exp(-abs(v.x) / beamW * 1.6) * smoothstep(-0.05, 0.9, v.y) * smoothstep(1.4, 0.2, v.y);
  col += mix(AMBAR, MIEL, 0.35) * beam * 0.16;
  col += AMBAR * exp(-length(v) * 6.0) * 0.22;

  // Distant atmosphere: manantial aura low-left, miel high-right
  col += MANANTIAL * 0.05 * exp(-length(p - vec2(-0.55 * asp, -0.6)) * 2.2);
  col += MIEL * 0.06 * exp(-length(p - vec2(0.5 * asp, 0.6)) * 2.0);

  // Contours
  float shimmer = 0.45 + 0.75 * f;
  float lines = (minor * 0.2 + major * 0.42) * lineMask * shimmer * (1.0 + mInfl * 2.6) * uIntro;
  col += lineCol * lines * mix(0.55, 1.0, copyCalm);

  // Cursor: a soft lens of warm light on the water
  col += MIEL * mInfl * 0.05;

  // The V — one solid ink, inner stroke at 42%. Drawn from the tops into the vertex.
  vec2 a1 = vec2(-22.0, 30.0) * S, a2 = vec2(22.0, 30.0) * S;
  vec2 i0 = vec2(0.0, 6.0) * S, i1 = vec2(-14.0, 30.0) * S, i2 = vec2(14.0, 30.0) * S;
  float dO = min(sdSeg(v, a1, vec2(0.0)), sdSeg(v, a2, vec2(0.0))) - 2.0 * S;
  float dI = min(sdSeg(v, i1, i0), sdSeg(v, i2, i0)) - 1.25 * S;
  float aa = 1.2 / uRes.y;
  float intro = smoothstep(0.15, 1.0, uIntro);
  // Offset below the vertex so the rounded join is never clipped once revealed.
  float reveal = smoothstep(-0.5 * S, 0.5 * S, v.y + 3.0 * S - (1.0 - intro) * 37.0 * S);
  float vO = (1.0 - smoothstep(-aa, aa, dO)) * reveal;
  float vI = (1.0 - smoothstep(-aa, aa, dI)) * reveal;
  col = mix(col, AMBAR, vI * 0.42);
  col = mix(col, AMBAR, vO);

  // Finish
  float vig = 1.0 - 0.42 * pow(length((uv - 0.5) * vec2(1.0, 1.15)) * 1.25, 2.2);
  col *= vig;
  col = mix(col, OBSIDIANA, smoothstep(0.18, 0.0, uv.y) * 0.75);
  col = grain(col, fc, t, 0.035);
  fragColor = vec4(col, 1.0);
}
`;
