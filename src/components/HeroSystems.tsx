"use client";

import { useEffect, useRef, useState } from "react";
import { FLOW } from "@/shaders/hero";

type Pos = { x: number; y: number };

/** Glass labels at the source of each data stream, plus the unified output under the vertex. */
export default function HeroSystems() {
  const ref = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{ sources: Pos[]; output: Pos } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const { width: W, height: H } = el.getBoundingClientRect();
      // Labels only on fully wide layouts, where the shader geometry is fixed.
      if (W < 1000 || W / H < FLOW.wideAspect) return setLayout(null);
      const cx = FLOW.vertex.x * (W / H);
      const cy = FLOW.vertex.y;
      const toPx = (x: number, y: number) => ({ x: W / 2 + x * H, y: H / 2 - y * H });
      const sources = FLOW.streams.map((s) => {
        const a = (s.angle * Math.PI) / 180;
        return toPx(cx + Math.sin(a) * s.length, cy + Math.cos(a) * s.length);
      });
      setLayout({ sources, output: toPx(cx, cy - FLOW.output) });
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="hero__systems" aria-hidden="true">
      {layout &&
        FLOW.streams.map((s, i) => (
          <span
            key={s.label}
            className={`sys glass ${s.angle < 0 ? "sys--left" : "sys--right"}`}
            style={{ left: layout.sources[i].x, top: layout.sources[i].y, "--i": i } as React.CSSProperties}
          >
            {s.label}
          </span>
        ))}
      {layout && (
        <span className="sys sys--out" style={{ left: layout.output.x, top: layout.output.y }}>
          <i /> Una sola plataforma
        </span>
      )}
    </div>
  );
}
