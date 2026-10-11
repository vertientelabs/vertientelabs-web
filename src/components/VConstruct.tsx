// Construction drawing of the V (manual §02): grid, guides, the two strokes
// drawing themselves in, and nested Vs flowing down into the vertex.
const SPACING = 36;
const CONTOURS = Array.from({ length: 18 }, (_, k) => 305 - (k - 3) * SPACING);

export default function VConstruct() {
  return (
    <svg className="vcon" viewBox="0 0 400 400" role="img" aria-label="Construcción del símbolo V">
      <defs>
        <pattern id="vg20" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#0E0D0B" strokeOpacity=".05" />
        </pattern>
        <pattern id="vg80" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M80 0H0V80" fill="none" stroke="#0E0D0B" strokeOpacity=".09" />
        </pattern>
        <radialGradient id="vfade" cx="50%" cy="58%" r="55%">
          <stop offset="0.35" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="vmask">
          <rect width="400" height="400" fill="url(#vfade)" />
        </mask>
      </defs>

      <rect width="400" height="400" fill="url(#vg20)" />
      <rect width="400" height="400" fill="url(#vg80)" />

      <g mask="url(#vmask)">
        <g className="vcon__flow">
          {CONTOURS.map((y) => (
            <path key={y} d={`M-20 ${y - 300} L200 ${y} L420 ${y - 300}`} />
          ))}
        </g>
      </g>

      <g className="vcon__guides">
        <line x1="0" y1="95" x2="400" y2="95" />
        <line x1="0" y1="263" x2="400" y2="263" />
        <line x1="0" y1="305" x2="400" y2="305" />
        <line x1="200" y1="0" x2="200" y2="400" />
        <path className="vcon__arc" d="M170.4 264.7 A50 50 0 0 1 229.6 264.7" />
      </g>

      <path className="vcon__draw vcon__outer" pathLength={1} d="M46 95 L200 305 L354 95" />
      <path className="vcon__draw vcon__inner" pathLength={1} d="M102 95 L200 263 L298 95" />

      <g className="vcon__axis">
        <path d="M46 95 L200 305 L354 95" />
        <path d="M102 95 L200 263 L298 95" />
        {[
          [46, 95],
          [354, 95],
          [102, 95],
          [298, 95],
          [200, 263],
          [200, 305],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3.2" />
        ))}
      </g>

      <g className="vcon__labels">
        <text x="14" y="86">4u</text>
        <text x="212" y="86">2.5u · 42%</text>
        <text x="140" y="268" textAnchor="end">72.5°</text>
        <text x="212" y="330">VÉRTICE</text>
        <text x="14" y="388">22 : 30</text>
      </g>
    </svg>
  );
}
