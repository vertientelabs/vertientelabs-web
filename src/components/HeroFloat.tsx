"use client";

import { useEffect, useRef } from "react";

/** Glass cards floating around the V; they drift with the pointer at different depths. */
export default function HeroFloat() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let tx = 0, ty = 0, x = 0, y = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    const tick = () => {
      x += (tx - x) * 0.05;
      y += (ty - y) * 0.05;
      el.style.setProperty("--px", x.toFixed(4));
      el.style.setProperty("--py", y.toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} className="hero__float" aria-hidden="true">
      <div className="float float--status glass" style={{ "--d": 18 } as React.CSSProperties}>
        <div className="float__row">
          <span className="mono-s muted">deploy · producción</span>
          <span className="status">
            <i /> activo
          </span>
        </div>
        <div className="float__big">
          99.98<small>%</small>
        </div>
        <div className="float__row">
          <span className="mono-s muted">uptime · 90 días</span>
          <span className="mono-s">v4.2.1</span>
        </div>
        <svg className="spark" viewBox="0 0 200 36" preserveAspectRatio="none">
          <path d="M0 28 L18 26 L34 27 L52 20 L70 22 L88 14 L106 17 L124 10 L142 12 L160 6 L178 8 L200 3" />
        </svg>
      </div>

      <div className="float float--code glass" style={{ "--d": 34 } as React.CSSProperties}>
        <div className="code__bar">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          <span className="mono-s muted">cauce.ts</span>
        </div>
        <pre className="code">
          <span className="c">{"// del origen al producto"}</span>
          {"\n"}
          <span className="k">const</span> proyecto = <span className="k">await</span> <span className="f">vertiente</span>({"{"}
          {"\n  "}origen: <span className="s">{"'tu idea'"}</span>,
          {"\n  "}stack: [<span className="s">{"'web'"}</span>, <span className="s">{"'mobile'"}</span>, <span className="s">{"'cloud'"}</span>],
          {"\n  "}flujo: <span className="k">true</span>,
          {"\n"}
          {"});"}
          {"\n"}proyecto.<span className="f">desplegar</span>(<span className="s">{"'producción'"}</span>);
          <span className="caret" />
        </pre>
      </div>

      <div className="float float--chip glass" style={{ "--d": 52 } as React.CSSProperties}>
        <span className="status">
          <i />
        </span>
        <span className="mono-s">build #2048 · 38s</span>
      </div>
    </div>
  );
}
