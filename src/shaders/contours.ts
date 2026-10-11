import { HEADER } from "./common";

// Topographic field: slow-moving contour lines. The cursor raises a hill
// and the lines around it light up in ámbar.
export const contoursFrag = /* glsl */ `${HEADER}

void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = (fc - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.025;

  vec2 m = (uMouse - 0.5) * vec2(asp, 1.0);
  vec2 dm = p - m;
  float mInfl = exp(-dot(dm, dm) * 9.0) * uMouseActive;

  vec2 q = vec2(fbm(p * 0.8 + vec2(t, 0.0)), fbm(p * 0.8 + vec2(3.1, -t)));
  float h = fbm(p * 1.05 + q * 0.9 + vec2(0.0, t * 1.5));
  h += mInfl * 0.28;

  float minor = isoLine(h * 11.0, 1.1);
  float major = isoLine(h * 11.0 / 5.0, 1.5);

  float tone = smoothstep(-0.5, 0.6, h);
  vec3 lineCol = mix(NIEBLA, mix(OXIDO, AMBAR, tone), tone);
  lineCol = mix(lineCol, MIEL, mInfl);

  vec3 col = OBSIDIANA;
  col += AMBAR * 0.10 * exp(-length(p - vec2(-0.45 * asp, -0.55)) * 1.8);
  col += MANANTIAL * 0.035 * exp(-length(p - vec2(0.5 * asp, 0.5)) * 2.0);
  col += lineCol * (minor * 0.085 + major * 0.2) * (1.0 + mInfl * 3.0) * uIntro;

  // Blend into neighbouring sections
  col = mix(OBSIDIANA, col, smoothstep(0.0, 0.18, uv.y) * smoothstep(1.0, 0.82, uv.y));
  col = grain(col, fc, uTime, 0.03);
  fragColor = vec4(col, 1.0);
}
`;
